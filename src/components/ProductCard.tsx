// import React from 'react';
// import Button from './Button.tsx';
// import { useTheme } from '../hooks/useTheme.ts';

// interface Product {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   image: string;
// }

// const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
//   const { theme } = useTheme();

//   return (
//     <div className={`${theme.layout.cardBase} ${theme.colors.cardBg} ${theme.transition}`}>
//       <img
//         src={product.image}
//         alt={product.title}
//         className="w-full h-48 object-cover rounded-t-xl"
//         onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/000000?text=No+Image')}
//       />
//       <div className="p-4">
//         <h3 className={`text-lg font-semibold ${theme.colors.text} ${theme.fonts.heading}`}>{product.title}</h3>
//         <p className={`text-sm ${theme.colors.text} opacity-80 mt-1`}>${product.price.toFixed(2)}</p>
//         <p className={`text-xs ${theme.colors.text} opacity-70 mt-2 line-clamp-3`}>{product.description}</p>
//         <div className="mt-4">
//           <Button>View Details</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import React, { useState } from 'react';
import Button from './Button.tsx';
import { useTheme } from '../hooks/useTheme.ts';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category?: string;
  rating?: {
    rate: number;
    count: number;
  };
  originalPrice?: number;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  badge?: string;
  priority?: boolean;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StarRatingProps {
  rate: number;
  count: number;
  textClass: string;
}

const StarRating: React.FC<StarRatingProps> = (props) => {
  const rate = props.rate;
  const count = props.count;
  const textClass = props.textClass;

  const full = Math.floor(rate);
  const half = rate % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const ariaLabel = 'Rated ' + rate + ' out of 5, ' + count + ' reviews';
  const countClass = 'text-xs opacity-50 tabular-nums ' + textClass;
  const emptyClass = 'text-xs opacity-20 ' + textClass;

  return (
    <div className="flex items-center gap-1.5" aria-label={ariaLabel}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: full }).map(function(_, i) {
          return <span key={'f' + i} className="text-amber-400 text-xs">★</span>;
        })}
        {half && <span className="text-amber-400 text-xs opacity-60">★</span>}
        {Array.from({ length: empty }).map(function(_, i) {
          return <span key={'e' + i} className={emptyClass}>★</span>;
        })}
      </span>
      <span className={countClass}>({count})</span>
    </div>
  );
};

const ImageSkeleton: React.FC = () => (
  <div className="w-full h-48 bg-white/10 animate-pulse rounded-t-xl" aria-hidden="true" />
);

interface DiscountBadgeProps {
  original: number;
  current: number;
}

