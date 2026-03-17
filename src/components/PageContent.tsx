// import React, { ReactNode } from 'react';
// import { useTheme } from '../hooks/useTheme.ts';
// import ProductCard from './ProductCard.tsx';
// import ProductListItem from './ProductListItem.tsx';

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

// const PageContent: React.FC<{ title: string; children?: ReactNode; products?: Product[] }> = ({ title, children, products }) => {
//   const { theme } = useTheme();

//   const renderProducts = () => {
//     if (!products || products.length === 0) return <p className={`${theme.colors.text} opacity-80`}>No products to display.</p>;

//     if (theme.name === 'Theme 3') {
//       return (
//         <div className={`${theme.layout.cardGrid} ${theme.spacing.gap}`}>
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       );
//     } else {
//       return (
//         <div className={`flex flex-col ${theme.spacing.gap}`}>
//           {products.map((product) => (
//             <ProductListItem key={product.id} product={product} />
//           ))}
//         </div>
//       );
//     }
//   };

//   return (
//     <div className={`min-h-[calc(100vh-6rem)] ${theme.transition} pt-16`}>
//       {theme.name === 'Theme 2' ? (
//         <div className={`${theme.layout.container}`}>
//           <div className={`${theme.layout.sidebar} ${theme.colors.cardBg} shadow-md ${theme.transition}`}>
//             <h2 className={`text-xl font-bold ${theme.colors.text} mb-4 ${theme.fonts.heading}`}>Categories</h2>
//             <ul className="space-y-2">
//               <li className={`${theme.colors.text} opacity-80 hover:opacity-100 cursor-pointer ${theme.transition}`}>Plants</li>
//               <li className={`${theme.colors.text} opacity-80 hover:opacity-100 cursor-pointer ${theme.transition}`}>Seeds</li>
//               <li className={`${theme.colors.text} opacity-80 hover:opacity-100 cursor-pointer ${theme.transition}`}>Tools</li>
//               <li className={`${theme.colors.text} opacity-80 hover:opacity-100 cursor-pointer ${theme.transition}`}>Planters</li>
//             </ul>
//           </div>
//           <main className={`${theme.layout.contentArea} ${theme.colors.background} ${theme.transition}`}>
//             <h1 className={`text-3xl font-bold ${theme.colors.text} ${theme.spacing.margin} ${theme.fonts.heading}`}>{title}</h1>
//             {children}
//             {products && (
//               <div className={`mt-8 ${theme.spacing.margin}`}>
//                 <h2 className={`text-2xl font-semibold ${theme.colors.text} ${theme.spacing.margin} ${theme.fonts.heading}`}>Featured Products</h2>
//                 {renderProducts()}
//               </div>
//             )}
//           </main>
//         </div>
//       ) : (
//         <main className={`${theme.layout.container} ${theme.colors.background} ${theme.transition}`}>
//           <div className={`${theme.layout.contentArea}`}>
//             <h1 className={`text-3xl font-bold ${theme.colors.text} ${theme.spacing.margin} ${theme.fonts.heading}`}>{title}</h1>
//             {children}
//             {products && (
//               <div className={`mt-8 ${theme.spacing.margin}`}>
//                 <h2 className={`text-2xl font-semibold ${theme.colors.text} ${theme.spacing.margin} ${theme.fonts.heading}`}>Featured Products</h2>
//                 {renderProducts()}
//               </div>
//             )}
//           </div>
//         </main>
//       )}
//     </div>
//   );
// };

// export default PageContent;

