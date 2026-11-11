<?php

namespace App\Actions\Product;

use App\Models\Product;

class ChangeGlobalProductStatusAction
{
    public function execute(Product $product, ?bool $status = null): Product
    {
        $newStatus = $status ?? ! $product->is_active;
        $product->update(['is_active' => $newStatus]);

        return $product;
    }
}
