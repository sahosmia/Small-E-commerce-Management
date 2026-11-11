<?php

namespace App\Http\Requests\Users;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User $currentUser */
        $currentUser = $this->user();
        /** @var User $targetUser */
        $targetUser = $this->route('user');

        if (! $currentUser) {
            return false;
        }

        if ($currentUser->isAdmin()) {
            return true;
        }

        return $currentUser->id === $targetUser->id;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var User $targetUser */
        $targetUser = $this->route('user');
        /** @var User $currentUser */
        $currentUser = $this->user();

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($targetUser->id)],
            'username' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9_.-]+$/', Rule::unique('users', 'username')->ignore($targetUser->id)],
            'password' => ['nullable', 'string', Password::defaults()],
        ];

        if ($currentUser?->isAdmin()) {
            $rules['role'] = ['nullable', Rule::enum(UserRole::class)];
            $rules['is_active'] = ['nullable', 'boolean'];
        } else {
            $rules['role'] = ['prohibited'];
            $rules['is_active'] = ['prohibited'];
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'role.prohibited' => 'Shop owners cannot change user roles.',
            'is_active.prohibited' => 'Shop owners cannot change user status.',
        ];
    }
}
