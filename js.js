import { useEffect, useRef } from 'react';

/** Lightweight Canvas implementation of React Bits' Cursor Grid effect. */
export default function CursorGrid({
  cellSize = 64,
  radius = 150,
  color = '196, 138, 94',
  gridOpacity = 0.08,
  fillOpacity = 0.18,
  clickPulse = true
}) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!host || !canvas || !ctx) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -1000, y: -1000, inside: false };
    const pulses = [];
    let cells = [];
    let columns = 0;
    let rows = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let rafId = 0;
    let previousTime = 0;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / cellSize) + 1;
      rows = Math.ceil(height / cellSize) + 1;
      cells = new Float32Array(columns * rows);
      paint();
    };

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * cellSize;
          const y = row * cellSize;
          const level = cells[row * columns + column];
          ctx.strokeStyle = `rgba(${color}, ${gridOpacity + level * 0.72})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 0.5, y + 0.5, cellSize, cellSize);
          if (level > 0.01) {
            ctx.fillStyle = `rgba(${color}, ${level * fillOpacity})`;
            ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
          }
        }
      }
    };

    const animate = (time) => {
      rafId = 0;
      const delta = previousTime ? Math.min(time - previousTime, 50) : 16;
      previousTime = time;
      const decay = reducedMotion ? 1 : delta / 650;
      let moving = false;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = row * columns + column;
          const cx = column * cellSize + cellSize / 2;
          const cy = row * cellSize + cellSize / 2;
          let target = 0;

          if (pointer.inside && !reducedMotion) {
            const distance = Math.hypot(cx - pointer.x, cy - pointer.y);
            if (distance < radius) target = (1 - distance / radius) ** 2;
          }

          for (let i = pulses.length - 1; i >= 0; i -= 1) {
            const pulse = pulses[i];
            const elapsed = time - pulse.started;
            const ringRadius = elapsed * 0.42;
            const distance = Math.hypot(cx - pulse.x, cy - pulse.y);
            const ring = Math.max(0, 1 - Math.abs(distance - ringRadius) / 42) * Math.max(0, 1 - elapsed / 1800);
            target = Math.max(target, ring * pulse.strength);
            if (elapsed > 1800) pulses.splice(i, 1);
          }

          const current = cells[index];
          const next = target > current
            ? current + (target - current) * Math.min(1, delta / 65)
            : Math.max(target, current - decay);
          cells[index] = next < 0.008 ? 0 : next;
          if (Math.abs(cells[index] - current) > 0.002) moving = true;
        }
      }

      paint();
      if (moving || pulses.length) rafId = requestAnimationFrame(animate);
    };

    const wake = () => {
      if (!rafId) {
        previousTime = 0;
        rafId = requestAnimationFrame(animate);
      }
    };

    const onPointerMove = (event) => {
      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.x = x;
      pointer.y = y;
      pointer.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      wake();
    };

    const onPointerDown = (event) => {
      if (!clickPulse || reducedMotion) return;
      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        pulses.push({ x, y, started: performance.now(), strength: 1 });
        wake();
      }
    };

    const onPointerLeave = () => {
      pointer.inside = false;
      wake();
    };

    const onVisibilityChange = () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else {
        wake();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);
    resize();

    return () => {
      resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [cellSize, radius, color, gridOpacity, fillOpacity, clickPulse]);

  return (
    <div ref={hostRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
