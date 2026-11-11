<?php

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

// Scenario 1: Admin Create Product -> Success
test('1. admin can create a global product successfully', function () {
    $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'is_active' => true]);
    $image = UploadedFile::fake()->image('global_headphone.jpg');

    $response = $this->actingAs($admin)->post('/admin/products', [
        'name' => 'Sony Wireless Headphones',
        'sku' => 'SONY-WH-1000XM5',
        'base_price' => 29999.00,
        'description' => 'Flagship noise cancelling headphones',
        'is_active' => true,
        'thumbnail' => $image,
    ]);

    $response->assertRedirect('/admin/products');
    $product = Product::where('sku', 'SONY-WH-1000XM5')->first();
    expect($product)->not->toBeNull();
    expect($product->name)->toBe('Sony Wireless Headphones');
    expect($product->created_by)->toBe($admin->id);
    expect($product->base_price)->toEqual('29999.00');
    expect($product->thumbnail)->not->toBeNull();
    Storage::disk('public')->assertExists($product->thumbnail);
});

// Scenario 2: Owner Create Product -> Global + Own Shop
test('2. owner can create a product which generates both global product and own shop assignment', function () {
    $owner = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shop = Shop::create([
        'name' => 'Gadget Zone',
        'slug' => 'gadget-zone',
        'user_id' => $owner->id,
        'status' => 'active',
    ]);

    $response = $this->actingAs($owner)->post('/owner/products', [
        'name' => 'Custom Mechanical Keyboard',
        'sku' => 'KEY-RGB-001',
        'base_price' => 4500.00,
        'description' => 'Global description for keyboard',
        'shop_price' => 4800.00,
        'shop_description' => 'My shop warranty included',
        'status' => true,
    ]);

    $response->assertRedirect('/owner/products');

    // Global product created
    $global = Product::where('sku', 'KEY-RGB-001')->first();
    expect($global)->not->toBeNull();
    expect($global->created_by)->toBe($owner->id);
    expect($global->base_price)->toEqual('4500.00');

    // Own shop assignment created
    $shopProduct = ShopProduct::where('shop_id', $shop->id)->where('product_id', $global->id)->first();
    expect($shopProduct)->not->toBeNull();
    expect($shopProduct->price)->toEqual('4800.00');
    expect($shopProduct->description)->toBe('My shop warranty included');
});

// Scenario 3: Owner Add Catalog Product -> Success
test('3. owner can add an active global product from catalog to own shop', function () {
    $owner = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shop = Shop::create([
        'name' => 'Tech Hub',
        'slug' => 'tech-hub',
        'user_id' => $owner->id,
        'status' => 'active',
    ]);

    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Apple iPad Air',
        'slug' => 'apple-ipad-air',
        'sku' => 'IPAD-AIR-M2',
        'base_price' => 65000.00,
        'description' => 'Apple Silicon iPad',
        'is_active' => true,
    ]);

    $response = $this->actingAs($owner)->post("/owner/catalog/{$product->id}/add");

    $response->assertRedirect();
    $assignment = ShopProduct::where('shop_id', $shop->id)->where('product_id', $product->id)->first();
    expect($assignment)->not->toBeNull();
    expect($assignment->price)->toEqual('65000.00');
    expect($assignment->description)->toBeNull();
    expect($assignment->thumbnail)->toBeNull();
    expect($assignment->status)->toBeTrue();
});

// Scenario 4: Duplicate Assignment -> Block
test('4. duplicate assignment of the same product to the same shop is blocked', function () {
    $owner = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shop = Shop::create([
        'name' => 'Tech Hub',
        'slug' => 'tech-hub',
        'user_id' => $owner->id,
        'status' => 'active',
    ]);

    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Apple iPad Air',
        'slug' => 'apple-ipad-air',
        'sku' => 'IPAD-AIR-M2',
        'base_price' => 65000.00,
        'is_active' => true,
    ]);

    ShopProduct::create([
        'shop_id' => $shop->id,
        'product_id' => $product->id,
        'price' => 65000.00,
        'status' => true,
    ]);

    $response = $this->actingAs($owner)->post("/owner/catalog/{$product->id}/add");

    $response->assertSessionHasErrors(['error']);
    expect(ShopProduct::where('shop_id', $shop->id)->where('product_id', $product->id)->count())->toBe(1);
});

