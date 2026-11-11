import { ProductImage } from '@/components/products/product-image';
import ProductStatusBadge from '@/components/products/product-status-badge';
import { MetricCard } from '@/components/shared/metric-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMoneyFormat } from '@/hooks/use-money-format';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    CircleDollarSign,
    Package,
    Pencil,
    Percent,
    Tag,
    Warehouse,
} from 'lucide-react';

interface ProductShowProps {
    product: {
        id: number;
        name: string;
        sku: string;
        category: { id: number; name: string } | null;
        brand: { id: number; name: string } | null;
        unit: { id: number; name: string };
        avg_cost: number;
        selling_price: number;
        profit_margin: number;
        warranty_period_months: number | null;
        has_installation_service: boolean;
        track_serial_number: boolean;
        is_for_sale: boolean;
        is_active: boolean;
        image_url: string | null;
    };
}

/** Small info row used in the product info list. */
function InfoRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-3 border-b py-2 last:border-b-0">
            <span className="text-muted-foreground text-xs">{label}</span>
            <span className={cn('text-sm font-medium', mono && 'tabular-nums')}>{value}</span>
        </div>
    );
}

export default function ProductShow({ product }: ProductShowProps) {
    const money = useMoneyFormat();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Products", href: route('products.index') },
        { title: product.name, href: route('products.show', product.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="space-y-6 px-4 py-6">
                {/* ───────────── Product header card ───────────── */}
                <Card className="overflow-hidden shadow-xs">
                    <CardContent className="p-0">
                        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <ProductImage
                                    src={product.image_url}
                                    alt={product.name}
                                    className="size-16 shrink-0 rounded-xl border object-cover shadow-xs"
                                />
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-xl font-semibold tracking-tight">{product.name}</h1>
                                        <ProductStatusBadge product={product} />
                                    </div>
                                    <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Tag className="size-3.5" />
                                            <span className="font-mono text-xs">{product.sku}</span>
                                        </span>
                                        {product.category && (
                                            <span className="flex items-center gap-1">
                                                <Package className="size-3.5" />
                                                {product.category.name}
                                            </span>
                                        )}
                                        {product.brand && (
                                            <span className="flex items-center gap-1">
                                                <Warehouse className="size-3.5" />
                                                {product.brand.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Feature badges */}
                                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                                        {product.has_installation_service && (
                                            <Badge
                                                variant="outline"
                                                className="border-violet-500/30 bg-violet-500/5 text-violet-600 dark:text-violet-400"
                                            >
                                                Installation
                                            </Badge>
                                        )}
                                        {product.track_serial_number && (
                                            <Badge variant="outline" className="border-sky-500/30 bg-sky-500/5 text-sky-600 dark:text-sky-400">
                                                Serial tracking
                                            </Badge>
                                        )}
                                        {product.warranty_period_months && (
                                            <Badge
                                                variant="outline"
                                                className="border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                                            >
                                                {product.warranty_period_months}m warranty
                                            </Badge>
                                        )}
                                        {!product.is_active && (
                                            <Badge variant="outline" className="text-muted-foreground">
                                                Inactive
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                                <Button asChild className="gap-1.5">
                                    <Link href={route('products.edit', product.id)}>
                                        <Pencil className="size-4" />
                                        Edit Product
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ───────────── Metrics grid ───────────── */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <MetricCard icon={CircleDollarSign} label="Average Unit Cost" value={money(product.avg_cost)} accent="warning" />
                    <MetricCard icon={Tag} label="Selling Price" value={money(product.selling_price)} accent="success" />
                    <MetricCard icon={Percent} label="Profit Margin" value={`${product.profit_margin.toFixed(1)}%`} accent="financial" />
                </div>

                {/* ───────────── Product details ───────────── */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="shadow-xs">
                        <CardHeader divided className="bg-muted/30 border-b px-4 py-3">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                <Package className="text-muted-foreground size-4" />
                                Product Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 py-2">
                            <InfoRow label="SKU" value={product.sku} mono />
                            <InfoRow label="Unit" value={product.unit.name} />
                            <InfoRow label="Category" value={product.category?.name ?? '—'} />
                            <InfoRow label="Brand" value={product.brand?.name ?? '—'} />
                            <InfoRow label="For sale" value={product.is_for_sale ? 'Yes' : 'No'} />
                            <InfoRow label="Active" value={product.is_active ? 'Yes' : 'No'} />
                            <InfoRow label="Warranty" value={product.warranty_period_months ? `${product.warranty_period_months} months` : '—'} />
                            <InfoRow label="Installation" value={product.has_installation_service ? 'Available' : '—'} />
                            <InfoRow label="Serial tracking" value={product.track_serial_number ? 'Enabled' : '—'} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
