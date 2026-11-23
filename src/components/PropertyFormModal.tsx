import React, { useState } from 'react';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OFFICE_COORDINATES, slugify } from '../lib/defaults';
import { PRESET_GALLERY_ASSETS } from '../lib/demoImages';
import type { AreaUnit, Property, PropertyCategory, PropertyStatus } from '../types';
import { PropertyImageSlot } from './PropertyImageSlot';

interface PropertyFormModalProps {
  initial?: Property | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const CATEGORIES: PropertyCategory[] = [
  'Residential',
  'Commercial',
  'Apartments',
  'Houses',
  'Plots',
  'Investment Properties',
];

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  initial,
  onClose,
  onSaved,
}) => {
  const { saveProperty, uploadImageFile, addGalleryImage, galleryImages } = useApp();

  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [category, setCategory] = useState<PropertyCategory>(initial?.category || 'Houses');
  const [status, setStatus] = useState<PropertyStatus>(initial?.status || 'For Sale');
  const [pricePkr, setPricePkr] = useState(initial ? String(initial.pricePkr) : '');
  const [location, setLocation] = useState(
    initial?.location || 'Main Faisalabad Noor Shah Rd, Sahiwal'
  );
  const [address, setAddress] = useState(initial?.address || '');
  const [bedrooms, setBedrooms] = useState(initial ? String(initial.bedrooms) : '4');
  const [bathrooms, setBathrooms] = useState(initial ? String(initial.bathrooms) : '5');
  const [areaValue, setAreaValue] = useState(initial ? String(initial.areaValue) : '10');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>(initial?.areaUnit || 'Marla');
  const [coveredAreaSqFt, setCoveredAreaSqFt] = useState(
    initial ? String(initial.coveredAreaSqFt) : '3600'
  );
  const [plotSizeLabel, setPlotSizeLabel] = useState(initial?.plotSizeLabel || '10 Marla (35 x 70 ft)');
  const [lat, setLat] = useState(initial ? String(initial.lat) : String(OFFICE_COORDINATES.lat));
  const [lng, setLng] = useState(initial ? String(initial.lng) : String(OFFICE_COORDINATES.lng));
  const [description, setDescription] = useState(initial?.description || '');
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [customImgUrl, setCustomImgUrl] = useState('');
  const [floorPlanUrl, setFloorPlanUrl] = useState(initial?.floorPlanUrl || '');
  const [virtualTourUrl, setVirtualTourUrl] = useState(initial?.virtualTourUrl || '');
  const [featuresText, setFeaturesText] = useState((initial?.features || []).join('\n'));
  const [amenitiesText, setAmenitiesText] = useState((initial?.amenities || []).join('\n'));
  const [highlightsText, setHighlightsText] = useState(
    (initial?.investmentHighlights || []).join('\n')
  );
  const [isPublished, setIsPublished] = useState(initial ? initial.isPublished : true);
  const [isFeatured, setIsFeatured] = useState(initial ? initial.isFeatured : true);
  const [isDemo, setIsDemo] = useState(initial ? initial.isDemo : false);

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingFloorPlan, setUploadingFloorPlan] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError(null);
    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const url = await uploadImageFile(file);
        uploadedUrls.push(url);
        await addGalleryImage({
          title: title || file.name.replace(/\.[^.]+$/, ''),
          collectionName: category,
          url,
          isPublic: true,
        });
      }
      setImages((prev) => [...prev, ...uploadedUrls].slice(0, 20));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadingFloorPlan(true);
    try {
      const url = await uploadImageFile(file);
      await addGalleryImage({
        title: `${title || 'Property'} Floor Plan`,
        collectionName: 'Floor Plans',
        url,
        isPublic: true,
      });
      setFloorPlanUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Floor plan upload failed.');
    } finally {
      setUploadingFloorPlan(false);
      e.target.value = '';
    }
  };

  const handleAddCustomUrl = () => {
    const trimmed = customImgUrl.trim();
    if (!trimmed) return;
    setImages((prev) => [...prev, trimmed].slice(0, 20));
    setCustomImgUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError('Property title must be at least 3 characters.');
      return;
    }
    if (description.trim().length < 10) {
      setError('Property description must be at least 10 characters.');
      return;
    }
    if (location.trim().length < 2 || address.trim().length < 3) {
      setError('Please provide both location and full address.');
      return;
    }

    const splitLines = (text: string) =>
      text
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

    setSaving(true);
    try {
      await saveProperty({
        id: initial?.id,
        title: title.trim(),
        slug: slugify(slug || title),
        description: description.trim(),
        category,
        status,
        pricePkr: Number(pricePkr) || 0,
        location: location.trim(),
        address: address.trim(),
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        areaValue: Number(areaValue) || 1,
        areaUnit,
        coveredAreaSqFt: Number(coveredAreaSqFt) || 0,
        plotSizeLabel: plotSizeLabel.trim() || `${areaValue} ${areaUnit}`,
        images,
        features: splitLines(featuresText),
        amenities: splitLines(amenitiesText),
        investmentHighlights: splitLines(highlightsText),
        floorPlanUrl: floorPlanUrl.trim(),
        virtualTourUrl: virtualTourUrl.trim(),
        lat: Number(lat) || OFFICE_COORDINATES.lat,
        lng: Number(lng) || OFFICE_COORDINATES.lng,
        isPublished,
        isFeatured,
        isDemo,
      });
      onSaved(initial ? 'Property listing updated.' : 'New property listing published.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property.');
    } finally {
      setSaving(false);
    }
  };

  const availableGallery = [
    ...galleryImages.map((g) => ({ title: g.title, url: g.url })),
    ...PRESET_GALLERY_ASSETS.map((p) => ({ title: p.title, url: p.url })),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#071B2D]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#E9EEF3] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 border-b border-[#E9EEF3] flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#102A43]">
              {initial ? 'Edit Property Listing' : 'Add New Property Listing'}
            </h2>
            <p className="text-xs text-[#748394]">
              All changes persist directly to Firestore.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-lg border border-[#E9EEF3] flex items-center justify-center text-[#263746] hover:bg-[#F5F7FA] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Property Title *
              </label>
              <input
                type="text"
                required
                maxLength={160}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!initial) setSlug(slugify(e.target.value));
                }}
                placeholder="e.g. 1 Kanal Contemporary Residence in Sahiwal"
                className="w-full px-3.5 py-2 rounded-lg border border-[#E9EEF3] text-sm focus:outline-none focus:border-[#102A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                maxLength={140}
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E9EEF3] text-xs font-mono focus:outline-none focus:border-[#102A43]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm focus:outline-none focus:border-[#102A43]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm focus:outline-none focus:border-[#102A43]"
                >
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Price (PKR) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={pricePkr}
                onChange={(e) => setPricePkr(e.target.value)}
                placeholder="e.g. 95000000"
                className="w-full px-3.5 py-2 rounded-lg border border-[#E9EEF3] text-sm tabular-nums focus:outline-none focus:border-[#102A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Location Area *
              </label>
              <input
                type="text"
                required
                maxLength={160}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Main Faisalabad Noor Shah Rd, Sahiwal"
                className="w-full px-3.5 py-2 rounded-lg border border-[#E9EEF3] text-sm focus:outline-none focus:border-[#102A43]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Full Property Address *
              </label>
              <input
                type="text"
                required
                maxLength={260}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, Main Faisalabad Noor Shah Rd, Sahiwal, Pakistan"
                className="w-full px-3.5 py-2 rounded-lg border border-[#E9EEF3] text-sm focus:outline-none focus:border-[#102A43]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 sm:col-span-2">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Bedrooms</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Bathrooms</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Covered Sq Ft
                </label>
                <input
                  type="number"
                  min={0}
                  value={coveredAreaSqFt}
                  onChange={(e) => setCoveredAreaSqFt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:col-span-2">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Area Value *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={0.1}
                  required
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Unit *</label>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                >
                  <option value="Marla">Marla</option>
                  <option value="Kanal">Kanal</option>
                  <option value="Sq Ft">Sq Ft</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Plot Size Label *
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={plotSizeLabel}
                  onChange={(e) => setPlotSizeLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:col-span-2">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm tabular-nums"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Property Description *
              </label>
              <textarea
                rows={4}
                required
                maxLength={5000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed property overview, architectural quality, and surroundings..."
                className="w-full px-3.5 py-2 rounded-lg border border-[#E9EEF3] text-sm focus:outline-none focus:border-[#102A43]"
              />
            </div>
          </div>

          {/* Multi-Image Upload & Gallery Selection */}
          <div className="pt-4 border-t border-[#E9EEF3] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-[#102A43]">
                Property Photographs ({images.length}/20)
              </label>
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#071B2D] cursor-pointer">
                {uploadingImages ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                {uploadingImages ? 'Uploading...' : 'Upload From Computer'}
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleMultiImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={customImgUrl}
                onChange={(e) => setCustomImgUrl(e.target.value)}
                placeholder="Or paste image URL..."
                className="flex-1 px-3 py-2 rounded-lg border border-[#E9EEF3] text-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomUrl}
                className="px-3.5 py-2 rounded-lg border border-[#E9EEF3] text-xs font-semibold text-[#102A43] hover:bg-[#F5F7FA] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {availableGallery.slice(0, 8).map((asset, i) => (
                <button
                  key={`${asset.url}-${i}`}
                  type="button"
                  onClick={() =>
                    setImages((prev) =>
                      prev.includes(asset.url) ? prev : [...prev, asset.url].slice(0, 20)
                    )
                  }
                  className="px-2.5 py-1 rounded border border-[#E9EEF3] bg-[#F5F7FA] text-[11px] font-medium text-[#263746] hover:border-[#102A43] cursor-pointer"
                >
                  + {asset.title}
                </button>
              ))}
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                {images.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E9EEF3] group"
                  >
                    <PropertyImageSlot src={url} alt={`Property upload ${idx + 1}`} />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      aria-label="Remove image"
                      className="absolute top-1 right-1 w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Floor Plan & Virtual Tour */}
          <div className="pt-4 border-t border-[#E9EEF3] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#102A43]">Floor Plan Image URL</label>
                <label className="text-[11px] font-semibold text-[#23845B] hover:underline cursor-pointer">
                  {uploadingFloorPlan ? 'Uploading...' : 'Upload Blueprint'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFloorPlanUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <input
                type="text"
                maxLength={600}
                value={floorPlanUrl}
                onChange={(e) => setFloorPlanUrl(e.target.value)}
                placeholder="/uploads/... or https://..."
                className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Virtual Tour URL
              </label>
              <input
                type="url"
                maxLength={600}
                value={virtualTourUrl}
                onChange={(e) => setVirtualTourUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-xs"
              />
            </div>
          </div>

          {/* Lists */}
          <div className="pt-4 border-t border-[#E9EEF3] grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Features (one per line)
              </label>
              <textarea
                rows={4}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Double-height foyer&#10;Designer kitchen"
                className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Amenities (one per line)
              </label>
              <textarea
                rows={4}
                value={amenitiesText}
                onChange={(e) => setAmenitiesText(e.target.value)}
                placeholder="24/7 Gated Security&#10;Underground Utilities"
                className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Investment Highlights (one per line)
              </label>
              <textarea
                rows={4}
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                placeholder="Prime boulevard frontage&#10;Clear title transfer"
                className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-xs"
              />
            </div>
          </div>

          {/* Flags */}
          <div className="pt-4 border-t border-[#E9EEF3] flex flex-wrap gap-6 text-xs font-semibold text-[#102A43]">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded border-[#E9EEF3]"
              />
              Published on Website
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-[#E9EEF3]"
              />
              Featured on Homepage
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-[#748394]">
              <input
                type="checkbox"
                checked={isDemo}
                onChange={(e) => setIsDemo(e.target.checked)}
                className="rounded border-[#E9EEF3]"
              />
              Mark as Demonstration Listing
            </label>
          </div>

          <div className="pt-4 border-t border-[#E9EEF3] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[#E9EEF3] text-xs font-semibold text-[#263746] hover:bg-[#F5F7FA] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImages || uploadingFloorPlan}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#23845B] text-white text-xs font-semibold hover:bg-[#1B6B49] disabled:opacity-60 cursor-pointer"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {initial ? 'Save Changes' : 'Create Property Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
