<?php

use App\Models\Shop;
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

test('public user can view an active shop page by slug', function () {
    $owner = User::factory()->shopOwner()->create();
    $shop = Shop::create([
        'name' => 'Public Gadget Store',
        'slug' => 'public-gadget-store',
        'owner_id' => $owner->id,
        'status' => 'active',
        'description' => 'Best gadgets in town',
    ]);

    $response = $this->get('/shop/public-gadget-store');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('shops/public')
        ->where('shop.name', 'Public Gadget Store')
        ->where('shop.slug', 'public-gadget-store')
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
