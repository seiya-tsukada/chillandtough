import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const StoreHero: React.FC = () => {
  const { setSelectedCategory } = useCommerce();

  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand & Campaign Prose */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Weekend Matchday & Sideline Wear 2026</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 leading-[1.15] mb-4">
              子供の応援に行く週末が、<br />もっと待ち遠しくなる。
            </h1>

            <p className="text-sm text-neutral-600 leading-relaxed mb-6 max-w-md">
              早朝から車にギアを積み込み、グラウンドへ向かうワクワク感。全力でボールを追う子供の姿を一番近くで見届ける日のために。長時間の車移動やサイドラインでの観戦も、心地よくスタイリッシュに楽しめる機能美アパレル。
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const feedElement = document.getElementById('feed-section');
                  feedElement?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <span>応援・観戦ウェアを見る</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedCategory('スウェット')}
                className="px-4 py-2.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
              >
                スウェット & パンツ
              </button>
            </div>
          </div>

          {/* Right Column: Parent-Child Sports Mobility & Cheering Hero Image */}
          <div className="lg:col-span-7">
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden shadow-lg border border-neutral-200 group">
              <img
                src="/src/assets/images/hero_matchday_cheering_family_1792550637528.jpg"
                alt="Parent and child high-fiving by SUV tailgate at soccer matchday"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-xs font-semibold tracking-wide uppercase text-white/80">
                    Matchday Morning · Cheering with Excitement
                  </p>
                  <p className="text-sm font-medium text-white/95 mt-0.5">
                    グラウンドへ向かう車移動から試合前のハイタッチまで、週末の家族時間を特別に彩る
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
