<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Valider les données entrantes
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Vérifier si l'utilisateur existe
        $user = User::where('email', $validated['email'])
                    ->where('password', $validated['password']) // Comparer les mots de passe en clair
                    ->first();

        if ($user) {
            // Génère une réponse si la connexion réussit
            return response()->json([
                'token' => 'example_token', // Remplacez par un vrai token si nécessaire
                'role' => $user->role,
            ]);
        } else {
            // Retourne une réponse si les informations sont incorrectes
            return response()->json(['message' => 'Login failed'], 401);
        }
    }
}
