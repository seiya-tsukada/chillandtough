import React from 'react';
import { Product } from '../types/catalog';
import { ArrowUpRight } from 'lucide-react';

interface LookbookViewProps {
  products: Product[];
  onSelect: (product: Product) => void;
  currency: 'JPY' | 'USD';
}

export const LookbookView: React.FC<LookbookViewProps> = ({
  products,
  onSelect,
  currency,
}) => {
  // Curated editorial looks
  const looks = [
    {
      id: 'look-01',
      titleEn: 'LOOK 01 — TECHNICAL NYLON ENSEMBLE',
      titleJp: 'LOOK 01 — テクニカルナイロン セットアップ',
      season: '2026 S/S',
      location: 'SHIBUYA / AOYAMA, TOKYO',
      primaryProduct: products.find((p) => p.code === 'AT-JK01') || products[0],
      secondaryProduct: products.find((p) => p.code === 'AT-PT04') || products[3],
      notes: 'Matte Taslan nylon shell jacket paired with relaxed tapered easy pants. Lightweight breathability engineered for Tokyo mid-season weather.',
    },
    {
      id: 'look-02',
      titleEn: 'LOOK 02 — VINTAGE LOOPWHEEL & COTTON JERSEY',
      titleJp: 'LOOK 02 — 吊り編み裏毛 & 度詰めボーダー',
      season: '2026 S/S',
      location: 'NAKAMEGURO, TOKYO',
      primaryProduct: products.find((p) => p.code === 'AT-HD02') || products[1],
      secondaryProduct: products.find((p) => p.code === 'AT-CS03') || products[2],
      notes: '14.5 oz Wakayama loopwheel fleece layered over compact open-end cotton horizontal border tee.',
    },
    {
      id: 'look-03',
      titleEn: 'LOOK 03 — GIZA ROYAL OXFORD & CREW SWEAT',
      titleJp: 'LOOK 03 — ギザオックスフォード & クルースウェット',
      season: '2025 F/W',
      location: 'DAIKANYAMA, TOKYO',
      primaryProduct: products.find((p) => p.code === 'AT-SH06') || products[5],
      secondaryProduct: products.find((p) => p.code === 'AT-SW05') || products[4],
      notes: 'Oversized tailored royal oxford shirt anchored beneath heavy Japanese French terry crewneck with athletic side ribbing.',
    },
    {
      id: 'look-04',
      titleEn: 'LOOK 04 — EVERYDAY ESSENTIALS PACK',
      titleJp: 'LOOK 04 — デイリーエッセンシャルズ',
      season: '2026 S/S',
      location: 'GINZA / TSUKIJI, TOKYO',
      primaryProduct: products.find((p) => p.code === 'AT-BG07') || products[6],
      secondaryProduct: products.find((p) => p.code === 'AT-AC08') || products[7],
      notes: 'Kurashiki #6 heavy duck canvas shoulder tote alongside bio-washed 6-panel cap and Nara-knitted athletic crew socks.',
    },
  ];

  return (
    <div className="space-y-16 py-4">
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950 font-sans">
          EDITORIAL LOOKBOOK
        </h2>
        <p className="text-xs font-mono-nums text-neutral-500 mt-1">
          ARCHIVE VOLUME 01 · PHOTOGRAPHED IN TOKYO, JAPAN
        </p>
      </div>

      <div className="space-y-20">
        {looks.map((look) => (
          <div
            key={look.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-neutral-200/80 pb-16"
          >
            {/* Visual Display: 2 side-by-side or stacked product images */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => onSelect(look.primaryProduct)}
                className="group cursor-pointer bg-white border border-neutral-200 p-6 flex flex-col justify-between hover:border-neutral-900 transition-colors"
              >
                <div className="aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={look.primaryProduct.primaryImage}
                    alt={look.primaryProduct.titleEn}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="font-mono-nums text-[11px] text-neutral-400 uppercase">
                      {look.primaryProduct.code}
                    </span>
                    <h3 className="text-xs font-semibold text-neutral-900 font-sans">
                      {look.primaryProduct.titleEn}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono-nums text-neutral-900">
                    <span>
                      {currency === 'JPY'
                        ? `¥${look.primaryProduct.priceJpy.toLocaleString('ja-JP')}`
                        : `$${look.primaryProduct.priceUsd}`}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div
                onClick={() => onSelect(look.secondaryProduct)}
                className="group cursor-pointer bg-white border border-neutral-200 p-6 flex flex-col justify-between hover:border-neutral-900 transition-colors"
              >
                <div className="aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={look.secondaryProduct.primaryImage}
                    alt={look.secondaryProduct.titleEn}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="font-mono-nums text-[11px] text-neutral-400 uppercase">
                      {look.secondaryProduct.code}
                    </span>
                    <h3 className="text-xs font-semibold text-neutral-900 font-sans">
                      {look.secondaryProduct.titleEn}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono-nums text-neutral-900">
                    <span>
                      {currency === 'JPY'
                        ? `¥${look.secondaryProduct.priceJpy.toLocaleString('ja-JP')}`
                        : `$${look.secondaryProduct.priceUsd}`}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Information Block */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-xs font-mono-nums text-neutral-400 uppercase flex items-center gap-2">
                <span>{look.season}</span>
                <span>·</span>
                <span>{look.location}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold tracking-tight text-neutral-950 font-sans">
                  {look.titleEn}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {look.titleJp}
                </p>
              </div>

              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                {look.notes}
              </p>

              <div className="pt-2 text-xs font-mono-nums text-neutral-500 space-y-1">
                <div>PRIMARY: {look.primaryProduct.titleEn} ({look.primaryProduct.code})</div>
                <div>SECONDARY: {look.secondaryProduct.titleEn} ({look.secondaryProduct.code})</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
