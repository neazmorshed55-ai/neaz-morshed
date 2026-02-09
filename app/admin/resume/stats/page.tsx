"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Save, RefreshCw, TrendingUp } from 'lucide-react';

interface Stat {
  id: string;
  label: string;
  value: string;
  icon: string;
  order_index: number;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resume_stats')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setStats(data || []);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      showMessage('error', 'Failed to load achievement stats');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update each stat
      for (const stat of stats) {
        const { error } = await supabase
          .from('resume_stats')
          .update({
            label: stat.label,
            value: stat.value,
            icon: stat.icon
          })
          .eq('id', stat.id);

        if (error) throw error;
      }

      showMessage('success', 'Achievement stats saved successfully!');
    } catch (error: any) {
      console.error('Error saving stats:', error);
      showMessage('error', 'Failed to save achievement stats');
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (id: string, field: keyof Stat, value: string) => {
    setStats(stats.map(stat =>
      stat.id === id ? { ...stat, [field]: value } : stat
    ));
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
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <TrendingUp className="text-[#2ecc71]" />
            Achievement Stats
          </h1>
          <p className="text-slate-400">Update your professional achievement statistics</p>
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

        {/* Stats Form */}
        <div className="bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 space-y-6">
            {stats.map((stat, index) => (
              <div key={stat.id} className="p-5 bg-slate-800/30 rounded-xl border border-white/10">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
                      placeholder="e.g., Job Success"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
                      placeholder="e.g., 100%"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
                    <select
                      value={stat.icon}
                      onChange={(e) => updateStat(stat.id, 'icon', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71]"
                    >
                      <option value="Zap">⚡ Zap</option>
                      <option value="Sparkles">✨ Sparkles</option>
                      <option value="Globe">🌐 Globe</option>
                      <option value="Briefcase">💼 Briefcase</option>
                      <option value="Award">🏆 Award</option>
                      <option value="Star">⭐ Star</option>
                      <option value="TrendingUp">📈 Trending Up</option>
                      <option value="Users">👥 Users</option>
                      <option value="Clock">⏱️ Clock</option>
                      <option value="Target">🎯 Target</option>
                    </select>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-4 p-4 bg-slate-900/60 rounded-lg border border-[#2ecc71]/20">
                  <p className="text-xs text-slate-500 mb-2">Preview:</p>
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#2ecc71] mb-1">{stat.value}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="p-6 bg-slate-800/30 border-t border-white/10">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto px-8 py-3 bg-[#2ecc71] hover:bg-[#27ae60] text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save All Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-sm text-blue-400">
            <strong>💡 Tip:</strong> These statistics appear at the top of your resume page.
            Keep them concise and impactful!
          </p>
        </div>
      </div>
    </div>
  );
}
