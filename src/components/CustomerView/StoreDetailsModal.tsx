import React, { useState } from 'react';
import { X, Search, Plus, Minus, ShoppingBag, Star, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { Store, Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface StoreDetailsModalProps {
  store: Store | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
}

export const StoreDetailsModal: React.FC<StoreDetailsModalProps> = ({
  store,
  isOpen,
  onClose,
  onOpenCart
}) => {
  const { products, cart, addToCart, updateQuantity } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  if (!isOpen || !store) return null;

  const storeProducts = products.filter((p) => p.storeId === store.id);
  const categories = ['all', ...Array.from(new Set(storeProducts.map((p) => p.category)))];

  const filteredProducts = storeProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedSubCategory === 'all' || product.category === selectedSubCategory;
    return matchesSearch && matchesCat;
  });

  const getProductCartQty = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const getStatusBadge = (status: Store['status']) => {
    switch (status) {
      case 'available':
        return <span className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">🟢 متاح للطلب</span>;
      case 'busy':
        return <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">🟡 مشغول (تجهيز متأخر قليلاً)</span>;
      case 'closed':
        return <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">🔴 مغلق حالياً</span>;
      case 'paused':
        return <span className="bg-slate-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">⚫ متوقف مؤقتاً للصيانة</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner & Header */}
        <div className="relative h-44 sm:h-56 bg-slate-800 shrink-0">
          <img
            src={store.banner}
            alt={store.name}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition shadow-lg backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Store Info overlay */}
          <div className="absolute bottom-4 right-4 left-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div className="flex items-center gap-3.5">
              <img
                src={store.image}
                alt={store.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-xl bg-white shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-black">{store.name}</h2>
                  {getStatusBadge(store.status)}
                </div>
                <p className="text-slate-200 text-xs line-clamp-1 max-w-xl">{store.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 mt-1.5 font-medium">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {store.rating}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {store.deliveryTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {store.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Subcategories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedSubCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  selectedSubCategory === cat
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'جميع الأصناف' : cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في قائمة المتجر..."
              className="w-full pr-9 pl-3 py-1.5 text-xs bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Warning if closed or paused */}
        {(store.status === 'closed' || store.status === 'paused') && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>تنبيه: هذا المكان غير متاح حالياً لاستقبال الطلبات الفورية، يمكنك تصفح القائمة فقط.</span>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold">لا توجد منتجات مطابقة للبحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const qty = getProductCartQty(product.id);
                const isOutOfStock = !product.inStock || product.stockCount <= 0;

                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-2xl border p-3.5 flex gap-3.5 transition hover:shadow-md ${
                      isOutOfStock ? 'opacity-60 border-slate-200 bg-slate-50/50' : 'border-slate-200'
                    }`}
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.oldPrice && product.oldPrice > product.price && (
                        <div className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                          خصم
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center text-white text-[10px] font-bold">
                          🔴 نفد
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-slate-500 text-[11px] line-clamp-2 mt-1 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-amber-700 text-sm">
                            {product.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">ريال</span>
                          {product.oldPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {product.oldPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* +/- Buttons */}
                        {isOutOfStock ? (
                          <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                            غير متوفر
                          </span>
                        ) : qty > 0 ? (
                          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, -1)}
                              className="w-7 h-7 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition active:scale-95"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-extrabold text-xs text-amber-900 px-1 min-w-[20px] text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, 1)}
                              className="w-7 h-7 rounded-lg bg-amber-600 text-white hover:bg-amber-700 flex items-center justify-center transition shadow-sm active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={store.status === 'closed' || store.status === 'paused'}
                            onClick={() => addToCart(product)}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            إضافة
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Quick Cart Bar */}
        {cartItemsCount > 0 && (
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shadow-xl flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center relative font-bold">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow">
                  {cartItemsCount}
                </span>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">سلة المشتريات: {cartItemsCount} منتجات</div>
                <div className="text-sm font-black text-slate-900">
                  الإجمالي: {cartSubtotal.toLocaleString()} <span className="text-[10px] font-bold text-slate-500">ريال</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              عرض السلة ومتابعة الطلب
              <span className="text-emerald-200">←</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
