// ARCHIVO: components/comunications/NeuralMap.tsx
'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Edge,
  Node,
  Position,
  Handle,
  MarkerType,
  useNodesState,
  useEdgesState,
  NodeProps,
} from '@xyflow/react';
import { Task, TaskStatus } from './NeonKanban'; // Importamos el tipo desde tu Kanban

// ==========================================
// 1. TIPADOS ESTRICTOS Y PROPS
// ==========================================
export interface NeuralMapProps {
  tasks: Task[];
}

export type CoreNodeData = { label: string };
export type CategoryNodeData = { label: string; color: string };
export type TaskNodeData = { taskId: string; label: string; status: TaskStatus; assignee: string };

export type CoreNodeType = Node<CoreNodeData, 'core'>;
export type CategoryNodeType = Node<CategoryNodeData, 'category'>;
export type TaskNodeType = Node<TaskNodeData, 'task'>;
export type AppNode = CoreNodeType | CategoryNodeType | TaskNodeType;

// ==========================================
// 2. NODOS PERSONALIZADOS
// ==========================================
const CoreNode = ({ data }: NodeProps<CoreNodeType>) => (
  <div className="relative flex items-center justify-center p-6 rounded-full bg-gradient-to-br from-[#0a192f] to-[#020c1b] border-[3px] border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.8)] animate-[pulse_4s_ease-in-out_infinite]">
    <div className="absolute inset-0 rounded-full border border-blue-400 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50"></div>
    <span className="text-white font-black tracking-[0.2em] text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10">{data.label}</span>
    <Handle type="source" position={Position.Bottom} className="!w-4 !h-4 !bg-blue-400 !border-2 !border-white !shadow-[0_0_15px_#60a5fa] !-bottom-2" />
  </div>
);

