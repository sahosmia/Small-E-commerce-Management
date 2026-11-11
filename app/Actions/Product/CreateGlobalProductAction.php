<?php

namespace App\Actions\Product;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class CreateGlobalProductAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, ?UploadedFile $thumbnail = null, ?User $creator = null): Product
    {
        $creatorId = $creator?->id ?? auth()->id();

        $slug = ! empty($data['slug'])
            ? $data['slug']
            : Product::generateUniqueSlug($data['name']);

        $sku = ! empty($data['sku'])
            ? $data['sku']
            : Product::generateUniqueSku();

        $thumbnailPath = null;
        if ($thumbnail) {
            $thumbnailPath = $thumbnail->store('products', 'public');
        }

        return Product::create([
            'created_by' => $creatorId,
            'name' => $data['name'],
            'slug' => $slug,
            'sku' => $sku,
            'description' => $data['description'] ?? null,
            'base_price' => $data['base_price'],
            'thumbnail' => $thumbnailPath,
            'is_active' => isset($data['is_active']) ? (bool) $data['is_active'] : true,
        ]);
    }
}
