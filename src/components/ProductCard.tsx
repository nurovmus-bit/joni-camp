import { Product } from '../types';
import { Star, ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  key?: any;
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  isWishlisted: boolean;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200/60 overflow-hidden hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/95 backdrop-blur-sm shadow-sm py-1 px-3 rounded-full text-xs font-bold text-stone-700">
            {product.category}
          </span>
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            id={`wishlist-btn-${product.id}`}
            className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm text-stone-400 hover:text-rose-500 transition-colors shadow-sm cursor-pointer"
            aria-label="В избранное"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2.5"
              className={`w-5 h-5 transition-transform active:scale-90 ${isWishlisted ? 'text-rose-500' : ''}`}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
          
          {/* Quick View Button */}
          <button
            onClick={() => onViewDetails(product)}
            id={`quick-view-btn-${product.id}`}
            className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm text-stone-500 hover:text-emerald-600 transition-colors shadow-sm cursor-pointer lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200"
            title="Быстрый просмотр"
          >
            <Eye size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Bottom Overlay Action (Visible on Hover/Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            id={`add-to-cart-overlay-${product.id}`}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
            <span>В корзину</span>
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              <Star size={14} fill="currentColor" strokeWidth={0} />
            </div>
            <span className="text-xs font-semibold text-stone-500">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              {product.inStock ? 'В наличии' : 'Под заказ'}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(product)}
            className="font-display font-semibold text-stone-900 leading-snug group-hover:text-emerald-700 transition-colors cursor-pointer text-base line-clamp-2 min-h-[2.75rem]"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Buy Action */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-stone-100">
          <div>
            <span className="text-xs text-stone-400 block font-medium">Цена</span>
            <span className="font-display font-extrabold text-xl lg:text-2xl text-emerald-950">
              {product.price.toLocaleString('ru-RU')} <span className="text-emerald-600 font-bold text-base">сом</span>
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            id={`add-to-cart-btn-${product.id}`}
            className="lg:hidden p-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-all cursor-pointer active:scale-95"
            aria-label="В корзину"
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
