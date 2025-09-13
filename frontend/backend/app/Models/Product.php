<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'description',
        'price',
        'stock',
        'image',
        'is_active'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'stock' => 'integer'
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Scope للمنتجات النشطة
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope للمنتجات المتوفرة في المخزون
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    // تحقق من توفر المنتج
    public function isAvailable()
    {
        return $this->is_active && $this->stock > 0;
    }

    // تقليل المخزون
    public function decreaseStock($quantity = 1)
    {
        if ($this->stock >= $quantity) {
            $this->decrement('stock', $quantity);
            return true;
        }
        return false;
    }
}

