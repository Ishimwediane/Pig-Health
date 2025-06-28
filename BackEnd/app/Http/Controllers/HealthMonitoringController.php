<?php
namespace App\Http\Controllers;

use App\Models\HealthMonitoring;
use App\Models\Pig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class HealthMonitoringController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pig_id' => 'required|exists:pigs,id',
            'temperature' => 'required|numeric',
            'heart_rate' => 'required|numeric',
            'respiratory_rate' => 'required|numeric',
            'weight' => 'required|numeric',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $pig = Pig::findOrFail($request->pig_id);
        
        // Check if user owns the pig
        if ($pig->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this pig'
            ], 403);
        }

        $healthMonitoring = HealthMonitoring::create([
            'pig_id' => $request->pig_id,
            'temperature' => $request->temperature,
            'heart_rate' => $request->heart_rate,
            'respiratory_rate' => $request->respiratory_rate,
            'weight' => $request->weight,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Health monitoring record created successfully',
            'data' => $healthMonitoring
        ], 201);
    }

    public function byPig($pigId)
    {
        $pig = Pig::findOrFail($pigId);
        
        // Check if user owns the pig
        if ($pig->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this pig'
            ], 403);
        }

        $healthRecords = HealthMonitoring::where('pig_id', $pigId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Health monitoring records retrieved successfully',
            'data' => $healthRecords
        ]);
    }
}
