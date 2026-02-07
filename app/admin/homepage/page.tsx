"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Save, Loader2, ArrowLeft, LayoutTemplate, Type, Hash, AlignLeft, List
} from 'lucide-react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';

interface HeroStat {
    label: string;
    value: number;
    suffix: string;
}

interface HomepageContent {
    id: string;
    hero_subtitle: string;
    hero_title_prefix: string;
    hero_name: string;
    hero_description: string;
    hero_typewriter_texts: string[];
    hero_stats: HeroStat[];
}

export default function HomepageManagement() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<HomepageContent | null>(null);

    // Form states
    const [formData, setFormData] = useState<HomepageContent>({
        id: '',
        hero_subtitle: '',
        hero_title_prefix: '',
        hero_name: '',
        hero_description: '',
        hero_typewriter_texts: [],
        hero_stats: []
    });

    const [newTypewriterText, setNewTypewriterText] = useState('');

    useEffect(() => {
        fetchContent();
    }, []);

    async function fetchContent() {
        try {
            // Fetch from our new API route to ensure fresh data (bypassing client cache)
            const response = await fetch('/api/homepage', {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache' }
            });
            const data = await response.json();

            if (data && !data.error) {
                console.log('Fetched fresh content:', data);
                setContent(data);
                setFormData(data);
            }
        } catch (error) {
            console.error('Error fetching homepage content:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!content?.id) return;

        console.log('Saving homepage content...', formData);
        setSaving(true);
        try {
            // Use API route to save (with service role key)
            const response = await fetch('/api/homepage', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: content.id,
                    hero_subtitle: formData.hero_subtitle,
                    hero_title_prefix: formData.hero_title_prefix,
                    hero_name: formData.hero_name,
                    hero_description: formData.hero_description,
                    hero_typewriter_texts: formData.hero_typewriter_texts,
                    hero_stats: formData.hero_stats
                })
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.error || result.details || 'Failed to save');
            }

            console.log('Save successful');
            alert('Homepage updated successfully!');
            await fetchContent(); // Re-fetch to confirm changes

        } catch (error: any) {
            console.error('Error saving homepage content:', error);
            alert(`Failed to save changes: ${error.message || error}`);
        } finally {
            setSaving(false);
        }
    }

    // Generic Text Change Handler
    const handleTextChange = (field: keyof HomepageContent, value: string) => {
        console.log(`Updating ${field} to:`, value);
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Typewriter Text Handlers
    const addTypewriterText = () => {
        if (!newTypewriterText.trim()) return;
        setFormData(prev => ({
            ...prev,
            hero_typewriter_texts: [...prev.hero_typewriter_texts, newTypewriterText.trim()]
        }));
        setNewTypewriterText('');
    };

    const removeTypewriterText = (index: number) => {
        setFormData(prev => ({
            ...prev,
            hero_typewriter_texts: prev.hero_typewriter_texts.filter((_, i) => i !== index)
        }));
    };

    // Stats Handlers
    const updateStat = (index: number, field: keyof HeroStat, value: string | number) => {
        setFormData(prev => {
            const newStats = [...prev.hero_stats];
            newStats[index] = { ...newStats[index], [field]: value };
            return { ...prev, hero_stats: newStats };
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
                <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-0 bg-[#0b0f1a]/80 backdrop-blur-md z-40 py-4 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/admin" className="text-slate-500 hover:text-white transition-colors">
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Homepage</h1>
                        </div>
                        <p className="text-slate-400">Manage your homepage content</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#2ecc71] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} /> Save Changes</>}
                    </button>
                </div>

                <div className="grid gap-8 max-w-4xl mx-auto">
                    {/* Hero Section Configuration */}
                    <section className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <LayoutTemplate className="text-[#2ecc71]" /> Hero Section
                        </h2>

                        <div className="space-y-6">
                            {/* Subtitle */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                    Subtitle (Top Tagline)
                                </label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        value={formData.hero_subtitle}
                                        onChange={(e) => handleTextChange('hero_subtitle', e.target.value)}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#2ecc71]/50 transition-all"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Example: Powering Global Business Growth Since 2014</p>
                            </div>

                            {/* Title Prefix & Name */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                        Title Prefix
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.hero_title_prefix}
                                        onChange={(e) => handleTextChange('hero_title_prefix', e.target.value)}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 transition-all"
                                    />
                                    <p className="text-xs text-slate-500 mt-2">Example: I AM</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.hero_name}
                                        onChange={(e) => handleTextChange('hero_name', e.target.value)}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50 transition-all"
                                    />
                                    <p className="text-xs text-slate-500 mt-2">First 2 words will be used for the big title.</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                    Description
                                </label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-4 text-slate-500" size={18} />
                                    <textarea
                                        rows={4}
                                        value={formData.hero_description}
                                        onChange={(e) => handleTextChange('hero_description', e.target.value)}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#2ecc71]/50 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Typewriter Texts */}
                    <section className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <List className="text-[#2ecc71]" /> Typewriter Texts
                        </h2>

                        <div className="flex gap-4 mb-6">
                            <input
                                type="text"
                                value={newTypewriterText}
                                onChange={(e) => setNewTypewriterText(e.target.value)}
                                placeholder="Add new text..."
                                className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ecc71]/50"
                                onKeyDown={(e) => e.key === 'Enter' && addTypewriterText()}
                            />
                            <button
                                onClick={addTypewriterText}
                                className="bg-[#2ecc71]/10 text-[#2ecc71] px-6 py-3 rounded-xl font-bold hover:bg-[#2ecc71]/20 transition-all"
                            >
                                Add
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {formData.hero_typewriter_texts.map((text, index) => (
                                <div key={index} className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-white/5">
                                    <span className="text-white text-sm">{text}</span>
                                    <button
                                        onClick={() => removeTypewriterText(index)}
                                        className="text-slate-500 hover:text-red-400 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <Hash className="text-[#2ecc71]" /> Key Statistics
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            {formData.hero_stats.map((stat, index) => (
                                <div key={index} className="bg-slate-800/30 p-4 rounded-xl border border-white/5">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] text-slate-500 font-bold uppercase">Label</label>
                                            <input
                                                type="text"
                                                value={stat.label}
                                                onChange={(e) => updateStat(index, 'label', e.target.value)}
                                                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#2ecc71]/50 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 font-bold uppercase">Value</label>
                                            <input
                                                type="number"
                                                value={stat.value}
                                                onChange={(e) => updateStat(index, 'value', parseInt(e.target.value) || 0)}
                                                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#2ecc71]/50 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 font-bold uppercase">Suffix</label>
                                            <input
                                                type="text"
                                                value={stat.suffix}
                                                onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                                                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#2ecc71]/50 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-4 text-center">Currently supports 3 fixed stats slots.</p>
                    </section>
                </div>
            </div>
        </ProtectedRoute>
    );
}
