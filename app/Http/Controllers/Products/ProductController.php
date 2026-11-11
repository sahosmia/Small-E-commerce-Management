<?php

namespace App\Http\Controllers\Products;

use App\Actions\Products\Product\CreateProductAction;
use App\Actions\Products\Product\DeleteProductAction;
use App\Actions\Products\Product\UpdateProductAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\BulkDestroyRequest;
use App\Http\Requests\Products\Product\ProductIndexRequest;
use App\Http\Requests\Products\Product\StoreProductRequest;
use App\Http\Requests\Products\Product\UpdateProductRequest;
use App\Http\Resources\Product\ProductFormResource;
use App\Http\Resources\Product\ProductListResource;
use App\Models\Product;
use App\Support\BulkDelete;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(ProductIndexRequest $request): Response
    {
        $filters = $request->validated();
        $query = Product::query();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        if (isset($filters['stock_status'])) {
            if ($filters['stock_status'] === 'out_of_stock') {
                $query->where('current_stock', '<=', 0);
            } elseif ($filters['stock_status'] === 'low_stock') {
                $query->where('current_stock', '>', 0)
                    ->whereColumn('current_stock', '<=', 'minimum_stock_level');
            } elseif ($filters['stock_status'] === 'in_stock') {
                $query->whereColumn('current_stock', '>', 'minimum_stock_level');
            }
        }

        $sort = $filters['sort'] ?? 'name';
        $direction = $filters['direction'] ?? 'asc';
        $query->orderBy($sort, $direction);

        $perPage = ! empty($filters['per_page']) && is_numeric($filters['per_page']) ? (int) $filters['per_page'] : 15;
        $products = $query->paginate($perPage)->withQueryString();
        $products->through(fn (Product $product) => ProductListResource::make($product)->resolve());

        $rawStats = Product::query()
            ->select(DB::raw('
                COUNT(*) as total_products,
                COALESCE(SUM(CASE WHEN manage_stock = 1 THEN current_stock ELSE 0 END), 0) as total_stock,
                COALESCE(SUM(CASE WHEN manage_stock = 1 THEN current_stock * avg_cost ELSE 0 END), 0) as total_stock_value,
                COUNT(CASE WHEN manage_stock = 1 AND current_stock <= minimum_stock_level THEN 1 END) as low_stock_count
            '))
            ->first();

        $stats = [
            'total_products' => (int) ($rawStats->total_products ?? 0),
            'total_stock' => (float) ($rawStats->total_stock ?? 0),
            'total_stock_value' => (float) ($rawStats->total_stock_value ?? 0),
            'low_stock_count' => (int) ($rawStats->low_stock_count ?? 0),
        ];

        return Inertia::render('products/index', [
            'products' => $products,
            'stats' => $stats,
            'filters' => [
                ...$filters,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('products/create');
    }

    public function store(StoreProductRequest $request, CreateProductAction $createProduct): RedirectResponse
    {
        $createProduct->execute($request->validated(), $request->file('image'));

        return to_route('products.index');
    }

    public function show(Product $product): Response
    {
        return Inertia::render('products/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'barcode' => $product->barcode,
                'avg_cost' => $product->avg_cost,
                'selling_price' => $product->selling_price,
                'current_stock' => $product->current_stock,
                'minimum_stock_level' => $product->minimum_stock_level,
                'stock_status' => $product->stock_status,
                'profit_margin' => $product->profit_margin,
                'manage_stock' => $product->manage_stock,
                'is_for_sale' => $product->is_for_sale,
                'is_active' => $product->is_active,
                'image_url' => $product->imageUrl(),
            ],
        ]);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('products/edit', [
            'product' => ProductFormResource::make($product)->resolve(),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product, UpdateProductAction $updateProduct): RedirectResponse
    {
        $updateProduct->execute($product, $request->validated(), $request->file('image'));

        return to_route('products.index');
    }

    public function destroy(Product $product, DeleteProductAction $deleteProduct): RedirectResponse
    {
        $deleteProduct->execute($product);

        return to_route('products.index');
    }

    public function bulkDestroy(BulkDestroyRequest $request, DeleteProductAction $deleteProduct): RedirectResponse
    {
        return BulkDelete::respond(BulkDelete::run(
            $request->validated('ids'),
            Product::query()->whereIn('id', $request->validated('ids'))->get(),
            fn (Product $product) => $deleteProduct->blockingReason($product),
            fn (Product $product) => $deleteProduct->execute($product),
        ));
    }
}