// Scenario 5: Admin Update Global Image -> Inheriting Shops Updated
test('5. admin update global image automatically reflects on shops that do not have custom image override', function () {
    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $ownerA = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopA = Shop::create(['name' => 'Shop A', 'slug' => 'shop-a', 'user_id' => $ownerA->id, 'status' => 'active']);

    $ownerB = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopB = Shop::create(['name' => 'Shop B', 'slug' => 'shop-b', 'user_id' => $ownerB->id, 'status' => 'active']);

    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Bluetooth Speaker',
        'slug' => 'bluetooth-speaker',
        'sku' => 'SPK-001',
        'base_price' => 3000.00,
        'thumbnail' => 'products/old_global.jpg',
        'is_active' => true,
    ]);

    // Shop A inherits global
    $spA = ShopProduct::create([
        'shop_id' => $shopA->id,
        'product_id' => $product->id,
        'price' => 3000.00,
        'thumbnail' => null,
        'status' => true,
    ]);

    // Shop B has custom thumbnail
    $spB = ShopProduct::create([
        'shop_id' => $shopB->id,
        'product_id' => $product->id,
        'price' => 3200.00,
        'thumbnail' => 'shop-products/custom_b.jpg',
        'status' => true,
    ]);

    $newGlobalImage = UploadedFile::fake()->image('new_global.jpg');

    $this->actingAs($admin)->put("/admin/products/{$product->id}", [
        'name' => $product->name,
        'sku' => $product->sku,
        'base_price' => $product->base_price,
        'thumbnail' => $newGlobalImage,
    ]);

    $spA->refresh();
    $spB->refresh();

    // Shop A gets the new global image
    expect($spA->effective_thumbnail)->toBe(Product::find($product->id)->thumbnail);
    // Shop B keeps its own custom image
    expect($spB->effective_thumbnail)->toBe('shop-products/custom_b.jpg');
});

// Scenario 6: Admin Update Global Description -> Inheriting Shops Updated
test('6. admin update global description reflects on shops without custom description override', function () {
    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $ownerA = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopA = Shop::create(['name' => 'Shop A', 'slug' => 'shop-a', 'user_id' => $ownerA->id, 'status' => 'active']);

    $ownerB = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopB = Shop::create(['name' => 'Shop B', 'slug' => 'shop-b', 'user_id' => $ownerB->id, 'status' => 'active']);

    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Power Bank',
        'slug' => 'power-bank',
        'sku' => 'PB-001',
        'base_price' => 1500.00,
        'description' => 'Original Description',
        'is_active' => true,
    ]);

    $spA = ShopProduct::create([
        'shop_id' => $shopA->id,
        'product_id' => $product->id,
        'price' => 1500.00,
        'description' => null,
        'status' => true,
    ]);

    $spB = ShopProduct::create([
        'shop_id' => $shopB->id,
        'product_id' => $product->id,
        'price' => 1600.00,
        'description' => 'Custom Shop B warranty',
        'status' => true,
    ]);

    $this->actingAs($admin)->put("/admin/products/{$product->id}", [
        'name' => $product->name,
        'sku' => $product->sku,
        'base_price' => $product->base_price,
        'description' => 'Brand New Updated Description',
    ]);

    $spA->refresh();
    $spB->refresh();

    expect($spA->effective_description)->toBe('Brand New Updated Description');
    expect($spB->effective_description)->toBe('Custom Shop B warranty');
});

