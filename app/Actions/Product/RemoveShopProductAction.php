<?php

namespace App\Actions\Product;

use App\Models\ShopProduct;
use Illuminate\Support\Facades\Storage;

class RemoveShopProductAction
{
    /**
     * Remove assignment from shop. Does not delete global product.
     */
    public function execute(ShopProduct $shopProduct): bool
    {
        if ($shopProduct->thumbnail && Storage::disk('public')->exists($shopProduct->thumbnail)) {
            Storage::disk('public')->delete($shopProduct->thumbnail);
        }

        return (bool) $shopProduct->delete();
    }
}
