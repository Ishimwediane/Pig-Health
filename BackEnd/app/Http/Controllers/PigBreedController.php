<?php
namespace App\Http\Controllers;

use App\Models\PigBreed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PigBreedController extends Controller
{
    public function index()
    {
        $breeds = PigBreed::all();
        return response()->json([
            'success' => true,
            'message' => 'Pig breeds retrieved successfully',
            'data' => $breeds
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:pig_breeds',
            'description' => 'required|string',
         
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $breed = PigBreed::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Pig breed created successfully',
            'data' => $breed
        ], 201);
    }

    public function show($id)
    {
        $breed = PigBreed::findOrFail($id);
        return response()->json([
            'success' => true,
            'message' => 'Pig breed retrieved successfully',
            'data' => $breed
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|unique:pig_breeds,name,' . $id,
            'description' => 'string',
            'average_weight' => 'numeric',
            'average_lifespan' => 'integer',
            'characteristics' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $breed = PigBreed::findOrFail($id);
        $breed->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Pig breed updated successfully',
            'data' => $breed
        ]);
    }

    public function destroy($id)
    {
        $breed = PigBreed::findOrFail($id);
        $breed->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pig breed deleted successfully',
            'data' => null
        ]);
    }
}
