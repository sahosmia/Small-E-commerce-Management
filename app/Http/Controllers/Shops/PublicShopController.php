<?php

namespace App\Http\Controllers\Shops;

use App\Http\Controllers\Controller;
use App\Models\Shop;
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
                'products' => [],
            ],
        ]);
    }
}
