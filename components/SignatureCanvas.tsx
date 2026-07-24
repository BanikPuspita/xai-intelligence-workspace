'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

const REPEL_RADIUS = 2.6;
const REPEL_STRENGTH = 0.9;

/**
 * The "wow" moment: a data cluster that reorganizes itself.
 * Nodes start scattered on a loose sphere shell (noise) and converge
 * into an icosahedral core (structure) once the section scrolls into
 * view. Once formed, the cursor disturbs nearby nodes and the shape
 * settles back — it reads as a physical object you can nudge, not a
 * one-shot scroll animation.
 */
function IntelligenceCore({
  progressTarget,
  reducedMotion,
}: {
  progressTarget: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const progress = useRef(0);
  const mouseWorld = useRef(new THREE.Vector3(999, 999, 999));

  const ico = useMemo(() => new THREE.IcosahedronGeometry(2.4, 1), []);
  const edgesGeom = useMemo(() => new THREE.EdgesGeometry(ico), [ico]);

  const { scattered, structured, nodeCount } = useMemo(() => {
    const posAttr = ico.attributes.position;
    const nodeCount = posAttr.count;
    const structured = new Float32Array(nodeCount * 3);
    const scattered = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      structured[i * 3] = posAttr.getX(i);
      structured[i * 3 + 1] = posAttr.getY(i);
      structured[i * 3 + 2] = posAttr.getZ(i);

      const r = 5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      scattered[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      scattered[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      scattered[i * 3 + 2] = r * Math.cos(phi);
    }
    return { scattered, structured, nodeCount };
  }, [ico]);

  const initial = useMemo(
    () => (reducedMotion ? structured.slice() : scattered.slice()),
    [reducedMotion, structured, scattered]
  );

  useFrame((state) => {
    const geom = pointsRef.current?.geometry;
    if (!geom) return;

    if (reducedMotion) {
      // Static, already-formed core. No convergence animation, no cursor
      // disturbance, no continuous rotation — respects the user's setting.
      return;
    }

    progress.current += (progressTarget.current - progress.current) * 0.04;
    const p = progress.current;

    // Project the pointer into the same world space the nodes live in,
    // roughly on the z=0 plane the core rotates around.
    mouseWorld.current.set(state.pointer.x * 4.2, state.pointer.y * 3.2, 0);

    const pos = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < nodeCount; i++) {
      const ix = i * 3;
      let x = scattered[ix] + (structured[ix] - scattered[ix]) * p;
      let y = scattered[ix + 1] + (structured[ix + 1] - scattered[ix + 1]) * p;
      let z = scattered[ix + 2] + (structured[ix + 2] - scattered[ix + 2]) * p;

      // Cursor repulsion only matters once the core has meaningfully formed.
      if (p > 0.4) {
        const dx = x - mouseWorld.current.x;
        const dy = y - mouseWorld.current.y;
        const dz = z - mouseWorld.current.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
        if (dist < REPEL_RADIUS) {
          const falloff = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH * p;
          x += (dx / dist) * falloff;
          y += (dy / dist) * falloff;
          z += (dz / dist) * falloff;
        }
      }

      pos[ix] = x;
      pos[ix + 1] = y;
      pos[ix + 2] = z;
    }
    geom.attributes.position.needsUpdate = true;

    if (wireRef.current) {
      (wireRef.current.material as THREE.LineBasicMaterial).opacity = p * 0.55;
    }

    const wobble = Math.sin(Date.now() * 0.0002) * 0.15;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0022;
      pointsRef.current.rotation.x = wobble;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = pointsRef.current?.rotation.y ?? 0;
      wireRef.current.rotation.x = wobble;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[initial, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#4CD9C0" size={0.09} transparent opacity={0.95} />
      </points>
      <lineSegments ref={wireRef} geometry={edgesGeom}>
        <lineBasicMaterial color="#F2A93B" transparent opacity={reducedMotion ? 0.55 : 0} />
      </lineSegments>
    </>
  );
}

export default function SignatureCanvas({
  progressTarget,
}: {
  progressTarget: React.MutableRefObject<number>;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <IntelligenceCore progressTarget={progressTarget} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
