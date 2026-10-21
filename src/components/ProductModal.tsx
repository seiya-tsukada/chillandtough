import React, { useState, useEffect } from 'react';
import { Product } from '../types/catalog';
import { X, ChevronLeft, ChevronRight, Copy, Check, ArrowRight } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  currency: 'JPY' | 'USD';
  onPrevProduct: () => void;
  onNextProduct: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  currency,
  onPrevProduct,
  onNextProduct,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      setCopied(false);
    }
  }, [product]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrevProduct();
      if (e.key === 'ArrowRight') onNextProduct();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevProduct, onNextProduct]);

  if (!product) return null;

  const formattedPrice =
    currency === 'JPY'
      ? `¥${product.priceJpy.toLocaleString('ja-JP')} (税込)`
      : `$${product.priceUsd.toLocaleString('en-US')}`;

  const handleCopySpecs = () => {
    const specs = `ARCHIVE TOKYO
Item: ${product.titleEn} (${product.titleJp})
Code: ${product.code}
Season: ${product.season} | Release: ${product.releaseDate}
Price: ¥${product.priceJpy.toLocaleString('ja-JP')} / $${product.priceUsd}
Material: ${product.material}
Origin: ${product.origin}
Colors: ${product.colors.map((c) => c.name).join(', ')}

[Sizing Measurements (cm)]
${product.measurements
  .map(
    (m) =>
      `${m.size}: Length ${m.length}cm / Chest ${m.chest}cm / Shoulder ${m.shoulder}cm / Sleeve ${m.sleeve}cm` +
      (m.waist ? ` / Waist ${m.waist}cm / Inseam ${m.inseam}cm` : '')
  )
  .join('\n')}`;

    navigator.clipboard.writeText(specs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full h-full md:h-auto md:max-h-[92vh] max-w-5xl bg-[#fafafa] md:border md:border-neutral-200 overflow-y-auto flex flex-col z-10 shadow-2xl">
        {/* Top Header Bar inside modal */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-[#fafafa]/95 px-6 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono-nums text-neutral-500">
            <span>{product.code}</span>
            <span aria-hidden="true">·</span>
            <span>{product.season}</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-900 font-medium">{product.status}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Prev / Next */}
            <div className="flex items-center border border-neutral-200 rounded">
              <button
                onClick={onPrevProduct}
                className="p-1.5 hover:bg-neutral-100 transition-colors border-r border-neutral-200 text-neutral-600"
                title="Previous item (←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNextProduct}
                className="p-1.5 hover:bg-neutral-100 transition-colors text-neutral-600"
                title="Next item (→)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 p-6 md:p-8">
          {/* Left Column: High-Res Imagery */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="aspect-[4/3] w-full bg-white border border-neutral-200 flex items-center justify-center p-6 relative overflow-hidden group">
              <img
                src={product.primaryImage}
                alt={product.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-3 left-3 text-[10px] font-mono-nums text-neutral-400 uppercase">
                Studio Archival Capture · Tokyo
              </div>
            </div>

            {/* Micro specs bar below image */}
            <div className="bg-white p-4 border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
              <div className="flex justify-between font-mono-nums">
                <span className="text-neutral-400">RELEASE DATE</span>
                <span>{product.releaseDate}</span>
              </div>
              <div className="flex justify-between font-mono-nums">
                <span className="text-neutral-400">PROVENANCE</span>
                <span>{product.origin}</span>
              </div>
              <div className="flex justify-between font-mono-nums">
                <span className="text-neutral-400">ARCHIVE SPEC</span>
                <span>NON-REORDERABLE / LIMITED</span>
              </div>
            </div>
          </div>

          {/* Right Column: Garment Information & Size Measurements */}
          <div className="md:col-span-6 flex flex-col justify-between pt-4 md:pt-0">
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950 font-sans">
                  {product.titleEn}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  {product.titleJp}
                </p>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-lg md:text-xl font-mono-nums font-semibold text-neutral-950">
                    {formattedPrice}
                  </span>
                  <span className="text-xs text-neutral-400">
                    Catalog Archive Record
                  </span>
                </div>
              </div>

              {/* Colorways */}
              <div className="space-y-2">
                <label className="text-xs font-mono-nums uppercase text-neutral-500 block">
                  Available Colorways: <span className="text-neutral-900 font-semibold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`px-3 py-1 text-xs font-mono-nums border transition-all ${
                        selectedColor === color.name
                          ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 text-xs md:text-sm text-neutral-700 leading-relaxed">
                <p>{product.descriptionEn}</p>
                <p className="text-neutral-500 text-xs border-l-2 border-neutral-300 pl-3 py-0.5">
                  {product.descriptionJp}
                </p>
              </div>

              {/* Material Composition */}
              <div className="text-xs border-t border-neutral-200 pt-3">
                <span className="text-neutral-400 font-mono-nums uppercase block mb-1">
                  Material Composition
                </span>
                <p className="font-mono-nums text-neutral-800">{product.material}</p>
              </div>

              {/* Size Measurements Table (cm) - Essential for Tokyo Streetwear Enthusiasts */}
              <div className="border border-neutral-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono-nums uppercase font-semibold text-neutral-900">
                    Measurements Table (cm)
                  </span>
                  <span className="text-[11px] font-mono-nums text-neutral-400">
                    FLAT LAID MEASUREMENT
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono-nums">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-400 text-left">
                        <th className="py-1.5 font-normal">SIZE</th>
                        {product.category === 'BOTTOMS' ? (
                          <>
                            <th className="py-1.5 font-normal">WAIST (ウエスト)</th>
                            <th className="py-1.5 font-normal">INSEAM (股下)</th>
                            <th className="py-1.5 font-normal">TOTAL LENGTH (総丈)</th>
                          </>
                        ) : product.category === 'GOODS' ? (
                          <>
                            <th className="py-1.5 font-normal">DIMENSIONS</th>
                            <th className="py-1.5 font-normal">FIT</th>
                          </>
                        ) : (
                          <>
                            <th className="py-1.5 font-normal">LENGTH (着丈)</th>
                            <th className="py-1.5 font-normal">CHEST (身幅)</th>
                            <th className="py-1.5 font-normal">SHOULDER (肩幅)</th>
                            <th className="py-1.5 font-normal">SLEEVE (袖丈)</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-800">
                      {product.measurements.map((m) => (
                        <tr key={m.size} className="hover:bg-neutral-50">
                          <td className="py-2 font-semibold text-neutral-950">{m.size}</td>
                          {product.category === 'BOTTOMS' ? (
                            <>
                              <td className="py-2">{m.waist} cm</td>
                              <td className="py-2">{m.inseam} cm</td>
                              <td className="py-2">{m.length} cm</td>
                            </>
                          ) : product.category === 'GOODS' ? (
                            <>
                              <td className="py-2">Standard Spec</td>
                              <td className="py-2">One Size Fits All</td>
                            </>
                          ) : (
                            <>
                              <td className="py-2">{m.length} cm</td>
                              <td className="py-2">{m.chest} cm</td>
                              <td className="py-2">{m.shoulder} cm</td>
                              <td className="py-2">{m.sleeve} cm</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Construction Details */}
              <div className="space-y-1.5 text-xs text-neutral-600">
                <span className="font-mono-nums uppercase text-neutral-400 block mb-1">
                  Design Specifications
                </span>
                <ul className="space-y-1 list-none pl-0">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-neutral-400 select-none">―</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons at bottom of modal */}
            <div className="pt-6 mt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-[11px] font-mono-nums text-neutral-500">
                Official Catalog Spec · Tokyo Independent
              </div>

              <button
                onClick={handleCopySpecs}
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono-nums text-neutral-900 bg-white border border-neutral-300 hover:border-neutral-900 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY ARCHIVE SPEC</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
