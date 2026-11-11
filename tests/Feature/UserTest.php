<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('authenticated user can view users index page', function () {
    $admin = User::factory()->admin()->create();
    $shopOwner = User::factory()->shopOwner()->create();

    $response = $this->actingAs($shopOwner)->get(route('users.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('users/index')
        ->has('users.data', 2)
    );
});

test('admin can view create user page', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('users.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('users/create'));
});

test('shop owner cannot view create user page', function () {
    $shopOwner = User::factory()->shopOwner()->create();

    $response = $this->actingAs($shopOwner)->get(route('users.create'));

    $response->assertForbidden();
});

test('admin can create a shop owner account with role and status', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('users.store'), [
        'name' => 'New Shop Owner',
        'email' => 'owner@example.com',
        'username' => 'new.owner',
        'password' => 'password123',
        'role' => UserRole::ShopOwner->value,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('users.index'));

    $user = User::where('email', 'owner@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->name)->toBe('New Shop Owner');
    expect($user->username)->toBe('new.owner');
    expect($user->role)->toBe(UserRole::ShopOwner);
    expect($user->is_active)->toBeTrue();
    expect(Hash::check('password123', $user->password))->toBeTrue();
});

test('shop owner cannot create a user', function () {
    $shopOwner = User::factory()->shopOwner()->create();

    $response = $this->actingAs($shopOwner)->post(route('users.store'), [
        'name' => 'Unauthorized User',
        'email' => 'unauth@example.com',
        'username' => 'unauth.user',
        'password' => 'password123',
    ]);

    $response->assertForbidden();
    expect(User::where('email', 'unauth@example.com')->exists())->toBeFalse();
});

test('admin can view edit page for any user', function () {
    $admin = User::factory()->admin()->create();
    $shopOwner = User::factory()->shopOwner()->create();

    $response = $this->actingAs($admin)->get(route('users.edit', $shopOwner));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('users/edit')
        ->where('user.id', $shopOwner->id)
    );
});

test('shop owner can view edit page for their own account', function () {
    $shopOwner = User::factory()->shopOwner()->create();

    $response = $this->actingAs($shopOwner)->get(route('users.edit', $shopOwner));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('users/edit')
        ->where('user.id', $shopOwner->id)
    );
});

test('shop owner cannot view edit page for another user', function () {
    $shopOwner1 = User::factory()->shopOwner()->create();
    $shopOwner2 = User::factory()->shopOwner()->create();

    $response = $this->actingAs($shopOwner1)->get(route('users.edit', $shopOwner2));

    $response->assertForbidden();
});

test('admin can update any user details, role, and active status', function () {
    $admin = User::factory()->admin()->create();
    $shopOwner = User::factory()->shopOwner()->create([
        'name' => 'Original Name',
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->put(route('users.update', $shopOwner), [
        'name' => 'Updated Name By Admin',
        'email' => $shopOwner->email,
        'username' => $shopOwner->username,
        'role' => UserRole::Admin->value,
        'is_active' => false,
    ]);

    $response->assertRedirect(route('users.index'));

    $shopOwner->refresh();
    expect($shopOwner->name)->toBe('Updated Name By Admin');
    expect($shopOwner->role)->toBe(UserRole::Admin);
    expect($shopOwner->is_active)->toBeFalse();
});

test('shop owner can update their own name, email, username, and password', function () {
    $shopOwner = User::factory()->shopOwner()->create([
        'name' => 'Original Owner',
        'email' => 'old@example.com',
        'username' => 'old.username',
    ]);

    $response = $this->actingAs($shopOwner)->put(route('users.update', $shopOwner), [
        'name' => 'Updated Owner Name',
        'email' => 'new@example.com',
        'username' => 'new.username',
        'password' => 'new-secret-password',
    ]);

    $response->assertRedirect(route('users.index'));

    $shopOwner->refresh();
    expect($shopOwner->name)->toBe('Updated Owner Name');
    expect($shopOwner->email)->toBe('new@example.com');
    expect($shopOwner->username)->toBe('new.username');
    expect(Hash::check('new-secret-password', $shopOwner->password))->toBeTrue();
});

test('shop owner cannot change their role', function () {
    $shopOwner = User::factory()->shopOwner()->create();

    $response = $this->actingAs($shopOwner)->put(route('users.update', $shopOwner), [
        'name' => $shopOwner->name,
        'email' => $shopOwner->email,
        'username' => $shopOwner->username,
        'role' => UserRole::Admin->value,
    ]);

    $response->assertSessionHasErrors(['role']);

    $shopOwner->refresh();
    expect($shopOwner->role)->toBe(UserRole::ShopOwner);
});

test('shop owner cannot change their status', function () {
    $shopOwner = User::factory()->shopOwner()->create(['is_active' => true]);

    $response = $this->actingAs($shopOwner)->put(route('users.update', $shopOwner), [
        'name' => $shopOwner->name,
        'email' => $shopOwner->email,
        'username' => $shopOwner->username,
        'is_active' => false,
    ]);

    $response->assertSessionHasErrors(['is_active']);

    $shopOwner->refresh();
    expect($shopOwner->is_active)->toBeTrue();
});

test('shop owner cannot update another user account', function () {
    $shopOwner1 = User::factory()->shopOwner()->create();
    $shopOwner2 = User::factory()->shopOwner()->create(['name' => 'Owner 2']);

    $response = $this->actingAs($shopOwner1)->put(route('users.update', $shopOwner2), [
        'name' => 'Hacked Name',
        'email' => $shopOwner2->email,
        'username' => $shopOwner2->username,
    ]);

    $response->assertForbidden();

    $shopOwner2->refresh();
    expect($shopOwner2->name)->toBe('Owner 2');
});

test('admin can delete another user', function () {
    $admin = User::factory()->admin()->create();
    $shopOwner = User::factory()->shopOwner()->create();

    $response = $this->actingAs($admin)->delete(route('users.destroy', $shopOwner));

    $response->assertRedirect(route('users.index'));
    expect(User::find($shopOwner->id))->toBeNull();
});

test('admin cannot delete their own account', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->delete(route('users.destroy', $admin));

    $response->assertSessionHasErrors(['user']);
    expect(User::find($admin->id))->not->toBeNull();
});

test('shop owner cannot delete any user', function () {
    $shopOwner = User::factory()->shopOwner()->create();
    $anotherUser = User::factory()->shopOwner()->create();

    $response = $this->actingAs($shopOwner)->delete(route('users.destroy', $anotherUser));

    $response->assertForbidden();
    expect(User::find($anotherUser->id))->not->toBeNull();
});
