"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjetsPage() {
    const [projets, setProjets] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null); // Pour la modif

    // États du formulaire
    const [titre, setTitre] = useState("");
    const [client, setClient] = useState("");
    const [progression, setProgression] = useState(0);
    const [deadline, setDeadline] = useState("");

    useEffect(() => {
        const backup = localStorage.getItem("mes-projets");
        if (backup) {
            setProjets(JSON.parse(backup));
        } else {
            setProjets([
                { id: 1, titre: "Refonte E-commerce", client: "Tanoma", progression: 75, priorite: "Haute", deadline: "2026-03-01" },
            ]);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("mes-projets", JSON.stringify(projets));
        }
    }, [projets, isLoaded]);

    // Ouvrir le modal pour modifier
    const preparerModif = (p: any) => {
        setEditingProject(p);
        setTitre(p.titre);
        setClient(p.client);
        setProgression(p.progression);
        setDeadline(p.deadline);
        setIsOpen(true);
    };

    const validerAction = () => {
        if (!titre || !client) return;

        if (editingProject) {
            // MODE MODIFICATION
            setProjets(projets.map(p => p.id === editingProject.id
                ? { ...p, titre, client, progression, deadline }
                : p
            ));
        } else {
            // MODE AJOUT
            const nouveau = { id: Date.now(), titre, client, progression, priorite: "Moyenne", deadline: deadline || "Non définie" };
            setProjets([nouveau, ...projets]);
        }

        fermerModal();
    };

    const fermerModal = () => {
        setIsOpen(false);
        setEditingProject(null);
        setTitre(""); setClient(""); setProgression(0); setDeadline("");
    };

    const supprimerProjet = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Évite d'ouvrir le modal en supprimant
        setProjets(projets.filter((p) => p.id !== id));
    };

    if (!isLoaded) return null;

    return (
        <div className="p-8 w-full">
            <header className="mb-10 flex justify-between items-center">
                <h1 className="text-3xl font-bold dark:text-white">Mes Projets</h1>
                <button onClick={() => setIsOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
                    + Nouveau Projet
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {projets.map((p) => (
                        <motion.div
                            key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => preparerModif(p)} // Clique pour modifier
                            className="bg-white/50 dark:bg-zinc-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xl relative group cursor-pointer hover:border-indigo-500 transition-colors"
                        >
                            <button onClick={(e) => supprimerProjet(e, p.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                            <h3 className="text-lg font-bold dark:text-white">{p.titre}</h3>
                            <p className="text-sm text-slate-500 mb-2">{p.client}</p>

                            <div className="mb-6 flex items-center gap-2">
                                <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md font-bold text-slate-500 italic">
                                    📅 {p.deadline}
                                </span>
                            </div>

                            <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${p.progression}%` }} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div onClick={fermerModal} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <div className="relative bg-white dark:bg-zinc-950 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
                            <h2 className="text-2xl font-black mb-6">{editingProject ? "Modifier le Projet" : "Nouveau Projet"}</h2>
                            <div className="space-y-4">
                                <input type="text" placeholder="Nom" value={titre} onChange={(e) => setTitre(e.target.value)} className="w-full p-4 rounded-2xl border dark:bg-zinc-900 dark:border-zinc-800 outline-none" />
                                <input type="text" placeholder="Client" value={client} onChange={(e) => setClient(e.target.value)} className="w-full p-4 rounded-2xl border dark:bg-zinc-900 dark:border-zinc-800 outline-none" />

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 ml-2">Échéance</label>
                                    <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full p-4 rounded-2xl border dark:bg-zinc-900 dark:border-zinc-800 outline-none dark:text-white" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 ml-2">Progression : {progression}%</label>
                                    <input type="range" min="0" max="100" value={progression} onChange={(e) => setProgression(Number(e.target.value))} className="w-full accent-indigo-600" />
                                </div>

                                <button onClick={validerAction} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg">
                                    {editingProject ? "Enregistrer les modifications" : "Lancer le projet"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}