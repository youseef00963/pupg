import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* الشعار */}
          <Link to="/" className="text-2xl font-bold">
            🎮 متجر الألعاب
          </Link>

          {/* القائمة الرئيسية */}
          <nav className="hidden md:flex space-x-6 space-x-reverse">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              الرئيسية
            </Link>
            <Link to="/products" className="hover:text-blue-200 transition-colors">
              المنتجات
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="hover:text-blue-200 transition-colors">
                طلباتي
              </Link>
            )}
            {isAdmin() && (
              <Link to="/admin" className="hover:text-blue-200 transition-colors">
                لوحة التحكم
              </Link>
            )}
          </nav>

          {/* قائمة المستخدم */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-sm">
                  مرحباً، {user?.name}
                </span>
                <Link
                  to="/profile"
                  className="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  الملف الشخصي
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded transition-colors"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* القائمة المحمولة */}
        <nav className="md:hidden mt-4 flex flex-wrap gap-4">
          <Link to="/" className="hover:text-blue-200 transition-colors">
            الرئيسية
          </Link>
          <Link to="/products" className="hover:text-blue-200 transition-colors">
            المنتجات
          </Link>
          {isAuthenticated && (
            <Link to="/orders" className="hover:text-blue-200 transition-colors">
              طلباتي
            </Link>
          )}
          {isAdmin() && (
            <Link to="/admin" className="hover:text-blue-200 transition-colors">
              لوحة التحكم
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

