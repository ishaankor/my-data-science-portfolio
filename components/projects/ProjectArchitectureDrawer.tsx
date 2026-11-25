'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export type BlueprintAccent = 'orange' | 'sky' | 'cyan' | 'emerald';

export interface ArchitectureStage {
  id: string;
  step: string;
  title: string;
  stack: string;
  summary: string;
  input: string;
  output: string;
}

export interface EngineeringDecision {
  title: string;
  detail: string;
}

export interface ProjectArchitectureBlueprint {
  accent: BlueprintAccent;
  stages: ArchitectureStage[];
  decisions: EngineeringDecision[];
}

const ACCENT_TOKENS: Record<
  BlueprintAccent,
  { bar: string; text: string; arrow: string }
> = {
  orange: {
    bar: 'bg-orange-400',
    text: 'text-orange-400',
    arrow: 'text-orange-400/80',
  },
  sky: {
    bar: 'bg-sky-400',
    text: 'text-sky-400',
    arrow: 'text-sky-400/80',
  },
  cyan: {
    bar: 'bg-cyan-400',
    text: 'text-cyan-400',
    arrow: 'text-cyan-400/80',
  },
  emerald: {
    bar: 'bg-emerald-400',
    text: 'text-emerald-400',
    arrow: 'text-emerald-400/80',
  },
};

export const FLAGSHIP_BLUEPRINTS: Record<
  'datafy' | 'rigscouter' | 'ishaanbot',
  ProjectArchitectureBlueprint
