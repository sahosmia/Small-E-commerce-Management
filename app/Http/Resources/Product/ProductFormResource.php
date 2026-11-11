<?php

namespace App\Http\Resources\Product;

use App\Models\Product;
use Illuminate\Http\Resources\Json\JsonResource;

/** @property Product $resource */
class ProductFormResource extends JsonResource
{
    public function toArray($request): array
    {
        $product = $this->resource;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'is_active' => $product->is_active,
            'image_url' => $product->imageUrl(),
            
        ];
    }
}
