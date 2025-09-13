import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll({ per_page: 8 });
      if (response.success) {
        setFeaturedProducts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    PUBG:<img 
  src="https://play-lh.googleusercontent.com/7zN9v4rsQj3mMnw86CTRqpDtmcplgyh-PznTtkbSxwnno_BhaKAOZXBr9yjb2L9Zqg" 
  alt="PUBG" 
  className="w-24 h-24 mx-auto"
/>,

    FreeFire: <img 
  src="https://www.pngarts.com/files/12/Garena-Free-Fire-PNG-High-Quality-Image.png" 
  alt="PUBG" 
  className="w-24 h-24 mx-auto"
/>,
    GooglePlay:<img 
  src="https://www.pngall.com/wp-content/uploads/10/Google-Play-PNG-Picture.png" 
  alt="PUBG" 
  className="w-24 h-24 mx-auto"
/>,
    iTunes: <img 
  src="https://e7.pngegg.com/pngimages/481/908/png-clipart-itunes-store-internet-radio-apple-streaming-media-apple-text-logo.png" 
  alt="PUBG" 
  className="w-24 h-24 mx-auto"
/>,
    Steam: <img 
  src="https://w7.pngwing.com/pngs/407/234/png-transparent-steam-mervils-a-vr-adventure-computer-icons-personal-computer-valve-corporation-steam-engine-game-logo-windows.png" 
  alt="PUBG" 
  className="w-24 h-24 mx-auto"
/>,
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 md:p-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            🎮 متجر الألعاب
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            أفضل موقع لشراء شدات الألعاب وبطاقات الهدايا الرقمية
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            تسوق الآن
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">الفئات المتاحة</h2>
        {loading ? (
          <div className="text-center py-8">
            <p>جاري تحميل الفئات...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Object.entries(categories).map(([key, value]) => (
              <Link
                key={key}
                to={`/products?category=${key}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">
                  {categoryIcons[key] || '🎯'}
                </div>
                <h3 className="font-semibold text-gray-800">{value}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">المنتجات المميزة</h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            عرض الكل ←
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>جاري تحميل المنتجات...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="text-3xl mb-3 text-center">
                    {categoryIcons[product.category] || '🎯'}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {product.price} ريال
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      شراء
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">لماذا تختارنا؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">سرعة في التسليم</h3>
            <p className="text-gray-600">
              نقوم بتسليم طلباتك فوراً بعد إتمام عملية الدفع
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">أمان وموثوقية</h3>
            <p className="text-gray-600">
              جميع المعاملات آمنة ومحمية بأحدث تقنيات الأمان
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">أسعار منافسة</h3>
            <p className="text-gray-600">
              نقدم أفضل الأسعار في السوق مع عروض وخصومات مستمرة
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-blue-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4">ابدأ التسوق الآن</h2>
        <p className="text-lg text-gray-600 mb-6">
          اكتشف مجموعتنا الواسعة من شدات الألعاب وبطاقات الهدايا
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
        >
          تصفح المنتجات
        </Link>
      </section>
    </div>
  );
};

export default Home;

