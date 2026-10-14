// CHANGE VERSION: PORTFOLIO-POLISH-R7 | 2026-10-14 | Complete GradientWaves.jsx
import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import vertex from './GradientWaves.vert.glsl?raw';
import fragment from './GradientWaves.frag.glsl?raw';
import '../styles/GradientWaves.css';

const rgb = hex => new Float32Array((hex.match(/[a-f\d]{2}/gi) || ['ff', 'ff', 'ff']).map(value => parseInt(value, 16) / 255));
const palette = hex => ({ value: rgb(hex) });

export default function GradientWaves({ horizonColor, waveColor, crestColor, active, reduced, className = '' }) {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !active || reduced) return undefined;
    let renderer, program, mesh, canvas, resizeObserver, intersectionObserver, frame = 0;
    let removeListeners = () => {};
    let visible = true, pageVisible = !document.hidden;
    const cleanup = () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver?.disconnect(); intersectionObserver?.disconnect(); removeListeners();
      canvas?.remove(); delete container.dataset.webgl;
      renderer?.gl?.getExtension('WEBGL_lose_context')?.loseContext();
    };
    try {
      renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: true, antialias: false, dpr: 1 });
      if (!renderer.isWebgl2) throw new Error('WebGL 2 unavailable');
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      program = new Program(gl, { vertex, fragment, transparent: true, depthTest: false, depthWrite: false, uniforms: {
        iTime: { value: 0 }, iResolution: { value: new Float32Array([1, 1]) }, uSpeed: { value: .38 },
        uAmplitude: { value: 2.2 }, uWaveScale: { value: .6 }, uWaveRatio: { value: .9 }, uSwell: { value: 18 },
        uTurbulence: { value: 12 }, uTilt: { value: 1.11 }, uZoom: { value: 1 }, uHeight: { value: 5.5 },
        uFogDepth: { value: 22 }, uSteps: { value: 40 }, uBrightness: { value: 1.04 }, uOpacity: { value: .44 },
        uGrain: { value: 0 }, uGrainIntensity: { value: 0 }, uMouse: { value: new Float32Array([.5, .5]) },
        uParallax: { value: 0 }, uEnableMouse: { value: false }, uHorizonColor: palette(horizonColor),
        uWaveColor: palette(waveColor), uCrestColor: palette(crestColor)
      }});
      if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) throw new Error('Gradient shader could not link');
      mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
      canvas = gl.canvas;
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';
      container.appendChild(canvas);
      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        renderer.setSize(Math.max(1, Math.floor(width)), Math.max(1, Math.floor(height)));
        program.uniforms.iResolution.value.set([gl.drawingBufferWidth, gl.drawingBufferHeight]);
        renderer.render({ scene: mesh });
      };
      resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
      resizeObserver?.observe(container);
      if (!resizeObserver) window.addEventListener('resize', resize);
      resize();
      container.dataset.webgl = 'true';
      const start = performance.now();
      const tick = now => {
        frame = 0;
        program.uniforms.iTime.value = (now - start) / 1000;
        renderer.render({ scene: mesh });
        if (visible && pageVisible) frame = requestAnimationFrame(tick);
      };
      const sync = () => {
        if (visible && pageVisible && !frame) frame = requestAnimationFrame(tick);
        if ((!visible || !pageVisible) && frame) { cancelAnimationFrame(frame); frame = 0; }
      };
      intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      intersectionObserver?.observe(container);
      const visibility = () => { pageVisible = !document.hidden; sync(); };
      document.addEventListener('visibilitychange', visibility);
      removeListeners = () => { document.removeEventListener('visibilitychange', visibility); if (!resizeObserver) window.removeEventListener('resize', resize); };
      sync();
    } catch {
      cleanup();
      container.dataset.webgl = 'fallback';
      return undefined;
    }
    return cleanup;
  }, [active, reduced, horizonColor, waveColor, crestColor]);
  return <div ref={containerRef} className={`gradient-waves-container ${className}`.trim()} data-active={active ? 'true' : 'false'} data-reduced={reduced ? 'true' : 'false'} style={{ '--wave-color': waveColor }} aria-hidden="true" />;
}
// END OF FILE: PORTFOLIO-POLISH-R7 | GradientWaves.jsx
