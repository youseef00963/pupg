import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* الهيدر */}
      <Header />

      {/* المحتوى الأساسي */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* الفوتر */}
      <Footer />
    </div>
  );
};

export default Layout;
