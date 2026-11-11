<?php

namespace App\Http\Controllers\Shops;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\ShopProduct;
use Inertia\Inertia;
use Inertia\Response;

class PublicShopController extends Controller
{
    /**
     * Display a shop public page.
     */
    public function show(string $slug): Response
    {
        $shop = Shop::query()
            ->where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        $products = ShopProduct::query()
            ->with('product')
            ->where('shop_id', $shop->id)
            ->where('status', true)
            ->whereHas('product', function ($q) {
                $q->where('is_active', true);
            })
            ->latest('id')
            ->get()
            ->map(fn (ShopProduct $sp) => [
                'id' => $sp->id,
                'product_id' => $sp->product_id,
                'name' => $sp->product->name,
                'slug' => $sp->product->slug,
                'sku' => $sp->product->sku,
                'price' => (float) $sp->price,
                'description' => $sp->effective_description,
                'thumbnail' => $sp->effectiveThumbnailUrl(),
            ]);

        return Inertia::render('shops/public', [
            'shop' => [
                'id' => $shop->id,
                'name' => $shop->name,
                'slug' => $shop->slug,
                'description' => $shop->description,
                'logo' => $shop->logoUrl(),
                'banner' => $shop->bannerUrl(),
                'email' => $shop->email,
                'phone' => $shop->phone,
                'address' => $shop->address,
                'city' => $shop->city,
                'country' => $shop->country,
                'status' => $shop->status,
                'products' => $products,
            ],
        ]);
    }
}
