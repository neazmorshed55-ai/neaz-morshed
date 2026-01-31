"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../../lib/admin-auth';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/admin');
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2ecc71] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[#2ecc71]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-[#2ecc71]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2ecc71] rounded-2xl flex items-center justify-center font-black text-slate-950 text-2xl mx-auto mb-4 shadow-[0_0_30px_rgba(46,204,113,0.3)]">
            NM
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-2">Sign in to manage your portfolio</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
              >
                <AlertCircle size={20} />
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 focus:ring-1 focus:ring-[#2ecc71]/50 transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 focus:ring-1 focus:ring-[#2ecc71]/50 transition-all"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2ecc71] text-slate-950 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Protected Admin Area • Neaz Morshed Portfolio
        </p>
      </motion.div>
    </div>
  );
}
