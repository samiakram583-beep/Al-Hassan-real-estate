import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, BedDouble, Bath, Maximize2, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPkr } from '../lib/defaults';
import type { Property } from '../types';
import { PropertyImageSlot } from './PropertyImageSlot';

interface PropertyCardProps {
  property: Property;
  layout?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, layout = 'grid' }) => {
  const { savedIds, toggleSaved } = useApp();
  const isSaved = savedIds.includes(property.id);
  const priceLabel = formatPkr(property.pricePkr, property.status === 'For Rent');

  if (layout === 'list') {
    return (
      <article className="group bg-white rounded-xl border border-[#E9EEF3] overflow-hidden hover:border-[#102A43]/30 transition-all duration-200 flex flex-col md:flex-row">
        <div className="relative md:w-80 lg:w-96 aspect-[4/3] md:aspect-auto shrink-0 overflow-hidden bg-[#E9EEF3]">
          <Link to={`/properties/${property.slug}`} className="block w-full h-full">
            <PropertyImageSlot
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#071B2D]/75 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-semibold text-white">
            <span>{property.status}</span>
            {property.isDemo && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-white/90">Demonstration Listing</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => toggleSaved(property.id)}
            aria-label={isSaved ? 'Remove from saved properties' : 'Save property'}
            className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-white/95 text-[#102A43] flex items-center justify-center shadow-sm hover:bg-white transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${isSaved ? 'fill-[#23845B] text-[#23845B]' : 'text-[#102A43]'}`}
            />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#748394]">
              <span>{property.category}</span>
              <span aria-hidden="true">·</span>
              <span>{property.areaValue} {property.areaUnit}</span>
              {property.isDemo && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#23845B]">Demonstration Sample</span>
                </>
              )}
            </div>
            <Link to={`/properties/${property.slug}`}>
              <h3 className="font-display text-xl font-semibold text-[#102A43] mt-1.5 group-hover:text-[#23845B] transition-colors">
                {property.title}
              </h3>
            </Link>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#748394]">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#23845B]" aria-hidden="true" />
              <span className="truncate">{property.location}</span>
            </p>
            <p className="mt-3 text-sm text-[#263746] line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          </div>

          <div className="pt-4 border-t border-[#E9EEF3] flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#748394]">Asking Price</p>
              <p className="text-lg font-bold text-[#102A43] tabular-nums">{priceLabel}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-[#263746] tabular-nums">
              {property.bedrooms > 0 && (
                <span className="inline-flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-[#748394]" aria-hidden="true" />
                  {property.bedrooms} Beds
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-[#748394]" aria-hidden="true" />
                  {property.bathrooms} Baths
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-[#748394]" aria-hidden="true" />
                {property.areaValue} {property.areaUnit}
              </span>
            </div>

            <Link
              to={`/properties/${property.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#071B2D] transition-colors whitespace-nowrap shrink-0"
            >
              View Details
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white rounded-xl border border-[#E9EEF3] overflow-hidden hover:border-[#102A43]/30 transition-all duration-200 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E9EEF3]">
        <Link to={`/properties/${property.slug}`} className="block w-full h-full">
          <PropertyImageSlot
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#071B2D]/80 via-[#071B2D]/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-semibold text-white">
          <span>
            {property.status}
            {property.isDemo ? ' · Demonstration Listing' : ''}
          </span>
        </div>
        <button
          type="button"
          onClick={() => toggleSaved(property.id)}
          aria-label={isSaved ? 'Remove from saved properties' : 'Save property'}
          className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-white/95 text-[#102A43] flex items-center justify-center shadow-sm hover:bg-white transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 ${isSaved ? 'fill-[#23845B] text-[#23845B]' : 'text-[#102A43]'}`}
          />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#748394]">
            <span>{property.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {property.areaValue} {property.areaUnit}
            </span>
          </div>

          <Link to={`/properties/${property.slug}`}>
            <h3 className="font-display text-lg font-semibold text-[#102A43] mt-1.5 line-clamp-2 group-hover:text-[#23845B] transition-colors">
              {property.title}
            </h3>
          </Link>

          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#748394]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#23845B]" aria-hidden="true" />
            <span className="truncate">{property.location}</span>
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-4 text-xs font-medium text-[#263746] tabular-nums pt-3 border-t border-[#E9EEF3]">
            {property.bedrooms > 0 && (
              <span className="inline-flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-[#748394]" aria-hidden="true" />
                {property.bedrooms} Bed
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="inline-flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-[#748394]" aria-hidden="true" />
                {property.bathrooms} Bath
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-[#748394]" aria-hidden="true" />
              {property.coveredAreaSqFt > 0
                ? `${property.coveredAreaSqFt.toLocaleString()} Sq Ft`
                : property.plotSizeLabel}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="text-base font-bold text-[#102A43] tabular-nums">{priceLabel}</p>
            <Link
              to={`/properties/${property.slug}`}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#F5F7FA] text-[#102A43] text-xs font-semibold hover:bg-[#102A43] hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              View Details
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
