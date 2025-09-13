<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * عرض جميع المدفوعات
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Payment::with(['order.user:id,name,email', 'order.product:id,name,category']);

            // فلترة حسب الحالة
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // فلترة حسب طريقة الدفع
            if ($request->has('method')) {
                $query->where('method', $request->method);
            }

            // فلترة حسب المستخدم
            if ($request->has('user_id')) {
                $query->whereHas('order', function ($q) use ($request) {
                    $q->where('user_id', $request->user_id);
                });
            }

            // ترتيب النتائج
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $payments = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $payments,
                'message' => 'تم جلب المدفوعات بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب المدفوعات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إنشاء دفعة جديدة
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'order_id' => 'required|exists:orders,id',
                'method' => 'required|string|in:visa,mastercard,paypal,mada,stc_pay,apple_pay',
                'amount' => 'required|numeric|min:0'
            ]);

            DB::beginTransaction();

            // التحقق من الطلب
            $order = Order::findOrFail($validated['order_id']);

            // التحقق من عدم وجود دفعة سابقة ناجحة
            if ($order->payment && $order->payment->isSuccessful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'تم دفع هذا الطلب مسبقاً'
                ], 400);
            }

            // التحقق من مطابقة المبلغ
            if ($validated['amount'] != $order->total_amount) {
                return response()->json([
                    'success' => false,
                    'message' => 'المبلغ غير مطابق لقيمة الطلب'
                ], 400);
            }

            // حذف الدفعة السابقة إن وجدت
            if ($order->payment) {
                $order->payment->delete();
            }

            // إنشاء الدفعة
            $validated['status'] = 'pending';
            $validated['transaction_id'] = 'TXN_' . Str::upper(Str::random(10));

            $payment = Payment::create($validated);

            // محاكاة معالجة الدفع (يجب استبدالها بـ API حقيقي)
            $this->processPayment($payment);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $payment->load(['order.user:id,name,email', 'order.product:id,name,category']),
                'message' => 'تم إنشاء الدفعة بنجاح'
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
                'message' => 'حدث خطأ في إنشاء الدفعة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض دفعة محددة
     */
    public function show(Payment $payment): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $payment->load(['order.user:id,name,email', 'order.product:id,name,category']),
                'message' => 'تم جلب الدفعة بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الدفعة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث دفعة
     */
    public function update(Request $request, Payment $payment): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'sometimes|in:pending,success,failed',
                'transaction_id' => 'sometimes|string|max:255',
                'gateway_response' => 'sometimes|array'
            ]);

            // منع تحديث الدفعات المكتملة
            if ($payment->isSuccessful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكن تحديث دفعة مكتملة'
                ], 400);
            }

            DB::beginTransaction();

            $payment->update($validated);

            // تحديث حالة الطلب حسب حالة الدفع
            if (isset($validated['status'])) {
                if ($validated['status'] === 'success') {
                    $payment->order->update(['status' => 'paid']);
                } elseif ($validated['status'] === 'failed') {
                    $payment->order->update(['status' => 'failed']);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $payment->fresh(['order.user:id,name,email', 'order.product:id,name,category']),
                'message' => 'تم تحديث الدفعة بنجاح'
            ]);

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
                'message' => 'حدث خطأ في تحديث الدفعة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف دفعة
     */
    public function destroy(Payment $payment): JsonResponse
    {
        try {
            // منع حذف الدفعات الناجحة
            if ($payment->isSuccessful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكن حذف دفعة ناجحة'
                ], 400);
            }

            $payment->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الدفعة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف الدفعة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * معالجة الدفع (محاكاة)
     */
    private function processPayment(Payment $payment): void
    {
        // محاكاة معالجة الدفع - يجب استبدالها بـ API حقيقي
        $success = rand(1, 10) > 2; // 80% نسبة نجاح

        if ($success) {
            $payment->markAsSuccessful(
                'TXN_SUCCESS_' . Str::upper(Str::random(8)),
                ['gateway' => 'mock', 'status' => 'approved']
            );
        } else {
            $payment->markAsFailed([
                'gateway' => 'mock',
                'status' => 'declined',
                'reason' => 'Insufficient funds'
            ]);
        }
    }

    /**
     * إحصائيات المدفوعات
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_payments' => Payment::count(),
                'successful_payments' => Payment::successful()->count(),
                'pending_payments' => Payment::pending()->count(),
                'failed_payments' => Payment::failed()->count(),
                'total_revenue' => Payment::successful()->sum('amount'),
                'today_payments' => Payment::whereDate('created_at', today())->count(),
                'today_revenue' => Payment::successful()
                    ->whereDate('created_at', today())
                    ->sum('amount'),
                'payment_methods' => Payment::successful()
                    ->selectRaw('method, COUNT(*) as count, SUM(amount) as total')
                    ->groupBy('method')
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'تم جلب إحصائيات المدفوعات بنجاح'
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
     * webhook لاستقبال تحديثات الدفع من البوابات الخارجية
     */
    public function webhook(Request $request): JsonResponse
    {
        try {
            // التحقق من صحة الـ webhook (يجب إضافة التوقيع والتشفير)
            $transactionId = $request->input('transaction_id');
            $status = $request->input('status');
            
            if (!$transactionId || !$status) {
                return response()->json(['error' => 'Invalid webhook data'], 400);
            }

            $payment = Payment::where('transaction_id', $transactionId)->first();
            
            if (!$payment) {
                return response()->json(['error' => 'Payment not found'], 404);
            }

            // تحديث حالة الدفع
            if ($status === 'success') {
                $payment->markAsSuccessful($transactionId, $request->all());
            } elseif ($status === 'failed') {
                $payment->markAsFailed($request->all());
            }

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Webhook processing failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