// Scenario 7: Admin Update Base Price -> Existing Shop Price Unchanged
test('7. admin update base price does not change existing shop prices', function () {
    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $owner = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shop = Shop::create(['name' => 'Shop X', 'slug' => 'shop-x', 'user_id' => $owner->id, 'status' => 'active']);

    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'USB Cable',
        'slug' => 'usb-cable',
        'sku' => 'USB-001',
        'base_price' => 200.00,
        'is_active' => true,
    ]);

    $sp = ShopProduct::create([
        'shop_id' => $shop->id,
        'product_id' => $product->id,
        'price' => 250.00,
        'status' => true,
    ]);

    $this->actingAs($admin)->put("/admin/products/{$product->id}", [
        'name' => $product->name,
        'sku' => $product->sku,
        'base_price' => 300.00,
    ]);

    $sp->refresh();
    expect($sp->price)->toEqual('250.00');
    expect(Product::find($product->id)->base_price)->toEqual('300.00');
});

// Scenario 8: Owner Update Shop Price -> Only Own Shop Updated
test('8. owner update shop price updates only their own shop', function () {
    $ownerA = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopA = Shop::create(['name' => 'Shop A', 'slug' => 'shop-a', 'user_id' => $ownerA->id, 'status' => 'active']);

    $ownerB = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopB = Shop::create(['name' => 'Shop B', 'slug' => 'shop-b', 'user_id' => $ownerB->id, 'status' => 'active']);

    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Smart Watch',
        'slug' => 'smart-watch',
        'sku' => 'SW-001',
        'base_price' => 5000.00,
        'is_active' => true,
    ]);

    $spA = ShopProduct::create(['shop_id' => $shopA->id, 'product_id' => $product->id, 'price' => 5000.00, 'status' => true]);
    $spB = ShopProduct::create(['shop_id' => $shopB->id, 'product_id' => $product->id, 'price' => 5000.00, 'status' => true]);

    $this->actingAs($ownerA)->put("/owner/products/{$spA->id}", [
        'price' => 5500.00,
    ]);

    $spA->refresh();
    $spB->refresh();

    expect($spA->price)->toEqual('5500.00');
    expect($spB->price)->toEqual('5000.00');
});

// Scenario 9: Owner Update Custom Image -> Only Own Shop Updated
test('9. owner update custom image updates only their own shop', function () {
    $ownerA = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopA = Shop::create(['name' => 'Shop A', 'slug' => 'shop-a', 'user_id' => $ownerA->id, 'status' => 'active']);

    $ownerB = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopB = Shop::create(['name' => 'Shop B', 'slug' => 'shop-b', 'user_id' => $ownerB->id, 'status' => 'active']);

    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Earbuds',
        'slug' => 'earbuds',
        'sku' => 'EB-001',
        'base_price' => 1200.00,
        'thumbnail' => 'products/global_eb.jpg',
        'is_active' => true,
    ]);

    $spA = ShopProduct::create(['shop_id' => $shopA->id, 'product_id' => $product->id, 'price' => 1200.00, 'status' => true]);
    $spB = ShopProduct::create(['shop_id' => $shopB->id, 'product_id' => $product->id, 'price' => 1200.00, 'status' => true]);

    $customImage = UploadedFile::fake()->image('custom_a.jpg');
    $this->actingAs($ownerA)->put("/owner/products/{$spA->id}", [
        'price' => 1200.00,
        'thumbnail' => $customImage,
    ]);

    $spA->refresh();
    $spB->refresh();

    expect($spA->thumbnail)->not->toBeNull();
    expect($spB->thumbnail)->toBeNull();
    expect($spB->effective_thumbnail)->toBe('products/global_eb.jpg');
});

