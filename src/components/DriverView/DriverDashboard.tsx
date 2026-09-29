import React, { useState } from 'react';
import {
  Bike,
  Package,
  CheckCircle2,
  DollarSign,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Wallet,
  Clock,
  Send,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const DriverDashboard: React.FC = () => {
  const {
    drivers,
    selectedDriverId,
    setSelectedDriverId,
    orders,
    updateOrderStatus,
    updateDriverStatus,
    reportIssue,
    setRole
  } = useApp();

  const currentDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];

  // Active orders assigned to this driver
  const driverOrders = orders.filter((o) => o.driverId === currentDriver.id);
  const activeOrders = driverOrders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );
  const deliveredOrders = driverOrders.filter((o) => o.status === 'delivered');

  // Issue reporting modal state
  const [issueModalOrder, setIssueModalOrder] = useState<Order | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('العميل لا يرد على الاتصال');
  const [issueNote, setIssueNote] = useState<string>('');
  const [issueSuccess, setIssueSuccess] = useState<boolean>(false);

  // Handover / settlement request state
  const [settlementRequested, setSettlementRequested] = useState<boolean>(false);

  const handleStepForward = (order: Order) => {
    switch (order.status) {
      case 'new':
      case 'confirmed':
      case 'ready':
      case 'preparing':
        updateOrderStatus(order.id, 'with_driver');
        break;
      case 'with_driver':
        updateOrderStatus(order.id, 'on_the_way');
        break;
      case 'on_the_way':
        updateOrderStatus(order.id, 'arrived');
        break;
      case 'arrived':
        updateOrderStatus(order.id, 'delivered');
        break;
    }
  };

  const handleSendIssue = () => {
    if (issueModalOrder) {
      reportIssue(issueModalOrder.id, currentDriver.id, selectedReason, issueNote);
      setIssueSuccess(true);
      setTimeout(() => {
        setIssueSuccess(false);
        setIssueModalOrder(null);
        setIssueNote('');
      }, 1500);
    }
  };

  const openNavigationUrl = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ' صنعاء')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Driver Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-5 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 border border-amber-600/30">
        <div className="flex items-center gap-4">
          <img
            src={currentDriver.avatar}
            alt={currentDriver.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                🚴 سائق معتمد
              </span>
              <span className="text-xs text-amber-200">{currentDriver.vehicleType} • {currentDriver.vehiclePlate}</span>
            </div>
            <h1 className="text-xl font-black mt-1">
              مرحبًا بك يا كابتن {currentDriver.name} 👋
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              هاتفك: {currentDriver.phone} • التقييم: ⭐ {currentDriver.rating}
            </p>
          </div>
        </div>

        {/* Driver Selector & Status Switcher */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Buttons */}
          <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => updateDriverStatus(currentDriver.id, 'available')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                currentDriver.status === 'available'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              متاح للعمل 🟢
            </button>
            <button
              onClick={() => updateDriverStatus(currentDriver.id, 'on_mission')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                currentDriver.status === 'on_mission'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-300"></span>
              في مهمة 🟡
            </button>
            <button
              onClick={() => updateDriverStatus(currentDriver.id, 'offline')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                currentDriver.status === 'offline'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-300"></span>
              غير متاح 🔴
            </button>
          </div>

          {/* Direct Role Switch Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition shadow-sm active:scale-95"
            >
              📱 تطبيق العميل
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition shadow-sm active:scale-95"
            >
              👨‍💼 لوحة المسؤول
            </button>
          </div>

          {/* Test Switch Driver */}
          <select
            value={currentDriver.id}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white outline-none"
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id} className="text-slate-900">
                {d.name} ({d.vehicleType})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Header KPI Summary Cards (As requested in prompt #1) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-right">
          <div className="text-[11px] text-slate-500 font-bold">طلبات اليوم المسندة</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {driverOrders.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">إجمالي مهامك اليوم</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-right">
          <div className="text-[11px] text-emerald-700 font-bold">تم التسليم بنجاح</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {currentDriver.todayDelivered}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">✅ اكتملت</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-right">
          <div className="text-[11px] text-amber-700 font-bold">الطلبات المتبقية</div>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {activeOrders.length}
          </div>
          <div className="text-[10px] text-amber-600 mt-0.5">قيد التنفيذ حالياً</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-right">
          <div className="text-[11px] text-slate-500 font-bold">المبالغ المحصلة (كاش)</div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {currentDriver.todayCashCollected.toLocaleString()} <span className="text-xs">ريال</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">عهدة نقدية للمسؤول</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-right col-span-2 sm:col-span-1">
          <div className="text-[11px] text-teal-700 font-bold">أرباح رسوم التوصيل</div>
          <div className="text-xl font-black text-teal-700 mt-1">
            {currentDriver.todayDeliveryFeesEarned.toLocaleString()} <span className="text-xs">ريال</span>
          </div>
          <div className="text-[10px] text-teal-600 mt-0.5">مكافآت التوصيل</div>
        </div>
      </div>

      {/* 2. Active Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" />
            <span>الطلبات المسندة إليك قيد التنفيذ ({activeOrders.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            تحديث فوري للمسؤول والعميل عند ضغط أي زر
          </span>
        </div>

        {activeOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 shadow-sm space-y-2">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-3xl">
              🛵
            </div>
            <h3 className="text-sm font-bold text-slate-700">لا توجد طلبات جارية مسندة إليك حالياً</h3>
            <p className="text-xs text-slate-400">
              سيظهر هنا أي طلب جديد بمجرد إسناده إليك من قبل النظام أو المسؤول
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {activeOrders.map((order) => {
              const isCollectCash = order.paymentMethod === 'cash_on_delivery';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-md space-y-4 hover:border-amber-400 transition"
                >
                  {/* Top Bar of Order Card */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black bg-slate-900 text-white px-2.5 py-1 rounded-xl">
                        طلب #{order.orderNumber}
                      </span>
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {order.status === 'new' && 'جديد وبانتظار الاستلام'}
                        {order.status === 'confirmed' && 'تم التأكيد من المتجر'}
                        {order.status === 'preparing' && 'قيد التجهيز في المتجر'}
                        {order.status === 'ready' && 'جاهز للاستلام من المتجر 📦'}
                        {order.status === 'with_driver' && 'تم الاستلام - جارٍ التحرك'}
                        {order.status === 'on_the_way' && 'في الطريق إلى العميل 🚴'}
                        {order.status === 'arrived' && 'وصلت إلى موقع العميل 📍'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        المسافة: <strong>{order.distanceKm} كم</strong>
                      </span>
                      <span>•</span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        المطلوب تحصيله: {isCollectCash ? `${order.total.toLocaleString()} ريال نقدًا` : 'مدفوع إلكترونيًا'}
                      </span>
                    </div>
                  </div>

                  {/* Main Grid: Store & Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Store Info */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="text-base">🏪</span>
                          نقطة الاستلام (المتجر):
                        </span>
                        <button
                          type="button"
                          onClick={() => openNavigationUrl(order.storeName)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-bold flex items-center gap-1 text-[11px]"
                        >
                          <Navigation className="w-3.5 h-3.5 text-blue-600" />
                          🧭 فتح الطريق للمتجر
                        </button>
                      </div>
                      <div className="font-extrabold text-sm text-slate-900">
                        {order.storeName}
                      </div>
                      <div className="text-slate-500">
                        الأصناف: {order.items.length > 0 ? order.items.map((i) => `${i.product.name} (${i.quantity})`).join('، ') : order.deliveryNotes}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="text-base">📍</span>
                          نقطة التسليم (العميل):
                        </span>
                        <button
                          type="button"
                          onClick={() => openNavigationUrl(order.deliveryAddress)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-bold flex items-center gap-1 text-[11px]"
                        >
                          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                          🧭 فتح موقع العميل
                        </button>
                      </div>
                      <div className="font-extrabold text-sm text-slate-900">
                        {order.customerName}
                      </div>
                      <div className="text-slate-600 font-medium">
                        العنوان: {order.deliveryAddress}
                      </div>
                      {order.deliveryNotes && (
                        <div className="text-amber-800 text-[11px] bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                          ملاحظات العميل: {order.deliveryNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Communication Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    {/* Call & WhatsApp & Issue */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                      >
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span>📞 اتصال بالعميل</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          const msg = encodeURIComponent(
                            `مرحباً أخي ${order.customerName}، أنا كابتن تساهيل ${currentDriver.name}، بخصوص طلبك #${order.orderNumber}`
                          );
                          window.open(`https://wa.me/967${order.customerPhone}?text=${msg}`, '_blank');
                        }}
                        className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-4 h-4 text-teal-600" />
                        <span>💬 واتساب</span>
                      </button>

                      {/* ⚠️ مشكلة أثناء التوصيل button */}
                      <button
                        type="button"
                        onClick={() => setIssueModalOrder(order)}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span>⚠️ إبلاغ عن مشكلة</span>
                      </button>
                    </div>

                    {/* Sequential Progress Action Buttons (As requested: استلام الطلب -> في الطريق -> وصلت للعميل -> تم التسليم) */}
                    <div className="w-full sm:w-auto">
                      {(order.status === 'new' || order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready') && (
                        <button
                          type="button"
                          onClick={() => handleStepForward(order)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                        >
                          <span>🟢 استلام الطلب من المتجر</span>
                        </button>
                      )}

                      {order.status === 'with_driver' && (
                        <button
                          type="button"
                          onClick={() => handleStepForward(order)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                        >
                          <span>🚴 في الطريق إلى العميل</span>
                        </button>
                      )}

                      {order.status === 'on_the_way' && (
                        <button
                          type="button"
                          onClick={() => handleStepForward(order)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                        >
                          <span>📍 وصلت إلى موقع العميل</span>
                        </button>
                      )}

                      {order.status === 'arrived' && (
                        <button
                          type="button"
                          onClick={() => handleStepForward(order)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✅ تم تسليم الطلب وتحصيل المبلغ</span>
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

      {/* 5. Wallet & Cash Handover to Admin (As requested in prompt #5 & #6) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                حساباتي والعهدة النقدية المحصلة من العملاء
              </h3>
              <p className="text-xs text-slate-500">
                المبالغ النقدية الموجودة بحوزتك لتوريدها للمسؤول
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 font-bold">إجمالي المبلغ في حوزتك:</div>
            <div className="text-2xl font-black text-amber-700">
              {currentDriver.todayCashCollected.toLocaleString()} <span className="text-xs">ريال</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-amber-900 space-y-0.5">
            <div className="font-bold">ملاحظة أمان وتوريد:</div>
            <div className="text-[11px] text-amber-800">
              العامل يطلب تسليم المبلغ، والمسؤول هو فقط من يمتلك صلاحية تأكيد الاستلام وتصفير الحساب في النظام مع حفظ السجل في المحاسبة.
            </div>
          </div>

          {currentDriver.todayCashCollected > 0 && (
            <button
              type="button"
              disabled={settlementRequested}
              onClick={() => {
                setSettlementRequested(true);
                setTimeout(() => setSettlementRequested(false), 4000);
              }}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow transition active:scale-95 whitespace-nowrap"
            >
              {settlementRequested ? '✓ تم إرسال إشعار التوريد للمسؤول' : '💰 طلب تسليم المبلغ للمسؤول'}
            </button>
          )}
        </div>
      </div>

      {/* ⚠️ Issue Reporting Modal */}
      {issueModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-black text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>إبلاغ المسؤول عن مشكلة في الطلب #{issueModalOrder.orderNumber}</span>
            </div>

            {issueSuccess ? (
              <div className="p-6 text-center text-emerald-600 font-bold text-sm">
                ✓ تم إرسال البلاغ مباشرة إلى لوحة المسؤول للمتابعة والتدخل!
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600">
                  حدد المشكلة التي واجهتك أثناء التوصيل:
                </p>

                <div className="space-y-2">
                  {[
                    'العميل لا يرد على الاتصال',
                    'الموقع المسجل غير صحيح أو بعيد جداً',
                    'العميل طلب إلغاء الطلب عند الوصول',
                    'المتجر تأخر في التجهيز أو أخطأ في الأصناف',
                    'مشكلة في الدفع أو رفض السداد كاش',
                    'تعذر الوصول بسبب إغلاق الطرق أو حاجز أمني',
                    'مشكلة أخرى'
                  ].map((reason) => (
                    <label
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                        selectedReason === reason
                          ? 'border-red-500 bg-red-50 text-red-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{reason}</span>
                      <input
                        type="radio"
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="text-red-600"
                      />
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    توضيح إضافي للمسؤول:
                  </label>
                  <textarea
                    rows={2}
                    value={issueNote}
                    onChange={(e) => setIssueNote(e.target.value)}
                    placeholder="اكتب أي تفاصيل مهمة هنا..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIssueModalOrder(null)}
                    className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={handleSendIssue}
                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 shadow"
                  >
                    إرسال البلاغ للمسؤول
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
