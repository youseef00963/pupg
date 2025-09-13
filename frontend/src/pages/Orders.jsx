import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      
      // إذا لم يكن مدير، اعرض طلبات المستخدم فقط
      if (!isAdmin()) {
        params.user_id = user?.id;
      }
      
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;

      const response = await ordersAPI.getAll(params);
      if (response.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'في الانتظار',
      paid: 'مدفوع',
      completed: 'مكتمل',
      failed: 'فاشل',
      cancelled: 'ملغي',
    };
    return texts[status] || status;
  };

  const categoryIcons = {
    PUBG: '🎮',
    FreeFire: '🔥',
    GooglePlay: '📱',
    iTunes: '🍎',
    Steam: '💨'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin() ? 'جميع الطلبات' : 'طلباتي'}
          </h1>
          <p className="text-gray-600">
            {isAdmin() ? 'إدارة جميع طلبات العملاء' : 'تتبع حالة طلباتك'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* فلتر الحالة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حالة الطلب
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="paid">مدفوع</option>
              <option value="completed">مكتمل</option>
              <option value="failed">فاشل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>

          {/* فلتر الفئة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فئة المنتج
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الفئات</option>
              <option value="PUBG">PUBG</option>
              <option value="FreeFire">Free Fire</option>
              <option value="GooglePlay">Google Play</option>
              <option value="iTunes">iTunes</option>
              <option value="Steam">Steam</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
          <p className="text-gray-600 mb-4">
            {isAdmin() ? 'لا توجد طلبات في النظام حالياً' : 'لم تقم بأي طلبات بعد'}
          </p>
          {!isAdmin() && (
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              تصفح المنتجات
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                {/* معلومات المنتج */}
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="text-3xl">
                    {categoryIcons[order.product?.category] || '🎯'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{order.product?.name}</h3>
                    <p className="text-gray-600 text-sm">
                      الكمية: {order.quantity} | معرف اللاعب: {order.player_id}
                    </p>
                    {isAdmin() && order.user && (
                      <p className="text-gray-500 text-xs">
                        العميل: {order.user.name} ({order.user.email})
                      </p>
                    )}
                  </div>
                </div>

                {/* المبلغ */}
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-blue-600">
                    {order.total_amount} ريال
                  </p>
                  <p className="text-gray-500 text-sm">
                    {order.product?.price} × {order.quantity}
                  </p>
                </div>

                {/* الحالة */}
                <div className="text-center lg:text-left">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(order.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>

                {/* الإجراءات */}
                <div className="text-center lg:text-right">
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    عرض التفاصيل
                  </Link>
                  
                  {order.status === 'pending' && (
                    <Link
                      to={`/orders/${order.id}/payment`}
                      className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm mt-2 lg:mt-0 lg:mr-2"
                    >
                      ادفع الآن
                    </Link>
                  )}
                </div>
              </div>

              {/* ملاحظات */}
              {order.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    <strong>ملاحظات:</strong> {order.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

