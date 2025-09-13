<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| هنا جميع مسارات API للموقع
| Laravel يضيف /api قبل أي مسار بشكل تلقائي
|--------------------------------------------------------------------------
*/

// مسارات المصادقة
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('user', [AuthController::class, 'user'])->middleware('auth:sanctum');
    Route::put('profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');
});

// مسارات المنتجات (عامة)
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/categories', [ProductController::class, 'categories']);
    Route::get('/{product}', [ProductController::class, 'show']);
});

// مسارات محمية (تتطلب تسجيل دخول)
Route::middleware('auth:sanctum')->group(function () {
    
    // مسارات المستخدمين (للإدارة فقط)
    Route::middleware('admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    });

    // مسارات الطلبات
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/statistics', [OrderController::class, 'statistics'])->middleware('admin');
        Route::get('/{order}', [OrderController::class, 'show']);
        Route::put('/{order}', [OrderController::class, 'update']);
        Route::delete('/{order}', [OrderController::class, 'destroy']);
    });

    // مسارات المدفوعات
    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::post('/', [PaymentController::class, 'store']);
        Route::get('/statistics', [PaymentController::class, 'statistics'])->middleware('admin');
        Route::get('/{payment}', [PaymentController::class, 'show']);
        Route::put('/{payment}', [PaymentController::class, 'update']);
        Route::delete('/{payment}', [PaymentController::class, 'destroy']);
    });

    // لوحة التحكم (للإدارة فقط)
    Route::middleware('admin')->prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/recent-orders', [DashboardController::class, 'recentOrders']);
        Route::get('/top-products', [DashboardController::class, 'topProducts']);
        Route::get('/revenue-chart', [DashboardController::class, 'revenueChart']);
    });
});

// Webhook للمدفوعات (بدون مصادقة)
Route::post('payments/webhook', [PaymentController::class, 'webhook']);

// مسار صحة النظام
Route::get('health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});

