import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const StoryModal: React.FC = () => {
  const { activeStory, setActiveStory, products, addToCart } = useCommerce();
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
    setProgress(0);
  }, [activeStory]);

  useEffect(() => {
    if (!activeStory) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance slide or close
          if (slideIndex < activeStory.slides.length - 1) {
            setSlideIndex((curr) => curr + 1);
            return 0;
          } else {
            setActiveStory(null);
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStory, slideIndex, setActiveStory]);

  if (!activeStory) return null;

  const currentSlide = activeStory.slides[slideIndex];
  const taggedProduct = currentSlide?.productId
    ? products.find((p) => p.id === currentSlide.productId)
    : null;

  const handleNext = () => {
    if (slideIndex < activeStory.slides.length - 1) {
      setSlideIndex((curr) => curr + 1);
      setProgress(0);
    } else {
      setActiveStory(null);
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      setSlideIndex((curr) => curr - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-0 sm:p-4 backdrop-blur-sm animate-fade-in">
      {/* Close button */}
      <button
        onClick={() => setActiveStory(null)}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors cursor-pointer"
        aria-label="Close Story"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Story container */}
      <div className="relative w-full max-w-sm h-full sm:h-[84vh] max-h-[780px] bg-neutral-900 rounded-none sm:rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
        {/* Progress bars */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5">
          {activeStory.slides.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    idx < slideIndex
                      ? '100%'
                      : idx === slideIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-6 inset-x-3 z-30 flex items-center gap-2.5 text-white">
          <img
            src={activeStory.authorAvatar}
            alt={activeStory.authorName}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-white/20"
          />
          <div className="leading-tight">
            <p className="text-xs font-semibold text-white">
              {activeStory.authorName}
            </p>
            <p className="text-[11px] text-white/70">
              @{activeStory.authorHandle}
            </p>
          </div>
        </div>

        {/* Media Background */}
        <div className="relative w-full h-full bg-neutral-950 flex items-center justify-center">
          <img
            src={currentSlide.url}
            alt={currentSlide.caption || activeStory.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {/* Subtle bottom gradient for readability */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        </div>

        {/* Navigation tap targets */}
        <div
          onClick={handlePrev}
          className="absolute inset-y-16 left-0 w-1/3 z-20 cursor-pointer"
        />
        <div
          onClick={handleNext}
          className="absolute inset-y-16 right-0 w-2/3 z-20 cursor-pointer"
        />

        {/* Prev / Next Arrows */}
        {slideIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 text-white/70 hover:text-white bg-black/40 rounded-full cursor-pointer hidden sm:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 text-white/70 hover:text-white bg-black/40 rounded-full cursor-pointer hidden sm:block"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Story Shoppable Sheet */}
        <div className="absolute bottom-4 inset-x-3 z-30">
          {currentSlide.caption && (
            <p className="text-sm text-white font-medium mb-3 leading-snug drop-shadow-sm">
              {currentSlide.caption}
            </p>
          )}

          {taggedProduct && (
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={taggedProduct.imageUrl}
                  alt={taggedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-neutral-200"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate">
                    {taggedProduct.name}
                  </p>
                  <p className="text-xs text-neutral-600 tabular-nums">
                    ¥{taggedProduct.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(taggedProduct, 1);
                  setActiveStory(null);
                }}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Buy</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
