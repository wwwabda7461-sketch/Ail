import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, ShieldCheck, Upload, Copy, Check, AlertCircle, ShoppingBag, Edit3 } from 'lucide-react';
import { PaymentMethod, LocationType, Order } from '../../types';
import { useApp } from '../../context/AppContext';
import { LocationPickerMap } from '../Shared/LocationPickerMap';
import { BANK_ACCOUNTS } from '../../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    cart,
    stores,
    cartStoreId,
    createOrder,
    customerName: initialName,
    customerPhone: initialPhone,
    setCustomerName: saveCustomerName,
    setCustomerPhone: saveCustomerPhone
  } = useApp();

  // Multi-step checkout: 'details' (customer + location) -> 'payment' -> 'review'
  const [currentStep, setCurrentStep] = useState<'details' | 'payment' | 'review'>('details');

  // Customer Form State
  const [name, setName] = useState<string>(initialName || 'محمد علي');
  const [phone, setPhone] = useState<string>(initialPhone || '771234567');
  const [locationType, setLocationType] = useState<LocationType>('current');
  const [addressText, setAddressText] = useState<string>('شارع حدة، أمام مركز الكميم، عمارة السلام');
  const [notes, setNotes] = useState<string>('');

  // Location Calculation State from Map
  const [locationData, setLocationData] = useState<{
    lat: number;
    lng: number;
    distanceKm: number;
    estimatedMinutes: number;
    deliveryFee: number;
  }>({
    lat: 15.3450,
    lng: 44.2020,
    distanceKm: 2.5,
    estimatedMinutes: 25,
    deliveryFee: 650
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [paymentReceiptImage, setPaymentReceiptImage] = useState<string | null>(null);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStore = stores.find((s) => s.id === cartStoreId) || stores[0];

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = locationData.deliveryFee || currentStore?.deliveryBaseFee || 500;
  const grandTotal = subtotal + deliveryFee;

  const handleCopyAccount = (bankKey: 'kuraimi' | 'qutaibi') => {
    const accNumber = BANK_ACCOUNTS[bankKey].accountNumber;
    navigator.clipboard.writeText(accNumber);
    setCopiedBank(bankKey);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmOrder = () => {
    saveCustomerName(name);
    saveCustomerPhone(phone);

    const created = createOrder({
      customerName: name,
      customerPhone: phone,
      deliveryAddress: addressText,
      deliveryNotes: notes,
      locationType,
      customerLocation: {
        lat: locationData.lat,
        lng: locationData.lng,
        addressName: addressText
      },
      distanceKm: locationData.distanceKm,
      estimatedTimeMinutes: locationData.estimatedMinutes,
      storeId: currentStore?.id || 'store-1',
      storeName: currentStore?.name || 'متجر تساهيل',
      storeCategory: currentStore?.category || 'restaurants',
      items: cart,
      subtotal,
      deliveryFee,
      total: grandTotal,
      paymentMethod,
      paymentProofImage: paymentReceiptImage || undefined
    });

    onOrderSuccess(created);
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'kuraimi':
        return '💳 تحويل بنكي عبر الكريمي جوال (ام فلوس)';
      case 'qutaibi':
        return '💳 تحويل بنكي عبر بنك القطيبي الإسلامي';
      case 'cash_on_delivery':
        return '💵 الدفع نقدًا عند الاستلام (لدى عامل التوصيل)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
              ✓
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">
                {currentStep === 'details' && 'تأكيد موقعك وبيانات التوصيل'}
                {currentStep === 'payment' && 'اختيار طريقة الدفع'}
                {currentStep === 'review' && 'راجع طلبك قبل التأكيد'}
              </h2>
              <p className="text-xs text-slate-400">
                المتجر: {currentStore?.name} • الإجمالي: {grandTotal.toLocaleString()} ريال
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold shrink-0">
          <div className={`flex items-center gap-1.5 ${currentStep === 'details' ? 'text-amber-600' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 'details' ? 'bg-amber-600 text-white' : 'bg-slate-200'}`}>1</span>
            بيانات الموقع والعميل
          </div>
          <span className="text-slate-300">←</span>
          <div className={`flex items-center gap-1.5 ${currentStep === 'payment' ? 'text-amber-600' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 'payment' ? 'bg-amber-600 text-white' : 'bg-slate-200'}`}>2</span>
            طريقة الدفع
          </div>
          <span className="text-slate-300">←</span>
          <div className={`flex items-center gap-1.5 ${currentStep === 'review' ? 'text-emerald-700' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 'review' ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>3</span>
            مراجعة وتأكيد
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* STEP 1: Details & Location */}
          {currentStep === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الاسم الكامل:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسم مستلم الطلب"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الهاتف:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="77XXXXXXX"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Interactive Location Picker Map */}
              <LocationPickerMap
                storeLat={currentStore?.lat}
                storeLng={currentStore?.lng}
                storeName={currentStore?.name}
                locationType={locationType}
                setLocationType={setLocationType}
                addressText={addressText}
                setAddressText={setAddressText}
                onLocationSelected={setLocationData}
              />

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ملاحظات إضافية للطلب أو سائق التوصيل:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: بدون فلفل حار، الاتصال فور الوصول للباب، تجليد ليزر دقيق..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Payment Method */}
          {currentStep === 'payment' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-800 mb-2">
                  اختر طريقة الدفع المناسبة:
                </label>
                <div className="space-y-2.5">
                  {/* Option 1: Kuraimi */}
                  <div
                    onClick={() => setPaymentMethod('kuraimi')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'kuraimi'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-sm shadow-sm">
                          الكريمي
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">
                            1. 💳 عبر حسابنا في بنك الكريمي
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            التحويل عبر الكريمي جوال (ام فلوس) مع إرفاق الإشعار
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === 'kuraimi'}
                        onChange={() => setPaymentMethod('kuraimi')}
                        className="text-emerald-600 w-4 h-4"
                      />
                    </div>

                    {paymentMethod === 'kuraimi' && (
                      <div className="mt-3 pt-3 border-t border-emerald-200 text-xs text-slate-700 space-y-2 bg-white p-3 rounded-xl border">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">رقم الحساب:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {BANK_ACCOUNTS.kuraimi.accountNumber}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyAccount('kuraimi');
                              }}
                              className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold text-[11px]"
                            >
                              {copiedBank === 'kuraimi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              {copiedBank === 'kuraimi' ? 'تم النسخ' : 'نسخ الرقم'}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">اسم الحساب:</span>
                          <span className="font-bold text-slate-800">{BANK_ACCOUNTS.kuraimi.accountName}</span>
                        </div>
                        <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg leading-relaxed">
                          {BANK_ACCOUNTS.kuraimi.instructions}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Qutaibi */}
                  <div
                    onClick={() => setPaymentMethod('qutaibi')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'qutaibi'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-black flex items-center justify-center text-sm shadow-sm">
                          القطيبي
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">
                            2. 💳 عبر حسابنا في بنك القطيبي
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            التحويل عبر تطبيق القطيبي لحظات مع إرفاق الإشعار
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === 'qutaibi'}
                        onChange={() => setPaymentMethod('qutaibi')}
                        className="text-emerald-600 w-4 h-4"
                      />
                    </div>

                    {paymentMethod === 'qutaibi' && (
                      <div className="mt-3 pt-3 border-t border-emerald-200 text-xs text-slate-700 space-y-2 bg-white p-3 rounded-xl border">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">رقم الحساب:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {BANK_ACCOUNTS.qutaibi.accountNumber}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyAccount('qutaibi');
                              }}
                              className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold text-[11px]"
                            >
                              {copiedBank === 'qutaibi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              {copiedBank === 'qutaibi' ? 'تم النسخ' : 'نسخ الرقم'}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">اسم الحساب:</span>
                          <span className="font-bold text-slate-800">{BANK_ACCOUNTS.qutaibi.accountName}</span>
                        </div>
                        <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg leading-relaxed">
                          {BANK_ACCOUNTS.qutaibi.instructions}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 3: Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-sm shadow-sm">
                          💵
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">
                            3. 💵 الدفع لدى عامل التوصيل (نقدًا عند الاستلام)
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            ادفع نقدًا عند وصول عامل التوصيل واستلام الطلب يدًا بيد
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={() => setPaymentMethod('cash_on_delivery')}
                        className="text-emerald-600 w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload payment receipt if bank transfer */}
              {(paymentMethod === 'kuraimi' || paymentMethod === 'qutaibi') && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    رفع صورة إشعار التحويل البنكي
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    يرجى تصوير أو إرفاق لقطة شاشة من تطبيق البنك تثبت نجاح عملية التحويل لتسجيلها واعتماد الطلب من الإدارة.
                  </p>

                  <div className="pt-1">
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      اختر صورة الإشعار
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {paymentReceiptImage && (
                    <div className="mt-3 p-2 bg-white rounded-xl border border-slate-200 inline-block text-right">
                      <div className="text-[10px] text-emerald-600 font-bold mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> تم تجهيز صورة الإشعار بنجاح
                      </div>
                      <img
                        src={paymentReceiptImage}
                        alt="Receipt preview"
                        className="w-32 h-32 object-cover rounded-lg border mx-auto"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Review Order (As specifically requested in prompt #6: راجع طلبك قبل التأكيد) */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  راجع تفاصيل الطلب وتأكد من صحة البيانات قبل إرساله إلى المتجر وعامل التوصيل.
                </span>
              </div>

              {/* Summary Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 text-xs shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">اسم العميل:</span>
                  <span className="font-extrabold text-slate-900">{name}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">رقم الهاتف:</span>
                  <span className="font-mono font-bold text-slate-900" dir="ltr">{phone}</span>
                </div>

                <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">الموقع والعنوان:</span>
                  <span className="font-bold text-slate-800 text-left max-w-xs">{addressText}</span>
                </div>

                {/* Items & quantities list */}
                <div className="py-2 border-b border-slate-100">
                  <div className="text-slate-500 font-medium mb-2">المنتجات والكميات:</div>
                  <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center text-xs">
                        <span className="text-slate-800 font-medium">
                          {item.product.name} <span className="font-bold text-amber-700">× {item.quantity}</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {(item.product.price * item.quantity).toLocaleString()} ريال
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">سعر المنتجات (المجموع):</span>
                  <span className="font-bold text-slate-900">{subtotal.toLocaleString()} ريال</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">رسوم التوصيل ({locationData.distanceKm} كم):</span>
                  <span className="font-bold text-amber-700">{deliveryFee.toLocaleString()} ريال</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">طريقة الدفع:</span>
                  <span className="font-bold text-emerald-800">{getPaymentMethodLabel(paymentMethod)}</span>
                </div>

                {notes && (
                  <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">ملاحظات العميل:</span>
                    <span className="text-slate-700 text-left max-w-xs">{notes}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-sm font-black">
                  <span className="text-slate-900">الإجمالي النهائي:</span>
                  <span className="text-emerald-700 text-base">{grandTotal.toLocaleString()} ريال</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          {currentStep === 'details' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!name.trim() || !phone.trim() || !addressText.trim()) {
                    alert('يرجى ملء جميع البيانات الأساسية والموقع');
                    return;
                  }
                  setCurrentStep('payment');
                }}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center gap-1.5 active:scale-95"
              >
                متابعة لطريقة الدفع
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </>
          )}

          {currentStep === 'payment' && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep('details')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
              >
                ← العودة للموقع
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep('review')}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center gap-1.5 active:scale-95"
              >
                مراجعة الطلب
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </>
          )}

          {/* Review Step: Buttons: ✅ تأكيد الطلب | ❌ تعديل الطلب as requested */}
          {currentStep === 'review' && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep('details')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                ❌ تعديل الطلب
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-lg hover:shadow-xl transition flex items-center gap-2 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                ✅ تأكيد الطلب وإرساله الآن
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
