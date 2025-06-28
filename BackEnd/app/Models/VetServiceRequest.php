<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class VetServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'vet_id',
        'pig_id',
        'service_type',
        'purpose',
        'description',
        'urgency_level',
        'status',
        'scheduled_time',
       
        'recommendations',
        'prescriptions',
        'findings',
        'rejection_reason'
    ];

    protected $casts = [
        'scheduled_time' => 'datetime'
    ];

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function vet(): BelongsTo
    {
        return $this->belongsTo(Veterinarian::class, 'vet_id');
    }

    public function pig(): BelongsTo
    {
        return $this->belongsTo(Pig::class, 'pig_id');
    }

    public function visitRecord(): HasOne
    {
        return $this->hasOne(VetVisitRecord::class, 'vet_service_request_id');
    }

    public function chatMessages(): HasMany
    {
        return $this->hasMany(VetChatMessage::class);
    }

    public function chatFiles(): HasMany
    {
        return $this->hasMany(VetChatFile::class);
    }
}
