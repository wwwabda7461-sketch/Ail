import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Filter, ShoppingBag, Car, ChevronLeft, ShieldCheck, ArrowRight, Bell, Sparkles } from 'lucide-react';
import { StoreCategory, Store, Product, RidePurpose } from '../../types';
import { useApp } from '../../context/AppContext';
import { StoreDetailsModal } from './StoreDetailsModal';
import { CarRideBookingModal } from './CarRideBookingModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { OrderTrackingModal } from './OrderTrackingModal';

export const CustomerHome: React.FC = () => {
  const {
    stores,
    products,
    cart,
    activeOrder,
    setActiveOrder,
    customerName,
    customerPhone,
    setRole
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | 'all'>('restaurants');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Modals state
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isRideModalOpen, setIsRideModalOpen] = useState(false);
  const [rideInitialPurpose, setRideInitialPurpose] = useState<RidePurpose>('family');

  const categories: { id: StoreCategory; label: string; icon: string; desc: string }[] = [
    { id: 'restaurants', label: 'المطاعم', icon: '🍽️', desc: 'وجبات يمنية وسريعة ومشويات' },
    { id: 'pharmacies', label: 'الصيدليات', icon: '💊', desc: 'أدوية ومستلزمات وعناية طبية' },
    { id: 'groceries', label: 'البقالات', icon: '🛒', desc: 'مواد غذائية وتموينية ومنزلية' },
    { id: 'student_services', label: 'خدمات الطالبات', icon: '👩‍🎓', desc: 'طباعة، بحوث، وقرطاسية وتوصيل' },
    { id: 'car_ride', label: 'طلب سيارة ونقل', icon: '🚗', desc: 'مشاوير عائلية، مطار، ونقل بضائع' }
  ];

  // Filtered stores
  const filteredStores = stores.filter((store) => {
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailability = !onlyAvailable || store.status === 'available';

    return matchesCategory && matchesSearch && matchesAvailability;
  });

  // Also search products matching the query across all stores
  const matchedProducts = searchQuery.trim().length > 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleOpenRide = (purpose: RidePurpose) => {
    setRideInitialPurpose(purpose);
    setIsRideModalOpen(true);
  };

  const getStatusBadge = (status: Store['status']) => {
    switch (status) {
      case 'available':
        return <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">🟢 متاح</span>;
      case 'busy':
        return <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">🟡 مشغول</span>;
      case 'closed':
        return <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">🔴 مغلق</span>;
      case 'paused':
        return <span className="bg-slate-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">⚫ متوقف</span>;
    }
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Top Banner / Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white pt-6 pb-12 px-4 relative overflow-hidden shadow-lg">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-right space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-200 border border-white/15">
                <Sparkles className="w-3.5 h-3.5" />
                <span>منصتك المحلية الأولى في التوصيل والنقل</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                تساهيل | TASAHEEL
              </h1>
              <p className="text-sm sm:text-base text-amber-100 font-medium">
                «من طلبك إلى بابك» — مطاعم، صيدليات، بقالات، خدمات طالبات، وطلب سيارات ونقل فوري
              </p>
            </div>

            {/* Quick Stats or Promo Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-xs space-y-2 text-right w-full sm:w-auto">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>توصيل سريع وموثوق في جميع أحياء المدينة</span>
              </div>
              <div className="text-slate-200 text-[11px] leading-relaxed">
                📍 تحديد دقيق لموقعك عبر GPS • 💳 دفع بالكريمي والقطيبي أو نقدًا عند الباب
              </div>
            </div>
          </div>

          {/* Search Box in Hero */}
          <div className="mt-6 max-w-3xl">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مطعم، وجبة، دواء، بقالة، أو خدمة..."
                className="w-full pr-12 pl-4 py-3.5 bg-white text-slate-900 rounded-2xl shadow-xl focus:ring-4 focus:ring-amber-400/50 outline-none text-xs sm:text-sm font-medium placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  مسح
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 -mt-6">
        
        {/* Active Order Banner if existing */}
        {activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
          <div className="mb-6 bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-300 border border-emerald-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl animate-pulse">
                🚴
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  لديك طلب قيد التنفيذ الآن (#{activeOrder.orderNumber})
                </div>
                <div className="text-sm font-black">
                  {activeOrder.storeName} • الحالة: {activeOrder.status}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsTrackingOpen(true)}
              className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-black rounded-xl shadow transition active:scale-95 flex items-center gap-1"
            >
              متابعة الطلب
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Portals Direct Entrance Bar (Explicitly answers: من وين ادخل للوحة المسؤول والعمال) */}
        <div className="mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-2xl p-4 shadow-lg border border-amber-500/30 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                  بوابات المنصة
                </span>
                <h3 className="text-sm font-black text-white">
                  الدخول المباشر إلى لوحات الإدارة وعمال التوصيل والمتاجر:
                </h3>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                يمكنك التبديل بنقرة واحدة لتجربة لوحة تحكم المسؤول، تطبيق السائق، أو لوحة المتجر
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className="p-3 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 border border-purple-500/40 text-right transition flex items-center justify-between group active:scale-98 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl group-hover:scale-110 transition-transform">👨‍💼</span>
                <div>
                  <div className="font-black text-xs text-purple-200">لوحة تحكم المسؤول</div>
                  <div className="text-[10px] text-slate-400">الإحصائيات، الأسعار، الجرد والطلبات</div>
                </div>
              </div>
              <span className="text-xs text-purple-300 group-hover:translate-x-1 transition-transform">←</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('driver')}
              className="p-3 rounded-xl bg-amber-950/70 hover:bg-amber-900/90 border border-amber-500/40 text-right transition flex items-center justify-between group active:scale-98 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl group-hover:scale-110 transition-transform">🚴</span>
                <div>
                  <div className="font-black text-xs text-amber-200">تطبيق عامل التوصيل</div>
                  <div className="text-[10px] text-slate-400">استلام الطلبات، الخريطة والعهد الكاش</div>
                </div>
              </div>
              <span className="text-xs text-amber-300 group-hover:translate-x-1 transition-transform">←</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('merchant')}
              className="p-3 rounded-xl bg-blue-950/70 hover:bg-blue-900/90 border border-blue-500/40 text-right transition flex items-center justify-between group active:scale-98 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl group-hover:scale-110 transition-transform">🏪</span>
                <div>
                  <div className="font-black text-xs text-blue-200">لوحة تحكم المتجر</div>
                  <div className="text-[10px] text-slate-400">استقبال وتأكيد الطلبات وقائمة الأصناف</div>
                </div>
              </div>
              <span className="text-xs text-blue-300 group-hover:translate-x-1 transition-transform">←</span>
            </button>
          </div>
        </div>

        {/* 1. Category Switch Tabs (As explicitly requested in prompt #1) */}
        <div className="bg-white rounded-2xl p-2.5 shadow-md border border-slate-200/80 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id === 'car_ride') {
                      setIsRideModalOpen(true);
                    }
                  }}
                  className={`p-3 rounded-xl transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-amber-600 text-white font-black shadow-md scale-[1.02]'
                      : 'hover:bg-slate-100 text-slate-700 font-bold'
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs sm:text-sm">{cat.label}</span>
                  <span className={`text-[10px] hidden sm:block ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                    {cat.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Specialized Car Ride Services Banner (As specially requested in user brief) */}
        <section className="mb-8 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-amber-600/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-right space-y-1">
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                خدمة سيارات تساهيل والنقل الخاص 🚕
              </span>
              <h2 className="text-lg sm:text-2xl font-black">
                حدد الغرض من المشوار وسنوفر لك أفضل مركبة وسائق فوراً
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                مشاوير عائلية، توصيل مطار، نقل أدوات وأثاث، أو طرود ومستندات سريعة
              </p>
            </div>

            {/* 4 Interactive Purpose Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto shrink-0">
              {[
                { id: 'family' as RidePurpose, title: 'مشوار عائلي', icon: '👨‍👩‍👧‍👦', desc: 'سيارات مريحة واسعة' },
                { id: 'airport' as RidePurpose, title: 'مشوار للمطار', icon: '✈️', desc: 'توصيل وصالات سفر' },
                { id: 'cargo' as RidePurpose, title: 'نقل أدوات', icon: '📦', desc: 'أثاث ومعدات وبضائع' },
                { id: 'courier' as RidePurpose, title: 'توصيل رسائل وطرود', icon: '✉️', desc: 'أمان وسرعة فائقة' }
              ].map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleOpenRide(item.id)}
                  className="bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 p-3 rounded-2xl text-right transition-all flex flex-col justify-between group"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-amber-300">
                      {idx + 1}. {item.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Store Filter & Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {selectedCategory === 'all' && 'جميع الأماكن والمتاجر'}
              {selectedCategory === 'restaurants' && '🍽️ المطاعم والمأكولات المتاحة'}
              {selectedCategory === 'pharmacies' && '💊 الصيدليات والمراكز الطبية'}
              {selectedCategory === 'groceries' && '🛒 البقالات والسوبرماركت'}
              {selectedCategory === 'student_services' && '👩‍🎓 خدمات ومكتبات الطالبات'}
              {selectedCategory === 'car_ride' && '🚗 أسطول سيارات ومركبات تساهيل'}
            </h2>
            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full font-bold">
              {filteredStores.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Only Available */}
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span>المتاحة للطلب فقط (🟢 متاح)</span>
            </label>
          </div>
        </div>

        {/* Matched Products preview if user searched */}
        {searchQuery.trim().length > 1 && matchedProducts.length > 0 && (
          <div className="mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-amber-600" />
              منتجات ووجبات مطابقة للبحث ({matchedProducts.length}):
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {matchedProducts.slice(0, 6).map((prod) => {
                const store = stores.find((s) => s.id === prod.storeId);
                return (
                  <div
                    key={prod.id}
                    onClick={() => {
                      if (store) {
                        setSelectedStore(store);
                        setIsStoreOpen(true);
                      }
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-amber-400 bg-slate-50/50 hover:bg-white flex items-center gap-2.5 cursor-pointer transition shadow-sm"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">{prod.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{store?.name}</div>
                      <div className="font-extrabold text-amber-700 text-xs mt-0.5">
                        {prod.price.toLocaleString()} ريال
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stores Grid */}
        {filteredStores.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">لا توجد متاجر تطابق الفلترة الحالية</h3>
            <p className="text-xs text-slate-400 mt-1">جرّب إلغاء خيار (المتاحة فقط) أو تغيير كلمة البحث</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                onClick={() => {
                  setSelectedStore(store);
                  setIsStoreOpen(true);
                }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Banner Image */}
                  <div className="relative h-36 bg-slate-100 overflow-hidden">
                    <img
                      src={store.banner}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                    {/* Status Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {getStatusBadge(store.status)}
                    </div>

                    {/* Store Logo Thumbnail */}
                    <div className="absolute -bottom-3 right-3">
                      <img
                        src={store.image}
                        alt={store.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md bg-white"
                      />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                        {store.name}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{store.rating}</span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs line-clamp-2 mt-1.5 leading-relaxed">
                      {store.description}
                    </p>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{store.deliveryTime}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <span>•</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-800 font-bold">
                    <span>التوصيل من {store.deliveryBaseFee} ريال</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <span>•</span>
                  </div>

                  <div className="flex items-center gap-1 truncate max-w-[100px] text-slate-500">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{store.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button (when items present) */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40 animate-in slide-in-from-bottom-4 duration-300">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-amber-500 hover:bg-slate-800 transition active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                {cartItemsCount}
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-amber-200">سلة مشترياتك</div>
                <div className="text-sm font-black">
                  {cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString()} ريال
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-extrabold text-amber-400">
              <span>عرض السلة ومتابعة الطلب</span>
              <span>←</span>
            </div>
          </button>
        </div>
      )}

      {/* Modals */}
      <StoreDetailsModal
        store={selectedStore}
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CarRideBookingModal
        isOpen={isRideModalOpen}
        onClose={() => setIsRideModalOpen(false)}
        initialPurpose={rideInitialPurpose}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(createdOrder) => {
          setIsCheckoutOpen(false);
          setActiveOrder(createdOrder);
          setIsTrackingOpen(true);
        }}
      />

      <OrderTrackingModal
        order={activeOrder}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
    </div>
  );
};
