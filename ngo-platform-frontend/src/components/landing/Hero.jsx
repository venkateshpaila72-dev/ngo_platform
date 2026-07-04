import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

export default function Hero() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.from('.hero-fade', {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="bg-gradient-to-b from-primary/5 to-background border-b border-borderc"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <span className="hero-fade inline-block text-xs font-semibold tracking-wide uppercase bg-primary/10 text-primary px-3 py-1 rounded-full mb-5">
          Regional Coordination Network
        </span>
        <h1 className="hero-fade font-heading font-bold text-4xl sm:text-5xl text-foreground leading-tight">
          Connecting NGOs, Coordinating Relief, <span className="text-primary">Proving Impact</span>
        </h1>
        <p className="hero-fade mt-5 text-lg text-muted max-w-2xl mx-auto">
          A shared platform where local organizations report needs, coordinate resources, and
          show funders exactly how their support was used, verified, transparent, and real-time.
        </p>
        <div className="hero-fade mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/ngo/register"
            className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Register Your NGO
          </Link>
          <a
            href="#impact"
            className="border border-borderc text-foreground font-semibold px-6 py-3 rounded-lg hover:bg-card transition-colors"
          >
            See Verified Impact
          </a>
        </div>
      </div>
    </section>
  );
}