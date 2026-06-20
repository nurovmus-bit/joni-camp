import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, Search, Menu, X, ArrowRight, Heart, Phone, 
  MapPin, Shield, CheckCircle2, Tent, Sparkles, MessageSquare, 
  ChevronRight, Instagram, Compass, Flame, Leaf, Package
} from 'lucide-react';

import { PRODUCTS, CATEGORIES, INSTAGRAM_LATEST } from './data';
import { Product, CartItem } from './types';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';

export default function App() {
  // Navigation Mobile Toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected category filter
  const [selectedCategory, setSelectedCategory] = useState('Все товары');

  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist/Favorites state
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Detailed Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter and Search mechanism
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'Все товары' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Total amount computed for header label
  const totalCartSum = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
  }, [cartItems]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cartItems]);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Visual feedback - auto trigger cart drawer open or pulse
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Top Banner Alert bar */}
      <div className="bg-emerald-950 text-white text-xs font-semibold py-2.5 px-4 block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5 text-center">
          <span className="flex items-center gap-1">
            <Sparkles size={13} className="text-amber-400" />
            Эксклюзивное снаряжение JonyCamp — качественная экипировка для дикой природы
          </span>
          <a 
            href="https://wa.me/996506012029" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-emerald-300 hover:text-white transition-colors flex items-center gap-1 font-bold"
          >
            Связаться в WhatsApp: +996 (506) 01-20-29
          </a>
        </div>
      </div>

      {/* Main Sticky Glass Header */}
      <nav className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-sm">
                <Tent size={26} strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-display font-black text-2xl lg:text-3xl tracking-tight text-emerald-950 block leading-none">
                  JonyCamp<span className="text-emerald-600">_</span>
                </span>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block mt-1">Оффлайн магазин</span>
              </div>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 font-semibold text-stone-600">
              <a href="#catalog" className="hover:text-emerald-600 transition-colors">Снаряжение</a>
              <a href="#why-us" className="hover:text-emerald-600 transition-colors">О качестве</a>
              <a href="#instagram-showcase" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                <Instagram size={15} /> Инстаграм
              </a>
              <a href="#footer-contacts" className="hover:text-emerald-600 transition-colors">Контакты</a>
            </div>

            {/* Direct Quick Actions */}
            <div className="flex items-center gap-4">
              {/* Phone Line quick contact info */}
              <a 
                href="https://wa.me/996506012029" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hidden sm:flex items-center gap-2 text-stone-600 hover:text-emerald-600 transition-colors font-bold text-sm bg-stone-100 p-2.5 px-4 rounded-xl border border-stone-200/50"
              >
                <Phone size={16} className="text-emerald-500" />
                <span>+996 506 01 20 29</span>
              </a>

              {/* Wishlist Link badge */}
              <div className="relative">
                <button 
                  onClick={() => {
                    // Quick filter catalog for wishlisted items
                    if (wishlist.length > 0) {
                      setSearchQuery('');
                      setSelectedCategory('Все товары');
                      alert(`В избранном товаров: ${wishlist.length}. Мы прокрутим вас к каталогу.`);
                      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      alert('В избранном пока пусто! Добавьте товары, нажимая на иконку сердечка на карточках.');
                    }
                  }}
                  id="wishlist-trigger-btn"
                  className="p-3 text-stone-600 hover:text-rose-500 rounded-xl hover:bg-stone-100 transition-all cursor-pointer relative"
                  title="Мой вишлист"
                >
                  <Heart size={22} className={wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''} />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Main Shopping Cart Action Button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                id="header-cart-btn"
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 active:scale-95 text-emerald-700 p-2.5 px-4 lg:px-5 rounded-2xl transition-all cursor-pointer group border border-emerald-100"
              >
                <ShoppingCart size={20} strokeWidth={2.5} className="group-hover:rotate-6 transition-transform" />
                <div className="text-left hidden md:block">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block leading-none">Корзина</span>
                  <span className="font-display font-black text-sm block mt-0.5">{totalCartSum.toLocaleString('ru-RU')} сом</span>
                </div>
                {totalCartCount > 0 && (
                  <span className="w-5 h-5 bg-emerald-600 text-white rounded-full text-xs font-bold flex items-center justify-center animate-pulse">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu panel trigger icon */}
              <button 
                className="lg:hidden p-2 text-stone-600 cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                id="menu-toggle-btn"
                aria-label="Переключить меню"
              >
                {isMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-stone-200"
            >
              <div className="px-5 pt-3 pb-8 space-y-4 flex flex-col font-semibold text-stone-600 text-base">
                <a href="#catalog" onClick={() => setIsMenuOpen(false)} className="py-2.5 border-b border-stone-100 flex justify-between items-center">
                  <span>Каталог товаров</span>
                  <ChevronRight size={16} />
                </a>
                <a href="#why-us" onClick={() => setIsMenuOpen(false)} className="py-2.5 border-b border-stone-100 flex justify-between items-center">
                  <span>О качестве и бренде</span>
                  <ChevronRight size={16} />
                </a>
                <a href="#instagram-showcase" onClick={() => setIsMenuOpen(false)} className="py-2.5 border-b border-stone-100 flex justify-between items-center">
                  <span>Следить за новинками в Instagram</span>
                  <ChevronRight size={16} />
                </a>
                <div className="pt-4 flex flex-col gap-3">
                  <a 
                    href="https://wa.me/996506012029" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
                  >
                    <MessageSquare size={18} />
                    <span>Написать в WhatsApp</span>
                  </a>
                  <p className="text-xs text-center text-stone-400">Связь по телефону: +996 (506) 01-20-29</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Visual Showcase */}
      <section className="relative bg-gradient-to-b from-stone-100 to-stone-50 py-16 lg:py-24 overflow-hidden border-b border-stone-200/50">
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-300/15 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-200/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Written pitch */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Leaf size={14} className="animate-spin duration-3000" />
                <span>Экипировка в Бишкеке и по СНГ</span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-950 leading-[1.05] tracking-tight">
                Надежное снаряжение <br />
                для походов от <span className="text-emerald-600">JonyCamp</span>
              </h1>
              
              <p className="text-stone-600 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Магазин товаров для туризма, альпинизма и незабываемого кемпинга на природе. Выбирайте премиум комфорт: от палаток и рюкзаков до авторских наборов посуды.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a 
                  href="#catalog" 
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-4.5 px-8 rounded-2xl text-center shadow-xl shadow-emerald-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Каталог снаряжения</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a 
                  href="https://instagram.com/jonycamp_" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white hover:bg-stone-100 text-stone-800 border border-stone-200/80 font-bold text-base py-4.5 px-8 rounded-2xl text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Instagram size={18} className="text-rose-500" />
                  <span>Перейти в Instagram</span>
                </a>
              </div>

              {/* Key trust facts list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 max-w-lg mx-auto lg:mx-0 border-t border-stone-200">
                <div className="text-center lg:text-left">
                  <span className="font-display font-black text-2xl text-emerald-950">100%</span>
                  <span className="text-xs text-stone-500 block font-semibold mt-0.5">Оригинальное качество</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="font-display font-black text-2xl text-emerald-950">сом</span>
                  <span className="text-xs text-stone-500 block font-semibold mt-0.5">Оплата в нац. валюте</span>
                </div>
                <div className="col-span-2 sm:col-span-1 text-center lg:text-left">
                  <span className="font-display font-black text-2xl text-emerald-950">WhatsApp</span>
                  <span className="text-xs text-stone-500 block font-semibold mt-0.5">Прямое оформление</span>
                </div>
              </div>
            </div>

            {/* Visual side mockup mimicking typical Instagram-Store atmosphere */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-emerald-600 rounded-[2.5rem] rotate-2 scale-98 opacity-5" />
              <div className="relative bg-white border border-stone-200 rounded-[2.5rem] p-4 lg:p-5 shadow-2xl overflow-hidden">
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-stone-100 relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop" 
                    alt="Wild campground at night" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-10000"
                  />
                  
                  {/* Glowing Instagram Profile overlay matching screenshots */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-white/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-500 p-0.5">
                        <div className="bg-emerald-600 text-white rounded-full w-full h-full flex items-center justify-center text-xs font-black">
                          JC
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-stone-900 text-sm block leading-none">@jonycamp_</span>
                        <span className="text-[10px] text-stone-400 font-bold block mt-0.5">Публикации</span>
                      </div>
                    </div>
                    <a 
                      href="https://instagram.com/jonycamp_" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-colors"
                    >
                      Подписаться
                    </a>
                  </div>

                  {/* Absolute product spotlight box */}
                  <div className="absolute bottom-4 left-4 right-4 bg-stone-950/80 backdrop-blur-md p-4 rounded-2xl text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">Популярно</span>
                      <span className="font-bold text-sm block truncate w-44 mt-0.5">Двухместная палатка Hiking 2</span>
                    </div>
                    <div>
                      <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                        7 600 сом
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust benefits banner */}
      <section id="why-us" className="py-12 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-100">
            <div className="flex flex-col items-center gap-3 pt-6 md:pt-0">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Compass size={28} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-stone-950 text-base">Кемпинговые решения</h3>
              <p className="text-xs text-stone-500 max-w-xs">Палатки, кухни и мебель для отдыха в комфортных условиях на природе</p>
            </div>
            
            <div className="flex flex-col items-center gap-3 pt-6 md:pt-0">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Flame size={28} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-stone-950 text-base">Гриль и Термокухня</h3>
              <p className="text-xs text-stone-500 max-w-xs">Компактные горелки, плиты, наборы посуды и кофейные аксессуары со звуком качества</p>
            </div>

            <div className="flex flex-col items-center gap-3 pt-6 md:pt-0">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Shield size={28} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-stone-950 text-base">Полный разборный инвентарь</h3>
              <p className="text-xs text-stone-500 max-w-xs">Удобное компактное складывание походных наборов для перевозки любым транспортом</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Catalog section */}
      <section id="catalog" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title & Search controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2">Наш ассортимент</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-emerald-950 leading-tight">
                Каталог туристических товаров
              </h2>
              <p className="text-stone-500 text-sm mt-1">Цены в сомах с реальных витрин JonyCamp</p>
            </div>
            
            {/* Real Search Input */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Поиск по названию или деталям..."
                value={searchQuery}
                aria-label="Искать товары"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-stone-800 placeholder-stone-400 py-3.5 pl-11 pr-4 rounded-xl border border-stone-200/90 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Search className="absolute left-4 top-3.5 text-stone-400" size={18} />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-xs bg-stone-100 hover:bg-stone-200 text-stone-500 px-2 py-1 rounded"
                >
                  Очистить
                </button>
              )}
            </div>
          </div>

          {/* Interactive Categories list Filters */}
          <div className="flex overflow-x-auto gap-2 pb-6 mb-10 -mx-4 px-4 scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                id={`cat-btn-${category.replace(/\s+/g, '-').toLowerCase()}`}
                className={`py-3 px-6 rounded-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === category
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-700/10'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Main Grid showing results */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/50 p-8 space-y-4">
              <Package size={48} className="text-stone-300 mx-auto" strokeWidth={1.5} />
              <div>
                <h3 className="font-display font-bold text-stone-900 text-xl">К сожалению, товары не найдены</h3>
                <p className="text-stone-500 text-sm mt-1">Попробуйте изменить формулировку запроса или выбрать другую категорию.</p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Все товары');
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlist.includes(product.id)}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Styled Instagram gallery overview matching user requirement */}
      <section id="instagram-showcase" className="py-20 bg-stone-100 border-t border-b border-stone-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <a 
              href="https://instagram.com/jonycamp_" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 group cursor-pointer"
            >
              <Instagram size={36} className="text-rose-500 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-display font-black text-3xl lg:text-4xl text-stone-900 hover:text-emerald-700 transition-colors">
                @jonycamp_ в Instagram
              </span>
            </a>
            <p className="text-stone-500 text-base">
              Все фотографии товаров сделаны «вживую» нашими вожатыми и гидами. Подписывайтесь на аккаунт, чтобы быть в курсе свежих поставок и обзоров!
            </p>
          </div>

          {/* Grid resembling Instagram post columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {INSTAGRAM_LATEST.map((post) => (
              <a 
                href={post.link}
                target="_blank" 
                rel="noopener noreferrer"
                key={post.id}
                className="group relative bg-white rounded-3xl overflow-hidden aspect-square border border-stone-200/80 shadow-sm hover:shadow-xl transition-all block"
              >
                <img 
                  src={post.image} 
                  alt="Кемпинг на природе JonyCamp" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Light overlay on hover */}
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-sm font-semibold">
                  <span className="flex items-center gap-1.5 text-white">❤️ {post.likes}</span>
                  <span className="flex items-center gap-1.5 text-white">💬 {post.comments}</span>
                </div>
              </a>
            ))}
          </div>

          {/* Bottom callout mimicking direct messaging */}
          <div className="bg-emerald-50 rounded-3xl p-8 lg:p-12 text-center mt-12 border border-emerald-100 flex flex-col items-center max-w-3xl mx-auto space-y-6">
            <h3 className="font-display font-bold text-stone-900 text-xl lg:text-2xl">
              Понравился определенный пост в Инстаграм?
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed max-w-xl">
              Пришлите нам скриншот товара прямо на WhatsApp! Мы проверим его индивидуальный уровень наличия в Бишкеке, рассчитаем точную цену в сомах и поможем оформить оперативную бронь.
            </p>
            <a 
              href="https://wa.me/996506012029" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-4 px-8 rounded-2xl transition-all text-sm shadow-lg shadow-emerald-700/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare size={18} />
              <span>Отправить скриншот в WhatsApp</span>
            </a>
          </div>

        </div>
      </section>

      {/* Footer contacts detailed catalog links block */}
      <footer id="footer-contacts" className="bg-white pt-16 pb-8 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1 - Brand Identity info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-600 text-white p-2 rounded-xl">
                  <Tent size={24} />
                </div>
                <span className="font-display font-black text-2xl tracking-tight text-emerald-950">
                  JonyCamp<span className="text-emerald-700">_</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Магазин туристического оборудования для любителей походов, дикой природы и первозданного уединения. Качественная мебель, кухни, грили и палатки в Центральной Азии.
              </p>
              
              {/* Short coordinates bullet points */}
              <div className="text-xs space-y-2 text-stone-600 font-medium">
                <p className="flex items-center gap-2 text-stone-800">
                  <MapPin size={14} className="text-emerald-500" />
                  <span>г. Бишкек, доставка по СНГ</span>
                </p>
                <p className="flex items-center gap-2 text-stone-800">
                  <Phone size={14} className="text-emerald-500" />
                  <span>+996 (506) 01-20-29</span>
                </p>
              </div>
            </div>

            {/* Column 2 - Categories and catalogs */}
            <div>
              <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider mb-6">Каталог</h4>
              <ul className="space-y-3.5 text-xs text-stone-500 font-semibold">
                <li><button onClick={() => setSelectedCategory('Палатки и столы')} className="hover:text-emerald-600 transition-colors cursor-pointer">Палатки и столы</button></li>
                <li><button onClick={() => setSelectedCategory('Стулья и мебель')} className="hover:text-emerald-600 transition-colors cursor-pointer">Стулья и мебель</button></li>
                <li><button onClick={() => setSelectedCategory('Рюкзаки')} className="hover:text-emerald-600 transition-colors cursor-pointer">Туристические рюкзаки</button></li>
                <li><button onClick={() => setSelectedCategory('Кухня и посуда')} className="hover:text-emerald-600 transition-colors cursor-pointer">Кухня и посуда</button></li>
              </ul>
            </div>

            {/* Column 3 - Fast client guide */}
            <div>
              <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider mb-6">Покупателю</h4>
              <ul className="space-y-3.5 text-xs text-stone-500 font-semibold">
                <li><a href="https://instagram.com/jonycamp_" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Как сделать заказ?</a></li>
                <li><a href="https://instagram.com/jonycamp_" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Доставка по Кыргызстану</a></li>
                <li><a href="https://instagram.com/jonycamp_" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Гарантия на оборудование</a></li>
                <li><a href="https://instagram.com/jonycamp_" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Обмен и возврат</a></li>
              </ul>
            </div>

            {/* Column 4 - Direct quick-action ordering box */}
            <div className="bg-stone-50 border border-stone-200/50 p-6 rounded-2xl space-y-4">
              <h5 className="font-bold text-stone-950 text-sm leading-snug">
                Оформление через WhatsApp менеджер
              </h5>
              <p className="text-xs text-stone-500 leading-relaxed">
                Добавьте товары в корзину и нажмите кнопку оформления. Корзина сформирует готовый красивый список!
              </p>
              <a 
                href="https://wa.me/996506012029" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-2 cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>Наш WhatsApp менеджер</span>
              </a>
            </div>

          </div>

          {/* Legal copyrights */}
          <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-400">
            <p>© 2026 Магазин JonyCamp_ (jonicamp). Все права защищены.</p>
            <div className="flex gap-6 items-center">
              <a href="https://instagram.com/jonycamp_" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 text-stone-400 transition-colors">
                <Instagram size={18} />
              </a>
              <div className="flex gap-4">
                <a href="#" className="hover:text-stone-600 transition-colors">Политика конфиденциальности</a>
                <a href="#" className="hover:text-stone-600 transition-colors">Публичная оферта</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Component drawers & overlays rendering */}
      
      {/* Product Details Dialog */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Right Drawer Cart sidebar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

    </div>
  );
}
