<?php

namespace App\Http\Requests\Shops;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateShopRequest extends FormRequest
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
        $shop = $this->route('shop');
        $shopId = is_object($shop) ? $shop->id : $shop;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('shops', 'slug')->ignore($shopId)],
            'status' => ['required', 'string', 'in:active,inactive,pending'],
            'user_id' => ['required', 'exists:users,id'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
