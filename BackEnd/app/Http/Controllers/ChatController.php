<?php
namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'type' => 'required|in:private,community',
        ]);

        $chat = Chat::create([
            'type' => $request->type,
            'creator_id' => auth()->id(),
        ]);

        return response()->json($chat, 201);
    }

public function getAllCommunityMessages()
{
    // Fetch all messages that belong to chats of type 'community'
    $messages = Message::with(['user', 'comments.user', 'likes'])
        ->whereHas('chat', function($query) {
            $query->where('type', 'community');
        })
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($messages);
}

public function store(Request $request)
{
    $request->validate([
        'receiver_id' => 'required|exists:users,id',
        'message' => 'nullable|string',
        'file' => 'nullable|file|max:10240', // max 10MB
    ]);

    $data = [
        'sender_id' => Auth::id(),
        'receiver_id' => $request->receiver_id,
        'message' => $request->message,
    ];

    // Handle file upload
    if ($request->hasFile('file')) {
        $file = $request->file('file');
        $path = $file->store('chat_files', 'public'); // stored in /storage/app/public/chat_files
        $data['file_url'] = asset('storage/' . $path);
    }

    $message = ChatMessage::create($data);

    return response()->json($message, 201);
}

}
