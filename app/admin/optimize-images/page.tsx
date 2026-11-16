"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, Download, ExternalLink, HardDrive, Loader2,
  RefreshCw, Square, Trash2, Undo2, Zap,
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';
import { isRasterImage, pathWithSize, shrinkImage } from '../../../lib/image-optimize';

/*
 * Optimize Images
 * ---------------
 * Finds oversized photos/screenshots in the "images" bucket that the site
 * uses, makes a small WebP copy of each (in this browser), points every
 * database reference at the copy and keeps the original. Originals are only
 * removed when the admin asks for it, and only once nothing uses them.
 */

const BUCKET = 'images';
const MARK = `/storage/v1/object/public/${BUCKET}/`;

/** Tables the site reads images from. Visitor, lead and contact tables are never read or changed. */
const TABLES = [
  'portfolio_items', 'portfolio_gallery', 'skill_gallery', 'sub_skills', 'skill_categories',
  'services', 'skills', 'experiences', 'reviews', 'video_reviews', 'blogs', 'homepage_content',
  'media_assets', 'media_library', 'site_settings', 'site_branding', 'footer_links', 'navigation_items',
  'resume_experiences', 'resume_education', 'resume_certifications', 'resume_skills',
  'resume_settings', 'resume_stats',
];

const TABLE_LABELS: Record<string, string> = {
  portfolio_items: 'Portfolio items',
  portfolio_gallery: 'Project galleries',
  skill_gallery: 'Skill galleries',
  sub_skills: 'Skill pages',
  skill_categories: 'Skill categories',
  services: 'Services',
  reviews: 'Reviews',
  video_reviews: 'Video reviews',
  blogs: 'Blog',
  homepage_content: 'Homepage',
  media_assets: 'Media library',
  experiences: 'Experience',
};

/** Files the site's code loads by their exact name, so they are never renamed. */
const CODE_REFERENCED = new Set(['profile.jpg']);

/** Files made by this tool or the uploader carry their size in the name and are as small as they get. */
const ALREADY_OPTIMIZED = /-\d{2,5}x\d{2,5}\.webp$/i;

const LOG_KEY = 'np-image-optimizer-log-v1';
const DELETE_AFTER_MS = 5 * 60 * 1000;
const MEDIA_KEYS = ['file_path', 'public_url', 'file_url', 'file_name', 'file_size', 'mime_type', 'width', 'height'];

const THRESHOLDS = [
  { label: 'over 300 KB', bytes: 300 * 1024 },
  { label: 'over 500 KB', bytes: 500 * 1024 },
  { label: 'over 1 MB', bytes: 1024 * 1024 },
  { label: 'over 3 MB', bytes: 3 * 1024 * 1024 },
];

type Row = Record<string, unknown>;
type StoredFile = { path: string; size: number; type: string };
type Hit = { table: string; id: string | number; columns: string[] };
type DbIndex = { byPath: Map<string, Hit[]>; blocked: Map<string, string[]>; missingTables: string[] };
type RowStatus = { state: 'working' | 'done' | 'skipped' | 'error'; message?: string; newSize?: number };
type LogEntry = {
  oldPath: string;
  newPath: string;
  oldSize: number;
  newSize: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  at: number;
  hits: Hit[];
  media: Row[];
  state: 'active' | 'undone' | 'original-deleted' | 'copy-deleted';
  undoneAt?: number;
};

