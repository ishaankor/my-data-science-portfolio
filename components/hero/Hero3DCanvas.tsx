'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedParticles() {
  const pointsRef = useRef<THREE.Points>(null!);
  const [positions] = useState(() => {
    const count = 750;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  });

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * 0.05;
      pointsRef.current.rotation.y += delta * 0.07;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#38bdf8"
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function InteractiveCoreMesh({ mousePos }: { mousePos: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireframeRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Smooth lerp rotation toward mouse position
    const targetX = mousePos.current.y * 0.5;
    const targetY = mousePos.current.x * 0.5;

    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.05 + delta * 0.2;
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.05 + delta * 0.3;

    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = -meshRef.current.rotation.x * 0.8;
      wireframeRef.current.rotation.y = -meshRef.current.rotation.y * 0.8;
    }
  });

  return (
    <group>
      {/* Central Distorted Glowing Sphere */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <Sphere ref={meshRef} args={[1.5, 64, 64]} scale={1.2}>
          <MeshDistortMaterial
            color="#06b6d4"
            attach="material"
            distort={0.45}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      {/* Orbiting Wireframe Outer Structure */}
      <Float speed={1.8} rotationIntensity={1} floatIntensity={0.8}>
        <mesh ref={wireframeRef} scale={1.9}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.35} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check user reduced motion preference or low power
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsLowPerformance(true);
    }

    // IntersectionObserver to pause R3F render when scrolled offscreen
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
        <div className="w-64 h-64 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 blur-3xl opacity-30 animate-pulse" />
        <div className="w-48 h-48 rounded-full border border-cyan-500/30 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-violet-500/40 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-[450px] sm:h-[550px] md:h-[650px] relative cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D Data Sphere Canvas"
    >
      {isInView && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#38bdf8" />
          <pointLight position={[-10, -10, -5]} intensity={1.2} color="#a855f7" />
          
          <AnimatedParticles />
          <InteractiveCoreMesh mousePos={mousePos} />
        </Canvas>
      )}

      {/* Floating 3D Interaction Badge */}
      <div className="absolute bottom-4 right-4 pointer-events-none px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-xs text-slate-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        Drag or hover mouse to interact
      </div>
    </div>
  );
}
