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
        Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // اسم المنتج (مثلا: شدات ببجي 60)
    $table->string('category'); // نوع الخدمة (PUBG, FreeFire, GooglePlay)
    $table->decimal('price', 10, 2); // السعر
    $table->text('description')->nullable();
    $table->timestamps();
});

        
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
