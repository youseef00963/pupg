import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معلومات الموقع */}
          <div>
            <h3 className="text-xl font-bold mb-4">🎮 متجر الألعاب</h3>
            <p className="text-gray-300">
              أفضل موقع لشراء شدات الألعاب وبطاقات الهدايا الرقمية
              بأسعار منافسة وخدمة سريعة.
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition-colors">
                  المنتجات
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  من نحن
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>

          {/* معلومات الاتصال */}
          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <div className="space-y-2 text-gray-300">
              <p>📧 info@gamestore.com</p>
              <p>📱 +966 50 123 4567</p>
              <p>🕒 خدمة العملاء: 24/7</p>
            </div>
          </div>
        </div>

        {/* خط الفصل */}
        <hr className="border-gray-600 my-6" />

        {/* حقوق النشر */}
        <div className="text-center text-gray-400">
          <p>&copy; 2024 متجر الألعاب. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

