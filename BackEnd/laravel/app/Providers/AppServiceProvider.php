<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route; // Add this line

class AppServiceProvider extends ServiceProvider
{
    protected $namespace = 'App\\Http\\Controllers';

    public function boot()
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }
}
