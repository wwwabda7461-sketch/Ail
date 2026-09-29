import React, { useState } from 'react';
import {
  TrendingUp,
  RotateCcw,
  ShoppingBag,
  Store as StoreIcon,
  Users,
  Bike,
  Package,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Edit,
  DollarSign,
  Download,
  ShieldCheck,
  Eye,
  Check,
  X,
  Clock,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, Product, Store, Driver, OrderStatus, StoreStatus, StoreCategory } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    stores,
    addStore,
    updateStoreStatus,
    updateStoreDetails,
    products,
    addProduct,
    updateProduct,
    restockProduct,
    orders,
    updateOrderStatus,
    assignDriverToOrder,
    autoAssignBestDriver,
    verifyOrderPayment,
    drivers,
    settleDriverCash,
    addDriver,
    driverIssues,
    resolveIssue,
    activityLogs,
    resetCurrentPeriodStats,
    statsResetDate,
    setRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'stats' | 'orders' | 'inventory' | 'stores' | 'drivers' | 'payments' | 'issues' | 'logs'
  >('stats');

  // Search and filter for orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Modals
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [restockItem, setRestockItem] = useState<{ id: string; name: string; qty: number } | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<string | null>(null);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(2000);
  const [newProdStoreId, setNewProdStoreId] = useState(stores[0]?.id || 'rest-1');
  const [newProdCat, setNewProdCat] = useState('وجبات رئيسية');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStock, setNewProdStock] = useState<number>(30);

  // Filter orders by reset date if active period
  const periodOrders = statsResetDate
    ? orders.filter((o) => new Date(o.createdAt) >= new Date(statsResetDate))
    : orders;

  // Statistics calculation
  const totalOrders = periodOrders.length;
  const newOrdersCount = periodOrders.filter((o) => o.status === 'new').length;
  const preparingOrdersCount = periodOrders.filter((o) => o.status === 'preparing' || o.status === 'confirmed').length;
  const deliveringOrdersCount = periodOrders.filter(
    (o) => o.status === 'with_driver' || o.status === 'on_the_way' || o.status === 'arrived'
  ).length;
  const completedOrdersCount = periodOrders.filter((o) => o.status === 'delivered').length;
  const cancelledOrdersCount = periodOrders.filter((o) => o.status === 'cancelled').length;

  const totalSales = periodOrders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.subtotal : sum), 0);
  const totalDeliveryFees = periodOrders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.deliveryFee : sum), 0);

  // Filtered orders for table
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerPhone.includes(orderSearch) ||
      order.storeName.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: 'p-' + Date.now(),
      storeId: newProdStoreId,
      name: newProdName,
      price: Number(newProdPrice),
      description: newProdDesc || 'منتج مضاف بواسطة الإدارة',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
      category: newProdCat,
      inStock: true,
      stockCount: Number(newProdStock),
      soldCount: 0
    };
    addProduct(created);
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  const handleExportCSV = () => {
    const headers = ['رقم الطلب', 'العميل', 'الهاتف', 'المتجر', 'المجموع', 'رسوم التوصيل', 'طريقة الدفع', 'الحالة', 'التاريخ'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.customerName,
      o.customerPhone,
      o.storeName,
      o.subtotal,
      o.deliveryFee,
      o.paymentMethod,
      o.status,
      new Date(o.createdAt).toLocaleString('ar-YE')
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tasaheel_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
            👨‍💼
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                لوحة تحكم المسؤول الرئيسية
              </span>
              <span className="text-xs text-slate-400">صلاحيات كاملة بالنظام</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              تساهيل | مركز الإدارة والتشغيل والرقابة
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              متابعة حركة الطلبات، إدارة المتاجر، أسعار المنتجات، جرد المخزون، وتوريد السائقين
            </p>
          </div>
        </div>

        {/* Top Actions: Reset Stats & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>📱 الذهاب لتطبيق العميل</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('driver')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>🚴 الذهاب لواجهة السائق</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>تصدير Excel / CSV</span>
          </button>

          {/* ⚠️ تصفير الإحصائيات (Safe Zeroing as specifically requested in prompt #2) */}
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/60 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span>⚠️ تصفير إحصائيات الفترة</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 text-xs font-bold">
        {[
          { id: 'stats', label: '📊 الإحصائيات العامة', count: null },
          { id: 'orders', label: '🧾 إدارة الطلبات', count: orders.length },
          { id: 'inventory', label: '📦 الجرد والمخزون', count: products.length },
          { id: 'stores', label: '🏪 المتاجر والشركاء', count: stores.length },
          { id: 'drivers', label: '🚴 عمال التوصيل والعهد', count: drivers.length },
          { id: 'payments', label: '💳 الحوالات البنكية', count: orders.filter((o) => o.paymentMethod !== 'cash_on_delivery').length },
          { id: 'issues', label: '⚠️ بلاغات ومشاكل السائقين', count: driverIssues.filter((i) => !i.resolved).length },
          { id: 'logs', label: '📜 سجل النشاطات', count: activityLogs.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white font-black shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-amber-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: Main Statistics (As requested in prompt #1) */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {statsResetDate && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-900 flex items-center justify-between">
              <span>
                ⚠️ العدادات المعروضة أدناه تبدأ من تاريخ التصفير الأخير: {new Date(statsResetDate).toLocaleString('ar-YE')} (البيانات السابقة محفوظة في الأرشيف والتقارير).
              </span>
            </div>
          )}

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-bold">إجمالي المبيعات بالفترة</div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {totalSales.toLocaleString()} <span className="text-xs font-bold">ريال</span>
              </div>
              <div className="text-[10px] text-emerald-600 mt-1">حجم المعاملات المالية</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs text-amber-700 font-bold">إجمالي رسوم التوصيل</div>
              <div className="text-2xl font-black text-amber-700 mt-2">
                {totalDeliveryFees.toLocaleString()} <span className="text-xs font-bold">ريال</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">أرباح أسطول التوصيل</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-bold">عدد الطلبات الإجمالي</div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {totalOrders}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">منذ بدء دورة الإحصاء</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs text-emerald-700 font-bold">الطلبات المكتملة</div>
              <div className="text-2xl font-black text-emerald-700 mt-2">
                {completedOrdersCount}
              </div>
              <div className="text-[10px] text-emerald-600 mt-1">
                نسبة الإنجاز: {totalOrders > 0 ? Math.round((completedOrdersCount / totalOrders) * 100) : 0}%
              </div>
            </div>
          </div>

          {/* Operational Pipeline Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl">
              <div className="text-xs font-bold text-red-700">طلبات جديدة</div>
              <div className="text-2xl font-black text-red-900 mt-1">{newOrdersCount}</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
              <div className="text-xs font-bold text-amber-700">قيد التجهيز</div>
              <div className="text-2xl font-black text-amber-900 mt-1">{preparingOrdersCount}</div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl">
              <div className="text-xs font-bold text-blue-700">قيد التوصيل</div>
              <div className="text-2xl font-black text-blue-900 mt-1">{deliveringOrdersCount}</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
              <div className="text-xs font-bold text-emerald-700">مكتملة ومسلمة</div>
              <div className="text-2xl font-black text-emerald-900 mt-1">{completedOrdersCount}</div>
            </div>

            <div className="bg-slate-100 border border-slate-300 p-3.5 rounded-2xl">
              <div className="text-xs font-bold text-slate-600">ملغاة أو مرفوضة</div>
              <div className="text-2xl font-black text-slate-800 mt-1">{cancelledOrdersCount}</div>
            </div>
          </div>

          {/* Counts of Network Entities */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-2xl font-bold">
                🍽️
              </div>
              <div>
                <div className="text-xs text-slate-500">المطاعم الشريكة</div>
                <div className="text-lg font-black text-slate-900">
                  {stores.filter((s) => s.category === 'restaurants').length} مطاعم
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl font-bold">
                💊
              </div>
              <div>
                <div className="text-xs text-slate-500">الصيدليات المعتمدة</div>
                <div className="text-lg font-black text-slate-900">
                  {stores.filter((s) => s.category === 'pharmacies').length} صيدليات
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
                🛒
              </div>
              <div>
                <div className="text-xs text-slate-500">البقالات والهايبر</div>
                <div className="text-lg font-black text-slate-900">
                  {stores.filter((s) => s.category === 'groceries').length} بقالات
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold">
                🚴
              </div>
              <div>
                <div className="text-xs text-slate-500">كباتن التوصيل</div>
                <div className="text-lg font-black text-slate-900">
                  {drivers.length} سائقين
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders Management (As requested in prompt #3) */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="بحث برقم الطلب، العميل، الهاتف، أو المتجر..."
                className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'new', label: 'جديد' },
                { id: 'preparing', label: 'تجهيز' },
                { id: 'with_driver', label: 'مع السائق' },
                { id: 'on_the_way', label: 'في الطريق' },
                { id: 'delivered', label: 'مكتمل' },
                { id: 'cancelled', label: 'ملغي' }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setOrderStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    orderStatusFilter === st.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">رقم الطلب</th>
                  <th className="py-3 px-3">العميل & الهاتف</th>
                  <th className="py-3 px-3">المتجر / الخدمة</th>
                  <th className="py-3 px-3">القيمة</th>
                  <th className="py-3 px-3">طريقة الدفع</th>
                  <th className="py-3 px-3">عامل التوصيل</th>
                  <th className="py-3 px-3">الحالة التشغيلية</th>
                  <th className="py-3 px-3 text-center">الإجراءات والتحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      لا توجد طلبات مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-black text-slate-900">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono" dir="ltr">{order.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {order.storeName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-extrabold text-amber-700">
                          {order.total.toLocaleString()} ريال
                        </span>
                        <div className="text-[10px] text-slate-400">شامل التوصيل: {order.deliveryFee}</div>
                      </td>
                      <td className="py-3 px-3">
                        {order.paymentMethod === 'cash_on_delivery' ? (
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            💵 كاش
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">
                              {order.paymentMethod === 'kuraimi' ? 'الكريمي' : 'القطيبي'}
                            </span>
                            {order.paymentProofImage && (
                              <button
                                type="button"
                                onClick={() => setPreviewReceipt(order.paymentProofImage || null)}
                                className="text-blue-600 hover:underline text-[10px] font-bold"
                              >
                                [عرض الإشعار]
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {order.driverName ? (
                          <span className="font-bold text-slate-800">{order.driverName}</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => autoAssignBestDriver(order.id)}
                            className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-2 py-1 rounded-lg border border-emerald-300"
                          >
                            + إسناد ذكي للسائق
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold outline-none text-slate-800"
                        >
                          <option value="new">جديد 🔔</option>
                          <option value="confirmed">تم التأكيد ✅</option>
                          <option value="preparing">قيد التجهيز 👨‍🍳</option>
                          <option value="ready">جاهز 📦</option>
                          <option value="with_driver">مع السائق 🛵</option>
                          <option value="on_the_way">في الطريق 🚴</option>
                          <option value="arrived">وصل للعميل 📍</option>
                          <option value="delivered">تم التسليم 🎉</option>
                          <option value="cancelled">ملغي ❌</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'cancelled', 'إلغاء من قبل إدارة تساهيل')}
                            className="text-red-600 hover:text-red-800 text-[11px] font-bold bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                          >
                            إلغاء
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Inventory & Products (As requested in prompt #4 & #7) */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">
                📦 إدارة الوجبات، المنتجات والمخزون والجرد
              </h2>
              <p className="text-xs text-slate-500">
                متابعة الكميات المتوفرة، المباعة، المتبقية، وتعديل الأسعار مباشرة
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow flex items-center gap-1.5 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج / وجبة جديدة</span>
            </button>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">المنتج / الوجبة</th>
                  <th className="py-3 px-3">المتجر</th>
                  <th className="py-3 px-3">السعر الحالي</th>
                  <th className="py-3 px-3">الكمية المباعة</th>
                  <th className="py-3 px-3">المتبقي بالمخزون</th>
                  <th className="py-3 px-3">الحالة</th>
                  <th className="py-3 px-3 text-center">إعادة التزويد / تعديل السعر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => {
                  const store = stores.find((s) => s.id === prod.storeId);
                  const isOutOfStock = !prod.inStock || prod.stockCount <= 0;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover border shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{prod.name}</div>
                            <div className="text-[10px] text-slate-400">{prod.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {store?.name || prod.storeId}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-amber-700 text-sm">
                            {prod.price.toLocaleString()} ريال
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newPrice = prompt(`تعديل سعر ${prod.name} (السعر الحالي: ${prod.price} ريال):`, String(prod.price));
                              if (newPrice && !isNaN(Number(newPrice))) {
                                updateProduct({ ...prod, price: Number(newPrice), oldPrice: prod.price });
                              }
                            }}
                            className="text-slate-400 hover:text-amber-600"
                            title="تعديل السعر"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {prod.soldCount} قطعة
                      </td>
                      <td className="py-3 px-3 font-mono font-extrabold text-slate-900">
                        {prod.stockCount} قطعة
                      </td>
                      <td className="py-3 px-3">
                        {isOutOfStock ? (
                          <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                            🔴 نفد من المخزون
                          </span>
                        ) : prod.stockCount <= 5 ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                            🟡 قارب على النفاد
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                            🟢 متوفر
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => restockProduct(prod.id, 20)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg transition"
                          >
                            +20 قطعة
                          </button>
                          <button
                            type="button"
                            onClick={() => restockProduct(prod.id, 50)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg transition"
                          >
                            +50 قطعة
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Stores & Partners Management (As requested in prompt #5) */}
      {activeTab === 'stores' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                🏪 إدارة المطاعم، الصيدليات، البقالات، ومراكز الطالبات
              </h2>
              <p className="text-xs text-slate-500">
                تعديل حالة المتاجر (متاح 🟢، مشغول 🟡، مغلق 🔴، متوقف مؤقتًا ⚫) وتفاصيل العمل
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((store) => (
              <div
                key={store.id}
                className="border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-12 h-12 rounded-xl object-cover border"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{store.name}</h4>
                      <div className="text-[11px] text-slate-500">{store.address} • {store.phone}</div>
                    </div>
                  </div>

                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                    {store.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div className="font-bold text-slate-700">حالة المتجر:</div>
                  <div className="flex items-center gap-1">
                    {[
                      { key: 'available', label: '🟢 متاح', bg: 'hover:bg-emerald-50' },
                      { key: 'busy', label: '🟡 مشغول', bg: 'hover:bg-amber-50' },
                      { key: 'closed', label: '🔴 مغلق', bg: 'hover:bg-red-50' },
                      { key: 'paused', label: '⚫ متوقف', bg: 'hover:bg-slate-100' }
                    ].map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => updateStoreStatus(store.id, st.key as StoreStatus)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                          store.status === st.key
                            ? 'bg-slate-900 text-white shadow-sm'
                            : `text-slate-600 border border-slate-200 ${st.bg}`
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Drivers & Cash Settlements (As requested in prompt #6 & #7) */}
      {activeTab === 'drivers' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-900">
              🚴 عمال التوصيل، العهد النقدية، والتسويات المالية
            </h2>
            <p className="text-xs text-slate-500">
              المسؤول هو الوحيد صاحب الصلاحية في تصفير حساب العامل وتوثيق التوريد في سجل المحاسبة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={driver.avatar}
                    alt={driver.name}
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{driver.name}</h4>
                    <div className="text-[11px] text-slate-500">{driver.vehicleType} • {driver.vehiclePlate}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">المبلغ الموجود بحوزته:</span>
                    <span className="font-extrabold text-amber-700 text-sm">
                      {driver.todayCashCollected.toLocaleString()} ريال
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">الطلبات المسلمة اليوم:</span>
                    <span className="font-bold text-slate-800">{driver.todayDelivered} طلبات</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">أرباح رسوم التوصيل:</span>
                    <span className="font-bold text-teal-700">{driver.todayDeliveryFeesEarned.toLocaleString()} ريال</span>
                  </div>
                </div>

                {driver.todayCashCollected > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`هل استلمت العهدة النقدية بمبلغ ${driver.todayCashCollected.toLocaleString()} ريال من الكابتن ${driver.name} وتريد تصفير حسابه؟`)) {
                        settleDriverCash(driver.id, 'تم التوريد نقداً في المكتب الرئيسي');
                      }
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition"
                  >
                    💰 استلام العهدة وتصفير حساب العامل
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-emerald-600 font-bold bg-emerald-50 py-1.5 rounded-lg border border-emerald-200">
                    ✓ الحساب مصفّر ولا توجد مبالغ معلقة
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Bank Payments Verification */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-900">
              💳 التحقق من إشعارات الحوالات البنكية (الكريمي والقطيبي)
            </h2>
            <p className="text-xs text-slate-500">
              مطابقة لقطات شاشات التحويل البنكي المرفوعة من العملاء واعتماد الطلبات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders
              .filter((o) => o.paymentMethod === 'kuraimi' || o.paymentMethod === 'qutaibi')
              .map((order) => (
                <div key={order.id} className="border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-black text-sm text-slate-900">
                        طلب #{order.orderNumber} - {order.customerName}
                      </div>
                      <div className="text-xs text-slate-500 font-mono" dir="ltr">{order.customerPhone}</div>
                    </div>
                    <span className="font-extrabold text-sm text-amber-700">
                      {order.total.toLocaleString()} ريال
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.paymentProofImage ? (
                      <div className="relative group cursor-pointer" onClick={() => setPreviewReceipt(order.paymentProofImage || null)}>
                        <img
                          src={order.paymentProofImage}
                          alt="Receipt"
                          className="w-20 h-20 rounded-xl object-cover border"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs text-center p-1">
                        لم يرفع إشعار
                      </div>
                    )}

                    <div className="flex-1 space-y-1 text-xs">
                      <div className="font-bold text-slate-800">
                        البنك: {order.paymentMethod === 'kuraimi' ? 'بنك الكريمي' : 'بنك القطيبي'}
                      </div>
                      <div className="text-slate-500">
                        حالة الاعتماد: {order.paymentVerified ? '✅ معتمد' : '⏳ قيد المراجعة'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => verifyOrderPayment(order.id, true)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                    >
                      اعتماد الحوالة
                    </button>
                    <button
                      type="button"
                      onClick={() => verifyOrderPayment(order.id, false)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
                    >
                      رفض الحوالة
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 7: Driver Issues & Tickets */}
      {activeTab === 'issues' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-900">
              ⚠️ بلاغات ومشاكل عمال التوصيل الواردة
            </h2>
            <p className="text-xs text-slate-500">
              متابعة البلاغات الفورية التي أرسلها السائقون أثناء مهام التوصيل
            </p>
          </div>

          {driverIssues.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              ✓ لا توجد بلاغات أو مشاكل مفتوحة حالياً
            </div>
          ) : (
            <div className="space-y-3">
              {driverIssues.map((iss) => (
                <div
                  key={iss.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    iss.resolved ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-red-50/70 border-red-200'
                  }`}
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-red-900 text-sm">
                        طلب #{iss.orderNumber}
                      </span>
                      <span className="text-slate-500">• كابتن: {iss.driverName} • {iss.timestamp}</span>
                    </div>
                    <div className="font-bold text-slate-900">المشكلة: {iss.reason}</div>
                    {iss.note && <div className="text-slate-600">توضيح: {iss.note}</div>}
                  </div>

                  {!iss.resolved && (
                    <button
                      type="button"
                      onClick={() => resolveIssue(iss.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                    >
                      ✓ تم حل المشكلة
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 8: Audit Logs (As requested in prompt #10) */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-900">
              📜 سجل النشاطات والعمليات الرقابية (Audit Trail)
            </h2>
            <p className="text-xs text-slate-500">
              توثيق دقيق لكل تغيير بالأسعار، إضافة للمخزون، تصفير حسابات، أو إلغاء طلبات
            </p>
          </div>

          <div className="space-y-2">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="font-bold text-slate-900">{log.user}:</span>
                  <span className="text-slate-700">{log.action}</span>
                </div>
                <span className="text-[10px] text-slate-400">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Safe Period Stats Reset Confirmation (Prompt #2) */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600 font-black text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>تصفير إحصائيات الفترة الحالية؟</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              عند تأكيد التصفير، سيبدأ عداد جديد لليوم والفترة الحالية، مع بقاء كافة الطلبات القديمة والحسابات محفوظة بالكامل في الأرشيف والتقارير المحاسبية دون أي فقدان للبيانات.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  resetCurrentPeriodStats();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 shadow"
              >
                تأكيد التصفير
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Product */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">
              إضافة وجبة أو منتج جديد إلى النظام
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الوجبة / المنتج:</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="مثال: مندي لحم بلدي"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر (بالريال):</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الكمية بالمخزون:</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المتجر التابع له:</label>
                  <select
                    value={newProdStoreId}
                    onChange={(e) => setNewProdStoreId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">القسم / التصنيف:</label>
                  <input
                    type="text"
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الوصف:</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-black rounded-xl"
                >
                  حفظ المنتج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Preview Payment Slip */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full text-center space-y-3">
            <h4 className="font-black text-sm text-slate-800">صورة إشعار التحويل البنكي</h4>
            <img
              src={previewReceipt}
              alt="Receipt Preview"
              className="max-h-80 mx-auto rounded-xl object-contain border"
            />
            <button
              type="button"
              onClick={() => setPreviewReceipt(null)}
              className="px-6 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              إغلاق المعاينة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
