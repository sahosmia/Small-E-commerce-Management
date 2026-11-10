<?php

namespace App\Http\Requests\Shops;

use Illuminate\Foundation\Http\FormRequest;

class StoreShopRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:shops,slug'],
            'status' => ['required', 'string', 'in:active,inactive,pending'],
            'user_id' => ['required', 'exists:users,id'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
