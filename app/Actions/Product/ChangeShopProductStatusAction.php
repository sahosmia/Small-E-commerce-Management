<?php

namespace App\Actions\Product;

use App\Models\ShopProduct;

class ChangeShopProductStatusAction
{
    public function execute(ShopProduct $shopProduct, ?bool $status = null): ShopProduct
    {
        $newStatus = $status ?? ! $shopProduct->status;
        $shopProduct->update(['status' => $newStatus]);

        return $shopProduct;
    }
}
