<?php

namespace App\Http\Controllers;

use App\Models\VaccinationRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VaccinationRecordController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pig_id' => 'required|exists:pigs,id',
            'vaccine_name' => 'required|string',
            'date_given' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record = VaccinationRecord::create($validator->validated());

        return response()->json(['message' => 'Vaccination recorded successfully', 'record' => $record]);
    }

    public function getPigVaccinations($pigId)
    {
        $records = VaccinationRecord::where('pig_id', $pigId)->get();

        return response()->json($records);
    }
}
