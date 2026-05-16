import Image from 'next/image';
import type { Profile } from '@/types';

interface Props { profile: Profile | null; }

export default function HeroSection({ profile }: Props) {
  const name     = profile?.name     ?? '이름을 설정하세요';
  const bio      = profile?.bio      ?? '관리자 페이지에서 소개를 입력하세요.';
  const photo    = profile?.photo_url;
  const github   = profile?.github_url;
  const blog     = profile?.blog_url;
  const email    = profile?.email;

  return (
    <section id="about" className="min-h-screen flex items-center pt-[58px] relative overflow-hidden">
      {/* 배경 글로우 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(124,110,247,0.12) 0%, transparent 68%)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-10 flex items-center gap-16 w-full relative">
        {/* 아바타 */}
        <div className="w-[170px] h-[170px] rounded-full border-[3px] border-accent flex-shrink-0
                        bg-surface2 flex items-center justify-center overflow-hidden">
          {photo
            ? <Image src={photo} alt="프로필" width={170} height={170} className="object-cover w-full h-full rounded-full" />
            : <span className="text-6xl">🧑‍💻</span>
          }
        </div>

        {/* 텍스트 */}
        <div>
          <h1 className="text-5xl font-black leading-tight gradient-text mb-4">
            안녕하세요,<br />{name}입니다
          </h1>
          <p className="text-muted text-base max-w-md mb-6 leading-relaxed">{bio}</p>

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
