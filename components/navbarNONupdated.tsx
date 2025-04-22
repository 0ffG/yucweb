'use client';

import Link from 'next/link';
import { YucLogo } from './yuc-logo';

export default function NavigationBar() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-900">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <YucLogo />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="px-6 py-2 rounded-full bg-white/80 text-gray-700 font-medium text-sm transition-all hover:shadow-md hover:bg-white"
          >
            Hakkımızda
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 rounded-full bg-white/80 border border-gray-200 text-gray-700 font-medium text-sm transition-all hover:shadow-md hover:bg-white"
          >
            Kayıt Ol
          </Link>
          <Link
            href="/login"
            className="px-6 py-2 rounded-full bg-green-900/90 text-white font-medium text-sm transition-all hover:shadow-md hover:bg-pink-500"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </header>
  );
}
