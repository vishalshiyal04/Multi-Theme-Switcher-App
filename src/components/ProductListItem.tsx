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

const ProductListItem: React.FC<{ product: Product }> = ({ product }) => {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center ${theme.spacing.padding} ${theme.colors.cardBg} rounded-lg shadow-sm ${theme.transition}`}>
      <img
        src={product.image}
        alt={product.title}
        className="w-20 h-20 object-cover rounded-md mr-4"
        onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80/e0e0e0/000000?text=No+Image')}
      />
      <div className="flex-1">
        <h3 className={`text-lg font-semibold ${theme.colors.text} ${theme.fonts.heading}`}>{product.title}</h3>
        <p className={`text-sm ${theme.colors.text} opacity-80 mt-1`}>${product.price.toFixed(2)}</p>
      </div>
      <Button>Add to Cart</Button>
    </div>
  );
};

export default ProductListItem;
