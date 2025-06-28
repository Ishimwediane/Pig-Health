<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VetChatMessage extends Model
{
    protected $fillable = [
        'vet_service_request_id',
        'sender_id',
        'message'
    ];

    protected $casts = [
        'is_read' => 'boolean'
    ];

    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(VetServiceRequest::class, 'vet_service_request_id');
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
} 