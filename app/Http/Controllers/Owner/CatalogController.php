<?php

namespace App\Http\Controllers\Owner;

use App\Actions\Product\AssignProductToShopAction;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $shop = $request->user()->shop;

        $assignedProductIds = $shop
            ? $shop->shopProducts()->pluck('product_id')->toArray()
            : [];

        $query = Product::query()
            ->where('is_active', true)
            ->latest('id');

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->input('per_page', 12);
        $products = $query->paginate($perPage)->through(fn (Product $p) => [
            'id' => $p->id,
            'name' => $p->name,
            'slug' => $p->slug,
            'sku' => $p->sku,
            'description' => $p->description,
            'base_price' => (float) $p->base_price,
            'thumbnail' => $p->thumbnailUrl(),
            'is_assigned' => in_array($p->id, $assignedProductIds, true),
        ]);

        return Inertia::render('owner/catalog/index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function show(Product $product, Request $request): Response
    {
        $shop = $request->user()->shop;
        $isAssigned = $shop
            ? $shop->shopProducts()->where('product_id', $product->id)->exists()
            : false;

        return Inertia::render('owner/catalog/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'description' => $product->description,
                'base_price' => (float) $product->base_price,
                'thumbnail' => $product->thumbnailUrl(),
                'is_active' => (bool) $product->is_active,
                'is_assigned' => $isAssigned,
            ],
        ]);
    }

    public function store(Product $product, Request $request, AssignProductToShopAction $action): RedirectResponse
    {
        $shop = $request->user()->shop;
        if (! $shop) {
            abort(403, 'No shop found for current user.');
        }

        try {
            $action->execute($shop, $product);

            return back()->with('success', "{$product->name} added to your shop successfully.");
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->with('error', $e->getMessage());
        }
    }
}
