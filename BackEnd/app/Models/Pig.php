<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pig extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'breed_id',
        'name',
        'age',
        'gender',
        'health_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function breed()
    {
        return $this->belongsTo(PigBreed::class, 'breed_id');
    }

    public function healthMonitoring()
    {
        return $this->hasMany(HealthMonitoring::class);
    }

    public function devices()
    {
        return $this->belongsToMany(Device::class, 'pig_device')
            ->withPivot('assigned_at', 'removed_at')
            ->withTimestamps();
    }

    public function currentDevice()
    {
        return $this->devices()
            ->wherePivotNull('removed_at')
            ->first();
    }

    public function vaccinationRecords(): HasMany
    {
        return $this->hasMany(VaccinationRecord::class, 'pig_id');
    }

    public function healthRecords(): HasMany
    {
        return $this->hasMany(HealthRecord::class, 'pig_id');
    }
}
