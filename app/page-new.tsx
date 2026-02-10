"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, Database, Target, Layout, ArrowRight, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import FooterLinks from '@/components/FooterLinks';
import {
  HeroSection,
  SkillsSection,
} from '@/components/sections';
import { Card, Container, SectionHeader } from '@/components/ui';
import { supabase } from '@/lib/supabase';
