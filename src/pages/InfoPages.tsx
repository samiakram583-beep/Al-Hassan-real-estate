import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ExternalLink, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GOOGLE_MAPS_URL, GOOGLE_RATING } from '../lib/defaults';
import { STUDIO_IMAGES } from '../lib/demoImages';
import { usePageSeo } from '../lib/seo';
import { PropertyImageSlot } from '../components/PropertyImageSlot';
import { InquiryForm } from '../components/InquiryForm';
import { OfficeGoogleMap } from '../components/GoogleMapsView';

export const InvestmentsPage: React.FC = () => {
  const { businessSettings } = useApp();

  usePageSeo({
    title: `Investment Opportunities | ${businessSettings.businessName}`,
    description:
      'Explore residential, commercial, plot, rental income, and long-term real estate opportunities in Sahiwal.',
  });

  const tracks = [
    {
      title: 'Residential Investment',
      category: 'Residential',
      image: STUDIO_IMAGES.propertyModernVilla,
      summary:
        'Assessing completed homes and family residences across Sahiwal neighborhoods based on structural quality, transfer clarity, and neighborhood livability.',
    },
    {
      title: 'Commercial Investment',
      category: 'Commercial',
      image: STUDIO_IMAGES.propertyCommercialTower,
      summary:
        'Commercial floors and business offices evaluated on accessibility, parking ratios, building maintenance, and tenant suitability.',
    },
    {
      title: 'Plot Investments',
      category: 'Plots',
      image: STUDIO_IMAGES.propertyResidentialPlot,
      summary:
        'Evaluation of possession plots and land holdings, checking utilities, road frontage, and development readiness.',
    },
    {
      title: 'Rental Income Opportunities',
      category: 'Apartments',
      image: STUDIO_IMAGES.propertyPenthouseInterior,
      summary:
        'Analyzing apartments and leased residential units suited to family and corporate tenant profiles in Sahiwal.',
    },
    {
      title: 'Long-Term Property Investment',
      category: 'Investment Properties',
      image: STUDIO_IMAGES.heroIslamabadEstate,
      summary:
        'Disciplined multi-year real estate allocation tailored for local and overseas buyers and long-term capital preservation.',
    },
  ];

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold tracking-wider text-[#23845B] mb-2">
            Investment Advisory
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#102A43] text-balance">
            Smart Property Investments. Better Opportunities.
          </h1>
          <p className="mt-4 text-base text-[#263746] leading-relaxed">
            Real estate investment requires transparent evaluation rather than speculative claims.
            Al Hassan Garden guides clients through comparative market pricing, title verification,
            and long-term asset positioning across Sahiwal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {tracks.map((track) => (
            <div
              key={track.title}
              className="bg-white rounded-xl border border-[#E9EEF3] overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] bg-[#E9EEF3] overflow-hidden">
                  <PropertyImageSlot
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-xl font-semibold text-[#102A43]">
                    {track.title}
                  </h2>
                  <p className="mt-2.5 text-sm text-[#263746] leading-relaxed">{track.summary}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <Link
                  to={`/properties?category=${encodeURIComponent(track.category)}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#23845B] hover:underline"
                >
                  View {track.category} Listings
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AboutPage: React.FC = () => {
  const { businessSettings } = useApp();

  usePageSeo({
    title: `About Us | ${businessSettings.businessName}`,
    description:
      'Learn how Al Hassan Garden serves buyers, sellers, and property investors from Main Faisalabad Noor Shah Rd, Sahiwal, Pakistan.',
  });

  return (
    <div className="bg-white min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-wider text-[#23845B]">About Us</p>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#102A43] text-balance">
              Your Trusted Partner in Real Estate Investment.
            </h1>
            <p className="text-base text-[#263746] leading-relaxed">
              {businessSettings.description}
            </p>
            <p className="text-sm sm:text-base text-[#748394] leading-relaxed">
              Operating from Main Faisalabad Noor Shah Rd in Sahiwal, our real estate team works
              closely with private buyers, families, and property investors to evaluate assets
              carefully, coordinate site inspections, and ensure transparent communication from
              initial briefing through final transfer.
            </p>

            <div className="pt-4 border-t border-[#E9EEF3] space-y-2 text-sm">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-semibold text-[#102A43] hover:text-[#23845B] transition-colors"
              >
                {businessSettings.officeAddress}
              </a>
              <p className="text-[#748394] tabular-nums">
                <a
                  href={`tel:${businessSettings.phone.replace(/\s+/g, '')}`}
                  className="hover:text-[#102A43] transition-colors"
                >
                  {businessSettings.phone}
                </a>
                {' · '}
                {GOOGLE_RATING.score} ★ ({GOOGLE_RATING.reviewCount} reviews)
              </p>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <Link
                to="/properties"
                className="px-5 py-3 rounded-lg bg-[#102A43] text-white text-sm font-semibold hover:bg-[#071B2D]"
              >
                Explore Properties
              </Link>
              <Link
                to="/contact"
                className="px-5 py-3 rounded-lg border border-[#102A43]/20 text-[#102A43] text-sm font-semibold hover:bg-[#F5F7FA]"
              >
                Book a Consultation
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-xl overflow-hidden border border-[#E9EEF3] min-h-[360px]">
            <PropertyImageSlot
              src={STUDIO_IMAGES.aboutConsultancyOffice}
              alt="Consultancy office boardroom"
              priority
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { businessSettings } = useApp();
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent');

  usePageSeo({
    title: `Contact & Consultation | ${businessSettings.businessName}`,
    description: `Contact ${businessSettings.businessName} at ${businessSettings.officeAddress} or ${businessSettings.phone}.`,
  });

  const directionsHref = GOOGLE_MAPS_URL;

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold tracking-wider text-[#23845B] mb-2">
            Contact &amp; Office Location
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#102A43]">
            {intent === 'Sell Property'
              ? 'List or Sell Your Property With Us'
              : 'Connect With Al Hassan Garden'}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#748394]">
            Schedule an in-office meeting in Sahiwal or send your property inquiry below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-xl border border-[#E9EEF3] p-6 sm:p-7 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-[#102A43]">
                    {businessSettings.businessName}
                  </h2>
                  <p className="text-xs text-[#748394] mt-0.5">Real Estate</p>
                </div>
                <span className="text-xs font-semibold text-[#23845B] tabular-nums">
                  {GOOGLE_RATING.score} ★ ({GOOGLE_RATING.reviewCount} reviews)
                </span>
              </div>
              <div className="space-y-3 text-sm text-[#263746]">
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#23845B] text-white text-xs sm:text-sm font-semibold hover:bg-[#1B6B49]"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Consultation
                </a>
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#102A43]/20 text-[#102A43] text-xs sm:text-sm font-semibold hover:bg-[#F5F7FA]"
                >
                  Get Directions
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <OfficeGoogleMap
              businessName={businessSettings.businessName}
              address={businessSettings.officeAddress}
              plusCode={businessSettings.plusCode}
              heightClass="h-[360px]"
            />
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl border border-[#E9EEF3] p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-[#102A43] mb-5">
              Consultation Form
            </h2>
            <InquiryForm
              defaultPropertyType={intent === 'Sell Property' ? 'Sell / List Property' : 'Residential'}
              defaultMessage={
                intent === 'Sell Property'
                  ? 'I would like to discuss listing or selling my property through Al Hassan Garden.'
                  : ''
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
