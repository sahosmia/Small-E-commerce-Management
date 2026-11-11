<?php

namespace App\Actions\Product;

use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateGlobalProductAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Product $product, array $data, ?UploadedFile $thumbnail = null, bool $removeThumbnail = false): Product
    {
        $updateData = [
            'name' => $data['name'] ?? $product->name,
            'base_price' => $data['base_price'] ?? $product->base_price,
            'description' => array_key_exists('description', $data) ? $data['description'] : $product->description,
        ];

        if (! empty($data['sku'])) {
            $updateData['sku'] = $data['sku'];
        }

        if (! empty($data['slug'])) {
            $updateData['slug'] = $data['slug'];
        }

        if (isset($data['is_active'])) {
            $updateData['is_active'] = (bool) $data['is_active'];
        }

        if ($thumbnail) {
            if ($product->thumbnail && Storage::disk('public')->exists($product->thumbnail)) {
                Storage::disk('public')->delete($product->thumbnail);
            }
            $updateData['thumbnail'] = $thumbnail->store('products', 'public');
        } elseif ($removeThumbnail) {
            if ($product->thumbnail && Storage::disk('public')->exists($product->thumbnail)) {
                Storage::disk('public')->delete($product->thumbnail);
            }
            $updateData['thumbnail'] = null;
        }

        $product->update($updateData);

        return $product->fresh();
    }
}
