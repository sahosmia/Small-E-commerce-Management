<?php

namespace App\Actions\Shop;

use App\Models\Shop;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UpdateShopAction
{
    /**
     * Update an existing shop.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(Shop $shop, array $data, ?UploadedFile $logo = null, ?UploadedFile $banner = null): Shop
    {
        if (empty($data['slug']) && ! empty($data['name']) && ! $shop->slug) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($logo) {
            if ($shop->logo && Storage::disk('public')->exists($shop->logo)) {
                Storage::disk('public')->delete($shop->logo);
            }
            $data['logo'] = $logo->store('shops/logos', 'public');
        }

        if ($banner) {
            if ($shop->banner && Storage::disk('public')->exists($shop->banner)) {
                Storage::disk('public')->delete($shop->banner);
            }
            $data['banner'] = $banner->store('shops/banners', 'public');
        }

        $shop->update($data);

        return $shop->fresh();
    }
}
