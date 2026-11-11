<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display public landing page showing active shops.
     */
    public function __invoke(): Response
    {
        $shops = Shop::query()
            ->with('owner:id,name,email')
            ->where('status', 'active')
            ->latest('id')
            ->get()
            ->map(fn (Shop $shop) => [
                'id' => $shop->id,
                'name' => $shop->name,
                'slug' => $shop->slug,
                'logo' => $shop->logoUrl(),
                'status' => $shop->status,
                'owner' => $shop->owner ? [
                    'id' => $shop->owner->id,
                    'name' => $shop->owner->name,
                    'email' => $shop->owner->email,
                ] : null,
                'created_at' => $shop->created_at?->format('Y-m-d H:i:s'),
                'created_date' => $shop->created_at?->format('d M Y'),
            ]);

        return Inertia::render('home', [
            'shops' => $shops,
        ]);
    }
}
