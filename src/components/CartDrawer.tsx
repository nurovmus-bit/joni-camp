import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQty: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalSum = cartItems.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);

  // Generate WhatsApp message template
  const handleCheckoutWhatsApp = () => {
    if (cartItems.length === 0) return;

    let text = `Добрый день! Хочу оформить заказ в магазине JonyCamp:\n\n`;
    cartItems.forEach((item, index) => {
      text += `${index + 1}. *${item.product.name}* \n   — Кол-во: ${item.quantity} шт.\n   — Цена: ${(item.product.price * item.quantity).toLocaleString('ru-RU')} сом\n\n`;
    });
    text += `*Итого к оплате:* ${totalSum.toLocaleString('ru-RU')} сом\n\n`;
    text += `Подскажите, пожалуйста, по поводу условий доставки и наличия этих позиций. Спасибо!`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/996506012029?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-stone-200">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2 text-emerald-950 font-display font-bold text-xl">
              <ShoppingBag size={22} className="text-emerald-600" />
              <span>Корзина покупок</span>
              {cartItems.length > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold ml-1">
                  {cartItems.reduce((acc, c) => acc + c.quantity, 0)}
                </span>
              )}
            </div>
            
            <button
              onClick={onClose}
              id="close-cart-btn"
              className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 transition-colors cursor-pointer"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 border border-stone-100">
                  <ShoppingBag size={36} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-stone-800 text-lg">Ваша корзина пуста</h3>
                  <p className="text-stone-500 text-sm mt-1">Добавьте качественное кемпинговое снаряжение из нашего каталога!</p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-emerald-700 transition-colors text-sm"
                >
                  Вернуться в магазин
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                    {/* Tiny Image */}
                    <div className="w-20 h-25 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Meta info & interactive quantity controls */}
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-semibold text-stone-900 text-sm line-clamp-2 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            id={`remove-cart-item-${item.product.id}`}
                            className="p-1 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                            title="Удалить"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-stone-400 font-medium mt-1">{item.product.category}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2 pt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 px-2 text-stone-500 hover:bg-stone-200/50 disabled:opacity-40 transition-colors"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-800 select-none min-w-[1.25rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 px-2 text-stone-500 hover:bg-stone-200/50 transition-colors"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>

                        {/* Price sum for item */}
                        <span className="font-display font-bold text-stone-900 text-sm">
                          {(item.product.price * item.quantity).toLocaleString('ru-RU')} сом
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Footer block */}
          {cartItems.length > 0 && (
            <div className="border-t border-stone-100 bg-stone-50 p-6 space-y-4">
              <div className="flex items-center justify-between text-base font-bold text-stone-900">
                <span>Итого к оплате:</span>
                <span className="font-display font-extrabold text-2xl text-emerald-950">
                  {totalSum.toLocaleString('ru-RU')} <span className="text-emerald-600 font-bold text-base">сом</span>
                </span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleCheckoutWhatsApp}
                  id="cart-checkout-btn"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all text-sm cursor-pointer shadow-lg shadow-emerald-950/20"
                >
                  <MessageSquare size={18} className="text-emerald-100 fill-emerald-100/10" />
                  <span>Оформить заказ в WhatsApp</span>
                </button>
                
                <button
                  onClick={onClearCart}
                  id="cart-clear-btn"
                  className="w-full text-stone-500 hover:text-stone-800 py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors text-center cursor-pointer"
                >
                  Очистить корзину
                </button>
              </div>

              <p className="text-[10px] text-stone-400 text-center leading-relaxed">
                Наш менеджер свяжется с вами в WhatsApp для подтверждения наличия, согласования способов доставки по Кыргызстану / СНГ и условий оплаты.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
