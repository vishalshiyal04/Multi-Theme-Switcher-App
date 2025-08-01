import React from 'react';
import Button from './Button.tsx';
import { useTheme } from '../hooks/useTheme.ts';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme.layout.cardBase} ${theme.colors.cardBg} ${theme.transition}`}>
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover rounded-t-xl"
        onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/000000?text=No+Image')}
      />
      <div className="p-4">
        <h3 className={`text-lg font-semibold ${theme.colors.text} ${theme.fonts.heading}`}>{product.title}</h3>
        <p className={`text-sm ${theme.colors.text} opacity-80 mt-1`}>${product.price.toFixed(2)}</p>
        <p className={`text-xs ${theme.colors.text} opacity-70 mt-2 line-clamp-3`}>{product.description}</p>
        <div className="mt-4">
          <Button>View Details</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
