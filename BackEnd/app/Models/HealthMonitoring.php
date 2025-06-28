<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthMonitoring extends Model
{
    use HasFactory;

    protected $table = 'health_monitoring';
    protected $fillable = [
        'pig_id',
        'device_id',
        'temperature',
        'heartbeat',
        'notes',
    ];

    public function pig()
    {
        return $this->belongsTo(Pig::class);
    }

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}
