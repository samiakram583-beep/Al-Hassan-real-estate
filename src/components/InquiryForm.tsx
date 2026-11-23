import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { InquiryKind } from '../types';

interface InquiryFormProps {
  defaultPropertyType?: string;
  defaultMessage?: string;
  propertyId?: string;
  propertyTitle?: string;
  inquiryKind?: InquiryKind;
  compact?: boolean;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({
  defaultPropertyType = 'Residential',
  defaultMessage = '',
  propertyId,
  propertyTitle,
  inquiryKind = 'Consultation',
  compact = false,
}) => {
  const { submitInquiry } = useApp();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interestedPropertyType, setInterestedPropertyType] = useState(defaultPropertyType);
  const [budgetRange, setBudgetRange] = useState('PKR 2 Crore - 5 Crore');
  const [message, setMessage] = useState(defaultMessage);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setInterestedPropertyType(defaultPropertyType);
  }, [defaultPropertyType]);

  useEffect(() => {
    if (defaultMessage) setMessage(defaultMessage);
  }, [defaultMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (phone.trim().length < 7) {
      setError('Please provide a valid phone or WhatsApp number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 5) {
      setError('Please include a brief message about your property goals.');
      return;
    }

    setSubmitting(true);
    try {
      await submitInquiry({
        fullName,
        phone,
        email,
        interestedPropertyType,
        budgetRange,
        message,
        propertyId,
        propertyTitle,
        inquiryKind,
      });
      setSubmitted(true);
      setFullName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(
        err instanceof Error
          ? 'Could not submit your request right now. Please try again or reach us on WhatsApp.'
          : 'Submission failed.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-[#23845B]/30 bg-[#23845B]/5 p-6 sm:p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-[#23845B] mx-auto mb-3" aria-hidden="true" />
        <h4 className="font-display text-xl font-semibold text-[#102A43]">
          Consultation Request Received
        </h4>
        <p className="text-sm text-[#263746] mt-2 max-w-md mx-auto leading-relaxed">
          Thank you for contacting Al Hassan Garden. An advisor from our Sahiwal office will
          respond to your inquiry shortly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-5 px-4 py-2 rounded-lg border border-[#102A43]/20 text-xs font-semibold text-[#102A43] hover:bg-white transition-colors cursor-pointer"
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-800"
        >
          {error}
        </div>
      )}

      <div className={`grid grid-cols-1 ${compact ? '' : 'sm:grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            maxLength={120}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E9EEF3] bg-white text-sm text-[#263746] focus:outline-none focus:border-[#102A43]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            maxLength={30}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 3XX XXXXXXX"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E9EEF3] bg-white text-sm text-[#263746] focus:outline-none focus:border-[#102A43]"
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compact ? '' : 'sm:grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            required
            maxLength={160}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E9EEF3] bg-white text-sm text-[#263746] focus:outline-none focus:border-[#102A43]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
            Interested Property Type
          </label>
          <select
            value={interestedPropertyType}
            onChange={(e) => setInterestedPropertyType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E9EEF3] bg-white text-sm text-[#263746] focus:outline-none focus:border-[#102A43]"
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Apartments">Apartments</option>
            <option value="Houses">Houses</option>
            <option value="Plots">Plots</option>
            <option value="Investment Properties">Investment Properties</option>
            <option value="Sell / List Property">Sell / List Property</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Budget Range</label>
        <select
          value={budgetRange}
          onChange={(e) => setBudgetRange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-[#E9EEF3] bg-white text-sm text-[#263746] focus:outline-none focus:border-[#102A43]"
        >
          <option value="Under PKR 2 Crore">Under PKR 2 Crore</option>
          <option value="PKR 2 Crore - 5 Crore">PKR 2 Crore – 5 Crore</option>
          <option value="PKR 5 Crore - 10 Crore">PKR 5 Crore – 10 Crore</option>
          <option value="PKR 10 Crore - 20 Crore">PKR 10 Crore – 20 Crore</option>
          <option value="Above PKR 20 Crore">Above PKR 20 Crore</option>
          <option value="Rental / Leasing">Rental / Leasing Budget</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#102A43] mb-1.5">Message *</label>
        <textarea
          rows={compact ? 3 : 4}
          required
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share preferred sector, investment horizon, or questions..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-[#E9EEF3] bg-white text-sm text-[#263746] focus:outline-none focus:border-[#102A43]"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#23845B] text-white text-sm font-semibold hover:bg-[#1B6B49] disabled:opacity-60 transition-colors cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Submitting Request...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            {inquiryKind === 'Property Visit'
              ? 'Book a Property Visit'
              : 'Request Consultation'}
          </>
        )}
      </button>
    </form>
  );
};