> = {
  datafy: {
    accent: 'orange',
    stages: [
      {
        id: 'matrix-parser',
        step: '01',
        title: 'Grid Selection Parser',
        stack: 'React · TypeScript',
        summary:
          'Distinguishes contiguous vs. sparse cell selections on the table and extracts scoped CSV slices without mutating the primary dataset.',
        input: 'Selected cell range',
        output: 'Scoped CSV slice + schema',
      },
      {
        id: 'langgraph-node',
        step: '02',
        title: 'Single-Pass LangGraph',
        stack: 'FastAPI · LangGraph',
        summary:
          'Collapses multi-step ReAct loops into one unified planning and code-synthesis pass, cutting LLM round-trips while keeping statistical checks intact.',
        input: 'User prompt + schema',
        output: 'Validated Python & chart spec',
      },
      {
        id: 'python-sandbox',
        step: '03',
        title: 'Python Sandbox',
        stack: 'Pandas · Scikit-learn',
        summary:
          'Runs dataframe transforms in an isolated REPL and writes Matplotlib plots to disk as Base64 buffers outside the model context window.',
        input: 'Generated Python AST',
        output: 'Summary stats + Base64 plot',
      },
      {
        id: 'model-failover',
        step: '04',
        title: 'OpenRouter Fallback',
        stack: 'Nemotron · Llama · Gemini',
        summary:
          'Fails over across a three-model priority chain during queue spikes and streams interactive Recharts configs alongside written findings.',
        input: 'Computed stats JSON',
        output: 'Interactive chart + brief',
      },
    ],
    decisions: [
      {
        title: 'Single-pass graph over multi-agent loops',
        detail:
          'Early multi-turn ReAct loops stacked 4–6 sequential LLM calls per question and drifted on wide CSVs. Moving to a single-pass LangGraph node cut latency substantially without losing analytical accuracy.',
      },
      {
        title: 'Out-of-band chart serialization',
        detail:
          'Routing raw chart arrays or SVG payloads through the prompt blew past token limits on smaller fallback models. Rendering plots to disk and streaming Base64 directly to the client kept context lean.',
      },
    ],
  },
  rigscouter: {
    accent: 'cyan',
    stages: [
      {
        id: 'multi-scrapers',
        step: '01',
        title: 'Retailer Scrapers',
        stack: 'Python · FastAPI',
        summary:
          'Polls live listings and stock updates across Amazon and eBay (with Newegg and Micro Center pipelines) on rate-aware retry schedules.',
        input: 'Retailer product feeds',
        output: 'Raw price, stock & seller',
      },
      {
        id: 'sku-normalizer',
        step: '02',
        title: 'SKU Normalization',
        stack: 'Prisma · Entity Mapping',
        summary:
          'Maps partner board variants (ASUS Dual, MSI Ventus, Gigabyte OC) back to canonical silicon models like RTX 4070 Super for apples-to-apples pricing.',
        input: 'Noisy partner SKU title',
        output: 'Canonical silicon ID',
      },
      {
        id: 'deal-scorer',
        step: '03',
        title: '0–100 Deal Scoring',
        stack: 'Groq · 90d Price Floors',
        summary:
          'Scores listings against MSRP, 90-day rolling lows, and cross-retailer spread while Groq checks system wattage and CPU/GPU bottleneck fit.',
        input: 'Price + 90d floor',
        output: '0–100 score & rig fit',
      },
      {
        id: 'sse-rls',
        step: '04',
        title: 'SSE Stream & Alerts',
        stack: 'Next.js 15 · Supabase RLS',
        summary:
          'Pushes verified drops to connected browsers over Server-Sent Events and triggers Resend email or Discord alerts when watchlists cross target thresholds.',
        input: 'Watchlist threshold hit',
        output: 'Live SSE push + webhook',
      },
    ],
    decisions: [
      {
        title: 'Filtering manufactured strike-through sales',
        detail:
          'Retailers often raise list prices right before a sale. Anchoring scores to canonical silicon MSRP and 90-day rolling lows filters out inflated "percent-off" discounts.',
      },
      {
        title: 'Server-Sent Events + pooled RLS reads',
        detail:
          'Price updates only flow server-to-client, so lightweight HTTP SSE avoided full WebSocket state overhead while connection-pooled Supabase queries keep watchlist reads under 20ms.',
      },
    ],
  },
  ishaanbot: {
    accent: 'emerald',
    stages: [
      {
        id: 'chat-gateway',
        step: '01',
        title: 'Chat Interface',
        stack: 'Streaming UI · Guardrails',
        summary:
          'Handles visitor questions in an embedded drawer and scopes system instructions strictly to verified portfolio and background context.',
        input: 'Visitor question',
        output: 'Scoped session turn',
      },
      {
        id: 'mcp-router',
        step: '02',
        title: 'FastMCP Tool Host',
        stack: 'Python · FastAPI · Docker',
        summary:
          'Exposes 15+ typed Model Context Protocol tools with JSON-Schema validation so data sources stay cleanly decoupled from model code.',
        input: 'Model tool_call intent',
        output: 'Validated MCP execution',
      },
      {
        id: 'rag-telemetry',
        step: '03',
        title: 'RAG & Live APIs',
        stack: 'Retrieval · Spotify · GitHub',
        summary:
          'Fetches relevant project docs and coursework chunks alongside live Spotify playback state and recent GitHub commit activity.',
        input: 'MCP tool parameters',
        output: 'Grounded docs + live JSON',
      },
      {
        id: 'gemini-cascade',
        step: '04',
        title: 'Model Fallback Chain',
        stack: 'Gemini Multi-Model',
        summary:
          'Routes generation down a prioritized Gemini model list so 429 rate limits or transient spikes never interrupt a streaming reply.',
        input: 'Tool output + history',
        output: 'Streamed grounded reply',
      },
    ],
    decisions: [
      {
        title: 'On-demand MCP tools instead of a giant prompt',
        detail:
          'Packing every project README, resume bullet, and live API snapshot into every system prompt wasted tokens and hurt recall. Exposing discrete MCP tools lets the model pull only what a question needs.',
      },
      {
        title: 'Scoped boundaries + multi-model failover',
        detail:
          'Combining strict domain guardrails with an automatic Gemini model fallback list keeps answers grounded in real work while staying online through rate limits.',
      },
    ],
  },
};

