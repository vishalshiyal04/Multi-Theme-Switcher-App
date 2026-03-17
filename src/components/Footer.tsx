import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.ts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FooterLink {
  label: string;
  to: string;
  external?: boolean;
}

interface FooterSection {
  heading: string;
  links: FooterLink[];
}

interface SocialLink {
  label: string;
  icon: string;
  href: string;
}

interface PaymentMethod {
  label: string;
  icon: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const FOOTER_SECTIONS: FooterSection[] = [
  {
    heading: 'Shop',
    links: [
      { label: 'Indoor Plants',  to: '/' },
      { label: 'Outdoor Plants', to: '/' },
      { label: 'Seeds',          to: '/' },
      { label: 'Tools',          to: '/' },
      { label: 'Planters',       to: '/' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',       to: '/about' },
      { label: 'Contact Us',     to: '/contact' },
      { label: 'Careers',        to: '/about' },
      { label: 'Blog',           to: '/' },
      { label: 'Press',          to: '/about' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'FAQs',              to: '/contact' },
      { label: 'Shipping Policy',   to: '/contact' },
      { label: 'Returns & Refunds', to: '/contact' },
      { label: 'Plant Care Guide',  to: '/' },
      { label: 'Track Order',       to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',    to: '/' },
      { label: 'Terms of Service',  to: '/' },
      { label: 'Cookie Policy',     to: '/' },
      { label: 'Accessibility',     to: '/' },
    ],
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Instagram', icon: '📸', href: 'https://instagram.com' },
  { label: 'Facebook',  icon: '👤', href: 'https://facebook.com' },
  { label: 'Twitter',   icon: '🐦', href: 'https://twitter.com' },
  { label: 'YouTube',   icon: '▶️', href: 'https://youtube.com' },
  { label: 'Pinterest', icon: '📌', href: 'https://pinterest.com' },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  { label: 'UPI',        icon: '📱' },
  { label: 'Visa',       icon: '💳' },
  { label: 'Mastercard', icon: '💳' },
  { label: 'Net Banking',icon: '🏦' },
  { label: 'COD',        icon: '💵' },
];

const TRUST_BADGES = [
  { icon: '🚚', text: 'Free Shipping over ₹5,000' },
  { icon: '🔄', text: '30-Day Returns' },
  { icon: '🌱', text: '100% Natural Plants' },
  { icon: '🔒', text: 'Secure Payments' },
];

const CURRENT_YEAR = new Date().getFullYear();

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TrustBadgeProps {
  icon: string;
  text: string;
  textClass: string;
  cardClass: string;
}

const TrustBadge: React.FC<TrustBadgeProps> = (props) => {
  const wrapClass =
    'flex items-center gap-2 px-4 py-3 rounded-xl ' + props.cardClass;
  const textClass = 'text-xs font-medium ' + props.textClass;

  return (
    <div className={wrapClass}>
      <span className="text-xl" aria-hidden="true">{props.icon}</span>
      <span className={textClass}>{props.text}</span>
    </div>
  );
};

interface FooterColProps {
  section: FooterSection;
  textClass: string;
}

const FooterCol: React.FC<FooterColProps> = (props) => {
  const heading = props.section.heading;
  const links = props.section.links;
  const textClass = props.textClass;

  const headingClass = 'text-sm font-semibold mb-4 ' + textClass;
  const linkClass =
    'text-sm opacity-60 hover:opacity-100 transition-opacity duration-150 ' +
    'focus-visible:outline-none focus-visible:ring-2 rounded ' +
    textClass;

  return (
    <div>
      <h3 className={headingClass}>{heading}</h3>
      <ul className="flex flex-col gap-2.5" role="list">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              
                <a href={link.to}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {link.label}
              </a>
            ) : (
              <Link to={link.to} className={linkClass}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const text = theme.colors.text;
  const cardBg = theme.colors.cardBg;
  const headerBg = theme.colors.headerBg;
  const border = theme.colors.border || 'border-white/10';
  const headingFont = theme.fonts && theme.fonts.heading ? theme.fonts.heading : '';

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState('');

  const handleSubscribe = () => {
    if (!email.trim()) {
      setSubError('Please enter your email address.');
      return;
    }
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setSubError('Please enter a valid email address.');
      return;
    }
    setSubError('');
    setSubscribed(true);
    setEmail('');
  };

  // ── Pre-computed classes ──────────────────────────────────────────────────

  const footerClass = 'w-full mt-16 ' + headerBg + ' ' + theme.transition;
  const dividerClass = 'border-t ' + border;

  const logoClass = 'flex items-center gap-2 text-xl font-bold ' + text + ' ' + headingFont;
  const taglineClass = 'text-sm opacity-60 mt-1 max-w-xs ' + text;

  const sectionHeadingClass = 'text-xs font-semibold uppercase tracking-wider opacity-40 mb-3 ' + text;

  const inputClass =
    'flex-1 px-4 py-2.5 rounded-lg text-sm border outline-none ' +
    'focus:ring-2 focus:ring-offset-1 placeholder:opacity-40 ' +
    cardBg + ' ' + text + ' ' + border;

  const subBtnClass =
    'px-5 py-2.5 rounded-lg text-sm font-medium ' +
    'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 ' +
    'active:scale-95 ' +
    theme.colors.buttonBg + ' ' + theme.colors.buttonText;

  const copyrightClass = 'text-xs opacity-40 ' + text;
  const bottomLinkClass =
    'text-xs opacity-40 hover:opacity-70 transition-opacity ' +
    'focus-visible:outline-none focus-visible:ring-2 rounded ' + text;

  return (
    <footer role="contentinfo" className={footerClass}>

      {/* ── Trust Badges Strip ── */}
      <div className={dividerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {TRUST_BADGES.map((badge) => (
              <TrustBadge
                key={badge.text}
                icon={badge.icon}
                text={badge.text}
                textClass={text}
                cardClass={cardBg}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Footer Body ── */}
      <div className={dividerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">

            {/* ── Brand Column (2/6) ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Logo */}
              <div>
                <div className={logoClass}>
                  <span aria-hidden="true">🌱</span>
                  <span>Plant Paradise</span>
                </div>
                <p className={taglineClass}>
                  Bringing nature closer to you, one plant at a time.
                  Sustainably grown, lovingly delivered.
                </p>
              </div>

              {/* Contact info */}
              <div className="flex flex-col gap-2">
                <p className={sectionHeadingClass}>Contact</p>
                
                  <a href="mailto:info@plantparadise.com"
                  className={'flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity ' + text}
                >
                  <span aria-hidden="true">✉️</span>
                  info@plantparadise.com
                </a>
                
                  <a href="tel:+911234567890"
                    className={'flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity ' + text}
                  >
                    <span aria-hidden="true">📞</span>
                    +91 9812111111
                  </a>
                <p className={'flex items-center gap-2 text-sm opacity-60 ' + text}>
                  <span aria-hidden="true">📍</span>
                  Ahmedabad, Gujarat, India
                </p>
              </div>

              {/* Social links */}
              <div>
                <p className={sectionHeadingClass}>Follow Us</p>
                <div className="flex items-center gap-2">
                  {SOCIAL_LINKS.map((social) => (
                    
                      <a key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={
                        'w-9 h-9 flex items-center justify-center rounded-xl ' +
                        'transition-all duration-150 hover:scale-110 active:scale-95 ' +
                        'focus-visible:outline-none focus-visible:ring-2 ' +
                        cardBg
                      }
                    >
                      <span aria-hidden="true">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Link Columns (4/6) ── */}
            <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {FOOTER_SECTIONS.map((section) => (
                <FooterCol
                  key={section.heading}
                  section={section}
                  textClass={text}
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── Newsletter Strip ── */}
      <div className={dividerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            <div>
              <p className={'text-base font-semibold ' + text + ' ' + headingFont}>
                🌿 Join our Green Community
              </p>
              <p className={'text-sm opacity-60 mt-0.5 ' + text}>
                Get plant care tips, seasonal offers, and new arrivals in your inbox.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              {subscribed ? (
                <p className="flex items-center gap-2 text-sm text-green-500 font-medium">
                  <span aria-hidden="true">✓</span>
                  You are subscribed!
                </p>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubscribe(); }}
                    aria-label="Email for newsletter"
                    className={inputClass}
                  />
                  <button onClick={handleSubscribe} className={subBtnClass}>
                    Subscribe
                  </button>
                </div>
              )}
              {subError && (
                <p role="alert" className="text-xs text-red-500">
                  {subError}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className={dividerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            {/* Copyright */}
            <p className={copyrightClass}>
              © {CURRENT_YEAR} Plant Paradise. All rights reserved. Made with 💚 in Ahmedabad.
            </p>

            {/* Payment methods */}
            <div className="flex items-center gap-2">
              <p className={'text-xs opacity-30 mr-1 ' + text}>We accept:</p>
              {PAYMENT_METHODS.map((pm) => (
                <span
                  key={pm.label}
                  title={pm.label}
                  aria-label={pm.label}
                  className={
                    'px-2 py-1 rounded text-xs font-medium opacity-60 ' + cardBg + ' ' + text
                  }
                >
                  {pm.icon} {pm.label}
                </span>
              ))}
            </div>

            {/* Bottom links */}
            <div className="flex items-center gap-4">
              <Link to="/" className={bottomLinkClass}>Privacy</Link>
              <Link to="/" className={bottomLinkClass}>Terms</Link>
              <Link to="/" className={bottomLinkClass}>Sitemap</Link>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;