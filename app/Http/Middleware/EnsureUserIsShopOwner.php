<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsShopOwner
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isShopOwner()) {
            abort(403, 'Unauthorized. Shop Owner access required.');
        }

        if (! $user->is_active) {
            abort(403, 'Your account is currently inactive.');
        }

        if (! $user->shop || ! $user->shop->isActive()) {
            abort(403, 'Your shop is currently inactive.');
        }

        return $next($request);
    }
}
