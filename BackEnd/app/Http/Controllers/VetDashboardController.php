<?php

namespace App\Http\Controllers;

use App\Models\VetServiceRequest;
use App\Models\Veterinarian;
use App\Models\VetVisitRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class VetDashboardController extends Controller
{
    public function getStats()
    {
        $user = Auth::user();
        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        $currentMonth = now()->month;
        $currentYear = now()->year;

        // Get total completed requests for current month
        $completedRequests = VetServiceRequest::where('vet_id', $vet->id)
            ->where('status', 'completed')
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        // Get total pending requests
        $pendingRequests = VetServiceRequest::where('vet_id', $vet->id)
            ->where('status', 'pending')
            ->count();

        // Get total accepted requests
        $acceptedRequests = VetServiceRequest::where('vet_id', $vet->id)
            ->where('status', 'accepted')
            ->count();

        return response()->json([
            'success' => true,
            'message' => 'Stats retrieved successfully',
            'data' => [
                'completed_requests' => $completedRequests,
                'pending_requests' => $pendingRequests,
                'accepted_requests' => $acceptedRequests
            ]
        ]);
    }

    public function getActivities()
    {
        $user = Auth::user();
        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        // Get recent activities
        $activities = VetServiceRequest::where('vet_id', $vet->id)
            ->with(['pig', 'user'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'type' => 'service_request',
                    'status' => $request->status,
                    'pig_name' => $request->pig->name,
                    'farmer_name' => $request->user->name,
                    'scheduled_time' => $request->scheduled_time,
                    'created_at' => $request->created_at
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Recent activities retrieved successfully',
            'data' => $activities
        ]);
    }
} 