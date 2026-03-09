// ARCHIVO: components/comunications/DistributionNetwork.tsx
'use client';

import React, { useCallback, useMemo, useEffect, useState } from 'react';
import {
  ReactFlow,
  Edge,
  Node,
  Position,
  Handle,
  useNodesState,
  useEdgesState,
  NodeProps,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import { 
  Server, 
  Folder, 
  FileText, 
  Lock, 
  Globe, 
  User, 
  Layers, 
  Share2, 
  X, 
  Copy, 
  ExternalLink,
  Calendar,
  ShieldAlert,
  Zap
} from 'lucide-react';

// ==========================================
// 1. TIPADOS
// ==========================================
export type AccessLevel = 'global' | 'group' | 'user' | 'ghost';

export interface DistResource {
  id: string;
  title: string;
  category: string;
  folder_id: string | null;
  is_public: boolean;
  file_type?: string;
  file_size?: number | string | null;
  tags?: string[];
  created_at?: string;
  profiles?: { full_name?: string | null; avatar_url?: string | null } | null;
}

export interface DistFolder {
  id: string;
  name: string;
  parent_id: string | null;
  category?: string | null;
  is_global?: boolean | number;
}

export interface DistributionNetworkProps {
  resources: DistResource[];
  folders: DistFolder[];
  selectedCategory: string;
  searchTerm: string;
}

export type DbHubData = { label: string; load: string };
export type CategoryData = { id: string; label: string; icon: React.ReactNode };
export type FolderData = { id: string; label: string; isGlobal: boolean };
export type ResourceData = { id: string; title: string; type: string; access: AccessLevel; size: string };

export type DbHubNodeType = Node<DbHubData, 'hub'>;
export type CategoryNodeType = Node<CategoryData, 'category'>;
export type FolderNodeType = Node<FolderData, 'folder'>;
export type ResourceNodeType = Node<ResourceData, 'resource'>;

export type InfrastructureNode = DbHubNodeType | CategoryNodeType | FolderNodeType | ResourceNodeType;

// ==========================================
// 2. NODOS UIX PREMIUM (FASE BLUE)
// ==========================================

const DbHubNode = ({ data }: NodeProps<DbHubNodeType>) => (
  <div className="relative flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#030712]/90 backdrop-blur-md border border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.4)] group animate-in zoom-in-75 fade-in duration-700 ease-out">
    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-400/50 animate-[spin_4s_linear_infinite]"></div>
    <div className="absolute inset-[-10px] rounded-full border-b-2 border-l-2 border-blue-600/30 animate-[spin_6s_linear_infinite_reverse]"></div>
    
    <div className="absolute inset-2 rounded-full bg-gradient-to-b from-blue-900/40 to-transparent flex flex-col items-center justify-center">
      <Server className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 mb-1 md:mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] group-hover:scale-110 transition-transform" />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 font-black tracking-[0.2em] text-xs md:text-sm uppercase z-10">{data.label}</span>
      <span className="text-cyan-300 text-[8px] md:text-[9px] font-mono mt-1 md:mt-2 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800/50 z-10 flex items-center gap-1">
        <Zap className="w-2 h-2 md:w-3 md:h-3 text-yellow-400" />
        {data.load}
      </span>
    </div>
    <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-slate-900 !shadow-[0_0_15px_#22d3ee] !-right-1.5" />
  </div>
);

const CategoryNode = ({ data }: NodeProps<CategoryNodeType>) => (
  <div className="w-48 md:w-56 px-3 py-2 md:px-4 md:py-3 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-500/50 shadow-lg flex items-center gap-2 md:gap-3 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:-translate-y-1 group animate-in slide-in-from-left-8 fade-in duration-500 ease-out fill-mode-both">
    <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-slate-600 !border-none !-left-1" />
    <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg bg-slate-800/80 flex items-center justify-center border border-slate-600 group-hover:border-cyan-400/50 group-hover:bg-cyan-950/30 transition-colors">
      <div className="text-cyan-400 group-hover:scale-110 transition-transform flex items-center justify-center scale-75 md:scale-100">
        {data.icon}
      </div>
    </div>
    <div className="flex flex-col overflow-hidden">
      <span className="text-[8px] md:text-[9px] text-slate-500 font-mono tracking-widest uppercase">Carpeta</span>
      <span className="text-slate-200 font-bold uppercase tracking-wide text-[10px] md:text-xs group-hover:text-cyan-300 transition-colors truncate">{data.label}</span>
    </div>
    <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-cyan-500 !border-none !-right-1" />
  </div>
);

const FolderNode = ({ data }: NodeProps<FolderNodeType>) => (
  <div className="px-3 py-2 md:px-4 md:py-2.5 rounded-lg bg-[#0f172a]/90 backdrop-blur-md border border-slate-700/80 flex items-center gap-2 hover:border-blue-400/60 hover:bg-blue-950/20 transition-all shadow-md group animate-in slide-in-from-bottom-4 fade-in duration-500 ease-out fill-mode-both">
    <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-slate-600 !border-none !-left-1" />
    <Folder className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 ${data.isGlobal ? 'text-cyan-400' : 'text-blue-400'} group-hover:fill-current/20`} />
    <span className="text-slate-200 font-semibold text-[10px] md:text-[11px] uppercase tracking-wider truncate max-w-[100px] md:max-w-[120px]">{data.label}</span>
    <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-slate-500 !border-none !-right-1 group-hover:!bg-blue-400" />
  </div>
);

const ResourceNode = ({ data }: NodeProps<ResourceNodeType>) => {
  const styles = {
    global: { border: 'border-cyan-500/30 hover:border-cyan-400', glow: 'hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]', badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', icon: <Globe className="w-2.5 h-2.5 md:w-3 md:h-3" />, label: 'GLOBAL' },
    group: { border: 'border-blue-500/30 hover:border-blue-400', glow: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]', badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: <Share2 className="w-2.5 h-2.5 md:w-3 md:h-3" />, label: 'COMPARTIDO' },
    user: { border: 'border-indigo-500/30 hover:border-indigo-400', glow: 'hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]', badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: <User className="w-2.5 h-2.5 md:w-3 md:h-3" />, label: 'DIRECTO' },
    ghost: { border: 'border-slate-800 border-dashed opacity-50 grayscale blur-[0.5px]', glow: '', badgeBg: 'bg-slate-800/50 text-slate-500 border-slate-700', icon: <Lock className="w-2.5 h-2.5 md:w-3 md:h-3" />, label: 'LOCKED' }
  };
  const currentStyle = styles[data.access] || styles.user;

  return (
    <div className={`w-48 md:w-56 p-3 md:p-3.5 rounded-xl bg-[#0b1120]/95 backdrop-blur-md border ${currentStyle.border} ${currentStyle.glow} transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 animate-in zoom-in-90 fade-in duration-500 ease-out fill-mode-both`}>
      <Handle type="target" position={Position.Left} className="!w-1.5 !h-1.5 !bg-slate-600 !border-none !-left-1" />
      <div className="flex justify-between items-center mb-2 md:mb-2.5 gap-2">
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-700 px-1.5 md:px-2 py-0.5 rounded-md shrink-0">
          <FileText className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400" />
          <span className="text-[8px] md:text-[9px] font-mono text-slate-300 truncate max-w-[40px] md:max-w-[60px]">{data.type}</span>
        </div>
        <div className={`flex items-center gap-1 text-[7px] md:text-[8px] font-black uppercase tracking-widest px-1.5 md:px-2 py-1 rounded border ${currentStyle.badgeBg}`}>
          {currentStyle.icon}
          {currentStyle.label}
        </div>
      </div>
      <h4 className={`text-xs md:text-sm font-bold leading-tight line-clamp-2 transition-colors ${data.access === 'ghost' ? 'text-slate-500' : 'text-slate-100 group-hover:text-cyan-300'}`}>
        {data.title}
      </h4>
      {data.access !== 'ghost' && (
        <div className="mt-2 md:mt-3 flex justify-between items-end gap-2">
          <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-slate-600 w-1/3 group-hover:bg-cyan-500/50 transition-colors"></div>
          </div>
          <div className="text-[9px] md:text-[10px] text-slate-500 font-mono tracking-wider shrink-0">{data.size}</div>
        </div>
      )}
    </div>
  );
};

const nodeTypes = { hub: DbHubNode, category: CategoryNode, folder: FolderNode, resource: ResourceNode };

// Helpers
const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case 'Comunicaciones': return <Share2 className="w-5 h-5" />;
    case 'Admisión': return <User className="w-5 h-5" />;
    case 'Gestión de Personas': return <User className="w-5 h-5" />;
    default: return <Layers className="w-5 h-5" />;
  }
};

