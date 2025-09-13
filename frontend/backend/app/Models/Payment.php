<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'amount',
        'method',
        'status',
        'transaction_id',
        'gateway_response',
        'processed_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'processed_at' => 'datetime',
        'gateway_response' => 'array'
    ];

    // العلاقات
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Scopes
    public function scopeSuccessful($query)
    {
        return $query->where('status', 'success');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    // Methods
    public function isSuccessful()
    {
        return $this->status === 'success';
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isFailed()
    {
        return $this->status === 'failed';
    }

    public function markAsSuccessful($transactionId = null, $gatewayResponse = null)
    {
        $this->update([
            'status' => 'success',
            'transaction_id' => $transactionId,
            'gateway_response' => $gatewayResponse,
            'processed_at' => now()
        ]);

        // تحديث حالة الطلب
        if ($this->order) {
            $this->order->update(['status' => 'paid']);
        }
    }

    public function markAsFailed($gatewayResponse = null)
    {
        $this->update([
            'status' => 'failed',
            'gateway_response' => $gatewayResponse,
            'processed_at' => now()
        ]);

        // تحديث حالة الطلب
        if ($this->order) {
            $this->order->update(['status' => 'failed']);
        }
    }
}

