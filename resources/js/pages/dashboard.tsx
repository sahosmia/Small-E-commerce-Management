import BestSellersPurchasesWidget from '@/components/dashboard/best-sellers-purchases-widget';
import { BooksCheckBanner } from '@/components/dashboard/books-check-banner';
import { FollowUpsWidget } from '@/components/dashboard/follow-ups-widget';
import { LowStockWidget } from '@/components/dashboard/low-stock-widget';
import RevenueExpenseChart from '@/components/dashboard/revenue-expense-chart';
import SalesChart from '@/components/dashboard/sales-chart';
import { SalesOrdersWidget } from '@/components/dashboard/sales-orders-widget';
import HeadingSmall from '@/components/heading-small';
import DateRangeFilter from '@/components/shared/date-range-filter';
import { MetricCard, MetricGrid } from '@/components/shared/metric-card';
import { PageSection } from '@/components/shared/page-section';
import { PanelCard } from '@/components/shared/panel-card';
import { useMoneyFormat } from '@/hooks/use-money-format';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    type BestSellersPeriodValue,
    type DashboardBalances,
    type DashboardBestSellerItem,
    type DashboardBooksCheck,
    type DashboardDailySalesPoint,
    type DashboardFollowUps,
    type DashboardLowStockProduct,
    type DashboardMetrics,
    type DashboardMonthlySalesPoint,
    type DashboardRange,
    type DashboardRecentTransactions,
    type DashboardRevenueExpensePoint,
    type DashboardSalesOrders,
} from '@/types/models';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowDownLeft,
    ArrowUpRight,
    CreditCard,
    HandCoins,
    Package,
    Receipt,
    RotateCcw,
    ShoppingBag,
    TrendingUp,
    Wallet,
} from 'lucide-react';

interface DashboardProps {
    range: DashboardRange;
    /** False for someone who may not read reports: the shop's money figures are then left out entirely. */
    showFigures: boolean;
    metrics: DashboardMetrics | null;
    balances: DashboardBalances | null;
    lowStockProducts: DashboardLowStockProduct[];
    followUps: DashboardFollowUps | null;
    salesOrders: DashboardSalesOrders | null;
    booksCheck: DashboardBooksCheck | null;
    salesLast30Days: DashboardDailySalesPoint[];
    salesCurrentFiscalYear: DashboardMonthlySalesPoint[];
    monthlyRevenueVsExpense: DashboardRevenueExpensePoint[];
    bestSellers: DashboardBestSellerItem[];
    recentTransactions: DashboardRecentTransactions;
    bestSellersPeriod: BestSellersPeriodValue;
}

/**
 * `2026-09-26` → `26 Sep 2026`
 */
function shortDayLabel(isoDate: string): string {
    const [year, month, day] = isoDate.split('-').map(Number);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${day} ${months[month - 1]} ${year}`;
}

export default function Dashboard() {
    const money = useMoneyFormat();
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('dashboard', 'title'), href: '/dashboard' }];

    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard', 'title')} />

          
        </AppLayout>
    );
}
