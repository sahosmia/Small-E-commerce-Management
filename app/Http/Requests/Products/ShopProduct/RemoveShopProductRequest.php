<?php

namespace App\Http\Requests\Products\ShopProduct;

use App\Models\ShopProduct;
use Illuminate\Foundation\Http\FormRequest;

class RemoveShopProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (! $user || ! $user->isShopOwner() || ! $user->is_active || ! $user->shop) {
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
        return [];
    }
}
