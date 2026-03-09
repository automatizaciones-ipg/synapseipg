// ARCHIVO: components/comunications/NeonKanban.tsx
'use client';

import React, { useState } from 'react';
import NeuralMap from './NeuralMap';
import DistributionNetwork from './DistributionNetwork'; // <-- IMPORTAMOS LA BESTIA SSJ4

// ==========================================
// 1. TIPADOS (Exportamos Task para el Mapa)
// ==========================================
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  category: string;
  status: TaskStatus;
  assignee: string;
}

interface ColumnDef {
  id: TaskStatus;
  title: string;
  color: string;
  bgColor: string;
  glow: string;
}

// ==========================================
// 2. DATOS INICIALES
// ==========================================
const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Video Sede Providencia', category: 'Audiovisual', status: 'in_progress', assignee: 'DR' },
  { id: 't2', title: 'Campaña Admisión 2026', category: 'Estrategia', status: 'review', assignee: 'MJ' },
  { id: 't3', title: 'Gráficas RRSS Marzo', category: 'Diseño', status: 'backlog', assignee: 'AP' },
  { id: 't4', title: 'Tour Virtual 360', category: 'Sistemas', status: 'in_progress', assignee: 'FL' },
  { id: 't5', title: 'Newsletter Alumnos', category: 'Email', status: 'done', assignee: 'LR' },
];

const COLUMNS: ColumnDef[] = [
  { id: 'backlog', title: 'Pendientes', color: 'border-slate-500', bgColor: 'bg-slate-500/10', glow: 'shadow-[0_0_20px_rgba(100,116,139,0.4)]' },
  { id: 'in_progress', title: 'En Producción', color: 'border-blue-500', bgColor: 'bg-blue-500/10', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
  { id: 'review', title: 'Revisión', color: 'border-purple-500', bgColor: 'bg-purple-500/10', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]' },
  { id: 'done', title: 'Completado', color: 'border-emerald-500', bgColor: 'bg-emerald-500/10', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]' },
];

export default function NeonKanban() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  
  // AÑADIMOS EL TERCER ESTADO: 'distribution'
  const [viewMode, setViewMode] = useState<'kanban' | 'neural' | 'distribution'>('kanban');

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) element.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(null);
    setDragOverCol(null);
    const element = document.getElementById(id);
    if (element) element.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) setDragOverCol(colId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    if (!draggedTaskId) return;

    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === draggedTaskId ? { ...task, status: targetStatus } : task
      )
    );
    setDraggedTaskId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060B19] text-slate-900 dark:text-white p-4 md:p-8 font-sans relative transition-colors duration-300 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] max-w-[800px] h-[300px] md:h-[400px] bg-blue-600/10 dark:bg-blue-600/5 blur-[80px] md:blur-[120px] pointer-events-none rounded-full transition-all"></div>

      <header className="mb-8 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="w-full md:w-auto">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] md:text-xs font-bold rounded-full border border-blue-300 dark:border-blue-500/20 uppercase tracking-widest mb-3 inline-block">
            Synapse Hub
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Comunicaciones</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 md:mt-2 text-xs md:text-sm font-medium">Gestiona y organiza los proyectos en tiempo real.</p>
          
          {/* BOTONERA ACTUALIZADA */}
          <div className="mt-4 inline-flex bg-slate-200 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-300 dark:border-slate-700 backdrop-blur-sm overflow-x-auto max-w-full">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all whitespace-nowrap ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Tablero
            </button>
            <button 
              onClick={() => setViewMode('neural')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'neural' ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-400 shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              Mapa Neuronal
            </button>
            <button 
              onClick={() => setViewMode('distribution')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'distribution' ? 'bg-white dark:bg-slate-600 text-orange-600 dark:text-orange-500 shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]"></span>
              Radar de Distribución
            </button>
          </div>
        </div>
        <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 md:py-2.5 rounded-lg font-semibold text-sm transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] flex items-center justify-center gap-2 cursor-pointer shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Nueva Tarea
        </button>
      </header>

      {/* RENDERIZADO CONDICIONAL DE LAS 3 VISTAS */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 w-full relative z-10 animate-in fade-in duration-300">
          {COLUMNS.map(column => {
            const isOver = dragOverCol === column.id;
            return (
              <div 
                key={column.id}
                className={`flex flex-col rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 ease-out border min-h-[300px] md:min-h-[500px] h-full ${isOver ? `${column.glow} ${column.bgColor} ${column.color} scale-[1.02] md:scale-[1.01] z-20` : 'bg-white dark:bg-[#0F172A]/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className={`p-3 md:p-4 border-t-2 ${column.color} ${isOver ? 'bg-transparent' : 'bg-slate-50 dark:bg-slate-900/50'} flex justify-between items-center transition-colors`}>
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 text-xs md:text-sm tracking-wide uppercase">{column.title}</h3>
                  <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs py-0.5 px-2.5 rounded-full font-bold">
                    {tasks.filter(t => t.status === column.id).length}
                  </span>
                </div>

                <div className="flex-1 p-3 md:p-4 flex flex-col gap-3">
                  {tasks.filter(task => task.status === column.id).map(task => (
                    <div
                      key={task.id}
                      id={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={(e) => handleDragEnd(e, task.id)}
                      className={`bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-slate-500 rounded-lg p-3 md:p-4 cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group ${draggedTaskId === task.id ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <div className="flex justify-between items-start mb-2 md:mb-3">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded">
                          {task.category}
                        </span>
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-[9px] md:text-[10px] font-bold shadow-inner shrink-0">
                          {task.assignee}
                        </div>
                      </div>
                      <h4 className="text-slate-800 dark:text-white font-semibold text-xs md:text-sm leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {task.title}
                      </h4>
                      <div className="mt-3 md:mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-2 md:pt-3">
                        <div className="flex gap-3 text-slate-400 dark:text-slate-500">
                          <svg className="w-3.5 h-3.5 hover:text-blue-500 dark:hover:text-slate-300 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${column.color.replace('border-', 'bg-')} shadow-[0_0_8px_currentColor]`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'neural' && (
        <div className="relative z-10 w-full animate-in fade-in zoom-in-95 duration-500">
          <NeuralMap tasks={tasks} />
        </div>
      )}

      {viewMode === 'distribution' && (
        <div className="relative z-10 w-full animate-in fade-in zoom-in-95 duration-500">
          <DistributionNetwork />
        </div>
      )}

    </div>
  );
}