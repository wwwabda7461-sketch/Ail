import React, { useState } from 'react';
import { ShoppingBag, ArrowRightLeft, Shield, Bike, Store, Smartphone, X, Check, ChevronDown } from 'lucide-react';
import { useApp, UserRole } from '../context/AppContext';

interface HeaderProps {
  onOpenCart?: () => void;
  onOpenTracking?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenTracking }) => {
  const { role, setRole, cart, activeOrder, orders } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  const roleDetails: Record<
    UserRole,
    { title: string; shortTitle: string; icon: string; desc: string; color: string; badge?: number }
  > = {
    customer: {
      title: 'تطبيق العميل والطلب',
      shortTitle: 'العميل',
      icon: '📱',
      desc: 'تصفح المطاعم، الصيدليات، البقالات، وطلب السيارات',
      color: 'bg-emerald-600 text-white'
    },
    admin: {
      title: 'لوحة تحكم المسؤول',
      shortTitle: 'المسؤول',
      icon: '👨‍💼',
      desc: 'الإحصائيات، الأسعار، الجرد، إدارة الطلبات، والتحكم الشامل',
      color: 'bg-purple-600 text-white',
      badge: activeOrdersCount
    },
    driver: {
      title: 'واجهة وتطبيق عامل التوصيل',
      shortTitle: 'عامل التوصيل',
      icon: '🚴',
      desc: 'استلام الطلبات، الخرائط، إثبات التسليم، والعهدة النقدية',
      color: 'bg-amber-600 text-white'
    },
    merchant: {
      title: 'لوحة تحكم المتجر والمطعم',
      shortTitle: 'المتجر',
      icon: '🏪',
      desc: 'استقبال الطلبات، قبول/رفض، وتوفر الأصناف',
      color: 'bg-blue-600 text-white'
    }
  };

  const currentRoleInfo = roleDetails[role];

  return (
    <>
      {/* Top Banner Alert Specifically Indicating Role Switching */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-400">الواجهة النشطة حالياً:</span>
            <span className="font-extrabold text-amber-400 flex items-center gap-1">
              <span>{currentRoleInfo.icon}</span>
              <span>{currentRoleInfo.title}</span>
            </span>
          </div>

          {/* Quick Access Switcher Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 text-[11px]"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>تبديل الواجهة (المسؤول / العمال / المتاجر)</span>
          </button>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Brand / Logo */}
          <div
            onClick={() => setRole('customer')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-slate-900 tracking-tight leading-none group-hover:text-amber-600 transition-colors">
                  تساهيل
                </span>
                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  TASAHEEL
                </span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                من طلبك إلى بابك
              </div>
            </div>
          </div>

          {/* Prominent Role Selector Bar with Full Arabic Labels */}
          <nav className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-1 overflow-x-auto max-w-full">
            {(['customer', 'admin', 'driver', 'merchant'] as UserRole[]).map((rKey) => {
              const r = roleDetails[rKey];
              const isSelected = role === rKey;
              return (
                <button
                  key={rKey}
                  onClick={() => setRole(rKey)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black whitespace-nowrap ${
                    isSelected
                      ? `${r.color} shadow-md scale-[1.02]`
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 bg-white border border-slate-200/60'
                  }`}
                >
                  <span className="text-sm">{r.icon}</span>
                  <span>{r.shortTitle}</span>
                  {r.badge !== undefined && r.badge > 0 && (
                    <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                      {r.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Corner Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
              <button
                onClick={() => onOpenTracking && onOpenTracking()}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5 shadow-xs"
                title="متابعة طلبك النشط"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                <span>طلبك: #{activeOrder.orderNumber}</span>
              </button>
            )}

            {role === 'customer' && (
              <button
                onClick={() => onOpenCart && onOpenCart()}
                className="relative p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition active:scale-95 shadow-sm"
                title="سلة المشتريات"
              >
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Role Selection Modal (Detailed visual portal picker) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold">
                  🔐
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    بوابات الدخول والواجهات لمنصة تساهيل
                  </h3>
                  <p className="text-xs text-slate-500">
                    اختر الواجهة التي ترغب بالدخول إليها وتجربتها الآن
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Admin */}
              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setIsModalOpen(false);
                }}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between group ${
                  role === 'admin'
                    ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-500 shadow-md'
                    : 'border-slate-200 hover:border-purple-400 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">👨‍💼</span>
                  {role === 'admin' && (
                    <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full">
                      الواجهة الحالية
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-purple-700">
                    لوحة تحكم المسؤول (الإدارة)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    التحكم الكامل بالطلبات، المبيعات، تعديل الأسعار، الجرد، وتوريد السائقين.
                  </p>
                </div>
              </button>

              {/* Option 2: Driver */}
              <button
                type="button"
                onClick={() => {
                  setRole('driver');
                  setIsModalOpen(false);
                }}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between group ${
                  role === 'driver'
                    ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500 shadow-md'
                    : 'border-slate-200 hover:border-amber-400 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🚴</span>
                  {role === 'driver' && (
                    <span className="text-[10px] font-black bg-amber-600 text-white px-2 py-0.5 rounded-full">
                      الواجهة الحالية
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-700">
                    تطبيق عامل التوصيل (الكابتن)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    استلام الطلبات، الخرائط، إثبات التسليم، المبالغ المحصلة كاش، والإبلاغ عن المشاكل.
                  </p>
                </div>
              </button>

              {/* Option 3: Merchant */}
              <button
                type="button"
                onClick={() => {
                  setRole('merchant');
                  setIsModalOpen(false);
                }}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between group ${
                  role === 'merchant'
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500 shadow-md'
                    : 'border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🏪</span>
                  {role === 'merchant' && (
                    <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      الواجهة الحالية
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700">
                    لوحة تحكم المتجر والمطعم
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    استقبال الطلبات الواردة (موافق/رفض)، تجهيز الطلبات، والتحكم بتوفر الأصناف.
                  </p>
                </div>
              </button>

              {/* Option 4: Customer */}
              <button
                type="button"
                onClick={() => {
                  setRole('customer');
                  setIsModalOpen(false);
                }}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between group ${
                  role === 'customer'
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500 shadow-md'
                    : 'border-slate-200 hover:border-emerald-400 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">📱</span>
                  {role === 'customer' && (
                    <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      الواجهة الحالية
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700">
                    تطبيق وموقع العميل
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    تصفح المطاعم، الصيدليات، البقالات، حجز سيارة ومشاوير، وتحديد الموقع والدفع.
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
