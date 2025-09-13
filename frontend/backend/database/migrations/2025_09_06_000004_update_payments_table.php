<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('method');
        });
        
        Schema::table('payments', function (Blueprint $table) {
            $table->string('method')->after('amount'); // إعادة إنشاء العمود
            $table->string('transaction_id')->nullable()->after('status');
            $table->json('gateway_response')->nullable()->after('transaction_id');
            $table->timestamp('processed_at')->nullable()->after('gateway_response');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['transaction_id', 'gateway_response', 'processed_at']);
        });
    }
};

