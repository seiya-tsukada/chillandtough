import React, { useState, useEffect } from 'react';
import {
  Product,
  Category,
  ProductColor,
  ProductStatus,
  ReleaseSeason,
  SizeMeasurement,
} from '../types/catalog';
import {
  BOTTOMS_MEASUREMENT_COLUMNS,
  MEASUREMENT_COLUMNS,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  RELEASE_SEASONS,
} from '../constants/catalog';
import {
  DEFAULT_COLOR,
  INITIAL_EDITOR_VALUES,
  NEW_COLOR,
  NEW_PRODUCT_CODE_PREFIX,
  NEW_PRODUCT_DEFAULTS,
} from '../constants/admin';
import { SAMPLE_IMAGES } from '../constants/images';
import { todayAsReleaseDate } from '../utils/format';
import { X, Plus, Trash2, Check } from 'lucide-react';

interface ProductEditorModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>, id?: string) => void;
}

// Measurement rows are edited in place, so never hand out the shared defaults directly
const cloneMeasurements = (rows: SizeMeasurement[]): SizeMeasurement[] =>
  rows.map((row) => ({ ...row }));

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState(INITIAL_EDITOR_VALUES.code);
  const [titleEn, setTitleEn] = useState(INITIAL_EDITOR_VALUES.titleEn);
  const [titleJp, setTitleJp] = useState(INITIAL_EDITOR_VALUES.titleJp);
  const [category, setCategory] = useState<Category>(INITIAL_EDITOR_VALUES.category);
  const [season, setSeason] = useState<ReleaseSeason>(INITIAL_EDITOR_VALUES.season);
  const [releaseDate, setReleaseDate] = useState(INITIAL_EDITOR_VALUES.releaseDate);
  const [priceJpy, setPriceJpy] = useState<number>(INITIAL_EDITOR_VALUES.priceJpy);
  const [priceUsd, setPriceUsd] = useState<number>(INITIAL_EDITOR_VALUES.priceUsd);
  const [material, setMaterial] = useState(INITIAL_EDITOR_VALUES.material);
  const [origin, setOrigin] = useState(INITIAL_EDITOR_VALUES.origin);
  const [descriptionEn, setDescriptionEn] = useState(INITIAL_EDITOR_VALUES.descriptionEn);
  const [descriptionJp, setDescriptionJp] = useState(INITIAL_EDITOR_VALUES.descriptionJp);
  const [primaryImage, setPrimaryImage] = useState(INITIAL_EDITOR_VALUES.primaryImage);
  const [status, setStatus] = useState<ProductStatus>(INITIAL_EDITOR_VALUES.status);
  const [colors, setColors] = useState<ProductColor[]>(INITIAL_EDITOR_VALUES.colors);
  const [measurements, setMeasurements] = useState<SizeMeasurement[]>(() =>
    cloneMeasurements(INITIAL_EDITOR_VALUES.measurements)
  );
  const [details, setDetails] = useState<string[]>(INITIAL_EDITOR_VALUES.details);
  const [newDetailText, setNewDetailText] = useState('');

  useEffect(() => {
    const values: Omit<Product, 'id'> = product
      ? {
          ...product,
          colors: product.colors || [DEFAULT_COLOR],
          measurements: product.measurements || [],
          details: product.details || [],
        }
      : {
          ...NEW_PRODUCT_DEFAULTS,
          code: `${NEW_PRODUCT_CODE_PREFIX}${Math.floor(Math.random() * 90 + 10)}`,
          releaseDate: todayAsReleaseDate(),
          measurements: cloneMeasurements(NEW_PRODUCT_DEFAULTS.measurements),
        };

    setCode(values.code);
    setTitleEn(values.titleEn);
    setTitleJp(values.titleJp);
    setCategory(values.category);
    setSeason(values.season);
    setReleaseDate(values.releaseDate);
    setPriceJpy(values.priceJpy);
    setPriceUsd(values.priceUsd);
    setMaterial(values.material);
    setOrigin(values.origin);
    setDescriptionEn(values.descriptionEn);
    setDescriptionJp(values.descriptionJp);
    setPrimaryImage(values.primaryImage);
    setStatus(values.status);
    setColors(values.colors);
    setMeasurements(values.measurements);
    setDetails(values.details);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const measurementColumns =
    category === 'BOTTOMS' ? [...MEASUREMENT_COLUMNS, ...BOTTOMS_MEASUREMENT_COLUMNS] : MEASUREMENT_COLUMNS;

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
    setColors([...colors, NEW_COLOR]);
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
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
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
                {RELEASE_SEASONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-nums text-neutral-500 uppercase mb-1">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full text-xs font-mono-nums p-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950"
              >
                {PRODUCT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
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
                    {measurementColumns.map((col) => (
                      <th key={col.field} className="py-1.5">{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {measurements.map((m, idx) => (
                    <tr key={m.size}>
                      <td className="py-1.5 font-bold">{m.size}</td>
                      {measurementColumns.map((col) => (
                        <td key={col.field} className="py-1.5">
                          <input
                            type="number"
                            value={m[col.field] || ''}
                            onChange={(e) => handleMeasurementChange(idx, col.field, e.target.value)}
                            className="w-16 p-1 border border-neutral-200 text-center"
                          />
                        </td>
                      ))}
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
