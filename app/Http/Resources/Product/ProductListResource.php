<?php

namespace App\Http\Resources\Product;

use App\Models\Product;
use Illuminate\Http\Resources\Json\JsonResource;

/** @property Product $resource */
class ProductListResource extends JsonResource
{
    public function toArray($request): array
    {
        $product = $this->resource;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'category' => $product->category?->only(['id', 'name']),
            'brand' => $product->brand?->only(['id', 'name']),
            'unit' => $product->unit->only(['id', 'name']),
            'avg_cost' => $product->avg_cost,
            'selling_price' => $product->selling_price,
            'profit_margin' => $product->profit_margin,
            'is_for_sale' => $product->is_for_sale,
            'is_active' => $product->is_active,
            'track_serial_number' => $product->track_serial_number,
            'image_url' => $product->imageUrl(),
        ];
    }
}
