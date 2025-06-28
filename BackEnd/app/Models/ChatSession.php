<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    use HasFactory;

    protected $fillable = ['farmer_id', 'vet_id', 'vet_request_id'];

    public function messages()
    {
        return $this->hasMany(ChatVet::class, 'chat_session_id');
    }

    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function vet()
    {
        return $this->belongsTo(User::class, 'vet_id');
    }
}

