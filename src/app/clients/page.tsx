"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<any>(null);

    // États du formulaire
    const [nom, setNom] = useState("");
    const [secteur, setSecteur] = useState("");
    const [ca, setCa] = useState("");
    const [statut, setStatut] = useState("Actif");

    useEffect(() => {
        const backup = localStorage.getItem("mes-clients-final");
        if (backup) {
            setClients(JSON.parse(backup));
        } else {
            setClients([
                { id: 1, nom: "Tanoma", secteur: "Freelance", CA: "12,400 €", statut: "Actif" },
                { id: 2, nom: "Tech Global", secteur: "Logiciel", CA: "3,200 €", statut: "En pause" },
            ]);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("mes-clients-final", JSON.stringify(clients));
        }
    }, [clients, isLoaded]);

    const preparerModif = (c: any) => {
        setEditingClient(c);
        setNom(c.nom);
        setSecteur(c.secteur);
        setCa(c.CA.replace(" €", ""));
        setStatut(c.statut);
        setIsOpen(true);
    };

    const validerAction = () => {
        if (!nom || !secteur || !ca) return;
        const formattedCA = ca.includes("€") ? ca : `${ca} €`;

        if (editingClient) {
            setClients(clients.map(c => c.id === editingClient.id
                ? { ...c, nom, secteur, CA: formattedCA, statut }
                : c
            ));
        } else {
            const nouveau = { id: Date.now(), nom, secteur, CA: formattedCA, statut };
            setClients([nouveau, ...clients]);
        }
        fermerModal();
    };

    const fermerModal = () => {
        setIsOpen(false);
        setEditingClient(null);
        setNom(""); setSecteur(""); setCa(""); setStatut("Actif");
    };

    const supprimerClient = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setClients(clients.filter(c => c.id !== id));
    };

    const exporterPDF = () => {
        window.print();
    };

    if (!isLoaded) return null;

    return (
        <div className="p-8 w-full max-w-6xl mx-auto">
            <header className="mb-8 flex justify-between items-center print:hidden">
                <h1 className="text-3xl font-bold dark:text-white">Annuaire Clients</h1>
                <div className="flex gap-3">
                    <button onClick={exporterPDF} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95">
                        📥 Export PDF
                    </button>
                    <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg">
                        + Nouveau Client
                    </button>
                </div>
            </header>

            <div className="bg-white/50 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                            <th className="p-4 text-sm font-semibold">Nom</th>
                            <th className="p-4 text-sm font-semibold">Secteur</th>
                            <th className="p-4 text-sm font-semibold">CA Total</th>
                            <th className="p-4 text-sm font-semibold">Statut</th>
                            <th className="p-4 text-sm font-semibold text-right print:hidden">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode='popLayout'>
                            {clients.map((c) => (
                                <motion.tr
                                    key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                                    onClick={() => preparerModif(c)}
                                    className="border-b dark:border-zinc-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors"
                                >
                                    <td className="p-4 font-bold">{c.nom}</td>
                                    <td className="p-4 text-sm text-slate-500">{c.secteur}</td>
                                    <td className="p-4 font-mono text-blue-600 font-bold">{c.CA}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${c.statut === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {c.statut}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right print:hidden">
                                        <button onClick={(e) => supprimerClient(e, c.id)} className="text-red-500 text-xs font-bold hover:underline">Supprimer</button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden">
                        <div onClick={fermerModal} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <div className="relative bg-white dark:bg-zinc-950 w-full max-w-md p-8 rounded-[2rem] shadow-2xl border border-white/10">
                            <h2 className="text-2xl font-black mb-6">{editingClient ? "Modifier Client" : "Ajouter Client"}</h2>
                            <div className="space-y-4">
                                <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full p-4 rounded-2xl border dark:bg-zinc-900 dark:border-zinc-800 outline-none" />
                                <input type="text" placeholder="Secteur" value={secteur} onChange={(e) => setSecteur(e.target.value)} className="w-full p-4 rounded-2xl border dark:bg-zinc-900 dark:border-zinc-800 outline-none" />
                                <input type="text" placeholder="CA (ex: 5000)" value={ca} onChange={(e) => setCa(e.target.value)} className="w-full p-4 rounded-2xl border dark:bg-zinc-900 dark:border-zinc-800 outline-none" />
                                <select value={statut} onChange={(e) => setStatut(e.target.value)} className="w-full p-4 rounded-2xl border dark:bg-zinc-900 dark:border-zinc-800 outline-none bg-transparent">
                                    <option value="Actif">Actif</option>
                                    <option value="En pause">En pause</option>
                                </select>
                                <button onClick={validerAction} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg">
                                    {editingClient ? "Enregistrer" : "Créer"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}