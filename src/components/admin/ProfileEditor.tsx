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
    setMsg('✅ 저장되었습니다.');
    onSaved();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="이름" value={form.name} onChange={v => set('name', v)} placeholder="홍길동" />
        <Field label="이메일" value={form.email} onChange={v => set('email', v)} placeholder="email@example.com" />
        <Field label="GitHub URL" value={form.github_url} onChange={v => set('github_url', v)} placeholder="https://github.com/..." />
        <Field label="블로그 URL" value={form.blog_url} onChange={v => set('blog_url', v)} placeholder="https://..." />
        <div className="col-span-2">
          <Field label="프로필 사진 URL" value={form.photo_url} onChange={v => set('photo_url', v)} placeholder="https://..." />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-muted mb-1">소개</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
            placeholder="한줄 소개 또는 짧은 자기소개"
            className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm
                       outline-none focus:border-accent transition-colors resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button onClick={save} disabled={saving}
                className="px-5 py-2 bg-accent text-white rounded-lg text-sm font-semibold
                           hover:opacity-80 transition-opacity disabled:opacity-50">
          {saving ? '저장 중...' : '저장하기'}
        </button>
        {msg && <span className="text-sm">{msg}</span>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
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
