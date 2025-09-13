<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    /**
     * عرض جميع المنتجات
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Product::query();

            // فلترة حسب الفئة
            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            // فلترة المنتجات النشطة فقط
            if ($request->boolean('active_only', true)) {
                $query->active();
            }

            // فلترة المنتجات المتوفرة في المخزون
            if ($request->boolean('in_stock_only', false)) {
                $query->inStock();
            }

            // ترتيب النتائج
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $products = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $products,
                'message' => 'تم جلب المنتجات بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب المنتجات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إضافة منتج جديد
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string|in:PUBG,FreeFire,GooglePlay,iTunes,Steam',
                'price' => 'required|numeric|min:0',
                'description' => 'nullable|string|max:1000',
                'stock' => 'nullable|integer|min:0',
                'image' => 'nullable|url',
                'is_active' => 'boolean'
            ]);

            // تعيين القيم الافتراضية
            $validated['stock'] = $validated['stock'] ?? 999;
            $validated['is_active'] = $validated['is_active'] ?? true;

            $product = Product::create($validated);

            return response()->json([
                'success' => true,
                'data' => $product,
                'message' => 'تم إنشاء المنتج بنجاح'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء المنتج',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض منتج محدد
     */
    public function show(Product $product): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $product->load('orders'),
                'message' => 'تم جلب المنتج بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب المنتج',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث منتج
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'category' => 'sometimes|string|in:PUBG,FreeFire,GooglePlay,iTunes,Steam',
                'price' => 'sometimes|numeric|min:0',
                'description' => 'nullable|string|max:1000',
                'stock' => 'sometimes|integer|min:0',
                'image' => 'nullable|url',
                'is_active' => 'boolean'
            ]);

            $product->update($validated);

            return response()->json([
                'success' => true,
                'data' => $product->fresh(),
                'message' => 'تم تحديث المنتج بنجاح'
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
                'message' => 'حدث خطأ في تحديث المنتج',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف منتج
     */
    public function destroy(Product $product): JsonResponse
    {
        try {
            // التحقق من وجود طلبات مرتبطة
            if ($product->orders()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكن حذف المنتج لوجود طلبات مرتبطة به'
                ], 400);
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف المنتج بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف المنتج',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * الحصول على فئات المنتجات
     */
    public function categories(): JsonResponse
    {
        try {
            $categories = [
                'PUBG' => 'شدات ببجي',
                'FreeFire' => 'جواهر فري فاير',
                'GooglePlay' => 'بطاقات جوجل بلاي',
                'iTunes' => 'بطاقات آيتونز',
                'Steam' => 'بطاقات ستيم'
            ];

            return response()->json([
                'success' => true,
                'data' => $categories,
                'message' => 'تم جلب الفئات بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الفئات',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

