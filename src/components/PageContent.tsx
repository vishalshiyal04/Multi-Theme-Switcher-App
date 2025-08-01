import React, { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme.ts';
import ProductCard from './ProductCard.tsx';
import ProductListItem from './ProductListItem.tsx';

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

const PageContent: React.FC<{ title: string; children?: ReactNode; products?: Product[] }> = ({ title, children, products }) => {
  const { theme } = useTheme();

  const renderProducts = () => {
    if (!products || products.length === 0) return <p className={`${theme.colors.text} opacity-80`}>No products to display.</p>;

    if (theme.name === 'Theme 3') {
      return (
        <div className={`${theme.layout.cardGrid} ${theme.spacing.gap}`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      );
    } else {
      return (
        <div className={`flex flex-col ${theme.spacing.gap}`}>
          {products.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className={`min-h-[calc(100vh-6rem)] ${theme.transition} pt-16`}>
      {theme.name === 'Theme 2' ? (
        <div className={`${theme.layout.container}`}>
          <div className={`${theme.layout.sidebar} ${theme.colors.cardBg} shadow-md ${theme.transition}`}>
            <h2 className={`text-xl font-bold ${theme.colors.text} mb-4 ${theme.fonts.heading}`}>Categories</h2>
            <ul className="space-y-2">
              <li className={`${theme.colors.text} opacity-80 hover:opacity-100 cursor-pointer ${theme.transition}`}>Plants</li>
              <li className={`${theme.colors.text} opacity-80 hover:opacity-100 cursor-pointer ${theme.transition}`}>Seeds</li>
              <li className={`${theme.colors.text} opacity-80 hover:opacity-100 cursor-pointer ${theme.transition}`}>Tools</li>
              <li className={`${theme.colors.text} opacity-80 hover:opacity-100 cursor-pointer ${theme.transition}`}>Planters</li>
            </ul>
          </div>
          <main className={`${theme.layout.contentArea} ${theme.colors.background} ${theme.transition}`}>
            <h1 className={`text-3xl font-bold ${theme.colors.text} ${theme.spacing.margin} ${theme.fonts.heading}`}>{title}</h1>
            {children}
            {products && (
              <div className={`mt-8 ${theme.spacing.margin}`}>
                <h2 className={`text-2xl font-semibold ${theme.colors.text} ${theme.spacing.margin} ${theme.fonts.heading}`}>Featured Products</h2>
                {renderProducts()}
              </div>
            )}
          </main>
        </div>
      ) : (
        <main className={`${theme.layout.container} ${theme.colors.background} ${theme.transition}`}>
          <div className={`${theme.layout.contentArea}`}>
            <h1 className={`text-3xl font-bold ${theme.colors.text} ${theme.spacing.margin} ${theme.fonts.heading}`}>{title}</h1>
            {children}
            {products && (
              <div className={`mt-8 ${theme.spacing.margin}`}>
                <h2 className={`text-2xl font-semibold ${theme.colors.text} ${theme.spacing.margin} ${theme.fonts.heading}`}>Featured Products</h2>
                {renderProducts()}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
};

export default PageContent;
