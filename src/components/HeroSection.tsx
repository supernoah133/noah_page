'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

export default function HeroSection() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.from('profile').select('*').limit(1).single().then(({ data }) => {
      setProfile(data);
    });
  }, []);

  const name   = profile?.name     || null;
  const bio    = profile?.bio      || null;
  const photo  = profile?.photo_url;
  const github = profile?.github_url;
  const blog   = profile?.blog_url;
  const email  = profile?.email;

  return (
    <section id="about" className="min-h-screen flex items-center pt-[58px] relative overflow-hidden">
      {/* 배경 글로우 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(124,110,247,0.12) 0%, transparent 68%)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-10 flex flex-col md:flex-row items-center gap-16 w-full relative">
        {/* 아바타 */}
        <div className="w-[170px] h-[170px] rounded-full border-[3px] border-accent flex-shrink-0
                        bg-surface2 flex items-center justify-center overflow-hidden">
          {photo
            ? <Image src={photo} alt="프로필" width={170} height={170}
                     className="object-cover w-full h-full rounded-full" />
            : <span className="text-6xl">🧑‍💻</span>
          }
        </div>

        {/* 텍스트 */}
        <div>
          {name ? (
            <h1 className="text-5xl font-black leading-tight gradient-text mb-4">
              안녕하세요,<br />{name}입니다
            </h1>
          ) : (
            <h1 className="text-5xl font-black leading-tight mb-4 text-border">
              안녕하세요 👋
            </h1>
          )}

          {bio ? (
            <p className="text-[#c0c0d0] text-base max-w-md mb-6 leading-relaxed">{bio}</p>
          ) : (
            <p className="text-muted text-base max-w-md mb-6 leading-relaxed border border-dashed border-border rounded-lg px-4 py-3">
              ✏️ <a href="/admin" className="text-accent underline">관리자 페이지</a>에서 소개를 입력하세요.
            </p>
          )}

          <div className="flex gap-3 flex-wrap">
            <a href="#projects"
               className="px-5 py-2 rounded-full bg-accent text-white text-sm font-semibold hover:opacity-80 transition-opacity">
              프로젝트 보기
            </a>
            {github && (
              <a href={github} target="_blank" rel="noreferrer"
                 className="px-5 py-2 rounded-full border border-border text-sm font-semibold hover:opacity-80 transition-opacity">
                🐱 GitHub
              </a>
            )}
            {blog && (
              <a href={blog} target="_blank" rel="noreferrer"
                 className="px-5 py-2 rounded-full border border-border text-sm font-semibold hover:opacity-80 transition-opacity">
                📝 블로그
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`}
                 className="px-5 py-2 rounded-full border border-border text-sm font-semibold hover:opacity-80 transition-opacity">
                ✉ 이메일
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
