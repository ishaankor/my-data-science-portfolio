'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Terminal,
  Cpu,
  BrainCircuit,
  Bot,
  Zap,
  Sparkles,
  CheckCircle2,
  Play,
  RotateCcw,
  Activity,
  Layers,
  ArrowRight,
  Database,
  Radio,
} from 'lucide-react';

interface AgentScenario {
  id: string;
  name: string;
  shortTag: string;
  toolName: string;
  category: string;
  color: string;
  glowColor: string;
  prompt: string;
  thought: string;
  toolCall: string;
  executionLog: string;
  resultPayload: {
    title: string;
    metric: string;
    detail: string;
  };
}

const AGENT_SCENARIOS: AgentScenario[] = [
  {
    id: 'mcp-router',
    name: 'Model Context Protocol (MCP)',
    shortTag: 'MCP Tool Router',
    toolName: 'mcp.route_tool_call()',
    category: 'Agentic Infrastructure',
    color: '#a855f7', // Purple
    glowColor: 'rgba(168, 85, 247, 0.3)',
    prompt: 'Query knowledge base for UCSD ML evaluation baselines and dispatch tool.',
    thought: 'Decomposing intent -> selecting vector search server & persistent memory slot...',
    toolCall: 'mcp.query_vector_store({ collection: "ucsd_ml_eval", top_k: 5 })',
    executionLog: 'FastAPI MCP Server: Tool response dispatched via SSE streaming (18ms)',
    resultPayload: {
      title: 'IshaanBot MCP Engine',
      metric: '15+ Composable Tools',
      detail: 'Context-aware dynamic tool routing & persistent memory session active.',
    },
  },
  {
    id: 'datafy-copilot',
    name: 'LangGraph Agentic Canvas',
    shortTag: 'Datafy AI Copilot',
    toolName: 'agent.generate_visual_canvas()',
    category: 'Autonomous Workflows',
    color: '#818cf8', // Indigo
    glowColor: 'rgba(129, 140, 248, 0.3)',
    prompt: 'Ingest raw CSV dataset, fit predictive distributions, and render narrative insights.',
    thought: 'Constructing multi-agent node graph: [Parser] -> [Statistical Analyzer] -> [Canvas Renderer]',
    toolCall: 'langchain.agent.execute({ dataset: "telemetry.csv", target: "conversion_rate" })',
    executionLog: 'Multi-Agent Graph converged: 99.4% confidence • Zero hallucination validation',
    resultPayload: {
      title: 'Datafy Analytics Engine',
      metric: '25,000+ Weekly Requests',
      detail: 'Automated statistical narrative generation with 99% error-free execution.',
    },
  },
  {
    id: 'transformi-ml',
    name: 'Discord ML Bot Engine',
    shortTag: 'Transformi ML Bot',
    toolName: 'scikit.fit_regression_model()',
    category: 'Neural Computation',
    color: '#38bdf8', // Cyan
    glowColor: 'rgba(56, 189, 248, 0.3)',
    prompt: 'Parse unstructured Discord attachment and fit linear regression with residual plots.',
    thought: 'Validating tensor dimensions -> standardizing features -> fitting Scikit-Learn pipeline',
    toolCall: 'scikit.linear_model.Ridge(alpha=0.5).fit(X_train, y_train)',
    executionLog: 'Model converged: R² = 0.948, MSE = 0.012 • Visual plot rendered to Discord channel',
    resultPayload: {
      title: 'Transformi ML Discord Bot',
      metric: '10,000+ Bot Users',
      detail: 'Parallelized asynchronous ETL & automated scatterplot regression generation.',
    },
  },
  {
    id: 'github-meta',
    name: 'Live GitHub API Telemetry',
    shortTag: 'Real-time API Sync',
    toolName: 'api.sync_github_telemetry()',
    category: 'Data Products',
    color: '#f97316', // Ember
    glowColor: 'rgba(249, 115, 22, 0.3)',
    prompt: 'Pull live repository metadata, calculate language distributions, and sync diurnal commits.',
    thought: 'Querying GitHub v3 REST API -> computing diurnal 24h scatterplot -> caching static json',
    toolCall: 'fetch("https://github-meta-fetcher.vercel.app/api/github")',
    executionLog: '18 public repositories synchronized • 304 commits indexed across history',
    resultPayload: {
      title: 'Interactive Portfolio Meta',
      metric: 'Real-time API Telemetry',
      detail: 'Client-side diurnal scatterplot & 7x24 commit rhythm live tracking.',
    },
  },
];

