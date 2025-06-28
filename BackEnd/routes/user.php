<?php

use App\Http\Controllers\UserController;

// Define your routes here
Route::get('/user/profile', [UserController::class, 'showProfile']);
Route::post('/user/register', [UserController::class, 'register']);
Route::post('/user/login', [UserController::class, 'login']);
