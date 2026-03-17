import React, { useState } from 'react';
import Button from './Button.tsx';
import { useTheme } from '../hooks/useTheme.ts';


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


function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}


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

      {/* Plant Image */}
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

      {/*Plant Info*/}
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

      {/*Price + Actions*/}
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