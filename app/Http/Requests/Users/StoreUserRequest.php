<?php

namespace App\Http\Requests\Users;

use App\Enums\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'username' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9_.-]+$/', 'unique:users,username'],
            'password' => ['required', 'string', Password::defaults()],
            'role' => ['nullable', Rule::enum(UserRole::class)],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
