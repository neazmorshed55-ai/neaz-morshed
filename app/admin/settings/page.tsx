"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Save, Loader2, Palette, Type, RefreshCw,
  Check, Eye, FileText, Download
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { supabase } from '../../../lib/supabase';

interface SiteSettings {
  id?: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  heading_font: string;
  border_radius: string;
  resume_pdf_link?: string;
  updated_at?: string;
}

const defaultSettings: SiteSettings = {
  primary_color: '#2ecc71',
  secondary_color: '#3498db',
  background_color: '#0b0f1a',
  text_color: '#ffffff',
  font_family: 'Inter',
  heading_font: 'Inter',
  border_radius: '1rem'
};

const colorPresets = [
  { name: 'Default Green', primary: '#2ecc71', secondary: '#3498db' },
  { name: 'Ocean Blue', primary: '#3498db', secondary: '#2ecc71' },
  { name: 'Sunset Orange', primary: '#e74c3c', secondary: '#f39c12' },
  { name: 'Purple Dreams', primary: '#9b59b6', secondary: '#e91e63' },
  { name: 'Gold Rush', primary: '#f39c12', secondary: '#e74c3c' },
  { name: 'Teal Fresh', primary: '#1abc9c', secondary: '#16a085' },
];

const fontOptions = [
  { value: 'Inter', label: 'Inter (Modern)' },
  { value: 'Poppins', label: 'Poppins (Friendly)' },
  { value: 'Roboto', label: 'Roboto (Clean)' },
  { value: 'Open Sans', label: 'Open Sans (Professional)' },
  { value: 'Montserrat', label: 'Montserrat (Bold)' },
  { value: 'Playfair Display', label: 'Playfair (Elegant)' },
  { value: 'Space Grotesk', label: 'Space Grotesk (Techy)' },
];

