'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Sparkles,
  ExternalLink,
  RotateCcw,
  Maximize2,
  Info,
  Compass,
  Cpu,
  BrainCircuit,
  Bot,
  Database,
  Layout,
  GitBranch,
  Layers,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import githubCache from '@/data/github-cache.json';
import { portfolioData } from '@/data/portfolio';

interface DomainHub {
  id: string;
  name: string;
  shortName: string;
  color: string;
  haloColor: string;
  description: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isHub: true;
}

interface RepoNode {
  id: string;
  name: string;
  url: string;
  description: string;
  primaryDomainId: string;
  secondaryDomainId?: string;
  language: string;
  metrics?: string;
  tags?: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isHub: false;
}

type ConstellationNode = DomainHub | RepoNode;

interface ConstellationEdge {
  source: string;
  target: string;
  color: string;
  strength: number;
}

interface StardustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
}

const DOMAINS: Omit<DomainHub, 'x' | 'y' | 'vx' | 'vy'>[] = [
  {
    id: 'frontier-ai',
    name: 'Frontier AI & LLM Systems',
    shortName: 'Frontier AI',
    color: '#818cf8', // Indigo
    haloColor: 'rgba(129, 140, 248, 0.35)',
    description: 'Golden dataset baselines, frontier LLM evaluation, and prompt reasoning strategies.',
    radius: 26,
    isHub: true,
  },
  {
    id: 'agentic-mcp',
    name: 'Agentic Pipelines & MCP',
    shortName: 'Agentic & MCP',
    color: '#a855f7', // Purple
    haloColor: 'rgba(168, 85, 247, 0.35)',
    description: 'Autonomous tool routing, Model Context Protocol servers, and LangGraph multi-agent canvas workflows.',
    radius: 25,
    isHub: true,
  },
  {
    id: 'ml-pipelines',
    name: 'Machine Learning & ETL',
    shortName: 'ML & ETL',
    color: '#38bdf8', // Cyan
    haloColor: 'rgba(56, 189, 248, 0.35)',
    description: 'Scikit-learn, TensorFlow, regression modeling, and high-throughput data processing pipelines.',
    radius: 25,
    isHub: true,
  },
  {
    id: 'dataviz-webgl',
    name: 'Interactive Dataviz & WebGL',
    shortName: 'Dataviz & 3D',
    color: '#f97316', // Ember
    haloColor: 'rgba(249, 115, 22, 0.35)',
    description: 'Three.js 3D shaders, real-time client analytics, and interactive data storytelling.',
    radius: 25,
    isHub: true,
  },
  {
    id: 'automation-infra',
    name: 'Distributed Bots & Infra',
    shortName: 'Automation',
    color: '#10b981', // Emerald
    haloColor: 'rgba(16, 185, 129, 0.35)',
    description: 'Asynchronous event loops, Discord ML bots, automated API fetchers, and serverless cronjobs.',
    radius: 24,
    isHub: true,
  },
];

