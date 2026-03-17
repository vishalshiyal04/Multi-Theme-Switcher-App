// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import PageContent from '../components/PageContent.tsx';
// import Button from '../components/Button.tsx';

// interface Product {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   category: string;
//   image: string;
//   rating: {
//     rate: number;
//     count: number;
//   };
// }

// const HomePage: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get<Product[]>('https://fakestoreapi.com/products?limit=6');
//         setProducts(response.data);
//       } catch (err) {
//         setError('Failed to fetch products. Please try again later.');
//         console.error('Error fetching products:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   return (
//     <PageContent title="Welcome to Plant Paradise!" products={products}>
//       <p className="text-lg mb-6">
//         Discover a wide variety of plants, seeds, and gardening supplies to bring your green dreams to life.
//         Whether you're a seasoned gardener or just starting, we have everything you need.
//       </p>
//       <Button>Explore Products</Button>
//       {loading && <p className="mt-4">Loading products...</p>}
//       {error && <p className="mt-4 text-red-500">{error}</p>}
//     </PageContent>
//   );
// };

// export default HomePage;


// import React, { useState, useEffect, useCallback } from 'react';
// import axios, { AxiosError } from 'axios';
// import PageContent from '../components/PageContent.tsx';
// import Button from '../components/Button.tsx';
// import { useTheme } from '../hooks/useTheme.ts';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Product {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   category: string;
//   image: string;
//   rating: {
//     rate: number;
//     count: number;
//   };
// }

// type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

// interface HeroStat {
//   value: string;
//   label: string;
//   icon: string;
// }

// // ─── Static Data ──────────────────────────────────────────────────────────────

// const HERO_STATS: HeroStat[] = [
//   { value: '500+', label: 'Plant Varieties', icon: '🌿' },
//   { value: '10K+', label: 'Happy Customers', icon: '😊' },
//   { value: '4.9★', label: 'Average Rating',  icon: '⭐' },
//   { value: 'Free', label: 'Shipping over 5000', icon: '🚚' },
// ];

// const CATEGORIES: string[] = [
//   'All',
//   'Indoor Plants',
//   'Outdoor Plants',
//   'Seeds',
//   'Tools',
//   'Planters',
// ];

// const API_URL = 'https://fakestoreapi.com/products?limit=6';

// // ─── Sub-components ───────────────────────────────────────────────────────────

// interface StatCardProps {
//   value: string;
//   label: string;
//   icon: string;
//   textClass: string;
//   cardClass: string;
// }

// const StatCard: React.FC<StatCardProps> = (props) => {
//   const value = props.value;
//   const label = props.label;
//   const icon = props.icon;
//   const textClass = props.textClass;
//   const cardClass = props.cardClass;

//   const wrapClass = 'flex flex-col items-center gap-1 p-4 rounded-xl text-center ' + cardClass;
//   const valueClass = 'text-xl font-bold tabular-nums ' + textClass;
//   const labelClass = 'text-xs opacity-50 ' + textClass;

//   return (
//     <div className={wrapClass}>
//       <span className="text-2xl" aria-hidden="true">{icon}</span>
//       <span className={valueClass}>{value}</span>
//       <span className={labelClass}>{label}</span>
//     </div>
//   );
// };

// interface CategoryChipProps {
//   label: string;
//   active: boolean;
//   onClick: () => void;
//   textClass: string;
//   cardClass: string;
//   activeClass: string;
// }

// const CategoryChip: React.FC<CategoryChipProps> = (props) => {
//   const label = props.label;
//   const active = props.active;
//   const onClick = props.onClick;
//   const textClass = props.textClass;
//   const cardClass = props.cardClass;
//   const activeClass = props.activeClass;

//   const base = 'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 ';
//   const cls = active
//     ? base + activeClass + ' text-white'
//     : base + cardClass + ' ' + textClass + ' opacity-60 hover:opacity-100';

//   return (
//     <button
//       onClick={onClick}
//       aria-pressed={active}
//       className={cls}
//     >
//       {label}
//     </button>
//   );
// };

// const ErrorBanner: React.FC<{ message: string; onRetry: () => void }> = (props) => {
//   const message = props.message;
//   const onRetry = props.onRetry;

//   return (
//     <div
//       role="alert"
//       className="flex items-center justify-between gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
//     >
//       <span>
//         <span aria-hidden="true">⚠ </span>
//         {message}
//       </span>
//       <Button variant="outline" size="sm" onClick={onRetry}>
//         Retry
//       </Button>
//     </div>
//   );
// };

// const SkeletonBanner: React.FC = () => (
//   <div className="animate-pulse rounded-2xl h-48 bg-white/10" aria-hidden="true" />
// );

// // ─── Page ─────────────────────────────────────────────────────────────────────

