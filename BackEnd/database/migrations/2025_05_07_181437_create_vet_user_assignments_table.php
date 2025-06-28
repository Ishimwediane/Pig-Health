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
        Schema::create('vet_user_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vet_id')->constrained('users');     // Vet user
            $table->foreignId('farmer_id')->constrained('users');  // Farmer user
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vet_user_assignments');
    }
};
