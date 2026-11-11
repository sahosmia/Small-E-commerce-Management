<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Product\ChangeGlobalProductStatusAction;
use App\Actions\Product\CreateGlobalProductAction;
use App\Actions\Product\DeleteGlobalProductAction;
use App\Actions\Product\UpdateGlobalProductAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Products\Product\StoreProductRequest;
use App\Http\Requests\Products\Product\UpdateProductRequest;
use App\Models\Product;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Product::query()
            ->with('creator:id,name,email')
            ->withCount('shopProducts as assigned_shops_count')
            ->latest('id');

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($status !== null && $status !== '') {
            $query->where('is_active', $status === 'active' || $status === '1' || $status === 1);
        }

        $perPage = (int) $request->input('per_page', 15);
        $products = $query->paginate($perPage)->through(fn (Product $p) => [
            'id' => $p->id,
            'name' => $p->name,
            'slug' => $p->slug,
            'sku' => $p->sku,
            'base_price' => (float) $p->base_price,
            'thumbnail' => $p->thumbnailUrl(),
            'is_active' => (bool) $p->is_active,
            'assigned_shops_count' => (int) $p->assigned_shops_count,
            'creator' => $p->creator ? [
                'id' => $p->creator->id,
                'name' => $p->creator->name,
                'email' => $p->creator->email,
            ] : null,
            'created_at' => $p->created_at?->format('Y-m-d H:i:s'),
        ]);

        return Inertia::render('admin/products/index', [
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
        return Inertia::render('admin/products/create');
    }

    public function store(StoreProductRequest $request, CreateGlobalProductAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->file('thumbnail'));

        return to_route('admin.products.index')->with('success', 'Global product created successfully.');
    }

    public function show(Product $product): Response
    {
        $product->load(['creator:id,name,email', 'shopProducts.shop:id,name,slug,status']);

        return Inertia::render('admin/products/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'description' => $product->description,
                'base_price' => (float) $product->base_price,
                'thumbnail' => $product->thumbnailUrl(),
                'is_active' => (bool) $product->is_active,
                'assigned_shops_count' => $product->shopProducts->count(),
                'creator' => $product->creator ? [
                    'id' => $product->creator->id,
                    'name' => $product->creator->name,
                    'email' => $product->creator->email,
                ] : null,
                'assigned_shops' => $product->shopProducts->map(fn ($sp) => [
                    'id' => $sp->id,
                    'shop_id' => $sp->shop_id,
                    'shop_name' => $sp->shop?->name,
                    'shop_slug' => $sp->shop?->slug,
                    'shop_status' => $sp->shop?->status,
                    'price' => (float) $sp->price,
                    'custom_description' => $sp->description,
                    'custom_thumbnail' => $sp->customThumbnailUrl(),
                    'listing_status' => (bool) $sp->status,
                    'assigned_at' => $sp->created_at?->format('Y-m-d H:i:s'),
                ]),
                'created_at' => $product->created_at?->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    public function edit(Product $product): Response
    {
        $product->loadCount('shopProducts as assigned_shops_count');

        return Inertia::render('admin/products/edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'description' => $product->description,
                'base_price' => (float) $product->base_price,
                'thumbnail' => $product->thumbnailUrl(),
                'is_active' => (bool) $product->is_active,
                'assigned_shops_count' => (int) $product->assigned_shops_count,
            ],
        ]);
    }

    public function update(
        UpdateProductRequest $request,
        Product $product,
        UpdateGlobalProductAction $action
    ): RedirectResponse {
        $action->execute(
            $product,
            $request->validated(),
            $request->file('thumbnail'),
            (bool) $request->boolean('remove_thumbnail')
        );

        return to_route('admin.products.index')->with('success', 'Global product updated successfully.');
    }

    public function destroy(Product $product, DeleteGlobalProductAction $action): RedirectResponse
    {
        try {
            $action->execute($product);

            return to_route('admin.products.index')->with('success', 'Product deleted successfully.');
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->with('error', $e->getMessage());
        }
    }

    public function toggleStatus(Product $product, ChangeGlobalProductStatusAction $action): RedirectResponse
    {
        $action->execute($product);

        return back()->with('success', 'Product status updated.');
    }
}
