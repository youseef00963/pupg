import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [orderData, setOrderData] = useState({
    quantity: 1,
    player_id: '',
    notes: '',
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      if (response.success) {
        setProduct(response.data);
      } else {
        setError('المنتج غير موجود');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('حدث خطأ في تحميل المنتج');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!orderData.player_id.trim()) {
      setError('يرجى إدخال معرف اللاعب');
      return;
    }

    setOrderLoading(true);
    setError('');
    setSuccess('');

    try {
      const orderPayload = {
        user_id: user.id,
        product_id: product.id,
        quantity: parseInt(orderData.quantity),
        player_id: orderData.player_id.trim(),
        notes: orderData.notes.trim(),
      };

      const response = await ordersAPI.create(orderPayload);
      
      if (response.success) {
        setSuccess('تم إنشاء الطلب بنجاح! سيتم توجيهك لصفحة الدفع...');
        setTimeout(() => {
          navigate(`/orders/${response.data.id}`);
        }, 2000);
      } else {
        setError(response.message || 'حدث خطأ في إنشاء الطلب');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.response?.data?.message || 'حدث خطأ في إنشاء الطلب');
    } finally {
      setOrderLoading(false);
    }
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
        <p className="mt-2 text-gray-600">جاري تحميل المنتج...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">خطأ</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">المنتج غير موجود</h3>
        <p className="text-gray-600">لم نتمكن من العثور على المنتج المطلوب</p>
      </div>
    );
  }

  const totalPrice = product.price * orderData.quantity;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* معلومات المنتج */}
          <div className="space-y-6">
            {/* أيقونة المنتج */}
            <div className="text-center">
              <div className="text-8xl mb-4">
                {categoryIcons[product.category] || '🎯'}
              </div>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            {/* اسم المنتج */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {product.description}
              </p>
            </div>

            {/* السعر */}
            <div className="text-center">
              <span className="text-4xl font-bold text-blue-600">
                {product.price} ريال
              </span>
            </div>

            {/* حالة المخزون */}
            <div className="text-center">
              {product.stock > 0 ? (
                <div className="text-green-600">
                  <span className="text-lg font-semibold">متوفر</span>
                  <p className="text-sm">({product.stock} قطعة متبقية)</p>
                </div>
              ) : (
                <div className="text-red-600">
                  <span className="text-lg font-semibold">غير متوفر</span>
                  <p className="text-sm">سيتم إعادة التوفر قريباً</p>
                </div>
              )}
            </div>
          </div>

          {/* نموذج الطلب */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">اطلب الآن</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleOrder} className="space-y-4">
              {/* الكمية */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  الكمية
                </label>
                <select
                  id="quantity"
                  name="quantity"
                  value={orderData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* معرف اللاعب */}
              <div>
                <label htmlFor="player_id" className="block text-sm font-medium text-gray-700 mb-2">
                  معرف اللاعب *
                </label>
                <input
                  id="player_id"
                  name="player_id"
                  type="text"
                  required
                  value={orderData.player_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل معرف اللاعب أو البريد الإلكتروني"
                />
              </div>

              {/* ملاحظات */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={orderData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>

              {/* المجموع */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>المجموع:</span>
                  <span className="text-blue-600">{totalPrice.toFixed(2)} ريال</span>
                </div>
              </div>

              {/* زر الطلب */}
              <button
                type="submit"
                disabled={orderLoading || product.stock === 0 || !isAuthenticated}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {orderLoading ? (
                  'جاري إنشاء الطلب...'
                ) : !isAuthenticated ? (
                  'سجل دخولك للطلب'
                ) : product.stock === 0 ? (
                  'غير متوفر'
                ) : (
                  'اطلب الآن'
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 text-center">
                  يجب تسجيل الدخول أولاً لإتمام الطلب
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

