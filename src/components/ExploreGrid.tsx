import React from 'react';
import { ExperientialPost, Product } from '../types';
import { useCommerce } from '../context/CommerceContext';
import { Heart, Tag, Layers } from 'lucide-react';

interface ExploreGridProps {
  posts: ExperientialPost[];
}

export const ExploreGrid: React.FC<ExploreGridProps> = ({ posts }) => {
  const { setSelectedProductModal, products } = useCommerce();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 max-w-4xl mx-auto py-4 px-2 sm:px-0">
      {posts.map((post) => {
        const coverSlide = post.slides[0];
        const taggedCount = post.slides.flatMap((s) => s.hotspots).length;

        return (
          <div
            key={post.id}
            onClick={() => {
              // Open first tagged product or product modal
              const firstHotspot = coverSlide.hotspots[0];
              if (firstHotspot) {
                const prod = products.find((p) => p.id === firstHotspot.productId);
                if (prod) setSelectedProductModal(prod);
              }
            }}
            className="group relative aspect-square bg-neutral-100 rounded-lg overflow-hidden cursor-pointer"
          >
            <img
              src={coverSlide.url}
              alt={post.caption}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Carousel indicator badge */}
            {post.slides.length > 1 && (
              <div className="absolute top-2 right-2 text-white p-1 bg-black/40 rounded-full">
                <Layers className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Hover Scrim with metrics */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-semibold text-xs">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 fill-white" />
                <span className="tabular-nums">{post.likesCount}</span>
              </div>
              {taggedCount > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span className="tabular-nums">{taggedCount}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
