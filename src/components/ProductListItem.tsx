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

// const ProductListItem: React.FC<{ product: Product }> = ({ product }) => {
//   const { theme } = useTheme();

//   return (
//     <div className={`flex items-center ${theme.spacing.padding} ${theme.colors.cardBg} rounded-lg shadow-sm ${theme.transition}`}>
//       <img
//         src={product.image}
//         alt={product.title}
//         className="w-20 h-20 object-cover rounded-md mr-4"
//         onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80/e0e0e0/000000?text=No+Image')}
//       />
//       <div className="flex-1">
//         <h3 className={`text-lg font-semibold ${theme.colors.text} ${theme.fonts.heading}`}>{product.title}</h3>
//         <p className={`text-sm ${theme.colors.text} opacity-80 mt-1`}>${product.price.toFixed(2)}</p>
//       </div>
//       <Button>Add to Cart</Button>
//     </div>
//   );
// };

// export default ProductListItem;

// import React, { useState } from 'react';
// import Button from './Button.tsx';
// import { useTheme } from '../hooks/useTheme.ts';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface Product {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   image: string;
//   category?: string;
//   rating?: {
//     rate: number;
//     count: number;
//   };
//   originalPrice?: number; // for discount display
//   inStock?: boolean;
// }

// interface ProductListItemProps {
//   product: Product;
//   onAddToCart?: (product: Product) => void;
//   onViewDetails?: (product: Product) => void;
//   onWishlist?: (product: Product) => void;
//   isWishlisted?: boolean;
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const StarRating: React.FC<{ rate: number; count: number; textClass: string }> = ({
//   rate,
//   count,
//   textClass,
// }) => (
//   <div
//     className="flex items-center gap-1"
//     aria-label={`Rated ${rate} out of 5, ${count} reviews`}
//   >
//     <span className="text-amber-400 text-xs" aria-hidden="true">
//       {'★'.repeat(Math.floor(rate))}
//       {rate % 1 >= 0.5 ? '½' : ''}
//     </span>
//     <span className={`text-xs opacity-50 tabular-nums ${textClass}`}>
//       {rate.toFixed(1)} ({count})
//     </span>
//   </div>
// );

// const DiscountBadge: React.FC<{ original: number; current: number }> = ({
//   original,
//   current,
// }) => {
//   const pct = Math.round(((original - current) / original) * 100);
//   if (pct <= 0) return null;
//   return (
//     <span
//       aria-label={`${pct}% off`}
//       className="px-1.5 py-0.5 rounded text-xs font-semibold bg-red-500/15 text-red-500"
//     >
//       -{pct}%
//     </span>
//   );
// };

// const ImageSkeleton: React.FC = () => (
//   <div
//     className="w-20 h-20 rounded-lg bg-white/10 animate-pulse shrink-0"
//     aria-hidden="true"
//   />
// );

// // ─── Main Component ───────────────────────────────────────────────────────────

// const ProductListItem: React.FC<ProductListItemProps> = ({
//   product,
//   onAddToCart,
//   onViewDetails,
//   onWishlist,
//   isWishlisted = false,
// }) => {
//   const { theme } = useTheme();
//   const [imgLoaded, setImgLoaded] = useState(false);
//   const [imgError, setImgError] = useState(false);
//   const [wishlisted, setWishlisted] = useState(isWishlisted);
//   const [addedToCart, setAddedToCart] = useState(false);

//   const inStock = product.inStock ?? true;

//   const handleAddToCart = () => {
//     if (!inStock) return;
//     onAddToCart?.(product);
//     setAddedToCart(true);
//     setTimeout(() => setAddedToCart(false), 2000);
//   };

//   const handleWishlist = () => {
//     setWishlisted((w) => !w);
//     onWishlist?.(product);
//   };

//   return (
//     <article
//       aria-label={product.title}
//       className={[
//         'group flex items-start sm:items-center gap-4',
//         'rounded-xl p-3 sm:p-4',
//         'transition-all duration-200 ease-out',
//         'hover:shadow-md hover:-translate-y-0.5',
//         'focus-within:ring-2 focus-within:ring-offset-1',
//         'motion-reduce:hover:translate-y-0 motion-reduce:transition-none',
//         theme.colors.cardBg,
//         theme.transition,
//       ].join(' ')}
//     >
//       {/* ── Image ── */}
//       <div className="relative shrink-0">
//         {!imgLoaded && !imgError && <ImageSkeleton />}
//         <img
//           src={
//             imgError
//               ? 'https://placehold.co/80x80/e0e0e0/999999?text=No+Image'
//               : product.image
//           }
//           alt={product.title}
//           loading="lazy"
//           decoding="async"
//           onLoad={() => setImgLoaded(true)}
//           onError={() => { setImgError(true); setImgLoaded(true); }}
//           className={[
//             'w-20 h-20 object-cover rounded-lg',
//             'transition-all duration-300',
//             'group-hover:scale-105 motion-reduce:group-hover:scale-100',
//             imgLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0',
//           ].join(' ')}
//         />

//         {/* Out of stock overlay */}
//         {!inStock && (
//           <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center">
//             <span className="text-white text-[10px] font-semibold text-center leading-tight px-1">
//               Out of<br />Stock
//             </span>
//           </div>
//         )}
//       </div>

//       {/* ── Content ── */}
//       <div className="flex-1 min-w-0 flex flex-col gap-1">

//         {/* Title + category */}
//         <div className="flex items-start justify-between gap-2">
//           <h3
//             title={product.title}
//             className={[
//               'text-sm font-semibold leading-snug line-clamp-2',
//               theme.colors.text,
//               theme.fonts?.heading ?? '',
//             ].join(' ')}
//           >
//             {product.title}
//           </h3>

//           {/* Wishlist — visible on hover or focus */}
//           <button
//             aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
//             aria-pressed={wishlisted}
//             onClick={handleWishlist}
//             className={[
//               'shrink-0 w-7 h-7 flex items-center justify-center rounded-full',
//               'transition-all duration-150',
//               'hover:scale-110 active:scale-95',
//               'focus-visible:outline-none focus-visible:ring-2',
//               'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
//               'motion-reduce:hover:scale-100',
//               'bg-white/10',
//             ].join(' ')}
//           >
//             <span
//               className={`text-sm transition-colors ${wishlisted ? 'text-red-500' : 'opacity-40'}`}
//               aria-hidden="true"
//             >
//               {wishlisted ? '♥' : '♡'}
//             </span>
//           </button>
//         </div>

//         {/* Category chip */}
//         {product.category && (
//           <span className={`text-xs opacity-50 capitalize ${theme.colors.text}`}>
//             {product.category}
//           </span>
//         )}

//         {/* Rating */}
//         {product.rating && (
//           <StarRating
//             rate={product.rating.rate}
//             count={product.rating.count}
//             textClass={theme.colors.text}
//           />
//         )}
//       </div>

//       {/* ── Price + Actions ── */}
//       <div className="shrink-0 flex flex-col items-end gap-2 ml-auto">

//         {/* Price row */}
//         <div className="flex items-center gap-2 flex-wrap justify-end">
//           {product.originalPrice && (
//             <span className={`text-xs line-through opacity-40 tabular-nums ${theme.colors.text}`}>
//               ${product.originalPrice.toFixed(2)}
//             </span>
//           )}
//           <span
//             className={`text-base font-bold tabular-nums ${theme.colors.text}`}
//             aria-label={`Price: $${product.price.toFixed(2)}`}
//           >
//             ${product.price.toFixed(2)}
//           </span>
//           {product.originalPrice && (
//             <DiscountBadge original={product.originalPrice} current={product.price} />
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-2">
//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => onViewDetails?.(product)}
//             aria-label={`View details for ${product.title}`}
//           >
//             Details
//           </Button>
//           <Button
//             size="sm"
//             variant="solid"
//             disabled={!inStock}
//             onClick={handleAddToCart}
//             aria-label={
//               !inStock
//                 ? 'Out of stock'
//                 : addedToCart
//                 ? 'Added to cart'
//                 : `Add ${product.title} to cart`
//             }
//           >
//             {!inStock ? 'Out of Stock' : addedToCart ? '✓ Added' : 'Add to Cart'}
//           </Button>
//         </div>
//       </div>
//     </article>
//   );
// };

// export default ProductListItem;

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
  careLevel?: 'Easy' | 'Moderate' | 'Expert';
  light?: 'Low' | 'Medium' | 'Bright';
  watering?: 'Low' | 'Medium' | 'High';
}

interface ProductListItemProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

// ─── Static Maps ─────────────────────────────────────────────────────────────

const CARE_COLOR: Record<string, string> = {
  Easy:     'bg-green-500/15 text-green-600',
  Moderate: 'bg-yellow-500/15 text-yellow-600',
  Expert:   'bg-red-500/15 text-red-500',
};

const LIGHT_ICON: Record<string, string> = {
  Low:    '🌑',
  Medium: '🌤',
  Bright: '☀️',
};

const WATER_ICON: Record<string, string> = {
  Low:    '💧',
  Medium: '💧💧',
  High:   '💧💧💧',
};

const CATEGORY_ICON: Record<string, string> = {
  'indoor plants':  '🪴',
  'outdoor plants': '🌳',
  'seeds':          '🌱',
  'tools':          '🛠',
  'planters':       '🏺',
};

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
  const stars = '★'.repeat(full) + (rate % 1 >= 0.5 ? '½' : '');
  const labelText = 'Rated ' + rate + ' out of 5, ' + count + ' reviews';
  const countClass = 'text-xs opacity-50 tabular-nums ' + textClass;

  return (
    <div className="flex items-center gap-1" aria-label={labelText}>
      <span className="text-amber-400 text-xs" aria-hidden="true">{stars}</span>
      <span className={countClass}>{rate.toFixed(1)} ({count})</span>
    </div>
  );
};

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

