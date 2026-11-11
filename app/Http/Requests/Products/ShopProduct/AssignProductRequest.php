<?php

namespace App\Http\Requests\Products\ShopProduct;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;

class AssignProductRequest extends FormRequest
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
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
                function ($attribute, $value, $fail) {
                    $product = Product::find($value);
                    if (! $product || ! $product->is_active) {
                        $fail('This product is not active and cannot be added.');

                        return;
                    }

                    $shop = $this->user()?->shop;
                    if ($shop && $shop->shopProducts()->where('product_id', $value)->exists()) {
                        $fail('Product is already assigned to your shop.');
                    }
                },
            ],
        ];
    }
}
