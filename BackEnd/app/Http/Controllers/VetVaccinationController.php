<?php

namespace App\Http\Controllers;

use App\Models\Pig;
use App\Models\VaccinationRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class VetVaccinationController extends Controller
{
    public function store(Request $request, Pig $pig)
    {
        $validated = $request->validate([
            'vaccine_name' => 'required|string',
            'date_given' => 'required|date',
            'next_due_date' => 'required|date',
            'administered_by' => 'required|string',
            'notes' => 'nullable|string',
            'batch_number' => 'nullable|string',
            'manufacturer' => 'nullable|string',
            'document' => 'nullable|file|max:5120' // 5MB max
        ]);

        $data = [
            'pig_id' => $pig->id,
            'vaccine_name' => $validated['vaccine_name'],
            'date_given' => $validated['date_given'],
            'next_due_date' => $validated['next_due_date'],
            'administered_by' => $validated['administered_by'],
            'notes' => $validated['notes'],
            'batch_number' => $validated['batch_number'],
            'manufacturer' => $validated['manufacturer'],
            'status' => 'completed'
        ];

        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $path = $file->store('vaccination-documents');
            $data['document_path'] = $path;
        }

        $vaccination = VaccinationRecord::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccination record created successfully',
            'data' => [
                'vaccination' => $vaccination
            ]
        ]);
    }

    public function index(Pig $pig)
    {
        $vaccinations = $pig->vaccinationRecords()
            ->latest('date_given')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'vaccinations' => $vaccinations
            ]
        ]);
    }

    public function show(VaccinationRecord $vaccination)
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'vaccination' => $vaccination
            ]
        ]);
    }

    public function update(Request $request, VaccinationRecord $vaccination)
    {
        $validated = $request->validate([
            'vaccine_name' => 'required|string',
            'date_given' => 'required|date',
            'next_due_date' => 'required|date',
            'administered_by' => 'required|string',
            'notes' => 'nullable|string',
            'batch_number' => 'nullable|string',
            'manufacturer' => 'nullable|string',
            'document' => 'nullable|file|max:5120' // 5MB max
        ]);

        $data = [
            'vaccine_name' => $validated['vaccine_name'],
            'date_given' => $validated['date_given'],
            'next_due_date' => $validated['next_due_date'],
            'administered_by' => $validated['administered_by'],
            'notes' => $validated['notes'],
            'batch_number' => $validated['batch_number'],
            'manufacturer' => $validated['manufacturer']
        ];

        if ($request->hasFile('document')) {
            // Delete old document if exists
            if ($vaccination->document_path) {
                Storage::delete($vaccination->document_path);
            }

            $file = $request->file('document');
            $path = $file->store('vaccination-documents');
            $data['document_path'] = $path;
        }

        $vaccination->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccination record updated successfully',
            'data' => [
                'vaccination' => $vaccination
            ]
        ]);
    }

    public function destroy(VaccinationRecord $vaccination)
    {
        if ($vaccination->document_path) {
            Storage::delete($vaccination->document_path);
        }

        $vaccination->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccination record deleted successfully'
        ]);
    }
    public function all()
{
    $vaccinations = \App\Models\VaccinationRecord::with('pig')->latest('date_given')->get();

    return response()->json([
        'status' => 'success',
        'data' => [
            'vaccinations' => $vaccinations
        ]
    ]);
}
} 