<?php
namespace App\Http\Controllers;

use App\Models\Pig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PigController extends Controller
{
    public function index()
    {
        $user = auth()->user(); // Get the authenticated user
        $pigs = Pig::where('user_id', $user->id)->get();
        return response()->json(['data' => $pigs]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'breed' => 'required|string|max:255',
            'age' => 'required|numeric',
            'weight' => 'required|numeric',
            'gender' => 'required|in:male,female',
            'health_status' => 'required|in:healthy,sick,under_observation',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        $pig = Pig::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'breed' => $request->breed,
            'age' => $request->age,
            'weight' => $request->weight,
            'gender' => $request->gender,
            'health_status' => $request->health_status,
            'notes' => $request->notes
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pig created successfully',
            'data' => $pig
        ], 201);
    }

    public function show($id)
    {
        $user = auth()->user();
        $pig = Pig::where('user_id', $user->id)->findOrFail($id);
        return response()->json(['data' => $pig]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'breed' => 'sometimes|required|string|max:255',
            'age' => 'sometimes|required|numeric',
            'weight' => 'sometimes|required|numeric',
            'gender' => 'sometimes|required|in:male,female',
            'health_status' => 'sometimes|required|in:healthy,sick,under_observation',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        $pig = Pig::where('user_id', $user->id)->findOrFail($id);

        // Update only the fields that are provided in the request
        $pig->update($request->only([
            'name',
            'breed',
            'age',
            'weight',
            'gender',
            'health_status',
            'notes'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Pig updated successfully',
            'data' => $pig
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $pig = Pig::where('user_id', $user->id)->findOrFail($id);
        $pig->delete();
        return response()->json(['message' => 'Pig deleted successfully']);
    }
}
