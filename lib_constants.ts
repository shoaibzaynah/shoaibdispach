// Courier configurations
export const COURIERS = {
  POSTEX: {
    name: 'PostEx',
    code: 'postex',
    logo: '/couriers/postex.png',
    cities_endpoint: '/cities',
    booking_endpoint: '/booking',
    tracking_endpoint: '/tracking',
    supported_apis: ['booking', 'tracking', 'cancel', 'rate']
  },
  BLUEEX: {
    name: 'BlueEx',
    code: 'blueex',
    logo: '/couriers/blueex.png',
    cities_endpoint: '/cities',
    booking_endpoint: '/booking',
    tracking_endpoint: '/tracking',
    supported_apis: ['booking', 'tracking', 'cancel']
  },
  TCS: {
    name: 'TCS',
    code: 'tcs',
    logo: '/couriers/tcs.png',
    cities_endpoint: '/cities',
    booking_endpoint: '/booking',
    tracking_endpoint: '/tracking',
    supported_apis: ['booking', 'tracking', 'label']
  },
  LEOPARDS: {
    name: 'Leopards',
    code: 'leopards',
    logo: '/couriers/leopards.png',
    cities_endpoint: '/cities',
    booking_endpoint: '/booking',
    tracking_endpoint: '/tracking',
    supported_apis: ['booking', 'tracking', 'cancel']
  },
  MNP: {
    name: 'M&P',
    code: 'mnp',
    logo: '/couriers/mnp.png',
    cities_endpoint: '/cities',
    booking_endpoint: '/booking',
    tracking_endpoint: '/tracking',
    supported_apis: ['booking', 'tracking']
  },
  CALLCOURIER: {
    name: 'Call Courier',
    code: 'callcourier',
    logo: '/couriers/callcourier.png',
    cities_endpoint: '/cities',
    booking_endpoint: '/booking',
    tracking_endpoint: '/tracking',
    supported_apis: ['booking', 'tracking', 'cancel']
  },
  TRAX: {
    name: 'Trax',
    code: 'trax',
    logo: '/couriers/trax.png',
    cities_endpoint: '/cities',
    booking_endpoint: '/booking',
    tracking_endpoint: '/tracking',
    supported_apis: ['booking', 'tracking']
  }
} as const

// Status configurations
export const SHIPMENT_STATUSES = {
  PENDING: {
    label: 'Pending',
    value: 'pending',
    color: 'text-yellow-500 bg-yellow-500/20',
    icon: 'Clock'
  },
  PICKED: {
    label: 'Picked Up',
    value: 'picked',
    color: 'text-blue-500 bg-blue-500/20',
    icon: 'Package'
  },
  IN_TRANSIT: {
    label: 'In Transit',
    value: 'in-transit',
    color: 'text-purple-500 bg-purple-500/20',
    icon: 'Truck'
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    value: 'out-for-delivery',
    color: 'text-indigo-500 bg-indigo-500/20',
    icon: 'MapPin'
  },
  DELIVERED: {
    label: 'Delivered',
    value: 'delivered',
    color: 'text-green-500 bg-green-500/20',
    icon: 'CheckCircle'
  },
  RETURNED: {
    label: 'Returned',
    value: 'returned',
    color: 'text-orange-500 bg-orange-500/20',
    icon: 'RotateCcw'
  },
  CANCELLED: {
    label: 'Cancelled',
    value: 'cancelled',
    color: 'text-red-500 bg-red-500/20',
    icon: 'XCircle'
  }
} as const

// User roles
export const USER_ROLES = {
  ADMIN: {
    label: 'Super Admin',
    value: 'admin',
    permissions: ['all']
  },
  TENANT: {
    label: 'Tenant',
    value: 'tenant',
    permissions: ['manage_own_data', 'create_shipments', 'view_reports']
  },
  STAFF: {
    label: 'Staff',
    value: 'staff',
    permissions: ['create_shipments', 'view_own_shipments']
  }
} as const

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    value: 'free',
    price: 0,
    currency: 'PKR',
    features: [
      '50 shipments/month',
      '2 courier integrations',
      'Basic support',
      'Standard dashboard'
    ],
    limits: {
      shipments_per_month: 50,
      couriers: 2,
      users: 2,
      api_calls: 1000
    }
  },
  BASIC: {
    name: 'Basic',
    value: 'basic',
    price: 2500,
    currency: 'PKR',
    features: [
      '500 shipments/month',
      'All courier integrations',
      'Priority support',
      'Advanced analytics',
      'GPT assistant'
    ],
    limits: {
      shipments_per_month: 500,
      couriers: 999,
      users: 5,
      api_calls: 10000
    }
  },
  PRO: {
    name: 'Pro',
    value: 'pro',
    price: 5000,
    currency: 'PKR',
    features: [
      '2000 shipments/month',
      'All features',
      '24/7 support',
      'Custom integrations',
      'Bulk operations',
      'White-label option'
    ],
    limits: {
      shipments_per_month: 2000,
      couriers: 999,
      users: 20,
      api_calls: 50000
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    value: 'enterprise',
    price: 15000,
    currency: 'PKR',
    features: [
      'Unlimited shipments',
      'All features',
      'Dedicated support',
      'Custom development',
      'On-premise option',
      'SLA guarantee'
    ],
    limits: {
      shipments_per_month: 999999,
      couriers: 999,
      users: 999,
      api_calls: 999999
    }
  }
} as const

