'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/types';

interface Props { initial: Skill[]; }

const EMPTY = { icon: '', name: '', level: 70, category: '', sort_order: 0 };

export default function SkillEditor({ initial }: Props) {
  const [skills, setSkills] = useState<Skill[]>(initial);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const reload = useCallback(async () => {
    const { data } = await supabase.from('skills').select('*').order('sort_order');
    setSkills(data ?? []);
  }, []);

  function startEdit(s: Skill) {
    setEditId(s.id);
    setForm({ icon: s.icon ?? '', name: s.name, level: s.level, category: s.category ?? '', sort_order: s.sort_order });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY);
  }

  async function save() {
    if (!form.name) { setMsg('이름을 입력하세요.'); return; }
    const payload = {
      icon: form.icon || null,
      name: form.name,
      level: Number(form.level),
      category: form.category || null,
      sort_order: Number(form.sort_order),
    };
    const { error } = editId
      ? await supabase.from('skills').update(payload).eq('id', editId)
      : await supabase.from('skills').insert(payload);
    if (error) { setMsg('❌ ' + error.message); return; }
    setMsg(editId ? '✅ 수정되었습니다.' : '✅ 추가되었습니다.');
    setEditId(null);
    setForm(EMPTY);
    reload();
  }

  async function del(id: string) {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('skills').delete().eq('id', id);
    setMsg('✅ 삭제되었습니다.');
    reload();
  }

  return (
    <div className="space-y-6">
      {/* 입력 폼 */}
      <div className="bg-surface2 rounded-xl p-5 space-y-4">
        <p className="text-sm font-semibold text-accent">{editId ? '스킬 수정' : '새 스킬 추가'}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted mb-1">이름 *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                   placeholder="Python"
                   className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">아이콘 (이모지)</label>
            <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                   placeholder="🐍" maxLength={4}
                   className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">카테고리</label>
            <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                   placeholder="프로그래밍"
                   className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">숙련도 ({form.level}%)</label>
            <input type="range" min={1} max={100} value={form.level}
                   onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))}
                   className="w-full accent-accent" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">정렬 순서</label>
            <input type="number" min={0} value={form.sort_order}
                   onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                   className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors" />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={save}
                  className="px-5 py-2 bg-accent2 text-bg text-sm font-semibold rounded-lg hover:opacity-80 transition-opacity">
            {editId ? '수정 저장' : '+ 추가'}
          </button>
          {editId && (
            <button onClick={cancelEdit}
                    className="px-4 py-2 border border-border text-muted text-sm rounded-lg hover:text-white transition-colors">
              취소
            </button>
          )}
          {msg && <span className="text-sm">{msg}</span>}
        </div>
      </div>

      {/* 목록 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted text-xs">
              <th className="text-left py-2 px-3">아이콘</th>
              <th className="text-left py-2 px-3">이름</th>
              <th className="text-left py-2 px-3">카테고리</th>
              <th className="text-left py-2 px-3">숙련도</th>
              <th className="text-left py-2 px-3">순서</th>
              <th className="py-2 px-3" />
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted py-8">스킬이 없습니다.</td></tr>
            )}
            {skills.map(s => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-surface2/50">
                <td className="py-3 px-3">{s.icon ?? '—'}</td>
                <td className="py-3 px-3 font-medium">{s.name}</td>
                <td className="py-3 px-3 text-muted">{s.category ?? '—'}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full skill-bar-fill" style={{ width: `${s.level}%` }} />
                    </div>
                    <span className="text-accent text-xs">{s.level}%</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-muted">{s.sort_order}</td>
                <td className="py-3 px-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(s)}
                            className="text-xs px-3 py-1 border border-border rounded-md hover:text-white transition-colors">
                      수정
                    </button>
                    <button onClick={() => del(s.id)}
                            className="text-xs px-3 py-1 bg-red-500/80 text-white rounded-md hover:opacity-80 transition-opacity">
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
