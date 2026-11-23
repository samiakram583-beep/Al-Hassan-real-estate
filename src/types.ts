import type { Timestamp } from 'firebase/firestore';

export type PropertyCategory =
  | 'Residential'
  | 'Commercial'
  | 'Apartments'
  | 'Houses'
  | 'Plots'
  | 'Investment Properties';

export type PropertyStatus = 'For Sale' | 'For Rent';
export type AreaUnit = 'Marla' | 'Kanal' | 'Sq Ft';
export type InquiryKind = 'Consultation' | 'Property Visit' | 'Property Inquiry';
export type InquiryStatus = 'new' | 'contacted' | 'scheduled' | 'closed';

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  address: string;
  category: PropertyCategory;
  status: PropertyStatus;
  pricePkr: number;
  bedrooms: number;
  bathrooms: number;
  areaValue: number;
  areaUnit: AreaUnit;
  coveredAreaSqFt: number;
  plotSizeLabel: string;
  images: string[];
  features: string[];
  amenities: string[];
  investmentHighlights: string[];
  floorPlanUrl?: string;
  virtualTourUrl?: string;
  lat: number;
  lng: number;
  isPublished: boolean;
  isFeatured: boolean;
  isDemo: boolean;
  createdBy: string;
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

export interface Inquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  interestedPropertyType: string;
  budgetRange: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  inquiryKind: InquiryKind;
  status: InquiryStatus;
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

export interface BusinessSettings {
  businessName: string;
  phone: string;
  whatsappNumber: string;
  officeAddress: string;
  plusCode: string;
  businessHours: string;
  description: string;
  googleReviewsUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  updatedAt?: Timestamp | Date | string;
}

export interface PropertyImage {
  id: string;
  title: string;
  collectionName: string;
  url: string;
  propertyId?: string;
  isPublic: boolean;
  uploadedBy: string;
  createdAt?: Timestamp | Date | string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole?: string;
  quote: string;
  rating: number;
  isPublished: boolean;
  createdBy: string;
  createdAt?: Timestamp | Date | string;
}

export interface PropertyFilters {
  location: string;
  category: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  minBedrooms: string;
  minBathrooms: string;
  minMarla: string;
  savedOnly: boolean;
}
