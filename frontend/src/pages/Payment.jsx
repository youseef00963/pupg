import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI, paymentsAPI } from '../services/api';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [paymentData, setPaymentData] = useState({
    method: 'visa',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getById(orderId);
      if (response.success) {
        setOrder(response.data);
        
        // التحقق من إمكانية الدفع
        if (response.data.status !== 'pending') {
          setError('هذا الطلب لا يحتاج للدفع أو تم دفعه مسبقاً');
        }
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

  const handleInputChange = (e) => {
    let value = e.target.value;
    
    // تنسيق رقم البطاقة
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.substring(0, 19);
    }
    
    // تنسيق تاريخ الانتهاء
    if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (value.length > 5) value = value.substring(0, 5);
    }
    
    // تنسيق CVV
    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 3) value = value.substring(0, 3);
    }

    setPaymentData({
      ...paymentData,
      [e.target.name]: value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setError('');
    setSuccess('');

    try {
      // التحقق من صحة البيانات
      if (!paymentData.cardNumber.replace(/\s/g, '') || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
        setError('رقم البطاقة غير صحيح');
        setPaymentLoading(false);
        return;
      }

      if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
        setError('تاريخ انتهاء البطاقة غير صحيح');
        setPaymentLoading(false);
        return;
      }

      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        setError('رمز الأمان غير صحيح');
        setPaymentLoading(false);
        return;
      }

      if (!paymentData.cardName.trim()) {
        setError('اسم حامل البطاقة مطلوب');
        setPaymentLoading(false);
        return;
      }

      // إنشاء الدفعة
      const paymentPayload = {
        order_id: order.id,
        method: paymentData.method,
        amount: order.total_amount,
      };

      const response = await paymentsAPI.create(paymentPayload);
      
      if (response.success) {
        setSuccess('تم الدفع بنجاح! سيتم توجيهك لصفحة الطلب...');
        setTimeout(() => {
          navigate(`/orders/${order.id}`);
        }, 2000);
      } else {
        setError(response.message || 'حدث خطأ في عملية الدفع');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.response?.data?.message || 'حدث خطأ في عملية الدفع');
    } finally {
      setPaymentLoading(false);
    }
  };

  const paymentMethods = {
    visa: { name: 'Visa', icon: '💳' },
    mastercard: { name: 'MasterCard', icon: '💳' },
    mada: { name: 'مدى', icon: '🏧' },
    stc_pay: { name: 'STC Pay', icon: '📱' },
    apple_pay: { name: 'Apple Pay', icon: '🍎' },
    paypal: { name: 'PayPal', icon: '💰' },
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">جاري تحميل معلومات الطلب...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">خطأ</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ملخص الطلب */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ملخص الطلب</h2>
          
          {order && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="font-semibold">{order.product?.name}</h3>
                  <p className="text-gray-600 text-sm">{order.product?.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{order.product?.price} ريال</p>
                  <p className="text-gray-500 text-sm">× {order.quantity}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>معرف اللاعب:</span>
                  <span className="font-medium">{order.player_id}</span>
                </div>
                <div className="flex justify-between">
                  <span>الكمية:</span>
                  <span className="font-medium">{order.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>السعر الإجمالي:</span>
                  <span className="font-medium">{order.total_amount} ريال</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>المجموع النهائي:</span>
                  <span className="text-blue-600">{order.total_amount} ريال</span>
                </div>
              </div>

              {order.notes && (
                <div className="pt-4 border-t">
                  <p className="text-gray-600 text-sm">
                    <strong>ملاحظات:</strong> {order.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* نموذج الدفع */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات الدفع</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-6">
            {/* طريقة الدفع */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                طريقة الدفع
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(paymentMethods).map(([key, method]) => (
                  <label
                    key={key}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      paymentData.method === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={key}
                      checked={paymentData.method === key}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-2">{method.icon}</span>
                    <span className="text-sm font-medium">{method.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* معلومات البطاقة (للطرق التي تحتاج بطاقة) */}
            {['visa', 'mastercard', 'mada'].includes(paymentData.method) && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    رقم البطاقة
                  </label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    required
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ الانتهاء
                    </label>
                    <input
                      id="expiryDate"
                      name="expiryDate"
                      type="text"
                      required
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                      رمز الأمان
                    </label>
                    <input
                      id="cvv"
                      name="cvv"
                      type="text"
                      required
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                    اسم حامل البطاقة
                  </label>
                  <input
                    id="cardName"
                    name="cardName"
                    type="text"
                    required
                    value={paymentData.cardName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="الاسم كما هو مكتوب على البطاقة"
                  />
                </div>
              </div>
            )}

            {/* رسالة للطرق الأخرى */}
            {!['visa', 'mastercard', 'mada'].includes(paymentData.method) && (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-blue-800 text-sm">
                  سيتم توجيهك لإكمال الدفع عبر {paymentMethods[paymentData.method]?.name}
                </p>
              </div>
            )}

            {/* أمان الدفع */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-green-600">🔒</span>
                <span className="text-sm text-gray-600">
                  جميع المعاملات محمية بتشفير SSL 256-bit
                </span>
              </div>
            </div>

            {/* زر الدفع */}
            <button
              type="submit"
              disabled={paymentLoading || (order && order.status !== 'pending')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {paymentLoading ? (
                'جاري معالجة الدفع...'
              ) : (
                `ادفع ${order?.total_amount} ريال`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;

