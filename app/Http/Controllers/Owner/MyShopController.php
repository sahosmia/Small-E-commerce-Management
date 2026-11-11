<?php

namespace App\Http\Controllers\Owner;

use App\Actions\Shop\UpdateShopAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Shops\UpdateMyShopRequest;
use App\Models\Shop;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyShopController extends Controller
{
    /**
     * Display the authenticated shop owner's shop.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        $shop = $user->shop;

        return Inertia::render('owner/my-shop/show', [
            'shop' => $shop ? [
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
                'created_date' => $shop->created_at?->format('d M Y'),
                'products_count' => 0,
            ] : null,
        ]);
    }

    /**
     * Show the edit form for the authenticated shop owner's shop.
     */
    public function edit(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $shop = $user->shop;

        if (! $shop) {
            return redirect()->route('my-shop.show')->with('error', 'You do not have a shop assigned yet.');
        }

        return Inertia::render('owner/my-shop/edit', [
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
            ],
        ]);
    }

    /**
     * Update the authenticated shop owner's shop.
     */
    public function update(UpdateMyShopRequest $request, UpdateShopAction $action): RedirectResponse
    {
        $user = $request->user();
        $shop = $user->shop;

        if (! $shop) {
            return redirect()->route('my-shop.show')->with('error', 'You do not have a shop assigned yet.');
        }

        $data = $request->safe()->only([
            'name',
            'description',
            'email',
            'phone',
            'address',
            'city',
            'country',
        ]);

        $logo = $request->file('logo');
        $banner = $request->file('banner');

        $action->execute($shop, $data, $logo, $banner);

        return redirect()->route('my-shop.show')->with('success', 'Shop updated successfully.');
    }
}
