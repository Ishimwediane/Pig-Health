<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\PigController;
use App\Http\Controllers\HealthMonitoringController;
use App\Http\Controllers\PigBreedController;
use App\Http\Controllers\VetAssignmentController;
use App\Http\Controllers\VetAssistanceRequestController;
use App\Http\Controllers\VetVisitController;
use App\Http\Controllers\VaccinationRecordController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\VetServiceRequestController;
use App\Http\Controllers\VetChatController;
use App\Http\Controllers\Admin\VeterinarianController;
use App\Http\Controllers\Admin\ChatVetController;
use App\Http\Controllers\VetVisitRecordController;
use App\Http\Controllers\{
    ChatController,
    MessageController,
    CommentController,
    LikeController,
    ReportController
};
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\VetVaccinationController;
use App\Http\Controllers\VetDashboardController;
use App\Http\Controllers\AuthController;

// Public routes (no authentication required)
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
});

// Public community routes
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

// Protected routes (authentication required)
Route::middleware('jwt.auth')->group(function () {
    // User profile routes
    Route::get('/users/profile', [UserController::class, 'profile']);
    Route::put('/users/profile', [AdminUserController::class, 'updateOwnProfile']);

    // Pig routes
    Route::prefix('pigs')->group(function () {
        Route::get('/', [PigController::class, 'index']);
        Route::post('/', [PigController::class, 'store']);
        Route::get('/{id}', [PigController::class, 'show']);
        Route::delete('/{id}', [PigController::class, 'destroy']);
    });

    // Health monitoring routes
    Route::prefix('health')->group(function () {
        Route::post('/', [HealthMonitoringController::class, 'store']);
        Route::get('/pig/{pigId}', [HealthMonitoringController::class, 'byPig']);
    });

    // Pig breeds routes (public for viewing)
    Route::get('/pig-breeds', [PigBreedController::class, 'index']);

    // Veterinary routes
    Route::prefix('vets')->group(function () {
        Route::get('/', [VeterinarianController::class, 'index']); // Get all vets
        Route::get('/available', [VeterinarianController::class, 'getAvailableVets']); // Get available vets
        Route::get('/{id}', [VeterinarianController::class, 'show']); // Get specific vet
        Route::get('/{id}/services', [VeterinarianController::class, 'getServices']); // Get vet's services
    });

    // Vet service request routes
    Route::prefix('vet-service-requests')->group(function () {
        Route::post('/', [VetServiceRequestController::class, 'store']);
        Route::get('/', [VetServiceRequestController::class, 'index']);
        Route::get('/my-requests', [VetServiceRequestController::class, 'myRequests']); // Get user's requests
        Route::get('/pending', [VetServiceRequestController::class, 'pendingRequests']); // Get pending requests
        Route::patch('/{id}/status', [VetServiceRequestController::class, 'updateStatus']);
        Route::get('/{id}', [VetServiceRequestController::class, 'show']);
        Route::post('/{id}/chat', [VetServiceRequestController::class, 'initiateChat']); // Start chat for approved request
        Route::post('/service-requests/{id}/messages', [VetServiceRequestController::class, 'sendMessage']);
        Route::get('/service-requests/{id}/messages', [VetServiceRequestController::class, 'getMessages']);
        Route::post('/service-requests/{id}/files', [VetServiceRequestController::class, 'uploadFile']);
        Route::get('/service-requests/{id}/files', [VetServiceRequestController::class, 'getFiles']);
    
    });

    // Chat routes
    Route::prefix('chat')->group(function () {
        Route::get('/session/{vetServiceRequestId}', [ChatVetController::class, 'getChatSession']);
        Route::post('/send', [ChatVetController::class, 'sendMessage']);
        Route::get('/{otherUserId}', [ChatMessageController::class, 'index']);
        Route::get('/vets/{vetId}', [ChatVetController::class, 'getVetChats']); // Get chats with specific vet
    });

    // Community routes
    Route::prefix('posts')->group(function () {
        Route::post('/', [PostController::class, 'store']);
        Route::post('/like/{postId}', [PostController::class, 'like']);
        Route::post('/comment/{postId}', [PostController::class, 'comment']);
        Route::post('/report/{postId}', [PostController::class, 'report']);
    });

    // Device routes
    Route::prefix('devices')->group(function () {
        // Specific routes first
        Route::get('/health-records', [DeviceController::class, 'getHealthRecords']);
        Route::get('/assignments', [DeviceController::class, 'getAssignments']);
        Route::post('/assign', [DeviceController::class, 'assignToPig']);
        
        // Parameterized routes last
        Route::get('/{deviceId}/health-history', [DeviceController::class, 'getDeviceHealthHistory']);
        Route::post('/{deviceId}/remove', [DeviceController::class, 'removeFromPig']);
        Route::get('/{deviceId}', [DeviceController::class, 'getDeviceData']);
        Route::post('/{deviceId}/health', [DeviceController::class, 'updateHealthMonitoring']);
        
        // Index route last
        Route::get('/', [DeviceController::class, 'index']);
    });
});