// Scenario 10: Owner Update Global Name -> Block
test('10. owner cannot modify global product name via update request', function () {
    $owner = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shop = Shop::create(['name' => 'Shop A', 'slug' => 'shop-a', 'user_id' => $owner->id, 'status' => 'active']);

    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Real Global Name',
        'slug' => 'real-global-name',
        'sku' => 'REAL-001',
        'base_price' => 1000.00,
        'is_active' => true,
    ]);

    $sp = ShopProduct::create(['shop_id' => $shop->id, 'product_id' => $product->id, 'price' => 1000.00, 'status' => true]);

    // Owner attempts to send "name" and "sku" in update shop product
    $this->actingAs($owner)->put("/owner/products/{$sp->id}", [
        'price' => 1100.00,
        'name' => 'Hacked Product Name',
        'sku' => 'HACKED-SKU',
    ]);

    $product->refresh();
    expect($product->name)->toBe('Real Global Name');
    expect($product->sku)->toBe('REAL-001');
});

// Scenario 11: Owner Update Global SKU -> Block
test('11. owner cannot change global sku through admin route', function () {
    $owner = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Protected Item',
        'slug' => 'protected-item',
        'sku' => 'PROT-001',
        'base_price' => 1000.00,
        'is_active' => true,
    ]);

    // Owner hits admin update route directly
    $response = $this->actingAs($owner)->put("/admin/products/{$product->id}", [
        'name' => 'Hacked Item',
        'sku' => 'NEW-SKU-999',
        'base_price' => 500.00,
    ]);

    $response->assertForbidden();
    expect(Product::find($product->id)->sku)->toBe('PROT-001');
});

// Scenario 12: Owner Edit Other Shop -> 403
test('12. owner cannot edit or update products belonging to another shop', function () {
    $ownerA = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopA = Shop::create(['name' => 'Shop A', 'slug' => 'shop-a', 'user_id' => $ownerA->id, 'status' => 'active']);

    $ownerB = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopB = Shop::create(['name' => 'Shop B', 'slug' => 'shop-b', 'user_id' => $ownerB->id, 'status' => 'active']);

    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Gaming Mouse',
        'slug' => 'gaming-mouse',
        'sku' => 'GM-001',
        'base_price' => 2000.00,
        'is_active' => true,
    ]);

    $spB = ShopProduct::create(['shop_id' => $shopB->id, 'product_id' => $product->id, 'price' => 2000.00, 'status' => true]);

    $response = $this->actingAs($ownerA)->get("/owner/products/{$spB->id}/edit");
    $response->assertForbidden();

    $responsePut = $this->actingAs($ownerA)->put("/owner/products/{$spB->id}", [
        'price' => 2500.00,
    ]);
    $responsePut->assertForbidden();
});

// Scenario 13: Inactive Global Product -> Customer Hidden
test('13. inactive global product is completely hidden from customer storefront even if shop listing is active', function () {
    $owner = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shop = Shop::create(['name' => 'Electronics', 'slug' => 'electronics', 'user_id' => $owner->id, 'status' => 'active']);

    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Deactivated Phone',
        'slug' => 'deactivated-phone',
        'sku' => 'PHONE-DEACT',
        'base_price' => 15000.00,
        'is_active' => false, // Global Inactive
    ]);

    ShopProduct::create([
        'shop_id' => $shop->id,
        'product_id' => $product->id,
        'price' => 15000.00,
        'status' => true, // Shop Active
    ]);

    $response = $this->get("/shops/{$shop->slug}/products");
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->has('products.data', 0));

    $responseDetail = $this->get("/shops/{$shop->slug}/products/{$product->slug}");
    $responseDetail->assertNotFound();
});

// Scenario 14: Inactive Shop Listing -> Customer Hidden
test('14. inactive shop listing is hidden from customer storefront even if global product is active', function () {
    $owner = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shop = Shop::create(['name' => 'Electronics', 'slug' => 'electronics', 'user_id' => $owner->id, 'status' => 'active']);

    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Active Phone',
        'slug' => 'active-phone',
        'sku' => 'PHONE-ACT',
        'base_price' => 15000.00,
        'is_active' => true, // Global Active
    ]);

    ShopProduct::create([
        'shop_id' => $shop->id,
        'product_id' => $product->id,
        'price' => 15000.00,
        'status' => false, // Shop Inactive
    ]);

    $response = $this->get("/shops/{$shop->slug}/products");
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->has('products.data', 0));

    $responseDetail = $this->get("/shops/{$shop->slug}/products/{$product->slug}");
    $responseDetail->assertNotFound();
});

