<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'status',
        'quantity',
        'total_amount',
        'player_id',
        'notes'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'quantity' => 'integer'
    ];

    // العلاقات
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    // Methods
    public function isPaid()
    {
        return $this->payment && $this->payment->status === 'success';
    }

    public function canBeCompleted()
    {
        return $this->status === 'paid' && $this->isPaid();
    }

    public function calculateTotal()
    {
        if ($this->product) {
            $this->total_amount = $this->product->price * $this->quantity;
            $this->save();
        }
    }

    // Boot method لحساب المجموع تلقائياً
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if ($order->product) {
                $order->total_amount = $order->product->price * ($order->quantity ?? 1);
            }
        });
    }
}

