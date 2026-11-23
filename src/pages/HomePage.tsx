import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  ExternalLink,
  FileSearch,
  Handshake,
  LineChart,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Star,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GOOGLE_MAPS_URL, GOOGLE_RATING } from '../lib/defaults';
import { STUDIO_IMAGES } from '../lib/demoImages';
import { usePageSeo } from '../lib/seo';
import { PropertyCard } from '../components/PropertyCard';
import { InquiryForm } from '../components/InquiryForm';
import { OfficeGoogleMap } from '../components/GoogleMapsView';
import { PropertyImageSlot } from '../components/PropertyImageSlot';

const HERO_CATEGORIES = [
  'Residential',
  'Commercial',
  'Apartments',
  'Houses',
  'Plots',
  'Investment Properties',
];

const INVESTMENT_STRATEGIES = [
  {
    title: 'Residential Investment',
    category: 'Residential',
    image: STUDIO_IMAGES.propertyModernVilla,
    description:
      'Evaluation of completed villas and family homes in established Sahiwal neighborhoods, focusing on build quality, title clarity, and long-term neighborhood demand.',
  },
  {
    title: 'Commercial Investment',
    category: 'Commercial',
    image: STUDIO_IMAGES.propertyCommercialTower,
    description:
      'Advisory on corporate suites, commercial plazas, and retail frontage where footfall, parking infrastructure, and commercial lease structures drive asset resilience.',
  },
  {
    title: 'Plot Investments',
    category: 'Plots',
    image: STUDIO_IMAGES.propertyResidentialPlot,
    description:
      'Due diligence on developed and possession-ready residential or commercial land parcels, reviewing development progress, orientation, and transfer procedures.',
  },
  {
    title: 'Rental Income Opportunities',
    category: 'Apartments',
    image: STUDIO_IMAGES.propertyPenthouseInterior,
    description:
      'Identifying apartments, offices, and residences aligned with family and corporate tenancy demand while accounting for maintenance and occupancy fundamentals.',
  },
  {
    title: 'Long-Term Property Investment',
    category: 'Investment Properties',
    image: STUDIO_IMAGES.heroIslamabadEstate,
    description:
      'Strategic portfolio planning for local and overseas investors seeking disciplined capital allocation across Sahiwal corridors with a multi-year holding horizon.',
  },
];

const WHY_CHOOSE_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Professional Real Estate Services',
    description:
      'Structured real estate guidance led from our Main Faisalabad Noor Shah Rd office in Sahiwal, prioritizing clarity at every step of acquisition or sale.',
  },
  {
    icon: Compass,
    title: 'Personalized Investment Guidance',
    description:
      'Recommendations tailored to your budget, liquidity preferences, and holding timeline rather than one-size-fits-all listings.',
  },
  {
    icon: LineChart,
    title: 'Property Market Knowledge',
    description:
      'Grounded familiarity with Sahiwal residential neighborhoods, plots, and commercial corridors to support sound comparisons.',
  },
  {
    icon: FileSearch,
    title: 'Transparent Communication',
    description:
      'Clear presentation of property specifications, pricing expectations, and documentation considerations with no hidden agendas.',
  },
  {
    icon: UserCheck,
    title: 'Dedicated Client Support',
    description:
      'Direct coordination for property visits, seller negotiations, and transfer milestones with responsive advisor access.',
  },
  {
    icon: Handshake,
    title: 'Carefully Evaluated Opportunities',
    description:
      'Each showcased option is reviewed for location fundamentals, physical condition, and practical suitability for buyers or investors.',
  },
];

