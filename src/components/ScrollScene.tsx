import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

const Scene3D = lazy(() =>
  import("@/components/three/Scene3D").then((m) => ({ default: m.Scene3D })),
);

/**
 * Mounts the global 3D background scene on public marketing pages only.
 * Skips admin/auth dashboards to keep them snappy.
 */
export function ScrollScene(): ReactNode {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 800);
    return () => window.clearTimeout(id);
  }, []);

  const blocked = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  if (blocked || !ready) return null;
  return (
    <Suspense fallback={null}>
      <Scene3D />
    </Suspense>
  );
}
