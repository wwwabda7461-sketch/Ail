import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Store,
  Product,
  Order,
  Driver,
  CartItem,
  OrderStatus,
  ActivityLog,
  DriverIssueReport,
  StoreStatus,
  RideBookingDetails
} from '../types';
import {
  INITIAL_STORES,
  INITIAL_PRODUCTS,
  INITIAL_DRIVERS,
  INITIAL_ORDERS,
  INITIAL_ACTIVITY_LOGS
} from '../data/mockData';

export type UserRole = 'customer' | 'merchant' | 'driver' | 'admin';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  selectedStoreId: string;
  setSelectedStoreId: (id: string) => void;
  selectedDriverId: string;
  setSelectedDriverId: (id: string) => void;

  // Stores
  stores: Store[];
  updateStoreStatus: (storeId: string, status: StoreStatus) => void;
  updateStoreDetails: (store: Store) => void;
  addStore: (store: Store) => void;

  // Products & Inventory
  products: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  restockProduct: (productId: string, quantityToAdd: number) => void;
  toggleProductStock: (productId: string) => void;

  // Drivers
  drivers: Driver[];
  updateDriverStatus: (driverId: string, status: Driver['status']) => void;
  settleDriverCash: (driverId: string, note?: string) => void;
  addDriver: (driver: Driver) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'paymentVerified'>) => Order;
  createRideOrder: (details: RideBookingDetails, customerName: string, customerPhone: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;
  assignDriverToOrder: (orderId: string, driverId: string) => void;
  autoAssignBestDriver: (orderId: string) => boolean;
  verifyOrderPayment: (orderId: string, verified: boolean) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;

  // Driver Issues
  driverIssues: DriverIssueReport[];
  reportIssue: (orderId: string, driverId: string, reason: string, note: string) => void;
  resolveIssue: (issueId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartStoreId: string | null;

  // Logs & Stats
  activityLogs: ActivityLog[];
  addActivityLog: (user: string, action: string, type: ActivityLog['type']) => void;
  statsResetDate: string | null;
  resetCurrentPeriodStats: () => void;

  // Customer Profile & Phone
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STORES: 'tasaheel_stores_v1',
  PRODUCTS: 'tasaheel_products_v1',
  DRIVERS: 'tasaheel_drivers_v1',
  ORDERS: 'tasaheel_orders_v1',
  LOGS: 'tasaheel_logs_v1',
  RESET_DATE: 'tasaheel_reset_date_v1',
  CART: 'tasaheel_cart_v1',
  ISSUES: 'tasaheel_issues_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('rest-1');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('drv-1');

  // Customer Auth
  const [customerPhone, setCustomerPhone] = useState<string>('771234567');
  const [customerName, setCustomerName] = useState<string>('ضيف تساهيل');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Load state from localStorage or initial
  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORES);
      return saved ? JSON.parse(saved) : INITIAL_STORES;
    } catch {
      return INITIAL_STORES;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRIVERS);
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
    } catch {
      return INITIAL_DRIVERS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [driverIssues, setDriverIssues] = useState<DriverIssueReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ISSUES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [statsResetDate, setStatsResetDate] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.RESET_DATE);
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    return orders.length > 0 ? orders[0] : null;
  });

  // Save changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(driverIssues));
  }, [driverIssues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const addActivityLog = (user: string, action: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      user,
      action,
      timestamp: 'الآن',
      type
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 50)]);
  };

  // Cart operations
  const cartStoreId = cart.length > 0 ? cart[0].product.storeId : null;

  const addToCart = (product: Product) => {
    setCart(prev => {
      // If item from another store, optionally reset or add
      if (prev.length > 0 && prev[0].product.storeId !== product.storeId) {
        // clear previous store cart items and start new
        return [{ product, quantity: 1 }];
      }
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Store actions
  const updateStoreStatus = (storeId: string, status: StoreStatus) => {
    setStores(prev =>
      prev.map(s => (s.id === storeId ? { ...s, status, isOpen: status === 'available' || status === 'busy' } : s))
    );
    const store = stores.find(s => s.id === storeId);
    addActivityLog('المسؤول', `تغيير حالة متجر ${store?.name || storeId} إلى ${status}`, 'store');
  };

  const updateStoreDetails = (updatedStore: Store) => {
    setStores(prev => prev.map(s => (s.id === updatedStore.id ? updatedStore : s)));
    addActivityLog('المسؤول', `تحديث بيانات متجر ${updatedStore.name}`, 'store');
  };

  const addStore = (store: Store) => {
    setStores(prev => [store, ...prev]);
    addActivityLog('المسؤول', `إضافة متجر جديد: ${store.name}`, 'store');
  };

  // Product & Inventory actions
  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => {
      const old = prev.find(p => p.id === updatedProduct.id);
      if (old && old.price !== updatedProduct.price) {
        addActivityLog('المسؤول', `تعديل سعر ${updatedProduct.name} من ${old.price} إلى ${updatedProduct.price} ريال`, 'price');
      }
      return prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p));
    });
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    addActivityLog('المسؤول', `إضافة منتج جديد: ${product.name}`, 'inventory');
  };

  const restockProduct = (productId: string, quantityToAdd: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newStock = (p.stockCount || 0) + quantityToAdd;
          return {
            ...p,
            stockCount: newStock,
            inStock: newStock > 0
          };
        }
        return p;
      })
    );
    const prod = products.find(p => p.id === productId);
    addActivityLog('المسؤول', `إضافة ${quantityToAdd} قطعة لمخزون المنتج ${prod?.name || productId}`, 'inventory');
  };

  const toggleProductStock = (productId: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newStatus = !p.inStock;
          return { ...p, inStock: newStatus };
        }
        return p;
      })
    );
  };

  // Driver actions
  const updateDriverStatus = (driverId: string, status: Driver['status']) => {
    setDrivers(prev =>
      prev.map(d => (d.id === driverId ? { ...d, status } : d))
    );
  };

  const settleDriverCash = (driverId: string, note?: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;
    const settledAmount = driver.todayCashCollected;

    setDrivers(prev =>
      prev.map(d =>
        d.id === driverId
          ? { ...d, todayCashCollected: 0 }
          : d
      )
    );

    addActivityLog(
      'المسؤول',
      `تصفير حساب وتوريد عهدة السائق ${driver.name} بمبلغ ${settledAmount.toLocaleString()} ريال ${note ? `(${note})` : ''}`,
      'driver'
    );
  };

  const addDriver = (driver: Driver) => {
    setDrivers(prev => [...prev, driver]);
    addActivityLog('المسؤول', `إضافة عامل توصيل جديد: ${driver.name}`, 'driver');
  };

  // Order actions
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'paymentVerified'>): Order => {
    const newNumber = 'TSH-' + (1260 + orders.length + 1);
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: newNumber,
      status: 'new',
      paymentVerified: orderData.paymentMethod === 'cash_on_delivery',
      createdAt: new Date().toISOString()
    };

    // Deduct stock
    setProducts(prev => {
      const updated = [...prev];
      newOrder.items.forEach(cartItem => {
        const idx = updated.findIndex(p => p.id === cartItem.product.id);
        if (idx !== -1) {
          const currentStock = updated[idx].stockCount || 0;
          const newStock = Math.max(0, currentStock - cartItem.quantity);
          updated[idx] = {
            ...updated[idx],
            stockCount: newStock,
            soldCount: (updated[idx].soldCount || 0) + cartItem.quantity,
            inStock: newStock > 0
          };
        }
      });
      return updated;
    });

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();

    addActivityLog('العميل', `إنشاء طلب جديد ${newOrder.orderNumber} من ${newOrder.storeName}`, 'order');

    // Auto smart-assign driver suggestion
    setTimeout(() => {
      autoAssignBestDriver(newOrder.id);
    }, 1500);

    return newOrder;
  };

  const createRideOrder = (details: RideBookingDetails, customerName: string, customerPhone: string): Order => {
    const newNumber = 'RIDE-' + (8000 + orders.length + 1);
    const purposeNames: Record<string, string> = {
      family: 'مشوار عائلي',
      airport: 'مشوار للمطار',
      cargo: 'نقل أدوات وأثاث',
      courier: 'توصيل رسائل وطرود'
    };

    const newOrder: Order = {
      id: 'ride-' + Date.now(),
      orderNumber: newNumber,
      customerName,
      customerPhone,
      deliveryAddress: `من: ${details.pickupLocation} إلى: ${details.dropoffLocation}`,
      deliveryNotes: `نوع الخدمة: ${purposeNames[details.purpose]} | عدد الركاب: ${details.passengersCount} | الموعد: ${details.date} ${details.time} ${details.notes ? `| ملاحظات: ${details.notes}` : ''}`,
      locationType: 'current',
      customerLocation: {
        lat: details.pickupCoords?.lat || 15.3400,
        lng: details.pickupCoords?.lng || 44.1950,
        addressName: details.pickupLocation
      },
      distanceKm: 8.5,
      estimatedTimeMinutes: 25,
      storeId: 'car_service',
      storeName: `خدمة سيارات تساهيل (${purposeNames[details.purpose]})`,
      storeCategory: 'car_ride',
      items: [],
      subtotal: details.estimatedPrice,
      deliveryFee: 0,
      total: details.estimatedPrice,
      paymentMethod: 'cash_on_delivery',
      paymentVerified: true,
      status: 'new',
      createdAt: new Date().toISOString(),
      rideDetails: details
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    addActivityLog('العميل', `طلب خدمة سيارة / نقل جديدة: ${purposeNames[details.purpose]} - ${newNumber}`, 'order');

    setTimeout(() => {
      autoAssignBestDriver(newOrder.id);
    }, 1500);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, reason?: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updated = { ...o, status, cancelReason: reason || o.cancelReason };
          // If delivered and cash_on_delivery, increase driver's cash collected
          if (status === 'delivered' && o.driverId && o.paymentMethod === 'cash_on_delivery') {
            setDrivers(dPrev =>
              dPrev.map(d =>
                d.id === o.driverId
                  ? {
                      ...d,
                      todayDelivered: d.todayDelivered + 1,
                      todayCashCollected: d.todayCashCollected + o.total,
                      todayDeliveryFeesEarned: d.todayDeliveryFeesEarned + o.deliveryFee,
                      activeOrdersCount: Math.max(0, d.activeOrdersCount - 1),
                      status: 'available'
                    }
                  : d
              )
            );
          }
          return updated;
        }
        return o;
      })
    );

    const targetOrder = orders.find(o => o.id === orderId);
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => (prev ? { ...prev, status, cancelReason: reason || prev.cancelReason } : null));
    }

    addActivityLog(
      'النظام',
      `تحديث حالة الطلب ${targetOrder?.orderNumber || orderId} إلى ${status} ${reason ? `(السبب: ${reason})` : ''}`,
      'order'
    );
  };

  const assignDriverToOrder = (orderId: string, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              driverId: driver.id,
              driverName: driver.name,
              driverPhone: driver.phone,
              status: o.status === 'new' || o.status === 'confirmed' ? 'with_driver' : o.status
            }
          : o
      )
    );

    setDrivers(prev =>
      prev.map(d =>
        d.id === driverId
          ? {
              ...d,
              activeOrdersCount: d.activeOrdersCount + 1,
              status: 'on_mission'
            }
          : d
      )
    );

    addActivityLog('المسؤول', `إسناد الطلب ${orderId} إلى السائق ${driver.name}`, 'driver');
  };

  const autoAssignBestDriver = (orderId: string): boolean => {
    // Find driver with available status and least active orders
    const candidate = drivers
      .filter(d => d.status === 'available')
      .sort((a, b) => a.activeOrdersCount - b.activeOrdersCount)[0];

    if (candidate) {
      assignDriverToOrder(orderId, candidate.id);
      return true;
    }
    return false;
  };

  const verifyOrderPayment = (orderId: string, verified: boolean) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, paymentVerified: verified } : o))
    );
    addActivityLog('المسؤول', `${verified ? 'اعتماد' : 'رفض'} إشعار التحويل البنكي للطلب ${orderId}`, 'payment');
  };

  const reportIssue = (orderId: string, driverId: string, reason: string, note: string) => {
    const order = orders.find(o => o.id === orderId);
    const driver = drivers.find(d => d.id === driverId);

    const newIssue: DriverIssueReport = {
      id: 'issue-' + Date.now(),
      orderId,
      orderNumber: order?.orderNumber || orderId,
      driverId,
      driverName: driver?.name || 'عامل التوصيل',
      reason,
      note,
      timestamp: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
      resolved: false
    };

    setDriverIssues(prev => [newIssue, ...prev]);
    addActivityLog('عامل التوصيل', `بلاغ مشكلة على الطلب ${newIssue.orderNumber}: ${reason}`, 'order');
  };

  const resolveIssue = (issueId: string) => {
    setDriverIssues(prev =>
      prev.map(iss => (iss.id === issueId ? { ...iss, resolved: true } : iss))
    );
  };

  const resetCurrentPeriodStats = () => {
    const now = new Date().toISOString();
    setStatsResetDate(now);
    localStorage.setItem(STORAGE_KEYS.RESET_DATE, now);
    addActivityLog('المسؤول', '⚠️ تم تصفير إحصائيات الفترة الحالية وبدء دورة إحصائية جديدة مع بقاء السجل التاريخي', 'order');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        selectedStoreId,
        setSelectedStoreId,
        selectedDriverId,
        setSelectedDriverId,
        stores,
        updateStoreStatus,
        updateStoreDetails,
        addStore,
        products,
        updateProduct,
        addProduct,
        restockProduct,
        toggleProductStock,
        drivers,
        updateDriverStatus,
        settleDriverCash,
        addDriver,
        orders,
        createOrder,
        createRideOrder,
        updateOrderStatus,
        assignDriverToOrder,
        autoAssignBestDriver,
        verifyOrderPayment,
        activeOrder,
        setActiveOrder,
        driverIssues,
        reportIssue,
        resolveIssue,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartStoreId,
        activityLogs,
        addActivityLog,
        statsResetDate,
        resetCurrentPeriodStats,
        customerPhone,
        setCustomerPhone,
        customerName,
        setCustomerName,
        isLoggedIn,
        setIsLoggedIn
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
