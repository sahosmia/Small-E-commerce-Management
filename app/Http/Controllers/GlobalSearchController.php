<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Expense;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    /**
     * Cmd+K command palette — Product/Contact/Sale/Purchase/Expense at once,
     * capped at 5 per module so the palette stays scannable.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:1', 'max:255'],
        ]);

        $search = $validated['q'];

        $user = $request->user();

        $products = collect();
        if ($user->can('product.view')) {
            $products = Product::query()
                ->where(function (Builder $query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                })
                ->orderBy('name')
                ->limit(5)
                ->get(['id', 'name', 'sku', 'base_price']);
        }

        return response()->json([
            // Products/Expenses have no dedicated "show" page (Phase 6/11 kept
            // them list+modal/edit only) — link to the closest equivalent.
            'products' => $products->map(fn (Product $product) => [
                'id' => $product->id,
                'title' => $product->name,
                'subtitle' => $product->sku,
                'amount' => $product->selling_price,
                'url' => route('products.edit', $product),
            ]),

        ]);
    }
}
