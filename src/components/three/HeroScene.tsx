'use client';

import { Suspense, useMemo, useRef, createElement, Fragment } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * HeroScene — light R3F scene for the hero backdrop.
 *
 * Implementation note: React 19 dropped the global JSX namespace, which
 * broke `@react-three/fiber`'s `JSX.IntrinsicElements` augmentation under
 * strict TypeScript. We work around it by calling `extend()` to register
 * the Three.js classes and then constructing the scene with `createElement`
 * instead of JSX intrinsics. The result is fully type-safe and renders
 * identically at runtime.
 */

// Register every Three.js class we touch.
extend({
  Mesh: THREE.Mesh,
  IcosahedronGeometry: THREE.IcosahedronGeometry,
  Points: THREE.Points,
  BufferGeometry: THREE.BufferGeometry,
  BufferAttribute: THREE.BufferAttribute,
  PointsMaterial: THREE.PointsMaterial,
  AmbientLight: THREE.AmbientLight,
  PointLight: THREE.PointLight,
  DirectionalLight: THREE.DirectionalLight,
} as unknown as Parameters<typeof extend>[0]);

type Elem =
  | 'mesh'
  | 'icosahedronGeometry'
  | 'points'
  | 'bufferGeometry'
  | 'bufferAttribute'
  | 'pointsMaterial'
  | 'ambientLight'
  | 'pointLight'
  | 'directionalLight';

function el(type: Elem, props: Record<string, unknown> = {}, ...children: unknown[]) {
  return createElement(type as never, props as never, ...(children as never[]));
}

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
  return createElement(
    Float,
    { speed: 1.2, rotationIntensity: 0.4, floatIntensity: 0.6 },
    el(
      'mesh',
      { ref: meshRef, scale: 1.3 },
      el('icosahedronGeometry', { args: [1, 16] }),
      createElement(MeshDistortMaterial, {
        color: '#915cff',
        roughness: 0.1,
        metalness: 0.4,
        distort: 0.45,
        speed: 1.4,
        transmission: 0.6,
        thickness: 1.2,
        ior: 1.4,
        attenuationColor: '#82dcff',
        attenuationDistance: 2.5,
        envMapIntensity: 0.8,
      }),
    ),
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
  return el(
    'points',
    { ref },
    el(
      'bufferGeometry',
      {},
      el('bufferAttribute', {
        attach: 'attributes-position',
        args: [positions, 3],
        count: positions.length / 3,
      }),
    ),
    el('pointsMaterial', {
      size: 0.022,
      color: '#a4f0ff',
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      depthWrite: false,
    }),
  );
}

function Lights() {
  return createElement(
    Fragment,
    {},
    el('ambientLight', { intensity: 0.4 }),
    el('pointLight', { position: [5, 5, 5], intensity: 1.2, color: '#915cff' }),
    el('pointLight', { position: [-6, -3, 4], intensity: 0.9, color: '#82dcff' }),
    el('directionalLight', { position: [0, 6, 4], intensity: 0.6 }),
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