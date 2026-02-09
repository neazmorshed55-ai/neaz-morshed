"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, RefreshCw, GraduationCap } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  location: string;
  order_index: number;
}

export default function AdminEducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Education>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resume_education')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setEducation(data || []);
    } catch (error: any) {
      console.error('Error fetching education:', error);
      showMessage('error', 'Failed to load education');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const maxOrder = Math.max(...education.map(e => e.order_index), 0);
      const { error } = await supabase
        .from('resume_education')
        .insert([{
          institution: editForm.institution || '',
          degree: editForm.degree || '',
          field: editForm.field || '',
          start_date: editForm.start_date || '',
          end_date: editForm.end_date || '',
          location: editForm.location || '',
          order_index: maxOrder + 1
        }]);

      if (error) throw error;
      showMessage('success', 'Education added successfully!');
      setShowAddForm(false);
      setEditForm({});
      fetchEducation();
    } catch (error: any) {
      console.error('Error adding education:', error);
      showMessage('error', 'Failed to add education');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resume_education')
        .update({
          institution: editForm.institution,
          degree: editForm.degree,
          field: editForm.field,
          start_date: editForm.start_date,
          end_date: editForm.end_date,
          location: editForm.location,
        })
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Education updated successfully!');
      setEditingId(null);
      setEditForm({});
      fetchEducation();
    } catch (error: any) {
      console.error('Error updating education:', error);
      showMessage('error', 'Failed to update education');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;

    try {
      const { error } = await supabase
        .from('resume_education')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Education deleted successfully!');
      fetchEducation();
    } catch (error: any) {
      console.error('Error deleting education:', error);
      showMessage('error', 'Failed to delete education');
    }
  };

  const startEdit = (edu: Education) => {
    setEditingId(edu.id);
    setEditForm(edu);
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
              <GraduationCap className="text-[#2ecc71]" />
              Education
            </h1>
            <p className="text-slate-400">Manage your educational background ({education.length} entries)</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditForm({});
            }}
            className="px-6 py-3 bg-[#2ecc71] text-slate-900 font-bold rounded-xl flex items-center gap-2 hover:bg-[#27ae60] transition-colors"
          >
            <Plus size={18} />
            Add Education
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
            <h3 className="text-xl font-bold text-white mb-4">Add New Education</h3>
            <EducationForm
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

        {/* Education List */}
        <div className="grid md:grid-cols-2 gap-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
            >
              {editingId === edu.id ? (
                <div className="p-6">
                  <EducationForm
                    data={editForm}
                    onChange={setEditForm}
                    onSave={() => handleUpdate(edu.id)}
                    onCancel={cancelEdit}
                  />
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-[#2ecc71] font-semibold text-sm mb-2">{edu.institution}</p>
                      <p className="text-slate-500 text-sm mb-1">{edu.location}</p>
                      <p className="text-slate-400 text-xs">{edu.start_date} - {edu.end_date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(edu)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {education.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No education entries found. Add your first one!
          </div>
        )}
      </div>
    </div>
  );
}

function EducationForm({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: Partial<Education>;
  onChange: (data: Partial<Education>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Institution</label>
        <input
          type="text"
          value={data.institution || ''}
          onChange={(e) => onChange({ ...data, institution: e.target.value })}
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
          placeholder="e.g., Harvard University"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Degree</label>
          <input
            type="text"
            value={data.degree || ''}
            onChange={(e) => onChange({ ...data, degree: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
            placeholder="e.g., Bachelor's, Master's, PhD"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Field of Study</label>
          <input
            type="text"
            value={data.field || ''}
            onChange={(e) => onChange({ ...data, field: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
            placeholder="e.g., Computer Science"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
        <input
          type="text"
          value={data.location || ''}
          onChange={(e) => onChange({ ...data, location: e.target.value })}
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
          placeholder="e.g., Cambridge, MA"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
          <input
            type="text"
            value={data.start_date || ''}
            onChange={(e) => onChange({ ...data, start_date: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
            placeholder="e.g., September 2015"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
          <input
            type="text"
            value={data.end_date || ''}
            onChange={(e) => onChange({ ...data, end_date: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
            placeholder="e.g., June 2019"
          />
        </div>
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
