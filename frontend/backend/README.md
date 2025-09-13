# متجر شدات الألعاب - Game Top-Up Store

## نظرة عامة
موقع Laravel لبيع شدات الألعاب وبطاقات الهدايا الرقمية مثل PUBG، Free Fire، Google Play، iTunes، وSteam.

## الميزات الرئيسية

### 🎮 المنتجات المدعومة
- **PUBG Mobile**: شدات ببجي بفئات مختلفة
- **Free Fire**: جواهر فري فاير
- **Google Play**: بطاقات جوجل بلاي
- **iTunes**: بطاقات آيتونز
- **Steam**: بطاقات ستيم

### 🔐 نظام المصادقة
- تسجيل المستخدمين الجدد
- تسجيل الدخول والخروج
- إدارة الملف الشخصي
- نظام الأدوار (مدير/عميل)

### 💳 نظام الدفع
- دعم طرق دفع متعددة (Visa, MasterCard, PayPal, mada, STC Pay, Apple Pay)
- معالجة المدفوعات الآمنة
- تتبع حالة المدفوعات
- Webhook للتحديثات الخارجية

### 📊 لوحة التحكم الإدارية
- إحصائيات شاملة للمبيعات
- إدارة المنتجات والطلبات
- تقارير الإيرادات
- إدارة المستخدمين

### 🛒 إدارة الطلبات
- إنشاء طلبات جديدة
- تتبع حالة الطلبات
- إدارة المخزون التلقائية
- نظام الإشعارات

## متطلبات النظام
- PHP 8.1+
- Laravel 11.x
- MySQL 8.0+
- Composer
- Node.js & NPM

## التثبيت

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd game-topup
```

### 2. تثبيت التبعيات
```bash
composer install
npm install
```

### 3. إعداد البيئة
```bash
cp .env.example .env
php artisan key:generate
```

### 4. إعداد قاعدة البيانات
قم بتحديث ملف `.env` بمعلومات قاعدة البيانات:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=game_topup
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 5. تشغيل المايجريشن والسيدر
```bash
php artisan migrate
php artisan db:seed
```

### 6. إعداد Laravel Sanctum
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 7. تشغيل الخادم
```bash
php artisan serve
```

## API Endpoints

### المصادقة
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/logout` - تسجيل الخروج
- `GET /api/auth/user` - بيانات المستخدم الحالي
- `PUT /api/auth/profile` - تحديث الملف الشخصي

### المنتجات
- `GET /api/products` - عرض جميع المنتجات
- `GET /api/products/categories` - عرض الفئات
- `GET /api/products/{id}` - عرض منتج محدد
- `POST /api/products` - إضافة منتج جديد (إداري)
- `PUT /api/products/{id}` - تحديث منتج (إداري)
- `DELETE /api/products/{id}` - حذف منتج (إداري)

### الطلبات
- `GET /api/orders` - عرض الطلبات
- `POST /api/orders` - إنشاء طلب جديد
- `GET /api/orders/{id}` - عرض طلب محدد
- `PUT /api/orders/{id}` - تحديث طلب
- `DELETE /api/orders/{id}` - حذف طلب
- `GET /api/orders/statistics` - إحصائيات الطلبات (إداري)

### المدفوعات
- `GET /api/payments` - عرض المدفوعات
- `POST /api/payments` - إنشاء دفعة جديدة
- `GET /api/payments/{id}` - عرض دفعة محددة
- `PUT /api/payments/{id}` - تحديث دفعة
- `DELETE /api/payments/{id}` - حذف دفعة
- `GET /api/payments/statistics` - إحصائيات المدفوعات (إداري)
- `POST /api/payments/webhook` - webhook للمدفوعات

### لوحة التحكم (إداري)
- `GET /api/dashboard/stats` - الإحصائيات العامة
- `GET /api/dashboard/recent-orders` - الطلبات الحديثة
- `GET /api/dashboard/top-products` - أفضل المنتجات
- `GET /api/dashboard/revenue-chart` - مخطط الإيرادات

## بيانات الاختبار

### حسابات المستخدمين
**المدير:**
- البريد الإلكتروني: `admin@gamestore.com`
- كلمة المرور: `password123`

**العميل:**
- البريد الإلكتروني: `customer@example.com`
- كلمة المرور: `password123`

## الأمان
- استخدام Laravel Sanctum للمصادقة
- تشفير كلمات المرور
- حماية CSRF
- تنظيف البيانات المدخلة
- نظام الأذونات والأدوار

## المساهمة
1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص
هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم
للحصول على الدعم، يرجى فتح issue في GitHub أو التواصل عبر البريد الإلكتروني.

## التحديثات المستقبلية
- [ ] إضافة المزيد من طرق الدفع
- [ ] نظام الكوبونات والخصومات
- [ ] تطبيق الهاتف المحمول
- [ ] نظام الإحالة والمكافآت
- [ ] دعم العملات المتعددة
- [ ] نظام التقييمات والمراجعات
