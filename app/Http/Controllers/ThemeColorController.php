<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ThemeColorController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'theme_color' => ['nullable', 'string'],
        ]);

        $request->user()?->update(['theme_color' => $validated['theme_color']]);

        return back();
    }
}
