<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Veterinarian;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:farmer,vet,veterinarian',
            'specialization' => 'required_if:role,vet,veterinarian|string|max:255',
            'license_number' => 'required_if:role,vet,veterinarian|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role
        ]);

        // If user is a vet/veterinarian, create veterinarian profile
        if (in_array($request->role, ['vet', 'veterinarian'])) {
            Veterinarian::create([
                'user_id' => $user->id,
                'specialization' => $request->specialization ?? 'General Practice',
                'license_number' => $request->license_number ?? 'TEMP' . $user->id
            ]);
        }

        $token = Auth::login($user);

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60
            ]
        ], 201);
    }

    /**
     * Login user and return a JWT token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        try {
            if (!$token = auth()->attempt($credentials)) {
                Log::error('Login failed for user: ' . $credentials['email']);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials',
                    'data' => null
                ], 401);
            }

            $refreshToken = auth()->refresh();
            $tokenData = $this->respondWithToken($token, $refreshToken);

            return response()->json([
                'success' => true,
                'message' => 'User logged in successfully',
                'data' => $tokenData
            ]);
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during login',
                'data' => null
            ], 500);
        }
    }

    /**
     * Get the authenticated User profile.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile()
    {
        $user = auth()->user();

        return response()->json([
            'success' => true,
            'message' => 'User profile retrieved successfully',
            'data' => $user
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out',
            'data' => null
        ]);
    }

    /**
     * Refresh a JWT token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        try {
            $newToken = auth()->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Token refreshed successfully',
                'data' => $this->respondWithToken($newToken)
            ]);
        } catch (\Exception $e) {
            Log::error('Token refresh error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Token refresh failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Prepare the token response structure.
     *
     * @param string $token
     * @param string|null $refreshToken
     * @return array
     */
    protected function respondWithToken($token, $refreshToken = null)
    {
        $response = [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ];

        if ($refreshToken) {
            $response['refresh_token'] = $refreshToken;
        }

        return $response;
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'current_password' => 'required_with:password|string',
            'password' => 'sometimes|string|min:8|confirmed',
            'specialization' => 'required_if:role,vet,veterinarian|string|max:255',
            'license_number' => 'required_if:role,vet,veterinarian|string|max:255',
            'photo' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $validator->errors()
            ], 422);
        }

        // Verify current password if changing password
        if ($request->has('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }
        }

        // Update user basic info
        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $photoName = time() . '.' . $photo->getClientOriginalExtension();
            $photo->move(public_path('uploads/profiles'), $photoName);
            $user->photo = 'uploads/profiles/' . $photoName;
        }

        $user->save();

        // Update role-specific information
        if (in_array($user->role, ['vet', 'veterinarian'])) {
            $vet = $user->veterinarian;
            if ($vet) {
                if ($request->has('specialization')) {
                    $vet->specialization = $request->specialization;
                }
                if ($request->has('license_number')) {
                    $vet->license_number = $request->license_number;
                }
                $vet->save();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'user' => $user->load('veterinarian')
            ]
        ]);
    }
}
