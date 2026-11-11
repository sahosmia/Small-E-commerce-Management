<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AppearanceController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'appearance' => ['required', 'string', 'in:light,dark,system'],
        ]);

        session()->put('appearance', $validated['appearance']);

        return back();
    }
}
