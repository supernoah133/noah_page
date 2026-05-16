'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, Skill, Project } from '@/types';
import ProfileEditor from '@/components/admin/ProfileEditor';
import SkillEditor from '@/components/admin/SkillEditor';
import ProjectEditor from '@/components/admin/ProjectEditor';
import type { Session } from '@supabase/supabase-js';

type Tab = 'profile' | 'skills' | 'projects';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [pw,    setPw]    = useState('');
  const [loginErr, setLoginErr] = useState('');

  const [tab, setTab]       = useState<Tab>('profile');
  const [profile, setProfile]   = useState<Profile | null>(null);
  const [skills,  setSkills]    = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // 세션 확인
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session) fetchAll();
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      setSession(s);
      if (s) fetchAll();
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchAll() {
    const [p, sk, pr] = await Promise.all([
      supabase.from('profile').select('*').limit(1).single(),
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('projects').select('*').order('sort_order'),
    ]);
    setProfile(p.data);
    setSkills(sk.data ?? []);
    setProjects(pr.data ?? []);
  }

  async function login() {
    setLoginErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) setLoginErr('로그인 실패: ' + error.message);
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  // 로그인 화면
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-10">
          <h2 className="text-xl font-bold mb-1">관리자 로그인</h2>
          <p className="text-muted text-sm mb-8">Supabase 계정으로 로그인하세요.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted mb-1">이메일</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                     placeholder="admin@example.com"
                     className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">비밀번호</label>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)}
                     placeholder="••••••••"
                     onKeyDown={e => e.key === 'Enter' && login()}
                     className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors" />
            </div>
          </div>
          {loginErr && <p className="text-red-400 text-xs mt-3">{loginErr}</p>}
          <button onClick={login}
                  className="w-full mt-5 py-2 bg-accent text-white font-semibold text-sm rounded-lg hover:opacity-80 transition-opacity">
            로그인
          </button>
        </div>
      </div>
    );
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'profile',  label: '👤 소개' },
    { key: 'skills',   label: '🔧 스킬' },
    { key: 'projects', label: '💻 프로젝트' },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-surface border-b border-border px-8 h-14
                         flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-accent font-extrabold text-sm">⚙ Admin</span>
          <span className="text-muted text-sm">포트폴리오 관리</span>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank"
             className="px-4 py-1.5 border border-border text-muted text-xs rounded-lg hover:text-white transition-colors">
            🌐 사이트 보기
          </a>
          <button onClick={logout}
                  className="px-4 py-1.5 border border-border text-muted text-xs rounded-lg hover:text-red-400 transition-colors">
            로그아웃
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-10">
        {/* 탭 */}
        <div className="flex gap-2 mb-8 border-b border-border pb-4">
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors
                      ${tab === key
                        ? 'bg-accent/15 text-accent border border-accent/30'
                        : 'text-muted hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="bg-surface border border-border rounded-2xl p-8">
          {tab === 'profile'  && <ProfileEditor  initial={profile}  onSaved={fetchAll} />}
          {tab === 'skills'   && <SkillEditor    initial={skills} />}
          {tab === 'projects' && <ProjectEditor  initial={projects} />}
        </div>
      </main>
    </div>
  );
}
