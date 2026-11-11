<?php

use App\Http\Controllers\AppearanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Owner\MyShopController;
use App\Http\Controllers\Shops\PublicShopController;
use App\Http\Controllers\Shops\ShopController;
use App\Http\Controllers\ThemeColorController;
use App\Models\Shop;
use Illuminate\Support\Facades\Route;

// Public customer landing page showing active shops
Route::get('/', function () {
    $shops = Shop::query()
        ->with('owner:id,name,email')
        ->where('status', 'active')
        ->latest('id')
        ->get()
        ->map(fn (Shop $shop) => [
            'id' => $shop->id,
            'name' => $shop->name,
            'slug' => $shop->slug,
            'logo' => $shop->logoUrl(),
            'status' => $shop->status,
            'owner' => $shop->owner ? [
                'id' => $shop->owner->id,
                'name' => $shop->owner->name,
                'email' => $shop->owner->email,
            ] : null,
            'created_at' => $shop->created_at?->format('Y-m-d H:i:s'),
            'created_date' => $shop->created_at?->format('d M Y'),
        ]);

    return Inertia\Inertia::render('home', [
        'shops' => $shops,
    ]);
})->name('home');

// Public shop detail page
Route::get('/shop/{slug}', [PublicShopController::class, 'show'])->name('shops.public');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::patch('locale', [LocaleController::class, 'update'])->name('locale.update');
    Route::patch('theme-color', [ThemeColorController::class, 'update'])->name('theme-color.update');
    Route::patch('appearance', [AppearanceController::class, 'update'])->name('appearance.update');

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

require __DIR__.'/global-search.php';
require __DIR__.'/auth.php';
