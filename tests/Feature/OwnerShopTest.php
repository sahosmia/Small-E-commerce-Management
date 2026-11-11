<?php

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;

test('shop owner can view their own shop page', function () {
    $owner = User::factory()->shopOwner()->create();
    $shop = Shop::create([
        'name' => 'Apex Electronics',
        'slug' => 'apex-electronics',
        'owner_id' => $owner->id,
        'status' => 'active',
        'email' => 'contact@apex.test',
        'phone' => '+123456789',
    ]);

    $response = $this->actingAs($owner)->get('/my-shop');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('owner/my-shop/show')
        ->where('shop.name', 'Apex Electronics')
        ->where('shop.email', 'contact@apex.test')
    );
});

test('shop owner without an assigned shop is presented with pending assignment message', function () {
    $owner = User::factory()->shopOwner()->create();

    $response = $this->actingAs($owner)->get('/my-shop');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('owner/my-shop/show')
        ->where('shop', null)
    );
});

test('shop owner can edit their own shop details', function () {
    $owner = User::factory()->shopOwner()->create();
    $shop = Shop::create([
        'name' => 'Original Name',
        'slug' => 'original-name',
        'owner_id' => $owner->id,
        'status' => 'active',
        'city' => 'Dhaka',
    ]);

    $response = $this->actingAs($owner)->put('/my-shop', [
        'name' => 'Updated Name',
        'description' => 'Updated shop description.',
        'email' => 'updated@store.test',
        'phone' => '+987654321',
        'address' => '456 Commercial Area',
        'city' => 'Chittagong',
        'country' => 'Bangladesh',
    ]);

    $response->assertRedirect('/my-shop');

    $shop->refresh();
    expect($shop->name)->toBe('Updated Name');
    expect($shop->city)->toBe('Chittagong');
    // Slug & Status must remain unchanged by owner update
    expect($shop->slug)->toBe('original-name');
    expect($shop->status)->toBe('active');
    expect($shop->owner_id)->toBe($owner->id);
});

test('public user can view an active shop page by slug with assigned products', function () {
    $owner = User::factory()->shopOwner()->create();
    $shop = Shop::create([
        'name' => 'Public Gadget Store',
        'slug' => 'public-gadget-store',
        'owner_id' => $owner->id,
        'status' => 'active',
        'description' => 'Best gadgets in town',
    ]);

    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

    $activeProduct = Product::create([
        'created_by' => $admin->id,
        'name' => 'Active Product',
        'slug' => 'active-product',
        'sku' => 'ACT-001',
        'base_price' => 1000.00,
        'is_active' => true,
    ]);

    $inactiveProduct = Product::create([
        'created_by' => $admin->id,
        'name' => 'Inactive Global Product',
        'slug' => 'inactive-global-product',
        'sku' => 'INACT-001',
        'base_price' => 2000.00,
        'is_active' => false,
    ]);

    ShopProduct::create([
        'shop_id' => $shop->id,
        'product_id' => $activeProduct->id,
        'price' => 1200.00,
        'status' => true,
    ]);

    ShopProduct::create([
        'shop_id' => $shop->id,
        'product_id' => $inactiveProduct->id,
        'price' => 2200.00,
        'status' => true,
    ]);

    $response = $this->get('/shop/public-gadget-store');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('shops/public')
        ->where('shop.name', 'Public Gadget Store')
        ->where('shop.slug', 'public-gadget-store')
        ->has('shop.products', 1)
        ->where('shop.products.0.name', 'Active Product')
        ->where('shop.products.0.price', 1200)
    );
});

test('public user receives 404 when viewing an inactive or suspended shop page', function () {
    $owner = User::factory()->shopOwner()->create();
    Shop::create([
        'name' => 'Suspended Store',
        'slug' => 'suspended-store',
        'owner_id' => $owner->id,
        'status' => 'suspended',
    ]);

    $response = $this->get('/shop/suspended-store');

    $response->assertNotFound();
});
