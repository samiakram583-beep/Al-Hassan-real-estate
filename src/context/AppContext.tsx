import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, type User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  BOOTSTRAPPED_ADMIN_EMAIL,
  DEFAULT_BUSINESS_SETTINGS,
  DEMO_PROPERTIES,
  OFFICE_COORDINATES,
  sanitizeId,
  slugify,
} from '../lib/defaults';
import type {
  BusinessSettings,
  Inquiry,
  InquiryStatus,
  Property,
  PropertyImage,
  Testimonial,
} from '../types';

interface AppContextValue {
  properties: Property[];
  allAdminProperties: Property[];
  isShowingDemoFallback: boolean;
  inquiries: Inquiry[];
  businessSettings: BusinessSettings;
  testimonials: Testimonial[];
  allAdminTestimonials: Testimonial[];
  galleryImages: PropertyImage[];
  loadingProperties: boolean;
  user: User | null;
  isAdmin: boolean;
  authReady: boolean;
  mapsApiKey: string;
  gmpQuotaExceeded: boolean;
  savedIds: string[];
  toggleSaved: (propertyId: string) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  saveProperty: (property: Omit<Property, 'id' | 'createdBy'> & { id?: string }) => Promise<string>;
  deleteProperty: (propertyId: string) => Promise<void>;
  togglePropertyPublished: (property: Property) => Promise<void>;
  seedDemoProperties: () => Promise<void>;
  submitInquiry: (
    payload: Omit<Inquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateInquiryStatus: (inquiryId: string, status: InquiryStatus) => Promise<void>;
  deleteInquiry: (inquiryId: string) => Promise<void>;
  uploadImageFile: (file: File) => Promise<string>;
  addGalleryImage: (img: {
    title: string;
    collectionName: string;
    url: string;
    propertyId?: string;
    isPublic: boolean;
  }) => Promise<string>;
  deleteGalleryImage: (imageId: string) => Promise<void>;
  saveBusinessSettings: (settings: BusinessSettings) => Promise<void>;
  saveTestimonial: (
    testimonial: Omit<Testimonial, 'id' | 'createdBy' | 'createdAt'> & { id?: string }
  ) => Promise<void>;
  deleteTestimonial: (testimonialId: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const SAVED_STORAGE_KEY = 'reic_saved_property_ids_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firestoreProperties, setFirestoreProperties] = useState<Property[]>([]);
  const [hasLoadedProperties, setHasLoadedProperties] = useState(false);
  const [allAdminProperties, setAllAdminProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(DEFAULT_BUSINESS_SETTINGS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [allAdminTestimonials, setAllAdminTestimonials] = useState<Testimonial[]>([]);
  const [galleryImages, setGalleryImages] = useState<PropertyImage[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const [mapsApiKey, setMapsApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handler = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  useEffect(() => {
    if (mapsApiKey) return;
    fetch('/api/maps-config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { apiKey?: string } | null) => {
        if (data?.apiKey) setMapsApiKey(data.apiKey);
      })
      .catch(() => {
        // Ignore silent config fetch fallback error
      });
  }, [mapsApiKey]);

  const toggleSaved = useCallback((propertyId: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId];
      try {
        localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  }, []);

  // Auth listener & admin role check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser || !currentUser.emailVerified) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      const isOwnerEmail =
        currentUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();

      if (isOwnerEmail) {
        setIsAdmin(true);
        setAuthReady(true);
        // Ensure admin doc exists for bootstrapped owner
        const adminRef = doc(db, 'admins', currentUser.uid);
        try {
          const snap = await getDoc(adminRef);
          if (!snap.exists()) {
            await setDoc(adminRef, {
              uid: currentUser.uid,
              email: (currentUser.email || BOOTSTRAPPED_ADMIN_EMAIL).slice(0, 160),
              displayName: (currentUser.displayName || 'Principal Administrator').slice(0, 120),
              role: 'owner',
              createdAt: serverTimestamp(),
            });
          }
        } catch (err) {
          console.warn('Admin bootstrap sync note:', err);
        }
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
        setIsAdmin(adminDoc.exists());
      } catch {
        setIsAdmin(false);
      } finally {
        setAuthReady(true);
      }
    });
    return () => unsub();
  }, []);

  // Public published properties listener
  useEffect(() => {
    const path = 'properties';
    const q = query(collection(db, path), where('isPublished', '==', true));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Property, 'id'>),
        }));
        setFirestoreProperties(items);
        setHasLoadedProperties(true);
      },
      (error) => {
        setHasLoadedProperties(true);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return () => unsub();
  }, []);

  // Public business_settings/primary listener
  useEffect(() => {
    const path = 'business_settings/primary';
    const unsub = onSnapshot(
      doc(db, 'business_settings', 'primary'),
      (snap) => {
        if (snap.exists()) {
          setBusinessSettings({
            ...DEFAULT_BUSINESS_SETTINGS,
            ...(snap.data() as BusinessSettings),
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
    return () => unsub();
  }, []);

  // Public testimonials listener
  useEffect(() => {
    const path = 'testimonials';
    const q = query(collection(db, path), where('isPublished', '==', true));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Testimonial, 'id'>),
        }));
        setTestimonials(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return () => unsub();
  }, []);

  // Admin-only listeners
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setAllAdminProperties([]);
      setInquiries([]);
      setGalleryImages([]);
      setAllAdminTestimonials([]);
      return;
    }

    const unsubProps = onSnapshot(
      query(collection(db, 'properties'), orderBy('updatedAt', 'desc')),
      (snapshot) => {
        setAllAdminProperties(
          snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Property, 'id'>) }))
        );
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'properties')
    );

    const unsubInquiries = onSnapshot(
      query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setInquiries(
          snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Inquiry, 'id'>) }))
        );
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'inquiries')
    );

    const unsubGallery = onSnapshot(
      query(collection(db, 'property_images'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setGalleryImages(
          snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PropertyImage, 'id'>) }))
        );
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'property_images')
    );

    const unsubTestimonials = onSnapshot(
      query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setAllAdminTestimonials(
          snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, 'id'>) }))
        );
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'testimonials')
    );

    return () => {
      unsubProps();
      unsubInquiries();
      unsubGallery();
      unsubTestimonials();
    };
  }, [authReady, isAdmin]);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const saveProperty = useCallback(
    async (property: Omit<Property, 'id' | 'createdBy'> & { id?: string }): Promise<string> => {
      if (!auth.currentUser || !isAdmin) {
        throw new Error('Administrator authorization required.');
      }
      const docId = property.id ? sanitizeId(property.id) : sanitizeId(slugify(property.title) + '-' + Date.now().toString(36));
      const cleanSlug = slugify(property.slug || property.title);
      const ref = doc(db, 'properties', docId);
      const existingSnap = property.id ? await getDoc(ref) : null;

      const sanitizedImages = (property.images || [])
        .filter((u) => typeof u === 'string' && u.trim().length > 0)
        .slice(0, 20)
        .map((u) => u.trim().slice(0, 600));
      const sanitizedFeatures = (property.features || [])
        .filter((f) => typeof f === 'string' && f.trim().length > 0)
        .slice(0, 25)
        .map((f) => f.trim().slice(0, 140));
      const sanitizedAmenities = (property.amenities || [])
        .filter((a) => typeof a === 'string' && a.trim().length > 0)
        .slice(0, 25)
        .map((a) => a.trim().slice(0, 140));
      const sanitizedHighlights = (property.investmentHighlights || [])
        .filter((h) => typeof h === 'string' && h.trim().length > 0)
        .slice(0, 15)
        .map((h) => h.trim().slice(0, 240));

      const basePayload = {
        slug: cleanSlug,
        title: property.title.trim().slice(0, 160),
        description: property.description.trim().slice(0, 5000),
        location: property.location.trim().slice(0, 160),
        address: property.address.trim().slice(0, 260),
        category: property.category,
        status: property.status,
        pricePkr: Math.max(0, Number(property.pricePkr) || 0),
        bedrooms: Math.min(50, Math.max(0, Number(property.bedrooms) || 0)),
        bathrooms: Math.min(50, Math.max(0, Number(property.bathrooms) || 0)),
        areaValue: Math.max(0.1, Number(property.areaValue) || 1),
        areaUnit: property.areaUnit,
        coveredAreaSqFt: Math.max(0, Number(property.coveredAreaSqFt) || 0),
        plotSizeLabel: (property.plotSizeLabel || `${property.areaValue} ${property.areaUnit}`)
          .trim()
          .slice(0, 80),
        images: sanitizedImages,
        features: sanitizedFeatures,
        amenities: sanitizedAmenities,
        investmentHighlights: sanitizedHighlights,
        floorPlanUrl: (property.floorPlanUrl || '').trim().slice(0, 600),
        virtualTourUrl: (property.virtualTourUrl || '').trim().slice(0, 600),
        lat: Number(property.lat) || OFFICE_COORDINATES.lat,
        lng: Number(property.lng) || OFFICE_COORDINATES.lng,
        isPublished: Boolean(property.isPublished),
        isFeatured: Boolean(property.isFeatured),
        isDemo: Boolean(property.isDemo),
        updatedAt: serverTimestamp(),
      };

      try {
        if (existingSnap && existingSnap.exists()) {
          await updateDoc(ref, basePayload);
        } else {
          await setDoc(ref, {
            ...basePayload,
            createdBy: auth.currentUser.uid,
            createdAt: serverTimestamp(),
          });
        }
        return docId;
      } catch (error) {
        handleFirestoreError(
          error,
          existingSnap?.exists() ? OperationType.UPDATE : OperationType.CREATE,
          `properties/${docId}`
        );
      }
    },
    [isAdmin]
  );

  const deleteProperty = useCallback(
    async (propertyId: string) => {
      if (!isAdmin) throw new Error('Administrator authorization required.');
      const path = `properties/${propertyId}`;
      try {
        await deleteDoc(doc(db, 'properties', propertyId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    },
    [isAdmin]
  );

  const togglePropertyPublished = useCallback(
    async (property: Property) => {
      if (!isAdmin) throw new Error('Administrator authorization required.');
      const path = `properties/${property.id}`;
      try {
        await updateDoc(doc(db, 'properties', property.id), {
          isPublished: !property.isPublished,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [isAdmin]
  );

  const seedDemoProperties = useCallback(async () => {
    if (!auth.currentUser || !isAdmin) throw new Error('Administrator authorization required.');
    for (const demo of DEMO_PROPERTIES) {
      const ref = doc(db, 'properties', demo.id);
      try {
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            slug: demo.slug,
            title: demo.title,
            description: demo.description,
            location: demo.location,
            address: demo.address,
            category: demo.category,
            status: demo.status,
            pricePkr: demo.pricePkr,
            bedrooms: demo.bedrooms,
            bathrooms: demo.bathrooms,
            areaValue: demo.areaValue,
            areaUnit: demo.areaUnit,
            coveredAreaSqFt: demo.coveredAreaSqFt,
            plotSizeLabel: demo.plotSizeLabel,
            images: demo.images,
            features: demo.features,
            amenities: demo.amenities,
            investmentHighlights: demo.investmentHighlights,
            floorPlanUrl: demo.floorPlanUrl || '',
            virtualTourUrl: demo.virtualTourUrl || '',
            lat: demo.lat,
            lng: demo.lng,
            isPublished: demo.isPublished,
            isFeatured: demo.isFeatured,
            isDemo: true,
            createdBy: auth.currentUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `properties/${demo.id}`);
      }
    }
  }, [isAdmin]);

  const submitInquiry = useCallback(
    async (payload: Omit<Inquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
      const id = `inq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      const path = `inquiries/${id}`;
      const docPayload: Record<string, unknown> = {
        fullName: payload.fullName.trim().slice(0, 120),
        phone: payload.phone.trim().slice(0, 30),
        email: payload.email.trim().slice(0, 160),
        interestedPropertyType: payload.interestedPropertyType.trim().slice(0, 80),
        budgetRange: payload.budgetRange.trim().slice(0, 80),
        message: payload.message.trim().slice(0, 2000),
        inquiryKind: payload.inquiryKind,
        status: 'new',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (payload.propertyId) {
        docPayload.propertyId = payload.propertyId.slice(0, 128);
      }
      if (payload.propertyTitle) {
        docPayload.propertyTitle = payload.propertyTitle.slice(0, 160);
      }
      try {
        await setDoc(doc(db, 'inquiries', id), docPayload);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    },
    []
  );

  const updateInquiryStatus = useCallback(
    async (inquiryId: string, status: InquiryStatus) => {
      if (!isAdmin) throw new Error('Administrator authorization required.');
      const path = `inquiries/${inquiryId}`;
      try {
        await updateDoc(doc(db, 'inquiries', inquiryId), {
          status,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [isAdmin]
  );

  const deleteInquiry = useCallback(
    async (inquiryId: string) => {
      if (!isAdmin) throw new Error('Administrator authorization required.');
      const path = `inquiries/${inquiryId}`;
      try {
        await deleteDoc(doc(db, 'inquiries', inquiryId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    },
    [isAdmin]
  );

  const uploadImageFile = useCallback(
    async (file: File): Promise<string> => {
      if (!auth.currentUser || !isAdmin) {
        throw new Error('Administrator authentication required for image uploads.');
      }
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        throw new Error('Please upload JPG, PNG, or WebP images only.');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be 5 MB or smaller.');
      }

      const idToken = await auth.currentUser.getIdToken();
      const dataBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          dataBase64,
        }),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error || 'Image upload failed.');
      }
      const json = (await res.json()) as { url: string };
      return json.url;
    },
    [isAdmin]
  );

  const addGalleryImage = useCallback(
    async (img: {
      title: string;
      collectionName: string;
      url: string;
      propertyId?: string;
      isPublic: boolean;
    }): Promise<string> => {
      if (!auth.currentUser || !isAdmin) throw new Error('Administrator authorization required.');
      const id = `img_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      const payload: Record<string, unknown> = {
        title: img.title.trim().slice(0, 120) || 'Property Image',
        collectionName: img.collectionName.trim().slice(0, 80) || 'General',
        url: img.url.trim().slice(0, 600),
        isPublic: Boolean(img.isPublic),
        uploadedBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      };
      if (img.propertyId) {
        payload.propertyId = img.propertyId.slice(0, 128);
      }
      try {
        await setDoc(doc(db, 'property_images', id), payload);
        return id;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `property_images/${id}`);
      }
    },
    [isAdmin]
  );

  const deleteGalleryImage = useCallback(
    async (imageId: string) => {
      if (!isAdmin) throw new Error('Administrator authorization required.');
      try {
        await deleteDoc(doc(db, 'property_images', imageId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `property_images/${imageId}`);
      }
    },
    [isAdmin]
  );

  const saveBusinessSettings = useCallback(
    async (settings: BusinessSettings) => {
      if (!isAdmin) throw new Error('Administrator authorization required.');
      const path = 'business_settings/primary';
      const payload = {
        businessName: settings.businessName.trim().slice(0, 120),
        phone: settings.phone.trim().slice(0, 30),
        whatsappNumber: settings.whatsappNumber.replace(/[^0-9]/g, '').slice(0, 25),
        officeAddress: settings.officeAddress.trim().slice(0, 300),
        plusCode: settings.plusCode.trim().slice(0, 80),
        businessHours: settings.businessHours.trim().slice(0, 160),
        description: settings.description.trim().slice(0, 1500),
        googleReviewsUrl: (settings.googleReviewsUrl || '').trim().slice(0, 500),
        facebookUrl: (settings.facebookUrl || '').trim().slice(0, 400),
        instagramUrl: (settings.instagramUrl || '').trim().slice(0, 400),
        linkedinUrl: (settings.linkedinUrl || '').trim().slice(0, 400),
        youtubeUrl: (settings.youtubeUrl || '').trim().slice(0, 400),
        updatedAt: serverTimestamp(),
      };
      try {
        await setDoc(doc(db, 'business_settings', 'primary'), payload);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    },
    [isAdmin]
  );

  const saveTestimonial = useCallback(
    async (
      testimonial: Omit<Testimonial, 'id' | 'createdBy' | 'createdAt'> & { id?: string }
    ) => {
      if (!auth.currentUser || !isAdmin) throw new Error('Administrator authorization required.');
      const id = testimonial.id
        ? sanitizeId(testimonial.id)
        : `test_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      const ref = doc(db, 'testimonials', id);
      const existingSnap = testimonial.id ? await getDoc(ref) : null;
      const basePayload = {
        clientName: testimonial.clientName.trim().slice(0, 100),
        clientRole: (testimonial.clientRole || '').trim().slice(0, 100),
        quote: testimonial.quote.trim().slice(0, 1000),
        rating: Math.min(5, Math.max(1, Number(testimonial.rating) || 5)),
        isPublished: Boolean(testimonial.isPublished),
      };
      try {
        if (existingSnap && existingSnap.exists()) {
          await updateDoc(ref, basePayload);
        } else {
          await setDoc(ref, {
            ...basePayload,
            createdBy: auth.currentUser.uid,
            createdAt: serverTimestamp(),
          });
        }
      } catch (error) {
        handleFirestoreError(
          error,
          existingSnap?.exists() ? OperationType.UPDATE : OperationType.CREATE,
          `testimonials/${id}`
        );
      }
    },
    [isAdmin]
  );

  const deleteTestimonial = useCallback(
    async (testimonialId: string) => {
      if (!isAdmin) throw new Error('Administrator authorization required.');
      try {
        await deleteDoc(doc(db, 'testimonials', testimonialId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `testimonials/${testimonialId}`);
      }
    },
    [isAdmin]
  );

  const isShowingDemoFallback = hasLoadedProperties && firestoreProperties.length === 0;
  const effectiveProperties = useMemo(
    () => (firestoreProperties.length > 0 ? firestoreProperties : DEMO_PROPERTIES),
    [firestoreProperties]
  );

  const value: AppContextValue = {
    properties: effectiveProperties,
    allAdminProperties,
    isShowingDemoFallback,
    inquiries,
    businessSettings,
    testimonials,
    allAdminTestimonials,
    galleryImages,
    loadingProperties: !hasLoadedProperties,
    user,
    isAdmin,
    authReady,
    mapsApiKey,
    gmpQuotaExceeded,
    savedIds,
    toggleSaved,
    signInWithGoogle,
    signOut,
    saveProperty,
    deleteProperty,
    togglePropertyPublished,
    seedDemoProperties,
    submitInquiry,
    updateInquiryStatus,
    deleteInquiry,
    uploadImageFile,
    addGalleryImage,
    deleteGalleryImage,
    saveBusinessSettings,
    saveTestimonial,
    deleteTestimonial,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
