export interface Profile {
  id: string;
  name: string | null;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  github_url: string | null;
  blog_url: string | null;
  updated_at: string | null;
}

export interface Skill {
  id: string;
  icon: string | null;
  name: string;
  level: number;
  category: string | null;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  date: string | null;
  sort_order: number;
  created_at: string;
}
