import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  Tag,
  ShoppingBag,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { ExperientialPost, Hotspot, Product } from '../types';
import { useCommerce } from '../context/CommerceContext';

interface ExperientialCardProps {
  post: ExperientialPost;
}

export const ExperientialCard: React.FC<ExperientialCardProps> = ({ post }) => {
  const {
    toggleLike,
    toggleSave,
    addComment,
    products,
    addToCart,
    setSelectedProductModal
  } = useCommerce();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const currentSlide = post.slides[currentSlideIndex] || post.slides[0];
  const slideCount = post.slides.length;

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlideIndex < slideCount - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setActiveHotspot(null);
    }
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setActiveHotspot(null);
    }
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
    setShowAllComments(true);
  };

  // Find all products tagged in this post
  const allTaggedProductIds = Array.from(
    new Set(
      post.slides.flatMap((slide) => slide.hotspots.map((h) => h.productId))
    )
  );
  const taggedProducts = allTaggedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  return (
    <article className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md flex flex-col justify-between">
      {/* 1. Card Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatarUrl}
            alt={post.author.displayName}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border border-neutral-200"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-neutral-900 leading-none">
                {post.author.username}
              </span>
              {post.author.isVerified && (
                <span className="text-blue-500 text-xs" title="Verified Creator">
                  ●
                </span>
              )}
            </div>
            {post.location && (
              <p className="text-xs text-neutral-500 mt-0.5">{post.location}</p>
            )}
          </div>
        </div>

        {/* Sponsored Label (Updated time removed as requested) */}
        {post.isSponsored && (
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Sponsored
          </span>
        )}
      </div>

      {/* 2. Visual Media Carousel Container */}
      <div
        className="relative aspect-4/3 bg-neutral-900 overflow-hidden select-none cursor-pointer group"
        onClick={() => setShowHotspots((prev) => !prev)}
      >
        {/* Slide Image */}
        <img
          src={currentSlide.url}
          alt={currentSlide.caption || post.caption}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Slide navigation controls */}
        {slideCount > 1 && (
          <>
            {currentSlideIndex > 0 && (
              <button
                onClick={handlePrevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors cursor-pointer z-20"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {currentSlideIndex < slideCount - 1 && (
              <button
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors cursor-pointer z-20"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Slide Index Badge */}
            <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium rounded-full tabular-nums">
              {currentSlideIndex + 1}/{slideCount}
            </div>
          </>
        )}

        {/* Shoppable Hotspot Pins */}
        {showHotspots &&
          currentSlide.hotspots.map((hotspot) => {
            const isSelected = activeHotspot?.id === hotspot.id;
            return (
              <div
                key={hotspot.id}
                style={{
                  left: `${hotspot.xPercent}%`,
                  top: `${hotspot.yPercent}%`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(isSelected ? null : hotspot);
                }}
              >
                {/* Hotspot Pulse Marker */}
                <button
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                    isSelected
                      ? 'bg-neutral-900 text-white scale-110 ring-2 ring-white'
                      : 'bg-white/95 text-neutral-900 hover:scale-110 hover:bg-white'
                  }`}
                  aria-label={`View ${hotspot.productName}`}
                >
                  <Tag className="w-3.5 h-3.5" />
                </button>

                {/* Hotspot Floating Preview Popup */}
                {isSelected && (
                  <div
                    className="absolute bottom-9 left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 p-3 z-40 animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className="text-xs font-semibold text-neutral-900 leading-snug line-clamp-2">
                        {hotspot.productName}
                      </p>
                    </div>

                    {hotspot.note && (
                      <p className="text-[11px] text-neutral-500 mb-2">
                        {hotspot.note}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                      <span className="text-xs font-bold text-neutral-900 tabular-nums">
                        ¥{hotspot.price.toLocaleString()}
                      </span>

                      <button
                        onClick={() => {
                          const prod = products.find(
                            (p) => p.id === hotspot.productId
                          );
                          if (prod) {
                            addToCart(prod, 1, post.id);
                            setActiveHotspot(null);
                          }
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {/* Hotspot Hint Indicator */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white/90 text-[11px] rounded-full pointer-events-none">
          <Tag className="w-3 h-3" />
          <span>{showHotspots ? 'タグをタップして詳細表示' : 'タップで商品タグ表示'}</span>
        </div>
      </div>

      {/* 3. Sponsored Banner CTA (if sponsored) */}
      {post.isSponsored && post.sponsorInfo && (
        <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-medium text-neutral-800">
              {post.sponsorInfo.brandName}
            </span>
          </div>
          <button
            onClick={() => {
              const firstTagged = taggedProducts[0];
              if (firstTagged) setSelectedProductModal(firstTagged);
            }}
            className="text-xs font-semibold text-neutral-900 hover:underline cursor-pointer"
          >
            {post.sponsorInfo.ctaText} →
          </button>
        </div>
      )}

      {/* 4. Action Row */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={() => toggleLike(post.id)}
              className="group flex items-center gap-1.5 cursor-pointer text-neutral-800 hover:text-rose-600 transition-colors"
              aria-label="Like Post"
            >
              <Heart
                className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                  post.isLiked
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-neutral-800'
                }`}
              />
            </button>

            {/* Comment Button */}
            <button
              onClick={() => setShowAllComments((prev) => !prev)}
              className="text-neutral-800 hover:text-neutral-950 transition-colors cursor-pointer"
              aria-label="Comments"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="text-neutral-800 hover:text-neutral-950 transition-colors cursor-pointer relative"
              aria-label="Share Post"
            >
              {copiedLink ? (
                <Check className="w-6 h-6 text-emerald-600" />
              ) : (
                <Share2 className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleSave(post.id)}
            className="text-neutral-800 hover:text-neutral-950 transition-colors cursor-pointer"
            aria-label="Save Post"
          >
            <Bookmark
              className={`w-6 h-6 ${
                post.isSaved
                  ? 'fill-neutral-900 text-neutral-900'
                  : 'text-neutral-800'
              }`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <div className="mt-2 text-xs font-bold text-neutral-900 tabular-nums">
          {post.likesCount.toLocaleString()} 件のいいね
        </div>

        {/* Caption */}
        <div className="mt-1.5 text-xs text-neutral-800 leading-relaxed">
          <span className="font-semibold mr-1.5 text-neutral-900">
            {post.author.username}
          </span>
          <span>
            {isCaptionExpanded
              ? post.caption
              : post.caption.slice(0, 110)}
            {post.caption.length > 110 && !isCaptionExpanded && '...'}
          </span>
          {post.caption.length > 110 && (
            <button
              onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
              className="text-neutral-400 hover:text-neutral-700 ml-1 font-medium cursor-pointer"
            >
              {isCaptionExpanded ? '一部を表示' : '続きを読む'}
            </button>
          )}
        </div>

        {/* Hash tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 text-[11px] text-neutral-500">
            {post.tags.map((tag) => (
              <span key={tag} className="hover:text-neutral-900 cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 5. Tagged Items Shelf (Shoppable strip under post) */}
      {taggedProducts.length > 0 && (
        <div className="px-4 py-2.5 bg-neutral-50/80 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
              登場アイテム ({taggedProducts.length})
            </span>
            <span className="text-[10px] text-neutral-400">ワンタップで購入</span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
            {taggedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg p-1.5 shrink-0 hover:border-neutral-400 transition-colors"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded object-cover cursor-pointer"
                  onClick={() => setSelectedProductModal(product)}
                />
                <div className="max-w-[130px]">
                  <p
                    className="text-xs font-medium text-neutral-900 truncate cursor-pointer hover:underline"
                    onClick={() => setSelectedProductModal(product)}
                  >
                    {product.name}
                  </p>
                  <p className="text-[11px] text-neutral-600 font-semibold tabular-nums">
                    ¥{product.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => addToCart(product, 1, post.id)}
                  className="p-1.5 text-neutral-700 hover:text-white hover:bg-neutral-900 rounded-md transition-colors cursor-pointer ml-1"
                  title="Add to Shopping Bag"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Comments Section */}
      <div className="px-4 py-2.5 border-t border-neutral-100">
        {post.commentsCount > 0 && (
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors mb-2 cursor-pointer"
          >
            {showAllComments
              ? 'コメントを折りたたむ'
              : `他 ${post.commentsCount} 件のコメントを表示`}
          </button>
        )}

        {showAllComments && post.comments && (
          <div className="space-y-2 mb-3 max-h-40 overflow-y-auto no-scrollbar">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2 text-xs">
                <img
                  src={comment.userAvatar}
                  alt={comment.username}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover mt-0.5"
                />
                <div className="flex-1">
                  <span className="font-semibold text-neutral-900 mr-1.5">
                    {comment.username}
                  </span>
                  <span className="text-neutral-700">{comment.text}</span>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    {comment.createdAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment input form */}
        <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="コメントを追加..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 text-xs text-neutral-800 bg-transparent placeholder-neutral-400 focus:outline-none"
          />
          {commentInput.trim() && (
            <button
              type="submit"
              className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              投稿
            </button>
          )}
        </form>
      </div>
    </article>
  );
};
