import type { BusinessSettings, Property } from '../types';
import { STUDIO_IMAGES } from './demoImages';

export const BOOTSTRAPPED_ADMIN_EMAIL = 'samullah404@gmail.com';

// Main Faisalabad Noor Shah Rd, Sahiwal coordinates
export const OFFICE_COORDINATES = {
  lat: 30.6682,
  lng: 73.1114,
};

export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/i1MGBSW4HPJJgtCXA';

export const GOOGLE_RATING = {
  score: '4.5',
  reviewCount: 24,
};

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  businessName: 'Al Hassan Garden',
  phone: '+92 312 6110848',
  whatsappNumber: '923126110848',
  officeAddress: 'Main Faisalabad Noor Shah Rd, Sahiwal, Pakistan',
  plusCode: 'Sahiwal, Pakistan',
  businessHours: 'Contact for Office Appointments',
  description:
    'Al Hassan Garden is a real estate business located on Main Faisalabad Noor Shah Rd, Sahiwal, Pakistan. We assist homeowners, buyers, and property investors with transparent market guidance, property evaluation, and real estate opportunities across Sahiwal.',
  googleReviewsUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  youtubeUrl: '',
};

/**
 * Clearly marked Demonstration Listings used until the administrator
 * replaces or supplements them with verified client properties in Firestore.
 */
