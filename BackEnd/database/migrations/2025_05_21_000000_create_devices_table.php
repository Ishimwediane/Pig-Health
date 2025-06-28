<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // First create the devices table
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('device_id')->unique();
            $table->string('name');
            $table->text('description');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // Then create the pig_device pivot table
        Schema::create('pig_device', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pig_id')->constrained('pigs')->onDelete('cascade');
            $table->foreignId('device_id')->constrained('devices')->onDelete('cascade');
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamp('removed_at')->nullable();
            $table->timestamps();
        });

        // Finally create the health_monitoring table
        Schema::create('health_monitoring', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pig_id')->constrained('pigs')->onDelete('cascade');
            $table->foreignId('device_id')->constrained('devices')->onDelete('cascade');
            $table->decimal('temperature', 5, 2)->default(0);
            $table->integer('heartbeat')->default(0);
            $table->text('notes');
            $table->timestamps();
        });
    }

    public function down()
    {
        // Drop tables in reverse order
        Schema::dropIfExists('health_monitoring');
        Schema::dropIfExists('pig_device');
        Schema::dropIfExists('devices');
    }
}; 