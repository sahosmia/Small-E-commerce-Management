<?php

use App\Http\Controllers\AppearanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Shops\ShopController;
use App\Http\Controllers\ThemeColorController;
use App\Models\Shop;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Owner\MyShopController;
use App\Http\Controllers\Shops\PublicShopController;
use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\GlobalSearchController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Customer\ProductController as CustomerProductController;
use App\Http\Controllers\Owner\CatalogController as OwnerCatalogController;
use App\Http\Controllers\Owner\ShopProductController as OwnerShopProductController;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureUserIsShopOwner;
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
Route::get('/shop/{slug}', [PublicShopController::class, 'show'])->name('shops.public');


Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');


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

// Public Customer Shop Storefront
Route::get('shops/{shop:slug}/products', [CustomerProductController::class, 'index'])->name('customer.shops.products.index');
Route::get('shops/{shop:slug}/products/{product:slug}', [CustomerProductController::class, 'show'])->name('customer.shops.products.show');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    // Admin Global Product Management
    Route::middleware([EnsureUserIsAdmin::class])->prefix('admin')->name('admin.')->group(function () {
        Route::patch('products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus'])->name('products.toggle-status');
        Route::resource('products', AdminProductController::class);
    });

    // Owner Shared Catalog & Shop Products
    Route::middleware([EnsureUserIsShopOwner::class])->prefix('owner')->name('owner.')->group(function () {
        // Shared Catalog
        Route::get('catalog', [OwnerCatalogController::class, 'index'])->name('catalog.index');
        Route::get('catalog/{product}', [OwnerCatalogController::class, 'show'])->name('catalog.show');
        Route::post('catalog/{product}/add', [OwnerCatalogController::class, 'store'])->name('catalog.add');

        // My Shop Products
        Route::patch('products/{shop_product}/toggle-status', [OwnerShopProductController::class, 'toggleStatus'])->name('products.toggle-status');
        Route::resource('products', OwnerShopProductController::class)->parameters(['products' => 'shop_product'])->except(['show']);
    });
});

Route::middleware('auth')->get('global-search', GlobalSearchController::class)->name('global-search');



require __DIR__.'/auth.php';
