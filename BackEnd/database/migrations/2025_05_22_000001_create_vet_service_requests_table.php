<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vet_service_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained('users');
            $table->foreignId('vet_id')->constrained('veterinarians');
            $table->foreignId('pig_id')->constrained();
            $table->string('purpose');
            
            $table->dateTime('scheduled_time');
            $table->enum('urgency_level', ['low', 'medium', 'high', 'emergency']);
            $table->text('description');
            $table->enum('status', ['pending', 'accepted', 'rejected', 'completed', 'cancelled'])->default('pending');
            $table->text('vet_response')->nullable();
            $table->text('rejection_reason')->nullable()->after('vet_response');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vet_service_requests');
    }
}; 