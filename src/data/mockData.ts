import { Store, Product, Driver, Order, ActivityLog } from '../types';

export const INITIAL_STORES: Store[] = [
  // Restaurants
  {
    id: 'rest-1',
    name: 'مطاعم الشيباني الحديثة',
    category: 'restaurants',
    description: 'أشهى المأكولات اليمنية والشعبية، فلتة، سلتة، مندي لحم ومضبي دجاج على الفحم',
    rating: 4.8,
    deliveryTime: '25-35 دقيقة',
    minOrder: 2000,
    deliveryBaseFee: 500,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    address: 'شارع حدة، بجوار بنك التضامن',
    phone: '771234567',
    isOpen: true,
    lat: 15.3400,
    lng: 44.1950,
    workingHours: '10:00 ص - 12:00 م'
  },
  {
    id: 'rest-2',
    name: 'شواية وبرجر هاوس',
    category: 'restaurants',
    description: 'برجر مشوي على اللهب، وجبات سريعة، بطاطا مقرمشة وصلصات تساهيل الخاصة',
    rating: 4.7,
    deliveryTime: '20-30 دقيقة',
    minOrder: 1500,
    deliveryBaseFee: 500,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    address: 'شارع الزبيري، تقاطع عمان',
    phone: '777890123',
    isOpen: true,
    lat: 15.3520,
    lng: 44.2050,
    workingHours: '12:00 م - 02:00 ص'
  },
  {
    id: 'rest-3',
    name: 'مطعم ومخبازة القرية التراثية',
    category: 'restaurants',
    description: 'خبز ملوح بلدي، رشوش، فاصوليا بالحلبة، سمك موفا طازج ومقلقل',
    rating: 4.6,
    deliveryTime: '30-40 دقيقة',
    minOrder: 2500,
    deliveryBaseFee: 600,
    status: 'busy',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    address: 'شارع الستين الجنوبي',
    phone: '773456789',
    isOpen: true,
    lat: 15.3280,
    lng: 44.1870,
    workingHours: '08:00 ص - 11:30 م'
  },

  // Pharmacies
  {
    id: 'pharm-1',
    name: 'صيدلية النور الحديثة',
    category: 'pharmacies',
    description: 'أدوية أصلية، مستلزمات طبية، عناية بالأطفال وحليب ومكملات غذائية',
    rating: 4.9,
    deliveryTime: '15-25 دقيقة',
    minOrder: 1000,
    deliveryBaseFee: 400,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80',
    address: 'شارع بغداد، مقابل مستشفى ابن الهيثم',
    phone: '770112233',
    isOpen: true,
    lat: 15.3480,
    lng: 44.2000,
    workingHours: 'على مدار 24 ساعة'
  },
  {
    id: 'pharm-2',
    name: 'صيدلية الرعاية الصحية',
    category: 'pharmacies',
    description: 'كافة الأدوية والأجهزة الطبية المنزلية ومستحضرات التجميل العناية بالبشرة',
    rating: 4.7,
    deliveryTime: '20-30 دقيقة',
    minOrder: 1500,
    deliveryBaseFee: 450,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    address: 'شارع تعز، جولة 45',
    phone: '774433221',
    isOpen: true,
    lat: 15.3340,
    lng: 44.2200,
    workingHours: '08:00 ص - 01:00 ص'
  },

  // Groceries
  {
    id: 'groc-1',
    name: 'هايبر ماركت الرويشان المركزي',
    category: 'groceries',
    description: 'مواد غذائية معلبة، أجبان وألبان، منظفات، عصائر ومشروبات وخضار طازجة يومياً',
    rating: 4.8,
    deliveryTime: '30-45 دقيقة',
    minOrder: 3000,
    deliveryBaseFee: 600,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80',
    address: 'شارع عصر، المجمع التجاري',
    phone: '772299881',
    isOpen: true,
    lat: 15.3590,
    lng: 44.1800,
    workingHours: '08:00 ص - 12:00 م'
  },
  {
    id: 'groc-2',
    name: 'بقالة وميني ماركت البركة',
    category: 'groceries',
    description: 'احتياجات المنزل السريعة، شبس ومسليات، مياه معبأة، خبز طازج وبسكويتات',
    rating: 4.6,
    deliveryTime: '15-25 دقيقة',
    minOrder: 1000,
    deliveryBaseFee: 400,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=1200&q=80',
    address: 'حي الدائري، جوار كلية الهندسة',
    phone: '776655443',
    isOpen: true,
    lat: 15.3680,
    lng: 44.1920,
    workingHours: '07:00 ص - 01:00 ص'
  },

  // Student Services
  {
    id: 'stud-1',
    name: 'مركز أكسفورد لخدمات الطالبات والبحوث',
    category: 'student_services',
    description: 'طباعة ليزر ملونة، تجليد حلزوني وحراري، قرطاسية وأدوات معمارية ومشاريع تخرج',
    rating: 4.9,
    deliveryTime: '20-35 دقيقة',
    minOrder: 1000,
    deliveryBaseFee: 400,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    address: 'بوابة جامعة صنعاء الجديدة، الدائري الغربي',
    phone: '775511223',
    isOpen: true,
    lat: 15.3695,
    lng: 44.1890,
    workingHours: '08:00 ص - 09:00 م'
  },
  {
    id: 'stud-2',
    name: 'مكتبة الريان وسكن الطالبات',
    category: 'student_services',
    description: 'توصيل مستلزمات سكنات الطالبات الخاصة، دفاتر محاضرات، طباعة ملفات PDF وتوصيل آمن',
    rating: 4.8,
    deliveryTime: '20-30 دقيقة',
    minOrder: 1200,
    deliveryBaseFee: 400,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80',
    address: 'شارع مذبح، بالقرب من السكن الجامعي للطالبات',
    phone: '779988776',
    isOpen: true,
    lat: 15.3750,
    lng: 44.1780,
    workingHours: '08:30 ص - 08:30 م'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Products for rest-1 (مطاعم الشيباني)
  {
    id: 'p-1',
    storeId: 'rest-1',
    name: 'فلتة لحم غنمي بلدي مع الملوح',
    price: 4500,
    oldPrice: 5000,
    description: 'لحم غنمي بلدي طري في الحرضة الحارة، يقدم مع مرق ساخن وخبز ملوح مقرمش',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    category: 'أطباق لحوم',
    inStock: true,
    stockCount: 25,
    soldCount: 42,
    isFeatured: true
  },
  {
    id: 'p-2',
    storeId: 'rest-1',
    name: 'نصف دجاج مضبي على الحصى مع الرز البسمتي',
    price: 2800,
    description: 'دجاج متبل بخلطة البهارات الحضرمية ومشوي على الحصى البركاني مع صوص الشتني',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=80',
    category: 'أطباق دجاج',
    inStock: true,
    stockCount: 30,
    soldCount: 58,
    isFeatured: true
  },
  {
    id: 'p-3',
    storeId: 'rest-1',
    name: 'سلتة صنعانية بالخضار والحلبة',
    price: 1800,
    description: 'سلتة فاخرة بالمرق والخضار مع حلبة صنعانية مخفوقة على الحرضة',
    image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=500&q=80',
    category: 'شعبيات',
    inStock: true,
    stockCount: 40,
    soldCount: 65
  },
  {
    id: 'p-4',
    storeId: 'rest-1',
    name: 'بنت الصحن بالعسل البلدي والحبة السوداء',
    price: 2200,
    description: 'فطيرة صنعانية رقيقة مورقة بالسمن البلدي والعسل الأصيل',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
    category: 'حلويات ومعجنات',
    inStock: true,
    stockCount: 15,
    soldCount: 29
  },

  // Products for rest-2 (شواية وبرجر هاوس)
  {
    id: 'p-5',
    storeId: 'rest-2',
    name: 'وجبة برجر دجاج كرسبي سوبريم',
    price: 2600,
    oldPrice: 3000,
    description: 'صدر دجاج مقرمش مع جبنة شيدر سائلة وخس وصلصة المدخنة مع بطاطا ومشروب',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
    category: 'برجر دجاج',
    inStock: true,
    stockCount: 35,
    soldCount: 88,
    isFeatured: true
  },
  {
    id: 'p-6',
    storeId: 'rest-2',
    name: 'دبل تشيز برجر لحم أنجوس',
    price: 3400,
    description: 'شريحتان من لحم الأنجوس الطازج مع شرائح الجبن المذابة وصوص ترافل',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80',
    category: 'برجر لحم',
    inStock: true,
    stockCount: 20,
    soldCount: 45
  },
  {
    id: 'p-7',
    storeId: 'rest-2',
    name: 'بطاطا تساهيل المحملة بالجبن والرانش',
    price: 1300,
    description: 'بطاطا ودجز مقرمشة مغطاة بصلصة الشيدر وقطع الهالبينو وصوص الرانش',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80',
    category: 'مقبلات',
    inStock: true,
    stockCount: 50,
    soldCount: 110
  },

  // Products for pharm-1 (صيدلية النور)
  {
    id: 'p-8',
    storeId: 'pharm-1',
    name: 'بانادول إكسترا (Panadol Extra) - 24 قرص',
    price: 1200,
    description: 'مسكن للصداع والآلام الشديدة وخافض حرارة سريع المفعول مع الكافيين',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80',
    category: 'مسكنات وأدوية عامة',
    inStock: true,
    stockCount: 60,
    soldCount: 134,
    isFeatured: true
  },
  {
    id: 'p-9',
    storeId: 'pharm-1',
    name: 'فيتامين سي فوار 1000 ملغ مع الزنك',
    price: 1800,
    description: 'أقراص فوارة لدعم المناعة ومقاومة نزلات البرد بنكهة البرتقال الطبيعي',
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=500&q=80',
    category: 'فيتامينات ومكملات',
    inStock: true,
    stockCount: 40,
    soldCount: 78
  },
  {
    id: 'p-10',
    storeId: 'pharm-1',
    name: 'جهاز قياس ضغط الدم الإلكتروني للذراع',
    price: 14500,
    oldPrice: 16000,
    description: 'جهاز رقمي دقيق جداً مع شاشة LCD كبيرة وكف مريح، صناعة طبية معتمدة',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&q=80',
    category: 'أجهزة طبية',
    inStock: true,
    stockCount: 8,
    soldCount: 12
  },

  // Products for groc-1 (هايبر الرويشان)
  {
    id: 'p-11',
    storeId: 'groc-1',
    name: 'أرز بسمتي هندي سيلا فاخر 5 كجم',
    price: 6800,
    oldPrice: 7500,
    description: 'أرز حبة طويلة درجة أولى، مناسب للكبسة والمندي والأطباق الخليجية واليمنية',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
    category: 'أرز وبقوليات',
    inStock: true,
    stockCount: 45,
    soldCount: 89,
    isFeatured: true
  },
  {
    id: 'p-12',
    storeId: 'groc-1',
    name: 'زيت طبخ نقي نباتي 1.5 لتر',
    price: 2400,
    description: 'زيت ذرة نقي خالي من الكوليسترول مثالي للطبخ والقلي الصحي',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80',
    category: 'زيوت ومواد تموينية',
    inStock: true,
    stockCount: 30,
    soldCount: 67
  },
  {
    id: 'p-13',
    storeId: 'groc-1',
    name: 'كرتون مياه معدنية طبيعية 20 عبوة',
    price: 1600,
    description: 'مياه شرب نقية معقمة من ينابيع طبيعية عذبة 500 مل',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=500&q=80',
    category: 'مياه ومشروبات',
    inStock: true,
    stockCount: 80,
    soldCount: 140
  },

  // Products for stud-1 (مركز أكسفورد لخدمات الطالبات)
  {
    id: 'p-14',
    storeId: 'stud-1',
    name: 'طباعة وتغليف مشروع تخرج كامل (فاخر)',
    price: 5500,
    description: 'طباعة ألوان ليزر نقية ورق 80 جرام مع غلاف كرتوني مقوى ذهبي وتجليد حراري فاخر',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
    category: 'مشاريع تخرج وبحوث',
    inStock: true,
    stockCount: 50,
    soldCount: 120,
    isFeatured: true
  },
  {
    id: 'p-15',
    storeId: 'stud-1',
    name: 'باقة طالبة الهندسة والعمارة (مسطرة T + أقلام روترنج)',
    price: 7800,
    oldPrice: 8500,
    description: 'طقم متكامل للرسم الهندسي والمعماري من كبرى الماركات الألمانية المعتمدة',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=500&q=80',
    category: 'أدوات هندسية وقرطاسية',
    inStock: true,
    stockCount: 18,
    soldCount: 31
  },
  {
    id: 'p-16',
    storeId: 'stud-1',
    name: 'سلة قرطاسية جامعية متكاملة (دفاتر 5 مواضيع + أقلام)',
    price: 3200,
    description: '3 دفاتر كبرى سلك مقسمة، طقم أقلام حبر وتظليل ومذكرات ملونة لاصقة',
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=500&q=80',
    category: 'قرطاسية',
    inStock: true,
    stockCount: 35,
    soldCount: 94
  }
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv-1',
    name: 'محمد قائد العديني',
    phone: '772101010',
    vehicleType: 'دراجة نارية (موتور)',
    vehiclePlate: 'صنعاء 4-2918',
    status: 'available',
    activeOrdersCount: 0,
    todayDelivered: 8,
    todayCashCollected: 48500,
    todayDeliveryFeesEarned: 6400,
    rating: 4.9,
    lat: 15.3450,
    lng: 44.1980,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'drv-2',
    name: 'عمار ياسر الحاشدي',
    phone: '773202020',
    vehicleType: 'سيارة تويوتا يارس',
    vehiclePlate: 'صنعاء 1-84729',
    status: 'on_mission',
    activeOrdersCount: 1,
    todayDelivered: 5,
    todayCashCollected: 36500,
    todayDeliveryFeesEarned: 5000,
    rating: 4.8,
    lat: 15.3560,
    lng: 44.2090,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'drv-3',
    name: 'صالح أحمد البرهمي',
    phone: '775303030',
    vehicleType: 'دباب نقل بضائع وأثاث',
    vehiclePlate: 'صنعاء نقل 9031',
    status: 'available',
    activeOrdersCount: 0,
    todayDelivered: 4,
    todayCashCollected: 25000,
    todayDeliveryFeesEarned: 8000,
    rating: 4.9,
    lat: 15.3390,
    lng: 44.1900,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'TSH-1258',
    customerName: 'أحمد صالح المهدي',
    customerPhone: '774123987',
    deliveryAddress: 'حي الأصبحي، شارع المقالح، عمارة الأمل، شقة 4',
    deliveryNotes: 'الرجاء الاتصال عند الوصول وترك الطلب عند الباب إن أمكن',
    locationType: 'home',
    customerLocation: {
      lat: 15.3210,
      lng: 44.2150,
      addressName: 'حي الأصبحي - شارع المقالح'
    },
    distanceKm: 3.2,
    estimatedTimeMinutes: 28,
    storeId: 'rest-1',
    storeName: 'مطاعم الشيباني الحديثة',
    storeCategory: 'restaurants',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[2], quantity: 1 }
    ],
    subtotal: 6300,
    deliveryFee: 800,
    total: 7100,
    paymentMethod: 'cash_on_delivery',
    paymentVerified: true,
    status: 'on_the_way',
    createdAt: '2026-09-29T09:30:00.000Z',
    driverId: 'drv-2',
    driverName: 'عمار ياسر الحاشدي',
    driverPhone: '773202020'
  },
  {
    id: 'ord-1002',
    orderNumber: 'TSH-1259',
    customerName: 'فاطمة الكحلاني',
    customerPhone: '778901234',
    deliveryAddress: 'سكن الطالبات الجامعي، بوابة 2، مبنى ج، غرفة 14',
    deliveryNotes: 'توصيل عاجل لطفاً قبل المحاضرة',
    locationType: 'university',
    customerLocation: {
      lat: 15.3695,
      lng: 44.1890,
      addressName: 'جامعة صنعاء - السكن الجامعي'
    },
    distanceKm: 1.5,
    estimatedTimeMinutes: 18,
    storeId: 'stud-1',
    storeName: 'مركز أكسفورد لخدمات الطالبات والبحوث',
    storeCategory: 'student_services',
    items: [
      { product: INITIAL_PRODUCTS[13], quantity: 1 }
    ],
    subtotal: 5500,
    deliveryFee: 500,
    total: 6000,
    paymentMethod: 'kuraimi',
    paymentProofImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    paymentVerified: true,
    status: 'preparing',
    createdAt: '2026-09-29T10:05:00.000Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'TSH-1260',
    customerName: 'مروان باعباد',
    customerPhone: '771998877',
    deliveryAddress: 'شارع عمان، عمارة النصر، الدور الثاني',
    deliveryNotes: 'محتاج الأدوية بشكل سريع لطفاً',
    locationType: 'current',
    customerLocation: {
      lat: 15.3480,
      lng: 44.2000,
      addressName: 'شارع عمان - جوار المركز الطبي'
    },
    distanceKm: 2.1,
    estimatedTimeMinutes: 22,
    storeId: 'pharm-1',
    storeName: 'صيدلية النور الحديثة',
    storeCategory: 'pharmacies',
    items: [
      { product: INITIAL_PRODUCTS[7], quantity: 2 },
      { product: INITIAL_PRODUCTS[8], quantity: 1 }
    ],
    subtotal: 4200,
    deliveryFee: 600,
    total: 4800,
    paymentMethod: 'qutaibi',
    paymentProofImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    paymentVerified: true,
    status: 'new',
    createdAt: '2026-09-29T10:12:00.000Z'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    user: 'المسؤول الرئيسي (عبدالله)',
    action: 'تحديث سعر برجر دجاج كرسبي من 2,400 إلى 2,600 ريال',
    timestamp: 'منذ 15 دقيقة',
    type: 'price'
  },
  {
    id: 'log-2',
    user: 'المسؤول الرئيسي (عبدالله)',
    action: 'إضافة 50 قطعة لمخزون بانادول إكسترا لصيدلية النور',
    timestamp: 'منذ 35 دقيقة',
    type: 'inventory'
  },
  {
    id: 'log-3',
    user: 'النظام الآلي',
    action: 'تسجيل طلب جديد #TSH-1260 من صيدلية النور الحديثة',
    timestamp: 'منذ 4 دقائق',
    type: 'order'
  },
  {
    id: 'log-4',
    user: 'عامل التوصيل (عمار الحاشدي)',
    action: 'استلام الطلب #TSH-1258 والتحرك نحو العميل',
    timestamp: 'منذ 10 دقائق',
    type: 'driver'
  }
];

export const BANK_ACCOUNTS = {
  kuraimi: {
    bankName: 'بنك الكريمي للتمويل الأصغر الإسلامي',
    accountNumber: '300482910',
    accountName: 'منصة تساهيل للخدمات اللوجستية والتوصيل',
    branch: 'الفرع الرئيسي - صنعاء',
    instructions: 'يرجى تحويل المبلغ الإجمالي إلى الحساب أعلاه عبر تطبيق الكريمي جوال (ام فلوس)، ثم التقاط لقطة شاشة للإشعار ورفعها أدناه لتأكيد الطلب.'
  },
  qutaibi: {
    bankName: 'بنك القطيبي الإسلامي للتمويل الأصغر',
    accountNumber: '10492847',
    accountName: 'منصة تساهيل لخدمات التوصيل',
    branch: 'فرع حدة - صنعاء',
    instructions: 'يرجى تحويل المبلغ الإجمالي إلى حسابنا عبر تطبيق القطيبي لحظات، ثم رفع صورة إشعار التحويل البنكي أدناه لمطابقة العملية.'
  }
};
