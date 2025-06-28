<?php

namespace App\Http\Controllers;

use App\Models\VetServiceRequest;
use App\Models\Veterinarian;
use App\Models\Pig;
use App\Models\VetChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class VetServiceRequestController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vet_id' => 'required|exists:veterinarians,id',
            'pig_id' => 'required|exists:pigs,id',
            'issue' => 'nullable|string',
            'scheduled_time' => 'required|date|after:now',
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

        $request = VetServiceRequest::create([
            'pig_id' => $request->pig_id,
            'farmer_id' => Auth::id(),
            'description'=>$request->description,
            'vet_id' => $request->vet_id, 
            'purpose' => $request->purpose,
            'urgency_level' => $request->urgency_level,
            'scheduled_time' => $request->scheduled_time,
            'notes' => $request->notes,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Vet service request created successfully',
            'data' => $request
        ], 201);
    }

    public function index()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access - No user found'
                ], 401);
            }

            // Debug user information
            \Log::info('User attempting to access vet service requests:', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'user_role' => $user->role
            ]);

            $requests = [];

            if (in_array($user->role, ['vet', 'veterinarian'])) {
                $vet = Veterinarian::where('user_id', $user->id)->first();
                
                if (!$vet) {
                    \Log::error('Vet profile not found for user:', [
                        'user_id' => $user->id,
                        'user_email' => $user->email
                    ]);

                    // Create a default vet profile if it doesn't exist
                    $vet = Veterinarian::create([
                        'user_id' => $user->id,
                        'specialization' => 'General Practice',
                        'license_number' => 'TEMP' . $user->id,
                        'years_of_experience' => 0
                    ]);

                    \Log::info('Created default vet profile:', [
                        'vet_id' => $vet->id,
                        'user_id' => $user->id
                    ]);
                }

                $requests = VetServiceRequest::where('vet_id', $vet->id)
                    ->with(['pig', 'farmer'])
                    ->orderBy('created_at', 'desc')
                    ->get();
            } else {
                $requests = VetServiceRequest::where('farmer_id', $user->id)
                    ->with(['pig', 'vet.user'])
                    ->orderBy('created_at', 'desc')
                    ->get();
            }

            return response()->json([
                'success' => true,
                'message' => 'Vet service requests retrieved successfully',
                'data' => $requests
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in VetServiceRequestController@index:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error retrieving service requests',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $request = VetServiceRequest::with(['pig', 'user', 'vet.user'])
            ->findOrFail($id);

        // Check if user has access to this request
        if ($request->user_id !== Auth::id() && 
            ($request->vet_id !== Auth::user()->veterinarian?->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this request'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Vet service request retrieved successfully',
            'data' => $request
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,accepted,rejected,completed',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $vetRequest = VetServiceRequest::findOrFail($id);
        
        // Only vet can update status
        if (!in_array(Auth::user()->role, ['vet', 'veterinarian'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only veterinarians can update request status'
            ], 403);
        }

        $vetRequest->status = $request->status;
        if ($request->has('notes')) {
            $vetRequest->notes = $request->notes;
        }
        $vetRequest->save();

        return response()->json([
            'success' => true,
            'message' => 'Request status updated successfully',
            'data' => $vetRequest
        ]);
    }

    public function getAcceptedRequests()
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['vet', 'veterinarian'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only veterinarians can access this endpoint'
            ], 403);
        }

        $vet = Veterinarian::where('user_id', $user->id)->first();
        
        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        $acceptedRequests = VetServiceRequest::where('vet_id', $vet->id)
            ->where('status', 'accepted')
            ->with(['pig', 'farmer'])
            ->orderBy('scheduled_time', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Accepted requests retrieved successfully',
            'data' => $acceptedRequests
        ]);
    }

    public function getVetRequests()
    {
        $user = Auth::user();
        
        // Check if user has either vet or veterinarian role
        if (!in_array($user->role, ['vet', 'veterinarian'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only veterinarians can access this endpoint'
            ], 403);
        }

        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        $requests = VetServiceRequest::where('vet_id', $vet->id)
            ->with(['pig', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Vet service requests retrieved successfully',
            'data' => $requests
        ]);
    }

    public function accept($id)
    {
        $request = VetServiceRequest::findOrFail($id);
        $user = Auth::user();
        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        if ($request->vet_id !== $vet->id) {
            return response()->json([
                'success' => false,
                'message' => 'This request is not assigned to you'
            ], 403);
        }

        $request->status = 'accepted';
        $request->save();

        return response()->json([
            'success' => true,
            'message' => 'Service request accepted successfully',
            'data' => $request
        ]);
    }

    public function reject($id)
    {
        $request = VetServiceRequest::findOrFail($id);
        $user = Auth::user();
        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        if ($request->vet_id !== $vet->id) {
            return response()->json([
                'success' => false,
                'message' => 'This request is not assigned to you'
            ], 403);
        }

        $request->status = 'rejected';
        $request->save();

        return response()->json([
            'success' => true,
            'message' => 'Service request rejected successfully',
            'data' => $request
        ]);
    }

    public function complete($id)
    {
        $request = VetServiceRequest::findOrFail($id);
        $user = Auth::user();
        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        if ($request->vet_id !== $vet->id) {
            return response()->json([
                'success' => false,
                'message' => 'This request is not assigned to you'
            ], 403);
        }

        $request->status = 'completed';
        $request->save();

        return response()->json([
            'success' => true,
            'message' => 'Service request completed successfully',
            'data' => $request
        ]);
    }

    public function getUpcomingVisits()
    {
        $user = Auth::user();
        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        $visits = VetServiceRequest::where('vet_id', $vet->id)
            ->where('status', 'accepted')
            ->where('scheduled_time', '>=', now())
            ->with(['pig', 'user'])
            ->orderBy('scheduled_time', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Upcoming visits retrieved successfully',
            'data' => $visits
        ]);
    }

    public function getVisitHistory()
    {
        $user = Auth::user();
        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        $visits = VetServiceRequest::where('vet_id', $vet->id)
            ->where('status', 'completed')
            ->with(['pig', 'user'])
            ->orderBy('scheduled_time', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Visit history retrieved successfully',
            'data' => $visits
        ]);
    }

    public function sendMessage(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $serviceRequest = VetServiceRequest::findOrFail($id);
        $user = Auth::user();

        // Check if user is either the vet or the farmer
        $isVet = in_array($user->role, ['vet', 'veterinarian']);
        $isFarmer = $serviceRequest->farmer_id === $user->id;

        if (!$isVet && !$isFarmer) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to send messages for this request'
            ], 403);
        }

        // Create and save message record
        $message = VetChatMessage::create([
            'vet_service_request_id' => $id,
            'sender_id' => $user->id,
            'message' => $request->message,
            'is_read' => false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $message
        ]);
    }

    public function getMessages($id)
    {
        $serviceRequest = VetServiceRequest::findOrFail($id);
        $user = Auth::user();

        // Check if user is either the vet or the farmer
        $isVet = in_array($user->role, ['vet', 'veterinarian']);
        $isFarmer = $serviceRequest->farmer_id === $user->id;

        if (!$isVet && !$isFarmer) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view messages for this request'
            ], 403);
        }

        // Fetch messages from the database
        $messages = VetChatMessage::with('sender')
            ->where('vet_service_request_id', $id)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) use ($user) {
                return [
                    'id' => $message->id,
                    'message' => $message->message,
                    'is_vet' => $message->sender_id === $user->id,
                    'sender_name' => $message->sender->name,
                    'created_at' => $message->created_at,
                    'is_read' => $message->is_read
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Messages retrieved successfully',
            'data' => $messages
        ]);
    }

    public function markMessagesAsRead($id)
    {
        $serviceRequest = VetServiceRequest::findOrFail($id);
        $user = Auth::user();

        // Check if user is either the vet or the farmer
        $isVet = in_array($user->role, ['vet', 'veterinarian']);
        $isFarmer = $serviceRequest->farmer_id === $user->id;

        if (!$isVet && !$isFarmer) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to mark messages as read'
            ], 403);
        }

        // Update messages as read in the database
        VetChatMessage::where('vet_service_request_id', $id)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Messages marked as read successfully'
        ]);
    }

    public function uploadFile(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240' // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $serviceRequest = VetServiceRequest::findOrFail($id);
        $user = Auth::user();

        // Check if user is either the vet or the farmer
        $isVet = in_array($user->role, ['vet', 'veterinarian']);
        $isFarmer = $serviceRequest->farmer_id === $user->id;

        if (!$isVet && !$isFarmer) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to upload files for this request'
            ], 403);
        }

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        
        // Store file in storage/app/public/chat-files
        $file->storeAs('public/chat-files', $fileName);

        // Create file record
        $fileRecord = [
            'id' => uniqid(),
            'service_request_id' => $id,
            'file_name' => $fileName,
            'original_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'file_type' => $file->getMimeType(),
            'uploaded_by' => $isVet ? 'vet' : 'farmer',
            'uploaded_by_id' => $user->id,
            'created_at' => now()->toISOString()
        ];

        return response()->json([
            'success' => true,
            'message' => 'File uploaded successfully',
            'data' => $fileRecord
        ]);
    }

    public function getFiles($id)
    {
        $serviceRequest = VetServiceRequest::findOrFail($id);
        $user = Auth::user();
        $vet = Veterinarian::where('user_id', $user->id)->first();

        if (!$vet) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile not found'
            ], 404);
        }

        if ($serviceRequest->vet_id !== $vet->id) {
            return response()->json([
                'success' => false,
                'message' => 'This request is not assigned to you'
            ], 403);
        }

        // Here you would typically fetch files from storage
        // For now, we'll return a mock response
        return response()->json([
            'success' => true,
            'message' => 'Files retrieved successfully',
            'data' => [
                'service_request_id' => $id,
                'files' => []
            ]
        ]);
    }

    public function createVetProfile(Request $request)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['vet', 'veterinarian'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only users with vet role can create vet profiles'
            ], 403);
        }

        // Check if vet profile already exists
        if ($user->veterinarian) {
            return response()->json([
                'success' => false,
                'message' => 'Vet profile already exists'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'specialization' => 'required|string|max:255',
            'license_number' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $vet = Veterinarian::create([
            'user_id' => $user->id,
            'specialization' => $request->specialization,
            'license_number' => $request->license_number
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Vet profile created successfully',
            'data' => $vet
        ], 201);
    }

    public function getAllRequests()
    {
        try {
            $requests = VetServiceRequest::with(['pig', 'farmer', 'vet.user'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'All vet service requests retrieved successfully',
                'data' => $requests
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in VetServiceRequestController@getAllRequests:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error retrieving service requests',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 