// const HomePage: React.FC = () => {
//   const { theme } = useTheme();
//   const text = theme.colors.text;
//   const cardBg = theme.colors.cardBg;
//   const primaryBg = theme.colors.primary;
//   const headingFont = theme.fonts && theme.fonts.heading ? theme.fonts.heading : '';

//   const [products, setProducts] = useState<Product[]>([]);
//   const [status, setStatus] = useState<FetchStatus>('idle');
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<string>('All');

//   const fetchProducts = useCallback(async () => {
//     setStatus('loading');
//     setError(null);
//     try {
//       const response = await axios.get<Product[]>(API_URL);
//       setProducts(response.data);
//       setStatus('success');
//     } catch (err) {
//       const axiosErr = err as AxiosError;
//       const msg = axiosErr.message
//         ? 'Failed to load products: ' + axiosErr.message
//         : 'Failed to load products. Please try again.';
//       setError(msg);
//       setStatus('error');
//       console.error('[HomePage] fetch error:', err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   const isLoading = status === 'loading' || status === 'idle';
//   const isError = status === 'error';

//   const introClass = 'text-base leading-relaxed opacity-70 max-w-2xl mb-6 ' + text;
//   const sectionHeadingClass = 'text-xl font-semibold mb-5 ' + text + ' ' + headingFont;
//   const heroBannerClass = 'rounded-2xl p-8 sm:p-12 mb-10 ' + cardBg;
//   const titleClass = 'text-3xl sm:text-4xl font-bold mb-3 ' + text + ' ' + headingFont;
//   const subtitleClass = 'text-base opacity-60 mb-6 max-w-lg ' + text;

//   return (
//     <PageContent
//       title=""
//       products={isError ? [] : products}
//       isLoading={isLoading}
//       useGridLayout={true}
//       selectedCategory={selectedCategory}
//       onCategorySelect={setSelectedCategory}
//     >

//       {/* ── Hero Banner ── */}
//       {isLoading ? (
//         <SkeletonBanner />
//       ) : (
//         <section aria-labelledby="hero-heading" className={heroBannerClass}>
//           <p className="text-4xl mb-4" aria-hidden="true">🌱</p>
//           <h1 id="hero-heading" className={titleClass}>
//             Welcome to Plant Paradise
//           </h1>
//           <p className={subtitleClass}>
//             Discover hundreds of plants, seeds, and gardening supplies.
//             Whether you are a seasoned gardener or just starting out, we have
//             everything you need to grow.
//           </p>
//           <div className="flex flex-wrap gap-3">
//             <Button variant="solid" size="md">
//               Shop Now
//             </Button>
//             <Button variant="outline" size="md">
//               Browse Categories
//             </Button>
//           </div>
//         </section>
//       )}

