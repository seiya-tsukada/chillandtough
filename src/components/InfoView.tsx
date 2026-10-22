import React from 'react';
import { BRAND_NAME } from '../constants/brand';

export const InfoView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-12">
      {/* Brand Statement */}
      <div className="border-b border-neutral-200 pb-8 space-y-4">
        <span className="text-xs font-mono-nums uppercase text-neutral-400">
          DOCUMENTATION · ARCHIVE ARCHITECTURE
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 font-sans">
          {BRAND_NAME}
        </h1>
        <p className="text-sm md:text-base text-neutral-700 leading-relaxed font-sans">
          chillandtough is an unadorned, non-commercial catalog and permanent digital archive documenting limited apparel and everyday functional garments crafted in Tokyo and across specialized manufacturing regions in Japan.
        </p>
        <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
          当サイトは東京を拠点とするインディペンデントなアパレルアーカイブ・カタログです。過度な装飾や即時購入カートを排し、製品の素材組成、実寸寸法、製造背景、およびリリース情報を純粋なカタログ形式で記録・公開しています。
        </p>
      </div>

      {/* Production & Craftsmanship Manifesto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-neutral-200 pb-8">
        <div className="space-y-3">
          <h2 className="text-sm font-mono-nums uppercase font-semibold text-neutral-900">
            01. MANUFACTURING PROVENANCE
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            All garments are engineered in collaboration with heritage mills across Japan: loopwheel terry from Wakayama, high-density duck canvas from Kurashiki, royal oxford tailoring from Niigata, athletic knitwear from Nara, and technical outerwear tailored in Tokyo.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-mono-nums uppercase font-semibold text-neutral-900">
            02. SIZING & MEASUREMENT STANDARD
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Measurements provided on each product card represent actual flat-laid measurements in centimeters (cm). Due to natural cotton shrinkage and hand-cut artisanal production, a standard tolerance of ±1.5cm may occur across production runs.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-mono-nums uppercase font-semibold text-neutral-900">
            03. CATALOG-ONLY POLICY
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            This digital platform operates strictly as a product catalog and reference archive. Products are released strictly via verified lotteries and curated Tokyo pop-up events. No direct e-commerce checkout exists on this portal.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-mono-nums uppercase font-semibold text-neutral-900">
            04. ARCHIVE PRESERVATION
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Past season specifications, color codes, and fabric references remain permanently accessible in this catalog to serve collectors, stylists, and archival researchers worldwide.
          </p>
        </div>
      </div>

      {/* Specifications & Inquiries */}
      <div className="text-xs font-mono-nums text-neutral-500 space-y-2">
        <div className="flex justify-between border-b border-neutral-100 py-2">
          <span>LOCATION</span>
          <span className="text-neutral-800">TOKYO, JAPAN</span>
        </div>
        <div className="flex justify-between border-b border-neutral-100 py-2">
          <span>CATALOG FORMAT</span>
          <span className="text-neutral-800">PUBLIC DIGITAL ARCHIVE (VER 2.6)</span>
        </div>
        <div className="flex justify-between border-b border-neutral-100 py-2">
          <span>INQUIRIES</span>
          <span className="text-neutral-800">ARCHIVE@EVERYDAYTOKYO.LOCAL</span>
        </div>
      </div>
    </div>
  );
};
