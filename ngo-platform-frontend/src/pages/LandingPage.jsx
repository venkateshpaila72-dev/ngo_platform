import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Hero from '../components/landing/Hero.jsx';
import ImpactScorecards from '../components/landing/ImpactScorecards.jsx';
import ImpactGalleryGrid from '../components/landing/ImpactGalleryGrid.jsx';
import NgoDirectoryGrid from '../components/landing/NgoDirectoryGrid.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { getImpactGallery, getNgoDirectory } from '../api/publicApi.js';

export default function LandingPage() {
  const [gallery, setGallery] = useState(null);
  const [ngos, setNgos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [galleryRes, ngoRes] = await Promise.all([
          getImpactGallery(20),
          getNgoDirectory(),
        ]);
        setGallery(galleryRes.gallery);
        setNgos(ngoRes.ngos);
      } catch (err) {
        setGallery([]);
        setNgos([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {loading ? (
          <LoadingSpinner label="Loading platform impact..." />
        ) : (
          <>
            <ImpactScorecards gallery={gallery} ngos={ngos} />

            <section id="impact" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6">
                Recent Impact
              </h2>
              <ImpactGalleryGrid gallery={gallery} />
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6">
                NGO Directory
              </h2>
              <NgoDirectoryGrid ngos={ngos} />
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}