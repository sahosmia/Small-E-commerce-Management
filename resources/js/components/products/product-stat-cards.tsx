import StatCards, { type StatCardItem } from '@/components/shared/stat-cards';
import { useMoneyFormat } from '@/hooks/use-money-format';
import { AlertTriangle, Boxes, Coins, Package } from 'lucide-react';

export interface ProductStats {
    total_products: number;
    total_stock: number;
    total_stock_value: number;
    low_stock_count: number;
}

interface ProductStatCardsProps {
    stats: ProductStats;
}

export default function ProductStatCards({ stats }: ProductStatCardsProps) {
        const money = useMoneyFormat();

    const cards: StatCardItem[] = [
        {
            label: "Total Products",
            value: stats.total_products.toLocaleString(),
            icon: Package,
        },
        {
            label: "Total Stock",
            value: stats.total_stock.toLocaleString(),
            icon: Boxes,
        },
        {
            label: "Total Stock Value",
            value: money(stats.total_stock_value),
            icon: Coins,
            accent: 'info',
        },
        {
            label: "Low Stock Products",
            value: stats.low_stock_count.toLocaleString(),
            icon: AlertTriangle,
            accent: stats.low_stock_count > 0 ? 'warning' : 'neutral',
        },
    ];

    return <StatCards cards={cards} />;
}
