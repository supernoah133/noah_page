'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    supabase.from('projects').select('*').order('sort_order').then(({ data }) => {
      setProjects(data ?? []);
    });
  }, []);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close]);

  return (
    <section id="projects" className="py-24">
      <div className="max-w-4xl mx-auto px-10">
        <p className="text-xs font-bold tracking-[0.14em] uppercase text-accent mb-3">Projects</p>
        <h2 className="text-3xl font-extrabold mb-12">프로젝트</h2>

        {projects.length === 0 ? (
          <p className="text-muted text-sm text-center py-16">
            관리자 페이지에서 프로젝트를 추가하세요.{' '}
            <a href="/admin" className="text-accent underline">관리자 →</a>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div key={p.id}
                   onClick={() => setSelected(p)}
                   className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col
                              hover:-translate-y-1 hover:border-accent transition-all duration-200 cursor-pointer">
                <div className="w-full h-44 bg-surface2 flex items-center justify-center text-5xl text-muted flex-shrink-0 overflow-hidden">
                  {p.image_url
                    ? <Image src={p.image_url} alt={p.title} width={400} height={176}
                             className="w-full h-full object-cover" />
                    : '💻'
                  }
                </div>
                <div className="p-5 flex flex-col flex-1">
                  {p.date && <p className="text-muted text-xs mb-1">{p.date}</p>}
                  <h3 className="font-bold text-base mb-2">{p.title}</h3>
                  <p className="text-muted text-sm flex-1 mb-3 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                  {p.tech_stack?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {p.tech_stack.map((t) => (
                        <span key={t} className="text-xs bg-accent/10 border border-accent/25 text-accent rounded-md px-2 py-[2px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 상세 팝업 */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
             onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto
                          animate-[fadeUp_0.2s_ease]">
            {/* 이미지 */}
            {selected.image_url && (
              <div className="w-full h-52 overflow-hidden rounded-t-2xl flex-shrink-0">
                <Image src={selected.image_url} alt={selected.title} width={600} height={208}
                       className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  {selected.date && <p className="text-muted text-xs mb-1">{selected.date}</p>}
                  <h2 className="text-xl font-extrabold">{selected.title}</h2>
                </div>
                <button onClick={close}
                        className="text-muted hover:text-white transition-colors text-xl flex-shrink-0">
                  ✕
                </button>
              </div>

              {selected.description && (
                <p className="text-muted text-sm leading-relaxed mb-6">{selected.description}</p>
              )}

              {selected.tech_stack?.length ? (
                <div className="mb-6">
                  <p className="text-xs text-muted font-semibold uppercase tracking-widest mb-2">기술 스택</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.tech_stack.map(t => (
                      <span key={t} className="text-sm bg-accent/10 border border-accent/25 text-accent rounded-lg px-3 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3">
                {selected.github_url && (
                  <a href={selected.github_url} target="_blank" rel="noreferrer"
                     className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold text-center
                                hover:text-white hover:border-white transition-colors">
                    🐱 GitHub
                  </a>
                )}
                {selected.live_url && (
                  <a href={selected.live_url} target="_blank" rel="noreferrer"
                     className="flex-1 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold text-center
                                hover:opacity-80 transition-opacity">
                    🔗 라이브 보기
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
