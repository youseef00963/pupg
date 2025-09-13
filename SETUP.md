# 🚀 دليل الإعداد السريع

## خطوات التشغيل السريع

### 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm start
```

## 🔗 الروابط

- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/api

## 👤 حسابات الاختبار

**مدير:**
- Email: admin@gamestore.com
- Password: password123

**عميل:**
- Email: customer@example.com
- Password: password123

## ⚡ نصائح سريعة

1. تأكد من تشغيل MySQL قبل البدء
2. تحديث إعدادات قاعدة البيانات في `.env`
3. تشغيل Backend أولاً ثم Frontend
4. استخدام حسابات الاختبار للدخول السريع

## 🛠️ حل المشاكل السريع

**خطأ قاعدة البيانات:**
```bash
php artisan migrate:fresh --seed
```

**خطأ CORS:**
```bash
php artisan config:clear
php artisan cache:clear
```

**خطأ npm:**
```bash
rm -rf node_modules package-lock.json
npm install
```