export default function RepositoryConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<ConstellationNode | null>(null);
  const [pinnedNode, setPinnedNode] = useState<ConstellationNode | null>(null);
  const [activeSearch, setActiveSearch] = useState<string>('');

  // 1. Ingest repositories and map them to domain hubs with curated connections
  const { initialNodes, initialEdges } = useMemo(() => {
    const rawRepos = (githubCache?.repos || []) as any[];
    const curated = portfolioData.projects || [];

    const nodes: ConstellationNode[] = [];
    const edges: ConstellationEdge[] = [];

    // Add Domain Hubs initialized in an orbital ring
    DOMAINS.forEach((d, idx) => {
      const angle = (idx / DOMAINS.length) * Math.PI * 2 - Math.PI / 2;
      const dist = 160;
      nodes.push({
        ...d,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      });
    });

    const addedRepoKeys = new Set<string>();

    const getPrimaryDomain = (name: string, desc: string, lang: string): { primary: string; secondary?: string } => {
      const text = `${name} ${desc} ${lang}`.toLowerCase();
      if (text.includes('mcp') || text.includes('agent') || text.includes('langchain') || text.includes('datafy')) {
        return { primary: 'agentic-mcp', secondary: 'frontier-ai' };
      }
      if (text.includes('llm') || text.includes('eval') || text.includes('nemotron') || text.includes('gpt') || text.includes('gemini')) {
        return { primary: 'frontier-ai', secondary: 'agentic-mcp' };
      }
      if (text.includes('three') || text.includes('portfolio') || text.includes('d3') || text.includes('visual') || text.includes('surgery')) {
        return { primary: 'dataviz-webgl', secondary: 'ml-pipelines' };
      }
      if (text.includes('bot') || text.includes('discord') || text.includes('twitter') || text.includes('fetcher') || text.includes('automation')) {
        return { primary: 'automation-infra', secondary: 'ml-pipelines' };
      }
      return { primary: 'ml-pipelines', secondary: 'automation-infra' };
    };

    // 1. Add curated portfolio projects
    curated.forEach((p, idx) => {
      const key = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      addedRepoKeys.add(key);

      const mapping = getPrimaryDomain(p.title, p.description || '', p.tags.join(' '));
      const angle = (idx / (curated.length || 1)) * Math.PI * 2;
      const dist = 220 + (idx % 3) * 30;

      const node: RepoNode = {
        id: p.id || key,
        name: p.title,
        url: p.githubUrl || p.liveUrl || 'https://github.com/ishaankor',
        description: p.description,
        primaryDomainId: mapping.primary,
        secondaryDomainId: mapping.secondary,
        language: p.tags[0] || 'Code',
        metrics: p.metrics,
        tags: p.tags,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 12,
        isHub: false,
      };

      nodes.push(node);

      edges.push({
        source: node.id,
        target: mapping.primary,
        color: DOMAINS.find((d) => d.id === mapping.primary)?.color || '#38bdf8',
        strength: 0.05,
      });

      if (mapping.secondary) {
        edges.push({
          source: node.id,
          target: mapping.secondary,
          color: DOMAINS.find((d) => d.id === mapping.secondary)?.color || '#818cf8',
          strength: 0.02,
        });
      }
    });

    // 2. Add remaining public GitHub repos
    rawRepos.forEach((r, idx) => {
      const name = r.name || '';
      const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (addedRepoKeys.has(key)) return;
      if (name.startsWith('lab') || name.startsWith('test')) return;
      addedRepoKeys.add(key);

      const mapping = getPrimaryDomain(name, r.description || '', r.language || '');
      const angle = (idx / (rawRepos.length || 1)) * Math.PI * 2 + 1;
      const dist = 240 + (idx % 4) * 25;

      const node: RepoNode = {
        id: `gh-${r.id || name}`,
        name: r.name,
        url: r.html_url || `https://github.com/ishaankor/${r.name}`,
        description: r.description || 'Public engineering repository.',
        primaryDomainId: mapping.primary,
        secondaryDomainId: mapping.secondary,
        language: r.language || 'Code',
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 9,
        isHub: false,
      };

      nodes.push(node);

      edges.push({
        source: node.id,
        target: mapping.primary,
        color: DOMAINS.find((d) => d.id === mapping.primary)?.color || '#38bdf8',
        strength: 0.04,
      });
    });

    // Interconnect Domain Hubs with subtle backbone lines
    for (let i = 0; i < DOMAINS.length; i++) {
      const nextIdx = (i + 1) % DOMAINS.length;
      edges.push({
        source: DOMAINS[i].id,
        target: DOMAINS[nextIdx].id,
        color: '#818cf8',
        strength: 0.015,
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  // Mutable simulation state stored in refs for 60 FPS physics loop
  const nodesRef = useRef<ConstellationNode[]>([]);
  const edgesRef = useRef<ConstellationEdge[]>([]);
  const particlesRef = useRef<StardustParticle[]>([]);
  const draggedNodeRef = useRef<ConstellationNode | null>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize simulation data once
  useEffect(() => {
    nodesRef.current = initialNodes.map((n) => ({ ...n }));
    edgesRef.current = initialEdges.map((e) => ({ ...e }));

    // Generate Stardust Background Particles
    const particles: StardustParticle[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 900,
        y: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
      });
    }
    particlesRef.current = particles;
  }, [initialNodes, initialEdges]);

  // Reset constellation node positions gently
  const handleResetPositions = useCallback(() => {
    nodesRef.current.forEach((n, idx) => {
      if (n.isHub) {
        const hubIdx = DOMAINS.findIndex((d) => d.id === n.id);
        const angle = (hubIdx / DOMAINS.length) * Math.PI * 2 - Math.PI / 2;
        n.x = Math.cos(angle) * 160;
        n.y = Math.sin(angle) * 160;
      } else {
        const angle = (idx / nodesRef.current.length) * Math.PI * 2;
        n.x = Math.cos(angle) * 230;
        n.y = Math.sin(angle) * 230;
      }
      n.vx = 0;
      n.vy = 0;
    });
    setPinnedNode(null);
  }, []);

  // Main Canvas Physics & Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Cosmic Star Dust Particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -width / 2) p.x = width / 2;
        if (p.x > width / 2) p.x = -width / 2;
        if (p.y < -height / 2) p.y = height / 2;
        if (p.y > height / 2) p.y = -height / 2;

        const currentAlpha = p.alpha + Math.sin(time * 2 + p.x) * 0.2;
        ctx.fillStyle = `rgba(168, 85, 247, ${Math.max(0.1, Math.min(0.8, currentAlpha))})`;
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const nodeMap = new Map<string, ConstellationNode>();
      nodes.forEach((n) => nodeMap.set(n.id, n));

      // 2. Physics Simulation: Forces & Repulsion
      // A. Coulomb Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);

          if (dist < 320) {
            const repulsion = (n1.isHub || n2.isHub ? 1200 : 700) / distSq;
            const fx = (dx / dist) * repulsion;
            const fy = (dy / dist) * repulsion;

            if (draggedNodeRef.current !== n1) {
              n1.vx -= fx;
              n1.vy -= fy;
            }
            if (draggedNodeRef.current !== n2) {
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }
      }

      // B. Hooke's Law Spring Forces on Edges
      edges.forEach((e) => {
        const source = nodeMap.get(e.source);
        const target = nodeMap.get(e.target);
        if (!source || !target) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetLength = source.isHub && target.isHub ? 150 : 120;
        const force = (dist - targetLength) * e.strength;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (draggedNodeRef.current !== source) {
          source.vx += fx;
          source.vy += fy;
        }
        if (draggedNodeRef.current !== target) {
          target.vx -= fx;
          target.vy -= fy;
        }
      });

      // C. Center Gravity and Integration
      const activeDomainId = selectedDomain === 'all' ? null : selectedDomain;

      nodes.forEach((n) => {
        if (draggedNodeRef.current === n) {
          // If being dragged, directly position to cursor
          if (mousePosRef.current) {
            n.x = mousePosRef.current.x - cx;
            n.y = mousePosRef.current.y - cy;
            n.vx = 0;
            n.vy = 0;
          }
          return;
        }

        // Center gravity pull
        const distFromCenter = Math.sqrt(n.x * n.x + n.y * n.y) || 1;
        const gravity = n.isHub ? 0.003 : 0.0025;
        n.vx -= n.x * gravity;
        n.vy -= n.y * gravity;

        // Damping velocity
        n.vx *= 0.88;
        n.vy *= 0.88;

        n.x += n.vx;
        n.y += n.vy;

        // Boundary containment
        const maxBoundaryX = width / 2 - 35;
        const maxBoundaryY = height / 2 - 35;
        if (n.x < -maxBoundaryX) {
          n.x = -maxBoundaryX;
          n.vx *= -0.5;
        }
        if (n.x > maxBoundaryX) {
          n.x = maxBoundaryX;
          n.vx *= -0.5;
        }
        if (n.y < -maxBoundaryY) {
          n.y = -maxBoundaryY;
          n.vy *= -0.5;
        }
        if (n.y > maxBoundaryY) {
          n.y = maxBoundaryY;
          n.vy *= -0.5;
        }
      });

      // 3. Render Connecting Cosmic Edges
      edges.forEach((e) => {
        const source = nodeMap.get(e.source);
        const target = nodeMap.get(e.target);
        if (!source || !target) return;

        const isSourceActive = !activeDomainId || (source.isHub ? source.id === activeDomainId : source.primaryDomainId === activeDomainId);
        const isTargetActive = !activeDomainId || (target.isHub ? target.id === activeDomainId : target.primaryDomainId === activeDomainId);
        const isHighlighted = hoveredNode && (hoveredNode.id === source.id || hoveredNode.id === target.id);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx + source.x, cy + source.y);
        ctx.lineTo(cx + target.x, cy + target.y);

        if (isHighlighted) {
          ctx.strokeStyle = e.color;
          ctx.lineWidth = 2.4;
          ctx.shadowColor = e.color;
          ctx.shadowBlur = 12;
        } else if (isSourceActive && isTargetActive) {
          ctx.strokeStyle = 'rgba(129, 140, 248, 0.18)';
          ctx.lineWidth = source.isHub && target.isHub ? 1.2 : 0.8;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 0.5;
        }

        ctx.stroke();
        ctx.restore();

        // Glowing Energy Particle travelling along highlighted edge
        if (isHighlighted) {
          const t = (Math.sin(time * 4) + 1) / 2;
          const px = source.x + (target.x - source.x) * t;
          const py = source.y + (target.y - source.y) * t;
          ctx.save();
          ctx.fillStyle = e.color;
          ctx.shadowColor = e.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(cx + px, cy + py, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // 4. Render Nodes (Domain Hubs & Repositories)
      nodes.forEach((n) => {
        const isHub = n.isHub;
        const isHovered = hoveredNode?.id === n.id;
        const isPinned = pinnedNode?.id === n.id;
        const isFiltered = activeDomainId && (isHub ? n.id !== activeDomainId : n.primaryDomainId !== activeDomainId);
        const hubColor = isHub ? n.color : DOMAINS.find((d) => d.id === n.primaryDomainId)?.color || '#38bdf8';

        ctx.save();
        ctx.translate(cx + n.x, cy + n.y);

        if (isFiltered) {
          ctx.globalAlpha = 0.2;
        }

        // A. Outer Pulsing Ambient Halo
        if (isHub || isHovered || isPinned) {
          const pulse = Math.sin(time * 3 + n.x) * (isHub ? 4 : 3);
          const haloRadius = n.radius + (isHub ? 10 : 6) + pulse;
          const gradient = ctx.createRadialGradient(0, 0, n.radius, 0, 0, haloRadius);
          gradient.addColorStop(0, isHub ? n.haloColor : 'rgba(56, 189, 248, 0.35)');
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // B. Node Circle Body
        ctx.beginPath();
        ctx.arc(0, 0, n.radius, 0, Math.PI * 2);

        if (isHub) {
          ctx.fillStyle = '#090d16';
          ctx.fill();
          ctx.lineWidth = isHovered ? 3.5 : 2.5;
          ctx.strokeStyle = n.color;
          ctx.shadowColor = n.color;
          ctx.shadowBlur = isHovered ? 18 : 10;
          ctx.stroke();

          // Inner Hub Core Dot
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.fill();
        } else {
          ctx.fillStyle = isHovered ? hubColor : '#131826';
          ctx.fill();
          ctx.lineWidth = isHovered ? 2.5 : 1.5;
          ctx.strokeStyle = isHovered ? '#ffffff' : hubColor;
          ctx.shadowColor = hubColor;
          ctx.shadowBlur = isHovered ? 12 : 5;
          ctx.stroke();

          // Inner Star Spec
          ctx.beginPath();
          ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? '#ffffff' : hubColor;
          ctx.fill();
        }

        // C. Typography Label Below Node
        ctx.restore();
        ctx.save();
        ctx.translate(cx + n.x, cy + n.y);

        if (!isFiltered || isHovered) {
          ctx.font = isHub ? 'bold 11px ui-monospace, monospace' : '500 9.5px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          if (isHub) {
            ctx.fillStyle = isHovered ? '#ffffff' : n.color;
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 4;
            ctx.fillText(n.shortName, 0, n.radius + 6);
          } else {
            ctx.fillStyle = isHovered ? '#f8fafc' : 'rgba(203, 213, 225, 0.75)';
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 4;
            const displayName = n.name.length > 18 ? `${n.name.substring(0, 16)}…` : n.name;
            ctx.fillText(displayName, 0, n.radius + 4);
          }
        }

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedDomain, hoveredNode, pinnedNode]);

  // Dynamic Canvas Resizing for Sharp High-DPI Displays
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = 480 * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `480px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer Interaction Handlers (Click, Drag, Hover)
  const getCanvasMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const findNodeUnderCursor = (pos: { x: number; y: number }): ConstellationNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const cx = canvas.clientWidth / 2;
    const cy = canvas.clientHeight / 2;

    // Search in reverse so top-drawn nodes get hit first
    for (let i = nodesRef.current.length - 1; i >= 0; i--) {
      const node = nodesRef.current[i];
      const dx = pos.x - (cx + node.x);
      const dy = pos.y - (cy + node.y);
      const hitRadius = node.radius + 10;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return node;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasMousePos(e);
    const node = findNodeUnderCursor(pos);
    if (node) {
      draggedNodeRef.current = node;
      mousePosRef.current = pos;
      setPinnedNode(node);
    } else {
      setPinnedNode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasMousePos(e);
    mousePosRef.current = pos;

    if (draggedNodeRef.current) {
      return;
    }

    const node = findNodeUnderCursor(pos);
    setHoveredNode(node);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = node ? 'pointer' : 'grab';
    }
  };

  const handleMouseUp = () => {
    draggedNodeRef.current = null;
  };

  const activeInspectNode = pinnedNode || hoveredNode;

  return (
    <ScrollReveal direction="up" delay={0.15}>
      <div className="rounded-xl border border-line bg-surface p-7 sm:p-8 shadow-panel space-y-6 relative overflow-hidden">
        
        {/* Ambient Cosmic Purple/Cyan Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

        {/* 1. Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-line pb-6">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-ember" />
              Physics-Driven Architecture Network
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-bone flex items-center gap-2.5">
              <span>Repository &amp; Domain Constellation</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                Force-Directed Graph
              </span>
            </h2>
            <p className="text-bone-dim text-xs sm:text-sm mt-1 max-w-2xl font-mono">
              Interactive celestial map interconnecting public repositories with core AI, machine learning, agentic MCP, and dataviz domains.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            <button
              onClick={handleResetPositions}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-ink border border-line hover:border-ember/50 text-bone-dim hover:text-bone transition-colors"
              title="Reset constellation node physics"
            >
              <RotateCcw className="w-3.5 h-3.5 text-ember" />
              <span>Re-Center</span>
            </button>
          </div>
        </div>

        {/* 2. Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-muted text-[0.7rem] uppercase tracking-wider mr-1">Focus Domain:</span>
          <button
            onClick={() => setSelectedDomain('all')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedDomain === 'all'
                ? 'bg-ember text-ink font-bold shadow-md shadow-ember/20 border-ember'
                : 'bg-ink border-line text-muted hover:text-bone hover:border-line/80'
            }`}
          >
            All Constellations
          </button>
          {DOMAINS.map((d) => {
            const isSelected = selectedDomain === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(isSelected ? 'all' : d.id)}
                className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-surface border-white text-bone font-bold shadow-md'
                    : 'bg-ink border-line text-muted hover:text-bone hover:border-line/80'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Interactive Constellation Canvas Container */}
        <div
          ref={containerRef}
          className="relative rounded-xl border border-line bg-[#060911] shadow-inner overflow-hidden min-h-[480px] flex items-center justify-center"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-[480px] block cursor-grab active:cursor-grabbing"
          />

          {/* Floating Instructions Pill (Top-Left) */}
          <div className="absolute top-4 left-4 pointer-events-none font-mono text-[0.68rem] text-muted/80 bg-ink/75 border border-line/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Click &amp; drag nodes • Hover to inspect interconnected beams</span>
          </div>

          {/* Floating Node Inspection HUD Card (Top-Right / Bottom-Right) */}
          {activeInspectNode && (
            <div className="absolute bottom-4 right-4 z-30 p-4 rounded-xl bg-surface/95 border border-ember/40 backdrop-blur-md shadow-2xl font-mono text-xs max-w-sm w-full space-y-2.5 animate-fade-in">
              <div className="flex items-start justify-between gap-3 border-b border-line pb-2">
                <div>
                  <span className="text-[0.65rem] uppercase tracking-wider text-ember font-bold block">
                    {activeInspectNode.isHub ? 'Core Domain Hub' : 'Repository Star'}
                  </span>
                  <h4 className="font-bold text-bone text-sm truncate">{activeInspectNode.name}</h4>
                </div>

                {!activeInspectNode.isHub && (
                  <a
                    href={(activeInspectNode as RepoNode).url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md bg-ember/10 border border-ember/40 text-ember hover:bg-ember/20 transition-colors shrink-0"
                    title="Open on GitHub"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <p className="text-bone-dim text-xs leading-relaxed line-clamp-3">
                {activeInspectNode.description || 'Interconnected node in Ishaan Koradia’s open-source galaxy.'}
              </p>

              {!activeInspectNode.isHub ? (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded bg-ink border border-line text-[0.68rem] text-cyan-400 font-semibold">
                    {(activeInspectNode as RepoNode).language}
                  </span>
                  {(activeInspectNode as RepoNode).metrics && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[0.68rem] text-emerald-300 font-medium">
                      {(activeInspectNode as RepoNode).metrics}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-[0.7rem] text-purple-300 pt-1 font-medium">
                  {initialNodes.filter((n) => !n.isHub && (n as RepoNode).primaryDomainId === activeInspectNode.id).length} connected repositories in this orbit
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Constellation Legend / Domain Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs pt-2 border-t border-line/60">
          {DOMAINS.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelectedDomain(selectedDomain === d.id ? 'all' : d.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedDomain === d.id
                  ? 'bg-surface border-white text-bone shadow-md'
                  : 'bg-ink/60 border-line/60 text-muted hover:bg-ink hover:text-bone'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: d.color }} />
                <span className="font-bold text-[0.72rem] text-bone truncate">{d.shortName}</span>
              </div>
              <p className="text-[0.65rem] text-muted line-clamp-2 leading-tight">
                {d.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </ScrollReveal>
  );
}
