import React from 'react';
import { X, CheckCircle2, Clock, Phone, MessageSquare, MapPin, Store, AlertCircle, Sparkles, Bike } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  if (!isOpen || !order) return null;

  const steps: { key: OrderStatus; label: string; icon: string; desc: string }[] = [
    { key: 'new', label: 'طلب جديد', icon: '🔔', desc: 'تم إرسال الطلب وفي انتظار مراجعة المتجر' },
    { key: 'confirmed', label: 'تم التأكيد', icon: '✅', desc: 'تم قبول الطلب وتأكيد توفر المنتجات' },
    { key: 'preparing', label: 'قيد التجهيز', icon: '👨‍🍳', desc: 'يقوم المتجر حالياً بإعداد وتغليف طلبك' },
    { key: 'ready', label: 'جاهز للاستلام', icon: '📦', desc: 'الطلب مغلف وبانتظار وصول عامل التوصيل' },
    { key: 'with_driver', label: 'مع عامل التوصيل', icon: '🛵', desc: 'استلم المندوب طلبك وبدأ التحرك' },
    { key: 'on_the_way', label: 'في الطريق', icon: '🚴', desc: 'السائق في طريقه إلى موقعك المسجل' },
    { key: 'arrived', label: 'وصل إلى موقعك', icon: '📍', desc: 'وصل السائق إلى عنوانك، يرجى الاستلام' },
    { key: 'delivered', label: 'تم التسليم', icon: '🎉', desc: 'تم استلام الطلب بنجاح، شكراً لاختيارك تساهيل' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    return steps.findIndex((s) => s.key === status);
  };

  const currentIndex = getStepIndex(order.status);

  // Generate WhatsApp Notification message link
  const generateWhatsAppMessage = () => {
    const currentStepObj = steps.find((s) => s.key === order.status);
    const text = encodeURIComponent(
      `🔔 *تساهيل | TASAHEEL*\n` +
      `من طلبك إلى بابك 🚀\n\n` +
      `مرحباً *${order.customerName}*،\n` +
      `حالة طلبك رقم: *#${order.orderNumber}*\n` +
      `من: *${order.storeName}*\n` +
      `الحالة الحالية: *${currentStepObj?.icon || '📦'} ${currentStepObj?.label || order.status}*\n` +
      `الوقت المتوقع: *${order.estimatedTimeMinutes} دقيقة*\n` +
      `الإجمالي: *${order.total.toLocaleString()} ريال*\n\n` +
      `شكراً لاستخدامك منصة تساهيل للتوصيل!`
    );
    window.open(`https://wa.me/967${order.customerPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              🚴
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black">متابعة الطلب #{order.orderNumber}</h2>
                <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  تحديث حي
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                {order.storeName} • {new Date(order.createdAt).toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Status Alert if Cancelled */}
          {order.status === 'cancelled' ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-red-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>نعتذر، تم إلغاء هذا الطلب</span>
              </div>
              <p className="text-xs text-red-700">
                سبب الإلغاء: {order.cancelReason || 'المتجر غير قادر على تلبية الطلب حالياً أو بطلب من العميل.'}
              </p>
            </div>
          ) : (
            <>
              {/* ETA & Distance Card */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md">
                    ⏱️
                  </div>
                  <div>
                    <div className="text-xs text-emerald-800 font-bold">الوقت المتوقع للوصول:</div>
                    <div className="text-xl font-black text-emerald-950">
                      {order.estimatedTimeMinutes} - {order.estimatedTimeMinutes + 10} دقيقة
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-emerald-900">
                  <div>
                    <span className="text-emerald-600 block text-[10px]">المسافة:</span>
                    <span className="font-extrabold">{order.distanceKm} كم</span>
                  </div>
                  <div className="h-6 w-px bg-emerald-200"></div>
                  <div>
                    <span className="text-emerald-600 block text-[10px]">طريقة الدفع:</span>
                    <span className="font-extrabold">
                      {order.paymentMethod === 'cash_on_delivery' ? 'نقداً عند الاستلام' : 'تحويل بنكي'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-800 mb-4 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  مراحل مسار الطلب:
                </h3>

                <div className="relative space-y-4 pr-3">
                  {/* Vertical connecting line */}
                  <div className="absolute top-2 bottom-2 right-[23px] w-0.5 bg-slate-200"></div>

                  {steps.map((st, idx) => {
                    const isDone = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div key={st.key} className="relative flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 z-10 transition-all ${
                            isCurrent
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md font-bold scale-110'
                              : isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {isDone ? (
                            isCurrent ? st.icon : <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? 'text-emerald-900 font-extrabold'
                                  : isDone
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {st.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold animate-pulse">
                                جارٍ الآن
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Assigned Driver Card */}
          {order.driverName && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    🚴
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">عامل التوصيل المكلف:</div>
                    <div className="font-extrabold text-sm text-slate-900">{order.driverName}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">جاهز ومتاح لخدمتك</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${order.driverPhone}`}
                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold transition flex items-center gap-1.5 text-xs"
                  >
                    <Phone className="w-4 h-4" />
                    <span>اتصال</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const msg = encodeURIComponent(`مرحباً أخي السائق ${order.driverName}، بخصوص طلب تساهيل #${order.orderNumber}`);
                      window.open(`https://wa.me/967${order.driverPhone}?text=${msg}`, '_blank');
                    }}
                    className="p-2.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold transition flex items-center gap-1.5 text-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>واتساب</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp Notification Trigger Button (As requested in prompt #9) */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-emerald-950">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm shrink-0">
                💬
              </div>
              <div>
                <div className="font-bold">إرسال إشعار تحديث الطلب عبر الواتساب:</div>
                <div className="text-[11px] text-emerald-700">
                  إرسال رسالة جاهزة تتضمن حالة الطلب الحالية والوقت المتوقع
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={generateWhatsAppMessage}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>🔔 مشاركة عبر واتساب</span>
            </button>
          </div>

          {/* Order Details & Summary */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2 text-xs">
            <div className="font-bold text-slate-800 mb-1">تفاصيل المنتجات:</div>
            {order.items.length > 0 ? (
              order.items.map((i) => (
                <div key={i.product.id} className="flex justify-between text-slate-700">
                  <span>{i.product.name} × {i.quantity}</span>
                  <span className="font-bold">{(i.product.price * i.quantity).toLocaleString()} ريال</span>
                </div>
              ))
            ) : (
              <div className="text-slate-600">{order.deliveryNotes}</div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
              <span>المبلغ الإجمالي:</span>
              <span className="text-emerald-700">{order.total.toLocaleString()} ريال</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
