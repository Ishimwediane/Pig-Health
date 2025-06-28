<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PigBreed extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'characteristics',
        'average_weight',
        'growth_rate',
        'feed_efficiency'
    ];

    protected $casts = [
        'average_weight' => 'float',
        'growth_rate' => 'float',
        'feed_efficiency' => 'float'
    ];

    public function pigs()
    {
        return $this->hasMany(Pig::class, 'breed_id');
    }
} 