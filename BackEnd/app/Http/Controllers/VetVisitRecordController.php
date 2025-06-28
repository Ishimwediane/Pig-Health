<?php

namespace App\Http\Controllers;

use App\Models\VetVisitRecord;
use App\Models\VetServiceRequest;
use App\Models\Veterinarian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class VetVisitRecordController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        $records = VetVisitRecord::where('vet_id', $vet->id)
            ->with(['serviceRequest.pig', 'serviceRequest.user'])
            ->orderBy('visit_time', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Visit records retrieved successfully',
            'data' => $records
        ]);
    }

    public function show($id)
    {
        $record = VetVisitRecord::with(['serviceRequest.pig', 'serviceRequest.user'])
            ->findOrFail($id);

        // Check if user has access to this record
        if ($record->vet_id !== Auth::user()->veterinarian->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this record'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Visit record retrieved successfully',
            'data' => $record
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'service_request_id' => 'required|exists:vet_service_requests,id',
            'visit_time' => 'required|date',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'prescription' => 'nullable|string',
            'notes' => 'nullable|string',
            'follow_up_date' => 'nullable|date|after:today',
            'fee' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $serviceRequest = VetServiceRequest::findOrFail($request->service_request_id);
        $user = Auth::user();
        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        // Check if the service request is assigned to this vet
        if ($serviceRequest->vet_id !== $vet->id) {
            return response()->json([
                'success' => false,
                'message' => 'This service request is not assigned to you'
            ], 403);
        }

        $record = VetVisitRecord::create([
            'vet_id' => $vet->id,
            'service_request_id' => $request->service_request_id,
            'visit_time' => $request->visit_time,
            'diagnosis' => $request->diagnosis,
            'treatment' => $request->treatment,
            'prescription' => $request->prescription,
            'notes' => $request->notes,
            'follow_up_date' => $request->follow_up_date,
            'fee' => $request->fee
        ]);

        // Update service request status to completed
        $serviceRequest->status = 'completed';
        $serviceRequest->save();

        return response()->json([
            'success' => true,
            'message' => 'Visit record created successfully',
            'data' => $record
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'visit_time' => 'date',
            'diagnosis' => 'string',
            'treatment' => 'string',
            'prescription' => 'nullable|string',
            'notes' => 'nullable|string',
            'follow_up_date' => 'nullable|date|after:today',
            'fee' => 'numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $record = VetVisitRecord::findOrFail($id);
        
        // Check if user has access to this record
        if ($record->vet_id !== Auth::user()->veterinarian->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this record'
            ], 403);
        }

        $record->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Visit record updated successfully',
            'data' => $record
        ]);
    }

    public function destroy($id)
    {
        $record = VetVisitRecord::findOrFail($id);
        
        // Check if user has access to this record
        if ($record->vet_id !== Auth::user()->veterinarian->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this record'
            ], 403);
        }

        $record->delete();

        return response()->json([
            'success' => true,
            'message' => 'Visit record deleted successfully',
            'data' => null
        ]);
    }

    public function getFarmerHistory($farmerId)
    {
        $user = Auth::user();
        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        $records = VetVisitRecord::where('vet_id', $vet->id)
            ->whereHas('serviceRequest', function ($query) use ($farmerId) {
                $query->where('user_id', $farmerId);
            })
            ->with(['serviceRequest.pig'])
            ->orderBy('visit_time', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Farmer visit history retrieved successfully',
            'data' => $records
        ]);
    }
}
