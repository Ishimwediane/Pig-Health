<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthorizationHeaderFix
{
    public function handle(Request $request, Closure $next)
    {
        if (isset($_SERVER['HTTP_AUTHORIZATION']) && !$request->headers->has('Authorization')) {
            $request->headers->set('Authorization', $_SERVER['HTTP_AUTHORIZATION']);
        }

        return $next($request);
    }
}
