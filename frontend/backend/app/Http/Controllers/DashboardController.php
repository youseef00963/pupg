<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * إحصائيات عامة للوحة التحكم
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                // إحصائيات عامة
                'total_users' => User::where('role', 'customer')->count(),
                'total_products' => Product::count(),
                'active_products' => Product::active()->count(),
                'total_orders' => Order::count(),
                'total_revenue' => Payment::successful()->sum('amount'),

                // إحصائيات اليوم
                'today' => [
                    'orders' => Order::whereDate('created_at', today())->count(),
                    'revenue' => Payment::successful()->whereDate('created_at', today())->sum('amount'),
                    'new_users' => User::whereDate('created_at', today())->count()
                ],

                // إحصائيات هذا الشهر
                'this_month' => [
                    'orders' => Order::whereMonth('created_at', now()->month)->count(),
                    'revenue' => Payment::successful()->whereMonth('created_at', now()->month)->sum('amount'),
                    'new_users' => User::whereMonth('created_at', now()->month)->count()
                ],

                // حالات الطلبات
                'order_status' => [
                    'pending' => Order::where('status', 'pending')->count(),
                    'paid' => Order::where('status', 'paid')->count(),
                    'completed' => Order::where('status', 'completed')->count(),
                    'failed' => Order::where('status', 'failed')->count(),
                    'cancelled' => Order::where('status', 'cancelled')->count()
                ],

                // حالات المدفوعات
                'payment_status' => [
                    'pending' => Payment::where('status', 'pending')->count(),
                    'success' => Payment::where('status', 'success')->count(),
                    'failed' => Payment::where('status', 'failed')->count()
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'تم جلب الإحصائيات بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الإحصائيات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * الطلبات الحديثة
     */
    public function recentOrders(Request $request): JsonResponse
    {
        try {
            $limit = $request->get('limit', 10);

            $orders = Order::with(['user:id,name,email', 'product:id,name,category,price', 'payment'])
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $orders,
                'message' => 'تم جلب الطلبات الحديثة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الطلبات الحديثة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * أفضل المنتجات مبيعاً
     */
    public function topProducts(Request $request): JsonResponse
    {
        try {
            $limit = $request->get('limit', 10);

            $products = Product::withCount(['orders as total_orders'])
                ->withSum(['orders as total_revenue' => function ($query) {
                    $query->whereHas('payment', function ($q) {
                        $q->where('status', 'success');
                    });
                }], 'total_amount')
                ->orderBy('total_orders', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $products,
                'message' => 'تم جلب أفضل المنتجات بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب أفضل المنتجات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * مخطط الإيرادات
     */
    public function revenueChart(Request $request): JsonResponse
    {
        try {
            $period = $request->get('period', 'week'); // week, month, year
            $startDate = now();
            $format = '';

            switch ($period) {
                case 'week':
                    $startDate = now()->subDays(7);
                    $format = '%Y-%m-%d';
                    break;
                case 'month':
                    $startDate = now()->subDays(30);
                    $format = '%Y-%m-%d';
                    break;
                case 'year':
                    $startDate = now()->subMonths(12);
                    $format = '%Y-%m';
                    break;
            }

            $revenue = Payment::where('status', 'success')
                ->where('created_at', '>=', $startDate)
                ->selectRaw("DATE_FORMAT(created_at, '{$format}') as date")
                ->selectRaw('SUM(amount) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // إنشاء مصفوفة كاملة للتواريخ
            $chartData = [];
            $current = $startDate->copy();

            while ($current <= now()) {
                $dateKey = $current->format($period === 'year' ? 'Y-m' : 'Y-m-d');
                $chartData[$dateKey] = 0;
                
                if ($period === 'year') {
                    $current->addMonth();
                } else {
                    $current->addDay();
                }
            }

            // ملء البيانات الفعلية
            foreach ($revenue as $item) {
                $chartData[$item->date] = (float) $item->total;
            }

            $result = [];
            foreach ($chartData as $date => $amount) {
                $result[] = [
                    'date' => $date,
                    'amount' => $amount
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'تم جلب مخطط الإيرادات بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب مخطط الإيرادات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات المنتجات حسب الفئة
     */
    public function categoryStats(): JsonResponse
    {
        try {
            $stats = Product::selectRaw('category, COUNT(*) as count, SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count')
                ->groupBy('category')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'تم جلب إحصائيات الفئات بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب إحصائيات الفئات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات طرق الدفع
     */
    public function paymentMethodStats(): JsonResponse
    {
        try {
            $stats = Payment::where('status', 'success')
                ->selectRaw('method, COUNT(*) as count, SUM(amount) as total_amount')
                ->groupBy('method')
                ->orderBy('total_amount', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'تم جلب إحصائيات طرق الدفع بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب إحصائيات طرق الدفع',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

