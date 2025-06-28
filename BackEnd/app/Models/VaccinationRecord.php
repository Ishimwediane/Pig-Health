<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VaccinationRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'pig_id',
        'vaccine_name',
        'date_given',
        'next_due_date',
        'administered_by',
        'notes',
        'batch_number',
        'manufacturer',
        'document_path'
    ];

    protected $casts = [
        'date_given' => 'date',
        'next_due_date' => 'date'
    ];

    public function pig(): BelongsTo
    {
        return $this->belongsTo(Pig::class, 'pig_id');
    }

    public function veterinarian(): BelongsTo
    {
        return $this->belongsTo(Veterinarian::class, 'administered_by');
    }
}
