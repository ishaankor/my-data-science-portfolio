'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  GraduationCap,
  BrainCircuit,
  Bot,
  Sparkles,
  GitBranch,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import githubCache from '@/data/github-cache.json';

const AVATAR_URL =
  (githubCache as any)?.user?.avatar_url || 'https://avatars.githubusercontent.com/u/113160688?v=4';

interface OrbitSatellite {
  id: string;
  label: string;
  subtitle: string;
  icon: typeof BrainCircuit;
  color: string;
  glowColor: string;
  radius: number;
  speed: number;
  phase: number;
  tiltAngle: number;
}

const ORBIT_SATELLITES: OrbitSatellite[] = [
  {
    id: 'ucsd',
    label: 'UCSD CogSci (ML)',
    subtitle: 'Neural Computation',
    icon: GraduationCap,
    color: '#818cf8', // Indigo
    glowColor: 'rgba(129, 140, 248, 0.4)',
    radius: 2.25,
    speed: 0.42,
    phase: 0,
    tiltAngle: 0.35,
  },
  {
    id: 'mcp',
    label: 'Agentic AI & MCP',
    subtitle: 'Model Context Protocol',
    icon: Bot,
    color: '#a855f7', // Purple
    glowColor: 'rgba(168, 85, 247, 0.4)',
    radius: 2.45,
    speed: 0.36,
    phase: (Math.PI * 2) / 3,
    tiltAngle: -0.4,
  },
  {
    id: 'projects',
    label: 'Datafy & Transformi',
    subtitle: 'Production AI Apps',
    icon: Sparkles,
    color: '#f97316', // Ember
    glowColor: 'rgba(249, 115, 22, 0.4)',
    radius: 2.35,
    speed: 0.4,
    phase: (Math.PI * 4) / 3,
    tiltAngle: 0.45,
  },
];

function AmbientMidnightStars() {
  const pointsRef = useRef<THREE.Points>(null!);
  const [positions] = useState(() => {
    const count = 550;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return pos;
  });

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * 0.02;
      pointsRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#818cf8"
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.65}
      />
    </Points>
  );
}

function OrbitingSatellite({
  sat,
  timeRef,
}: {
  sat: OrbitSatellite;
  timeRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const IconComp = sat.icon;

  useFrame(() => {
    if (!groupRef.current) return;
    const t = timeRef.current * sat.speed + sat.phase;
    const x = Math.cos(t) * sat.radius;
    const z = Math.sin(t) * sat.radius;
    const y = Math.sin(t) * Math.sin(sat.tiltAngle) * sat.radius * 0.65;

    groupRef.current.position.set(x, y, z);
  });

  return (
    <group ref={groupRef}>
      <Html center distanceFactor={6} className="pointer-events-auto select-none">
        <div
          className="px-3 py-1.5 rounded-xl bg-ink/90 border border-line hover:border-white shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 cursor-pointer flex items-center gap-2 font-mono whitespace-nowrap"
          style={{
            borderColor: sat.color,
            boxShadow: `0 0 16px ${sat.glowColor}`,
          }}
        >
          <div
            className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${sat.color}25` }}
          >
            <IconComp className="w-3 h-3" style={{ color: sat.color }} />
          </div>

          <div className="text-left">
            <span className="font-bold text-[0.68rem] text-bone block leading-tight">
              {sat.label}
            </span>
            <span className="text-[0.55rem] text-muted block leading-tight">
              {sat.subtitle}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function Animated3DAvatarCore({
  mousePos,
}: {
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const masterGroupRef = useRef<THREE.Group>(null!);
  const wireframeRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef<number>(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (!masterGroupRef.current) return;

    // Smooth cursor parallax tilt with organic damping
    const targetRotX = mousePos.current.y * 0.4;
    const targetRotY = mousePos.current.x * 0.4;

    masterGroupRef.current.rotation.x += (targetRotX - masterGroupRef.current.rotation.x) * 0.05;
    masterGroupRef.current.rotation.y += (targetRotY - masterGroupRef.current.rotation.y) * 0.05;

    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = -timeRef.current * 0.12;
      wireframeRef.current.rotation.y = timeRef.current * 0.18;
    }
  });

  return (
    <group ref={masterGroupRef}>
      
      {/* 1. Central Floating 3D Holographic Avatar Card */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.7}>
        <Html center distanceFactor={5.2} className="pointer-events-auto select-none">
          <div className="relative group cursor-pointer">
            
            {/* Outer Pulsing Ambient Glowing Aura */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-ember via-purple-500 to-cyan-400 opacity-60 blur-xl group-hover:opacity-90 animate-pulse transition-opacity" />

            {/* 3D Glassmorphic Avatar Disk Container */}
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full p-1.5 bg-gradient-to-tr from-ember/80 via-purple-500/80 to-cyan-400/80 shadow-2xl border border-white/20 backdrop-blur-xl">
              
              {/* Inner Avatar Image */}
              <div className="w-full h-full rounded-full overflow-hidden bg-ink relative border-2 border-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={AVATAR_URL}
                  alt="Ishaan Koradia Avatar"
                  className="w-full h-full object-cover rounded-full transform group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Subtle Inner Lens Flare Overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />
              </div>

              {/* Live Status Pill at Avatar Bottom */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-ink/95 border border-emerald-500/40 shadow-lg flex items-center gap-1.5 font-mono text-[0.65rem] text-emerald-400 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">Active Engineer</span>
              </div>
            </div>

          </div>
        </Html>
      </Float>

      {/* 2. Concentric Orbiting Wireframe Synaptic Shell */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.4}>
        <mesh ref={wireframeRef} scale={1.85}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial
            color="#a855f7"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      </Float>

      {/* 3. Orbiting Gyroscopic Rings */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[2.3, 2.32, 64]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <ringGeometry args={[2.55, 2.57, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* 4. Orbiting Tech & Focus Satellites */}
      {ORBIT_SATELLITES.map((sat) => (
        <OrbitingSatellite key={sat.id} sat={sat} timeRef={timeRef} />
      ))}

    </group>
  );
}

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsLowPerformance(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientWidth, clientHeight } = e.currentTarget;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / clientWidth - 0.5;
    const y = (e.clientY - rect.top) / clientHeight - 0.5;
    mousePos.current = { x: x * 2, y: y * 2 };
  };

  if (isLowPerformance) {
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-ember shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={AVATAR_URL} alt="Ishaan Koradia" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full min-h-[420px] sm:min-h-[480px] relative cursor-grab active:cursor-grabbing select-none"
      aria-label="Interactive 3D Holographic Avatar"
    >
      {isInView && (
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={1.0} />
          <directionalLight position={[10, 10, 5]} intensity={1.6} color="#f97316" />
          <directionalLight position={[-10, -10, -5]} intensity={1.4} color="#818cf8" />
          <pointLight position={[0, 0, 4]} intensity={1.2} color="#a855f7" />
          
          <AmbientMidnightStars />
          <Animated3DAvatarCore mousePos={mousePos} />
        </Canvas>
      )}

      {/* Floating 3D Badge */}
      <div className="absolute bottom-4 right-4 pointer-events-none px-3.5 py-1.5 rounded-full bg-ink/90 backdrop-blur-md border border-line text-[0.68rem] text-bone-dim flex items-center gap-2 font-mono shadow-sm">
        <span className="w-2 h-2 rounded-full bg-ember animate-ping" />
        <span>3D Holographic Avatar • Ishaan Koradia</span>
      </div>
    </div>
  );
}
