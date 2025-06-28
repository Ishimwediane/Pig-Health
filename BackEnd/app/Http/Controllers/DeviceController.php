<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\Pig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DeviceController extends Controller
{
    /**
     * Display a listing of the devices.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get all devices (both assigned and unassigned)
        $devices = Device::with(['healthMonitoring' => function($query) {
                $query->latest();
            }])
            ->get()
            ->map(function($device) {
                // Get the current assignment
                $currentAssignment = DB::table('pig_device')
                    ->where('device_id', $device->id)
                    ->whereNull('removed_at')
                    ->first();

                // Get assignment history
                $assignmentHistory = DB::table('pig_device')
                    ->where('device_id', $device->id)
                    ->join('pigs', 'pig_device.pig_id', '=', 'pigs.id')
                    ->select('pigs.name as pig_name', 'assigned_at', 'removed_at')
                    ->orderBy('assigned_at', 'desc')
                    ->get();

                return [
                    'id' => $device->id,
                    'device_id' => $device->device_id,
                    'name' => $device->name,
                    'description' => $device->description,
                    'status' => $device->status,
                    'current_pig' => $currentAssignment ? [
                        'id' => $currentAssignment->pig_id,
                        'name' => $assignmentHistory->first()->pig_name
                    ] : null,
                    'health_monitoring' => $device->healthMonitoring,
                    'assignment_history' => $assignmentHistory,
                    'is_available' => !$currentAssignment // Add this field to indicate if device is available for assignment
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Devices retrieved successfully',
            'data' => $devices
        ]);
    }

    /**
     * Store a newly created device in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'device_id' => 'required|string|unique:devices',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $device = Device::create([
            'device_id' => $request->device_id,
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status,
            'user_id' => Auth::id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Device created successfully',
            'data' => $device
        ], 201);
    }

    public function show($id)
    {
        $device = Device::findOrFail($id);
        
        // Check if user has access to this device
        if ($device->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this device'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Device retrieved successfully',
            'data' => $device
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string',
            'description' => 'nullable|string',
            'status' => 'in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $device = Device::findOrFail($id);
        
        // Check if user has access to this device
        if ($device->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this device'
            ], 403);
        }

        $device->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Device updated successfully',
            'data' => $device
        ]);
    }

    /**
     * Remove the specified device from storage.
     */
    public function destroy($id)
    {
        $device = Device::findOrFail($id);
        
        // Check if user has access to this device
        if ($device->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this device'
            ], 403);
        }

        $device->delete();

        return response()->json([
            'success' => true,
            'message' => 'Device deleted successfully',
            'data' => null
        ]);
    }

    public function assignToPig(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'device_id' => 'required|exists:devices,device_id',
            'pig_id' => 'required|exists:pigs,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $device = Device::where('device_id', $request->device_id)->firstOrFail();
        $pig = Pig::findOrFail($request->pig_id);

        // Check if device is already assigned
        $existingAssignment = DB::table('pig_device')
            ->where('device_id', $device->id)
            ->whereNull('removed_at')
            ->first();

        if ($existingAssignment) {
            return response()->json([
                'success' => false,
                'message' => 'Device is already assigned to a pig'
            ], 422);
        }

        // Create new assignment
        DB::table('pig_device')->insert([
            'pig_id' => $pig->id,
            'device_id' => $device->id,
            'assigned_at' => now(),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Device assigned to pig successfully',
            'data' => [
                'device' => $device,
                'pig' => $pig
            ]
        ]);
    }

    public function removeFromPig($deviceId)
    {
        $device = Device::where('device_id', $deviceId)->firstOrFail();
        
        // Update the pivot table to mark the assignment as removed
        DB::table('pig_device')
            ->where('device_id', $device->id)
            ->whereNull('removed_at')
            ->update([
                'removed_at' => now(),
                'updated_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Device removed from pig successfully',
            'data' => $device
        ]);
    }

    public function getDeviceData($deviceId)
    {
        $device = Device::findOrFail($deviceId);
        
        // Check if user has access to this device
        if ($device->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this device'
            ], 403);
        }

        // Here you would typically fetch the device's sensor data
        // For now, we'll return a mock response
        $data = [
            'temperature' => rand(35, 40),
            'heart_rate' => rand(60, 100),
            'activity_level' => rand(0, 100),
            'last_updated' => now()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Device data retrieved successfully',
            'data' => $data
        ]);
    }

    public function updateHealthMonitoring(Request $request, $deviceId)
    {
        $validator = Validator::make($request->all(), [
            'temperature' => 'required|numeric',
            'heart_rate' => 'required|numeric',
            'activity_level' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $device = Device::findOrFail($deviceId);
        
        // Check if user has access to this device
        if ($device->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this device'
            ], 403);
        }

        // Here you would typically update the device's health monitoring data
        // For now, we'll just return a success response
        return response()->json([
            'success' => true,
            'message' => 'Health monitoring data updated successfully',
            'data' => $request->all()
        ]);
    }

    /**
     * Get health records for all devices
     */
    public function getHealthRecords()
    {
        $user = Auth::user();
        
        $healthRecords = DB::table('health_monitoring')
            ->join('devices', 'health_monitoring.device_id', '=', 'devices.id')
            ->join('pigs', 'health_monitoring.pig_id', '=', 'pigs.id')
            ->where('pigs.user_id', $user->id)
            ->select(
                'health_monitoring.id',
                'health_monitoring.pig_id',
                'health_monitoring.device_id',
                'devices.name as device_name',
                'pigs.name as pig_name',
                'health_monitoring.temperature',
                'health_monitoring.heartbeat',
                'health_monitoring.notes',
                'health_monitoring.created_at',
                'health_monitoring.updated_at'
            )
            ->orderBy('health_monitoring.created_at', 'desc')
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'pig_id' => $record->pig_id,
                    'device_id' => $record->device_id,
                    'device_name' => $record->device_name,
                    'pig_name' => $record->pig_name,
                    'temperature' => $record->temperature ?? 0,
                    'heartbeat' => $record->heartbeat ?? 0,
                    'notes' => $record->notes ?? '',
                    'date' => $record->created_at,
                    'created_at' => $record->created_at,
                    'updated_at' => $record->updated_at
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Health records retrieved successfully',
            'data' => $healthRecords
        ]);
    }

    /**
     * Get all device assignments
     */
    public function getAssignments()
    {
        $user = Auth::user();
        
        $assignments = DB::table('pig_device')
            ->join('devices', 'pig_device.device_id', '=', 'devices.id')
            ->join('pigs', 'pig_device.pig_id', '=', 'pigs.id')
            ->where('pigs.user_id', $user->id)
            ->select(
                'pig_device.id as assignment_id',
                'devices.id as device_id',
                'devices.name as device_name',
                'pigs.id as pig_id',
                'pigs.name as pig_name',
                'pig_device.assigned_at',
                'pig_device.removed_at',
                'pig_device.created_at',
                'pig_device.updated_at'
            )
            ->orderBy('pig_device.created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Device assignments retrieved successfully',
            'data' => $assignments
        ]);
    }

    /**
     * Get health history for a specific device
     */
    public function getDeviceHealthHistory($deviceId)
    {
        $device = Device::where('device_id', $deviceId)->firstOrFail();
        
        $healthHistory = DB::table('health_monitoring')
            ->join('pigs', 'health_monitoring.pig_id', '=', 'pigs.id')
            ->where('health_monitoring.device_id', $device->id)
            ->select(
                'pigs.name as pig_name',
                'health_monitoring.temperature',
                'health_monitoring.heartbeat',
                'health_monitoring.notes',
                'health_monitoring.created_at'
            )
            ->orderBy('health_monitoring.created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Device health history retrieved successfully',
            'data' => [
                'device' => $device,
                'health_history' => $healthHistory
            ]
        ]);
    }
} 