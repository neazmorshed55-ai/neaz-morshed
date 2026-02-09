"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, RefreshCw, Award } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  expiry?: string;
  credential_url?: string;
  order_index: number;
}

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Certification>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resume_certifications')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error: any) {
      console.error('Error fetching certifications:', error);
      showMessage('error', 'Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const maxOrder = Math.max(...certifications.map(c => c.order_index), 0);
      const { error } = await supabase
        .from('resume_certifications')
        .insert([{
          title: editForm.title || '',
          issuer: editForm.issuer || '',
          date: editForm.date || '',
          expiry: editForm.expiry || null,
          credential_url: editForm.credential_url || null,
          order_index: maxOrder + 1
        }]);

      if (error) throw error;
      showMessage('success', 'Certification added successfully!');
      setShowAddForm(false);
      setEditForm({});
      fetchCertifications();
    } catch (error: any) {
      console.error('Error adding certification:', error);
      showMessage('error', 'Failed to add certification');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resume_certifications')
        .update({
          title: editForm.title,
          issuer: editForm.issuer,
          date: editForm.date,
          expiry: editForm.expiry || null,
          credential_url: editForm.credential_url || null,
        })
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Certification updated successfully!');
      setEditingId(null);
      setEditForm({});
      fetchCertifications();
    } catch (error: any) {
      console.error('Error updating certification:', error);
      showMessage('error', 'Failed to update certification');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    try {
      const { error } = await supabase
        .from('resume_certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Certification deleted successfully!');
      fetchCertifications();
    } catch (error: any) {
      console.error('Error deleting certification:', error);
      showMessage('error', 'Failed to delete certification');
    }
  };

  const startEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setEditForm(cert);
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
              <Award className="text-[#2ecc71]" />
              Certifications
            </h1>
            <p className="text-slate-400">Manage your professional certifications ({certifications.length} total)</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditForm({});
            }}
            className="px-6 py-3 bg-[#2ecc71] text-slate-900 font-bold rounded-xl flex items-center gap-2 hover:bg-[#27ae60] transition-colors"
          >
            <Plus size={18} />
            Add Certification
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
            <h3 className="text-xl font-bold text-white mb-4">Add New Certification</h3>
            <CertificationForm
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

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
            >
              {editingId === cert.id ? (
                <div className="p-6">
                  <CertificationForm
                    data={editForm}
                    onChange={setEditForm}
                    onSave={() => handleUpdate(cert.id)}
                    onCancel={cancelEdit}
                  />
                </div>
              ) : (
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-[#2ecc71]/10 rounded-lg text-[#2ecc71]">
                      <Award size={18} />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(cert)}
                        className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{cert.title}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-3">{cert.issuer}</p>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Issued: {cert.date}</p>
                    {cert.expiry && <p className="text-yellow-500">Expires: {cert.expiry}</p>}
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2ecc71] hover:underline block truncate"
                      >
                        View Credential
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {certifications.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No certifications found. Add your first one!
          </div>
        )}
      </div>
    </div>
  );
}

function CertificationForm({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: Partial<Certification>;
  onChange: (data: Partial<Certification>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Certification Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
          placeholder="e.g., AWS Certified Solutions Architect"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Issuing Organization</label>
        <input
          type="text"
          value={data.issuer || ''}
          onChange={(e) => onChange({ ...data, issuer: e.target.value })}
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
          placeholder="e.g., Amazon Web Services"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Issue Date</label>
          <input
            type="text"
            value={data.date || ''}
            onChange={(e) => onChange({ ...data, date: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
            placeholder="e.g., January 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date (Optional)</label>
          <input
            type="text"
            value={data.expiry || ''}
            onChange={(e) => onChange({ ...data, expiry: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
            placeholder="e.g., January 2027"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Credential URL (Optional)</label>
        <input
          type="url"
          value={data.credential_url || ''}
          onChange={(e) => onChange({ ...data, credential_url: e.target.value })}
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
          placeholder="https://www.credential.net/..."
        />
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
