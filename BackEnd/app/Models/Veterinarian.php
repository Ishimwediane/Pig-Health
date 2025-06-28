<?php
// app/Models/Veterinarian.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Veterinarian extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specialization',
        'license_number',
        'photo'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function serviceRequests()
    {
        return $this->hasMany(VetServiceRequest::class, 'vet_id');
    }

    public function visitRecords()
    {
        return $this->hasMany(VetVisitRecord::class, 'vet_id');
    }

    public function assignedFarmers()
    {
        return $this->hasManyThrough(User::class, VetUserAssignment::class, 'vet_id', 'id', 'id', 'farmer_id');
    }
}
