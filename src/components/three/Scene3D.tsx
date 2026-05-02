import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, TorusKnot, Sphere } from "@react-three/drei";
import * as THREE from "three";

/**
 * Global ambient 3D scene rendered as a fixed background behind the entire site.
 * Reacts to scroll position to create a continuous cinematic feel.
 *
 * Performance notes:
 * - Mounted once (not per-section). dpr capped at [1, 1.5].
 * - frameloop="demand" + manual invalidate on scroll keeps GPU idle when static.
 * - Disabled on devices that prefer reduced motion or report low DPR/touch.
 */

function ScrollReactiveGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const targetRot = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = window.scrollY / max; // 0 -> 1
      targetRot.current.x = p * Math.PI * 0.6;
      targetRot.current.y = p * Math.PI * 1.2;
      targetPos.current.y = -p * 4;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    g.rotation.x += (targetRot.current.x - g.rotation.x) * Math.min(1, delta * 2);
    g.rotation.y += (targetRot.current.y - g.rotation.y) * Math.min(1, delta * 2);
    g.position.y += (targetPos.current.y - g.position.y) * Math.min(1, delta * 2);
    g.rotation.z += delta * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={1} floatIntensity={1.6}>
        <mesh position={[-3.2, 1.2, -2]}>
          <icosahedronGeometry args={[1.1, 1]} />
          <MeshDistortMaterial
            color="#0ea5e9"
            emissive="#0369a1"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.15}
            distort={0.35}
            speed={1.5}
          />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.8} floatIntensity={1.2}>
        <TorusKnot args={[0.9, 0.28, 140, 18]} position={[3.4, -0.6, -1.5]}>
          <MeshDistortMaterial
            color="#38bdf8"
            emissive="#0c4a6e"
            emissiveIntensity={0.35}
            metalness={0.9}
            roughness={0.1}
            distort={0.2}
            speed={1.2}
          />
        </TorusKnot>
      </Float>

      <Float speed={2} rotationIntensity={1.4} floatIntensity={2}>
        <Sphere args={[0.55, 48, 48]} position={[0.5, 2.4, -3]}>
          <MeshDistortMaterial
            color="#7dd3fc"
            emissive="#075985"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.2}
            distort={0.5}
            speed={2.5}
          />
        </Sphere>
      </Float>

      <Float speed={1.6} rotationIntensity={1.2} floatIntensity={1.4}>
        <Icosahedron args={[0.7, 0]} position={[-1.8, -2.2, -2.5]}>
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0c4a6e"
            emissiveIntensity={0.6}
            metalness={1}
            roughness={0.05}
            wireframe
          />
        </Icosahedron>
      </Float>
    </group>
  );
}

export function Scene3D() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const mount = () => setEnabled(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(mount, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(mount, 1500);
    return () => window.clearTimeout(id);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none opacity-60 dark:opacity-80"
      style={{ contain: "strict" }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#7dd3fc" />
        <pointLight position={[-5, -3, -2]} intensity={1.2} color="#0ea5e9" />
        <Suspense fallback={null}>
          <ScrollReactiveGroup />
        </Suspense>
      </Canvas>
    </div>
  );
}
