<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    public function index(){
        return Device::all();
    }

    public function showStatus($id)
    {
        $device = Device::find($id);
        if (!$device) {
            return response()->json(['error' => 'Device not found'], 404);
        }
        return response()->json([
            'id' => $device->id,
            'status' => $device->status,
        ]);
    }
    public function updateStatus(Request $request, $id){
        $device = Device::find($id);
        if (!$device) {
            return response()->json(['error' => 'Device not found'], 404);
        }
        $validated = $request->validate([
            'status' => 'required|in:on,off',
        ]);
        if ($validated['status'] === 'off') {
            $device->last_activity = now();
        }
        $device->status = $validated['status'];
        $device->save();
        return response()->json($device);
    }
    public function update(Request $request, $id)
    {
        $device = Device::findOrFail($id);
    
        $device->update($request->all());
    
        return response()->json(['message' => 'Device updated successfully', 'device' => $device]);
    }
    public function destroy($id)
    {
        $device = Device::findOrFail($id);

        $device->delete();

        return response()->json(['message' => 'Device deleted successfully']);
    }
    

}

