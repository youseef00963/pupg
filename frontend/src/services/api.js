import axios from 'axios';

// إعداد الـ base URL للـ API
const API_BASE_URL = 'http://localhost:8000/api';

// إنشاء instance من axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// إضافة interceptor للـ requests لإضافة token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// إضافة interceptor للـ responses للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // إزالة token وإعادة توجيه للدخول
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// خدمات المصادقة
export const authAPI = {
  // تسجيل الدخول
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // تسجيل مستخدم جديد
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // تسجيل الخروج
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // الحصول على بيانات المستخدم
  getUser: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  },

  // تحديث الملف الشخصي
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

// خدمات المنتجات
export const productsAPI = {
  // الحصول على جميع المنتجات
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // الحصول على منتج محدد
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // الحصول على الفئات
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // إضافة منتج جديد (للإدارة)
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // تحديث منتج (للإدارة)
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // حذف منتج (للإدارة)
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// خدمات الطلبات
export const ordersAPI = {
  // الحصول على جميع الطلبات
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // الحصول على طلب محدد
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // إنشاء طلب جديد
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // تحديث طلب
  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  // حذف طلب
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  // إحصائيات الطلبات (للإدارة)
  getStatistics: async () => {
    const response = await api.get('/orders/statistics');
    return response.data;
  },
};

// خدمات المدفوعات
export const paymentsAPI = {
  // الحصول على جميع المدفوعات
  getAll: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  // الحصول على دفعة محددة
  getById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // إنشاء دفعة جديدة
  create: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // تحديث دفعة
  update: async (id, paymentData) => {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  },

  // حذف دفعة
  delete: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  // إحصائيات المدفوعات (للإدارة)
  getStatistics: async () => {
    const response = await api.get('/payments/statistics');
    return response.data;
  },
};

// خدمات لوحة التحكم (للإدارة)
export const dashboardAPI = {
  // الإحصائيات العامة
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // الطلبات الحديثة
  getRecentOrders: async (limit = 10) => {
    const response = await api.get('/dashboard/recent-orders', { params: { limit } });
    return response.data;
  },

  // أفضل المنتجات
  getTopProducts: async (limit = 10) => {
    const response = await api.get('/dashboard/top-products', { params: { limit } });
    return response.data;
  },

  // مخطط الإيرادات
  getRevenueChart: async (period = 'week') => {
    const response = await api.get('/dashboard/revenue-chart', { params: { period } });
    return response.data;
  },
};

// خدمات المستخدمين (للإدارة)
export const usersAPI = {
  // الحصول على جميع المستخدمين
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // الحصول على مستخدم محدد
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // إنشاء مستخدم جديد
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // تحديث مستخدم
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // حذف مستخدم
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;

