"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, RefreshCw, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';

interface FooterLink {
  id: string;
  name: string;
  url: string;
  order_index: number;
  is_active: boolean;
}

function AdminFooterPage() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FooterLink>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      console.error('Error fetching footer links:', error);
      showMessage('error', 'Failed to load footer links');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const maxOrder = Math.max(...links.map(l => l.order_index), 0);
      const { error } = await supabase
        .from('footer_links')
        .insert([{
          name: editForm.name || '',
          url: editForm.url || '',
          order_index: maxOrder + 1,
          is_active: editForm.is_active !== undefined ? editForm.is_active : true
        }]);

      if (error) throw error;
      showMessage('success', 'Footer link added successfully!');
      setShowAddForm(false);
      setEditForm({});
      fetchLinks();
    } catch (error: any) {
      console.error('Error adding footer link:', error);
      showMessage('error', 'Failed to add footer link');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('footer_links')
        .update({
          name: editForm.name,
          url: editForm.url,
          is_active: editForm.is_active
        })
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Footer link updated successfully!');
      setEditingId(null);
      setEditForm({});
      fetchLinks();
    } catch (error: any) {
      console.error('Error updating footer link:', error);
      showMessage('error', 'Failed to update footer link');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this footer link?')) return;

    try {
      const { error } = await supabase
        .from('footer_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Footer link deleted successfully!');
      fetchLinks();
    } catch (error: any) {
      console.error('Error deleting footer link:', error);
      showMessage('error', 'Failed to delete footer link');
    }
  };

  const toggleActive = async (link: FooterLink) => {
    try {
      const { error } = await supabase
        .from('footer_links')
        .update({ is_active: !link.is_active })
        .eq('id', link.id);

      if (error) throw error;
      showMessage('success', `Footer link ${!link.is_active ? 'activated' : 'deactivated'}`);
      fetchLinks();
    } catch (error: any) {
      console.error('Error toggling footer link:', error);
      showMessage('error', 'Failed to toggle footer link');
    }
  };

  const startEdit = (link: FooterLink) => {
    setEditingId(link.id);
    setEditForm(link);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-[#2ecc71]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
              <LinkIcon className="text-[#2ecc71]" />
              Footer Links
            </h1>
            <p className="text-slate-400">Manage footer links across all pages ({links.length} total)</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditForm({ is_active: true });
            }}
            className="px-6 py-3 bg-[#2ecc71] text-slate-900 font-bold rounded-xl flex items-center gap-2 hover:bg-[#27ae60] transition-colors"
          >
            <Plus size={18} />
            Add Link
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 p-6 bg-slate-900/60 border border-[#2ecc71]/30 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Add New Footer Link</h3>
            <LinkForm
              data={editForm}
              onChange={setEditForm}
              onSave={handleAdd}
              onCancel={() => {
                setShowAddForm(false);
                setEditForm({});
              }}
            />
          </div>
        )}

        {/* Links List */}
        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className={`bg-slate-900/60 border rounded-2xl overflow-hidden transition-all ${
                link.is_active ? 'border-white/10 hover:border-white/20' : 'border-slate-700/30 opacity-60'
              }`}
            >
              {editingId === link.id ? (
                <div className="p-6">
                  <LinkForm
                    data={editForm}
                    onChange={setEditForm}
                    onSave={() => handleUpdate(link.id)}
                    onCancel={cancelEdit}
                  />
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{link.name}</h3>
                        {link.is_active ? (
                          <span className="px-3 py-1 bg-[#2ecc71]/20 text-[#2ecc71] text-xs font-bold rounded-full flex items-center gap-1">
                            <Eye size={12} />
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-700/20 text-slate-500 text-xs font-bold rounded-full flex items-center gap-1">
                            <EyeOff size={12} />
                            Inactive
                          </span>
                        )}
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2ecc71] hover:underline text-sm break-all"
                      >
                        {link.url}
                      </a>
                      <p className="text-slate-500 text-xs mt-2">Order: {link.order_index}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(link)}
                        className={`p-2 rounded-lg transition-colors ${
                          link.is_active
                            ? 'text-yellow-400 hover:bg-yellow-500/10'
                            : 'text-green-400 hover:bg-green-500/10'
                        }`}
                        title={link.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {link.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => startEdit(link)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {links.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No footer links found. Add your first one!
          </div>
        )}
      </div>
    </div>
  );
}

function LinkForm({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: Partial<FooterLink>;
  onChange: (data: Partial<FooterLink>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Link Name</label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
          placeholder="e.g., Blog, LinkedIn, Facebook"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">URL</label>
        <input
          type="url"
          value={data.url || ''}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
          placeholder="https://example.com"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          checked={data.is_active !== undefined ? data.is_active : true}
          onChange={(e) => onChange({ ...data, is_active: e.target.checked })}
          className="w-5 h-5 rounded border-white/10 bg-slate-800/50 text-[#2ecc71] focus:ring-[#2ecc71] focus:ring-offset-0"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-slate-300">
          Active (show on website)
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-[#2ecc71] text-slate-900 font-bold rounded-xl flex items-center gap-2 hover:bg-[#27ae60]"
        >
          <Save size={18} />
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-slate-700"
        >
          <X size={18} />
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminFooterPageWrapped() {
  return (
    <ProtectedRoute>
      <AdminFooterPage />
    </ProtectedRoute>
  );
}
