"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, RefreshCw, Briefcase } from 'lucide-react';
import ProtectedRoute from '../../../../components/admin/ProtectedRoute';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string[];
  type: 'full-time' | 'part-time' | 'project';
  order_index: number;
}

function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Experience>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'full-time' | 'part-time' | 'project'>('all');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resume_experiences')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error: any) {
      console.error('Error fetching experiences:', error);
      showMessage('error', 'Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const maxOrder = Math.max(...experiences.map(e => e.order_index), 0);
      const { error } = await supabase
        .from('resume_experiences')
        .insert([{
          company: editForm.company || '',
          position: editForm.position || '',
          location: editForm.location || '',
          start_date: editForm.start_date || '',
          end_date: editForm.end_date || '',
          description: editForm.description || [],
          type: editForm.type || 'full-time',
          order_index: maxOrder + 1
        }]);

      if (error) throw error;
      showMessage('success', 'Experience added successfully!');
      setShowAddForm(false);
      setEditForm({});
      fetchExperiences();
    } catch (error: any) {
      console.error('Error adding experience:', error);
      showMessage('error', 'Failed to add experience');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resume_experiences')
        .update({
          company: editForm.company,
          position: editForm.position,
          location: editForm.location,
          start_date: editForm.start_date,
          end_date: editForm.end_date,
          description: editForm.description,
          type: editForm.type,
        })
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Experience updated successfully!');
      setEditingId(null);
      setEditForm({});
      fetchExperiences();
    } catch (error: any) {
      console.error('Error updating experience:', error);
      showMessage('error', 'Failed to update experience');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const { error } = await supabase
        .from('resume_experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Experience deleted successfully!');
      fetchExperiences();
    } catch (error: any) {
      console.error('Error deleting experience:', error);
      showMessage('error', 'Failed to delete experience');
    }
  };

  const startEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setEditForm(exp);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const filteredExperiences = filterType === 'all'
    ? experiences
    : experiences.filter(e => e.type === filterType);

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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
              <Briefcase className="text-[#2ecc71]" />
              Work Experiences
            </h1>
            <p className="text-slate-400">Manage your work history ({experiences.length} total)</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditForm({ type: 'full-time', description: [] });
            }}
            className="px-6 py-3 bg-[#2ecc71] text-slate-900 font-bold rounded-xl flex items-center gap-2 hover:bg-[#27ae60] transition-colors"
          >
            <Plus size={18} />
            Add Experience
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

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { key: 'all', label: 'All', count: experiences.length },
            { key: 'full-time', label: 'Full-Time', count: experiences.filter(e => e.type === 'full-time').length },
            { key: 'part-time', label: 'Part-Time', count: experiences.filter(e => e.type === 'part-time').length },
            { key: 'project', label: 'Project-Based', count: experiences.filter(e => e.type === 'project').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key as any)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                filterType === tab.key
                  ? 'bg-[#2ecc71] text-slate-900'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                filterType === tab.key ? 'bg-slate-900/20' : 'bg-white/10'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 p-6 bg-slate-900/60 border border-[#2ecc71]/30 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Add New Experience</h3>
            <ExperienceForm
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

        {/* Experiences List */}
        <div className="space-y-4">
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
            >
              {editingId === exp.id ? (
                <div className="p-6">
                  <ExperienceForm
                    data={editForm}
                    onChange={setEditForm}
                    onSave={() => handleUpdate(exp.id)}
                    onCancel={cancelEdit}
                  />
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          exp.type === 'full-time' ? 'bg-[#2ecc71]/20 text-[#2ecc71]' :
                          exp.type === 'part-time' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {exp.type}
                        </span>
                      </div>
                      <p className="text-[#2ecc71] font-semibold text-sm mb-1">{exp.company}</p>
                      <p className="text-slate-500 text-sm mb-2">{exp.location}</p>
                      <p className="text-slate-400 text-xs mb-3">{exp.start_date} - {exp.end_date}</p>
                      <ul className="space-y-1">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                            <span className="text-[#2ecc71] mt-1">•</span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(exp)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
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

        {filteredExperiences.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No experiences found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}

function ExperienceForm({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: Partial<Experience>;
  onChange: (data: Partial<Experience>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [descriptionText, setDescriptionText] = useState((data.description || []).join('\n'));

  const handleSave = () => {
    const descriptions = descriptionText.split('\n').filter(line => line.trim());
    onChange({ ...data, description: descriptions });
    setTimeout(() => onSave(), 0);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Position/Role</label>
          <input
            type="text"
            value={data.position || ''}
            onChange={(e) => onChange({ ...data, position: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
            placeholder="e.g., Senior Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Company</label>
          <input
            type="text"
            value={data.company || ''}
            onChange={(e) => onChange({ ...data, company: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
            placeholder="e.g., Tech Company Inc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
            placeholder="e.g., Remote, New York, USA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
          <select
            value={data.type || 'full-time'}
            onChange={(e) => onChange({ ...data, type: e.target.value as any })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
          >
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="project">Project-Based</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
          <input
            type="text"
            value={data.start_date || ''}
            onChange={(e) => onChange({ ...data, start_date: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
            placeholder="e.g., January 2020"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
          <input
            type="text"
            value={data.end_date || ''}
            onChange={(e) => onChange({ ...data, end_date: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
            placeholder="e.g., Present or December 2023"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Job Description (one point per line)
        </label>
        <textarea
          value={descriptionText}
          onChange={(e) => setDescriptionText(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] min-h-[150px]"
          placeholder="Enter job responsibilities, one per line&#10;• Managed team of 5 developers&#10;• Implemented new features&#10;• Improved performance by 40%"
        />
        <p className="text-xs text-slate-500 mt-2">Each line will become a bullet point</p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
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

export default function AdminExperiencesPageWrapped() {
  return (
    <ProtectedRoute>
      <AdminExperiencesPage />
    </ProtectedRoute>
  );
}
