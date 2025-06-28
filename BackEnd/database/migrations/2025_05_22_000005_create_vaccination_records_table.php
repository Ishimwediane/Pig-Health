<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vaccination_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pig_id')->constrained()->onDelete('cascade');
            $table->string('vaccine_name');
            $table->date('date_given');
            $table->date('next_due_date')->nullable();
            $table->string('administered_by')->nullable(); // Name of person who administered the vaccine
            $table->text('notes')->nullable();
            $table->string('batch_number')->nullable(); // Vaccine batch number
            $table->string('manufacturer')->nullable(); // Vaccine manufacturer
            $table->enum('status', ['completed', 'scheduled', 'missed'])->default('completed');
            $table->string('document_path')->nullable(); // Path to vaccination certificate/document
            $table->timestamps();

            // Add index for faster queries
            $table->index(['pig_id', 'date_given']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('vaccination_records');
    }
};