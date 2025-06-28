<?php
namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Message;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function postComment(Request $request, $messageId)
    {
        $request->validate(['content' => 'required|string']);
        $message = Message::findOrFail($messageId);

        $comment = $message->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        return response()->json($comment, 201);
    }
}