//       {/* ── Stats ── */}
//       <section aria-label="Key statistics" className="mb-10">
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           {HERO_STATS.map((stat) => (
//             <StatCard
//               key={stat.label}
//               value={stat.value}
//               label={stat.label}
//               icon={stat.icon}
//               textClass={text}
//               cardClass={cardBg}
//             />
//           ))}
//         </div>
//       </section>

//       {/* ── Category Filter ── */}
//       <section aria-label="Filter by category" className="mb-6">
//         <h2 className={sectionHeadingClass}>Featured Products</h2>
//         <div
//           role="group"
//           aria-label="Product categories"
//           className="flex flex-wrap gap-2 mb-6"
//         >
//           {CATEGORIES.map((cat) => (
//             <CategoryChip
//               key={cat}
//               label={cat}
//               active={selectedCategory === cat}
//               onClick={() => setSelectedCategory(cat)}
//               textClass={text}
//               cardClass={cardBg}
//               activeClass={primaryBg}
//             />
//           ))}
//         </div>
//       </section>

//       {/* ── Error Banner ── */}
//       {isError && error && (
//         <ErrorBanner message={error} onRetry={fetchProducts} />
//       )}

//       {/* ── Newsletter CTA ── */}
//       {!isLoading && !isError && (
//         <section
//           aria-labelledby="newsletter-heading"
//           className={'rounded-2xl p-8 text-center mt-10 ' + cardBg}
//         >
//           <p className="text-2xl mb-2" aria-hidden="true">💌</p>
//           <h2
//             id="newsletter-heading"
//             className={'text-lg font-semibold mb-1 ' + text + ' ' + headingFont}
//           >
//             Stay in the Loop
//           </h2>
//           <p className={'text-sm opacity-60 mb-5 ' + text}>
//             Get plant care tips, new arrivals, and exclusive deals straight to your inbox.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
//             <input
//               type="email"
//               placeholder="your@email.com"
//               aria-label="Email address for newsletter"
//               className={
//                 'flex-1 px-4 py-2.5 rounded-lg text-sm border outline-none ' +
//                 'focus:ring-2 focus:ring-offset-1 placeholder:opacity-40 ' +
//                 cardBg + ' ' + text + ' border-white/20'
//               }
//             />
//             <Button variant="solid" size="md">
//               Subscribe
//             </Button>
//           </div>
//         </section>
//       )}

//     </PageContent>
//   );
// };

// export default HomePage;

import React, { useState, useEffect, useCallback } from 'react';
import PageContent from '../components/PageContent.tsx';
import Button from '../components/Button.tsx';
import { useTheme } from '../hooks/useTheme.ts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

interface HeroStat {
  value: string;
  label: string;
  icon: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const HERO_STATS: HeroStat[] = [
  { value: '500+', label: 'Plant Varieties',   icon: '🌿' },
  { value: '10K+', label: 'Happy Customers',   icon: '😊' },
  { value: '4.9★', label: 'Average Rating',    icon: '⭐' },
  { value: 'Free', label: 'Shipping over ₹5000', icon: '🚚' },
];

const CATEGORIES: string[] = [
  'All',
  'Indoor Plants',
  'Outdoor Plants',
  'Seeds',
  'Tools',
  'Planters',
];

const PLANT_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Monstera Deliciosa',
    price: 1999,
    description:
      'The iconic Swiss Cheese Plant. Easy to care for, fast growing, and perfect for brightening any indoor space with its dramatic split leaves.',
    category: 'Indoor Plants',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop',
    rating: { rate: 4.8, count: 342 },
  },
  {
    id: 2,
    title: 'Snake Plant (Sansevieria)',
    price: 1499,
    description:
      'One of the most tolerant houseplants. Thrives in low light, purifies air, and needs watering only every 2–3 weeks. Perfect for beginners.',
    category: 'Indoor Plants',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=400&fit=crop',
    rating: { rate: 4.9, count: 521 },
  },
  {
    id: 3,
    title: 'Lavender Plant',
    price: 999,
    description:
      'Fragrant purple blooms that repel insects naturally. Perfect for garden borders, pots on patios, or sunny windowsills. Drought tolerant once established.',
    category: 'Outdoor Plants',
    image: 'https://images.unsplash.com/photo-1595351298020-038700609878?w=400&h=400&fit=crop',
    rating: { rate: 4.8, count: 412 },
  },
  {
    id: 4,
    title: 'Pothos Golden',
    price: 799,
    description:
      'The perfect trailing plant for shelves and hanging baskets. Nearly indestructible, thrives in any light condition, and propagates easily in water.',
    category: 'Indoor Plants',
    image: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&h=400&fit=crop',
    rating: { rate: 4.9, count: 634 },
  },
  {
    id: 5,
    title: 'Terracotta Pot Set (3pc)',
    price: 1599,
    description:
      'Classic handcrafted terracotta pots in three sizes (10cm, 15cm, 20cm). Excellent drainage, natural clay material promotes healthy root growth.',
    category: 'Planters',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
    rating: { rate: 4.7, count: 256 },
  },
  {
    id: 6,
    title: 'ZZ Plant',
    price: 1849,
    description:
      'Nearly impossible to kill. Thrives on neglect, tolerates low light and infrequent watering. Glossy dark green leaves add elegance to any space.',
    category: 'Indoor Plants',
    image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&h=400&fit=crop',
    rating: { rate: 4.8, count: 310 },
  },
  {
    id: 7,
    title: 'Sunflower Seeds Mix',
    price: 299,
    description:
      'Cheerful giant sunflowers in mixed varieties. Easy to grow from seed, attracts pollinators, and produces edible seeds. Great for kids and beginners.',
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&h=400&fit=crop',
    rating: { rate: 4.7, count: 223 },
  },
  {
    id: 8,
    title: 'Garden Pruning Shears',
    price: 1199,
    description:
      'Professional grade stainless steel bypass pruners. Ergonomic non-slip grip, sharp precision blade, and safety lock. Ideal for stems up to 20mm.',
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    rating: { rate: 4.6, count: 178 },
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  value: string;
  label: string;
  icon: string;
  textClass: string;
  cardClass: string;
}

const StatCard: React.FC<StatCardProps> = (props) => {
  const wrapClass = 'flex flex-col items-center gap-1 p-4 rounded-xl text-center ' + props.cardClass;
  const valueClass = 'text-xl font-bold tabular-nums ' + props.textClass;
  const labelClass = 'text-xs opacity-50 ' + props.textClass;

  return (
    <div className={wrapClass}>
      <span className="text-2xl" aria-hidden="true">{props.icon}</span>
      <span className={valueClass}>{props.value}</span>
      <span className={labelClass}>{props.label}</span>
    </div>
  );
};

interface CategoryChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  textClass: string;
  cardClass: string;
  activeClass: string;
}

const CategoryChip: React.FC<CategoryChipProps> = (props) => {
  const base =
    'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ' +
    'focus-visible:outline-none focus-visible:ring-2 ';
  const cls = props.active
    ? base + props.activeClass + ' text-white'
    : base + props.cardClass + ' ' + props.textClass + ' opacity-60 hover:opacity-100';

  return (
    <button onClick={props.onClick} aria-pressed={props.active} className={cls}>
      {props.label}
    </button>
  );
};

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = (props) => (
  <div
    role="alert"
    className="flex items-center justify-between gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
  >
    <span>
      <span aria-hidden="true">⚠ </span>
      {props.message}
    </span>
    <Button variant="outline" size="sm" onClick={props.onRetry}>
      Retry
    </Button>
  </div>
);

const SkeletonBanner: React.FC = () => (
  <div className="animate-pulse rounded-2xl h-48 bg-white/10" aria-hidden="true" />
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const text = theme.colors.text;
  const cardBg = theme.colors.cardBg;
  const primaryBg = theme.colors.primary;
  const headingFont =
    theme.fonts && theme.fonts.heading ? theme.fonts.heading : '';

  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const fetchProducts = useCallback(() => {
    setStatus('loading');
    setError(null);
    const timer = setTimeout(() => {
      setProducts(PLANT_PRODUCTS);
      setStatus('success');
    }, 600);
    return function cleanup() { clearTimeout(timer); };
  }, []);

  useEffect(() => {
    const cleanup = fetchProducts();
    return cleanup;
  }, [fetchProducts]);

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(function(p) { return p.category === selectedCategory; });

  const isLoading = status === 'loading' || status === 'idle';
  const isError = status === 'error';

  const heroBannerClass = 'rounded-2xl p-8 sm:p-12 mb-10 ' + cardBg;
  const titleClass = 'text-3xl sm:text-4xl font-bold mb-3 ' + text + ' ' + headingFont;
  const subtitleClass = 'text-base opacity-60 mb-6 max-w-lg ' + text;
  const sectionHeadingClass = 'text-xl font-semibold mb-5 ' + text + ' ' + headingFont;
  const newsletterHeadingClass = 'text-lg font-semibold mb-1 ' + text + ' ' + headingFont;
  const newsletterTextClass = 'text-sm opacity-60 mb-5 ' + text;
  const newsletterSectionClass = 'rounded-2xl p-8 text-center mt-10 ' + cardBg;
  const inputClass =
    'flex-1 px-4 py-2.5 rounded-lg text-sm border outline-none ' +
    'focus:ring-2 focus:ring-offset-1 placeholder:opacity-40 ' +
    cardBg + ' ' + text + ' border-white/20';

  return (
    <PageContent
      title=""
      products={isError ? [] : filteredProducts}
      isLoading={isLoading}
      useGridLayout={true}
      selectedCategory={selectedCategory}
      onCategorySelect={setSelectedCategory}
    >

      {/* ── Hero Banner ── */}
      {isLoading ? (
        <SkeletonBanner />
      ) : (
        <section aria-labelledby="hero-heading" className={heroBannerClass}>
          <p className="text-4xl mb-4" aria-hidden="true">🌱</p>
          <h1 id="hero-heading" className={titleClass}>
            Welcome to Plant Paradise
          </h1>
          <p className={subtitleClass}>
            Discover hundreds of plants, seeds, and gardening supplies.
            Whether you are a seasoned gardener or just starting out, we have
            everything you need to grow.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="solid" size="md">Shop Now</Button>
            <Button variant="outline" size="md">Browse Categories</Button>
          </div>
        </section>
      )}

      {/* ── Stats ── */}
      <section aria-label="Key statistics" className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HERO_STATS.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              textClass={text}
              cardClass={cardBg}
            />
          ))}
        </div>
      </section>

      {/* ── Category Filter ── */}
      <section aria-label="Filter by category" className="mb-6">
        <h2 className={sectionHeadingClass}>Featured Products</h2>
        <div role="group" aria-label="Product categories" className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              textClass={text}
              cardClass={cardBg}
              activeClass={primaryBg}
            />
          ))}
        </div>
      </section>

      {/* ── Error Banner ── */}
      {isError && error && (
        <ErrorBanner message={error} onRetry={fetchProducts} />
      )}

      {/* ── Newsletter CTA ── */}
      {!isLoading && !isError && (
        <section aria-labelledby="newsletter-heading" className={newsletterSectionClass}>
          <p className="text-2xl mb-2" aria-hidden="true">💌</p>
          <h2 id="newsletter-heading" className={newsletterHeadingClass}>
            Stay in the Loop
          </h2>
          <p className={newsletterTextClass}>
            Get plant care tips, new arrivals, and exclusive deals straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address for newsletter"
              className={inputClass}
            />
            <Button variant="solid" size="md">Subscribe</Button>
          </div>
        </section>
      )}

    </PageContent>
  );
};

export default HomePage;