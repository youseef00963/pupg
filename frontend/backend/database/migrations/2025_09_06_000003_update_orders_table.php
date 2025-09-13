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
        Schema::table('orders', function (Blueprint $table) {
            $table->integer('quantity')->default(1)->after('product_id');
            $table->decimal('total_amount', 10, 2)->nullable()->after('quantity');
            $table->string('player_id')->nullable()->after('total_amount');
            $table->text('notes')->nullable()->after('player_id');
            
            // تحديث enum للحالات
            $table->dropColumn('status');
        });
        
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['pending', 'paid', 'completed', 'failed', 'cancelled'])->default('pending')->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['quantity', 'total_amount', 'player_id', 'notes']);
            $table->dropColumn('status');
        });
        
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['pending', 'paid', 'completed', 'failed'])->default('pending');
        });
    }
};