// Vet routes (requires vet role)
Route::middleware(['jwt.auth'])->prefix('vet')->group(function () {
    // Create vet profile
    Route::post('/profile', [VetServiceRequestController::class, 'createVetProfile']);

    // Dashboard
    Route::get('/dashboard/stats', [VetDashboardController::class, 'getStats']);
    Route::get('/dashboard/activities', [VetDashboardController::class, 'getActivities']);

    // Service Requests
    Route::get('/service-requests', [VetServiceRequestController::class, 'index']);
    Route::get('/service-requests/vet', [VetServiceRequestController::class, 'getVetRequests']);
    Route::get('/service-requests/accepted', [VetServiceRequestController::class, 'getAcceptedRequests']);
    Route::get('/service-requests/upcoming', [VetServiceRequestController::class, 'getUpcomingVisits']);
    Route::get('/service-requests/history', [VetServiceRequestController::class, 'getVisitHistory']);
    Route::post('/service-requests/{id}/accept', [VetServiceRequestController::class, 'accept']);
    Route::post('/service-requests/{id}/reject', [VetServiceRequestController::class, 'reject']);
    Route::post('/service-requests/{id}/complete', [VetServiceRequestController::class, 'complete']);
    Route::post('/service-requests/{id}/messages', [VetServiceRequestController::class, 'sendMessage']);
    Route::get('/service-requests/{id}/messages', [VetServiceRequestController::class, 'getMessages']);
    Route::post('/service-requests/{id}/files', [VetServiceRequestController::class, 'uploadFile']);
    Route::get('/service-requests/{id}/files', [VetServiceRequestController::class, 'getFiles']);

    // Visit Records
    Route::get('/visits', [VetVisitRecordController::class, 'index']);
    Route::get('/visits/{id}', [VetVisitRecordController::class, 'show']);
    Route::post('/visits', [VetVisitRecordController::class, 'store']);
    Route::put('/visits/{id}', [VetVisitRecordController::class, 'update']);
    Route::delete('/visits/{id}', [VetVisitRecordController::class, 'destroy']);
    Route::get('/visits/farmer/{farmerId}', [VetVisitRecordController::class, 'getFarmerHistory']);

    // Vaccinations
    Route::prefix('vaccinations')->group(function () {
        Route::get('/', [VetVaccinationController::class, 'all']);
        Route::get('/{vaccination}', [VetVaccinationController::class, 'show']);
        Route::put('/{vaccination}', [VetVaccinationController::class, 'update']);
        Route::delete('/{vaccination}', [VetVaccinationController::class, 'destroy']);
    });
});

// Admin routes (requires admin role)
Route::middleware(['jwt.auth', 'admin'])->prefix('admin')->group(function () {
    // Users
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::post('/users', [AdminUserController::class, 'store']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

    // Pig Breeds
    Route::prefix('pig-breeds')->group(function () {
        Route::get('/', [PigBreedController::class, 'index']);
        Route::post('/', [PigBreedController::class, 'store']);
        Route::put('/{id}', [PigBreedController::class, 'update']);
        Route::delete('/{id}', [PigBreedController::class, 'destroy']);
    });

    // Veterinarians
    Route::prefix('veterinarians')->group(function () {
        Route::get('/', [VeterinarianController::class, 'index']);
        Route::post('/', [VeterinarianController::class, 'store']);
        Route::put('/{id}', [VeterinarianController::class, 'update']);
        Route::delete('/{id}', [VeterinarianController::class, 'destroy']);
    });

    // Devices
    Route::prefix('devices')->group(function () {
        Route::get('/', [DeviceController::class, 'index']);
        Route::post('/', [DeviceController::class, 'store']);
        Route::delete('/{id}', [DeviceController::class, 'destroy']);
    });

    // Vet Service Requests
    Route::prefix('vet-service-requests')->group(function () {
        Route::get('/', [VetServiceRequestController::class, 'getAllRequests']);
        Route::patch('/{id}', [VetServiceRequestController::class, 'update']);
        Route::delete('/{id}', [VetServiceRequestController::class, 'destroy']);
    });

    // Vaccinations
    Route::prefix('vaccinations')->group(function () {
        Route::get('/', [VetVaccinationController::class, 'all']);
        Route::post('/', [VetVaccinationController::class, 'store']);
        Route::put('/{id}', [VetVaccinationController::class, 'update']);
        Route::delete('/{id}', [VetVaccinationController::class, 'destroy']);
    });

    // Vet Visit Records
    Route::prefix('vet-visit-records')->group(function () {
        Route::get('/', [VetVisitRecordController::class, 'index']);
        Route::post('/', [VetVisitRecordController::class, 'store']);
        Route::put('/{id}', [VetVisitRecordController::class, 'update']);
        Route::delete('/{id}', [VetVisitRecordController::class, 'destroy']);
    });

    // Community Posts & Reports
    Route::prefix('posts')->group(function () {
        Route::get('/', [PostController::class, 'index']);
        Route::delete('/{id}', [PostController::class, 'destroy']);
    });

    Route::prefix('reports')->group(function () {
        Route::get('/', [ReportController::class, 'index']);
        Route::delete('/{id}', [ReportController::class, 'destroy']);
    });
});

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
    Route::post('/logout', [UserController::class, 'logout'])->middleware('jwt.auth');
    Route::post('/refresh', [UserController::class, 'refresh'])->middleware('jwt.auth');
    Route::get('/profile', [UserController::class, 'profile'])->middleware('jwt.auth');
    Route::put('/profile', [UserController::class, 'updateProfile'])->middleware('jwt.auth');
});

Route::get('/check-server', function () {
    dd($_SERVER);
});