const ImageSkeleton: React.FC = () => (
  <div className="w-24 h-24 rounded-xl bg-white/10 animate-pulse shrink-0" aria-hidden="true" />
);

interface CareBadgeProps {
  careLevel: string;
}

const CareBadge: React.FC<CareBadgeProps> = (props) => {
  const color = CARE_COLOR[props.careLevel] || 'bg-gray-500/15 text-gray-500';
  const cls = 'px-2 py-0.5 rounded-full text-xs font-medium ' + color;
  return (
    <span className={cls} aria-label={'Care level: ' + props.careLevel}>
      {props.careLevel} Care
    </span>
  );
};

interface PlantTraitsProps {
  light?: string;
  watering?: string;
  textClass: string;
}

const PlantTraits: React.FC<PlantTraitsProps> = (props) => {
  const light = props.light;
  const watering = props.watering;
  const textClass = props.textClass;
  const traitClass = 'flex items-center gap-1 text-xs opacity-60 ' + textClass;

  if (!light && !watering) return null;

  return (
    <div className="flex items-center gap-3">
      {light && (
        <span className={traitClass} aria-label={'Light: ' + light}>
          {LIGHT_ICON[light] || '🌤'} {light}
        </span>
      )}
      {watering && (
        <span className={traitClass} aria-label={'Watering: ' + watering}>
          {WATER_ICON[watering] || '💧'} Water
        </span>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ProductListItem: React.FC<ProductListItemProps> = (props) => {
  const product = props.product;
  const onAddToCart = props.onAddToCart;
  const onViewDetails = props.onViewDetails;
  const onWishlist = props.onWishlist;
  const isWishlisted = props.isWishlisted || false;

  const { theme } = useTheme();
  const text = theme.colors.text;
  const cardBg = theme.colors.cardBg;

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [addedToCart, setAddedToCart] = useState(false);

  const inStock = product.inStock !== false;
  const categoryKey = product.category ? product.category.toLowerCase() : '';
  const categoryIcon = CATEGORY_ICON[categoryKey] || '🌿';

  const handleAddToCart = () => {
    if (!inStock) return;
    if (onAddToCart) onAddToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    setWishlisted(function(w) { return !w; });
    if (onWishlist) onWishlist(product);
  };

  const handleViewDetails = () => {
    if (onViewDetails) onViewDetails(product);
  };

  // ── Pre-computed values (Babel-safe) ──────────────────────────────────────

  const articleClass =
    'group flex items-start sm:items-center gap-4 ' +
    'rounded-xl p-3 sm:p-4 ' +
    'transition-all duration-200 ease-out ' +
    'hover:shadow-lg hover:-translate-y-0.5 ' +
    'focus-within:ring-2 focus-within:ring-offset-1 ' +
    cardBg + ' ' + theme.transition;

  const imgSrc = imgError
    ? 'https://placehold.co/96x96/d1fae5/16a34a?text=🌿'
    : product.image;

  const imgClass =
    'w-24 h-24 object-cover rounded-xl transition-all duration-300 group-hover:scale-105 ' +
    (imgLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0');

  const titleClass = 'text-sm font-semibold leading-snug line-clamp-2 ' + text;

  const wishBtnClass =
    'shrink-0 w-7 h-7 flex items-center justify-center rounded-full ' +
    'transition-all duration-150 hover:scale-110 active:scale-95 ' +
    'focus-visible:outline-none focus-visible:ring-2 ' +
    'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 bg-white/10';

  const wishIconClass = 'text-sm transition-colors ' + (wishlisted ? 'text-red-500' : 'opacity-40');
  const wishIcon = wishlisted ? '♥' : '♡';
  const wishLabel = wishlisted ? 'Remove from wishlist' : 'Add to wishlist';

  const categoryClass = 'flex items-center gap-1 text-xs opacity-50 capitalize ' + text;

  const origPriceClass = 'text-xs line-through opacity-40 tabular-nums ' + text;
  const priceClass = 'text-base font-bold tabular-nums ' + text;
  const priceLabel = 'Price: ' + formatINR(product.price);

  const cartLabel = !inStock
    ? 'Out of stock'
    : addedToCart
    ? 'Added to cart'
    : 'Add ' + product.title + ' to cart';

  const cartText = !inStock ? 'Out of Stock' : addedToCart ? '✓ Added' : 'Add to Cart';

  return (
    <article aria-label={product.title} className={articleClass}>

      {/* ── Plant Image ── */}
      <div className="relative shrink-0">
        {!imgLoaded && !imgError && <ImageSkeleton />}
        <img
          src={imgSrc}
          alt={product.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          className={imgClass}
        />
        {!inStock && (
          <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold text-center px-1">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Plant Info ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">

        {/* Title row + wishlist */}
        <div className="flex items-start justify-between gap-2">
          <h3 title={product.title} className={titleClass}>
            {product.title}
          </h3>
          <button
            aria-label={wishLabel}
            aria-pressed={wishlisted}
            onClick={handleWishlist}
            className={wishBtnClass}
          >
            <span className={wishIconClass} aria-hidden="true">{wishIcon}</span>
          </button>
        </div>

        {/* Category */}
        {product.category && (
          <span className={categoryClass}>
            <span aria-hidden="true">{categoryIcon}</span>
            {product.category}
          </span>
        )}

        {/* Care level badge */}
        {product.careLevel && <CareBadge careLevel={product.careLevel} />}

        {/* Plant traits: light + watering */}
        <PlantTraits
          light={product.light}
          watering={product.watering}
          textClass={text}
        />

        {/* Star rating */}
        {product.rating && (
          <StarRating
            rate={product.rating.rate}
            count={product.rating.count}
            textClass={text}
          />
        )}
      </div>

      {/* ── Price + Actions ── */}
      <div className="shrink-0 flex flex-col items-end gap-2 ml-auto">

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {product.originalPrice && (
            <span className={origPriceClass}>
              {formatINR(product.originalPrice)}
            </span>
          )}
          <span className={priceClass} aria-label={priceLabel}>
            {formatINR(product.price)}
          </span>
          {product.originalPrice && (
            <DiscountBadge original={product.originalPrice} current={product.price} />
          )}
        </div>

        {/* Actions */}
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
    </article>
  );
};

export default ProductListItem;