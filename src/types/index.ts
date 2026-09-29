export type StoreCategory = 
  | 'restaurants' 
  | 'pharmacies' 
  | 'groceries' 
  | 'student_services' 
  | 'car_ride';

export type StoreStatus = 'available' | 'busy' | 'closed' | 'paused';

export interface Store {
  id: string;
  name: string;
  category: StoreCategory;
  description: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  deliveryBaseFee: number;
  status: StoreStatus;
  image: string;
  banner: string;
  address: string;
  phone: string;
  isOpen: boolean;
  lat: number;
  lng: number;
  workingHours: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  stockCount: number;
  soldCount: number;
  isFeatured?: boolean;
}

export type OrderStatus = 
  | 'new'          // جديد 🔔
  | 'confirmed'    // تم التأكيد ✅
  | 'preparing'    // قيد التجهيز 👨‍🍳
  | 'ready'        // جاهز للاستلام 📦
  | 'with_driver'  // مع عامل التوصيل 🛵
  | 'on_the_way'   // في الطريق 🚴
  | 'arrived'      // وصلت إلى موقع العميل 📍
  | 'delivered'    // تم التسليم 🎉
  | 'cancelled';   // ملغي ❌

export type PaymentMethod = 'kuraimi' | 'qutaibi' | 'cash_on_delivery';

export type LocationType = 'current' | 'home' | 'university' | 'other';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type RidePurpose = 'family' | 'airport' | 'cargo' | 'courier';
export type CarType = 'economic' | 'family_vip' | 'cargo_pickup' | 'express_bike';

export interface RideBookingDetails {
  purpose: RidePurpose;
  passengersCount: number;
  carType: CarType;
  pickupLocation: string;
  dropoffLocation: string;
  pickupCoords?: { lat: number; lng: number };
  dropoffCoords?: { lat: number; lng: number };
  date: string;
  time: string;
  notes?: string;
  estimatedPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  locationType: LocationType;
  customerLocation: {
    lat: number;
    lng: number;
    addressName: string;
  };
  distanceKm: number;
  estimatedTimeMinutes: number;
  storeId: string;
  storeName: string;
  storeCategory: StoreCategory;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentProofImage?: string;
  paymentVerified: boolean;
  status: OrderStatus;
  createdAt: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  cancelReason?: string;
  rideDetails?: RideBookingDetails;
}

export type DriverStatus = 'available' | 'on_mission' | 'offline';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehiclePlate: string;
  status: DriverStatus;
  activeOrdersCount: number;
  todayDelivered: number;
  todayCashCollected: number;
  todayDeliveryFeesEarned: number;
  rating: number;
  lat: number;
  lng: number;
  avatar: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: 'order' | 'price' | 'inventory' | 'store' | 'driver' | 'payment';
}

export interface DriverIssueReport {
  id: string;
  orderId: string;
  orderNumber: string;
  driverId: string;
  driverName: string;
  reason: string;
  note: string;
  timestamp: string;
  resolved: boolean;
}
