<?php

namespace App\Actions\Product;

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use Exception;

class AssignProductToShopAction
{
    /**
     * Assign an existing active global product to a shop.
     *
     * @throws Exception
     */
    public function execute(Shop $shop, Product $product): ShopProduct
    {
        if (! $product->is_active) {
            throw new Exception('Cannot assign an inactive product.');
        }

        if (! $shop->isActive()) {
            throw new Exception('Cannot assign product to an inactive shop.');
        }

        $existing = ShopProduct::where('shop_id', $shop->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            throw new Exception('Product is already assigned to this shop.');
        }

        return ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'price' => $product->base_price,
            'description' => null,
            'thumbnail' => null,
            'status' => true,
        ]);
    }
}
