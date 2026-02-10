"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { User, Mail, Phone, MapPin, Globe, FileDown, Save, RefreshCw } from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';

interface ResumeSettings {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  upwork_url: string;
  fiverr_url: string;
  portfolio_url: string;
  pdf_download_url: string;
}

function AdminResumePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ResumeSettings | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resume_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      if (data) {
        setSettings(data);
      }
    } catch (error: any) {
      console.error('Error fetching resume settings:', error);
      showMessage('error', 'Failed to load resume settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('resume_settings')
        .update({
          name: settings.name,
          title: settings.title,
          email: settings.email,
          phone: settings.phone,
          location: settings.location,
          linkedin_url: settings.linkedin_url,
          upwork_url: settings.upwork_url,
          fiverr_url: settings.fiverr_url,
          portfolio_url: settings.portfolio_url,
          pdf_download_url: settings.pdf_download_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;
      showMessage('success', 'Resume settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving resume settings:', error);
      showMessage('error', 'Failed to save resume settings');
    } finally {
      setSaving(false);
    }
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

  if (!settings) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400">No resume settings found. Please run the SQL migration first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Resume Settings</h1>
          <p className="text-slate-400">Manage your personal information and resume details</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <User size={20} className="text-[#2ecc71]" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] transition-colors"
                    placeholder="Your Full Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Professional Title</label>
                  <input
                    type="text"
                    value={settings.title}
                    onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] transition-colors"
                    placeholder="Digital Asset Builder | AI Implementation Engineer"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Mail size={20} className="text-[#2ecc71]" />
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] transition-colors"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] transition-colors"
                    placeholder="+1234567890"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={settings.location}
                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] transition-colors"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>

            {/* Professional Links Section */}
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe size={20} className="text-[#2ecc71]" />
                Professional Links
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn URL</label>
                  <input
                    type="text"
                    value={settings.linkedin_url}
                    onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] transition-colors"
                    placeholder="linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Upwork URL</label>
                  <input
                    type="url"
                    value={settings.upwork_url}
                    onChange={(e) => setSettings({ ...settings, upwork_url: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] transition-colors"
                    placeholder="https://www.upwork.com/freelancers/~..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Fiverr URL</label>
                  <input
                    type="url"
                    value={settings.fiverr_url}
                    onChange={(e) => setSettings({ ...settings, fiverr_url: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] transition-colors"
                    placeholder="https://www.fiverr.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Portfolio URL</label>
                  <input
                    type="text"
                    value={settings.portfolio_url}
                    onChange={(e) => setSettings({ ...settings, portfolio_url: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] transition-colors"
                    placeholder="yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* PDF Download Section */}
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileDown size={20} className="text-[#2ecc71]" />
                Resume PDF
              </h2>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">PDF Download URL</label>
                <input
                  type="url"
                  value={settings.pdf_download_url}
                  onChange={(e) => setSettings({ ...settings, pdf_download_url: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2ecc71] transition-colors"
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-xs text-slate-500 mt-2">
                  Upload your PDF to Google Drive and paste the download link here
                </p>
              </div>
            </div>
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Additional Management Links */}
        <div className="mt-8 space-y-4">
          {/* First Row - 3 Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/resume/experiences"
              className="p-6 bg-slate-900/60 border border-white/10 rounded-xl hover:border-[#2ecc71]/30 transition-all text-center group"
            >
              <div className="text-2xl font-black text-white mb-2 group-hover:text-[#2ecc71] transition-colors">
                Experiences
              </div>
              <p className="text-sm text-slate-400">Manage work history</p>
            </a>

            <a
              href="/admin/resume/education"
              className="p-6 bg-slate-900/60 border border-white/10 rounded-xl hover:border-[#2ecc71]/30 transition-all text-center group"
            >
              <div className="text-2xl font-black text-white mb-2 group-hover:text-[#2ecc71] transition-colors">
                Education
              </div>
              <p className="text-sm text-slate-400">Manage education history</p>
            </a>

            <a
              href="/admin/resume/certifications"
              className="p-6 bg-slate-900/60 border border-white/10 rounded-xl hover:border-[#2ecc71]/30 transition-all text-center group"
            >
              <div className="text-2xl font-black text-white mb-2 group-hover:text-[#2ecc71] transition-colors">
                Certifications
              </div>
              <p className="text-sm text-slate-400">Manage certifications</p>
            </a>
          </div>

          {/* Second Row - 2 Cards (Centered) */}
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <a
              href="/admin/resume/skills"
              className="p-6 bg-slate-900/60 border border-white/10 rounded-xl hover:border-[#2ecc71]/30 transition-all text-center group"
            >
              <div className="text-2xl font-black text-white mb-2 group-hover:text-[#2ecc71] transition-colors">
                Skills
              </div>
              <p className="text-sm text-slate-400">Skills & expertise</p>
            </a>

            <a
              href="/admin/resume/stats"
              className="p-6 bg-slate-900/60 border border-white/10 rounded-xl hover:border-[#2ecc71]/30 transition-all text-center group"
            >
              <div className="text-2xl font-black text-white mb-2 group-hover:text-[#2ecc71] transition-colors">
                Stats
              </div>
              <p className="text-sm text-slate-400">Achievement statistics</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminResumePageWrapped() {
  return (
    <ProtectedRoute>
      <AdminResumePage />
    </ProtectedRoute>
  );
}
