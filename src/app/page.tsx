"use client";
import { useState, useEffect } from "react";
import Kanban from "@/components/Kanban";
import { motion } from "framer-motion";

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [totalCA, setTotalCA] = useState(0);

  // 1. Calcul du CA réel pour le graphique
  useEffect(() => {
    const backup = localStorage.getItem("mes-clients-final");
    if (backup) {
      const clients = JSON.parse(backup);
      const somme = clients.reduce((acc: number, c: any) => {
        const montant = parseInt(c.CA.replace(/[^0-9]/g, "")) || 0;
        return acc + montant;
      }, 0);
      setTotalCA(somme);
    }
  }, []);

  // 2. Application du Dark Mode (Forcé par style pour éviter les bugs de config)
  const themeStyles = {
    bg: isDark ? "#09090b" : "#f8fafc",
    text: isDark ? "text-white" : "text-slate-900",
    card: isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white/50 border-slate-200"
  };

  return (
    <div style={{ backgroundColor: themeStyles.bg }} className="p-8 w-full space-y-10 min-h-screen transition-colors duration-500">

      {/* HEADER SECTION */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${themeStyles.text}`}>Adoum Hissein Ali</h1>
          <p className="text-slate-500 dark:text-zinc-400">Gérez vos tâches ici en toute sécurité.</p>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className={`px-5 py-2 rounded-2xl border font-bold transition-all active:scale-95 ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
        >
          {isDark ? "☀️ Mode Jour" : "🌙 Mode Nuit"}
        </button>
      </header>

      {/* STATS CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tâches */}
        <div className={`${themeStyles.card} backdrop-blur-md p-6 rounded-2xl border shadow-sm`}>
          <p className="text-sm font-medium text-slate-500 italic">Tâches</p>
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">En cours</h3>
          <div className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Mise à jour : live</div>
        </div>

        {/* Projets (Affiche maintenant ton CA réel) */}
        <div className={`${themeStyles.card} backdrop-blur-md p-6 rounded-2xl border shadow-sm`}>
          <p className="text-sm font-medium text-slate-500 italic">Chiffre d'Affaires</p>
          <h3 className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{totalCA.toLocaleString()} €</h3>
          <div className="mt-4 flex items-center gap-1 text-xs text-green-500 font-bold">
            ↑ Actif <span className="text-slate-400 font-normal ml-1 italic text-[10px]">depuis clients</span>
          </div>
        </div>

        {/* Statut */}
        <div className={`${themeStyles.card} backdrop-blur-md p-6 rounded-2xl border shadow-sm`}>
          <p className="text-sm font-medium text-slate-500 italic">Statut</p>
          <h3 className="text-2xl font-bold text-green-500 mt-1 uppercase tracking-tighter">Actif</h3>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Disponible</span>
          </div>
        </div>
      </div>

      {/* SECTION REVENUS (DYNAMIQUE ET VISIBLE) */}
      <div className="p-8 rounded-[2.5rem] border shadow-2xl mt-6 transition-all duration-500"
        style={{
          backgroundColor: isDark ? "#111113" : "#ffffff",
          borderColor: isDark ? "#27272a" : "#e2e8f0"
        }}>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Flux Financier</h3>
          <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500 text-white">LIVE</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "180px", gap: "10px" }}>
          {/* Mois passés (Statiques) */}
          {[25, 40, 35, 55, 45, 60].map((hauteur, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", gap: "10px" }}>
              <div style={{ width: "100%", height: "100%", backgroundColor: isDark ? "#1d1d20" : "#f1f5f9", borderRadius: "12px", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${hauteur}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  style={{ width: "100%", backgroundColor: isDark ? "#3f3f46" : "#cbd5e1" }}
                />
              </div>
              <span style={{ fontSize: "9px", color: "#64748b", fontWeight: "800" }}>M{i + 1}</span>
            </div>
          ))}

          {/* Mois Actuel (DYNAMIQUE selon ton totalCA) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", gap: "10px" }}>
            <div style={{
              width: "100%", height: "100%",
              backgroundColor: isDark ? "#1d1d20" : "#f1f5f9",
              borderRadius: "12px", display: "flex", alignItems: "flex-end", overflow: "hidden",
              border: `1px solid ${isDark ? "#3b82f6" : "#2563eb"}`
            }}>
              <motion.div
                initial={{ height: 0 }}
                // On limite la hauteur à 100% max pour ne pas dépasser
                animate={{ height: `${Math.min((totalCA / 10000) * 100, 100)}%` }}
                transition={{ duration: 1.5, type: "spring" }}
                style={{
                  width: "100%",
                  backgroundColor: "#2563eb",
                  boxShadow: "0 -4px 15px rgba(37, 99, 235, 0.4)"
                }}
              />
            </div>
            <span style={{ fontSize: "9px", color: "#2563eb", fontWeight: "900" }}>NOW</span>
          </div>
        </div>
      </div>

      {/* KANBAN SECTION */}
      <section className={`${isDark ? "bg-zinc-900/20 border-zinc-800" : "bg-white/30 border-slate-200"} backdrop-blur-lg rounded-3xl p-2 border shadow-2xl`}>
        <Kanban />
      </section>
    </div>
  );
}