<?php

use App\Exceptions\AlreadyReversedException;
use App\Exceptions\AssetAlreadyDisposedException;
use App\Exceptions\ClosedPeriodException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\InvalidSerialSelectionException;
use App\Exceptions\ReturnQuantityExceedsRemainingException;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (NotFoundHttpException $e, $request) {
            if ($request->wantsJson()) {
                return null;
            }

            return Inertia::render('not-found')->toResponse($request)->setStatusCode(404);
        });

        $exceptions->render(function (
            InvalidSerialSelectionException|
            InsufficientStockException|
            ReturnQuantityExceedsRemainingException|
            AssetAlreadyDisposedException|
            ClosedPeriodException|
            AlreadyReversedException $e,
            $request
        ) {
            if ($request->wantsJson() && ! $request->header('X-Inertia')) {
                return response()->json(['message' => $e->getMessage()], 422);
            }

            return back()->withErrors(['error' => $e->getMessage()])->with('error', $e->getMessage());
        });
    })->create();