const DiscountBadge: React.FC<DiscountBadgeProps> = (props) => {
  const pct = Math.round(((props.original - props.current) / props.original) * 100);
  if (pct <= 0) return null;
  return (
    <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-red-500/15 text-red-500">
      -{pct}%
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const product = props.product;
  const onViewDetails = props.onViewDetails;
  const onAddToCart = props.onAddToCart;
  const onWishlist = props.onWishlist;
  const isWishlisted = props.isWishlisted || false;
  const badge = props.badge;
  const priority = props.priority || false;

  const { theme } = useTheme();
  const text = theme.colors.text;
  const cardBg = theme.colors.cardBg;

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [addedToCart, setAddedToCart] = useState(false);

  const inStock = product.inStock !== false;

  const handleAddToCart = () => {
    if (!inStock) return;
    if (onAddToCart) onAddToCart(product);
    setAddedToCart(true);
    setTimeout(function() { setAddedToCart(false); }, 2000);
  };

  const handleWishlist = () => {
    setWishlisted(function(w) { return !w; });
    if (onWishlist) onWishlist(product);
  };

  const handleViewDetails = () => {
    if (onViewDetails) onViewDetails(product);
  };

  // ── Pre-computed values (Babel-safe) ──────────────────────────────────────
  const imgSrc = imgError
    ? 'https://placehold.co/400x300/d1fae5/16a34a?text=🌿'
    : product.image;

  const imgLoadingAttr = priority ? 'eager' : 'lazy';

  const imgClass =
    'w-full h-48 object-cover rounded-t-xl ' +
    'transition-all duration-300 group-hover:scale-105 ' +
    'motion-reduce:group-hover:scale-100 ' +
    (imgLoaded ? 'opacity-100' : 'opacity-0');

  const wishLabel = wishlisted ? 'Remove from wishlist' : 'Add to wishlist';
  const wishIcon = wishlisted ? '♥' : '♡';
  const wishIconClass = 'text-sm transition-colors ' + (wishlisted ? 'text-red-500' : 'text-gray-400');

  const articleClass =
    'group relative flex flex-col rounded-xl overflow-hidden ' +
    'transition-all duration-200 ease-out ' +
    'hover:-translate-y-1 hover:shadow-xl ' +
    'focus-within:ring-2 focus-within:ring-offset-2 ' +
    'motion-reduce:hover:translate-y-0 motion-reduce:transition-none ' +
    (theme.layout && theme.layout.cardBase ? theme.layout.cardBase + ' ' : '') +
    cardBg + ' ' + theme.transition;

  const titleClass =
    'text-sm font-semibold leading-snug line-clamp-2 ' + text + ' ' +
    (theme.fonts && theme.fonts.heading ? theme.fonts.heading : '');

  const descClass = 'text-xs leading-relaxed line-clamp-2 opacity-60 ' + text;
  const priceClass = 'text-lg font-bold tabular-nums ' + text;
  const origPriceClass = 'text-xs line-through opacity-40 tabular-nums ' + text;
  const priceAriaLabel = 'Price: ' + formatINR(product.price);

  const cartText = !inStock ? 'Out of Stock' : addedToCart ? '✓ Added' : 'Add to Cart';
  const cartLabel = !inStock
    ? 'Out of stock'
    : addedToCart
    ? 'Added to cart'
    : 'Add ' + product.title + ' to cart';

  return (
    <article aria-label={product.title} className={articleClass}>

      {/* ── Badge ── */}
      {badge && (
        <span
          aria-label={'Badge: ' + badge}
          className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-sm"
        >
          {badge}
        </span>
      )}

      {/* ── Wishlist button ── */}
      <button
        aria-label={wishLabel}
        aria-pressed={wishlisted}
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-150 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 motion-reduce:hover:scale-100"
      >
        <span className={wishIconClass} aria-hidden="true">{wishIcon}</span>
      </button>

      {/* ── Image ── */}
      <div className="relative w-full h-48 overflow-hidden bg-white/5">
        {!imgLoaded && !imgError && <ImageSkeleton />}
        <img
          src={imgSrc}
          alt={product.title}
          loading={imgLoadingAttr}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          className={imgClass}
        />
        {product.category && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-xs font-medium bg-black/40 text-white backdrop-blur-sm capitalize">
            {product.category}
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold px-2 py-1 rounded-lg bg-black/40">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-2">

        <h3 title={product.title} className={titleClass}>
          {product.title}
        </h3>

        {product.rating && (
          <StarRating
            rate={product.rating.rate}
            count={product.rating.count}
            textClass={text}
          />
        )}

        <p className={descClass}>{product.description}</p>

        {/* ── Price + Actions ── */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">

          {/* Price block */}
          <div className="flex flex-col gap-0.5">
            {product.originalPrice && (
              <div className="flex items-center gap-1.5">
                <span className={origPriceClass}>
                  {formatINR(product.originalPrice)}
                </span>
                <DiscountBadge
                  original={product.originalPrice}
                  current={product.price}
                />
              </div>
            )}
            <span className={priceClass} aria-label={priceAriaLabel}>
              {formatINR(product.price)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleViewDetails}
              aria-label={'View details for ' + product.title}
            >
              Details
            </Button>
            <Button
              size="sm"
              variant="solid"
              disabled={!inStock}
              onClick={handleAddToCart}
              aria-label={cartLabel}
            >
              {cartText}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;