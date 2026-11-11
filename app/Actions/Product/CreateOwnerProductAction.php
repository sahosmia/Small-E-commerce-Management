<?php

namespace App\Actions\Product;

use App\Models\Product;
use App\Models\ShopProduct;
use App\Models\User;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CreateOwnerProductAction
{
    public function __construct(
        protected CreateGlobalProductAction $createGlobalProduct
    ) {}

    /**
     * @param  array<string, mixed>  $data
     *
     * @throws Exception
     */
    public function execute(
        User $owner,
        array $data,
        ?UploadedFile $globalThumbnail = null,
        ?UploadedFile $shopThumbnail = null
    ): array {
        $shop = $owner->shop;
        if (! $shop) {
            throw new Exception('User does not have an associated shop.');
        }

        return DB::transaction(function () use ($owner, $shop, $data, $globalThumbnail, $shopThumbnail) {
            // 1. Create global product
            $globalProduct = $this->createGlobalProduct->execute($data, $globalThumbnail, $owner);

            // 2. Custom thumbnail for shop if provided
            $shopThumbnailPath = null;
            if ($shopThumbnail) {
                $shopThumbnailPath = $shopThumbnail->store('shop-products', 'public');
            }

            // 3. Assign to owner's shop
            $shopPrice = isset($data['shop_price']) && $data['shop_price'] !== null && $data['shop_price'] !== ''
                ? $data['shop_price']
                : $globalProduct->base_price;

            $shopDescription = ! empty($data['shop_description'])
                ? $data['shop_description']
                : null;

            $shopProduct = ShopProduct::create([
                'shop_id' => $shop->id,
                'product_id' => $globalProduct->id,
                'price' => $shopPrice,
                'description' => $shopDescription,
                'thumbnail' => $shopThumbnailPath,
                'status' => isset($data['status']) ? (bool) $data['status'] : true,
            ]);

            return [
                'product' => $globalProduct,
                'shop_product' => $shopProduct,
            ];
        });
    }
}
