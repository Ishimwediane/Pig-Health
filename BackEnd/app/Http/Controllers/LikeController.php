<?php
namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Message;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function like($messageId)
    {
        $message = Message::findOrFail($messageId);

        $like = Like::firstOrCreate([
            'message_id' => $message->id,
            'user_id' => auth()->id(),
        ]);

        return response()->json($like);
    }
}
