<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VetChatFile extends Model
{
    protected $fillable = [
        'vet_service_request_id',
        'uploaded_by',
        'file_name',
        'file_path',
        'file_type',
        'file_size'
    ];

    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(VetServiceRequest::class, 'vet_service_request_id');
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
} 