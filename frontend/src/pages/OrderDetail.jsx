import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrderDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getById(id);
      if (response.success) {
        setOrder(response.data);
      } else {
        setError('الطلب غير موجود');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('حدث خطأ في تحميل الطلب');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusText = (status) => {
    const texts = {
      pending: 'في الانتظار',
      success: 'نجح',
      failed: 'فشل',
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">جاري تحميل تفاصيل الطلب...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">خطأ</h3>
        <p className="text-gray-600">{error || 'الطلب غير موجود'}</p>
        <Link
          to="/orders"
          className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          العودة للطلبات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            تفاصيل الطلب #{order.id}
          </h1>
          <p className="text-gray-600">
            تاريخ الطلب: {new Date(order.created_at).toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
          <span className="font-semibold">{getStatusText(order.status)}</span>
        </div>
      </div>

      {/* معلومات الطلب */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">معلومات الطلب</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* معلومات المنتج */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-4xl">
                {categoryIcons[order.product?.category] || '🎯'}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{order.product?.name}</h3>
                <p className="text-gray-600">{order.product?.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                  {order.product?.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">سعر الوحدة:</span>
                <p className="font-semibold">{order.product?.price} ريال</p>
              </div>
              <div>
                <span className="text-gray-500">الكمية:</span>
                <p className="font-semibold">{order.quantity}</p>
              </div>
              <div>
                <span className="text-gray-500">معرف اللاعب:</span>
                <p className="font-semibold">{order.player_id}</p>
              </div>
              <div>
                <span className="text-gray-500">المجموع:</span>
                <p className="font-semibold text-blue-600 text-lg">{order.total_amount} ريال</p>
              </div>
            </div>

            {order.notes && (
              <div>
                <span className="text-gray-500">ملاحظات:</span>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">{order.notes}</p>
              </div>
            )}
          </div>

          {/* معلومات العميل (للمدير فقط) */}
          {isAdmin() && order.user && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">معلومات العميل</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">الاسم:</span>
                  <p className="font-semibold">{order.user.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">البريد الإلكتروني:</span>
                  <p className="font-semibold">{order.user.email}</p>
                </div>
                {order.user.phone && (
                  <div>
                    <span className="text-gray-500">الهاتف:</span>
                    <p className="font-semibold">{order.user.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* معلومات الدفع */}
      {order.payment && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">معلومات الدفع</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">طريقة الدفع:</span>
              <p className="font-semibold">{order.payment.method}</p>
            </div>
            <div>
              <span className="text-gray-500">المبلغ:</span>
              <p className="font-semibold">{order.payment.amount} ريال</p>
            </div>
            <div>
              <span className="text-gray-500">حالة الدفع:</span>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment.status)}`}>
                {getPaymentStatusText(order.payment.status)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">تاريخ الدفع:</span>
              <p className="font-semibold">
                {order.payment.processed_at 
                  ? new Date(order.payment.processed_at).toLocaleDateString('ar-SA')
                  : 'لم يتم بعد'
                }
              </p>
            </div>
          </div>

          {order.payment.transaction_id && (
            <div className="mt-4">
              <span className="text-gray-500">رقم المعاملة:</span>
              <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1">
                {order.payment.transaction_id}
              </p>
            </div>
          )}
        </div>
      )}

      {/* الإجراءات */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">الإجراءات</h2>
        
        <div className="flex flex-wrap gap-4">
          <Link
            to="/orders"
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            العودة للطلبات
          </Link>

          {order.status === 'pending' && !order.payment && (
            <Link
              to={`/orders/${order.id}/payment`}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              ادفع الآن
            </Link>
          )}

          {order.status === 'pending' && order.payment?.status === 'failed' && (
            <Link
              to={`/orders/${order.id}/payment`}
              className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              إعادة المحاولة
            </Link>
          )}

          {isAdmin() && order.status === 'paid' && (
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              تحديث الحالة
            </button>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">تتبع الطلب</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <div>
              <p className="font-semibold">تم إنشاء الطلب</p>
              <p className="text-gray-500 text-sm">
                {new Date(order.created_at).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {order.payment && (
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className={`w-3 h-3 rounded-full ${
                order.payment.status === 'success' ? 'bg-green-600' : 
                order.payment.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'
              }`}></div>
              <div>
                <p className="font-semibold">
                  {order.payment.status === 'success' ? 'تم الدفع بنجاح' : 
                   order.payment.status === 'failed' ? 'فشل في الدفع' : 'في انتظار الدفع'}
                </p>
                <p className="text-gray-500 text-sm">
                  {order.payment.processed_at 
                    ? new Date(order.payment.processed_at).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'في الانتظار'
                  }
                </p>
              </div>
            </div>
          )}

          {order.status === 'completed' && (
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <div>
                <p className="font-semibold">تم إكمال الطلب</p>
                <p className="text-gray-500 text-sm">تم تسليم المنتج بنجاح</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

