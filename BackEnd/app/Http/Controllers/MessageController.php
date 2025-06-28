<?php
namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function postMessage(Request $request, $chatId)
    {
        $request->validate(['content' => 'required|string']);
        $chat = Chat::findOrFail($chatId);

        $message = $chat->messages()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        return response()->json($message, 201);
    }

    // New method to get all messages belonging to community chats
    public function getAllCommunityMessages()
    {
        try {
            $messages = Message::with(['user', 'comments.user', 'likes'])
                ->whereHas('chat', function($query) {
                    $query->where('type', 'community');
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($messages);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}


