<?php

namespace App\Http\Controllers\Users;

use App\Actions\User\DeleteUserAction;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->latest('id')
            ->paginate(15)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'role' => $user->role instanceof UserRole ? $user->role->value : (int) $user->role,
                'role_label' => $user->role instanceof UserRole ? $user->role->label() : ($user->role === UserRole::Admin ? 'Admin' : 'Shop Owner'),
                'is_active' => (bool) $user->is_active,
                'created_at' => $user->created_at?->format('Y-m-d H:i:s'),
                'created_date' => $user->created_at?->format('d M Y'),
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new shop owner / user (Admin only).
     */
    public function create(Request $request): Response
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Only administrators can create shop owners.');
        }

        return Inertia::render('users/create');
    }

    /**
     * Store a newly created shop owner / user in storage (Admin only).
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        User::create([
            ...$data,
            'role' => $data['role'] ?? UserRole::ShopOwner,
            'is_active' => $data['is_active'] ?? true,
            'password' => Hash::make($data['password']),
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(Request $request, User $user): Response
    {
        $currentUser = $request->user();

        if ($currentUser->isShopOwner() && $currentUser->id !== $user->id) {
            abort(403, 'Unauthorized.');
        }

        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'role' => $user->role instanceof UserRole ? $user->role->value : (int) $user->role,
                'role_label' => $user->role instanceof UserRole ? $user->role->label() : ($user->role === UserRole::Admin ? 'Admin' : 'Shop Owner'),
                'is_active' => (bool) $user->is_active,
            ],
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $currentUser = $request->user();

        if ($currentUser->isShopOwner() && $currentUser->id !== $user->id) {
            abort(403, 'Unauthorized.');
        }

        $data = $request->validated();

        // Shop owners cannot change role or is_active status
        if (! $currentUser->isAdmin()) {
            unset($data['role'], $data['is_active']);
        }

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage (Admin only).
     */
    public function destroy(Request $request, User $user, DeleteUserAction $deleteUser): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Only administrators can delete users.');
        }

        if ($request->user()->id === $user->id) {
            return back()->withErrors(['user' => 'You cannot delete your own account.']);
        }

        if ($blockedBy = $deleteUser->blockingReason($user)) {
            return back()->withErrors(['user' => $blockedBy]);
        }

        $deleteUser->execute($user);

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
