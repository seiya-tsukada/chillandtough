import React, { useState, useEffect } from 'react';
import { Product, Category, ReleaseSeason, SizeMeasurement } from '../types/catalog';
import { X, Plus, Trash2, Check } from 'lucide-react';

interface ProductEditorModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>, id?: string) => void;
}

const SAMPLE_IMAGES = [
  { label: 'Nylon Track Jacket (Black)', url: '/images/catalog_nylon_jacket_1792555601489.jpg' },
  { label: 'Loopwheel Hoodie (Ash)', url: '/images/catalog_loopwheel_hoodie_1792555602331.jpg' },
  { label: 'Border Stripe L/S Tee', url: '/images/catalog_border_tee_1792555602999.jpg' },
  { label: 'Nylon Easy Pants (Black)', url: '/images/catalog_nylon_pants_1792555625588.jpg' },
  { label: 'Crewneck Sweatshirt (Navy)', url: '/images/catalog_navy_crewneck_1792555626364.jpg' },
  { label: 'Oxford B.D. Shirt (White)', url: '/images/catalog_oxford_shirt_1792555626446.jpg' },
  { label: 'Heavy Canvas Tote (Ecru)', url: '/images/catalog_canvas_tote_1792555626362.jpg' },
  { label: 'Cap & Socks Set', url: '/images/catalog_caps_and_socks_1792555602987.jpg' },
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleJp, setTitleJp] = useState('');
  const [category, setCategory] = useState<Category>('OUTERWEAR');
  const [season, setSeason] = useState<ReleaseSeason>('2026 S/S');
  const [releaseDate, setReleaseDate] = useState('');
  const [priceJpy, setPriceJpy] = useState<number>(30000);
  const [priceUsd, setPriceUsd] = useState<number>(200);
  const [material, setMaterial] = useState('');
  const [origin, setOrigin] = useState('MADE IN JAPAN (TOKYO)');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionJp, setDescriptionJp] = useState('');
  const [primaryImage, setPrimaryImage] = useState(SAMPLE_IMAGES[0].url);
  const [status, setStatus] = useState<'ARCHIVE' | 'RELEASED' | 'LOTTERY CLOSED'>('ARCHIVE');
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([
    { name: 'BLACK', hex: '#111111' },
  ]);
  const [measurements, setMeasurements] = useState<SizeMeasurement[]>([
    { size: 'S', length: 68, chest: 62, shoulder: 54, sleeve: 60 },
    { size: 'M', length: 71, chest: 65, shoulder: 56, sleeve: 62 },
    { size: 'L', length: 74, chest: 68, shoulder: 58, sleeve: 64 },
    { size: 'XL', length: 77, chest: 71, shoulder: 60, sleeve: 66 },
  ]);
  const [details, setDetails] = useState<string[]>(['Tokyo minimal cut', 'Pre-washed fabric']);
  const [newDetailText, setNewDetailText] = useState('');

  useEffect(() => {
    if (product) {
      setCode(product.code);
      setTitleEn(product.titleEn);
      setTitleJp(product.titleJp);
      setCategory(product.category);
      setSeason(product.season);
      setReleaseDate(product.releaseDate);
      setPriceJpy(product.priceJpy);
      setPriceUsd(product.priceUsd);
      setMaterial(product.material);
      setOrigin(product.origin);
      setDescriptionEn(product.descriptionEn);
      setDescriptionJp(product.descriptionJp);
      setPrimaryImage(product.primaryImage);
      setStatus(product.status);
      setColors(product.colors || [{ name: 'BLACK', hex: '#111111' }]);
      setMeasurements(product.measurements || []);
      setDetails(product.details || []);
    } else {
      // Defaults for new product
      setCode(`AT-NEW${Math.floor(Math.random() * 90 + 10)}`);
      setTitleEn('NEW CATALOG ITEM');
      setTitleJp('新規カタログアイテム');
      setCategory('TOPS');
      setSeason('2026 S/S');
      setReleaseDate(new Date().toISOString().slice(0, 10).replace(/-/g, '.'));
      setPriceJpy(25000);
      setPriceUsd(165);
      setMaterial('100% Japanese Combed Cotton');
      setOrigin('MADE IN JAPAN (TOKYO)');
      setDescriptionEn('Minimalist everyday garment crafted with Tokyo design specifications.');
      setDescriptionJp('東京の美意識に基づき仕立てられたミニマルなデイリーウェア。');
      setPrimaryImage(SAMPLE_IMAGES[0].url);
      setStatus('ARCHIVE');
      setColors([{ name: 'BLACK', hex: '#111111' }, { name: 'WHITE', hex: '#ffffff' }]);
      setMeasurements([
        { size: 'S', length: 68, chest: 62, shoulder: 54, sleeve: 60 },
        { size: 'M', length: 71, chest: 65, shoulder: 56, sleeve: 62 },
        { size: 'L', length: 74, chest: 68, shoulder: 58, sleeve: 64 },
        { size: 'XL', length: 77, chest: 71, shoulder: 60, sleeve: 66 },
      ]);
      setDetails(['Relaxed silhouette', 'High durability seams', 'Made in Tokyo']);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleMeasurementChange = (
    index: number,
    field: keyof SizeMeasurement,
    val: string
  ) => {
    const updated = [...measurements];
    const num = parseFloat(val) || 0;
    (updated[index] as any)[field] = num;
    setMeasurements(updated);
  };

  const handleAddColor = () => {
    setColors([...colors, { name: 'NAVY', hex: '#1a2332' }]);
  };

  const handleRemoveColor = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
  };

  const handleAddDetail = () => {
    if (newDetailText.trim()) {
      setDetails([...details, newDetailText.trim()]);
      setNewDetailText('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        code: code.trim(),
        titleEn: titleEn.trim(),
        titleJp: titleJp.trim(),
        category,
        season,
        releaseDate,
        priceJpy: Number(priceJpy),
        priceUsd: Number(priceUsd),
        material,
        origin,
        descriptionEn,
        descriptionJp,
        primaryImage,
        status,
        colors,
        measurements,
        details,
      },
      product?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#fafafa] border border-neutral-300 flex flex-col z-10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 bg-white">
          <div className="flex items-center gap-2">
            <span className="font-mono-nums text-xs text-neutral-400 uppercase">
              CATALOG EDITOR
            </span>
            <span aria-hidden="true" className="text-neutral-300">/</span>
            <h2 className="font-bold text-neutral-950 font-sans text-sm md:text-base">
              {product ? `Edit: ${product.code} — ${product.titleEn}` : 'Add New Catalog Item'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Row 1: Code, Titles, Category */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                SKU / Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs font-mono-nums p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
                placeholder="AT-JK01"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full text-xs font-mono-nums p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
              >
                <option value="OUTERWEAR">OUTERWEAR</option>
                <option value="TOPS">TOPS</option>
                <option value="BOTTOMS">BOTTOMS</option>
                <option value="GOODS">GOODS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Season *
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as ReleaseSeason)}
                className="w-full text-xs font-mono-nums p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
              >
                <option value="2026 S/S">2026 S/S</option>
                <option value="2025 F/W">2025 F/W</option>
                <option value="ARCHIVE">ARCHIVE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs font-mono-nums p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
              >
                <option value="ARCHIVE">ARCHIVE</option>
                <option value="RELEASED">RELEASED</option>
                <option value="LOTTERY CLOSED">LOTTERY CLOSED</option>
              </select>
            </div>
          </div>

          {/* Row 2: Title EN & JP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Product Title (English) *
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full text-xs font-sans p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
                placeholder="TECHNICAL NYLON TRACK JACKET"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Product Title (Japanese) *
              </label>
              <input
                type="text"
                required
                value={titleJp}
                onChange={(e) => setTitleJp(e.target.value)}
                className="w-full text-xs font-sans p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
                placeholder="テクニカル ナイロン トラック ジャケット"
              />
            </div>
          </div>

          {/* Row 3: Prices & Release Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Price in JPY (¥) *
              </label>
              <input
                type="number"
                required
                value={priceJpy}
                onChange={(e) => setPriceJpy(Number(e.target.value))}
                className="w-full text-xs font-mono-nums p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
                placeholder="38500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Price in USD ($) *
              </label>
              <input
                type="number"
                required
                value={priceUsd}
                onChange={(e) => setPriceUsd(Number(e.target.value))}
                className="w-full text-xs font-mono-nums p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
                placeholder="250"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Release Date *
              </label>
              <input
                type="text"
                required
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full text-xs font-mono-nums p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
                placeholder="2026.04.12"
              />
            </div>
          </div>

          {/* Row 4: Material & Origin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Material Composition *
              </label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full text-xs font-mono-nums p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
                placeholder="Shell: 100% Taslan Nylon / Lining: 100% Polyester Mesh"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Provenance Origin *
              </label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full text-xs font-mono-nums p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
                placeholder="MADE IN JAPAN (TOKYO)"
              />
            </div>
          </div>

          {/* Row 5: Image Selection */}
          <div className="border border-neutral-200 bg-white p-4">
            <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-2">
              Primary Studio Image Asset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {SAMPLE_IMAGES.map((img) => (
                <button
                  type="button"
                  key={img.url}
                  onClick={() => setPrimaryImage(img.url)}
                  className={`text-left p-1.5 border text-[11px] transition-all flex flex-col items-center gap-1.5 ${
                    primaryImage === img.url
                      ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full aspect-[4/3] object-contain bg-white"
                  />
                  <span className="truncate w-full text-center text-neutral-600 font-mono-nums">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={primaryImage}
              onChange={(e) => setPrimaryImage(e.target.value)}
              className="w-full text-xs font-mono-nums p-2 bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-950"
              placeholder="Or enter custom image path / URL..."
            />
          </div>

          {/* Row 6: Size Measurements Table (cm) */}
          <div className="border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-nums uppercase font-semibold text-neutral-900">
                Official Measurements Table (cm)
              </span>
              <span className="text-[11px] font-mono-nums text-neutral-400">
                EDIT FLAT MEASUREMENTS
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono-nums">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 text-left">
                    <th className="py-1.5">SIZE</th>
                    <th className="py-1.5">LENGTH (着丈)</th>
                    <th className="py-1.5">CHEST (身幅)</th>
                    <th className="py-1.5">SHOULDER (肩幅)</th>
                    <th className="py-1.5">SLEEVE (袖丈)</th>
                    {category === 'BOTTOMS' && (
                      <>
                        <th className="py-1.5">WAIST (ウエスト)</th>
                        <th className="py-1.5">INSEAM (股下)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {measurements.map((m, idx) => (
                    <tr key={m.size}>
                      <td className="py-1.5 font-bold">{m.size}</td>
                      <td className="py-1.5">
                        <input
                          type="number"
                          value={m.length || ''}
                          onChange={(e) => handleMeasurementChange(idx, 'length', e.target.value)}
                          className="w-16 p-1 border border-neutral-200 text-center"
                        />
                      </td>
                      <td className="py-1.5">
                        <input
                          type="number"
                          value={m.chest || ''}
                          onChange={(e) => handleMeasurementChange(idx, 'chest', e.target.value)}
                          className="w-16 p-1 border border-neutral-200 text-center"
                        />
                      </td>
                      <td className="py-1.5">
                        <input
                          type="number"
                          value={m.shoulder || ''}
                          onChange={(e) => handleMeasurementChange(idx, 'shoulder', e.target.value)}
                          className="w-16 p-1 border border-neutral-200 text-center"
                        />
                      </td>
                      <td className="py-1.5">
                        <input
                          type="number"
                          value={m.sleeve || ''}
                          onChange={(e) => handleMeasurementChange(idx, 'sleeve', e.target.value)}
                          className="w-16 p-1 border border-neutral-200 text-center"
                        />
                      </td>
                      {category === 'BOTTOMS' && (
                        <>
                          <td className="py-1.5">
                            <input
                              type="number"
                              value={m.waist || ''}
                              onChange={(e) => handleMeasurementChange(idx, 'waist', e.target.value)}
                              className="w-16 p-1 border border-neutral-200 text-center"
                            />
                          </td>
                          <td className="py-1.5">
                            <input
                              type="number"
                              value={m.inseam || ''}
                              onChange={(e) => handleMeasurementChange(idx, 'inseam', e.target.value)}
                              className="w-16 p-1 border border-neutral-200 text-center"
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 7: Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Description (English)
              </label>
              <textarea
                rows={3}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full text-xs font-sans p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Description (Japanese)
              </label>
              <textarea
                rows={3}
                value={descriptionJp}
                onChange={(e) => setDescriptionJp(e.target.value)}
                className="w-full text-xs font-sans p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono-nums text-neutral-600 hover:text-neutral-950 border border-neutral-200 bg-white"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-mono-nums text-white bg-neutral-950 hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{product ? 'SAVE CHANGES' : 'CREATE ITEM'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
