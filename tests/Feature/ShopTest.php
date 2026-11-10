<?php

use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('a guest can view active shops on the home page', function () {
    $owner = User::factory()->create(['name' => 'John Merchant']);

    $activeShop = Shop::create([
        'name' => 'Active Gadget Store',
        'slug' => 'active-gadget-store',
        'user_id' => $owner->id,
        'status' => 'active',
    ]);

    $inactiveShop = Shop::create([
        'name' => 'Inactive Store',
        'slug' => 'inactive-store',
        'user_id' => $owner->id,
        'status' => 'inactive',
    ]);

    $response = $this->get('/');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('home')
        ->has('shops', 1)
        ->where('shops.0.name', 'Active Gadget Store')
        ->where('shops.0.slug', 'active-gadget-store')
        ->where('shops.0.status', 'active')
        ->where('shops.0.owner.name', 'John Merchant')
    );
});

test('authenticated user can view shops index page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/shops');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('shops/index'));
});

test('authenticated user can view create shop page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/shops/create');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('shops/create'));
});

test('authenticated user can create a shop with logo, name, slug, owner, and status', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $owner = User::factory()->create();

    $file = UploadedFile::fake()->image('shop_logo.png');

    $response = $this->actingAs($user)->post('/shops', [
        'name' => 'Super Tech Shop',
        'slug' => 'super-tech-shop',
        'user_id' => $owner->id,
        'status' => 'active',
        'logo' => $file,
    ]);

    $response->assertRedirect('/shops');

    $shop = Shop::where('slug', 'super-tech-shop')->first();
    expect($shop)->not->toBeNull();
    expect($shop->name)->toBe('Super Tech Shop');
    expect($shop->user_id)->toBe($owner->id);
    expect($shop->status)->toBe('active');
    expect($shop->logo)->not->toBeNull();

    Storage::disk('public')->assertExists($shop->logo);
});

test('shop creation requires unique slug and valid fields', function () {
    $user = User::factory()->create();

    Shop::create([
        'name' => 'Existing Shop',
        'slug' => 'existing-shop',
        'user_id' => $user->id,
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->post('/shops', [
        'name' => '',
        'slug' => 'existing-shop',
        'user_id' => 999999,
        'status' => 'invalid-status',
    ]);

    $response->assertSessionHasErrors(['name', 'slug', 'user_id', 'status']);
});

test('authenticated user can update a shop', function () {
    $user = User::factory()->create();
    $shop = Shop::create([
        'name' => 'Old Name',
        'slug' => 'old-name',
        'user_id' => $user->id,
        'status' => 'inactive',
    ]);

    $response = $this->actingAs($user)->put("/shops/{$shop->id}", [
        'name' => 'New Name',
        'slug' => 'new-name',
        'user_id' => $user->id,
        'status' => 'active',
    ]);

    $response->assertRedirect('/shops');

    $shop->refresh();
    expect($shop->name)->toBe('New Name');
    expect($shop->slug)->toBe('new-name');
    expect($shop->status)->toBe('active');
});

test('authenticated user can delete a shop', function () {
    $user = User::factory()->create();
    $shop = Shop::create([
        'name' => 'To Delete',
        'slug' => 'to-delete',
        'user_id' => $user->id,
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->delete("/shops/{$shop->id}");

    $response->assertRedirect('/shops');
    expect(Shop::find($shop->id))->toBeNull();
});
