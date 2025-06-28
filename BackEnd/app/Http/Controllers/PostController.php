<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index() {
        $posts = Post::with(['user:id,name', 'comments.user:id,name', 'reports.user:id,name'])
                    ->orderBy('created_at', 'desc')->get();
        return response()->json($posts);
    }

    public function store(Request $request) {
        $request->validate(['content' => 'required']);
        $post = Post::create([
            'user_id' => Auth::id(),
            'content' => $request->content,
            'likes' => [],
        ]);
        return response()->json($post, 201);
    }

    public function like($postId) {
        $post = Post::findOrFail($postId);
        $likes = $post->likes ?? [];
        $userId = Auth::id();

        if (in_array($userId, $likes)) {
            return response()->json(['message' => 'Already liked'], 400);
        }

        $likes[] = $userId;
        $post->likes = $likes;
        $post->save();

        return response()->json($post);
    }

    public function comment(Request $request, $postId) {
        $request->validate(['comment' => 'required']);
        $comment = Comment::create([
            'post_id' => $postId,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
        ]);

        return response()->json($comment);
    }

    public function report(Request $request, $postId) {
        $request->validate([
            'abuse_type' => 'required',
            'comment' => 'required'
        ]);

        $report = Report::create([
            'post_id' => $postId,
            'user_id' => Auth::id(),
            'abuse_type' => $request->abuse_type,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Reported successfully'], 200);
    }

    public function show($id) {
        $post = Post::with(['user', 'comments.user', 'reports.user'])->findOrFail($id);
        return response()->json($post);
    }
}

