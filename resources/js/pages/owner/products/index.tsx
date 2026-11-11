import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import { Plus, Search, Pencil, Trash2, Globe, ShieldAlert } from 'lucide-react';

interface ShopProductItem {
    id: number;
    shop_id: number;
    product_id: number;
    name: string;
    sku: string;
    global_base_price: number;
    shop_price: number;
    global_status: boolean;
    listing_status: boolean;
    effective_thumbnail: string | null;
    custom_thumbnail: string | null;
    has_custom_description: boolean;
    has_custom_thumbnail: boolean;
    created_at: string;
}

interface Props {
    products: {
        data: ShopProductItem[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function OwnerProductsIndex({ products, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [itemToRemove, setItemToRemove] = useState<ShopProductItem | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('owner.products.index'), { search, status: filters.status }, { preserveState: true });
    };

    const confirmRemove = () => {
        if (!itemToRemove) return;
        router.delete(route('owner.products.destroy', itemToRemove.id), {
            onSuccess: () => setItemToRemove(null),
        });
    };

    const toggleStatus = (item: ShopProductItem) => {
        router.patch(route('owner.products.toggle-status', item.id), {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'My Products', href: route('owner.products.index') }]}>
            <Head title="My Shop Products" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Shop Products</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage your shop's active inventory, customized prices, and local descriptions.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('owner.catalog.index')}>
                                <Globe className="mr-2 size-4" />
                                Browse Catalog
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('owner.products.create')}>
                                <Plus className="mr-2 size-4" />
                                Create New Product
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center gap-2">
                        <Input
                            placeholder="Search my products by name or SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button type="submit" variant="secondary" size="icon">
                            <Search className="size-4" />
                        </Button>
                    </form>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={!filters.status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => router.get(route('owner.products.index'), { search }, { preserveState: true })}
                        >
                            All
                        </Button>
                        <Button
                            variant={filters.status === 'active' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => router.get(route('owner.products.index'), { search, status: 'active' }, { preserveState: true })}
                        >
                            Active
                        </Button>
                        <Button
                            variant={filters.status === '0' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => router.get(route('owner.products.index'), { search, status: '0' }, { preserveState: true })}
                        >
                            Inactive
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">SKU</th>
                                    <th className="px-4 py-3">My Shop Price</th>
                                    <th className="px-4 py-3">Overrides</th>
                                    <th className="px-4 py-3">Global Status</th>
                                    <th className="px-4 py-3">Listing Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                            No products found in your shop.
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {item.effective_thumbnail ? (
                                                        <img
                                                            src={item.effective_thumbnail}
                                                            alt={item.name}
                                                            className="size-10 rounded-md object-cover border"
                                                        />
                                                    ) : (
                                                        <div className="flex size-10 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                                                            N/A
                                                        </div>
                                                    )}
                                                    <div className="font-medium text-foreground">{item.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">{item.sku}</td>
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                ৳{item.shop_price.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1 text-[11px]">
                                                    {item.has_custom_thumbnail && (
                                                        <Badge variant="outline" className="w-fit">Custom Image</Badge>
                                                    )}
                                                    {item.has_custom_description && (
                                                        <Badge variant="outline" className="w-fit">Custom Desc</Badge>
                                                    )}
                                                    {!item.has_custom_thumbnail && !item.has_custom_description && (
                                                        <span className="text-muted-foreground">Standard</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.global_status ? (
                                                    <Badge variant="default" className="bg-emerald-600 text-xs">
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                                                        <ShieldAlert className="size-3.5" />
                                                        Inactive (Hidden)
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => toggleStatus(item)}
                                                    className="focus:outline-none"
                                                    title="Click to toggle shop listing status"
                                                >
                                                    {item.listing_status ? (
                                                        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Inactive</Badge>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild title="Edit My Shop Details">
                                                        <Link href={route('owner.products.edit', item.id)}>
                                                            <Pencil className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setItemToRemove(item)}
                                                        className="text-destructive hover:bg-destructive/10"
                                                        title="Remove from shop"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Remove Confirmation */}
            <ConfirmDialog
                open={itemToRemove !== null}
                onOpenChange={(open) => !open && setItemToRemove(null)}
                title="Remove Product from Shop?"
                description={`Are you sure you want to remove "${itemToRemove?.name}" from your shop? Only your shop assignment will be removed; other shops and the global catalog will remain unchanged.`}
                confirmLabel="Remove"
                onConfirm={confirmRemove}
            />
        </AppLayout>
    );
}