const radiusOptions = [
  { value: '0', label: 'None (Sharp)' },
  { value: '0.5rem', label: 'Small' },
  { value: '1rem', label: 'Medium (Default)' },
  { value: '1.5rem', label: 'Large' },
  { value: '2rem', label: 'Extra Large' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    if (!supabase) {
      // Try to load from localStorage
      const stored = localStorage.getItem('site_settings');
      if (stored) {
        try {
          setSettings(JSON.parse(stored));
        } catch {
          setSettings(defaultSettings);
        }
      }
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
    setLoading(false);
  }

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    // Save to localStorage as fallback
    localStorage.setItem('site_settings', JSON.stringify(settings));

    if (!supabase) {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      return;
    }

    try {
      if (settings.id) {
        const { error } = await supabase
          .from('site_settings')
          .update({
            primary_color: settings.primary_color,
            secondary_color: settings.secondary_color,
            background_color: settings.background_color,
            text_color: settings.text_color,
            font_family: settings.font_family,
            heading_font: settings.heading_font,
            border_radius: settings.border_radius,
            resume_pdf_link: settings.resume_pdf_link || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({
            primary_color: settings.primary_color,
            secondary_color: settings.secondary_color,
            background_color: settings.background_color,
            text_color: settings.text_color,
            font_family: settings.font_family,
            heading_font: settings.heading_font,
            border_radius: settings.border_radius,
            resume_pdf_link: settings.resume_pdf_link || null
          });

        if (error) throw error;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Changes saved locally.');
    }

    setSaving(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  const applyPreset = (preset: { primary: string; secondary: string }) => {
    setSettings({
      ...settings,
      primary_color: preset.primary,
      secondary_color: preset.secondary
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin" className="text-slate-500 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Settings</h1>
            </div>
            <p className="text-slate-400">Customize your portfolio's appearance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-3 border border-white/10 text-slate-400 rounded-xl font-medium hover:bg-white/5 transition-all"
            >
              <RefreshCw size={18} />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : saved ? (
                <>
                  <Check size={18} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Color Presets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 border border-white/5 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Palette className="text-[#2ecc71]" size={24} />
                <h2 className="text-xl font-bold text-white">Color Presets</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className={`p-4 rounded-xl border transition-all ${
                      settings.primary_color === preset.primary
                        ? 'border-white/30 bg-white/5'
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <p className="text-sm text-slate-400">{preset.name}</p>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Custom Colors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/60 border border-white/5 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Custom Colors</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Primary Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                      className="w-12 h-12 rounded-xl border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primary_color}
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                      className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Secondary Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                      className="w-12 h-12 rounded-xl border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.secondary_color}
                      onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                      className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Background Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={settings.background_color}
                      onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                      className="w-12 h-12 rounded-xl border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.background_color}
                      onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                      className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Text Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={settings.text_color}
                      onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                      className="w-12 h-12 rounded-xl border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.text_color}
                      onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                      className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/60 border border-white/5 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Type className="text-[#2ecc71]" size={24} />
                <h2 className="text-xl font-bold text-white">Typography</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Body Font
                  </label>
                  <select
                    value={settings.font_family}
                    onChange={(e) => setSettings({ ...settings, font_family: e.target.value })}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                  >
                    {fontOptions.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Heading Font
                  </label>
                  <select
                    value={settings.heading_font}
                    onChange={(e) => setSettings({ ...settings, heading_font: e.target.value })}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                  >
                    {fontOptions.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Border Radius */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/60 border border-white/5 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Border Radius</h2>
              <div className="flex flex-wrap gap-3">
                {radiusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({ ...settings, border_radius: option.value })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      settings.border_radius === option.value
                        ? 'bg-[#2ecc71] text-slate-950'
                        : 'bg-slate-800/50 text-slate-400 hover:text-white'
                    }`}
                    style={{ borderRadius: option.value }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Resume PDF Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/60 border border-white/5 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <FileText className="text-[#2ecc71]" size={24} />
                <h2 className="text-xl font-bold text-white">Resume PDF Link</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    PDF Download Link
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={settings.resume_pdf_link || ''}
                      onChange={(e) => setSettings({ ...settings, resume_pdf_link: e.target.value })}
                      placeholder="https://drive.google.com/file/d/your-file-id/view"
                      className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2ecc71]/50"
                    />
                    {settings.resume_pdf_link && (
                      <a
                        href={settings.resume_pdf_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-[#2ecc71]/10 border border-[#2ecc71]/30 rounded-xl text-[#2ecc71] font-bold hover:bg-[#2ecc71]/20 transition-all"
                      >
                        <Eye size={18} />
                        Preview
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    💡 Tip: Upload your PDF to Google Drive, get shareable link, or use any direct PDF URL
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 sticky top-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Eye className="text-[#2ecc71]" size={24} />
                <h2 className="text-xl font-bold text-white">Preview</h2>
              </div>

              {/* Preview Box */}
              <div
                className="rounded-2xl p-6 space-y-4"
                style={{
                  backgroundColor: settings.background_color,
                  borderRadius: settings.border_radius,
                  fontFamily: settings.font_family
                }}
              >
                <h3
                  className="text-2xl font-bold"
                  style={{
                    color: settings.text_color,
                    fontFamily: settings.heading_font
                  }}
                >
                  Preview Heading
                </h3>
                <p style={{ color: settings.text_color, opacity: 0.7 }}>
                  This is how your text will look with the current settings.
                </p>
                <button
                  className="px-6 py-3 font-bold text-sm"
                  style={{
                    backgroundColor: settings.primary_color,
                    color: settings.background_color,
                    borderRadius: settings.border_radius
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-6 py-3 font-bold text-sm ml-2"
                  style={{
                    backgroundColor: settings.secondary_color,
                    color: settings.background_color,
                    borderRadius: settings.border_radius
                  }}
                >
                  Secondary
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <p className="text-yellow-500 text-sm">
                  <strong>Note:</strong> Theme changes are saved locally. To apply them to the live website, you'll need to update the CSS variables in the codebase.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
