import type { Metadata } from "next";
import "./globals.css";

import Link from "next/link"; // TRÈS IMPORTANT

// ... dans ta sidebar :

export const metadata: Metadata = {
  title: "Projet Pro - Malt",
  description: "Dashboard de gestion de projet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="flex h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 transition-colors duration-300">

        {/* Effets de lumière en arrière-plan (uniquement visibles en Dark Mode) */}
        <div className="fixed -top-20 -left-20 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="fixed bottom-0 right-0 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none z-0" />

        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col z-10">
          <div className="p-6 border-b dark:border-zinc-800 flex items-center gap-3">
            {/* L'icône du Logo */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-xs">MKA</span>
            </div>

            {/* Le Texte du Logo */}
            <span className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-zinc-400">
              Maplateforme
            </span>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all">
              Tableau de bord
            </Link>

            <Link href="/projets" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all">
              Projets
            </Link>

            <Link href="/clients" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all">
              Clients
            </Link>
          </nav>

          <div className="p-4 border-t dark:border-zinc-800 text-sm text-slate-500 dark:text-zinc-500 font-medium">
            Freelance Connecté
          </div>

          <div className="p-4 border-t dark:border-zinc-800 mt-auto">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all group">
              <span className="group-hover:rotate-12 transition-transform">🚪</span>
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 overflow-auto relative z-10 bg-slate-50/50 dark:bg-transparent">
          {children}
        </main>
      </body>
    </html>
  );
}