const formatBytes = (bytes?: number | string | null) => {
  if (bytes === null || bytes === undefined) return 'N/A';
  const b = Number(bytes);
  if (isNaN(b)) return String(bytes);
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
};

const normalizeCategory = (cat?: string | null) => {
  if (!cat) return 'Inicio';
  const checkStr = cat.trim().toUpperCase();
  if (checkStr === 'OTROS' || checkStr === 'GENERAL' || checkStr === 'INICIO') return 'Inicio';
  return cat;
};

const getInitials = (name?: string | null) => {
  if (!name) return 'UN';
  const parts = name.trim().split(' ');
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Fecha desconocida';
  try {
    return new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr));
  } catch (e) {
    return 'Fecha inválida';
  }
};

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
export default function DistributionNetwork({ resources, folders, selectedCategory, searchTerm }: DistributionNetworkProps): React.JSX.Element {
  
  const [selectedNodeResource, setSelectedNodeResource] = useState<DistResource | null>(null);

  const { generatedNodes, generatedEdges } = useMemo(() => {
    const nodes: InfrastructureNode[] = [];
    const edges: Edge[] = [];
    
    const isShowAll = selectedCategory === 'Inicio' || selectedCategory === 'Todos';

    const activeRes = resources.filter(r => {
      if (!isShowAll && r.category !== selectedCategory) return false;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        return r.title.toLowerCase().includes(s) || (r.tags?.some(t => t.toLowerCase().includes(s)));
      }
      return true;
    });

    const folderKeepSet = new Set<string>();
    activeRes.forEach(r => {
      let fId = r.folder_id;
      while (fId) {
        folderKeepSet.add(fId);
        const parent = folders.find(f => f.id === fId);
        fId = parent ? parent.parent_id : null;
      }
    });

    if (searchTerm) {
      folders.forEach(f => {
        if (f.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          let fId: string | null = f.id;
          while (fId) {
            folderKeepSet.add(fId);
            const parent = folders.find(pf => pf.id === fId);
            fId = parent ? parent.parent_id : null;
          }
        }
      });
    }

    const activeFolders = folders.filter(f => {
      if (!isShowAll && f.category !== selectedCategory) return false;
      if (searchTerm && !folderKeepSet.has(f.id)) return false;
      return true;
    });

    const activeFolderIds = new Set(activeFolders.map(f => f.id));

    const activeCats = Array.from(new Set([
      ...activeRes.map(r => normalizeCategory(r.category)),
      ...activeFolders.map(f => normalizeCategory(f.category))
    ])).filter(Boolean);

    const X_START = 320; 
    const X_GAP = 280; 
    const Y_GAP = 85; 
    let currentY = 0;

    const edgeCore = { stroke: '#06b6d4', strokeWidth: 2, animated: true, style: { filter: 'drop-shadow(0 0 5px rgba(6,182,212,0.6))' } };
    const edgeFolder = { stroke: '#3b82f6', strokeWidth: 1.5, type: 'smoothstep' as const, animated: true, strokeDasharray: '5,5' };
    const edgeRes = { stroke: '#475569', strokeWidth: 1.5, type: 'smoothstep' as const };

    activeCats.forEach(cat => {
      const catId = `cat-${cat}`;
      const startY = currentY;

      const catFolders = activeFolders.filter(f => normalizeCategory(f.category) === cat && !f.parent_id);
      
      const processFolder = (folder: DistFolder, depth: number) => {
        const folderId = `fol-${folder.id}`;
        const fStartY = currentY;
        
        const children = activeFolders.filter(f => f.parent_id === folder.id);
        children.forEach(cf => {
          processFolder(cf, depth + 1);
          // 🔥 BUG FIX 1: Faltaba crear la conexión visual entre carpetas anidadas (padre -> hija)
          edges.push({ id: `e-${folderId}-fol-${cf.id}`, source: folderId, target: `fol-${cf.id}`, ...edgeFolder });
        });
        
        const cRes = activeRes.filter(r => r.folder_id === folder.id);
        cRes.forEach(r => {
          const resId = `res-${r.id}`;
          nodes.push({
            id: resId, type: 'resource',
            position: { x: X_START + (depth + 1) * X_GAP, y: currentY },
            // 🔥 BUG FIX 2: Obligamos a React Flow a saber las posiciones antes de animar
            sourcePosition: Position.Right, targetPosition: Position.Left,
            data: { id: r.id, title: r.title, type: r.file_type || 'FILE', access: r.is_public ? 'global' : 'user', size: formatBytes(r.file_size) }
          });
          edges.push({ id: `e-${folderId}-${resId}`, source: folderId, target: resId, ...edgeRes });
          currentY += Y_GAP;
        });

        if (children.length === 0 && cRes.length === 0) currentY += Y_GAP;

        nodes.push({
          id: folderId, type: 'folder',
          position: { x: X_START + depth * X_GAP, y: (fStartY + currentY - Y_GAP) / 2 },
          // 🔥 BUG FIX 2: Obligamos a React Flow a saber las posiciones antes de animar
          sourcePosition: Position.Right, targetPosition: Position.Left,
          data: { id: folder.id, label: folder.name, isGlobal: Boolean(folder.is_global) }
        });
      };

      catFolders.forEach(f => {
        processFolder(f, 1);
        edges.push({ id: `e-${catId}-fol-${f.id}`, source: catId, target: `fol-${f.id}`, ...edgeFolder });
      });

      const directRes = activeRes.filter(r => {
        const isCatMatch = normalizeCategory(r.category) === cat;
        const isOrphan = !r.folder_id || !activeFolderIds.has(r.folder_id);
        return isCatMatch && isOrphan;
      });

      directRes.forEach(r => {
        const resId = `res-${r.id}`;
        nodes.push({
          id: resId, type: 'resource',
          position: { x: X_START + X_GAP, y: currentY },
          sourcePosition: Position.Right, targetPosition: Position.Left,
          data: { id: r.id, title: r.title, type: r.file_type || 'FILE', access: r.is_public ? 'global' : 'user', size: formatBytes(r.file_size) }
        });
        edges.push({ id: `e-${catId}-${resId}`, source: catId, target: resId, ...edgeRes });
        currentY += Y_GAP;
      });

      if (catFolders.length === 0 && directRes.length === 0) currentY += Y_GAP;

      nodes.push({
        id: catId, type: 'category',
        position: { x: X_START, y: (startY + currentY - Y_GAP) / 2 },
        sourcePosition: Position.Right, targetPosition: Position.Left,
        data: { id: catId, label: cat, icon: getCategoryIcon(cat) }
      });
      edges.push({ id: `e-hub-${catId}`, source: 'db-hub', target: catId, type: 'smoothstep', ...edgeCore });
      
      currentY += 60; 
    });

    const hubY = currentY > 0 ? (currentY - 60 - Y_GAP) / 2 : 0;
    nodes.unshift({ 
      id: 'db-hub', type: 'hub', 
      position: { x: 0, y: hubY }, 
      sourcePosition: Position.Right, targetPosition: Position.Right,
      data: { label: 'SYNAPSE', load: `${activeRes.length} Recursos Activos` } 
    });

    return { generatedNodes: nodes, generatedEdges: edges };
  }, [resources, folders, selectedCategory, searchTerm]);

  const [nodes, setNodes, onNodesChange] = useNodesState<InfrastructureNode>(generatedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(generatedEdges);

  useEffect(() => {
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [generatedNodes, generatedEdges, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'resource') {
      const resourceData = resources.find(r => r.id === node.data.id);
      if (resourceData) setSelectedNodeResource(resourceData);
    }
  }, [resources]);

  return (
    <div className="w-full h-[65vh] min-h-[500px] xl:h-[800px] bg-[#030712] rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 -translate-y-1/2 -left-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/10 blur-[100px] md:blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-1/2 -translate-y-1/2 right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-500/5 blur-[80px] md:blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15, maxZoom: 1.1 }}
        className="z-10"
        minZoom={0.05}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#1e293b" />
      </ReactFlow>
      
      {/* HUD HEADER */}
      <div className="absolute top-3 left-3 md:top-6 md:left-6 pointer-events-none z-20 bg-[#0f172a]/80 backdrop-blur-md border border-slate-700/50 p-3 md:p-4 rounded-xl shadow-lg max-w-[calc(100%-1.5rem)]">
        <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-ping shadow-[0_0_12px_#22d3ee]"></div>
          <span className="text-cyan-400 text-[8px] md:text-[10px] font-mono tracking-[0.2em] uppercase truncate">Red en tiempo real</span>
        </div>
        <h2 className="text-slate-100 font-black text-sm md:text-xl tracking-tight uppercase truncate">Recursos IPG Disponibles</h2>
      </div>

      {/* HUD LEYENDA */}
      <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 z-20 bg-[#0f172a]/90 backdrop-blur-md border border-slate-700/50 p-2.5 md:p-4 rounded-xl shadow-2xl pointer-events-none hidden sm:block">
        <h3 className="text-[8px] md:text-[10px] font-black text-slate-400 mb-2 md:mb-4 tracking-[0.2em] uppercase flex items-center gap-2">
          <ShieldAlert className="w-2.5 h-2.5 md:w-3 md:h-3" />
          Niveles de Acceso
        </h3>
        <div className="flex flex-col gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center"><Globe className="w-1.5 h-1.5 md:w-2 md:h-2 text-cyan-400" /></div>
            <span className="text-[8px] md:text-[10px] font-mono text-cyan-400 tracking-wide">PÚBLICO GLOBAL</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center"><User className="w-1.5 h-1.5 md:w-2 md:h-2 text-indigo-400" /></div>
            <span className="text-[8px] md:text-[10px] font-mono text-indigo-400 tracking-wide">DIRECTO / USUARIO</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded bg-slate-800 border border-slate-700 border-dashed flex items-center justify-center"><Lock className="w-1.5 h-1.5 md:w-2 md:h-2 text-slate-500" /></div>
            <span className="text-[8px] md:text-[10px] font-mono text-slate-500 tracking-wide">ACCESO DENEGADO</span>
          </div>
        </div>
      </div>

      {/* MODAL HIGH-END RESPONSIVE */}
      {selectedNodeResource && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedNodeResource(null)}></div>

          <div className="relative w-[95%] sm:w-full max-w-[420px] max-h-[90vh] overflow-y-auto bg-[#0b1120] border border-slate-700/60 rounded-2xl shadow-[0_20px_60px_-15px_rgba(6,182,212,0.2)] z-10 custom-scrollbar animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-3 md:p-4 border-b border-slate-800 bg-[#0f172a]/50 sticky top-0 z-20 backdrop-blur-md">
              <span className="text-[9px] md:text-[10px] font-mono text-cyan-400 tracking-[0.2em] uppercase flex items-center gap-1.5 md:gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
                Detalles del recurso
              </span>
              <button 
                onClick={() => setSelectedNodeResource(null)} 
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="p-4 md:p-6 flex flex-col items-center text-center">
              
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-[#0f172a] border border-slate-700 flex items-center justify-center mb-4 md:mb-5 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)] shrink-0">
                <FileText className="w-8 h-8 md:w-10 md:h-10 text-slate-300 drop-shadow-md" />
              </div>
              
              <h3 className="text-lg md:text-xl font-bold text-slate-100 mb-2 md:mb-2 leading-tight">{selectedNodeResource.title}</h3>
              <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-slate-400 mb-4 md:mb-6 font-mono bg-slate-900/80 px-3 py-1 md:px-4 md:py-1.5 rounded-lg border border-slate-800">
                <span>{formatBytes(selectedNodeResource.file_size)}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span className="uppercase text-cyan-400">{selectedNodeResource.file_type || 'FILE'}</span>
              </div>

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-5 md:mb-6">
                
                <div className="flex flex-col text-left bg-slate-900/50 p-2.5 md:p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <User className="w-2.5 h-2.5 md:w-3 md:h-3" /> Publicado por
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-900/50 flex items-center justify-center text-[8px] md:text-[9px] font-bold text-blue-200 border border-blue-700/50 shrink-0">
                      {getInitials(selectedNodeResource.profiles?.full_name)}
                    </div>
                    <span className="text-[11px] md:text-xs text-slate-200 font-semibold truncate">
                      {selectedNodeResource.profiles?.full_name || 'Sistema'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col text-left bg-slate-900/50 p-2.5 md:p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" /> Registro
                  </span>
                  <span className="text-[11px] md:text-xs text-slate-300 font-mono mt-1">
                    {formatDate(selectedNodeResource.created_at)}
                  </span>
                </div>

                <div className="flex flex-col text-left bg-slate-900/50 p-2.5 md:p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5 md:w-3 md:h-3" /> Carpeta
                  </span>
                  <span className="text-[11px] md:text-xs font-bold text-slate-300 truncate mt-0.5">
                    {normalizeCategory(selectedNodeResource.category)}
                  </span>
                </div>

                <div className="flex flex-col text-left bg-slate-900/50 p-2.5 md:p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-2.5 h-2.5 md:w-3 md:h-3" /> Nivel de Acceso
                  </span>
                  {selectedNodeResource.is_public ? (
                    <span className="text-[11px] md:text-xs font-bold text-cyan-400 mt-0.5 flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5 md:w-3 md:h-3" /> GLOBAL
                    </span>
                  ) : (
                    <span className="text-[11px] md:text-xs font-bold text-indigo-400 mt-0.5 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 md:w-3 md:h-3" /> RESTRINGIDO
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col sm:flex-row gap-2.5 md:gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/resources/${selectedNodeResource.id}`);
                    alert("¡Enlace copiado al portapapeles!"); 
                  }}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 transition-all text-xs font-bold uppercase tracking-wide group"
                >
                  <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Copiar Link
                </button>
                <button
                  onClick={() => window.open(`/resources/${selectedNodeResource.id}`, '_blank', 'noopener,noreferrer')}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-all text-xs font-bold uppercase tracking-wide shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] group"
                >
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  Ver Recurso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}