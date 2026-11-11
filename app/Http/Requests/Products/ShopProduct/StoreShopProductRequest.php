<?php

namespace App\Http\Requests\Products\ShopProduct;

use Illuminate\Foundation\Http\FormRequest;

class StoreShopProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->isShopOwner() && (bool) $user->is_active && $user->shop !== null && $user->shop->isActive();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'description' => ['nullable', 'string'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            // Shop overrides (optional on create, will default to base_price, null, null, true if omitted)
            'shop_price' => ['nullable', 'numeric', 'min:0'],
            'shop_description' => ['nullable', 'string'],
            'shop_thumbnail' => ['nullable', 'image', 'max:2048'],
            'status' => ['sometimes', 'boolean'],
        ];
    }
}
