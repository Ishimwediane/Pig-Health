<?php

// app/Http/Controllers/Admin/VeterinarianController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Veterinarian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;


class VeterinarianController extends Controller
{
    public function index()
    {
        return response()->json(Veterinarian::with('user')->get());
    }

public function store(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'license_number' => 'required|string|unique:veterinarians',
            'specialization' => 'nullable|string',
            'photo' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'veterinarian',
        ]);

        $vet = Veterinarian::create([
            'user_id' => $user->id,
            'license_number' => $request->license_number,
            'specialization' => $request->specialization,
            'photo' => $request->photo,
        ]);

        return response()->json([
            'message' => 'Veterinarian created successfully.',
            'veterinarian' => $vet,
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Exception: ' . $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
}



    public function update(Request $request, $id)
    {
        $vet = Veterinarian::findOrFail($id);

        $request->validate([
            'license_number' => 'required|string|unique:veterinarians,license_number,' . $vet->id,
            'specialization' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($vet->photo) {
                Storage::disk('public')->delete($vet->photo);
            }
            $vet->photo = $request->file('photo')->store('vets', 'public');
        }

        $vet->license_number = $request->license_number;
        $vet->specialization = $request->specialization;
        $vet->save();

        return response()->json($vet);
    }

    public function destroy($id)
    {
        $vet = Veterinarian::findOrFail($id);
        if ($vet->photo) {
            Storage::disk('public')->delete($vet->photo);
        }
        $vet->user->delete(); // Also deletes vet
        $vet->delete();

        return response()->json(['message' => 'Veterinarian removed successfully']);
    }
}
