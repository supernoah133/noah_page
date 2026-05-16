'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/types';

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selected, setSelected] = useState<Skill | null>(null);

  useEffect(() => {
    supabase.from('skills').select('*').order('sort_order').then(({ data }) => {
      setSkills(data ?? []);
    });
  }, []);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close]);

  const levelLabel = (level: number) => {
    if (level >= 90) return '전문가';
    if (level >= 70) return '능숙';
    if (level >= 50) return '중급';
    if (level >= 30) return '초급';
    return '입문';
  };

  return (
    <section id="skills" className="bg-surface py-24">
      <div className="max-w-4xl mx-auto px-10">
        <p className="text-xs font-bold tracking-[0.14em] uppercase text-accent mb-3">Skills</p>
        <h2 className="text-3xl font-extrabold mb-12">관심분야 &amp; 스킬</h2>

        {skills.length === 0 ? (
          <p className="text-muted text-sm text-center py-16">
            관리자 페이지에서 스킬을 추가하세요.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((s) => (
              <div key={s.id}
                   onClick={() => setSelected(s)}
                   className="bg-surface2 border border-border rounded-xl px-5 py-4
                              hover:border-accent transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 font-semibold text-sm">
                    <span>{s.icon ?? '🔧'}</span>
                    {s.name}
                  </span>
                  <span className="text-accent text-xs font-bold">{s.level}%</span>
                </div>
                <div className="h-[5px] bg-border rounded-full overflow-hidden">
                  <div className="h-full skill-bar-fill rounded-full" style={{ width: `${s.level}%` }} />
                </div>
                {s.category && <p className="text-muted text-xs mt-2">{s.category}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 상세 팝업 */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
             onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-8
                          animate-[fadeUp_0.2s_ease]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selected.icon ?? '🔧'}</span>
                <div>
                  <h2 className="text-xl font-extrabold">{selected.name}</h2>
                  {selected.category && (
                    <p className="text-muted text-sm">{selected.category}</p>
                  )}
                </div>
              </div>
              <button onClick={close} className="text-muted hover:text-white transition-colors text-xl">✕</button>
            </div>

            {/* 레벨 바 */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted">숙련도</span>
                <span className="text-accent font-bold">{selected.level}%</span>
              </div>
              <div className="h-3 bg-border rounded-full overflow-hidden">
                <div className="h-full skill-bar-fill rounded-full transition-all duration-700"
                     style={{ width: `${selected.level}%` }} />
              </div>
            </div>

            {/* 레벨 라벨 */}
            <div className="flex justify-end">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
                {levelLabel(selected.level)}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
