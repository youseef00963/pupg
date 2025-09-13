#!/bin/bash

echo "🎮 مرحباً بك في متجر الألعاب"
echo "================================"

# التحقق من وجود PHP
if ! command -v php &> /dev/null; then
    echo "❌ PHP غير مثبت. يرجى تثبيت PHP 8.1 أو أحدث"
    exit 1
fi

# التحقق من وجود Composer
if ! command -v composer &> /dev/null; then
    echo "❌ Composer غير مثبت. يرجى تثبيت Composer"
    exit 1
fi

# التحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. يرجى تثبيت Node.js 18 أو أحدث"
    exit 1
fi

# التحقق من وجود npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm غير مثبت. يرجى تثبيت npm"
    exit 1
fi

echo "✅ جميع المتطلبات متوفرة"
echo ""

# إعداد Backend
echo "🔧 إعداد Backend (Laravel)..."
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ تم إنشاء ملف .env"
fi

if [ ! -d "vendor" ]; then
    echo "📦 تثبيت تبعيات PHP..."
    composer install
fi

if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 إنشاء مفتاح التطبيق..."
    php artisan key:generate
fi

echo "✅ Backend جاهز"
echo ""

# إعداد Frontend
echo "🔧 إعداد Frontend (React)..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "📦 تثبيت تبعيات Node.js..."
    npm install
fi

echo "✅ Frontend جاهز"
echo ""

echo "🚀 لتشغيل المشروع:"
echo "1. تشغيل Backend: cd backend && php artisan serve"
echo "2. تشغيل Frontend: cd frontend && npm start"
echo ""
echo "🔗 الروابط:"
echo "- Backend: http://localhost:8000"
echo "- Frontend: http://localhost:3000"
echo ""
echo "👤 حسابات الاختبار:"
echo "- مدير: admin@gamestore.com / password123"
echo "- عميل: customer@example.com / password123"
echo ""
echo "📚 راجع README.md للمزيد من التفاصيل"

