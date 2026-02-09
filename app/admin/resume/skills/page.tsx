"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, RefreshCw, Code } from 'lucide-react';
import ProtectedRoute from '../../../../components/admin/ProtectedRoute';

interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
  order_index: number;
}

function AdminSkillsPage() {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SkillCategory>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resume_skills')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSkillCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching skills:', error);
      showMessage('error', 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const maxOrder = Math.max(...skillCategories.map(s => s.order_index), 0);
      const { error } = await supabase
        .from('resume_skills')
        .insert([{
          category: editForm.category || '',
          skills: editForm.skills || [],
          order_index: maxOrder + 1
        }]);

      if (error) throw error;
      showMessage('success', 'Skill category added successfully!');
      setShowAddForm(false);
      setEditForm({});
      fetchSkills();
    } catch (error: any) {
      console.error('Error adding skill category:', error);
      showMessage('error', 'Failed to add skill category');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resume_skills')
        .update({
          category: editForm.category,
          skills: editForm.skills,
        })
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Skill category updated successfully!');
      setEditingId(null);
      setEditForm({});
      fetchSkills();
    } catch (error: any) {
      console.error('Error updating skill category:', error);
      showMessage('error', 'Failed to update skill category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill category?')) return;

    try {
      const { error } = await supabase
        .from('resume_skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Skill category deleted successfully!');
      fetchSkills();
    } catch (error: any) {
      console.error('Error deleting skill category:', error);
      showMessage('error', 'Failed to delete skill category');
    }
  };

  const startEdit = (skill: SkillCategory) => {
    setEditingId(skill.id);
    setEditForm(skill);
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
              <Code className="text-[#2ecc71]" />
              Skills & Expertise
            </h1>
            <p className="text-slate-400">Manage your professional skills by category ({skillCategories.length} categories)</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditForm({ skills: [] });
            }}
            className="px-6 py-3 bg-[#2ecc71] text-slate-900 font-bold rounded-xl flex items-center gap-2 hover:bg-[#27ae60] transition-colors"
          >
            <Plus size={18} />
            Add Category
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
            <h3 className="text-xl font-bold text-white mb-4">Add New Skill Category</h3>
            <SkillForm
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

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map((skillCat) => (
            <div
              key={skillCat.id}
              className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
            >
              {editingId === skillCat.id ? (
                <div className="p-6">
                  <SkillForm
                    data={editForm}
                    onChange={setEditForm}
                    onSave={() => handleUpdate(skillCat.id)}
                    onCancel={cancelEdit}
                  />
                </div>
              ) : (
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      {skillCat.category}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(skillCat)}
                        className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(skillCat.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillCat.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-500">
                    {skillCat.skills.length} skills
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {skillCategories.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No skill categories found. Add your first one!
          </div>
        )}
      </div>
    </div>
  );
}

function SkillForm({
  data,
  onChange,
  onSave,
  onCancel
}: {
  data: Partial<SkillCategory>;
  onChange: (data: Partial<SkillCategory>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [skillsText, setSkillsText] = useState((data.skills || []).join('\n'));

  const handleSave = () => {
    const skills = skillsText.split('\n').filter(line => line.trim());
    onChange({ ...data, skills });
    setTimeout(() => onSave(), 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Category Name</label>
        <input
          type="text"
          value={data.category || ''}
          onChange={(e) => onChange({ ...data, category: e.target.value })}
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
          placeholder="e.g., Modern Web Stack"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Skills (one per line)
        </label>
        <textarea
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] min-h-[150px]"
          placeholder="Enter skills, one per line&#10;Next.js&#10;React&#10;TypeScript&#10;Node.js"
        />
        <p className="text-xs text-slate-500 mt-2">
          Each line will become a skill badge. Total: {skillsText.split('\n').filter(l => l.trim()).length} skills
        </p>
      </div>

      {/* Preview */}
      {skillsText.trim() && (
        <div className="p-4 bg-slate-800/30 rounded-xl border border-[#2ecc71]/20">
          <p className="text-xs text-slate-500 mb-3">Preview:</p>
          <div className="flex flex-wrap gap-2">
            {skillsText.split('\n').filter(s => s.trim()).map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2ecc71]/20 text-[#2ecc71] border border-[#2ecc71]/30"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

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

export default function AdminSkillsPageWrapped() {
  return (
    <ProtectedRoute>
      <AdminSkillsPage />
    </ProtectedRoute>
  );
}
