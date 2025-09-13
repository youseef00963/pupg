import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import Payment from './pages/Payment.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App" dir="rtl">
          <Routes>
            {/* المسارات العامة */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* المسارات المحمية والمشتركة ضمن Layout */}
            <Route path="/" element={<Layout />}>
              {/* الصفحة الرئيسية */}
              <Route index element={<Home />} />

              {/* المنتجات */}
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />

              {/* المسارات المحمية للمستخدمين */}
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />

              <Route path="orders/:id" element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              } />

              <Route path="orders/:orderId/payment" element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              } />

              {/* المسارات الإدارية */}
              <Route path="admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* صفحة 404 */}
              <Route path="*" element={
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">الصفحة غير موجودة</h3>
                  <p className="text-gray-600">لم نتمكن من العثور على الصفحة المطلوبة</p>
                </div>
              } />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
