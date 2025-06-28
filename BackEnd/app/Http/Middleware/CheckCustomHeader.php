<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckCustomHeader
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Example: Validate presence and value of a custom header
        $customHeader = $request->header('X-Custom-Header');

        if (!$customHeader || $customHeader !== 'expected-value') {
            return response()->json([
                'message' => 'Invalid or missing X-Custom-Header.',
            ], 400);
        }

        return $next($request);
    }
}
