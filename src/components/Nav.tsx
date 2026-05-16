'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 h-[58px] z-50 flex items-center justify-between px-12
                    bg-bg/85 backdrop-blur-md border-b border-border">
      <span className="text-accent font-extrabold tracking-wide text-sm">Noah</span>
      <ul className="flex gap-9 list-none">
        {[
          { href: '#about',    label: '소개' },
          { href: '#skills',   label: '스킬' },
          { href: '#projects', label: '프로젝트' },
        ].map(({ href, label }) => (
          <li key={href}>
            <a href={href} className="text-muted text-sm hover:text-white transition-colors">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
