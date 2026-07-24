'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

const COUNT = 850;
const COLS = 29;

/**
 * The hero's core idea, made literal: a scattered point cloud
 * interpolates into a grid as the section scrolls into view.
 * "Raw data becoming structure" is the animation, not a metaphor for it.
 */
function ParticleField({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { scatter, grid, colors } = useMemo(() => {
    const scatter = new Float32Array(COUNT * 3);
    const grid = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const teal = new THREE.Color('#4CD9C0');
    const amber = new THREE.Color('#F2A93B');

    for (let i = 0; i < COUNT; i++) {
      scatter[i * 3] = (Math.random() - 0.5) * 15;
      scatter[i * 3 + 1] = (Math.random() - 0.5) * 9;
      scatter[i * 3 + 2] = (Math.random() - 0.5) * 7;

      const c = i % COLS;
      const r = Math.floor(i / COLS);
      grid[i * 3] = (c - COLS / 2) * 0.42;
      grid[i * 3 + 1] = (r - COUNT / COLS / 2) * 0.42;
      grid[i * 3 + 2] = 0;

      const col = Math.random() > 0.94 ? amber : teal;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return { scatter, grid, colors };
  }, []);

  // Reduced motion: land on the settled grid immediately, no scatter phase.
  const initial = useMemo(
    () => (reducedMotion ? grid.slice() : scatter.slice()),
    [reducedMotion, grid, scatter]
  );

  useFrame((state) => {
    const geom = pointsRef.current?.geometry;
    if (!geom) return;

    if (reducedMotion) {
      // Static: geometry already sits on `grid`, no per-frame writes, no rotation.
      return;
    }

    mouse.current.x = state.pointer.x;
    mouse.current.y = state.pointer.y;

    const pos = geom.attributes.position.array as Float32Array;
    const ease = progress * progress * (3 - 2 * progress);

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      pos[ix] = scatter[ix] + (grid[ix] - scatter[ix]) * ease;
      pos[ix + 1] = scatter[ix + 1] + (grid[ix + 1] - scatter[ix + 1]) * ease;
      pos[ix + 2] = scatter[ix + 2] + (grid[ix + 2] - scatter[ix + 2]) * ease;
    }
    geom.attributes.position.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0007 + mouse.current.x * 0.001;
      pointsRef.current.rotation.x +=
        (mouse.current.y * 0.12 - pointsRef.current.rotation.x) * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initial, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

export default function HeroCanvas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(sectionRef, 0.7);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div ref={sectionRef} className="pointer-events-none absolute inset-0 opacity-90">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <ParticleField progress={progress} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