const CategoryNode = ({ data }: NodeProps<CategoryNodeType>) => (
  <div className="px-6 py-3 rounded-xl bg-[#0f172a]/80 backdrop-blur-md border border-slate-600 shadow-[0_0_20px_rgba(100,116,139,0.3)] flex items-center gap-3 transition-transform hover:scale-105">
    <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-slate-300 !border-2 !border-slate-800 !-top-1.5" />
    <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${data.color}`}></div>
    <span className="text-slate-100 font-bold uppercase tracking-wide text-sm">{data.label}</span>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-slate-500 !border-2 !border-slate-800 !-bottom-1.5" />
  </div>
);

const TaskNode = ({ data }: NodeProps<TaskNodeType>) => {
  const statusConfig: Record<TaskStatus, { color: string; bg: string; border: string; bar: string; glow: string }> = {
    done: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', bar: 'w-full bg-emerald-500', glow: 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
    in_progress: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', bar: 'w-1/2 bg-blue-500', glow: 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' },
    review: { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', bar: 'w-3/4 bg-purple-500', glow: 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' },
    backlog: { color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30', bar: 'w-0 bg-slate-500', glow: 'border-slate-700' }
  };
  const config = statusConfig[data.status];

  return (
    <div className={`w-64 p-4 rounded-lg bg-gradient-to-b from-[#1e293b] to-[#0f172a] border transition-all hover:-translate-y-1 group ${config.glow}`}>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-400 !border-none !-top-1 opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded shadow-inner">{data.taskId}</span>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors duration-500 ${config.bg} ${config.color} ${config.border}`}>
          {data.status.replace('_', ' ').toUpperCase()}
        </div>
      </div>
      <h4 className="text-slate-200 font-semibold text-sm leading-tight group-hover:text-white transition-colors">{data.label}</h4>
      <div className="mt-3 flex justify-between items-center border-t border-slate-700/50 pt-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-[9px] font-bold text-white border border-slate-800 shadow-sm">{data.assignee}</div>
        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div className={`h-full rounded-full transition-all duration-500 ${config.bar}`}></div>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = { core: CoreNode, category: CategoryNode, task: TaskNode };

// ==========================================
// 3. COMPONENTE PRINCIPAL (Blindado con Tipos)
// ==========================================
// NOTA: Declaramos explícitamente que esto devuelve un React.JSX.Element
export default function NeuralMap({ tasks }: NeuralMapProps): React.JSX.Element {
  
  // MAGIA MATEMÁTICA: Tipamos explícitamente el retorno de useMemo
  const { generatedNodes, generatedEdges } = useMemo<{ generatedNodes: AppNode[]; generatedEdges: Edge[] }>(() => {
    const nodes: AppNode[] = [];
    const edges: Edge[] = [];
    
    if (!tasks || tasks.length === 0) {
      return { generatedNodes: nodes, generatedEdges: edges };
    }

    const categories = Array.from(new Set(tasks.map(t => t.category)));
    const colors = ['bg-purple-500 text-purple-500', 'bg-blue-500 text-blue-500', 'bg-emerald-500 text-emerald-500', 'bg-amber-500 text-amber-500', 'bg-pink-500 text-pink-500'];

    const startX = 50;
    const spacingX = 280;

    categories.forEach((cat, index) => {
      const catId = `cat-${cat}`;
      const catX = startX + (index * spacingX);

      nodes.push({
        id: catId,
        type: 'category',
        data: { label: cat, color: colors[index % colors.length] },
        position: { x: catX, y: 250 }
      });

      edges.push({
        id: `e-core-${catId}`,
        source: 'core',
        target: catId,
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 3, filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.5))' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
      });

      const catTasks = tasks.filter(t => t.category === cat);
      catTasks.forEach((task, tIndex) => {
        const taskNodeId = `t-${task.id}`;
        nodes.push({
          id: taskNodeId,
          type: 'task',
          data: { taskId: task.id, label: task.title, status: task.status, assignee: task.assignee },
          position: { x: catX - 40, y: 400 + (tIndex * 150) }
        });
        
        edges.push({
          id: `e-${catId}-${taskNodeId}`,
          source: catId,
          target: taskNodeId,
          type: 'smoothstep',
          style: { stroke: '#475569', strokeWidth: 2 }
        });
      });
    });

    const coreX = categories.length > 0 
      ? startX + ((categories.length - 1) * spacingX) / 2 + 30 
      : 450;

    nodes.unshift({ 
      id: 'core', 
      type: 'core', 
      data: { label: 'SYNAPSE' }, 
      position: { x: coreX, y: 50 } 
    });

    // Este es el return interno que TypeScript perdía de vista
    return { generatedNodes: nodes, generatedEdges: edges };
  }, [tasks]);

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(generatedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(generatedEdges);

  useEffect(() => {
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [generatedNodes, generatedEdges, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log(`[SYNAPSE_LINK] Accediendo a datos de: ${node.id}`);
  }, []);

  // Este es el return principal que lo convierte en un JSX Component válido
  return (
    <div className="w-full h-[650px] bg-[#020617] rounded-2xl border border-slate-800 overflow-hidden relative shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[0%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
        className="z-10"
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Controls className="!bg-[#0f172a] !border-slate-700 !fill-slate-300 shadow-xl [&>button]:!border-b-slate-700 hover:[&>button]:!bg-slate-800" />
      </ReactFlow>
      
      <div className="absolute top-6 left-6 pointer-events-none z-20">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
          <span className="text-emerald-400 text-[10px] font-black tracking-widest uppercase">Live Sync Active</span>
        </div>
        <h2 className="text-white font-bold text-xl drop-shadow-md">TOPOLOGÍA DE PROYECTOS</h2>
        <p className="text-slate-500 text-xs font-mono mt-1">Conectado al Tablero Kanban</p>
      </div>

      <div className="absolute bottom-6 right-6 bg-[#0f172a]/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl flex flex-col gap-2 pointer-events-none z-20 shadow-2xl">
        <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
          <span className="w-3 h-0.5 bg-blue-500 shadow-[0_0_5px_#3b82f6]"></span> Flujo Primario
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
          <span className="w-3 h-0.5 bg-slate-500"></span> Dependencia Tarea
        </div>
      </div>
    </div>
  );
}