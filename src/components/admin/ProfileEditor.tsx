'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

interface Props { initial: Profile | null; onSaved: () => void; }

export default function ProfileEditor({ initial, onSaved }: Props) {
  const [form, setForm] = useState({
    name:       initial?.name       ?? '',
    bio:        initial?.bio        ?? '',
    photo_url:  initial?.photo_url  ?? '',
    email:      initial?.email      ?? '',
    github_url: initial?.github_url ?? '',
    blog_url:   initial?.blog_url   ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  async function save() {
    setSaving(true);
    setMsg('');
    const payload = { ...form, updated_at: new Date().toISOString() };
    const { error } = initial
      ? await supabase.from('profile').update(payload).eq('id', initial.id)
      : await supabase.from('profile').insert(payload);
    setSaving(false);
    if (error) { setMsg('❌ ' + error.message); return; }
    setMsg('✅ 저장되었습니다. 메인 페이지를 새로고침하면 반영됩니다.');
    onSaved();
  }

  return (
    <div className="space-y-6">
      <p className="text-muted text-sm">
        여기서 입력한 내용이 메인 페이지 <span className="text-white font-semibold">소개 섹션</span>에 표시됩니다.
      </p>

      {/* 기본 정보 */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">기본 정보</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="이름" value={form.name} onChange={v => set('name', v)}
                 placeholder="홍길동" hint="메인 페이지 제목에 표시" />
          <Field label="이메일" value={form.email} onChange={v => set('email', v)}
                 placeholder="email@example.com" />
        </div>
      </div>

      {/* 소개 */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">소개 문구</p>
        <div>
          <label className="block text-xs text-muted mb-1">
            소개 <span className="text-accent">*</span>
            <span className="ml-2 text-muted normal-case font-normal">— 메인 페이지 이름 아래에 표시됩니다</span>
          </label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
            placeholder="안녕하세요! 저는 프로그래밍을 좋아하는 학생입니다..."
            className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm
                       outline-none focus:border-accent transition-colors resize-none"
          />
        </div>
      </div>

      {/* 링크 */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">링크</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="🐱 GitHub URL" value={form.github_url} onChange={v => set('github_url', v)}
                 placeholder="https://github.com/아이디" />
          <Field label="📝 블로그 URL" value={form.blog_url} onChange={v => set('blog_url', v)}
                 placeholder="https://..." />
        </div>
      </div>

      {/* 프로필 사진 */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">프로필 사진</p>
        <Field label="이미지 URL" value={form.photo_url} onChange={v => set('photo_url', v)}
               placeholder="https://..." hint="외부 이미지 링크를 붙여넣으세요" />
        {form.photo_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={form.photo_url} alt="미리보기"
               className="mt-3 w-20 h-20 rounded-full object-cover border-2 border-accent" />
        )}
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <button onClick={save} disabled={saving}
                className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold
                           hover:opacity-80 transition-opacity disabled:opacity-50">
          {saving ? '저장 중...' : '💾 저장하기'}
        </button>
        {msg && <span className="text-sm">{msg}</span>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">
        {label}
        {hint && <span className="ml-2 text-muted/60 normal-case font-normal">— {hint}</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm
                   outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
