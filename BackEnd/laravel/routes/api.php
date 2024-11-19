<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeviceController;

Route::get('/devices', [DeviceController::class, 'index']);
Route::get('/devices/status/{id}', [DeviceController::class, 'showStatus']);
Route::put('/devices/{id}/status', [DeviceController::class, 'updateStatus']);
Route::delete('/devices/{id}', [DeviceController::class, 'destroy']);
