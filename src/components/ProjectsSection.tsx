import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types';

async function fetchProjects(): Promise<Project[]> {
  const { data } = await supabase.from('projects').select('*').order('sort_order');
  return data ?? [];
}

export default async function ProjectsSection() {
  const projects = await fetchProjects();

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
                   className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col
                              hover:-translate-y-1 hover:border-accent transition-all duration-200">
                {/* 썸네일 */}
                <div className="w-full h-44 bg-surface2 flex items-center justify-center text-5xl text-muted flex-shrink-0 overflow-hidden">
                  {p.image_url
                    ? <Image src={p.image_url} alt={p.title} width={400} height={176}
                             className="w-full h-full object-cover" />
                    : '💻'
                  }
                </div>

                {/* 본문 */}
                <div className="p-5 flex flex-col flex-1">
                  {p.date && <p className="text-muted text-xs mb-1">{p.date}</p>}
                  <h3 className="font-bold text-base mb-2">{p.title}</h3>
                  <p className="text-muted text-sm flex-1 mb-3 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>

                  {p.tech_stack?.length ? (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {p.tech_stack.map((t) => (
                        <span key={t}
                              className="text-xs bg-accent/10 border border-accent/25 text-accent
                                         rounded-md px-2 py-[2px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex gap-3">
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer"
                         className="text-muted text-xs font-semibold hover:text-white transition-colors">
                        🐱 GitHub
                      </a>
                    )}
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noreferrer"
                         className="text-accent2 text-xs font-semibold hover:opacity-80 transition-opacity">
                        🔗 라이브
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
