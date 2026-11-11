<?php

namespace App\Actions\Product;

use App\Models\ShopProduct;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateShopProductAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(ShopProduct $shopProduct, array $data, ?UploadedFile $thumbnail = null, bool $removeThumbnail = false): ShopProduct
    {
        $updateData = [];

        if (array_key_exists('price', $data)) {
            $updateData['price'] = $data['price'];
        }

        if (array_key_exists('description', $data)) {
            $updateData['description'] = $data['description'];
        }

        if (isset($data['status'])) {
            $updateData['status'] = (bool) $data['status'];
        }

        if ($thumbnail) {
            if ($shopProduct->thumbnail && Storage::disk('public')->exists($shopProduct->thumbnail)) {
                Storage::disk('public')->delete($shopProduct->thumbnail);
            }
            $updateData['thumbnail'] = $thumbnail->store('shop-products', 'public');
        } elseif ($removeThumbnail) {
            if ($shopProduct->thumbnail && Storage::disk('public')->exists($shopProduct->thumbnail)) {
                Storage::disk('public')->delete($shopProduct->thumbnail);
            }
            $updateData['thumbnail'] = null;
        }

        $shopProduct->update($updateData);

        return $shopProduct->fresh();
    }
}