// ---------------------------------------------------------------- helpers

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`;

const publicUrl = (path: string) => supabase!.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/** Every storage path mentioned in a value (plain text, HTML, arrays, JSON). */
function collectPaths(value: unknown, into: Set<string>) {
  if (typeof value === 'string') {
    let at = value.indexOf(MARK);
    while (at !== -1) {
      const m = value.slice(at + MARK.length).match(/^[^"'\s?#)<>\\]+/);
      if (m) into.add(safeDecode(m[0]));
      at = value.indexOf(MARK, at + MARK.length);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectPaths(v, into));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => collectPaths(v, into));
  }
}

/** Swap one storage path for another everywhere inside a value. */
function replacePath(value: unknown, from: string, to: string): unknown {
  if (typeof value === 'string') {
    let out = value;
    for (const variant of new Set([from, encodeURI(from)])) {
      out = out.replace(new RegExp(`${escapeRe(MARK + variant)}(?=$|[^A-Za-z0-9._~%/-])`, 'g'), MARK + to);
    }
    return out;
  }
  if (Array.isArray(value)) return value.map((v) => replacePath(v, from, to));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replacePath(v, from, to)]));
  }
  return value;
}

const pick = (row: Row, keys: string[]) =>
  Object.fromEntries(keys.filter((k) => k in row).map((k) => [k, row[k]]));

async function listFiles(prefix = ''): Promise<StoredFile[]> {
  const out: StoredFile[] = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase!.storage
      .from(BUCKET)
      .list(prefix, { limit: 1000, offset, sortBy: { column: 'name', order: 'asc' } });
    if (error) throw new Error(`Storage: ${error.message}`);
    for (const item of data ?? []) {
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      if (!item.id) {
        out.push(...(await listFiles(path))); // a folder
        continue;
      }
      if (item.name === '.emptyFolderPlaceholder') continue;
      const meta = (item.metadata ?? {}) as { size?: number; mimetype?: string };
      out.push({ path, size: meta.size ?? 0, type: meta.mimetype ?? '' });
    }
    if (!data || data.length < 1000) return out;
  }
}

async function readTable(table: string): Promise<Row[] | null> {
  const rows: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase!.from(table).select('*').range(from, from + 999);
    if (error) return from === 0 ? null : rows;
    rows.push(...((data ?? []) as Row[]));
    if (!data || data.length < 1000) return rows;
  }
}

/** Where every storage file is used in the database. */
async function buildIndex(): Promise<DbIndex> {
  const byPath = new Map<string, Hit[]>();
  const blocked = new Map<string, string[]>();
  const missingTables: string[] = [];
  const tables = await Promise.all(TABLES.map(async (t) => [t, await readTable(t)] as const));
  for (const [table, rows] of tables) {
    if (!rows) {
      missingTables.push(table);
      continue;
    }
    for (const row of rows) {
      const perPath = new Map<string, string[]>();
      for (const [column, value] of Object.entries(row)) {
        const found = new Set<string>();
        collectPaths(value, found);
        if (table === 'media_assets' && column === 'file_path' && typeof value === 'string' && value) found.add(value);
        found.forEach((p) => perPath.set(p, [...(perPath.get(p) ?? []), column]));
      }
      perPath.forEach((columns, path) => {
        const id = row.id as string | number | null | undefined;
        if (id === null || id === undefined) {
          blocked.set(path, [...(blocked.get(path) ?? []), table]);
          return;
        }
        byPath.set(path, [...(byPath.get(path) ?? []), { table, id, columns }]);
      });
    }
  }
  return { byPath, blocked, missingTables };
}

async function patchRow(table: string, id: string | number, patch: Row) {
  const { data, error } = await supabase!.from(table).update(patch).eq('id', id).select('id');
  if (error) throw new Error(`${table}: ${error.message}`);
  if (!data || data.length === 0) throw new Error(`${table}: the database did not accept the change`);
}

/** Point every listed row from one file to another. */
async function repoint(hits: Hit[], from: string, to: string, mediaPatch: (row: Row) => Row) {
  for (const hit of hits) {
    const { data, error } = await supabase!.from(hit.table).select('*').eq('id', hit.id).maybeSingle();
    if (error) throw new Error(`${hit.table}: ${error.message}`);
    if (!data) continue; // deleted in the meantime
    const row = data as Row;
    const patch: Row = {};
    for (const column of hit.columns) {
      const next = replacePath(row[column], from, to);
      if (JSON.stringify(next) !== JSON.stringify(row[column])) patch[column] = next;
    }
    if (hit.table === 'media_assets' && row.file_path === from) {
      const extra = mediaPatch(row);
      Object.keys(extra).forEach((k) => {
        if (k in row) patch[k] = extra[k];
      });
    }
    if (Object.keys(patch).length) await patchRow(hit.table, hit.id, patch);
  }
}

async function optimizeFile(file: StoredFile, hits: Hit[]): Promise<LogEntry | null> {
  const response = await fetch(publicUrl(file.path), { cache: 'no-store' });
  if (!response.ok) throw new Error(`could not download it (HTTP ${response.status})`);
  const original = await response.blob();

  const result = await shrinkImage(original, file.path);
  if (!result.changed) return null;
  const newPath = pathWithSize(file.path, result.width, result.height);
  if (newPath === file.path) return null;

  const upload = await supabase!.storage
    .from(BUCKET)
    .upload(newPath, result.blob, { cacheControl: '31536000', contentType: 'image/webp', upsert: true });
  if (upload.error) throw new Error(`upload failed: ${upload.error.message}`);

  // Make sure the copy is really there before anything points at it.
  const check = await fetch(publicUrl(newPath), { cache: 'no-store' });
  if (!check.ok) throw new Error(`the new copy is not reachable (HTTP ${check.status})`);
  if ((await check.blob()).size !== result.blob.size) throw new Error('the new copy did not upload completely');

  const media: Row[] = [];
  await repoint(hits, file.path, newPath, (row) => {
    media.push({ id: row.id, ...pick(row, MEDIA_KEYS) });
    const url = publicUrl(newPath);
    return {
      file_path: newPath,
      public_url: url,
      file_url: url,
      file_name: newPath.split('/').pop(),
      file_size: result.blob.size,
      mime_type: 'image/webp',
      width: result.width,
      height: result.height,
    };
  });

  return {
    oldPath: file.path,
    newPath,
    oldSize: original.size,
    newSize: result.blob.size,
    width: result.width,
    height: result.height,
    originalWidth: result.originalWidth,
    originalHeight: result.originalHeight,
    at: Date.now(),
    hits,
    media,
    state: 'active',
  };
}

function loadLog(): LogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as LogEntry[]) : [];
  } catch {
    return [];
  }
}

function saveLog(entries: LogEntry[]) {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(entries));
  } catch {
    /* storage full or blocked: the on-screen history still works for this visit */
  }
}

const usedIn = (hits: Hit[]) => {
  const counts = new Map<string, number>();
  hits.forEach((h) => counts.set(h.table, (counts.get(h.table) ?? 0) + 1));
  return [...counts].map(([t, n]) => `${TABLE_LABELS[t] ?? t}${n > 1 ? ` ×${n}` : ''}`);
};

// ---------------------------------------------------------------- page

export default function OptimizeImagesPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [index, setIndex] = useState<DbIndex | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(THRESHOLDS[1].bytes);
  const [status, setStatus] = useState<Record<string, RowStatus>>({});
  const [busy, setBusy] = useState<null | 'optimize' | 'undo' | 'delete'>(null);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'warn'; text: string } | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const stopRef = useRef(false);

  useEffect(() => setLog(loadLog()), []);

  const updateLog = useCallback((change: (prev: LogEntry[]) => LogEntry[]) => {
    setLog((prev) => {
      const next = change(prev);
      saveLog(next);
      return next;
    });
  }, []);

  const scan = useCallback(async () => {
    if (!supabase) {
      setScanError('Supabase is not configured.');
      return;
    }
    setScanning(true);
    setScanError(null);
    try {
      const [stored, idx] = await Promise.all([listFiles(), buildIndex()]);
      setFiles(stored);
      setIndex(idx);
    } catch (error) {
      setScanError(error instanceof Error ? error.message : String(error));
    }
    setScanning(false);
  }, []);

  useEffect(() => {
    scan();
  }, [scan]);

  useEffect(() => {
    if (!busy) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [busy]);

  const big = useMemo(
    () =>
      files
        .filter((f) => f.size > threshold && isRasterImage(f.type, f.path) && !ALREADY_OPTIMIZED.test(f.path))
        .sort((a, b) => b.size - a.size),
    [files, threshold],
  );
  const candidates = useMemo(
    () => big.filter((f) => !CODE_REFERENCED.has(f.path) && index?.byPath.has(f.path) && !index?.blocked.has(f.path)),
    [big, index],
  );
  const leftAlone = useMemo(() => big.filter((f) => !candidates.includes(f)), [big, candidates]);

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const candidateBytes = candidates.reduce((sum, f) => sum + f.size, 0);
  const kept = log.filter((e) => e.state === 'active' || e.state === 'original-deleted');
  const saved = kept.reduce((sum, e) => sum + (e.oldSize - e.newSize), 0);
  const deletable = log.filter((e) => e.state === 'active');
  const keptOriginals = new Set(deletable.map((e) => e.oldPath));
  const now = Date.now();
  const originalsReady = deletable.filter((e) => now - e.at >= DELETE_AFTER_MS);
  const copiesReady = log.filter((e) => e.state === 'undone' && now - (e.undoneAt ?? e.at) >= DELETE_AFTER_MS);
  const cleanupCount = originalsReady.length + copiesReady.length;

  async function optimize(list: StoredFile[]) {
    if (!index || busy) return;
    setBusy('optimize');
    setNotice(null);
    stopRef.current = false;
    let done = 0;
    let failed = 0;
    for (const file of list) {
      if (stopRef.current) break;
      setStatus((s) => ({ ...s, [file.path]: { state: 'working' } }));
      try {
        const entry = await optimizeFile(file, index.byPath.get(file.path) ?? []);
        if (!entry) {
          setStatus((s) => ({ ...s, [file.path]: { state: 'skipped', message: 'Already as small as it gets' } }));
        } else {
          done += 1;
          updateLog((prev) => [entry, ...prev]);
          setStatus((s) => ({ ...s, [file.path]: { state: 'done', newSize: entry.newSize } }));
        }
      } catch (error) {
        failed += 1;
        const message = error instanceof Error ? error.message : String(error);
        setStatus((s) => ({ ...s, [file.path]: { state: 'error', message } }));
      }
    }
    setBusy(null);
    setNotice(
      failed
        ? { tone: 'warn', text: `${done} optimized, ${failed} failed. Failed files were left exactly as they were.` }
        : { tone: 'ok', text: `${done} image${done === 1 ? '' : 's'} optimized. The site now uses the small copies; originals are kept.` },
    );
    await scan();
  }

  async function undo(entry: LogEntry) {
    if (busy) return;
    setBusy('undo');
    setNotice(null);
    try {
      const idx = await buildIndex();
      await repoint(idx.byPath.get(entry.newPath) ?? [], entry.newPath, entry.oldPath, (row) => {
        const before = entry.media.find((m) => m.id === row.id);
        return before ? pick(before, MEDIA_KEYS) : {};
      });
      // The copy stays for now: a cached page may still show it for a minute. "Delete old files" removes it later.
      updateLog((prev) =>
        prev.map((e) => (e.at === entry.at && e.oldPath === entry.oldPath ? { ...e, state: 'undone', undoneAt: Date.now() } : e)),
      );
      setStatus((s) => {
        const next = { ...s };
        delete next[entry.oldPath];
        return next;
      });
      setNotice({ tone: 'ok', text: 'Restored: the site uses the original file again.' });
    } catch (error) {
      setNotice({ tone: 'warn', text: `Undo failed: ${error instanceof Error ? error.message : String(error)}` });
    }
    setBusy(null);
    await scan();
  }

  async function deleteOldFiles() {
    if (busy || !cleanupCount) return;
    const bytes = originalsReady.reduce((sum, e) => sum + e.oldSize, 0) + copiesReady.reduce((sum, e) => sum + e.newSize, 0);
    const parts = [
      originalsReady.length ? `${originalsReady.length} original${originalsReady.length === 1 ? '' : 's'} of optimized images` : '',
      copiesReady.length ? `${copiesReady.length} unused cop${copiesReady.length === 1 ? 'y' : 'ies'} from undone changes` : '',
    ].filter(Boolean);
    const ok = window.confirm(
      `Permanently delete ${parts.join(' and ')} (${formatSize(bytes)})?\n\n` +
        'Only files that nothing on the site uses any more are deleted. Undo is no longer possible for those originals.',
    );
    if (!ok) return;
    setBusy('delete');
    setNotice(null);
    try {
      const idx = await buildIndex();
      const unused = (path: string) => !idx.byPath.has(path) && !idx.blocked.has(path);
      const originals = originalsReady.filter((e) => unused(e.oldPath));
      const copies = copiesReady.filter((e) => unused(e.newPath));
      const paths = [...originals.map((e) => e.oldPath), ...copies.map((e) => e.newPath)];
      if (paths.length) {
        const { error } = await supabase!.storage.from(BUCKET).remove(paths);
        if (error) throw new Error(error.message);
        const goneOriginals = new Set(originals.map((e) => `${e.at}|${e.oldPath}`));
        const goneCopies = new Set(copies.map((e) => `${e.at}|${e.oldPath}`));
        updateLog((prev) =>
          prev.map((e) => {
            const key = `${e.at}|${e.oldPath}`;
            if (goneOriginals.has(key)) return { ...e, state: 'original-deleted' };
            if (goneCopies.has(key)) return { ...e, state: 'copy-deleted' };
            return e;
          }),
        );
      }
      const freed = originals.reduce((s, e) => s + e.oldSize, 0) + copies.reduce((s, e) => s + e.newSize, 0);
      const stillUsed = cleanupCount - paths.length;
      setNotice({
        tone: stillUsed ? 'warn' : 'ok',
        text:
          `${paths.length} old file${paths.length === 1 ? '' : 's'} deleted (${formatSize(freed)} freed).` +
          (stillUsed ? ` ${stillUsed} kept because something still uses them.` : ''),
      });
    } catch (error) {
      setNotice({ tone: 'warn', text: `Delete failed: ${error instanceof Error ? error.message : String(error)}` });
    }
    setBusy(null);
    await scan();
  }

  function downloadLog() {
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `image-optimizer-log-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  const card = 'rounded-2xl border border-white/10 bg-white/[0.03] p-5';
  const button =
    'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <Zap className="text-[#2ecc71]" size={28} />
            <h1 className="text-3xl font-black tracking-tight">Optimize Images</h1>
          </div>
          <p className="max-w-3xl text-slate-400">
            Makes small WebP copies of oversized photos and screenshots, points the site at the copies and keeps every
            original until you delete it. New uploads are shrunk automatically, so this is only needed for older files.
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className={card}>
            <div className="mb-1 flex items-center gap-2 text-sm text-slate-400"><HardDrive size={16} /> Images bucket</div>
            <div className="text-2xl font-black">{index ? formatSize(totalBytes) : '…'}</div>
            <div className="text-sm text-slate-500">{files.length} files</div>
          </div>
          <div className={card}>
            <div className="mb-1 flex items-center gap-2 text-sm text-slate-400"><AlertTriangle size={16} /> Oversized and used on the site</div>
            <div className="text-2xl font-black">{index ? formatSize(candidateBytes) : '…'}</div>
            <div className="text-sm text-slate-500">{candidates.length} files</div>
          </div>
          <div className={card}>
            <div className="mb-1 flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 size={16} /> Saved so far</div>
            <div className="text-2xl font-black text-[#2ecc71]">{formatSize(Math.max(0, saved))}</div>
            <div className="text-sm text-slate-500">{kept.length} files optimized</div>
          </div>
        </div>

        {notice && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              notice.tone === 'ok' ? 'border-[#2ecc71]/40 bg-[#2ecc71]/10 text-[#9ff0c0]' : 'border-amber-400/40 bg-amber-400/10 text-amber-200'
            }`}
          >
            {notice.text}
          </div>
        )}
        {scanError && (
          <div className="mb-6 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            Could not read storage or the database: {scanError}
          </div>
        )}

        <div className={`${card} mb-8`}>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="mr-auto text-lg font-bold">Oversized images</h2>
            <select
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              disabled={!!busy}
              className="rounded-xl border border-white/10 bg-[#0b0f1a] px-3 py-2.5 text-sm"
            >
              {THRESHOLDS.map((t) => (
                <option key={t.bytes} value={t.bytes}>{t.label}</option>
              ))}
            </select>
            <button onClick={scan} disabled={scanning || !!busy} className={`${button} border border-white/10 hover:bg-white/5`}>
              <RefreshCw size={16} className={scanning ? 'animate-spin' : ''} /> Rescan
            </button>
            {busy === 'optimize' ? (
              <button onClick={() => (stopRef.current = true)} className={`${button} bg-amber-400 text-slate-950`}>
                <Square size={16} /> Stop after this file
              </button>
            ) : (
              <button
                onClick={() => optimize(candidates)}
                disabled={!candidates.length || scanning || !!busy}
                className={`${button} bg-[#2ecc71] text-slate-950 hover:scale-105 active:scale-95`}
              >
                <Zap size={16} /> Optimize all ({candidates.length})
              </button>
            )}
          </div>

          {scanning && !index ? (
            <div className="flex items-center gap-3 py-10 text-slate-400"><Loader2 className="animate-spin" size={20} /> Reading storage and database…</div>
          ) : candidates.length === 0 ? (
            <p className="py-6 text-slate-400">No oversized images in use. Everything the site shows is already a sensible size.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-400">
                  <tr className="border-b border-white/10">
                    <th className="py-2 pr-4 font-semibold">File</th>
                    <th className="py-2 pr-4 font-semibold">Size</th>
                    <th className="py-2 pr-4 font-semibold">Used in</th>
                    <th className="py-2 pr-4 font-semibold">Status</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((file) => {
                    const st = status[file.path];
                    return (
                      <tr key={file.path} className="border-b border-white/5 align-top">
                        <td className="max-w-[280px] py-3 pr-4">
                          <a href={publicUrl(file.path)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-all hover:text-[#2ecc71]">
                            {file.path} <ExternalLink size={12} className="shrink-0" />
                          </a>
                        </td>
                        <td className="whitespace-nowrap py-3 pr-4 font-semibold">{formatSize(file.size)}</td>
                        <td className="py-3 pr-4 text-slate-300">{usedIn(index?.byPath.get(file.path) ?? []).join(' · ')}</td>
                        <td className="py-3 pr-4">
                          {!st && <span className="text-slate-500">Waiting</span>}
                          {st?.state === 'working' && <span className="inline-flex items-center gap-2 text-sky-300"><Loader2 size={14} className="animate-spin" /> Working…</span>}
                          {st?.state === 'done' && <span className="text-[#2ecc71]">Done → {formatSize(st.newSize ?? 0)}</span>}
                          {st?.state === 'skipped' && <span className="text-slate-400">{st.message}</span>}
                          {st?.state === 'error' && <span className="text-red-300">Failed: {st.message}</span>}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => optimize([file])}
                            disabled={!!busy || st?.state === 'done'}
                            className={`${button} border border-white/10 px-3 py-1.5 hover:bg-white/5`}
                          >
                            Optimize
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {leftAlone.length > 0 && (
            <details className="mt-5 text-sm text-slate-400">
              <summary className="cursor-pointer">
                {leftAlone.length} large file{leftAlone.length === 1 ? '' : 's'} left alone ({formatSize(leftAlone.reduce((s, f) => s + f.size, 0))})
              </summary>
              <p className="mt-2">
                Originals of optimized files, plus files no page uses, files the code loads by name, or files in a row that
                cannot be updated safely. Nothing here is changed.
              </p>
              <ul className="mt-2 space-y-1">
                {leftAlone.map((f) => (
                  <li key={f.path} className="break-all">
                    {f.path} · {formatSize(f.size)}
                    {keptOriginals.has(f.path)
                      ? ' · original kept for Undo (see History)'
                      : index?.blocked.has(f.path)
                        ? ' · row without id'
                        : CODE_REFERENCED.has(f.path)
                          ? ' · used in code'
                          : ' · not used in the database'}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {index && index.missingTables.length > 0 && (
            <p className="mt-4 text-xs text-slate-500">Tables not found (fine if unused): {index.missingTables.join(', ')}</p>
          )}
        </div>

        <div className={card}>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="mr-auto text-lg font-bold">History</h2>
            <button onClick={downloadLog} disabled={!log.length} className={`${button} border border-white/10 hover:bg-white/5`}>
              <Download size={16} /> Download log
            </button>
            <button
              onClick={deleteOldFiles}
              disabled={!!busy || !cleanupCount}
              className={`${button} border border-red-400/40 text-red-200 hover:bg-red-400/10`}
            >
              {busy === 'delete' ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Delete old files ({cleanupCount})
            </button>
          </div>
          <p className="mb-4 text-sm text-slate-400">
            Originals stay in storage until you delete them, so every change can be undone. Check the site first; deleting
            becomes available 5 minutes after a change, once cached pages have refreshed.
            {deletable.length > originalsReady.length && ` ${deletable.length - originalsReady.length} waiting for that.`}
          </p>
          {log.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing optimized from this browser yet.</p>
          ) : (
            <ul className="divide-y divide-white/5 text-sm">
              {log.map((entry) => (
                <li key={`${entry.at}|${entry.oldPath}`} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="mr-auto min-w-0">
                    <div className="break-all">{entry.oldPath}</div>
                    <div className="text-slate-400">
                      {formatSize(entry.oldSize)} → <span className="text-[#2ecc71]">{formatSize(entry.newSize)}</span>
                      {' · '}{entry.originalWidth}×{entry.originalHeight} → {entry.width}×{entry.height}
                      {' · '}{new Date(entry.at).toLocaleString()}
                    </div>
                  </div>
                  {entry.state === 'active' && (
                    <>
                      <a href={publicUrl(entry.newPath)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-300 hover:text-[#2ecc71]">
                        View copy <ExternalLink size={12} />
                      </a>
                      <button onClick={() => undo(entry)} disabled={!!busy} className={`${button} border border-white/10 px-3 py-1.5 hover:bg-white/5`}>
                        <Undo2 size={14} /> Undo
                      </button>
                    </>
                  )}
                  {(entry.state === 'undone' || entry.state === 'copy-deleted') && <span className="text-slate-500">Undone</span>}
                  {entry.state === 'original-deleted' && <span className="text-slate-500">Original deleted</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