export default function ProjectArchitectureDrawer({
  isOpen,
  blueprint,
}: {
  isOpen: boolean;
  blueprint: ProjectArchitectureBlueprint;
}) {
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);
  const activeStage = blueprint.stages[selectedStageIdx] || blueprint.stages[0];
  const accent = ACCENT_TOKENS[blueprint.accent];

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden"
        >
          <div className="pt-8">
            <div className="rounded-xl border border-line bg-surface/70 shadow-panel overflow-hidden">
              {/* 1. Interactive 4-Stage Pipeline Tabs */}
              <div
                role="tablist"
                aria-label="System pipeline stages"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line border-b border-line"
              >
                {blueprint.stages.map((stage, idx) => {
                  const isSelected = idx === selectedStageIdx;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedStageIdx(idx)}
                      className={`relative px-5 py-4 text-left transition-colors cursor-pointer ${isSelected
                        ? 'bg-surface-elevated'
                        : 'bg-ink/50 hover:bg-surface/80'
                        }`}
                    >
                      {/* Crisp 2px Top Bar for Active Stage */}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 top-0 h-[2px] transition-opacity duration-200 ${accent.bar} ${isSelected ? 'opacity-100' : 'opacity-0'
                          }`}
                      />

                      <div className="flex items-center justify-between font-mono text-[11px] mb-2">
                        <span
                          className={
                            isSelected ? `${accent.text} font-semibold` : 'text-muted'
                          }
                        >
                          {stage.step}
                        </span>
                        {idx < blueprint.stages.length - 1 && (
                          <ArrowRight
                            className={`w-3 h-3 hidden lg:block transition-colors ${isSelected ? accent.arrow : 'text-muted/40'
                              }`}
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <p
                        className={`font-display text-[14px] font-semibold leading-snug transition-colors ${isSelected ? 'text-bone' : 'text-bone-dim/75'
                          }`}
                      >
                        {stage.title}
                      </p>

                      <p className="font-mono text-[11px] text-muted mt-1">
                        {stage.stack}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* 2. Connected Active Stage Detail & Data Flow */}
              <div className="px-5 sm:px-6 py-5 bg-surface-elevated/50 border-b border-line">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeStage.id}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.14, ease: 'easeOut' }}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <p className="font-mono text-[11px] text-muted">
                        <span className={accent.text}>{activeStage.step}</span>
                        <span className="mx-1.5 text-line">/</span>
                        <span className="text-bone font-medium">{activeStage.title}</span>
                      </p>
                      <p className="text-[13.5px] text-bone-dim leading-relaxed">
                        {activeStage.summary}
                      </p>
                    </div>

                    <div className="inline-flex flex-wrap items-center gap-2 font-mono text-[11px] shrink-0 self-start lg:self-center">
                      <span className="px-2.5 py-1 rounded-md bg-ink/90 border border-line text-bone-dim">
                        {activeStage.input}
                      </span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 shrink-0 ${accent.arrow}`}
                        aria-hidden="true"
                      />
                      <span className="px-2.5 py-1 rounded-md bg-ink/90 border border-line text-bone font-medium">
                        {activeStage.output}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 3. Quiet Divider Header + 2-Column Engineering Tradeoffs */}
              <div className="px-5 sm:px-6 py-2 bg-ink/60 border-b border-line font-mono text-[10.5px] uppercase tracking-wider text-muted">
                Engineering Tradeoffs
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line bg-ink/35">
                {blueprint.decisions.map((decision) => (
                  <div key={decision.title} className="p-5 sm:p-6 space-y-2">
                    <h4 className="font-display text-[14px] font-semibold text-bone">
                      {decision.title}
                    </h4>
                    <p className="text-[13px] text-bone-dim/85 leading-relaxed">
                      {decision.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
