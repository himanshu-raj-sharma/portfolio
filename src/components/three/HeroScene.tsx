'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import type * as THREE from 'three';

/**
 * HeroScene — light R3F scene for the hero backdrop.
 *
 * Implementation note: this scene targets @react-three/fiber v9, which
 * supports React 19 natively and ships correct JSX typings for Three.js
 * intrinsics. Earlier versions required a `createElement`/`extend()`
 * workaround because R3F v8's `JSX.IntrinsicElements` augmentation broke
 * under React 19's removed global JSX namespace.
 */

function GlassBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;
    m.rotation.x += delta * 0.08;
    m.rotation.y += delta * 0.12;
    const t = state.clock.elapsedTime;
    m.position.x = Math.sin(t * 0.3) * 0.4;
    m.position.y = Math.cos(t * 0.25) * 0.25;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={1.3}>
        <icosahedronGeometry args={[1, 16]} />
        <MeshDistortMaterial
          color="#915cff"
          roughness={0.1}
          metalness={0.4}
          distort={0.45}
          speed={1.4}
          transmission={0.6}
          thickness={1.2}
          ior={1.4}
          attenuationColor="#82dcff"
          attenuationDistance={2.5}
          envMapIntensity={0.8}
        />
      </mesh>
    </Float>
  );
}

function ParticleField({ count = 240 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#a4f0ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#915cff" />
      <pointLight position={[-6, -3, 4]} intensity={0.9} color="#82dcff" />
      <directionalLight position={[0, 6, 4]} intensity={0.6} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Suspense fallback={null}>
          <Lights />
          <ParticleField />
          <GlassBlob />
        </Suspense>
      </Canvas>
    </div>
  );
}
