<?php

namespace App\Http\Controllers\Shops;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shops\StoreShopRequest;
use App\Http\Requests\Shops\UpdateShopRequest;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    /**
     * Display a listing of shops.
     */
    public function index(Request $request): Response
    {
        $shops = Shop::query()
            ->with('owner:id,name,email')
            ->latest('id')
            ->paginate(15)
            ->through(fn (Shop $shop) => [
                'id' => $shop->id,
                'name' => $shop->name,
                'slug' => $shop->slug,
                'logo' => $shop->logoUrl(),
                'status' => $shop->status,
                'user_id' => $shop->user_id,
                'owner' => $shop->owner ? [
                    'id' => $shop->owner->id,
                    'name' => $shop->owner->name,
                    'email' => $shop->owner->email,
                ] : null,
                'created_at' => $shop->created_at?->format('Y-m-d H:i:s'),
                'created_date' => $shop->created_at?->format('d M Y'),
            ]);

        return Inertia::render('shops/index', [
            'shops' => $shops,
        ]);
    }

    /**
     * Show the form for creating a new shop.
     */
    public function create(): Response
    {
        $users = User::query()->orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('shops/create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created shop in storage.
     */
    public function store(StoreShopRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('shops', 'public');
        }

        Shop::create($data);

        return redirect()->route('shops.index')->with('success', 'Shop created successfully.');
    }

    /**
     * Show the form for editing the specified shop.
     */
    public function edit(Shop $shop): Response
    {
        $users = User::query()->orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('shops/edit', [
            'shop' => [
                'id' => $shop->id,
                'name' => $shop->name,
                'slug' => $shop->slug,
                'status' => $shop->status,
                'user_id' => $shop->user_id,
                'logo' => $shop->logoUrl(),
            ],
            'users' => $users,
        ]);
    }

    /**
     * Update the specified shop in storage.
     */
    public function update(UpdateShopRequest $request, Shop $shop): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            if ($shop->logo && Storage::disk('public')->exists($shop->logo)) {
                Storage::disk('public')->delete($shop->logo);
            }
            $data['logo'] = $request->file('logo')->store('shops', 'public');
        }

        $shop->update($data);

        return redirect()->route('shops.index')->with('success', 'Shop updated successfully.');
    }

    /**
     * Remove the specified shop from storage.
     */
    public function destroy(Shop $shop): RedirectResponse
    {
        if ($shop->logo && Storage::disk('public')->exists($shop->logo)) {
            Storage::disk('public')->delete($shop->logo);
        }

        $shop->delete();

        return redirect()->route('shops.index')->with('success', 'Shop deleted successfully.');
    }
}
