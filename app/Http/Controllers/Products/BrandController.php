<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('products/brands/index');
    }

    public function store(Request $request)
    {
        return back();
    }

    public function update(Request $request, string $id)
    {
        return back();
    }

    public function destroy(string $id)
    {
        return back();
    }
}