export const DEMO_PROPERTIES: Property[] = [
  {
    id: 'demo-sahiwal-1-kanal-residence',
    slug: 'demo-sahiwal-contemporary-villa',
    title: 'Contemporary 1 Kanal Designer Residence (Demo)',
    description:
      'Demonstration listing illustrating how a verified residential home appears in your portfolio. Features double-height glazing, travertine stone elevation, five en-suite bedrooms, landscaped lawn, and dedicated servant quarters along the Main Faisalabad Noor Shah Rd corridor in Sahiwal.',
    location: 'Main Faisalabad Noor Shah Rd, Sahiwal',
    address: 'Main Faisalabad Noor Shah Rd, Sahiwal, Pakistan (Demonstration Listing)',
    category: 'Houses',
    status: 'For Sale',
    pricePkr: 145000000,
    bedrooms: 5,
    bathrooms: 6,
    areaValue: 20,
    areaUnit: 'Marla',
    coveredAreaSqFt: 5400,
    plotSizeLabel: '1 Kanal (50 x 90 ft)',
    images: [
      STUDIO_IMAGES.propertyModernVilla,
      STUDIO_IMAGES.heroIslamabadEstate,
      STUDIO_IMAGES.propertyPenthouseInterior,
    ],
    features: [
      'Double-height entrance foyer',
      'Imported porcelain & marble flooring',
      'Smart climate & security wiring',
      'Two designer kitchens with island',
      'Covered terrace overlooking lawn',
    ],
    amenities: [
      '24/7 Gated Security',
      'Underground Utilities',
      'Dedicated Parking for 4 Vehicles',
      'Nearby Commercial & Mosque',
      'Backup Power Provision',
    ],
    investmentHighlights: [
      'Demonstration insight: Residential inventory in Sahiwal is tracked for family end-user demand.',
      'Evaluation checklist covers title transfer verification and construction structural audit.',
      'Suitable for long-term capital preservation or executive residential leasing review.',
    ],
    floorPlanUrl: STUDIO_IMAGES.propertyFloorplanSample,
    virtualTourUrl: '',
    lat: 30.6712,
    lng: 73.1142,
    isPublished: true,
    isFeatured: true,
    isDemo: true,
    createdBy: 'system_demo',
  },
  {
    id: 'demo-sahiwal-commercial-suite',
    slug: 'demo-sahiwal-commercial-floor',
    title: 'Executive Commercial Suite (Demo)',
    description:
      'Demonstration commercial investment listing representing corporate office space in Sahiwal. Designed for offices, consultancies, or retail flagship tenants seeking prominent frontage and structured parking.',
    location: 'Main Faisalabad Noor Shah Rd, Sahiwal',
    address: 'Commercial Boulevard, Main Faisalabad Noor Shah Rd, Sahiwal (Demonstration Listing)',
    category: 'Commercial',
    status: 'For Sale',
    pricePkr: 92000000,
    bedrooms: 0,
    bathrooms: 2,
    areaValue: 2800,
    areaUnit: 'Sq Ft',
    coveredAreaSqFt: 2800,
    plotSizeLabel: '2,800 Sq Ft Corporate Floor',
    images: [
      STUDIO_IMAGES.propertyCommercialTower,
      STUDIO_IMAGES.aboutConsultancyOffice,
    ],
    features: [
      'Column-free modular office layout',
      'Curtain-wall insulated glazing',
      'High-speed passenger elevators',
      'Dedicated reception & boardroom zones',
    ],
    amenities: [
      'Basement & Forecourt Parking',
      'Full Standby Generator',
      '24/7 CCTV & Access Control',
      'Fiber Optic Connectivity',
    ],
    investmentHighlights: [
      'Demonstration insight: Commercial bays are evaluated on tenant covenant strength and lease structure.',
      'Direct proximity to established commercial access along Main Faisalabad Noor Shah Rd.',
      'Real estate due diligence includes floor-plate efficiency and service-charge analysis.',
    ],
    floorPlanUrl: '',
    virtualTourUrl: '',
    lat: 30.6685,
    lng: 73.1119,
    isPublished: true,
    isFeatured: true,
    isDemo: true,
    createdBy: 'system_demo',
  },
  {
    id: 'demo-sahiwal-executive-penthouse',
    slug: 'demo-sahiwal-executive-apartment',
    title: 'Panoramic Executive Penthouse Apartment (Demo)',
    description:
      'Demonstration apartment listing showcasing modern urban living in Sahiwal. Expansive glass elevations capture natural light while refined walnut millwork and open-plan entertaining zones suit modern professionals and overseas buyers.',
    location: 'Noor Shah Rd Corridor, Sahiwal',
    address: 'Executive Residences Tower, Sahiwal (Demonstration Listing)',
    category: 'Apartments',
    status: 'For Rent',
    pricePkr: 420000,
    bedrooms: 3,
    bathrooms: 4,
    areaValue: 3150,
    areaUnit: 'Sq Ft',
    coveredAreaSqFt: 3150,
    plotSizeLabel: '3,150 Sq Ft Penthouse',
    images: [
      STUDIO_IMAGES.propertyPenthouseInterior,
      STUDIO_IMAGES.heroIslamabadEstate,
    ],
    features: [
      'Panoramic floor-to-ceiling glazing',
      'Custom walnut wall paneling',
      'Private sky terrace lounge',
      'Integrated appliance kitchen',
    ],
    amenities: [
      'Concierge Lobby',
      'Residents Fitness Studio',
      'Reserved Covered Parking',
      'Backup Power & Elevators',
    ],
    investmentHighlights: [
      'Demonstration insight: Executive apartments are assessed for lease demand and maintenance standards.',
      'Turnkey layout suited for family or executive tenancy.',
    ],
    floorPlanUrl: STUDIO_IMAGES.propertyFloorplanSample,
    virtualTourUrl: '',
    lat: 30.6648,
    lng: 73.1065,
    isPublished: true,
    isFeatured: true,
    isDemo: true,
    createdBy: 'system_demo',
  },
  {
    id: 'demo-sahiwal-corner-residential-plot',
    slug: 'demo-sahiwal-corner-residential-plot',
    title: 'Prime Boulevard Corner Residential Plot (Demo)',
    description:
      'Demonstration land parcel illustrating plot investment presentation. Positioned on a wide carpeted boulevard with completed underground infrastructure, ready for bespoke residential construction or medium-to-long-term land holding.',
    location: 'Main Faisalabad Noor Shah Rd, Sahiwal',
    address: 'Main Boulevard, Main Faisalabad Noor Shah Rd, Sahiwal (Demonstration Listing)',
    category: 'Plots',
    status: 'For Sale',
    pricePkr: 68000000,
    bedrooms: 0,
    bathrooms: 0,
    areaValue: 1,
    areaUnit: 'Kanal',
    coveredAreaSqFt: 0,
    plotSizeLabel: '1 Kanal Corner Parcel (4,500 Sq Ft)',
    images: [
      STUDIO_IMAGES.propertyResidentialPlot,
      STUDIO_IMAGES.propertyModernVilla,
    ],
    features: [
      'Corner orientation with dual frontage',
      'Level solid terrain ready for possession',
      'Wide carpeted boulevard access',
    ],
    amenities: [
      'Underground Electricity & Gas Provision',
      'Gated Community Security',
      'Proximity to Parks & Commercial Zone',
    ],
    investmentHighlights: [
      'Demonstration insight: Corner boulevard plots are evaluated on possession status and comparable transfers.',
      'Full allotment, NOC, and transfer fee verification facilitated by Al Hassan Garden.',
    ],
    floorPlanUrl: '',
    virtualTourUrl: '',
    lat: 30.6661,
    lng: 73.1168,
    isPublished: true,
    isFeatured: true,
    isDemo: true,
    createdBy: 'system_demo',
  },
  {
    id: 'demo-sahiwal-estate-residence',
    slug: 'demo-sahiwal-architectural-estate-residence',
    title: 'Architectural Courtyard Estate Residence (Demo)',
    description:
      'Demonstration flagship residential property demonstrating luxury estate presentation. Engineered around a tranquil reflection courtyard with seamless indoor-outdoor entertaining pavilions and private guest quarters.',
    location: 'Sahiwal, Pakistan',
    address: 'Executive Lane, Sahiwal, Pakistan (Demonstration Listing)',
    category: 'Residential',
    status: 'For Sale',
    pricePkr: 215000000,
    bedrooms: 6,
    bathrooms: 7,
    areaValue: 2,
    areaUnit: 'Kanal',
    coveredAreaSqFt: 8800,
    plotSizeLabel: '2 Kanal (9,000 Sq Ft)',
    images: [
      STUDIO_IMAGES.heroIslamabadEstate,
      STUDIO_IMAGES.propertyModernVilla,
      STUDIO_IMAGES.propertyPenthouseInterior,
    ],
    features: [
      'Private reflection pool & courtyard',
      'Double-height glass atrium',
      'Home cinema & executive study',
      'Separate guest wing',
    ],
    amenities: [
      '24/7 Patrolled Community',
      'Solar Hybrid Readiness',
      'Landscaped Perimeter Gardens',
      'Covered Garage for 5 Vehicles',
    ],
    investmentHighlights: [
      'Demonstration insight: Flagship 2-Kanal estates represent scarce low-density inventory in Sahiwal.',
      'Evaluated for architectural build quality, land-to-construction ratio, and title clarity.',
    ],
    floorPlanUrl: STUDIO_IMAGES.propertyFloorplanSample,
    virtualTourUrl: '',
    lat: 30.6735,
    lng: 73.1205,
    isPublished: true,
    isFeatured: true,
    isDemo: true,
    createdBy: 'system_demo',
  },
  {
    id: 'demo-sahiwal-yield-investment-plaza',
    slug: 'demo-sahiwal-mixed-use-investment-building',
    title: 'Mixed-Use Commercial & Apartment Asset (Demo)',
    description:
      'Demonstration investment property showcasing multi-unit commercial retail and upper-floor residential apartments structured for diversified real estate portfolio evaluation.',
    location: 'Main Faisalabad Noor Shah Rd, Sahiwal',
    address: 'Commercial Markaz, Sahiwal, Pakistan (Demonstration Listing)',
    category: 'Investment Properties',
    status: 'For Sale',
    pricePkr: 185000000,
    bedrooms: 4,
    bathrooms: 5,
    areaValue: 10,
    areaUnit: 'Marla',
    coveredAreaSqFt: 7200,
    plotSizeLabel: '10 Marla Commercial Building',
    images: [
      STUDIO_IMAGES.propertyCommercialTower,
      STUDIO_IMAGES.propertyPenthouseInterior,
    ],
    features: [
      'Ground-floor retail showroom frontage',
      'Upper-level executive apartment suites',
      'Separate commercial & residential entrances',
    ],
    amenities: [
      'Dedicated Parking Plaza',
      'Commercial Elevator Shaft',
      'Dedicated Transformer Connection',
    ],
    investmentHighlights: [
      'Demonstration insight: Mixed-use assets balance retail footfall with residential occupancy.',
      'Real estate review includes tenant mix verification, lease terms, and structural compliance.',
    ],
    floorPlanUrl: '',
    virtualTourUrl: '',
    lat: 30.6695,
    lng: 73.1092,
    isPublished: true,
    isFeatured: true,
    isDemo: true,
    createdBy: 'system_demo',
  },
];

export function formatPkr(amount: number, isRent = false): string {
  if (!Number.isFinite(amount) || amount <= 0) return 'Price on Request';
  const suffix = isRent ? ' / month' : '';
  if (amount >= 10000000) {
    const crore = amount / 10000000;
    return `PKR ${crore.toFixed(2).replace(/\.00$/, '')} Crore${suffix}`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `PKR ${lakh.toFixed(2).replace(/\.00$/, '')} Lakh${suffix}`;
  }
  return `PKR ${amount.toLocaleString('en-PK')}${suffix}`;
}

export function formatAreaToMarla(areaValue: number, areaUnit: string): number {
  if (areaUnit === 'Kanal') return areaValue * 20;
  if (areaUnit === 'Sq Ft') return areaValue / 225;
  return areaValue;
}

export function slugify(input: string): string {
  const cleaned = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
  return cleaned.length >= 2 ? cleaned : `property-${Date.now()}`;
}

export function sanitizeId(input: string): string {
  const cleaned = input.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
  return cleaned.length >= 1 ? cleaned : `id-${Date.now()}`;
}
