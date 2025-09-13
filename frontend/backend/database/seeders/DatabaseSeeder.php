<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // إنشاء مستخدم إداري
        User::create([
            'name' => 'المدير العام',
            'email' => 'admin@gamestore.com',
            'password' => Hash::make('password123'),
            'phone' => '+966501234567',
            'role' => 'admin'
        ]);

        // إنشاء مستخدم عادي للاختبار
        User::create([
            'name' => 'أحمد محمد',
            'email' => 'customer@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+966507654321',
            'role' => 'customer'
        ]);

        // منتجات PUBG
        $pubgProducts = [
            ['name' => '60 شدة ببجي', 'price' => 5.00, 'description' => 'شدات ببجي موبايل - 60 شدة'],
            ['name' => '325 شدة ببجي', 'price' => 25.00, 'description' => 'شدات ببجي موبايل - 325 شدة'],
            ['name' => '660 شدة ببجي', 'price' => 50.00, 'description' => 'شدات ببجي موبايل - 660 شدة'],
            ['name' => '1800 شدة ببجي', 'price' => 125.00, 'description' => 'شدات ببجي موبايل - 1800 شدة'],
            ['name' => '3850 شدة ببجي', 'price' => 250.00, 'description' => 'شدات ببجي موبايل - 3850 شدة'],
        ];

        foreach ($pubgProducts as $product) {
            Product::create([
                'name' => $product['name'],
                'category' => 'PUBG',
                'price' => $product['price'],
                'description' => $product['description'],
                'stock' => 999,
                'is_active' => true
            ]);
        }

        // منتجات Free Fire
        $freeFireProducts = [
            ['name' => '100 جوهرة فري فاير', 'price' => 10.00, 'description' => 'جواهر فري فاير - 100 جوهرة'],
            ['name' => '310 جوهرة فري فاير', 'price' => 30.00, 'description' => 'جواهر فري فاير - 310 جوهرة'],
            ['name' => '520 جوهرة فري فاير', 'price' => 50.00, 'description' => 'جواهر فري فاير - 520 جوهرة'],
            ['name' => '1080 جوهرة فري فاير', 'price' => 100.00, 'description' => 'جواهر فري فاير - 1080 جوهرة'],
        ];

        foreach ($freeFireProducts as $product) {
            Product::create([
                'name' => $product['name'],
                'category' => 'FreeFire',
                'price' => $product['price'],
                'description' => $product['description'],
                'stock' => 999,
                'is_active' => true
            ]);
        }

        // بطاقات جوجل بلاي
        $googlePlayProducts = [
            ['name' => 'بطاقة جوجل بلاي 25 ريال', 'price' => 25.00, 'description' => 'بطاقة جوجل بلاي بقيمة 25 ريال سعودي'],
            ['name' => 'بطاقة جوجل بلاي 50 ريال', 'price' => 50.00, 'description' => 'بطاقة جوجل بلاي بقيمة 50 ريال سعودي'],
            ['name' => 'بطاقة جوجل بلاي 100 ريال', 'price' => 100.00, 'description' => 'بطاقة جوجل بلاي بقيمة 100 ريال سعودي'],
        ];

        foreach ($googlePlayProducts as $product) {
            Product::create([
                'name' => $product['name'],
                'category' => 'GooglePlay',
                'price' => $product['price'],
                'description' => $product['description'],
                'stock' => 50,
                'is_active' => true
            ]);
        }

        // بطاقات آيتونز
        $itunesProducts = [
            ['name' => 'بطاقة آيتونز 25 ريال', 'price' => 25.00, 'description' => 'بطاقة آيتونز بقيمة 25 ريال سعودي'],
            ['name' => 'بطاقة آيتونز 50 ريال', 'price' => 50.00, 'description' => 'بطاقة آيتونز بقيمة 50 ريال سعودي'],
            ['name' => 'بطاقة آيتونز 100 ريال', 'price' => 100.00, 'description' => 'بطاقة آيتونز بقيمة 100 ريال سعودي'],
        ];

        foreach ($itunesProducts as $product) {
            Product::create([
                'name' => $product['name'],
                'category' => 'iTunes',
                'price' => $product['price'],
                'description' => $product['description'],
                'stock' => 30,
                'is_active' => true
            ]);
        }

        // بطاقات ستيم
        $steamProducts = [
            ['name' => 'بطاقة ستيم 20 دولار', 'price' => 75.00, 'description' => 'بطاقة ستيم بقيمة 20 دولار أمريكي'],
            ['name' => 'بطاقة ستيم 50 دولار', 'price' => 187.50, 'description' => 'بطاقة ستيم بقيمة 50 دولار أمريكي'],
            ['name' => 'بطاقة ستيم 100 دولار', 'price' => 375.00, 'description' => 'بطاقة ستيم بقيمة 100 دولار أمريكي'],
        ];

        foreach ($steamProducts as $product) {
            Product::create([
                'name' => $product['name'],
                'category' => 'Steam',
                'price' => $product['price'],
                'description' => $product['description'],
                'stock' => 20,
                'is_active' => true
            ]);
        }
    }
}
