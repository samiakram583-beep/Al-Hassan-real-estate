import React, { useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Copy,
  Database,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageCircle,
  Pencil,
  Plus,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPkr } from '../lib/defaults';
import { usePageSeo } from '../lib/seo';
import type { BusinessSettings, InquiryStatus, Property } from '../types';
import { PropertyFormModal } from '../components/PropertyFormModal';
import { PropertyImageSlot } from '../components/PropertyImageSlot';

type AdminTab = 'overview' | 'properties' | 'inquiries' | 'gallery' | 'settings';

export const AdminPage: React.FC = () => {
  const {
    user,
    isAdmin,
    authReady,
    signInWithGoogle,
    signOut,
    allAdminProperties,
    inquiries,
    galleryImages,
    businessSettings,
    allAdminTestimonials,
    deleteProperty,
    togglePropertyPublished,
    seedDemoProperties,
    updateInquiryStatus,
    deleteInquiry,
    uploadImageFile,
    addGalleryImage,
    deleteGalleryImage,
    saveBusinessSettings,
    saveTestimonial,
    deleteTestimonial,
  } = useApp();

  usePageSeo({
    title: 'Administrator Portal | Al Hassan Garden',
    description: 'Authorized administrator dashboard for property listings, inquiries, gallery, and business settings.',
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null | undefined>(undefined);
  const [propertySearch, setPropertySearch] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<string>('all');
  const [seedingDemo, setSeedingDemo] = useState(false);

  // Gallery upload state
  const [galleryCollection, setGalleryCollection] = useState('Residential');
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<BusinessSettings>(businessSettings);
  const [savingSettings, setSavingSettings] = useState(false);

  // Testimonial form state
  const [testName, setTestName] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testQuote, setTestQuote] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [savingTest, setSavingTest] = useState(false);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  React.useEffect(() => {
    setSettingsForm(businessSettings);
  }, [businessSettings]);

  const metrics = useMemo(() => {
    const totalProperties = allAdminProperties.length;
    const activeListings = allAdminProperties.filter((p) => p.isPublished).length;
    const totalInquiries = inquiries.length;
    const newInquiries = inquiries.filter((i) => i.status === 'new').length;
    return { totalProperties, activeListings, totalInquiries, newInquiries };
  }, [allAdminProperties, inquiries]);

  const filteredProps = useMemo(() => {
    const q = propertySearch.toLowerCase().trim();
    if (!q) return allAdminProperties;
    return allAdminProperties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [allAdminProperties, propertySearch]);

  const filteredInquiries = useMemo(() => {
    if (inquiryFilter === 'all') return inquiries;
    return inquiries.filter((i) => i.status === inquiryFilter);
  }, [inquiries, inquiryFilter]);

  // Loading auth state
  if (!authReady) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F7FA]">
        <Loader2 className="w-7 h-7 animate-spin text-[#102A43]" />
      </div>
    );
  }

  // Unauthenticated gate (no public registration)
  if (!user) {
    return (
      <div className="min-h-[78vh] bg-[#F5F7FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-[#E9EEF3] max-w-md w-full p-8 text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-[#102A43] text-white flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-[#102A43]">
              Administrator Sign In
            </h1>
            <p className="text-sm text-[#748394] mt-2 leading-relaxed">
              Restricted portal for authorized Al Hassan Garden administrators. Public registration
              is disabled.
            </p>
          </div>
          <button
            type="button"
            onClick={() => signInWithGoogle().catch((e) => notify(e.message, 'error'))}
            className="w-full py-3 px-5 rounded-lg bg-[#102A43] text-white text-sm font-semibold hover:bg-[#071B2D] transition-colors cursor-pointer"
          >
            Sign In With Authorized Google Account
          </button>
        </div>
      </div>
    );
  }

  // Authenticated but unauthorized
  if (!isAdmin) {
    return (
      <div className="min-h-[78vh] bg-[#F5F7FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-[#E9EEF3] max-w-md w-full p-8 text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-[#102A43]">Access Restricted</h1>
            <p className="text-sm text-[#748394] mt-2 leading-relaxed">
              The account <strong>{user.email}</strong> is not authorized for administrator access.
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#E9EEF3] text-sm font-semibold text-[#102A43] hover:bg-[#F5F7FA] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const handleSeedDemos = async () => {
    setSeedingDemo(true);
    try {
      await seedDemoProperties();
      notify('Demonstration properties saved to Firestore for editing.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to load demonstration listings.', 'error');
    } finally {
      setSeedingDemo(false);
    }
  };

  const handleDeleteProperty = async (prop: Property) => {
    try {
      await deleteProperty(prop.id);
      notify(`Deleted "${prop.title}".`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Delete failed.', 'error');
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    try {
      for (const file of files) {
        const url = await uploadImageFile(file);
        await addGalleryImage({
          title: file.name.replace(/\.[^.]+$/, ''),
          collectionName: galleryCollection,
          url,
          isPublic: true,
        });
      }
      notify(`Uploaded ${files.length} image(s) to gallery.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Gallery upload failed.', 'error');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await saveBusinessSettings(settingsForm);
      notify('Business settings updated across website.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save settings.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (testName.trim().length < 2 || testQuote.trim().length < 10) {
      notify('Please provide client name and quote (min 10 chars).', 'error');
      return;
    }
    setSavingTest(true);
    try {
      await saveTestimonial({
        clientName: testName,
        clientRole: testRole,
        quote: testQuote,
        rating: testRating,
        isPublished: true,
      });
      setTestName('');
      setTestRole('');
      setTestQuote('');
      setTestRating(5);
      notify('Verified testimonial added.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save testimonial.', 'error');
    } finally {
      setSavingTest(false);
    }
  };

  const navTabs: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2, badge: metrics.totalProperties },
    { id: 'inquiries', label: 'Inquiries', icon: Inbox, badge: metrics.newInquiries },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'settings', label: 'Settings & Reviews', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-[#E9EEF3] shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-[#E9EEF3]">
            <p className="text-xs font-semibold text-[#23845B]">Admin Console</p>
            <p className="font-display text-lg font-semibold text-[#102A43] truncate mt-0.5">
              {businessSettings.businessName}
            </p>
            <p className="text-xs text-[#748394] truncate mt-1">{user.email}</p>
          </div>

          <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#102A43] text-white'
                      : 'text-[#263746] hover:bg-[#F5F7FA] hover:text-[#102A43]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] tabular-nums ${
                        active ? 'bg-white/20 text-white' : 'bg-[#E9EEF3] text-[#102A43]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#E9EEF3] hidden lg:block">
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#E9EEF3] text-xs font-semibold text-[#263746] hover:bg-[#F5F7FA] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E9EEF3]">
          <div>
            <p className="text-xs text-[#748394]">
              Admin / {navTabs.find((t) => t.id === activeTab)?.label}
            </p>
            <h1 className="font-display text-2xl font-semibold text-[#102A43] mt-0.5">
              {navTabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingProperty(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#23845B] text-white text-xs font-semibold hover:bg-[#1B6B49] cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              className="lg:hidden px-3 py-2.5 rounded-lg border border-[#E9EEF3] bg-white text-xs font-semibold text-[#263746]"
            >
              Sign Out
            </button>
          </div>
        </div>

        {toast && (
          <div
            role="status"
            className={`rounded-lg px-4 py-3 text-xs font-semibold flex items-center gap-2 border ${
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-[#23845B]/10 border-[#23845B]/30 text-[#1B6B49]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
              {[
                { label: 'Total Properties', value: metrics.totalProperties },
                { label: 'Active Listings', value: metrics.activeListings },
                { label: 'Total Inquiries', value: metrics.totalInquiries },
                { label: 'New Inquiries', value: metrics.newInquiries },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl border border-[#E9EEF3] p-5 space-y-1"
                >
                  <p className="text-xs font-medium text-[#748394]">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#102A43]">{stat.value}</p>
                </div>
              ))}
            </div>

            {allAdminProperties.length === 0 && (
              <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-semibold text-[#102A43]">
                    Firestore Property Catalog is Empty
                  </h2>
                  <p className="text-xs sm:text-sm text-[#748394] mt-1">
                    Add your first verified property listing, or import the 6 demonstration listings
                    into Firestore so you can edit or replace them.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={seedingDemo}
                  onClick={handleSeedDemos}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#071B2D] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {seedingDemo ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Database className="w-4 h-4" />
                  )}
                  Load Demo Listings to Database
                </button>
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#E9EEF3] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E9EEF3] flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-[#102A43]">
                  Recent Property Inquiries
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-semibold text-[#23845B] hover:underline cursor-pointer"
                >
                  View All Inquiries →
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#748394]">
                  No inquiries received yet. Submissions from the website contact and property visit
                  forms appear here immediately.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#F5F7FA] text-[#748394] text-xs">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Client</th>
                        <th className="px-5 py-3 font-semibold">Interest</th>
                        <th className="px-5 py-3 font-semibold">Budget</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9EEF3]">
                      {inquiries.slice(0, 6).map((inq) => (
                        <tr key={inq.id} className="hover:bg-[#F5F7FA]/60">
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-[#102A43]">{inq.fullName}</p>
                            <p className="text-xs text-[#748394] tabular-nums">{inq.phone}</p>
                          </td>
                          <td className="px-5 py-3.5 text-[#263746]">
                            <p className="font-medium">{inq.propertyTitle || inq.interestedPropertyType}</p>
                            <p className="text-xs text-[#748394]">{inq.inquiryKind}</p>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#263746]">{inq.budgetRange}</td>
                          <td className="px-5 py-3.5">
                            <select
                              value={inq.status}
                              onChange={(e) =>
                                updateInquiryStatus(inq.id, e.target.value as InquiryStatus)
                              }
                              className="px-2.5 py-1 rounded border border-[#E9EEF3] bg-white text-xs font-semibold text-[#102A43]"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#23845B] hover:underline"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTIES */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-xl border border-[#E9EEF3] overflow-hidden">
            <div className="p-5 border-b border-[#E9EEF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                value={propertySearch}
                onChange={(e) => setPropertySearch(e.target.value)}
                placeholder="Search properties by title, location, category..."
                className="w-full sm:w-80 px-3.5 py-2 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-sm focus:bg-white focus:outline-none focus:border-[#102A43]"
              />
              {allAdminProperties.length === 0 && (
                <button
                  type="button"
                  disabled={seedingDemo}
                  onClick={handleSeedDemos}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#102A43] text-xs font-semibold text-[#102A43] hover:bg-[#F5F7FA] cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  Load Demo Listings
                </button>
              )}
            </div>

            {filteredProps.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#748394]">
                No properties stored in Firestore yet. Click &ldquo;Add Property&rdquo; above to
                publish your first verified listing.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F5F7FA] text-[#748394] text-xs">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Listing</th>
                      <th className="px-5 py-3 font-semibold">Category</th>
                      <th className="px-5 py-3 font-semibold">Price (PKR)</th>
                      <th className="px-5 py-3 font-semibold">Visibility</th>
                      <th className="px-5 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EEF3]">
                    {filteredProps.map((prop) => (
                      <tr key={prop.id} className="hover:bg-[#F5F7FA]/60">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-10 rounded overflow-hidden bg-[#E9EEF3] shrink-0">
                              <PropertyImageSlot src={prop.images[0]} alt={prop.title} />
                            </div>
                            <div>
                              <p className="font-semibold text-[#102A43] line-clamp-1">
                                {prop.title}
                              </p>
                              <p className="text-xs text-[#748394]">
                                {prop.location}
                                {prop.isDemo ? ' · Demo' : ''}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[#263746]">
                          {prop.category} · {prop.status}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-[#102A43] tabular-nums">
                          {formatPkr(prop.pricePkr, prop.status === 'For Rent')}
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            type="button"
                            onClick={() => togglePropertyPublished(prop)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                              prop.isPublished
                                ? 'bg-[#23845B]/10 text-[#23845B]'
                                : 'bg-[#E9EEF3] text-[#748394]'
                            }`}
                          >
                            {prop.isPublished ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                Published
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                Draft
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setEditingProperty(prop)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-[#E9EEF3] text-xs font-semibold text-[#102A43] hover:bg-[#F5F7FA] cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProperty(prop)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {['all', 'new', 'contacted', 'scheduled', 'closed'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setInquiryFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                    inquiryFilter === st
                      ? 'bg-[#102A43] text-white'
                      : 'bg-white border border-[#E9EEF3] text-[#263746]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E9EEF3] p-10 text-center text-sm text-[#748394]">
                No inquiries match this filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => {
                  const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
                  const waHref = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${inq.fullName}, thank you for contacting Al Hassan Garden regarding ${
                      inq.propertyTitle || inq.interestedPropertyType
                    }.`
                  )}`;
                  return (
                    <div
                      key={inq.id}
                      className="bg-white rounded-xl border border-[#E9EEF3] p-5 sm:p-6 space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#23845B]">
                            <span>{inq.inquiryKind}</span>
                            <span aria-hidden="true">·</span>
                            <span>{inq.interestedPropertyType}</span>
                            <span aria-hidden="true">·</span>
                            <span>{inq.budgetRange}</span>
                          </div>
                          <h3 className="font-display text-lg font-semibold text-[#102A43] mt-1">
                            {inq.fullName}
                          </h3>
                          <p className="text-xs text-[#748394] mt-0.5 tabular-nums">
                            {inq.phone} · {inq.email}
                          </p>
                          {inq.propertyTitle && (
                            <p className="text-xs font-semibold text-[#102A43] mt-1">
                              Property: {inq.propertyTitle}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              updateInquiryStatus(inq.id, e.target.value as InquiryStatus)
                            }
                            className="px-3 py-2 rounded-lg border border-[#E9EEF3] bg-[#F5F7FA] text-xs font-semibold text-[#102A43]"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="closed">Closed</option>
                          </select>

                          <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#23845B] text-white text-xs font-semibold hover:bg-[#1B6B49]"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp Client
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              deleteInquiry(inq.id)
                                .then(() => notify('Inquiry deleted.'))
                                .catch((e) => notify(e.message, 'error'))
                            }
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-[#263746] bg-[#F5F7FA] rounded-lg p-3.5 leading-relaxed">
                        {inq.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#102A43]">
                  Upload Images to Media Library
                </h2>
                <p className="text-xs text-[#748394] mt-1">
                  Uploaded assets are stored securely and available for any property listing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={galleryCollection}
                  onChange={(e) => setGalleryCollection(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#E9EEF3] text-xs font-semibold text-[#102A43]"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Plots">Plots</option>
                  <option value="Apartments">Apartments</option>
                  <option value="Floor Plans">Floor Plans</option>
                  <option value="General">General</option>
                </select>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#071B2D] cursor-pointer">
                  {uploadingGallery ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploadingGallery ? 'Uploading...' : 'Upload Images'}
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {galleryImages.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E9EEF3] p-10 text-center text-sm text-[#748394]">
                No custom uploaded images in Firestore gallery yet. Upload photographs above to build
                your media collections.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white rounded-xl border border-[#E9EEF3] overflow-hidden flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] bg-[#E9EEF3]">
                      <PropertyImageSlot src={img.url} alt={img.title} />
                    </div>
                    <div className="p-3.5 space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-[#102A43] truncate">{img.title}</p>
                        <p className="text-[11px] text-[#748394]">{img.collectionName}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#E9EEF3]">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(img.url);
                            notify('Image URL copied.');
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#102A43] hover:text-[#23845B] cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy URL
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            deleteGalleryImage(img.id)
                              .then(() => notify('Image removed from gallery.'))
                              .catch((e) => notify(e.message, 'error'))
                          }
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: BUSINESS SETTINGS & TESTIMONIALS */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Business Settings */}
            <form
              onSubmit={handleSaveSettings}
              className="lg:col-span-7 bg-white rounded-xl border border-[#E9EEF3] p-6 space-y-4"
            >
              <h2 className="font-display text-xl font-semibold text-[#102A43] pb-3 border-b border-[#E9EEF3]">
                Business Profile &amp; Contact Settings
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.businessName}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, businessName: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm((s) => ({ ...s, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    WhatsApp Number (digits with country code)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsappNumber}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, whatsappNumber: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Plus Code
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.plusCode}
                    onChange={(e) => setSettingsForm((s) => ({ ...s, plusCode: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Office Address
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.officeAddress}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, officeAddress: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.businessHours}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, businessHours: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Business Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={settingsForm.description}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, description: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Verified Google Reviews URL (optional)
                  </label>
                  <input
                    type="url"
                    value={settingsForm.googleReviewsUrl || ''}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, googleReviewsUrl: e.target.value }))
                    }
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.facebookUrl || ''}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, facebookUrl: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.instagramUrl || ''}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, instagramUrl: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.linkedinUrl || ''}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, linkedinUrl: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.youtubeUrl || ''}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, youtubeUrl: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#23845B] text-white text-xs font-semibold hover:bg-[#1B6B49] cursor-pointer"
              >
                {savingSettings && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Business Settings
              </button>
            </form>

            {/* Owner-supplied Testimonials */}
            <div className="lg:col-span-5 space-y-6">
              <form
                onSubmit={handleAddTestimonial}
                className="bg-white rounded-xl border border-[#E9EEF3] p-6 space-y-4"
              >
                <h2 className="font-display text-xl font-semibold text-[#102A43] pb-3 border-b border-[#E9EEF3]">
                  Add Verified Client Testimonial
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      Client Role / City
                    </label>
                    <input
                      type="text"
                      value={testRole}
                      onChange={(e) => setTestRole(e.target.value)}
                      placeholder="e.g. Investor, Sahiwal"
                      className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      Rating (1-5)
                    </label>
                    <select
                      value={testRating}
                      onChange={(e) => setTestRating(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Verified Quote *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={testQuote}
                    onChange={(e) => setTestQuote(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E9EEF3] text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingTest}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#102A43] text-white text-xs font-semibold hover:bg-[#071B2D] cursor-pointer"
                >
                  {savingTest && <Loader2 className="w-4 h-4 animate-spin" />}
                  Publish Testimonial
                </button>
              </form>

              <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 space-y-3">
                <h3 className="text-sm font-semibold text-[#102A43]">
                  Published Testimonials ({allAdminTestimonials.length})
                </h3>
                {allAdminTestimonials.length === 0 ? (
                  <p className="text-xs text-[#748394]">
                    No testimonials added yet. Only genuine owner-supplied quotes are displayed on
                    the website.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {allAdminTestimonials.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-lg bg-[#F5F7FA] border border-[#E9EEF3] flex items-start justify-between gap-3"
                      >
                        <div>
                          <p className="text-xs font-semibold text-[#102A43]">
                            {t.clientName} {t.clientRole ? `· ${t.clientRole}` : ''}
                          </p>
                          <p className="text-xs text-[#263746] mt-1">“{t.quote}”</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            deleteTestimonial(t.id)
                              .then(() => notify('Testimonial deleted.'))
                              .catch((e) => notify(e.message, 'error'))
                          }
                          aria-label="Delete testimonial"
                          className="text-red-700 hover:text-red-900 shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {editingProperty !== undefined && (
        <PropertyFormModal
          initial={editingProperty}
          onClose={() => setEditingProperty(undefined)}
          onSaved={(msg) => {
            setEditingProperty(undefined);
            notify(msg);
          }}
        />
      )}
    </div>
  );
};
