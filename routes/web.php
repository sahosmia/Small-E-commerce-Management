<?php

use App\Http\Controllers\AppearanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ThemeColorController;
use Illuminate\Support\Facades\Route;

// No public landing page — logged in goes straight to the dashboard, logged out
// straight to login. `guest`/`auth` middleware on those routes already redirect
// back here from the wrong side too, so this is the only place that decides.
Route::get('/', fn () => redirect()->route(auth()->check() ? 'dashboard' : 'login'))->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::patch('locale', [LocaleController::class, 'update'])->name('locale.update');
    Route::patch('theme-color', [ThemeColorController::class, 'update'])->name('theme-color.update');
    Route::patch('appearance', [AppearanceController::class, 'update'])->name('appearance.update');
});

require __DIR__.'/inventory.php';

require __DIR__.'/global-search.php';
require __DIR__.'/roles.php';
require __DIR__.'/auth.php';
