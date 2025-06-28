<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PigBreed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PigBreedController extends Controller
{
    public function index()
    {
        $breeds = PigBreed::all();
        return response()->json($breeds);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:pig_breeds',
            'description' => 'required|string',
            'image' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $breed = PigBreed::create($request->all());
        return response()->json($breed, 201);
    }

    public function update(Request $request, $id)
    {
        $breed = PigBreed::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:pig_breeds,name,' . $id,
            'description' => 'required|string',
            'image' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $breed->update($request->all());
        return response()->json($breed);
    }

    public function destroy($id)
    {
        $breed = PigBreed::findOrFail($id);
        $breed->delete();
        return response()->json(['message' => 'Breed deleted successfully']);
    }
} 