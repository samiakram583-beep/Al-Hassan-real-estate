import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GOOGLE_MAPS_URL } from '../lib/defaults';

export const Footer: React.FC = () => {
  const { businessSettings } = useApp();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#071B2D] text-white/85 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-white">
              {businessSettings.businessName}
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              {businessSettings.description}
            </p>
            <a
              href={`https://wa.me/${businessSettings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#23845B] text-white text-xs font-semibold hover:bg-[#1B6B49] transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              WhatsApp Consultation
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  Properties Directory
                </Link>
              </li>
              <li>
                <Link to="/investments" className="hover:text-white transition-colors">
                  Investment Opportunities
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Consultation
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors text-white/55">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Property Categories</h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              {[
                'Residential',
                'Commercial',
                'Apartments',
                'Houses',
                'Plots',
                'Investment Properties',
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/properties?category=${encodeURIComponent(cat)}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Office & Contact */}
          <div className="space-y-3 text-sm text-white/75">
            <h3 className="text-sm font-semibold text-white mb-4">Sahiwal Office</h3>
            <p className="flex items-start gap-2.5 leading-relaxed">
              <MapPin className="w-4 h-4 shrink-0 text-[#23845B] mt-0.5" aria-hidden="true" />
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {businessSettings.officeAddress}
              </a>
            </p>
            <p className="flex items-center gap-2.5 tabular-nums">
              <Phone className="w-4 h-4 shrink-0 text-[#23845B]" aria-hidden="true" />
              <a
                href={`tel:${businessSettings.phone.replace(/\s+/g, '')}`}
                className="hover:text-white transition-colors"
              >
                {businessSettings.phone}
              </a>
            </p>

            {(businessSettings.facebookUrl ||
              businessSettings.instagramUrl ||
              businessSettings.linkedinUrl ||
              businessSettings.youtubeUrl) && (
              <div className="pt-2 flex flex-wrap gap-3 text-xs">
                {businessSettings.facebookUrl && (
                  <a
                    href={businessSettings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                  >
                    Facebook
                  </a>
                )}
                {businessSettings.instagramUrl && (
                  <a
                    href={businessSettings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                  >
                    Instagram
                  </a>
                )}
                {businessSettings.linkedinUrl && (
                  <a
                    href={businessSettings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                  >
                    LinkedIn
                  </a>
                )}
                {businessSettings.youtubeUrl && (
                  <a
                    href={businessSettings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                  >
                    YouTube
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/55">
          <p>
            © {year} {businessSettings.businessName}. All rights reserved.
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {businessSettings.officeAddress}
          </a>
        </div>
      </div>
    </footer>
  );
};
