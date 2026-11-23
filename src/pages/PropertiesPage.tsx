import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Map as MapIcon, RotateCcw, Search, SlidersHorizontal, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatAreaToMarla } from '../lib/defaults';
import { usePageSeo } from '../lib/seo';
import { PropertyCard } from '../components/PropertyCard';
import { PropertiesMapView } from '../components/GoogleMapsView';

const CATEGORIES = [
  'Residential',
  'Commercial',
  'Apartments',
  'Houses',
  'Plots',
  'Investment Properties',
];

export const PropertiesPage: React.FC = () => {
  const { properties, savedIds, isShowingDemoFallback, loadingProperties } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  usePageSeo({
    title: 'Property Listings | Al Hassan Garden Sahiwal',
    description:
      'Search residential homes, commercial suites, apartments, and plots in Sahiwal by location, category, price, bedrooms, and size.',
  });

  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [minBathrooms, setMinBathrooms] = useState('');
  const [minMarla, setMinMarla] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const resetFilters = () => {
    setLocationQuery('');
    setCategory('');
    setStatus('');
    setMinPrice('');
    setMaxPrice('');
    setMinBedrooms('');
    setMinBathrooms('');
    setMinMarla('');
    setSavedOnly(false);
    setSearchParams({});
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      if (savedOnly && !savedIds.includes(prop.id)) return false;

      if (locationQuery.trim()) {
        const q = locationQuery.toLowerCase().trim();
        const hay = `${prop.title} ${prop.location} ${prop.address} ${prop.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (category && prop.category !== category) return false;
      if (status && prop.status !== status) return false;

      const minP = Number(minPrice);
      if (minPrice && Number.isFinite(minP) && prop.pricePkr < minP) return false;

      const maxP = Number(maxPrice);
      if (maxPrice && Number.isFinite(maxP) && prop.pricePkr > maxP) return false;

      const minB = Number(minBedrooms);
      if (minBedrooms && Number.isFinite(minB) && prop.bedrooms < minB) return false;

      const minBath = Number(minBathrooms);
      if (minBathrooms && Number.isFinite(minBath) && prop.bathrooms < minBath) return false;

      const minM = Number(minMarla);
      if (minMarla && Number.isFinite(minM)) {
        const marlaEquivalent = formatAreaToMarla(prop.areaValue, prop.areaUnit);
        if (marlaEquivalent < minM) return false;
      }

      return true;
    });
  }, [
    properties,
    savedOnly,
    savedIds,
    locationQuery,
    category,
    status,
    minPrice,
    maxPrice,
    minBedrooms,
    minBathrooms,
    minMarla,
  ]);

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E9EEF3]">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#23845B] mb-2">
              Property Search &amp; Portfolio
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#102A43]">
              Explore Sahiwal Properties
            </h1>
            <p className="mt-2 text-sm text-[#748394]">
              Filter by location, property category, price range, bedrooms, bathrooms, and plot
              size.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMobileFilters((v) => !v)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E9EEF3] bg-white text-xs font-semibold text-[#102A43] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              {showMobileFilters ? 'Hide Filters' : 'Filters'}
            </button>

            <div className="inline-flex items-center p-1 rounded-lg bg-white border border-[#E9EEF3]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#102A43] text-white'
                    : 'text-[#263746] hover:bg-[#F5F7FA]'
                }`}
              >
                <Grid className="w-3.5 h-3.5" aria-hidden="true" />
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#102A43] text-white'
                    : 'text-[#263746] hover:bg-[#F5F7FA]'
                }`}
              >
                <List className="w-3.5 h-3.5" aria-hidden="true" />
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#102A43] text-white'
                    : 'text-[#263746] hover:bg-[#F5F7FA]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" aria-hidden="true" />
                Map View
              </button>
            </div>
          </div>
        </div>

        {isShowingDemoFallback && (
          <div className="mt-6 rounded-xl border border-[#102A43]/15 bg-white px-5 py-3 text-xs sm:text-sm text-[#263746]">
            <strong className="text-[#102A43]">Demonstration Portfolio Active:</strong> These
            illustrative listings demonstrate property search, map pins, and detailed pages.
            Administrators can replace them with verified listings in the Admin Dashboard.
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters Sidebar */}
          <aside
            className={`lg:col-span-3 bg-white rounded-xl border border-[#E9EEF3] p-5 space-y-5 ${
              showMobileFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF3]">
              <h2 className="text-sm font-semibold text-[#102A43]">Refine Search</h2>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#23845B] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                Reset
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                Location / Keyword
              </label>
              <div className="relative">
                <Search
                  className="w-4 h-4 text-[#748394] absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Noor Shah Rd, Sahiwal..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-sm text-[#263746] focus:bg-white focus:outline-none focus:border-[#102A43]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                Listing Status
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['', 'For Sale', 'For Rent'].map((st) => (
                  <button
                    key={st || 'all'}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      status === st
                        ? 'bg-[#102A43] text-white border-[#102A43]'
                        : 'bg-white text-[#263746] border-[#E9EEF3] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    {st || 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                Property Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-sm text-[#263746] focus:bg-white focus:outline-none focus:border-[#102A43]"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Min Price (PKR)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500000}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="e.g. 20000000"
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-xs text-[#263746] focus:bg-white focus:outline-none focus:border-[#102A43] tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Max Price (PKR)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="e.g. 200000000"
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-xs text-[#263746] focus:bg-white focus:outline-none focus:border-[#102A43] tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Bedrooms
                </label>
                <select
                  value={minBedrooms}
                  onChange={(e) => setMinBedrooms(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-xs text-[#263746] focus:bg-white focus:outline-none focus:border-[#102A43]"
                >
                  <option value="">Any</option>
                  <option value="1">1+ Beds</option>
                  <option value="2">2+ Beds</option>
                  <option value="3">3+ Beds</option>
                  <option value="4">4+ Beds</option>
                  <option value="5">5+ Beds</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Bathrooms
                </label>
                <select
                  value={minBathrooms}
                  onChange={(e) => setMinBathrooms(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-xs text-[#263746] focus:bg-white focus:outline-none focus:border-[#102A43]"
                >
                  <option value="">Any</option>
                  <option value="1">1+ Baths</option>
                  <option value="2">2+ Baths</option>
                  <option value="3">3+ Baths</option>
                  <option value="4">4+ Baths</option>
                  <option value="5">5+ Baths</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                Minimum Property Size
              </label>
              <select
                value={minMarla}
                onChange={(e) => setMinMarla(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-sm text-[#263746] focus:bg-white focus:outline-none focus:border-[#102A43]"
              >
                <option value="">Any Size</option>
                <option value="5">5 Marla+ (1,125+ Sq Ft)</option>
                <option value="10">10 Marla+ (2,250+ Sq Ft)</option>
                <option value="20">1 Kanal+ (20+ Marla)</option>
                <option value="40">2 Kanal+ (40+ Marla)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setSavedOnly((v) => !v)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                savedOnly
                  ? 'bg-[#23845B]/10 border-[#23845B] text-[#23845B]'
                  : 'bg-[#F5F7FA] border-[#E9EEF3] text-[#263746]'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Heart className={`w-3.5 h-3.5 ${savedOnly ? 'fill-[#23845B]' : ''}`} />
                Saved Shortlist Only
              </span>
              <span className="tabular-nums">{savedIds.length}</span>
            </button>
          </aside>

          {/* Results Area */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-5 text-xs sm:text-sm text-[#748394]">
              <p className="tabular-nums">
                Showing <strong className="text-[#102A43]">{filteredProperties.length}</strong>{' '}
                {filteredProperties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>

            {loadingProperties ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-xl border border-[#E9EEF3] h-80 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E9EEF3] p-12 text-center">
                <p className="font-display text-2xl font-semibold text-[#102A43]">
                  No Matching Properties Found
                </p>
                <p className="text-sm text-[#748394] mt-2 max-w-md mx-auto">
                  Adjust your price, location, or size filters to explore other investment
                  opportunities.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 px-5 py-2.5 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#071B2D] cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'map' ? (
              <div className="space-y-6">
                <PropertiesMapView properties={filteredProperties} heightClass="h-[540px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProperties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-6">
                {filteredProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} layout="list" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
