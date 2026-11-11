<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class StockAdjustmentController extends Controller
{
    public function serials(Product $product)
    {
        return response()->json([]);
    }

    public function store(Request $request, Product $product)
    {
        return back();
    }
}
