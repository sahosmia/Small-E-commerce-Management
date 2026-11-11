<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ThemeColorController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'theme_color' => ['required', 'string'],
        ]);

        session()->put('theme_color', $validated['theme_color']);

        return back();
    }
}
