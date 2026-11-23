import React, { useCallback, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  APILoadingStatus,
  useApiLoadingStatus,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPkr, GOOGLE_MAPS_URL, OFFICE_COORDINATES } from '../lib/defaults';
import type { Property } from '../types';
import { Link } from 'react-router-dom';

interface OfficeMapProps {
  address: string;
  plusCode: string;
  businessName: string;
  heightClass?: string;
}

interface PropertyMapPinProps {
  property: Property;
  isSelected: boolean;
  onSelect: (property: Property | null) => void;
}

const OfficeMarker: React.FC<{ businessName: string; address: string; plusCode: string }> = ({
  businessName,
  address,
  plusCode,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(true);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={OFFICE_COORDINATES}
        title={businessName}
        onClick={() => setOpen((v) => !v)}
      >
        <Pin background="#102A43" borderColor="#071B2D" glyphColor="#23845B" scale={1.15} />
      </AdvancedMarker>
      {open && marker && (
        <InfoWindow anchor={marker} maxWidth={260} onCloseClick={() => setOpen(false)}>
          <div className="p-1 text-[#263746]">
            <p className="font-semibold text-sm text-[#102A43]">{businessName}</p>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-[#748394] hover:text-[#23845B] mt-1 leading-relaxed"
            >
              {address}
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const PropertyMapPin: React.FC<PropertyMapPinProps> = ({ property, isSelected, onSelect }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: property.lat, lng: property.lng }}
        title={property.title}
        onClick={() => onSelect(isSelected ? null : property)}
      >
        <div
          className={`px-2.5 py-1 rounded text-xs font-semibold shadow-md border transition-transform cursor-pointer whitespace-nowrap tabular-nums ${
            isSelected
              ? 'bg-[#23845B] text-white border-white scale-105'
              : 'bg-[#102A43] text-white border-white/80 hover:bg-[#071B2D]'
          }`}
        >
          {formatPkr(property.pricePkr, property.status === 'For Rent').replace('PKR ', '')}
        </div>
      </AdvancedMarker>
      {isSelected && marker && (
        <InfoWindow anchor={marker} maxWidth={260} onCloseClick={() => onSelect(null)}>
          <div className="p-1 text-[#263746]">
            <p className="text-[11px] font-semibold text-[#23845B]">
              {property.status} · {property.category}
            </p>
            <p className="font-semibold text-sm text-[#102A43] mt-0.5 line-clamp-2">
              {property.title}
            </p>
            <p className="text-xs text-[#748394] mt-0.5">{property.location}</p>
            <p className="text-xs font-bold text-[#102A43] mt-1 tabular-nums">
              {formatPkr(property.pricePkr, property.status === 'For Rent')}
            </p>
            <Link
              to={`/properties/${property.slug}`}
              className="inline-block mt-2 text-xs font-semibold text-[#23845B] hover:underline"
            >
              View Property Details →
            </Link>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const MapFallbackCard: React.FC<{
  title: string;
  subtitle: string;
  directionsHref: string;
  heightClass: string;
}> = ({ title, subtitle, directionsHref, heightClass }) => (
  <div
    className={`w-full ${heightClass} rounded-xl border border-[#E9EEF3] bg-[#F5F7FA] flex flex-col items-center justify-center p-6 text-center`}
  >
    <div className="w-11 h-11 rounded-full bg-[#102A43]/10 flex items-center justify-center mb-3">
      <MapPin className="w-5 h-5 text-[#102A43]" aria-hidden="true" />
    </div>
    <p className="font-display text-lg font-semibold text-[#102A43]">{title}</p>
    <p className="text-sm text-[#748394] max-w-md mt-1">{subtitle}</p>
    <a
      href={directionsHref}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#071B2D] transition-colors"
    >
      Get Directions in Google Maps
      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
    </a>
  </div>
);

const OfficeMapInner: React.FC<OfficeMapProps> = ({
  address,
  plusCode,
  businessName,
  heightClass = 'h-[360px]',
}) => {
  const status = useApiLoadingStatus();
  const directionsHref = GOOGLE_MAPS_URL;

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <MapFallbackCard
        title={businessName}
        subtitle={address}
        directionsHref={directionsHref}
        heightClass={heightClass}
      />
    );
  }

  return (
    <div className={`w-full ${heightClass} rounded-xl overflow-hidden border border-[#E9EEF3] bg-[#E9EEF3]`}>
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={OFFICE_COORDINATES}
        defaultZoom={15}
        gestureHandling="cooperative"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        <OfficeMarker businessName={businessName} address={address} plusCode={plusCode} />
      </GoogleMap>
    </div>
  );
};

export const OfficeGoogleMap: React.FC<OfficeMapProps> = (props) => {
  const { mapsApiKey } = useApp();
  const directionsHref = GOOGLE_MAPS_URL;

  if (!mapsApiKey) {
    return (
      <MapFallbackCard
        title={props.businessName}
        subtitle={props.address}
        directionsHref={directionsHref}
        heightClass={props.heightClass || 'h-[360px]'}
      />
    );
  }

  return (
    <APIProvider apiKey={mapsApiKey} libraries={['marker']} language="en" region="PK">
      <OfficeMapInner {...props} />
    </APIProvider>
  );
};

interface PropertiesMapViewProps {
  properties: Property[];
  heightClass?: string;
}

const PropertiesMapInner: React.FC<PropertiesMapViewProps> = ({
  properties,
  heightClass = 'h-[540px]',
}) => {
  const status = useApiLoadingStatus();
  const [selected, setSelected] = useState<Property | null>(null);
  const handleSelect = useCallback((p: Property | null) => setSelected(p), []);

  const center =
    properties.length > 0
      ? { lat: properties[0].lat, lng: properties[0].lng }
      : OFFICE_COORDINATES;

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <MapFallbackCard
        title="Sahiwal Property Map View"
        subtitle="Unable to render interactive map tiles right now. Switch to Grid or List view to explore listings."
        directionsHref={GOOGLE_MAPS_URL}
        heightClass={heightClass}
      />
    );
  }

  return (
    <div className={`w-full ${heightClass} rounded-xl overflow-hidden border border-[#E9EEF3] bg-[#E9EEF3]`}>
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={center}
        defaultZoom={12}
        gestureHandling="greedy"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        {properties.map((prop) => (
          <PropertyMapPin
            key={prop.id}
            property={prop}
            isSelected={selected?.id === prop.id}
            onSelect={handleSelect}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export const PropertiesMapView: React.FC<PropertiesMapViewProps> = ({
  properties,
  heightClass = 'h-[540px]',
}) => {
  const { mapsApiKey } = useApp();

  if (!mapsApiKey) {
    return (
      <MapFallbackCard
        title="Sahiwal Property Map View"
        subtitle="Google Maps API key is required for the interactive portfolio map."
        directionsHref={GOOGLE_MAPS_URL}
        heightClass={heightClass}
      />
    );
  }

  return (
    <APIProvider apiKey={mapsApiKey} libraries={['marker']} language="en" region="PK">
      <PropertiesMapInner properties={properties} heightClass={heightClass} />
    </APIProvider>
  );
};

export const SinglePropertyMap: React.FC<{ property: Property }> = ({ property }) => {
  const { mapsApiKey } = useApp();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  const directionsHref = GOOGLE_MAPS_URL;

  if (!mapsApiKey) {
    return (
      <MapFallbackCard
        title={property.location}
        subtitle={property.address}
        directionsHref={directionsHref}
        heightClass="h-[320px]"
      />
    );
  }

  return (
    <APIProvider apiKey={mapsApiKey} libraries={['marker']} language="en" region="PK">
      <div className="w-full h-[320px] rounded-xl overflow-hidden border border-[#E9EEF3] bg-[#E9EEF3]">
        <GoogleMap
          mapId="DEMO_MAP_ID"
          defaultCenter={{ lat: property.lat, lng: property.lng }}
          defaultZoom={14}
          gestureHandling="cooperative"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <AdvancedMarker
            ref={markerRef}
            position={{ lat: property.lat, lng: property.lng }}
            title={property.title}
            onClick={() => setOpen((v) => !v)}
          >
            <Pin background="#102A43" borderColor="#071B2D" glyphColor="#23845B" />
          </AdvancedMarker>
          {open && marker && (
            <InfoWindow anchor={marker} maxWidth={240} onCloseClick={() => setOpen(false)}>
              <div className="p-1 text-[#263746]">
                <p className="font-semibold text-xs text-[#102A43]">{property.title}</p>
                <p className="text-xs text-[#748394] mt-0.5">{property.address}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </APIProvider>
  );
};