export default function HeroAgenticConsole() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [streamProgress, setStreamProgress] = useState<number>(100);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [tokenCounter, setTokenCounter] = useState<number>(142);

  const activeScenario = AGENT_SCENARIOS[activeScenarioIdx];

  // Token speed jitter for live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenCounter(138 + Math.floor(Math.random() * 9));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Trigger streaming animation on scenario change
  const triggerStream = useCallback((idx: number) => {
    setActiveScenarioIdx(idx);
    setStreamProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 15;
      if (step >= 100) {
        setStreamProgress(100);
        clearInterval(interval);
      } else {
        setStreamProgress(step);
      }
    }, 60);
  }, []);

  // Auto-cycle through agent scenarios if not manually paused
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveScenarioIdx((prev) => {
        const next = (prev + 1) % AGENT_SCENARIOS.length;
        triggerStream(next);
        return next;
      });
    }, 7000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, triggerStream]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-[#080c16]/95 backdrop-blur-md rounded-2xl border border-line shadow-panel relative overflow-hidden font-mono text-xs select-none group">
      
      {/* Ambient Radial Glowing Aura matching active scenario */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-colors duration-700 opacity-20"
        style={{ backgroundColor: activeScenario.color }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-colors duration-700 opacity-15"
        style={{ backgroundColor: '#818cf8' }}
      />

      {/* 1. Terminal Window Header */}
      <div className="flex items-center justify-between gap-3 border-b border-line pb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-bold text-bone text-[0.72rem] ml-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-ember" />
            <span>ishaan.agent</span>
            <span className="text-muted font-normal text-[0.65rem] hidden sm:inline">--protocol=mcp-v1</span>
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[0.68rem]">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE {tokenCounter} tok/s</span>
          </span>
        </div>
      </div>

      {/* 2. Interactive Scenario Selector Chips */}
      <div className="py-2.5 flex flex-wrap items-center gap-1.5 relative z-10 border-b border-line/60">
        {AGENT_SCENARIOS.map((scenario, idx) => {
          const isSelected = activeScenarioIdx === idx;
          return (
            <button
              key={scenario.id}
              onClick={() => {
                setIsAutoPlaying(false);
                triggerStream(idx);
              }}
              className={`px-2.5 py-1 rounded-md text-[0.68rem] transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-surface border font-bold text-bone shadow-sm'
                  : 'bg-ink/60 border border-line/70 text-muted hover:text-bone hover:border-line'
              }`}
              style={{
                borderColor: isSelected ? scenario.color : undefined,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: scenario.color }} />
              <span>{scenario.shortTag}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Live Execution Feed & Thought Trace */}
      <div className="my-2.5 space-y-2 relative z-10 flex-1 flex flex-col justify-between overflow-hidden">
        
        {/* Prompt Input Line */}
        <div className="p-2.5 rounded-lg bg-ink/80 border border-line space-y-1">
          <div className="flex items-center justify-between text-[0.65rem] text-muted">
            <span className="uppercase tracking-wider flex items-center gap-1 text-bone-dim">
              <Sparkles className="w-3 h-3 text-ember" />
              <span>Agent Goal &amp; Intent</span>
            </span>
            <span className="text-[0.62rem] text-purple-300 font-semibold">{activeScenario.category}</span>
          </div>
          <p className="text-bone text-[0.72rem] leading-relaxed truncate">
            &gt; {activeScenario.prompt}
          </p>
        </div>

        {/* Live Reasoning & Tool Call Box */}
        <div className="p-3 rounded-lg bg-[#050811] border border-line space-y-2 relative overflow-hidden">
          
          {/* Top Step: Agent Reasoning */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[0.65rem] font-bold" style={{ color: activeScenario.color }}>
              <BrainCircuit className="w-3 h-3 animate-pulse" />
              <span>[REASONING ENGINE]</span>
            </div>
            <p className="text-bone-dim text-[0.68rem] leading-snug line-clamp-2">
              {activeScenario.thought}
            </p>
          </div>

          {/* Middle Step: Tool Call Invocation */}
          <div className="p-2 rounded bg-ink/90 border border-line/80 flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-[0.62rem] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold shrink-0">
                TOOL_CALL
              </span>
              <span className="text-[0.68rem] text-cyan-300 font-semibold truncate">
                {activeScenario.toolCall}
              </span>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>

          {/* Bottom Execution Status */}
          <p className="text-emerald-400 text-[0.64rem] truncate flex items-center gap-1">
            <span>✓</span>
            <span>{activeScenario.executionLog}</span>
          </p>
        </div>

        {/* Output Result Card */}
        <div
          className="p-3 rounded-lg border bg-surface/90 flex items-center justify-between gap-3 transition-all"
          style={{ borderColor: activeScenario.color }}
        >
          <div className="space-y-0.5 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="font-bold text-bone text-xs truncate">{activeScenario.resultPayload.title}</span>
              <span
                className="text-[0.62rem] px-2 py-0.2 rounded-full font-bold text-ink shrink-0"
                style={{ backgroundColor: activeScenario.color }}
              >
                {activeScenario.resultPayload.metric}
              </span>
            </div>
            <p className="text-bone-dim text-[0.65rem] truncate">
              {activeScenario.resultPayload.detail}
            </p>
          </div>
        </div>

      </div>

      {/* 4. Live Telemetry Strip Footer */}
      <div className="pt-2.5 border-t border-line flex items-center justify-between font-mono text-[0.65rem] text-muted relative z-10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-bone-dim">
            <Database className="w-3 h-3 text-cyan-400" />
            <span>Memory: Vector Store</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-bone-dim">Zero Latency Overhead</span>
        </div>

        <button
          onClick={() => triggerStream(activeScenarioIdx)}
          className="text-ember hover:underline flex items-center gap-1 font-bold"
          title="Re-run simulation"
        >
          <span>Re-run</span>
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
}