// Major Pakistani cities
export const MAJOR_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Sheikhupura',
  'Jhang',
  'Rahim Yar Khan',
  'Gujrat',
  'Kasur',
  'Mardan',
  'Mingora',
  'Chiniot',
  'Kamoke',
  'Mandi Bahauddin',
  'Jhelum',
  'Sadiqabad',
  'Jacobabad',
  'Shikarpur',
  'Khanewal',
  'Hafizabad',
  'Kohat',
  'Muzaffargarh',
  'Khanpur',
  'Gojra',
  'Bahawalnagar',
  'Muridke',
  'Pak Pattan',
  'Abottabad',
  'Toba Tek Singh',
  'Daharki',
  'Ahmad Pur East',
  'Kamalia',
  'Vihari',
  'Wah Cantonment'
] as const

// GPT features
export const GPT_FEATURES = {
  DATA_CLEANER: {
    name: 'Data Cleaner',
    description: 'Clean and format messy sales data',
    prompt_template: 'Clean and format the following sales data...'
  },
  SALES_FORMATTER: {
    name: 'Sales Formatter',
    description: 'Format sales reports with totals',
    prompt_template: 'Format this sales data into a structured report...'
  },
  CITY_DETECTOR: {
    name: 'City Detector',
    description: 'Detect and standardize city names',
    prompt_template: 'Identify and standardize the city name from...'
  },
  COURIER_SUGGESTER: {
    name: 'Courier Suggester',
    description: 'Suggest best courier for destination',
    prompt_template: 'Suggest the best courier service for delivery to...'
  },
  ASSISTANT: {
    name: 'AI Assistant',
    description: 'General purpose assistant for courier management',
    prompt_template: 'You are a helpful courier management assistant...'
  }
} as const

// Navigation items
export const NAVIGATION = {
  TENANT: [
    { name: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { name: 'Couriers', href: '/couriers', icon: 'Package' },
    { name: 'Tracking', href: '/tracking', icon: 'Truck' },
    { name: 'Reports', href: '/reports', icon: 'BarChart3' },
    { name: 'Sales Upload', href: '/sales/upload', icon: 'Upload' },
    { name: 'Sales View', href: '/sales/view', icon: 'FileText' },
    { name: 'Settings', href: '/settings', icon: 'Settings' }
  ],
  ADMIN: [
    { name: 'Admin Dashboard', href: '/admin-dashboard', icon: 'Shield' },
    { name: 'Tenants', href: '/admin-dashboard/tenants', icon: 'Building' },
    { name: 'Courier APIs', href: '/admin-dashboard/courier-apis', icon: 'Link' },
    { name: 'GPT Logs', href: '/admin-dashboard/gpt-logs', icon: 'Brain' }
  ]
} as const

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  TENANT_NOT_FOUND: 'Tenant not found',
  SHIPMENT_NOT_FOUND: 'Shipment not found',
  COURIER_API_ERROR: 'Courier API error occurred',
  INVALID_TRACKING_NUMBER: 'Invalid tracking number format',
  NETWORK_ERROR: 'Network error, please try again',
  SERVER_ERROR: 'Server error occurred',
  VALIDATION_ERROR: 'Validation error',
  FILE_UPLOAD_ERROR: 'File upload failed',
  GPT_ERROR: 'AI processing failed'
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  SHIPMENT_CREATED: 'Shipment created successfully',
  DATA_UPDATED: 'Data updated successfully',
  USER_CREATED: 'User created successfully',
  EMAIL_SENT: 'Email sent successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  BACKUP_CREATED: 'Backup created successfully',
  SETTINGS_SAVED: 'Settings saved successfully'
} as const