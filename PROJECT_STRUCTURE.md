# 📁 هيكل المشروع

```
complete-game-store/
├── backend/                    # مشروع Laravel (API)
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # Controllers
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   ├── PaymentController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   └── UserController.php
│   │   │   └── Middleware/     # Middleware
│   │   │       └── AdminMiddleware.php
│   │   └── Models/             # Models
│   │       ├── Order.php
│   │       ├── Payment.php
│   │       ├── Product.php
│   │       └── User.php
│   ├── database/
│   │   ├── migrations/         # Database migrations
│   │   └── seeders/           # Database seeders
│   ├── routes/
│   │   └── api.php            # API routes
│   ├── .env.example           # Environment template
│   └── composer.json          # PHP dependencies
│
├── frontend/                   # تطبيق React
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Layout/
│   │   │   │   ├── Header.js
│   │   │   │   ├── Footer.js
│   │   │   │   └── Layout.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/           # React context
│   │   │   └── AuthContext.js
│   │   ├── pages/             # صفحات التطبيق
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   ├── Products.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── Orders.js
│   │   │   ├── OrderDetail.js
│   │   │   ├── Payment.js
│   │   │   └── AdminDashboard.js
│   │   ├── services/          # API services
│   │   │   └── api.js
│   │   └── App.js             # التطبيق الرئيسي
│   ├── public/                # الملفات العامة
│   └── package.json           # Node.js dependencies
│
├── README.md                   # دليل المشروع الشامل
├── SETUP.md                   # دليل الإعداد السريع
├── PROJECT_STRUCTURE.md      # هيكل المشروع (هذا الملف)
└── start.sh                   # سكريبت التشغيل السريع
```

## 🔧 الملفات الرئيسية

### Backend (Laravel)

- **Controllers**: معالجة طلبات API
- **Models**: نماذج قاعدة البيانات
- **Migrations**: هيكل قاعدة البيانات
- **Seeders**: البيانات التجريبية
- **Routes**: مسارات API

### Frontend (React)

- **Components**: مكونات React قابلة للإعادة الاستخدام
- **Pages**: صفحات التطبيق
- **Context**: إدارة حالة التطبيق
- **Services**: خدمات API

## 🚀 نقاط البداية

1. **Backend**: `backend/routes/api.php`
2. **Frontend**: `frontend/src/App.js`
3. **API Service**: `frontend/src/services/api.js`
4. **Auth Context**: `frontend/src/context/AuthContext.js`

## 📊 قاعدة البيانات

### الجداول الرئيسية

- **users**: المستخدمين
- **products**: المنتجات
- **orders**: الطلبات
- **payments**: المدفوعات

### العلاقات

- User → Orders (One to Many)
- Product → Orders (One to Many)
- Order → Payment (One to One)

## 🔐 المصادقة

- **Backend**: Laravel Sanctum
- **Frontend**: Context API + localStorage
- **Middleware**: حماية المسارات

