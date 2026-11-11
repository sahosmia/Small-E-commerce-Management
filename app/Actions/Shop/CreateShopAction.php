<?php

namespace App\Actions\Shop;

use App\Models\Shop;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class CreateShopAction
{
    /**
     * Create a new shop.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, ?UploadedFile $logo = null, ?UploadedFile $banner = null): Shop
    {
        if (empty($data['slug']) && ! empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($logo) {
            $data['logo'] = $logo->store('shops/logos', 'public');
        }

        if ($banner) {
            $data['banner'] = $banner->store('shops/banners', 'public');
        }

        return Shop::create($data);
    }
}
