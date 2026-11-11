<?php

namespace App\Http\Controllers\Owner;

use App\Actions\Product\ChangeShopProductStatusAction;
use App\Actions\Product\CreateOwnerProductAction;
use App\Actions\Product\RemoveShopProductAction;
use App\Actions\Product\UpdateShopProductAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Products\ShopProduct\RemoveShopProductRequest;
use App\Http\Requests\Products\ShopProduct\StoreShopProductRequest;
use App\Http\Requests\Products\ShopProduct\UpdateShopProductRequest;
use App\Models\ShopProduct;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopProductController extends Controller
{
    public function index(Request $request): Response
    {
        $shop = $request->user()->shop;
        $search = $request->input('search');
        $status = $request->input('status');

        $query = ShopProduct::query()
            ->with('product')
            ->where('shop_id', $shop->id)
            ->latest('id');

        if (! empty($search)) {
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($status !== null && $status !== '') {
            $query->where('status', $status === 'active' || $status === '1' || $status === 1);
        }

        $perPage = (int) $request->input('per_page', 15);
        $products = $query->paginate($perPage)->through(fn (ShopProduct $sp) => [
            'id' => $sp->id,
            'shop_id' => $sp->shop_id,
            'product_id' => $sp->product_id,
            'name' => $sp->product?->name,
            'sku' => $sp->product?->sku,
            'global_base_price' => (float) $sp->product?->base_price,
            'shop_price' => (float) $sp->price,
            'global_status' => (bool) $sp->product?->is_active,
            'listing_status' => (bool) $sp->status,
            'effective_thumbnail' => $sp->effectiveThumbnailUrl(),
            'custom_thumbnail' => $sp->customThumbnailUrl(),
            'has_custom_description' => ! empty($sp->description),
            'has_custom_thumbnail' => ! empty($sp->thumbnail),
            'created_at' => $sp->created_at?->format('Y-m-d H:i:s'),
        ]);

        return Inertia::render('owner/products/index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('owner/products/create');
    }

    public function store(StoreShopProductRequest $request, CreateOwnerProductAction $action): RedirectResponse
    {
        try {
            $action->execute(
                $request->user(),
                $request->validated(),
                $request->file('thumbnail'),
                $request->file('shop_thumbnail')
            );

            return to_route('owner.products.index')->with('success', 'Product created and added to your shop.');
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->with('error', $e->getMessage());
        }
    }

    public function edit(ShopProduct $shopProduct, Request $request): Response
    {
        $shop = $request->user()->shop;
        if ((int) $shopProduct->shop_id !== (int) $shop->id) {
            abort(403, 'Unauthorized access to shop product.');
        }

        $shopProduct->load('product');

        return Inertia::render('owner/products/edit', [
            'shopProduct' => [
                'id' => $shopProduct->id,
                'shop_id' => $shopProduct->shop_id,
                'product_id' => $shopProduct->product_id,
                'name' => $shopProduct->product?->name,
                'sku' => $shopProduct->product?->sku,
                'global_base_price' => (float) $shopProduct->product?->base_price,
                'global_description' => $shopProduct->product?->description,
                'global_thumbnail' => $shopProduct->product?->thumbnailUrl(),
                'global_status' => (bool) $shopProduct->product?->is_active,
                'price' => (float) $shopProduct->price,
                'description' => $shopProduct->description,
                'custom_thumbnail' => $shopProduct->customThumbnailUrl(),
                'status' => (bool) $shopProduct->status,
            ],
        ]);
    }

    public function update(
        UpdateShopProductRequest $request,
        ShopProduct $shopProduct,
        UpdateShopProductAction $action
    ): RedirectResponse {
        $action->execute(
            $shopProduct,
            $request->validated(),
            $request->file('thumbnail'),
            (bool) $request->boolean('remove_thumbnail')
        );

        return to_route('owner.products.index')->with('success', 'Shop product details updated successfully.');
    }

    public function destroy(
        RemoveShopProductRequest $request,
        ShopProduct $shopProduct,
        RemoveShopProductAction $action
    ): RedirectResponse {
        $action->execute($shopProduct);

        return to_route('owner.products.index')->with('success', 'Product removed from your shop.');
    }

    public function toggleStatus(ShopProduct $product, ChangeShopProductStatusAction $action, Request $request): RedirectResponse
    {
        $shop = $request->user()->shop;
        if ((int) $product->shop_id !== (int) $shop->id) {
            abort(403);
        }

        $action->execute($product);

        return back()->with('success', 'Listing status updated.');
    }
}
