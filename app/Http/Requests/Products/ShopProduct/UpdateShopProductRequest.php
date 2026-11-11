<?php

namespace App\Http\Requests\Products\ShopProduct;

use App\Models\ShopProduct;
use Illuminate\Foundation\Http\FormRequest;

class UpdateShopProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (! $user || ! $user->isShopOwner() || ! $user->is_active || ! $user->shop || ! $user->shop->isActive()) {
            return false;
        }

        $shopProduct = $this->route('shop_product');
        if (! $shopProduct instanceof ShopProduct) {
            $shopProduct = ShopProduct::find($shopProduct);
        }

        return $shopProduct && (int) $shopProduct->shop_id === (int) $user->shop->id;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'status' => ['sometimes', 'boolean'],
            'remove_thumbnail' => ['sometimes', 'boolean'],
        ];
    }
}