export const HomePage: React.FC = () => {
  const { properties, isShowingDemoFallback, businessSettings, testimonials, loadingProperties } =
    useApp();
  const navigate = useNavigate();

  usePageSeo({
    title: `${businessSettings.businessName} | Real Estate Sahiwal`,
    description:
      'Discover residential, commercial, and plot opportunities in Sahiwal with Al Hassan Garden.',
  });

  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set('location', searchLocation.trim());
    if (searchCategory) params.set('category', searchCategory);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const featuredProperties = properties
    .filter((p) => p.isFeatured)
    .slice(0, 6);
  const displayProperties = featuredProperties.length > 0 ? featuredProperties : properties.slice(0, 6);

  const directionsHref = GOOGLE_MAPS_URL;

  return (
    <div>
      {/* B. Hero Section */}
      <section id="hero-top" className="relative bg-[#071B2D] text-white overflow-hidden">
        <div className="absolute inset-0">
          <PropertyImageSlot
            src={STUDIO_IMAGES.heroIslamabadEstate}
            alt="Luxury contemporary villa residence in Sahiwal at golden hour"
            priority
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071B2D]/85 via-[#071B2D]/65 to-[#071B2D]/95" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 lg:pt-24 lg:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#23845B] mb-3">
              Sahiwal, Pakistan · Real Estate
            </p>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.12] tracking-tight text-white text-balance">
              Discover Exceptional Properties. Invest in Your Future.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
              Your trusted partner in real estate and property opportunities in Sahiwal, Pakistan.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#23845B] text-white text-sm font-semibold hover:bg-[#1B6B49] transition-colors whitespace-nowrap shrink-0"
              >
                Explore Properties
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="#contact-section"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold hover:bg-white/20 transition-colors whitespace-nowrap shrink-0"
              >
                Consult Our Experts
              </a>
            </div>
          </div>

          {/* Integrated Property Search Panel */}
          <div className="mt-12 bg-white text-[#263746] rounded-xl shadow-xl border border-[#E9EEF3] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 pb-4 mb-4 border-b border-[#E9EEF3]">
              <span className="text-xs font-semibold text-[#748394] mr-2">Categories:</span>
              <button
                type="button"
                onClick={() => setSearchCategory('')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  searchCategory === ''
                    ? 'bg-[#102A43] text-white'
                    : 'bg-[#F5F7FA] text-[#263746] hover:bg-[#E9EEF3]'
                }`}
              >
                All Properties
              </button>
              {HERO_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSearchCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    searchCategory === cat
                      ? 'bg-[#102A43] text-white'
                      : 'bg-[#F5F7FA] text-[#263746] hover:bg-[#E9EEF3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleHeroSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end"
            >
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="e.g. Noor Shah Rd, Sahiwal"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-sm text-[#263746] focus:bg-white focus:outline-none focus:border-[#102A43]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Property Type
                </label>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-sm text-[#263746] focus:bg-white focus:outline-none focus:border-[#102A43]"
                >
                  <option value="">All Property Types</option>
                  {HERO_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Minimum Price (PKR)
                </label>
                <select
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-sm text-[#263746] focus:bg-white focus:outline-none focus:border-[#102A43] tabular-nums"
                >
                  <option value="">No Minimum</option>
                  <option value="20000000">PKR 2 Crore</option>
                  <option value="50000000">PKR 5 Crore</option>
                  <option value="100000000">PKR 10 Crore</option>
                  <option value="150000000">PKR 15 Crore</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Maximum Price (PKR)
                </label>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-sm text-[#263746] focus:bg-white focus:outline-none focus:border-[#102A43] tabular-nums"
                >
                  <option value="">No Maximum</option>
                  <option value="50000000">PKR 5 Crore</option>
                  <option value="100000000">PKR 10 Crore</option>
                  <option value="150000000">PKR 15 Crore</option>
                  <option value="250000000">PKR 25 Crore</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#102A43] text-white text-sm font-semibold hover:bg-[#071B2D] transition-colors cursor-pointer whitespace-nowrap shrink-0 h-[42px]"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                Search Properties
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* C. Featured Properties */}
      <section className="py-16 lg:py-24 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#23845B] mb-2">
                Curated Portfolio
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#102A43] text-balance">
                Featured Properties
              </h2>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#102A43] hover:text-[#23845B] transition-colors whitespace-nowrap shrink-0"
            >
              Browse All Properties
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {(isShowingDemoFallback || displayProperties.some((p) => p.isDemo)) && (
            <div className="mb-8 rounded-xl border border-[#102A43]/15 bg-white px-5 py-3.5 text-xs sm:text-sm text-[#263746] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p>
                <strong className="text-[#102A43]">Demonstration Portfolio:</strong> Listings marked{' '}
                <em>Demonstration Listing</em> are illustrative samples that administrators can
                replace or edit with verified client inventory in the Admin Dashboard.
              </p>
              <Link
                to="/contact"
                className="text-xs font-semibold text-[#23845B] hover:underline whitespace-nowrap shrink-0"
              >
                Request Verified Inventory →
              </Link>
            </div>
          )}

          {loadingProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl border border-[#E9EEF3] overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-[#E9EEF3]" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-1/3 bg-[#E9EEF3] rounded" />
                    <div className="h-5 w-3/4 bg-[#E9EEF3] rounded" />
                    <div className="h-4 w-1/2 bg-[#E9EEF3] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {displayProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* F. Investment Opportunities */}
      <section id="investments-section" className="py-16 lg:py-24 bg-white border-y border-[#E9EEF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-wider text-[#23845B] mb-2">
              Advisory Verticals
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#102A43] text-balance">
              Smart Property Investments. Better Opportunities.
            </h2>
            <p className="mt-3 text-base text-[#748394] leading-relaxed">
              We evaluate residential, commercial, and land opportunities in Sahiwal through
              disciplined due diligence—helping buyers and investors weigh location fundamentals,
              liquidity, and risk without speculative promises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {INVESTMENT_STRATEGIES.map((item, idx) => (
              <Link
                key={item.title}
                to={`/properties?category=${encodeURIComponent(item.category)}`}
                className={`group rounded-xl border border-[#E9EEF3] bg-[#F5F7FA] overflow-hidden hover:border-[#102A43]/30 transition-all flex flex-col ${
                  idx === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-[#E9EEF3] ${
                    idx === 0 ? 'aspect-[16/9] lg:aspect-[21/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <PropertyImageSlot
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#102A43] group-hover:text-[#23845B] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#263746] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#102A43] group-hover:text-[#23845B]">
                    Explore {item.category}
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* G. Why Choose Us? */}
      <section className="py-16 lg:py-24 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-wider text-[#23845B] mb-2">
              Consultancy Standards
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#102A43] text-balance">
              Why Choose {businessSettings.businessName}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white rounded-xl border border-[#E9EEF3] p-6 sm:p-7 flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#102A43]/5 flex items-center justify-center text-[#102A43]">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#102A43]">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#263746] leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* H. About Us */}
      <section id="about-section" className="py-16 lg:py-24 bg-white border-y border-[#E9EEF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 rounded-xl overflow-hidden border border-[#E9EEF3] bg-[#E9EEF3] min-h-[320px]">
              <PropertyImageSlot
                src={STUDIO_IMAGES.aboutConsultancyOffice}
                alt="Al Hassan Garden real estate office"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center gap-5">
              <p className="text-xs font-semibold tracking-wider text-[#23845B]">About Us</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#102A43] text-balance">
                Your Trusted Partner in Real Estate Investment.
              </h2>
              <p className="text-base text-[#263746] leading-relaxed">
                {businessSettings.description}
              </p>
              <p className="text-sm text-[#748394] leading-relaxed">
                Whether you are acquiring a family residence, allocating capital into commercial
                suites, or evaluating residential plots, our team provides clear documentation
                review, grounded market comparisons, and attentive end-to-end coordination.
              </p>

              <div className="pt-4 border-t border-[#E9EEF3] grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#748394]">Real Estate Office</p>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-medium text-[#102A43] hover:text-[#23845B] leading-snug transition-colors"
                  >
                    {businessSettings.officeAddress}
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#748394]">Direct Phone</p>
                  <a
                    href={`tel:${businessSettings.phone.replace(/\s+/g, '')}`}
                    className="block font-medium text-[#102A43] hover:text-[#23845B] tabular-nums transition-colors"
                  >
                    {businessSettings.phone}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#102A43] text-white text-sm font-semibold hover:bg-[#071B2D] transition-colors"
                >
                  Learn About Our Approach
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* I. Client Testimonials & Google Rating */}
      <section className="py-16 lg:py-24 bg-[#102A43] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-white/15">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#23845B] mb-2">
                Verified Client Reputation
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white text-balance">
                Client Trust &amp; Google Reviews
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-6 bg-white/10 rounded-xl px-6 py-4 border border-white/15">
              <div>
                <div
                  className="flex items-center gap-1 text-amber-400 mb-1"
                  aria-label="4.5 out of 5 stars"
                >
                  {[1, 2, 3, 4].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400" aria-hidden="true" />
                  ))}
                  <span className="relative inline-block w-4 h-4" aria-hidden="true">
                    <Star className="w-4 h-4 text-amber-400/35" />
                    <span className="absolute inset-0 overflow-hidden w-1/2">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </span>
                  </span>
                </div>
                <p className="text-2xl font-bold text-white tabular-nums">
                  {GOOGLE_RATING.score} / 5.0
                </p>
                <p className="text-xs text-white/75 tabular-nums">
                  Based on {GOOGLE_RATING.reviewCount} reviews
                </p>
              </div>

              {businessSettings.googleReviewsUrl && (
                <a
                  href={businessSettings.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#102A43] text-xs font-semibold hover:bg-[#F5F7FA] transition-colors whitespace-nowrap shrink-0"
                >
                  View Google Reviews
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {testimonials.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <blockquote
                  key={t.id}
                  className="rounded-xl bg-white/5 border border-white/15 p-6 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {Array.from({ length: Math.round(t.rating) }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">“{t.quote}”</p>
                  </div>
                  <footer className="pt-3 border-t border-white/10">
                    <p className="text-sm font-semibold text-white">{t.clientName}</p>
                    {t.clientRole && <p className="text-xs text-white/65">{t.clientRole}</p>}
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-xl bg-white/5 border border-white/15 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <p className="font-display text-xl font-semibold text-white">
                  4.5-Star Client Satisfaction Across 24 Reviews
                </p>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">
                  We publish individual client quotes strictly from verified submissions added by
                  the business owner. Reach out directly to speak with our real estate team or
                  request a private consultation at our Sahiwal office.
                </p>
              </div>
              <a
                href={`https://wa.me/${businessSettings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#23845B] text-white text-sm font-semibold hover:bg-[#1B6B49] transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Speak With an Advisor
              </a>
            </div>
          )}
        </div>
      </section>

      {/* J & K. Contact, Consultation & Google Maps */}
      <section id="contact-section" className="py-16 lg:py-24 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-wider text-[#23845B] mb-2">
              Private Consultation
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#102A43] text-balance">
              Schedule a Real Estate Consultation
            </h2>
            <p className="mt-3 text-base text-[#748394]">
              Visit our office in Sahiwal or submit your requirements for a tailored property
              briefing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Direct Info + Interactive Google Map */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 sm:p-7 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#102A43]">
                      {businessSettings.businessName}
                    </h3>
                    <p className="text-xs text-[#748394] mt-0.5">
                      Real Estate · Sahiwal, Pakistan
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#23845B]">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    {GOOGLE_RATING.score} ★ ({GOOGLE_RATING.reviewCount} reviews)
                  </span>
                </div>

                <div className="space-y-3.5 pt-2 border-t border-[#E9EEF3] text-sm text-[#263746]">
                  <p className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 shrink-0 text-[#23845B] mt-1" aria-hidden="true" />
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#23845B] transition-colors"
                    >
                      {businessSettings.officeAddress}
                    </a>
                  </p>

                  <p className="flex items-center gap-3 tabular-nums">
                    <Phone className="w-4 h-4 shrink-0 text-[#23845B]" aria-hidden="true" />
                    <a
                      href={`tel:${businessSettings.phone.replace(/\s+/g, '')}`}
                      className="font-semibold text-[#102A43] hover:text-[#23845B]"
                    >
                      {businessSettings.phone}
                    </a>
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${businessSettings.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#23845B] text-white text-xs sm:text-sm font-semibold hover:bg-[#1B6B49] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    Consult on WhatsApp
                  </a>
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#102A43]/20 bg-white text-[#102A43] text-xs sm:text-sm font-semibold hover:bg-[#F5F7FA] transition-colors"
                  >
                    Get Directions
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <OfficeGoogleMap
                businessName={businessSettings.businessName}
                address={businessSettings.officeAddress}
                plusCode={businessSettings.plusCode}
                heightClass="h-[340px]"
              />
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-[#E9EEF3] p-6 sm:p-8">
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#E9EEF3]">
                <Building2 className="w-5 h-5 text-[#23845B]" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#102A43]">
                    Request a Consultation
                  </h3>
                  <p className="text-xs text-[#748394]">
                    Submissions are routed directly to our consultancy desk.
                  </p>
                </div>
              </div>
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
