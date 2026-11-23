import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarCheck,
  Check,
  ExternalLink,
  Heart,
  Layers,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  PlayCircle,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPkr, GOOGLE_MAPS_URL } from '../lib/defaults';
import { usePageSeo } from '../lib/seo';
import type { InquiryKind } from '../types';
import { PropertyImageSlot } from '../components/PropertyImageSlot';
import { SinglePropertyMap } from '../components/GoogleMapsView';
import { InquiryForm } from '../components/InquiryForm';

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { properties, savedIds, toggleSaved, businessSettings, loadingProperties } = useApp();

  const property = useMemo(
    () => properties.find((p) => p.slug === slug || p.id === slug),
    [properties, slug]
  );

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [inquiryMode, setInquiryMode] = useState<InquiryKind>('Property Inquiry');

  const listingJsonLd = useMemo(() => {
    if (!property) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: property.title,
      description: property.description,
      url: window.location.href,
      offers: {
        '@type': 'Offer',
        price: property.pricePkr,
        priceCurrency: 'PKR',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.address,
        addressLocality: 'Sahiwal',
        addressCountry: 'PK',
      },
    };
  }, [property]);

  usePageSeo({
    title: property
      ? `${property.title} | ${businessSettings.businessName}`
      : `Property Details | ${businessSettings.businessName}`,
    description: property
      ? `${property.title} in ${property.location} — ${formatPkr(
          property.pricePkr,
          property.status === 'For Rent'
        )}.`
      : 'Explore property details and real estate opportunities in Sahiwal.',
    jsonLd: listingJsonLd,
  });

  if (loadingProperties && !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-96 rounded-xl bg-[#E9EEF3] animate-pulse" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-[#102A43]">Property Not Found</h1>
        <p className="mt-3 text-sm text-[#748394]">
          This listing may have been updated or removed by the administrator.
        </p>
        <Link
          to="/properties"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#102A43] text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Properties
        </Link>
      </div>
    );
  }

  const isSaved = savedIds.includes(property.id);
  const images = property.images.length > 0 ? property.images : [''];
  const currentImg = images[activeImageIdx] || images[0];
  const priceLabel = formatPkr(property.pricePkr, property.status === 'For Rent');
  const whatsappText = encodeURIComponent(
    `Hello ${businessSettings.businessName}, I would like details regarding "${property.title}" (${priceLabel}).`
  );

  const openAgentInquiry = (kind: InquiryKind) => {
    setInquiryMode(kind);
    const el = document.getElementById('property-inquiry-box');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#102A43] hover:text-[#23845B]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Properties
          </Link>

          <button
            type="button"
            onClick={() => toggleSaved(property.id)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E9EEF3] bg-white text-xs font-semibold text-[#102A43] hover:bg-[#F5F7FA] cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${isSaved ? 'fill-[#23845B] text-[#23845B]' : 'text-[#102A43]'}`}
            />
            {isSaved ? 'Saved to Shortlist' : 'Save Property'}
          </button>
        </div>

        {property.isDemo && (
          <div className="mb-6 rounded-xl border border-[#102A43]/20 bg-white px-5 py-3 text-xs sm:text-sm text-[#263746]">
            <strong className="text-[#102A43]">Demonstration Listing:</strong> This sample property
            is shown for portfolio demonstration. Contact us directly for verified live inventory
            in Sahiwal.
          </div>
        )}

        {/* Header Summary */}
        <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#23845B] mb-2">
                <span>{property.status}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#748394]">{property.category}</span>
                {property.isDemo && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#748394]">Demonstration Sample</span>
                  </>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-semibold text-[#102A43]">
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-[#748394]">
                <MapPin className="w-4 h-4 shrink-0 text-[#23845B]" aria-hidden="true" />
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#102A43] transition-colors"
                >
                  {property.address}
                </a>
              </p>
            </div>

            <div className="lg:text-right shrink-0">
              <p className="text-xs font-semibold text-[#748394]">Asking Price</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#102A43] tabular-nums mt-0.5">
                {priceLabel}
              </p>
            </div>
          </div>

          {/* Key Specifications Strip */}
          <div className="mt-6 pt-6 border-t border-[#E9EEF3] grid grid-cols-2 sm:grid-cols-4 gap-4 tabular-nums">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5F7FA] flex items-center justify-center text-[#102A43]">
                <BedDouble className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[#748394]">Bedrooms</p>
                <p className="text-sm font-semibold text-[#102A43]">
                  {property.bedrooms > 0 ? property.bedrooms : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5F7FA] flex items-center justify-center text-[#102A43]">
                <Bath className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[#748394]">Bathrooms</p>
                <p className="text-sm font-semibold text-[#102A43]">
                  {property.bathrooms > 0 ? property.bathrooms : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5F7FA] flex items-center justify-center text-[#102A43]">
                <Maximize2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[#748394]">Covered Area</p>
                <p className="text-sm font-semibold text-[#102A43]">
                  {property.coveredAreaSqFt > 0
                    ? `${property.coveredAreaSqFt.toLocaleString()} Sq Ft`
                    : 'Open Plot'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5F7FA] flex items-center justify-center text-[#102A43]">
                <Layers className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[#748394]">Plot / Land Size</p>
                <p className="text-sm font-semibold text-[#102A43]">{property.plotSizeLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl border border-[#E9EEF3] overflow-hidden">
              <button
                type="button"
                onClick={() => currentImg && setLightboxUrl(currentImg)}
                className="w-full aspect-[16/10] bg-[#E9EEF3] block overflow-hidden cursor-zoom-in"
              >
                <PropertyImageSlot
                  src={currentImg}
                  alt={`${property.title} image ${activeImageIdx + 1}`}
                  priority
                  className="w-full h-full object-cover"
                />
              </button>

              {images.length > 1 && (
                <div className="p-3 border-t border-[#E9EEF3] flex items-center gap-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={`${img}-${i}`}
                      type="button"
                      onClick={() => setActiveImageIdx(i)}
                      className={`w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-opacity ${
                        activeImageIdx === i
                          ? 'border-[#23845B] opacity-100'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <PropertyImageSlot
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 sm:p-8 space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#102A43]">
                Property Overview
              </h2>
              <p className="text-sm sm:text-base text-[#263746] leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features & Amenities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-[#E9EEF3] p-6">
                <h2 className="font-display text-xl font-semibold text-[#102A43] mb-4">
                  Property Features
                </h2>
                {property.features.length > 0 ? (
                  <ul className="space-y-2.5 text-sm text-[#263746]">
                    {property.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#23845B] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#748394]">Specifications available on request.</p>
                )}
              </div>

              <div className="bg-white rounded-xl border border-[#E9EEF3] p-6">
                <h2 className="font-display text-xl font-semibold text-[#102A43] mb-4">
                  Amenities
                </h2>
                {property.amenities.length > 0 ? (
                  <ul className="space-y-2.5 text-sm text-[#263746]">
                    {property.amenities.map((amen) => (
                      <li key={amen} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#23845B] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{amen}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#748394]">Community amenity details on request.</p>
                )}
              </div>
            </div>

            {/* Investment Highlights */}
            {property.investmentHighlights.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-[#102A43] mb-4">
                  Investment Highlights &amp; Advisory Notes
                </h2>
                <ul className="space-y-3 text-sm text-[#263746]">
                  {property.investmentHighlights.map((note) => (
                    <li key={note} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#23845B] mt-2 shrink-0" />
                      <span className="leading-relaxed">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Floor Plan Section */}
            <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="font-display text-2xl font-semibold text-[#102A43]">Floor Plan</h2>
                {property.floorPlanUrl && (
                  <button
                    type="button"
                    onClick={() => setLightboxUrl(property.floorPlanUrl || null)}
                    className="text-xs font-semibold text-[#23845B] hover:underline cursor-pointer"
                  >
                    Expand Blueprint
                  </button>
                )}
              </div>
              {property.floorPlanUrl ? (
                <button
                  type="button"
                  onClick={() => setLightboxUrl(property.floorPlanUrl || null)}
                  className="w-full rounded-lg overflow-hidden border border-[#E9EEF3] bg-[#F5F7FA] cursor-zoom-in block"
                >
                  <PropertyImageSlot
                    src={property.floorPlanUrl}
                    alt={`Floor plan for ${property.title}`}
                    className="w-full max-h-[420px] object-contain mx-auto"
                  />
                </button>
              ) : (
                <div className="rounded-lg border border-dashed border-[#E9EEF3] bg-[#F5F7FA] p-6 text-center text-sm text-[#748394]">
                  Architectural floor plan layout is provided during private consultancy review.
                </div>
              )}
            </div>

            {/* Virtual Tour Section */}
            <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-[#102A43] mb-4">
                Virtual Tour
              </h2>
              {property.virtualTourUrl ? (
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden border border-[#E9EEF3] bg-[#071B2D]">
                    <iframe
                      src={property.virtualTourUrl}
                      title={`Virtual tour for ${property.title}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  <a
                    href={property.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#23845B] hover:underline"
                  >
                    Open Virtual Tour in New Window
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <PlayCircle className="w-6 h-6 text-[#102A43] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-[#102A43]">
                        Guided Video Walkthrough Available on Request
                      </p>
                      <p className="text-xs text-[#748394] mt-1">
                        Overseas and local investors can request a live video tour with our field
                        advisor.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAgentInquiry('Property Visit')}
                    className="px-4 py-2 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#071B2D] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Request Video Walkthrough
                  </button>
                </div>
              )}
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#102A43]">
                    Location &amp; Neighborhood
                  </h2>
                  <p className="text-xs text-[#748394] mt-1">{property.address}</p>
                </div>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#23845B] hover:underline whitespace-nowrap shrink-0"
                >
                  Open in Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <SinglePropertyMap property={property} />
            </div>
          </div>

          {/* Right Action & Advisory Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 space-y-4">
              <p className="text-xs font-semibold tracking-wider text-[#23845B]">
                Direct Advisory Actions
              </p>
              <h2 className="font-display text-xl font-semibold text-[#102A43]">
                Speak With an Investment Consultant
              </h2>
              <p className="text-xs text-[#748394] leading-relaxed">
                {businessSettings.businessName} · Real Estate ·{' '}
                <a
                  href={`tel:${businessSettings.phone.replace(/\s+/g, '')}`}
                  className="hover:text-[#102A43] tabular-nums"
                >
                  {businessSettings.phone}
                </a>
              </p>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => openAgentInquiry('Property Inquiry')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#102A43] text-white text-sm font-semibold hover:bg-[#071B2D] transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  Contact Agent
                </button>

                <button
                  type="button"
                  onClick={() => openAgentInquiry('Property Visit')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[#102A43] text-[#102A43] text-sm font-semibold hover:bg-[#F5F7FA] transition-colors cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" aria-hidden="true" />
                  Book a Property Visit
                </button>

                <a
                  href={`https://wa.me/${businessSettings.whatsappNumber}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#23845B] text-white text-sm font-semibold hover:bg-[#1B6B49] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  WhatsApp Regarding Property
                </a>
              </div>
            </div>

            <div
              id="property-inquiry-box"
              className="bg-white rounded-xl border border-[#E9EEF3] p-6"
            >
              <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E9EEF3]">
                <h3 className="font-display text-lg font-semibold text-[#102A43]">
                  {inquiryMode === 'Property Visit' ? 'Book a Property Visit' : 'Contact Agent'}
                </h3>
                <div className="inline-flex rounded-md bg-[#F5F7FA] p-0.5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setInquiryMode('Property Inquiry')}
                    className={`px-2 py-1 rounded cursor-pointer ${
                      inquiryMode === 'Property Inquiry'
                        ? 'bg-[#102A43] text-white'
                        : 'text-[#748394]'
                    }`}
                  >
                    Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => setInquiryMode('Property Visit')}
                    className={`px-2 py-1 rounded cursor-pointer ${
                      inquiryMode === 'Property Visit'
                        ? 'bg-[#102A43] text-white'
                        : 'text-[#748394]'
                    }`}
                  >
                    Visit
                  </button>
                </div>
              </div>

              <InquiryForm
                compact
                propertyId={property.id}
                propertyTitle={property.title}
                inquiryKind={inquiryMode}
                defaultPropertyType={property.category}
                defaultMessage={
                  inquiryMode === 'Property Visit'
                    ? `I would like to schedule a site visit for ${property.title}.`
                    : `Please share further details on ${property.title}.`
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-[#071B2D]/95 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            aria-label="Close image preview"
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxUrl}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
