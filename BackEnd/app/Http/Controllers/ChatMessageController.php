<?php

// app/Http/Controllers/ChatMessageController.php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatMessageController extends Controller
{
    public function index($otherUserId)
{
    $authUserId = Auth::id();

    $messages = ChatMessage::where(function ($q) use ($authUserId, $otherUserId) {
        $q->where('sender_id', $authUserId)
          ->where('receiver_id', $otherUserId);
    })
    ->orWhere(function ($q) use ($authUserId, $otherUserId) {
        $q->where('sender_id', $otherUserId)
          ->where('receiver_id', $authUserId);
    })
    ->orderBy('created_at', 'asc')
    ->get();

    return response()->json($messages);
}


    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string'
        ]);

        $message = ChatMessage::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message
        ]);

        return response()->json($message, 201);
    }
}

