import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { businessSettings } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (target: string, hashId?: string) => {
    setMobileOpen(false);
    if (hashId && location.pathname === '/') {
      const el = document.getElementById(hashId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(target);
  };

  const navItems = [
    { label: 'Home', to: '/', hash: 'hero-top' },
    { label: 'Properties', to: '/properties' },
    { label: 'Buy', to: '/properties?status=For+Sale' },
    { label: 'Sell', to: '/contact?intent=Sell+Property', hash: 'contact-section' },
    { label: 'Investments', to: '/investments', hash: 'investments-section' },
    { label: 'About Us', to: '/about', hash: 'about-section' },
    { label: 'Contact', to: '/contact', hash: 'contact-section' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E9EEF3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="font-display text-lg lg:text-xl font-semibold tracking-tight text-[#102A43] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#23845B] rounded"
        >
          {businessSettings.businessName}
        </Link>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#263746]"
        >
          {navItems.map((item) => {
            const isActive =
              item.to === '/'
                ? location.pathname === '/'
                : location.pathname === item.to.split('?')[0] && !item.to.includes('?');
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.to, item.hash)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#102A43] cursor-pointer ${
                  isActive ? 'text-[#102A43] font-semibold' : 'text-[#263746]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#23845B] transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action CTA + Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/properties"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#102A43] text-white text-sm font-semibold hover:bg-[#071B2D] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23845B]"
          >
            Explore Properties
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E9EEF3] text-[#102A43] hover:bg-[#F5F7FA] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-[#E9EEF3] bg-white px-4 py-4 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavClick(item.to, item.hash)}
              className="w-full text-left px-3 py-3 rounded-lg text-sm font-medium text-[#263746] hover:bg-[#F5F7FA] hover:text-[#102A43] transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E9EEF3]">
            <Link
              to="/properties"
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-[#102A43] text-white text-sm font-semibold hover:bg-[#071B2D]"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
