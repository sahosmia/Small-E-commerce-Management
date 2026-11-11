<?php

use App\Http\Controllers\AppearanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GlobalSearchController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Owner\MyShopController;
use App\Http\Controllers\Products\BrandController;
use App\Http\Controllers\Products\CategoryController;
use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Products\ProductExportController;
use App\Http\Controllers\Products\ProductSearchController;
use App\Http\Controllers\Products\StockAdjustmentController;
use App\Http\Controllers\Products\UnitController;
use App\Http\Controllers\Shops\PublicShopController;
use App\Http\Controllers\Shops\ShopController;
use App\Http\Controllers\ThemeColorController;
use App\Http\Controllers\Users\UserController;
use Illuminate\Support\Facades\Route;

// Public customer landing page showing active shops
Route::get('/', HomeController::class)->name('home');

// Public customer shop storefront
Route::get('/shop/{slug}', [PublicShopController::class, 'show'])->name('shops.public');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::patch('locale', [LocaleController::class, 'update'])->name('locale.update');
    Route::patch('theme-color', [ThemeColorController::class, 'update'])->name('theme-color.update');
    Route::patch('appearance', [AppearanceController::class, 'update'])->name('appearance.update');

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

    // Products & Inventory
    Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('units', UnitController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('brands', BrandController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('products/export', ProductExportController::class)->name('products.export');
    Route::get('products/search', ProductSearchController::class)->name('products.search');
    Route::resource('products', ProductController::class);
    Route::get('products/{product}/in-stock-serials', [StockAdjustmentController::class, 'serials'])->name('products.in-stock-serials');
    Route::post('products/{product}/stock-adjustments', [StockAdjustmentController::class, 'store'])->name('stock-adjustments.store');
    Route::post('products/bulk-delete', [ProductController::class, 'bulkDestroy'])->name('products.bulk-delete');

    // Global Search
    Route::get('global-search', GlobalSearchController::class)->name('global-search');
});

require __DIR__.'/auth.php';
