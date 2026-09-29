import React, { useState } from 'react';
import { X, Car, Users, MapPin, Calendar, Clock, PackageCheck, Send, CheckCircle2 } from 'lucide-react';
import { RidePurpose, CarType, RideBookingDetails } from '../../types';
import { useApp } from '../../context/AppContext';

interface CarRideBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPurpose?: RidePurpose;
}

export const CarRideBookingModal: React.FC<CarRideBookingModalProps> = ({
  isOpen,
  onClose,
  initialPurpose = 'family'
}) => {
  const { createRideOrder, customerName: appCustName, customerPhone: appCustPhone } = useApp();

  const [purpose, setPurpose] = useState<RidePurpose>(initialPurpose);
  const [customerName, setCustomerName] = useState<string>(appCustName || 'محمد اليمني');
  const [customerPhone, setCustomerPhone] = useState<string>(appCustPhone || '771234567');
  const [passengersCount, setPassengersCount] = useState<number>(purpose === 'cargo' || purpose === 'courier' ? 1 : 3);
  const [carType, setCarType] = useState<CarType>('economic');
  const [pickupLocation, setPickupLocation] = useState<string>('شارع حدة - جولة المصباحي');
  const [dropoffLocation, setDropoffLocation] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('12:00');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const purposeOptions: {
    id: RidePurpose;
    title: string;
    subtitle: string;
    icon: string;
    suggestedCar: CarType;
    basePrice: number;
  }[] = [
    {
      id: 'family',
      title: 'مشوار عائلي',
      subtitle: 'مشاوير العائلات والزيارات والأسواق بسيارات واسعة ومريحة',
      icon: '👨‍👩‍👧‍👦',
      suggestedCar: 'family_vip',
      basePrice: 3500
    },
    {
      id: 'airport',
      title: 'مشوار للمطار',
      subtitle: 'توصيل واستقبال صالة المطار مع متسع كامل للأمتعة والشنط',
      icon: '✈️',
      suggestedCar: 'family_vip',
      basePrice: 8000
    },
    {
      id: 'cargo',
      title: 'نقل أدوات وبضائع',
      subtitle: 'نقل الأثاث، المعدات، الأجهزة المنزلية بمركبات مجهزة وسائقين محترفين',
      icon: '📦',
      suggestedCar: 'cargo_pickup',
      basePrice: 6000
    },
    {
      id: 'courier',
      title: 'توصيل رسائل أو طرود',
      subtitle: 'توصيل المستندات المهمة والطرود السريعة من الباب إلى الباب بأمان تام',
      icon: '✉️',
      suggestedCar: 'express_bike',
      basePrice: 1500
    }
  ];

  const carTypeOptions: {
    id: CarType;
    name: string;
    seats: string;
    icon: string;
    priceMultiplier: number;
  }[] = [
    { id: 'economic', name: 'اقتصادية (سيدان)', seats: 'حتى 4 ركاب', icon: '🚗', priceMultiplier: 1.0 },
    { id: 'family_vip', name: 'عائلية VIP (ستيشن / فان)', seats: 'حتى 7 ركاب + أمتعة', icon: '🚙', priceMultiplier: 1.5 },
    { id: 'cargo_pickup', name: 'ونيت / دباب نقل أثاث', seats: 'سعة نقل حمولة 1 طن', icon: '🛻', priceMultiplier: 1.8 },
    { id: 'express_bike', name: 'دباب مشاوير سريع (موتور)', seats: 'راكب واحد أو طرد سريع', icon: '🛵', priceMultiplier: 0.7 }
  ];

  const selectedPurposeMeta = purposeOptions.find((p) => p.id === purpose) || purposeOptions[0];
  const selectedCarMeta = carTypeOptions.find((c) => c.id === carType) || carTypeOptions[0];

  const calculatedPrice = Math.round(selectedPurposeMeta.basePrice * selectedCarMeta.priceMultiplier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dropoffLocation.trim()) {
      alert('يرجى كتابة نقطة الوصول / الوجهة');
      return;
    }

    const bookingDetails: RideBookingDetails = {
      purpose,
      passengersCount,
      carType,
      pickupLocation,
      dropoffLocation,
      pickupCoords: { lat: 15.3400, lng: 44.1950 },
      dropoffCoords: { lat: 15.3600, lng: 44.2100 },
      date,
      time,
      notes,
      estimatedPrice: calculatedPrice
    };

    createRideOrder(bookingDetails, customerName, customerPhone);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              🚕
            </div>
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                طلب سيارة وخدمات النقل والمشاوير
              </h2>
              <p className="text-amber-100 text-xs mt-0.5">
                خدمة نقل فورية ومجدولة لكافة أغراض المشاوير والنقل داخل المدينة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-md">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-black text-slate-800">
              تم تأكيد حجز المشوار بنجاح!
            </h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              جارٍ إسناد أقرب سائق متاح إليك فوراً، يمكنك متابعة حالة المشوار والتواصل المباشر مع السائق من شاشة المتابعة.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5 max-w-sm mx-auto text-right">
              <div className="flex justify-between">
                <span className="text-slate-500">الغرض:</span>
                <span className="font-bold">{selectedPurposeMeta.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الوجهة:</span>
                <span className="font-bold">{dropoffLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الأجرة المقدرة:</span>
                <span className="font-extrabold text-amber-700">{calculatedPrice.toLocaleString()} ريال</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-md text-sm"
              >
                متابعة في التطبيق
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Select Purpose (As requested by user: 1 مشوار عائلي 2 مشوار للمطار 3 نقل ادوات 4 توصيل رسائل أو طرود) */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-2">
                1. حدد الغرض من خدمتنا:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {purposeOptions.map((opt, idx) => {
                  const isSelected = purpose === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setPurpose(opt.id);
                        setCarType(opt.suggestedCar);
                        if (opt.id === 'cargo' || opt.id === 'courier') {
                          setPassengersCount(1);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-xl shrink-0">
                        {opt.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">
                            {idx + 1}. {opt.title}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">
                              محدد
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {opt.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Car Type */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-2">
                2. اختر نوع السيارة / المركبة:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {carTypeOptions.map((car) => (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => setCarType(car.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      carType === car.id
                        ? 'border-amber-600 bg-amber-500 text-white font-bold shadow-md'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{car.icon}</span>
                    <span className="text-xs font-bold leading-tight">{car.name}</span>
                    <span className={`text-[10px] mt-0.5 ${carType === car.id ? 'text-amber-100' : 'text-slate-500'}`}>
                      {car.seats}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Customer Details & Passengers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الاسم الكامل:
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="اسم صاحب الحجز"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف (للتواصل):
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="77XXXXXXX"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عدد الركاب / الأشخاص:
                </label>
                <div className="flex items-center justify-between border border-slate-300 rounded-xl bg-slate-50 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setPassengersCount((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 bg-white rounded-lg border text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-sm text-slate-800">
                    {passengersCount} {passengersCount === 1 ? 'شخص' : 'أشخاص'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPassengersCount((prev) => Math.min(10, prev + 1))}
                    className="w-7 h-7 bg-white rounded-lg border text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: Locations */}
            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    نقطة الانطلاق (مكان تواجدك):
                  </label>
                  <button
                    type="button"
                    onClick={() => setPickupLocation('📍 شارع حدة - موقعي الحالي عبر GPS')}
                    className="text-[11px] text-emerald-700 font-bold hover:underline"
                  >
                    📍 استخدام موقعي الحالي
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="مثال: شارع الستين، بالقرب من جولة عمران"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  الوجهة / نقطة الوصول:
                </label>
                <input
                  type="text"
                  required
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  placeholder="مثال: مطار صنعاء الدولي، أو حي الأصبحي، أو جامعة العلوم"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Step 5: Schedule & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  تاريخ المشوار:
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  وقت الانطلاق المطلوب:
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ملاحظات إضافية (أمتعة، تفاصيل البضاعة، مواعيد دقيقة):
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي توضيحات للسائق..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Price Preview & Action */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-amber-800 font-semibold">الأجرة التقديرية للخدمة:</div>
                <div className="text-xl font-black text-amber-900">
                  {calculatedPrice.toLocaleString()} <span className="text-xs font-bold">ريال يمني</span>
                </div>
                <div className="text-[10px] text-amber-700">شامل السائق، الوقود، والتوصيل من الباب إلى الباب</div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold transition flex-1 sm:flex-none"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  تأكيد حجز المشوار الآن
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
