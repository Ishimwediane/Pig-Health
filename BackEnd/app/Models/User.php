<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',           // New field for user role (e.g., Farmer, Admin, etc.)
        'profile_image',  // New field for the user's profile image URL
        'location',       // New field for the user's location
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the identifier that will be stored in the JWT claim.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return the custom claims for the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,  // Example of adding custom claim, like role
        ];
    }

    public function isVet()
    {
        return in_array($this->role, ['vet', 'veterinarian']);
    }

    // Vet: See all farmers assigned to them
    public function assignedFarmers()
    {
        return $this->hasManyThrough(User::class, \App\Models\VetUserAssignment::class, 'vet_id', 'id', 'id', 'farmer_id');
    }

    // Farmer: See their assigned vet
    public function assignedVet()
    {
        return $this->hasOne(\App\Models\VetUserAssignment::class, 'farmer_id', 'id');
    }

    // Get the veterinarian details for this user
    public function veterinarian()
    {
        return $this->hasOne(Veterinarian::class);
    }

    public function pigs()
    {
        return $this->hasMany(Pig::class);
    }

    public function vetServiceRequests()
    {
        return $this->hasMany(VetServiceRequest::class);
    }
}
