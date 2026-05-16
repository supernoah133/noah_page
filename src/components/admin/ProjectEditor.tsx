'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types';

interface Props { initial: Project[]; }

const EMPTY = {
  title: '', description: '', tech_stack: '', date: '',
  image_url: '', github_url: '', live_url: '', sort_order: 0,
};

export default function ProjectEditor({ initial }: Props) {
  const [projects, setProjects] = useState<Project[]>(initial);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');

  const reload = useCallback(async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    setProjects(data ?? []);
  }, []);

  function openAdd() {
    setEditId(null);
    setForm(EMPTY);
    setMsg('');
    setOpen(true);
  }

  function openEdit(p: Project) {
    setEditId(p.id);
    setForm({
      title: p.title,
      description: p.description ?? '',
      tech_stack: (p.tech_stack ?? []).join(', '),
      date: p.date ?? '',
      image_url: p.image_url ?? '',
      github_url: p.github_url ?? '',
      live_url: p.live_url ?? '',
      sort_order: p.sort_order,
    });
    setMsg('');
    setOpen(true);
  }

  async function save() {
    if (!form.title) { setMsg('제목을 입력하세요.'); return; }
    const payload = {
      title:       form.title,
      description: form.description || null,
      tech_stack:  form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      date:        form.date || null,
      image_url:   form.image_url || null,
      github_url:  form.github_url || null,
      live_url:    form.live_url || null,
      sort_order:  Number(form.sort_order),
    };
    const { error } = editId
      ? await supabase.from('projects').update(payload).eq('id', editId)
      : await supabase.from('projects').insert(payload);
    if (error) { setMsg('❌ ' + error.message); return; }
    setOpen(false);
    setEditId(null);
    setForm(EMPTY);
    reload();
  }

  async function del(id: string) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('projects').delete().eq('id', id);
    reload();
  }

  const set = (key: string, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted text-sm">총 {projects.length}개의 프로젝트</p>
        <button onClick={openAdd}
                className="px-5 py-2 bg-accent2 text-bg text-sm font-semibold rounded-lg hover:opacity-80 transition-opacity">
          + 프로젝트 추가
        </button>
      </div>

      {/* 카드 목록 */}
      {projects.length === 0 ? (
        <p className="text-center text-muted py-16">프로젝트가 없습니다. 추가해보세요!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-surface2 border border-border rounded-xl p-4">
              <div className="font-bold text-sm mb-1">{p.title}</div>
              <p className="text-muted text-xs mb-2 line-clamp-2">{p.description}</p>
              {p.tech_stack?.length ? (
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.tech_stack.map(t => (
                    <span key={t} className="text-xs bg-accent/10 border border-accent/20 text-accent rounded px-2 py-[1px]">{t}</span>
                  ))}
                </div>
              ) : null}
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)}
                        className="flex-1 py-1 border border-border text-xs rounded-md hover:text-white transition-colors">
                  ✏ 수정
                </button>
                <button onClick={() => del(p.id)}
                        className="px-4 py-1 bg-red-500/80 text-white text-xs rounded-md hover:opacity-80 transition-opacity">
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 모달 */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
             onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">{editId ? '프로젝트 수정' : '프로젝트 추가'}</h3>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-white transition-colors text-xl">✕</button>
            </div>

            <div className="space-y-3">
              <MField label="제목 *" value={form.title} onChange={v => set('title', v)} placeholder="프로젝트 이름" />
              <div>
                <label className="block text-xs text-muted mb-1">설명</label>
                <textarea rows={3} value={form.description}
                          onChange={e => set('description', e.target.value)}
                          placeholder="프로젝트 설명"
                          className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-none" />
              </div>
              <MField label="기술 스택 (쉼표 구분)" value={form.tech_stack} onChange={v => set('tech_stack', v)} placeholder="React, TypeScript, Supabase" />
              <div className="grid grid-cols-2 gap-3">
                <MField label="날짜" value={form.date} onChange={v => set('date', v)} placeholder="2025.03" />
                <div>
                  <label className="block text-xs text-muted mb-1">정렬 순서</label>
                  <input type="number" min={0} value={form.sort_order}
                         onChange={e => set('sort_order', Number(e.target.value))}
                         className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors" />
                </div>
              </div>
              <MField label="썸네일 이미지 URL" value={form.image_url} onChange={v => set('image_url', v)} placeholder="https://..." />
              <MField label="GitHub URL" value={form.github_url} onChange={v => set('github_url', v)} placeholder="https://github.com/..." />
              <MField label="라이브 URL" value={form.live_url} onChange={v => set('live_url', v)} placeholder="https://..." />
            </div>

            <div className="flex gap-3 items-center mt-6">
              <button onClick={save}
                      className="px-6 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:opacity-80 transition-opacity">
                저장
              </button>
              <button onClick={() => setOpen(false)}
                      className="px-4 py-2 border border-border text-muted text-sm rounded-lg hover:text-white transition-colors">
                취소
              </button>
              {msg && <span className="text-sm">{msg}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
             className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors" />
    </div>
  );
}
