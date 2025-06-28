<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('welcome');
});
Route::get('/debug-token', function () {
    $headers = request()->headers->all();
    return $headers;
});
