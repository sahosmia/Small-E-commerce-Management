<?php

namespace App\Http\Controllers;

use App\Console\Commands\CheckReconciliation;
use App\Enums\ContactType;
use App\Enums\PurchaseStatus;
use App\Enums\SaleStatus;
use App\Models\ChartOfAccount;
use App\Models\Contact;
use App\Models\Expense;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SaleReturn;
use App\Models\Settings;
use App\Queries\Dashboard\FollowUps;
use App\Queries\Dashboard\OpenSalesOrders;
use App\Support\FiscalYear;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
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
