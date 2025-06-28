<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'device_id',
        'name',
        'description',
        'status'
    ];

    public function pigs()
    {
        return $this->belongsToMany(Pig::class, 'pig_device')
            ->withPivot('assigned_at', 'removed_at')
            ->withTimestamps();
    }

    public function healthMonitoring()
    {
        return $this->hasMany(HealthMonitoring::class);
    }

    public function currentPig()
    {
        return $this->belongsToMany(Pig::class, 'pig_device')
            ->wherePivotNull('removed_at')
            ->withPivot('assigned_at')
            ->withTimestamps();
    }
} 