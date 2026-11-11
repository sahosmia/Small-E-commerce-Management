import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Plus } from 'lucide-react';

interface Props {
    product: {
        id: number;
        name: string;
        slug: string;
        sku: string;
        description: string | null;
        base_price: number;
        thumbnail: string | null;
        is_active: boolean;
        is_assigned: boolean;
    };
}

export default function OwnerCatalogShow({ product }: Props) {
    const [adding, setAdding] = useState(false);

    const handleAdd = () => {
        setAdding(true);
        router.post(
            route('owner.catalog.add', product.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setAdding(false),
            }
        );
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Shared Catalog', href: route('owner.catalog.index') },
            { title: product.name, href: route('owner.catalog.show', product.id) },
        ]}>
            <Head title={`${product.name} - Catalog Product`} />

            <div className="mx-auto max-w-4xl space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('owner.catalog.index')}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
                        <p className="text-muted-foreground text-xs font-mono">{product.sku}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 rounded-xl border bg-card p-6 shadow-sm">
                    <div>
                        {product.thumbnail ? (
                            <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="aspect-square w-full rounded-xl object-cover border"
                            />
                        ) : (
                            <div className="flex aspect-square w-full items-center justify-center rounded-xl border bg-muted text-muted-foreground">
                                No Global Image
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-muted-foreground">Global Base Price:</span>
                                <div className="text-3xl font-extrabold text-foreground">
                                    ৳{product.base_price.toLocaleString()}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    This will be your initial shop price. You can customize the price once added.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold mb-1">Global Description</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                    {product.description || 'No description available for this product.'}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            {product.is_assigned ? (
                                <div className="flex items-center gap-3">
                                    <Badge variant="default" className="bg-emerald-600 gap-1 text-sm py-1.5 px-3">
                                        <Check className="size-4" />
                                        Already Added to Your Shop
                                    </Badge>
                                    <Button variant="outline" asChild>
                                        <Link href={route('owner.products.index')}>Go to My Products</Link>
                                    </Button>
                                </div>
                            ) : (
                                <Button size="lg" onClick={handleAdd} disabled={adding} className="w-full">
                                    <Plus className="mr-2 size-5" />
                                    {adding ? 'Adding...' : 'Add to My Shop'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
