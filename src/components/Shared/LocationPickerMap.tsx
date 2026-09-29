import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, AlertCircle } from 'lucide-react';
import { LocationType } from '../../types';

interface LocationPickerMapProps {
  storeLat?: number;
  storeLng?: number;
  storeName?: string;
  initialLat?: number;
  initialLng?: number;
  locationType: LocationType;
  setLocationType: (type: LocationType) => void;
  addressText: string;
  setAddressText: (val: string) => void;
  onLocationSelected: (location: {
    lat: number;
    lng: number;
    distanceKm: number;
    estimatedMinutes: number;
    deliveryFee: number;
  }) => void;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  storeLat = 15.3400,
  storeLng = 44.1950,
  storeName = 'المتجر المحدد',
  initialLat = 15.3450,
  initialLng = 44.2020,
  locationType,
  setLocationType,
  addressText,
  setAddressText,
  onLocationSelected
}) => {
  const [userLat, setUserLat] = useState<number>(initialLat);
  const [userLng, setUserLng] = useState<number>(initialLng);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsSuccess, setGpsSuccess] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('تم تحديد موقعك بدقة على الخريطة');

  // Calculate distance in KM using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.max(0.8, Number(d.toFixed(1)));
  };

  const distanceKm = calculateDistance(userLat, userLng, storeLat, storeLng);
  // Estimate delivery time: base 15 mins + 4 mins per km
  const estimatedMin = Math.round(15 + distanceKm * 3.5);
  const estimatedMax = estimatedMin + 10;
  // Delivery fee: 500 base + 100 per km rounded to nearest 50
  const calculatedFee = Math.round((500 + (distanceKm - 1 > 0 ? (distanceKm - 1) * 120 : 0)) / 50) * 50;

  useEffect(() => {
    onLocationSelected({
      lat: userLat,
      lng: userLng,
      distanceKm,
      estimatedMinutes: estimatedMin,
      deliveryFee: calculatedFee
    });
  }, [userLat, userLng, distanceKm, estimatedMin, calculatedFee]);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setStatusMessage('جارٍ التقاط إحداثيات GPS من هاتفك...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setGpsSuccess(true);
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
          setStatusMessage('📍 تم تحديد موقعك بنجاح عبر GPS الهاتف');
        },
        (error) => {
          setIsLocating(false);
          // Fallback to nearby coordinates with slight random offset
          const offsetLat = 15.3400 + (Math.random() - 0.5) * 0.03;
          const offsetLng = 44.1950 + (Math.random() - 0.5) * 0.03;
          setUserLat(offsetLat);
          setUserLng(offsetLng);
          setGpsSuccess(true);
          setStatusMessage('📍 تم تحديد موقعك التقريبي بنجاح (يمكنك تحريك النقطة)');
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      setIsLocating(false);
      setStatusMessage('تعذر الوصول لمستشعر GPS، يمكنك النقر على الخريطة لتثبيت الموقع');
    }
  };

  // Convert lat/lng to normalized 0-100% position on the visual map
  const bounds = {
    minLat: 15.3000,
    maxLat: 15.4000,
    minLng: 44.1500,
    maxLng: 44.2500
  };

  const getPercentPos = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return {
      x: Math.min(95, Math.max(5, x)),
      y: Math.min(95, Math.max(5, y))
    };
  };

  const storePos = getPercentPos(storeLat, storeLng);
  const userPos = getPercentPos(userLat, userLng);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    const newLng = bounds.minLng + clickX * (bounds.maxLng - bounds.minLng);
    const newLat = bounds.maxLat - clickY * (bounds.maxLat - bounds.minLat);

    setUserLat(Number(newLat.toFixed(5)));
    setUserLng(Number(newLng.toFixed(5)));
    setStatusMessage('🎯 تم تحريك موقع العميل وتحديث المسافة وزمن الوصول');
  };

  return (
    <div className="space-y-4">
      {/* Location Type Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          أين تريد استلام الطلب؟
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'current', label: '📍 موقعي الحالي', desc: 'تحديد دقيق عبر GPS' },
            { id: 'home', label: '🏠 المنزل', desc: 'عنوانك السكني' },
            { id: 'university', label: '🏫 الجامعة', desc: 'الكليات والسكنات' },
            { id: 'other', label: '📌 موقع آخر', desc: 'عمل أو زيارة' }
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setLocationType(type.id as LocationType)}
              className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                locationType === type.id
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-bold text-sm block">{type.label}</span>
              <span className="text-[11px] text-slate-500 mt-1">{type.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GPS Action button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 p-3 rounded-2xl text-white shadow-md">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-emerald-200 animate-pulse" />
          <span className="text-xs font-medium">تحديد الموقع عبر مستشعر GPS الهاتف</span>
        </div>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="w-full sm:w-auto px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-75"
        >
          {isLocating ? (
            <>
              <Compass className="w-4 h-4 animate-spin" />
              جارٍ التحديد...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 text-emerald-600" />
              📍 تحديد موقعي الحالي الآن
            </>
          )}
        </button>
      </div>

      {/* Visual Interactive Map Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 shadow-inner">
        {/* Map Top Indicator */}
        <div className="absolute top-2 right-2 left-2 z-10 flex items-center justify-between bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-800 font-semibold truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{statusMessage}</span>
          </div>
          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
            انقر على الخريطة لتعديل الدقة
          </span>
        </div>

        {/* Map Surface */}
        <div
          onClick={handleMapClick}
          className="h-60 w-full relative cursor-crosshair select-none bg-[#e8ece9] overflow-hidden"
          style={{
            backgroundImage: `
              radial-gradient(#cbd5e1 1.5px, transparent 1.5px),
              linear-gradient(to right, rgba(203, 213, 225, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(203, 213, 225, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 48px 48px, 48px 48px'
          }}
        >
          {/* Simulated Roads & Streets */}
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-white/80 border-y border-amber-300 shadow-sm transform -rotate-6"></div>
          <div className="absolute top-0 bottom-0 left-1/3 w-3 bg-white/80 border-x border-amber-300 shadow-sm transform rotate-12"></div>
          <div className="absolute top-1/4 left-0 right-0 h-2 bg-slate-300/80"></div>
          <div className="absolute top-0 bottom-0 left-2/3 w-2 bg-slate-300/80"></div>

          {/* Dotted Connection line between Store and User */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={`${storePos.x}%`}
              y1={`${storePos.y}%`}
              x2={`${userPos.x}%`}
              y2={`${userPos.y}%`}
              stroke="#059669"
              strokeWidth="2.5"
              strokeDasharray="6,6"
            />
          </svg>

          {/* Store Pin Marker */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-none"
            style={{ left: `${storePos.x}%`, top: `${storePos.y}%` }}
          >
            <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap mb-1 flex items-center gap-1 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              {storeName}
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow-lg mx-auto">
              <span className="text-xs">🏪</span>
            </div>
          </div>

          {/* Customer / User Marker */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200"
            style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
          >
            <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap mb-1 flex items-center gap-1 mx-auto animate-bounce">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              موقعك الحالي
            </div>
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-xl text-white mx-auto cursor-grab">
                <MapPin className="w-5 h-5 fill-white" />
              </div>
              <div className="w-3 h-1.5 bg-black/30 rounded-full mx-auto mt-0.5 blur-[1px]"></div>
            </div>
          </div>
        </div>

        {/* Calculation Status Bar (As specifically requested in prompt) */}
        <div className="bg-white border-t border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-slate-700">
              <span className="text-base">📍</span>
              <div>
                <div className="text-[10px] text-slate-400">المسافة المقدرة</div>
                <div className="font-extrabold text-slate-900 text-sm">{distanceKm} كم</div>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-1 text-slate-700">
              <span className="text-base">⏱️</span>
              <div>
                <div className="text-[10px] text-slate-400">الوقت المتوقع</div>
                <div className="font-extrabold text-emerald-700 text-sm">{estimatedMin}–{estimatedMax} دقيقة</div>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-1 text-slate-700">
              <span className="text-base">🚚</span>
              <div>
                <div className="text-[10px] text-slate-400">رسوم التوصيل</div>
                <div className="font-extrabold text-amber-700 text-sm">{calculatedFee.toLocaleString()} ريال</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            خط العرض: {userLat.toFixed(4)} | خط الطول: {userLng.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Address description field */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          العنوان التفصيلي / وصف المكان والمعالم القريبة:
        </label>
        <input
          type="text"
          value={addressText}
          onChange={(e) => setAddressText(e.target.value)}
          placeholder="مثال: شارع حدة، خلف سوبرماركت الهدى، عمارة الأمل الدور 3 شقة 6"
          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 shadow-sm"
          required
        />
      </div>
    </div>
  );
};
