import { Product } from '../types';
import { X, CheckCircle, MessageSquare, ShoppingCart, Star } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  if (!product) return null;

  // Build a WhatsApp direct purchase link
  const orderWhatsAppText = encodeURIComponent(
    `Здравствуйте! Я хочу купить у вас "${product.name}" за ${product.price.toLocaleString('ru-RU')} сом. Есть ли сейчас в наличии?`
  );
  const whatsappUrl = `https://wa.me/996506012029?text=${orderWhatsAppText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col z-10">
        {/* Navigation / Header for mobile */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            id="close-modal-btn"
            className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm text-stone-500 hover:text-stone-800 transition-colors shadow-md cursor-pointer"
            aria-label="Закрыть"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left side: Product Image */}
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right side: Information */}
            <div className="flex flex-col justify-between py-2">
              <div className="space-y-6">
                {/* Category & Rating */}
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-50 text-emerald-800 font-bold text-xs py-1.5 px-3 rounded-full">
                    {product.category}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <Star size={18} fill="currentColor" strokeWidth={0} />
                    <span className="font-bold text-stone-800 text-sm">{product.rating.toFixed(1)} / 5.0</span>
                  </div>
                </div>

                {/* Name */}
                <h2 className="font-display font-black text-2xl lg:text-3xl text-emerald-950 leading-tight">
                  {product.name}
                </h2>

                {/* Pricing / Stock Status */}
                <div className="flex items-baseline gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <div>
                    <span className="text-xs text-stone-400 block font-medium">Цена в магазине</span>
                    <span className="font-display font-black text-3xl text-emerald-950">
                      {product.price.toLocaleString('ru-RU')} <span className="text-emerald-600 text-lg font-bold">сом</span>
                    </span>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-xs text-stone-400 block font-medium">Статус</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full mt-0.5">
                      <CheckCircle size={12} strokeWidth={3} />
                      {product.inStock ? 'В наличии' : 'Доставка за 2-3 дня'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider">Описание товара</h4>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Specifications / Features list */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider">Характеристики / Особенности</h4>
                    <ul className="grid gap-2 text-stone-600 text-sm">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 animate-pulse" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Operations */}
              <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
                {/* Add to Cart button */}
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  id="modal-add-to-cart-btn"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/20"
                >
                  <ShoppingCart size={20} strokeWidth={2.5} />
                  <span>Добавить в корзину</span>
                </button>

                {/* Direct quick-order on WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-stone-900 hover:bg-stone-800 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:text-white cursor-pointer"
                >
                  <MessageSquare size={20} className="text-emerald-500" />
                  <span>Заказать в WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
