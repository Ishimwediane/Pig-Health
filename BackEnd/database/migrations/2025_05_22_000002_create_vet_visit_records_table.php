<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vet_visit_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vet_service_request_id')->constrained();
            $table->foreignId('vet_id')->constrained('veterinarians');
            $table->foreignId('pig_id')->constrained();
            $table->dateTime('visit_time');
            $table->text('notes');
            $table->text('prescriptions')->nullable();
            $table->text('recommendations')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vet_visit_records');
    }
}; 