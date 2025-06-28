<?php

namespace App\Http\Controllers;

use App\Models\VetServiceRequest;
use App\Models\VetChatMessage;
use App\Models\VetChatFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class VetChatController extends Controller
{
    // Get chat messages for a service request
    public function getMessages($requestId)
    {
        $messages = VetChatMessage::with('sender')
            ->where('vet_service_request_id', $requestId)
            ->orderBy('created_at', 'asc')
            ->get();
        return response()->json(['messages' => $messages]);
    }

    // Send a new message
    public function sendMessage(Request $request, $requestId)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $serviceRequest = VetServiceRequest::findOrFail($requestId);
        
        // Check if user is authorized (either farmer or vet)
        if ($serviceRequest->farmer_id !== Auth::id() && 
            $serviceRequest->vet->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = VetChatMessage::create([
            'vet_service_request_id' => $requestId,
            'sender_id' => Auth::id(),
            'message' => $request->message
        ]);

        return response()->json(['message' => $message], 201);
    }

    // Upload a file
    public function uploadFile(Request $request, $requestId)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240' // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $serviceRequest = VetServiceRequest::findOrFail($requestId);
        
        // Check if user is authorized
        if ($serviceRequest->farmer_id !== Auth::id() && 
            $serviceRequest->vet->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $file = $request->file('file');
        $path = $file->store('vet-chat-files');

        $chatFile = VetChatFile::create([
            'vet_service_request_id' => $requestId,
            'uploaded_by' => Auth::id(),
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize()
        ]);

        return response()->json(['file' => $chatFile], 201);
    }

    // Download a file
    public function downloadFile($fileId)
    {
        $file = VetChatFile::findOrFail($fileId);
        $serviceRequest = $file->serviceRequest;

        // Check if user is authorized
        if ($serviceRequest->farmer_id !== Auth::id() && 
            $serviceRequest->vet->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return Storage::download($file->file_path, $file->file_name);
    }

    // Mark messages as read
    public function markAsRead($requestId)
    {
        VetChatMessage::where('vet_service_request_id', $requestId)
            ->where('sender_id', '!=', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Messages marked as read']);
    }
} 