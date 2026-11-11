<?php

namespace App\Http\Controllers\Shops;

use App\Actions\Shop\AssignShopOwnerAction;
use App\Actions\Shop\ChangeShopStatusAction;
use App\Actions\Shop\CreateShopAction;
use App\Actions\Shop\DeleteShopAction;
use App\Actions\Shop\UpdateShopAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Shops\StoreShopRequest;
use App\Http\Requests\Shops\UpdateShopRequest;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    /**
     * Display a listing of shops for admin.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Shop::class);

        $query = Shop::query()->with('owner:id,name,email');

        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('owner', function ($ownerQuery) use ($search) {
                        $ownerQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status') && in_array($request->input('status'), ['active', 'inactive', 'suspended'], true)) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('owner_id')) {
            $query->where('owner_id', $request->input('owner_id'));
        }

        $shops = $query->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Shop $shop) => [
                'id' => $shop->id,
                'name' => $shop->name,
                'slug' => $shop->slug,
                'logo' => $shop->logoUrl(),
                'banner' => $shop->bannerUrl(),
                'status' => $shop->status,
                'owner_id' => $shop->owner_id,
                'user_id' => $shop->owner_id,
                'email' => $shop->email,
                'phone' => $shop->phone,
                'city' => $shop->city,
                'country' => $shop->country,
                'products_count' => 0,
                'owner' => $shop->owner ? [
                    'id' => $shop->owner->id,
                    'name' => $shop->owner->name,
                    'email' => $shop->owner->email,
                ] : null,
                'created_at' => $shop->created_at?->format('Y-m-d H:i:s'),
                'created_date' => $shop->created_at?->format('d M Y'),
            ]);

        $metrics = [
            'total' => Shop::count(),
            'active' => Shop::where('status', 'active')->count(),
            'inactive' => Shop::where('status', 'inactive')->count(),
            'unassigned' => Shop::whereNull('owner_id')->count(),
            'suspended' => Shop::where('status', 'suspended')->count(),
        ];

        return Inertia::render('shops/index', [
            'shops' => $shops,
            'metrics' => $metrics,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'owner_id' => $request->input('owner_id', ''),
            ],
        ]);
    }

    /**
     * Show the form for creating a new shop.
     */
    public function create(): Response
    {
        Gate::authorize('create', Shop::class);

        $existingOwnerIds = Shop::whereNotNull('owner_id')->pluck('owner_id');

        $availableOwners = User::query()
            ->where('role', User::ROLE_SHOP_OWNER)
            ->where('is_active', true)
            ->whereNotIn('id', $existingOwnerIds)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('shops/create', [
            'users' => $availableOwners,
        ]);
    }

    /**
     * Store a newly created shop in storage.
     */
    public function store(StoreShopRequest $request, CreateShopAction $action): RedirectResponse
    {
        Gate::authorize('create', Shop::class);

        $data = $request->validated();
        $logo = $request->file('logo');
        $banner = $request->file('banner');

        $action->execute($data, $logo, $banner);

        return redirect()->route('shops.index')->with('success', 'Shop created successfully.');
    }

    /**
     * Display the specified shop.
     */
    public function show(Shop $shop): Response
    {
        Gate::authorize('view', $shop);

        $shop->load('owner:id,name,email');

        return Inertia::render('shops/show', [
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
                'owner_id' => $shop->owner_id,
                'owner' => $shop->owner ? [
                    'id' => $shop->owner->id,
                    'name' => $shop->owner->name,
                    'email' => $shop->owner->email,
                ] : null,
                'created_at' => $shop->created_at?->format('Y-m-d H:i:s'),
                'created_date' => $shop->created_at?->format('d M Y'),
                'products_count' => 0,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified shop.
     */
    public function edit(Shop $shop): Response
    {
        Gate::authorize('update', $shop);

        $existingOwnerIds = Shop::whereNotNull('owner_id')
            ->where('id', '!=', $shop->id)
            ->pluck('owner_id');

        $availableOwners = User::query()
            ->where('role', User::ROLE_SHOP_OWNER)
            ->where('is_active', true)
            ->whereNotIn('id', $existingOwnerIds)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('shops/edit', [
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
                'owner_id' => $shop->owner_id,
                'user_id' => $shop->owner_id,
            ],
            'users' => $availableOwners,
        ]);
    }

    /**
     * Update the specified shop in storage.
     */
    public function update(UpdateShopRequest $request, Shop $shop, UpdateShopAction $action): RedirectResponse
    {
        Gate::authorize('update', $shop);

        $data = $request->validated();
        $logo = $request->file('logo');
        $banner = $request->file('banner');

        $action->execute($shop, $data, $logo, $banner);

        return redirect()->route('shops.index')->with('success', 'Shop updated successfully.');
    }

    /**
     * Change shop operational status directly.
     */
    public function changeStatus(Request $request, Shop $shop, ChangeShopStatusAction $action): RedirectResponse
    {
        Gate::authorize('changeStatus', $shop);

        $request->validate([
            'status' => ['required', 'string', 'in:active,inactive,suspended'],
        ]);

        $action->execute($shop, $request->string('status')->value());

        return back()->with('success', 'Shop status updated successfully.');
    }

    /**
     * Assign owner directly.
     */
    public function assignOwner(Request $request, Shop $shop, AssignShopOwnerAction $action): RedirectResponse
    {
        Gate::authorize('assignOwner', $shop);

        $request->validate([
            'owner_id' => ['nullable', 'exists:users,id'],
        ]);

        $action->execute($shop, $request->input('owner_id') ? (int) $request->input('owner_id') : null);

        return back()->with('success', 'Shop owner updated successfully.');
    }

    /**
     * Remove the specified shop from storage.
     */
    public function destroy(Shop $shop, DeleteShopAction $action): RedirectResponse
    {
        Gate::authorize('delete', $shop);

        $action->execute($shop);

        return redirect()->route('shops.index')->with('success', 'Shop deleted successfully.');
    }
}
