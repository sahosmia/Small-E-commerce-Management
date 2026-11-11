<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of active products for a specific shop.
     *
     * Visibility Requirements:
     * 1. Shop is active
     * 2. Shop Owner is active
     * 3. Global Product is active
     * 4. Shop Assignment exists
     * 5. Shop Assignment status is active
     */
    public function index(Shop $shop, Request $request): Response
    {
        // Check shop and owner status
        if (! $shop->isActive() || ! $shop->owner || ! $shop->owner->is_active) {
            abort(404, 'Shop not found or currently inactive.');
        }

        $search = $request->input('search');

        $query = ShopProduct::query()
            ->with('product')
            ->where('shop_id', $shop->id)
            ->where('status', true)
            ->whereHas('product', function ($q) use ($search) {
                $q->where('is_active', true);

                if (! empty($search)) {
                    $q->where(function ($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%");
                    });
                }
            })
            ->latest('id');

        $perPage = (int) $request->input('per_page', 12);
        $products = $query->paginate($perPage)->through(fn (ShopProduct $sp) => [
            'id' => $sp->id,
            'product_id' => $sp->product_id,
            'name' => $sp->product->name,
            'slug' => $sp->product->slug,
            'sku' => $sp->product->sku,
            'price' => (float) $sp->price,
            'description' => $sp->effective_description,
            'thumbnail' => $sp->effectiveThumbnailUrl(),
        ]);

        return Inertia::render('customer/products/index', [
            'shop' => [
                'id' => $shop->id,
                'name' => $shop->name,
                'slug' => $shop->slug,
                'logo' => $shop->logoUrl(),
            ],
            'products' => $products,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Display a specific product for a shop.
     */
    public function show(Shop $shop, Product $product): Response
    {
        // 1. Shop active
        // 2. Owner active
        // 3. Product active
        if (! $shop->isActive() || ! $shop->owner || ! $shop->owner->is_active || ! $product->is_active) {
            abort(404, 'Product not found.');
        }

        // 4. Assignment exists and 5. status active
        $shopProduct = ShopProduct::where('shop_id', $shop->id)
            ->where('product_id', $product->id)
            ->where('status', true)
            ->first();

        if (! $shopProduct) {
            abort(404, 'Product is not available in this shop.');
        }

        return Inertia::render('customer/products/show', [
            'shop' => [
                'id' => $shop->id,
                'name' => $shop->name,
                'slug' => $shop->slug,
                'logo' => $shop->logoUrl(),
            ],
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'price' => (float) $shopProduct->price,
                'description' => $shopProduct->effective_description,
                'thumbnail' => $shopProduct->effectiveThumbnailUrl(),
            ],
        ]);
    }
}