// Scenario 15: Remove Own Assignment -> Other Shops Unchanged
test('15. owner removing own assignment deletes only their shop product, leaving other shops unaffected', function () {
    $ownerA = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopA = Shop::create(['name' => 'Shop A', 'slug' => 'shop-a', 'user_id' => $ownerA->id, 'status' => 'active']);

    $ownerB = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shopB = Shop::create(['name' => 'Shop B', 'slug' => 'shop-b', 'user_id' => $ownerB->id, 'status' => 'active']);

    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Shared Item',
        'slug' => 'shared-item',
        'sku' => 'SHARE-001',
        'base_price' => 100.00,
        'is_active' => true,
    ]);

    $spA = ShopProduct::create(['shop_id' => $shopA->id, 'product_id' => $product->id, 'price' => 100.00, 'status' => true]);
    $spB = ShopProduct::create(['shop_id' => $shopB->id, 'product_id' => $product->id, 'price' => 100.00, 'status' => true]);

    $this->actingAs($ownerA)->delete("/owner/products/{$spA->id}");

    expect(ShopProduct::find($spA->id))->toBeNull();
    expect(ShopProduct::find($spB->id))->not->toBeNull();
    expect(Product::find($product->id))->not->toBeNull();
});

// Scenario 16: Delete Assigned Global Product -> Block
test('16. deleting an assigned global product is blocked and returns an error', function () {
    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $owner = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);
    $shop = Shop::create(['name' => 'Shop 1', 'slug' => 'shop-1', 'user_id' => $owner->id, 'status' => 'active']);

    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Popular Phone',
        'slug' => 'popular-phone',
        'sku' => 'POP-001',
        'base_price' => 30000.00,
        'is_active' => true,
    ]);

    ShopProduct::create(['shop_id' => $shop->id, 'product_id' => $product->id, 'price' => 30000.00, 'status' => true]);

    $response = $this->actingAs($admin)->delete("/admin/products/{$product->id}");

    $response->assertSessionHasErrors(['error']);
    expect(Product::find($product->id))->not->toBeNull();
});

// Scenario 17: Delete Unassigned Global Product -> Conditional Success (Soft Delete)
test('17. deleting an unassigned global product soft deletes it successfully', function () {
    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Unassigned Phone',
        'slug' => 'unassigned-phone',
        'sku' => 'UNASS-001',
        'base_price' => 30000.00,
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->delete("/admin/products/{$product->id}");

    $response->assertRedirect('/admin/products');
    expect(Product::find($product->id))->toBeNull();
    expect(Product::withTrashed()->find($product->id))->not->toBeNull();
});

// Scenario 18: Inactive Product Re-activated -> Admin Only
test('18. only admin can reactivate an inactive global product', function () {
    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $owner = User::factory()->create(['role' => User::ROLE_SHOP_OWNER, 'is_active' => true]);

    $product = Product::create([
        'created_by' => $admin->id,
        'name' => 'Discontinued Item',
        'slug' => 'discontinued-item',
        'sku' => 'DISC-001',
        'base_price' => 1000.00,
        'is_active' => false,
    ]);

    // Shop owner attempts to toggle status -> forbidden
    $ownerResponse = $this->actingAs($owner)->patch("/admin/products/{$product->id}/toggle-status");
    $ownerResponse->assertForbidden();
    expect($product->fresh()->is_active)->toBeFalse();

    // Admin toggles status -> success
    $adminResponse = $this->actingAs($admin)->patch("/admin/products/{$product->id}/toggle-status");
    $adminResponse->assertRedirect();
    expect($product->fresh()->is_active)->toBeTrue();
});
