import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout
}) => {
  const { cart, removeFromCart, updateQuantity, clearCart, stores, cartStoreId } = useApp();

  if (!isOpen) return null;

  const currentStore = stores.find((s) => s.id === cartStoreId);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const estimatedDelivery = currentStore?.deliveryBaseFee || 500;
  const total = subtotal + (cart.length > 0 ? estimatedDelivery : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold">سلة المشتريات</h2>
                {currentStore && (
                  <p className="text-xs text-amber-200">الطلب من: {currentStore.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-red-300 hover:text-red-100 flex items-center gap-1 font-medium bg-red-950/40 px-2.5 py-1 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  إفراغ
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-slate-700">سلتك فارغة حالياً</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  تصفح المطاعم، الصيدليات، البقالات، أو خدمات الطالبات وأضف المنتجات التي ترغب بها
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3 transition hover:border-slate-300"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <div className="font-extrabold text-amber-700 text-xs mt-1">
                      {(item.product.price * item.quantity).toLocaleString()} ريال
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.product.price.toLocaleString()} ريال للقطعة
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 active:scale-95 text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-extrabold text-xs text-slate-800 px-1 min-w-[18px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center hover:bg-amber-700 active:scale-95 text-xs shadow-sm"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing & Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>إجمالي المنتجات:</span>
                  <span className="font-bold text-slate-800">{subtotal.toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>رسوم التوصيل المبدئية:</span>
                  <span className="font-bold text-amber-700">{estimatedDelivery.toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-200 text-slate-900">
                  <span>الإجمالي الكلي:</span>
                  <span className="text-emerald-700 text-base">{total.toLocaleString()} ريال</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                متابعة لتأكيد الطلب والموقع
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
