<?php

use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Customer\ProductController as CustomerProductController;
use App\Http\Controllers\Owner\CatalogController as OwnerCatalogController;
use App\Http\Controllers\Owner\ShopProductController as OwnerShopProductController;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureUserIsShopOwner;
use Illuminate\Support\Facades\Route;

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
