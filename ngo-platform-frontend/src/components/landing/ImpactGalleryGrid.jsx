import { useState } from 'react';
import Card from '../common/Card.jsx';
import EmptyState from '../common/EmptyState.jsx';
import ImpactStoryModal from './ImpactStoryModal.jsx';
import { useStaggerReveal } from '../../hooks/useScrollReveal.js';

export default function ImpactGalleryGrid({ gallery }) {
  const [selected, setSelected] = useState(null);
  const containerRef = useStaggerReveal();

  if (!gallery || gallery.length === 0) {
    return (
      <EmptyState
        title="No verified stories yet"
        subtitle="As NGOs complete needs and their proof of work is verified, success stories will appear here for funders and the public to see."
      />
    );
  }

  return (
    <>
      <div ref={containerRef} className="columns-1 sm:columns-2 lg:columns-3 gap-5">
        {gallery.map((item) => (
          <Card
            key={item.proof_id}
            onClick={() => setSelected(item)}
            className="mb-5 break-inside-avoid overflow-hidden"
          >
            <img src={item.photo_url} alt="" className="w-full object-cover" loading="lazy" />
            <div className="p-4">
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
                {item.need_type}
              </span>
              <h4 className="font-heading font-semibold text-foreground mt-2">
                {item.ngo_name}
              </h4>
              <p className="text-sm text-muted line-clamp-2 mt-1">
                {item.impact_story || item.story_text || 'Tap to see the full story.'}
              </p>
            </div>
          </Card>
        ))}
      </div>
      <ImpactStoryModal item={selected} onClose={() => setSelected(null)} />
    </>
  );
}