import { supabase } from '@/lib/supabase';
import type { Skill } from '@/types';

async function fetchSkills(): Promise<Skill[]> {
  const { data } = await supabase.from('skills').select('*').order('sort_order');
  return data ?? [];
}

export default async function SkillsSection() {
  const skills = await fetchSkills();

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
                   className="bg-surface2 border border-border rounded-xl px-5 py-4
                              hover:border-accent transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 font-semibold text-sm">
                    <span>{s.icon ?? '🔧'}</span>
                    {s.name}
                  </span>
                  <span className="text-accent text-xs font-bold">{s.level}%</span>
                </div>
                <div className="h-[5px] bg-border rounded-full overflow-hidden">
                  <div className="h-full skill-bar-fill rounded-full"
                       style={{ width: `${s.level}%` }} />
                </div>
                {s.category && (
                  <p className="text-muted text-xs mt-2">{s.category}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
