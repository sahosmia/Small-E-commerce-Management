<?php

namespace App\Http\Controllers\Users;

use App\Actions\User\DeleteUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        User::create([
            ...$data,
            'password' => Hash::make($data['password']),
        ]);

        return back();
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return back();
    }

    public function destroy(Request $request, User $user, DeleteUserAction $deleteUser): RedirectResponse
    {
        if ($request->user()->id === $user->id) {
            return back()->withErrors(['user' => 'You cannot delete your own account.']);
        }

        if ($blockedBy = $deleteUser->blockingReason($user)) {
            return back()->withErrors(['user' => $blockedBy]);
        }

        $deleteUser->execute($user);

        return back();
    }
}
