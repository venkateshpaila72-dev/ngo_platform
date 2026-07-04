import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Staggers the direct children of the returned ref as they enter the viewport.
export function useStaggerReveal() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
      });
    },
    { scope: containerRef }
  );

  return containerRef;
}

// Attaches a lift and shadow hover effect to an element via quickTo (no re-created tweens).
export function attachHoverLift(el) {
  if (!el) return () => {};
  const liftUp = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power2.out' });
  const scaleUp = gsap.quickTo(el, 'scale', { duration: 0.25, ease: 'power2.out' });

  const onEnter = () => {
    liftUp(-4);
    scaleUp(1.02);
    el.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
  };
  const onLeave = () => {
    liftUp(0);
    scaleUp(1);
    el.style.boxShadow = '';
  };

  el.addEventListener('mouseenter', onEnter);
  el.addEventListener('mouseleave', onLeave);
  return () => {
    el.removeEventListener('mouseenter', onEnter);
    el.removeEventListener('mouseleave', onLeave);
  };
}