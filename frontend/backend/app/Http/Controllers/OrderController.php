<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * عرض جميع الطلبات
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Order::with(['user:id,name,email', 'product:id,name,category,price', 'payment']);

            // فلترة حسب المستخدم
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            // فلترة حسب الحالة
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // فلترة حسب الفئة
            if ($request->has('category')) {
                $query->whereHas('product', function ($q) use ($request) {
                    $q->where('category', $request->category);
                });
            }

            // ترتيب النتائج
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $orders = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $orders,
                'message' => 'تم جلب الطلبات بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الطلبات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إنشاء طلب جديد
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1|max:100',
                'player_id' => 'required|string|max:255',
                'notes' => 'nullable|string|max:500'
            ]);

            DB::beginTransaction();

            // التحقق من توفر المنتج
            $product = Product::findOrFail($validated['product_id']);
            
            if (!$product->isAvailable()) {
                return response()->json([
                    'success' => false,
                    'message' => 'المنتج غير متوفر حالياً'
                ], 400);
            }

            if ($product->stock < $validated['quantity']) {
                return response()->json([
                    'success' => false,
                    'message' => 'الكمية المطلوبة غير متوفرة في المخزون'
                ], 400);
            }

            // إنشاء الطلب
            $validated['status'] = 'pending';
            $validated['total_amount'] = $product->price * $validated['quantity'];

            $order = Order::create($validated);

            // تقليل المخزون
            $product->decreaseStock($validated['quantity']);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $order->load(['user:id,name,email', 'product:id,name,category,price']),
                'message' => 'تم إنشاء الطلب بنجاح'
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء الطلب',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض طلب محدد
     */
    public function show(Order $order): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $order->load(['user:id,name,email', 'product:id,name,category,price', 'payment']),
                'message' => 'تم جلب الطلب بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الطلب',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث طلب
     */
    public function update(Request $request, Order $order): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'sometimes|in:pending,paid,completed,failed,cancelled',
                'player_id' => 'sometimes|string|max:255',
                'notes' => 'nullable|string|max:500'
            ]);

            // منع تحديث الطلبات المكتملة أو الملغاة
            if (in_array($order->status, ['completed', 'cancelled'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكن تحديث طلب مكتمل أو ملغي'
                ], 400);
            }

            $order->update($validated);

            return response()->json([
                'success' => true,
                'data' => $order->fresh(['user:id,name,email', 'product:id,name,category,price', 'payment']),
                'message' => 'تم تحديث الطلب بنجاح'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث الطلب',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إلغاء طلب
     */
    public function destroy(Order $order): JsonResponse
    {
        try {
            // منع حذف الطلبات المدفوعة أو المكتملة
            if (in_array($order->status, ['paid', 'completed'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكن حذف طلب مدفوع أو مكتمل'
                ], 400);
            }

            DB::beginTransaction();

            // إرجاع المخزون إذا كان الطلب معلقاً
            if ($order->status === 'pending' && $order->product) {
                $order->product->increment('stock', $order->quantity);
            }

            $order->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الطلب بنجاح'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف الطلب',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات الطلبات
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'completed_orders' => Order::where('status', 'completed')->count(),
                'failed_orders' => Order::where('status', 'failed')->count(),
                'total_revenue' => Order::where('status', 'completed')->sum('total_amount'),
                'today_orders' => Order::whereDate('created_at', today())->count(),
                'today_revenue' => Order::whereDate('created_at', today())
                    ->where('status', 'completed')
                    ->sum('total_amount')
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
}

