<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Quick Actions + date-filtered analytics grid.
 */
class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {

        return Inertia::render('dashboard');
    }
}
