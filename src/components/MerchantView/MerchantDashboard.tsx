import React, { useState } from 'react';
import { Bell, CheckCircle2, XCircle, Clock, PackageCheck, AlertCircle, ShoppingBag, Store, Search, ToggleLeft, ToggleRight, Edit2, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const MerchantDashboard: React.FC = () => {
  const {
    stores,
    selectedStoreId,
    setSelectedStoreId,
    orders,
    updateOrderStatus,
    products,
    toggleProductStock,
    updateProduct,
    setRole
  } = useApp();

  const currentStore = stores.find((s) => s.id === selectedStoreId) || stores[0];
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('ضغط عمل وزحام شديد حالياً');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');

  // Filter orders related to this store
  const storeOrders = orders.filter((o) => o.storeId === currentStore.id);
  const newOrders = storeOrders.filter((o) => o.status === 'new');
  const preparingOrders = storeOrders.filter((o) => o.status === 'preparing' || o.status === 'confirmed');
  const readyOrders = storeOrders.filter((o) => o.status === 'ready' || o.status === 'with_driver' || o.status === 'on_the_way');
  const historyOrders = storeOrders.filter((o) => o.status === 'delivered' || o.status === 'cancelled');

  const storeProducts = products.filter((p) => p.storeId === currentStore.id);

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
  };

  const handleMarkReady = (orderId: string) => {
    updateOrderStatus(orderId, 'ready');
  };

  const handleConfirmReject = () => {
    if (rejectModalOrder) {
      updateOrderStatus(rejectModalOrder.id, 'cancelled', rejectReason);
      setRejectModalOrder(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header & Store Selector */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={currentStore.image}
            alt={currentStore.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                لوحة تحكم المتجر والشركاء
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {currentStore.name}
            </h1>
            <p className="text-xs text-slate-500">{currentStore.address} • {currentStore.phone}</p>
          </div>
        </div>

        {/* Store Switcher and Role Switch Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition shadow-sm active:scale-95"
          >
            📱 تطبيق العميل
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition shadow-sm active:scale-95"
          >
            👨‍💼 لوحة المسؤول
          </button>

          <label className="text-xs font-bold text-slate-500 whitespace-nowrap mr-2">
            المتجر:
          </label>
          <select
            value={currentStore.id}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.category === 'restaurants' ? 'مطعم' : s.category === 'pharmacies' ? 'صيدلية' : s.category === 'groceries' ? 'بقالة' : 'طالبات'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-black transition relative ${
            activeTab === 'orders'
              ? 'text-amber-600 border-b-2 border-amber-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>إدارة واستقبال الطلبات</span>
          {newOrders.length > 0 && (
            <span className="mr-1.5 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-bounce">
              {newOrders.length} جديد
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`pb-3 px-4 text-xs font-black transition relative ${
            activeTab === 'menu'
              ? 'text-amber-600 border-b-2 border-amber-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>قائمة المنتجات والتوفر ({storeProducts.length})</span>
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* 1. New Orders Section (As specifically requested: طلب جديد 🔔 هل تستطيع تجهيز هذا الطلب؟ [موافق] [رفض]) */}
          {newOrders.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center animate-pulse">
                  <Bell className="w-4 h-4" />
                </div>
                <h2 className="text-base font-black text-red-950">
                  طلبات جديدة واردة الآن ({newOrders.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {newOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-red-50/70 border-2 border-red-300 rounded-3xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-red-600 text-white px-2.5 py-0.5 rounded-full shadow">
                          طلب جديد 🔔
                        </span>
                        <span className="font-extrabold text-sm text-slate-900">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          منذ {Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000)} دقيقة
                        </span>
                      </div>

                      <div className="text-sm font-black text-slate-900">
                        العميل: {order.customerName} ({order.customerPhone})
                      </div>

                      <div className="text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-red-100 space-y-1">
                        <div className="font-bold text-slate-800">الأصناف المطلوبة:</div>
                        {order.items.map((i) => (
                          <div key={i.product.id} className="flex justify-between">
                            <span>{i.product.name} × <strong className="text-red-700">{i.quantity}</strong></span>
                            <span className="font-bold">{(i.product.price * i.quantity).toLocaleString()} ريال</span>
                          </div>
                        ))}
                        {order.deliveryNotes && (
                          <div className="text-amber-800 text-[11px] pt-1 border-t border-slate-100">
                            ملاحظة العميل: {order.deliveryNotes}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                        <span>قيمة الطلب: {order.subtotal.toLocaleString()} ريال</span>
                        <span>•</span>
                        <span>طريقة الدفع: {order.paymentMethod === 'cash_on_delivery' ? 'كاش عند الاستلام' : 'حوالة بنكية'}</span>
                      </div>
                    </div>

                    {/* Question & Accept / Reject buttons */}
                    <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm text-center space-y-3 w-full md:w-64 shrink-0">
                      <p className="text-xs font-black text-slate-900">
                        هل تستطيع تجهيز هذا الطلب؟
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAcceptOrder(order.id)}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1 active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          [ موافق ]
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectModalOrder(order)}
                          className="flex-1 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 active:scale-95"
                        >
                          <XCircle className="w-4 h-4" />
                          [ رفض ]
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. In-Progress & Ready Orders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Preparing */}
            <div className="space-y-3">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span>👨‍🍳 قيد التجهيز بالمطبخ / المتجر</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  {preparingOrders.length}
                </span>
              </h2>

              {preparingOrders.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  لا توجد طلبات قيد التجهيز حالياً
                </div>
              ) : (
                preparingOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-xs text-slate-900">
                        #{order.orderNumber} - {order.customerName}
                      </div>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        قيد التجهيز
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl">
                      {order.items.map((i) => (
                        <div key={i.product.id} className="flex justify-between">
                          <span>{i.product.name} × {i.quantity}</span>
                          <span className="font-bold">{(i.product.price * i.quantity).toLocaleString()} ريال</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMarkReady(order.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                    >
                      <PackageCheck className="w-4 h-4" />
                      جاهز للاستلام والتسليم للمندوب 📦
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Ready / Dispatched */}
            <div className="space-y-3">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span>📦 جاهز وبانتظار / مع عامل التوصيل</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {readyOrders.length}
                </span>
              </h2>

              {readyOrders.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  لا توجد طلبات جاهزة حالياً
                </div>
              ) : (
                readyOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-xs text-slate-900">
                        #{order.orderNumber} - {order.customerName}
                      </div>
                      <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {order.status === 'ready' ? 'جاهز للاستلام' : 'مع عامل التوصيل 🚴'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      السائق: <strong className="text-slate-800">{order.driverName || 'جارٍ الإسناد'}</strong> ({order.driverPhone || '—'})
                    </div>

                    <div className="text-xs font-bold text-emerald-700">
                      المبلغ الإجمالي: {order.total.toLocaleString()} ريال
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menu / Inventory Tab */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">
              قائمة منتجات المتجر وحالة التوفر بالمخزون:
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              يمكنك تعطيل أي صنف بنقرة واحدة عند نفاده
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {storeProducts.map((prod) => (
              <div
                key={prod.id}
                className="border border-slate-200 rounded-2xl p-3 flex gap-3 items-center justify-between hover:border-slate-300 transition"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-14 h-14 rounded-xl object-cover border shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{prod.name}</h4>
                  <div className="font-extrabold text-amber-700 text-xs mt-0.5">
                    {prod.price.toLocaleString()} ريال
                  </div>
                  <div className="text-[10px] text-slate-400">
                    المتبقي: {prod.stockCount} قطعة | المباع: {prod.soldCount}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleProductStock(prod.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    prod.inStock
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  {prod.inStock ? '🟢 متوفر' : '🔴 غير متوفر'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Order Reason Modal */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-black text-base">
              <ShieldAlert className="w-5 h-5" />
              <span>رفض الطلب #{rejectModalOrder.orderNumber}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              يرجى تحديد سبب تعذر تجهيز الطلب ليتم إشعار العميل وإلغاء العملية بشكل لائق:
            </p>

            <div className="space-y-2">
              {[
                'ضغط عمل وزحام شديد حالياً',
                'نفاد بعض المكونات أو الأصناف المطلوبة',
                'انتهاء وقت العمل والدوام لهذا اليوم',
                'عنوان العميل خارج نطاق تغطية المتجر',
                'عطل فني مفاجئ في أجهزة التجهيز'
              ].map((reason) => (
                <label
                  key={reason}
                  onClick={() => setRejectReason(reason)}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                    rejectReason === reason
                      ? 'border-red-500 bg-red-50 text-red-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{reason}</span>
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="text-red-600"
                  />
                </label>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 shadow"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
