"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Structure initiale si vide
const COLONNES_INITIALES = {
    "À faire": [
        { id: "1", content: "Design du logo" },
        { id: "2", content: "Review code" },
    ],
    "En cours": [{ id: "3", content: "Développement Dashboard" }],
    "Terminé": [{ id: "4", content: "Setup projet" }],
};

export default function Kanban() {
    const [columns, setColumns] = useState<any>(null); // On part de null pour le chargement
    const [isLoaded, setIsLoaded] = useState(false);
    const [newTask, setNewTask] = useState("");

    // 1. CHARGEMENT
    useEffect(() => {
        const backup = localStorage.getItem("mes-taches-kanban");
        if (backup) {
            setColumns(JSON.parse(backup));
        } else {
            setColumns(COLONNES_INITIALES);
        }
        setIsLoaded(true);
    }, []);

    // 2. SAUVEGARDE
    useEffect(() => {
        if (isLoaded && columns) {
            localStorage.setItem("mes-taches-kanban", JSON.stringify(columns));
        }
    }, [columns, isLoaded]);

    // Ajouter une tâche
    const addTask = (colName: string) => {
        if (!newTask) return;
        const updatedCols = { ...columns };
        updatedCols[colName] = [...updatedCols[colName], { id: Date.now().toString(), content: newTask }];
        setColumns(updatedCols);
        setNewTask("");
    };

    // Supprimer une tâche
    const deleteTask = (colName: string, id: string) => {
        const updatedCols = { ...columns };
        updatedCols[colName] = updatedCols[colName].filter((t: any) => t.id !== id);
        setColumns(updatedCols);
    };

    if (!isLoaded) return <div className="p-10 text-center opacity-50">Chargement du Kanban...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            {Object.entries(columns).map(([colName, tasks]: [string, any]) => (
                <div key={colName} className="bg-slate-50/50 dark:bg-zinc-900/50 p-5 rounded-3xl border border-slate-200 dark:border-zinc-800">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">{colName}</h3>
                        <span className="bg-slate-200 dark:bg-zinc-800 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            {tasks.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {tasks.map((task: any) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700 group relative"
                                >
                                    <p className="text-sm font-medium pr-6">{task.content}</p>
                                    <button
                                        onClick={() => deleteTask(colName, task.id)}
                                        className="absolute top-4 right-3 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ✕
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Petit champ d'ajout rapide sous chaque colonne */}
                    <div className="mt-4 flex gap-2">
                        <input
                            type="text"
                            placeholder="Nouvelle tâche..."
                            className="bg-transparent text-xs w-full outline-none border-b border-slate-200 dark:border-zinc-800 focus:border-blue-500 py-1"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    addTask(colName);
                                }
                            }}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}