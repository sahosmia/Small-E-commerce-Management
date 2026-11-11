<?php

namespace App\Actions\Products\Product;

use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class UpdateProductAction
{
    public function __construct() {}

    /**
     * @param  array{name: string, sku?: string|null, category_id?: int|null, brand_id?: int|null, unit_id: int, selling_price: float|string, is_for_sale?: bool, is_active?: bool, warranty_period_months?: int|null, has_installation_service?: bool, emi_available?: bool, track_serial_number?: bool, service_plan?: array<int, array{period_months: int|string, free_quota: int|string}>}  $data
     */
    public function execute(Product $product, array $data, ?UploadedFile $image = null): Product
    {
        return DB::transaction(function () use ($product, $data, $image) {
            $product->update([
                'name' => $data['name'],
                'sku' => $data['sku'] ?? Product::generateUniqueSku(),
                'category_id' => $data['category_id'] ?? null,
                'brand_id' => $data['brand_id'] ?? null,
                'unit_id' => $data['unit_id'],
                'selling_price' => $data['selling_price'],
                'is_for_sale' => $data['is_for_sale'] ?? true,
                'is_active' => $data['is_active'] ?? true,
                'warranty_period_months' => $data['warranty_period_months'] ?? null,
                'has_installation_service' => $data['has_installation_service'] ?? false,
                'emi_available' => $data['emi_available'] ?? false,
                'track_serial_number' => $data['track_serial_number'] ?? false,
            ]);

            ServicePlanSync::sync($product, $data['service_plan'] ?? []);

            if ($image !== null) {
                $product->addMedia($image)->toMediaCollection('images');
            }

            return $product;
        });
    }
}
