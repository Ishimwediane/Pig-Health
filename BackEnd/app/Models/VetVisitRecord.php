<?php

// app/Models/VetVisitRecord.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VetVisitRecord extends Model
{
    protected $fillable = [
        'vet_service_request_id',
        'vet_id',
        'pig_id',
        'visit_time',
        'notes',
        'prescriptions',
        'recommendations'
    ];

    protected $casts = [
        'visit_time' => 'datetime'
    ];

    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(VetServiceRequest::class, 'vet_service_request_id');
    }

    public function vet(): BelongsTo
    {
        return $this->belongsTo(Veterinarian::class, 'vet_id');
    }

    public function pig(): BelongsTo
    {
        return $this->belongsTo(Pig::class);
    }
}
