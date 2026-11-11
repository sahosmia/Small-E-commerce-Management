<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Owner\MyShopController;
use App\Http\Controllers\Shops\PublicShopController;
use App\Http\Controllers\Shops\ShopController;
use App\Http\Controllers\Users\UserController;
use Illuminate\Support\Facades\Route;

// Public customer landing page showing active shops
Route::get('/', HomeController::class)->name('home');

// Public customer shop storefront
Route::get('/shop/{slug}', [PublicShopController::class, 'show'])->name('shops.public');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Users management
    Route::resource('users', UserController::class);

    // Admin shop management
    Route::resource('shops', ShopController::class);
    Route::patch('shops/{shop}/status', [ShopController::class, 'changeStatus'])->name('shops.status');
    Route::patch('shops/{shop}/assign-owner', [ShopController::class, 'assignOwner'])->name('shops.assign-owner');

    // Shop Owner "My Shop"
    Route::get('my-shop', [MyShopController::class, 'show'])->name('my-shop.show');
    Route::get('my-shop/edit', [MyShopController::class, 'edit'])->name('my-shop.edit');
    Route::put('my-shop', [MyShopController::class, 'update'])->name('my-shop.update');

});

require __DIR__.'/inventory.php';

require __DIR__.'/auth.php';