import React, { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme.ts';
import ProductCard from './ProductCard.tsx';
import ProductListItem from './ProductListItem.tsx';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

interface PageContentProps {
  title: string;
  children?: ReactNode;
  products?: Product[];
  showSidebar?: boolean;        // explicit prop instead of theme.name string check
  useGridLayout?: boolean;      // explicit prop instead of theme.name string check
  categories?: string[];        // configurable instead of hardcoded
  onCategorySelect?: (category: string) => void;
  selectedCategory?: string;
  isLoading?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const EmptyState: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-16 gap-3 ${className}`}>
    <span className="text-4xl" aria-hidden="true">🌿</span>
    <p className="text-sm font-medium opacity-60">No products to display.</p>
  </div>
);

const SkeletonCard: React.FC = () => (
  <div className="rounded-xl bg-white/10 animate-pulse h-64 w-full" aria-hidden="true" />
);

const Sidebar: React.FC<{
  categories: string[];
  selected?: string;
  onSelect?: (cat: string) => void;
  className?: string;
  textClass?: string;
  bgClass?: string;
}> = ({ categories, selected, onSelect, className = '', textClass = '', bgClass = '' }) => (
  <aside
    aria-label="Product categories"
    className={`shrink-0 w-56 rounded-xl p-5 shadow-sm self-start sticky top-20 ${bgClass} ${className}`}
  >
    <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 opacity-60 ${textClass}`}>
      Categories
    </h2>
    <ul role="list" className="space-y-1">
      {categories.map((cat) => {
        const active = selected === cat;
        return (
          <li key={cat}>
            <button
              onClick={() => onSelect?.(cat)}
              aria-pressed={active}
              className={[
                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium',
                'transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                textClass,
                active
                  ? 'bg-white/20 font-semibold opacity-100'
                  : 'opacity-60 hover:opacity-100 hover:bg-white/10',
              ].join(' ')}
            >
              {cat}
            </button>
          </li>
        );
      })}
    </ul>
  </aside>
);

const ProductGrid: React.FC<{ products: Product[]; isGrid: boolean; gap: string }> = ({
  products,
  isGrid,
  gap,
}) => (
  <div
    role="list"
    aria-label="Product list"
    className={isGrid ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gap}` : `flex flex-col ${gap}`}
  >
    {products.map((product) =>
      isGrid ? (
        <div role="listitem" key={product.id}>
          <ProductCard product={product} />
        </div>
      ) : (
        <div role="listitem" key={product.id}>
          <ProductListItem product={product} />
        </div>
      )
    )}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = ['All', 'Plants', 'Seeds', 'Tools', 'Planters'];

const PageContent: React.FC<PageContentProps> = ({
  title,
  children,
  products,
  showSidebar = false,
  useGridLayout = false,
  categories = DEFAULT_CATEGORIES,
  onCategorySelect,
  selectedCategory,
  isLoading = false,
}) => {
  const { theme } = useTheme();

  const renderProducts = () => {
    if (isLoading) {
      return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`} aria-busy="true" aria-label="Loading products">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }
    if (!products || products.length === 0) return <EmptyState />;
    return <ProductGrid products={products} isGrid={useGridLayout} gap={theme.spacing?.gap ?? 'gap-4'} />;
  };

  const mainContent = (
    <main
      id="main-content"
      className={`flex-1 min-w-0 ${theme.colors.background} ${theme.transition}`}
    >
      {/* Page header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold tracking-tight ${theme.colors.text} ${theme.fonts?.heading ?? ''}`}>
          {title}
        </h1>
        {products && (
          <p className={`mt-1 text-sm opacity-50 ${theme.colors.text}`}>
            {isLoading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      {/* Slot for arbitrary page content */}
      {children && <div className="mb-8">{children}</div>}

      {/* Products section */}
      {(products !== undefined || isLoading) && (
        <section aria-labelledby="products-heading">
          <h2
            id="products-heading"
            className={`text-xl font-semibold ${theme.colors.text} ${theme.fonts?.heading ?? ''} mb-5`}
          >
            Featured Products
          </h2>
          {renderProducts()}
        </section>
      )}
    </main>
  );

  return (
    <div
      className={[
        'min-h-[calc(100vh-4rem)] pt-16',
        theme.colors.background,
        theme.transition,
      ].join(' ')}
    >
      {/* Skip-to-content for keyboard users */}
      
        < a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-white focus:text-black focus:shadow-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <div
        className={[
          theme.layout?.container ?? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
          showSidebar ? 'flex gap-8 items-start' : '',
        ].join(' ')}
      >
        {showSidebar && (
          <Sidebar
            categories={categories}
            selected={selectedCategory}
            onSelect={onCategorySelect}
            bgClass={theme.colors.cardBg}
            textClass={theme.colors.text}
          />
        )}
        {mainContent}
      </div>
    </div>
  );
};

export default PageContent;