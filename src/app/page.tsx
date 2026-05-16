import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
import type { Profile } from '@/types';
import HeroSection from '@/components/HeroSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';

async function fetchProfile(): Promise<Profile | null> {
  const { data } = await supabase.from('profile').select('*').limit(1).single();
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await fetchProfile();
  const name = profile?.name ?? '포트폴리오';
  const bio  = profile?.bio  ?? '개인 포트폴리오 사이트';
  return {
    title: `${name} | 포트폴리오`,
    description: bio,
    openGraph: {
      title: name,
      description: bio,
      images: profile?.photo_url ? [profile.photo_url] : ['/og-image.png'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: bio,
    },
  };
}

export default async function Home() {
  const profile = await fetchProfile();
  return (
    <main>
      <HeroSection profile={profile} />
      <SkillsSection />
      <ProjectsSection />
    </main>
  );
}
