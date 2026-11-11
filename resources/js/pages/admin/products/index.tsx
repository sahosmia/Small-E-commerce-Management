import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import { Plus, Search, Eye, Pencil, Trash2, Store, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Creator {
    id: number;
    name: string;
    email: string;
}

interface ProductItem {
    id: number;
    name: string;
    slug: string;
    sku: string;
    base_price: number;
    thumbnail: string | null;
    is_active: boolean;
    assigned_shops_count: number;
    creator: Creator | null;
    created_at: string;
}

interface Props {
    products: {
        data: ProductItem[];
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

export default function AdminProductsIndex({ products, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
    const [blockedProduct, setBlockedProduct] = useState<ProductItem | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.products.index'), { search, status: filters.status }, { preserveState: true });
    };

    const handleDeleteClick = (product: ProductItem) => {
        if (product.assigned_shops_count > 0) {
            setBlockedProduct(product);
        } else {
            setProductToDelete(product);
        }
    };

    const confirmDelete = () => {
        if (!productToDelete) return;
        router.delete(route('admin.products.destroy', productToDelete.id), {
            onSuccess: () => setProductToDelete(null),
        });
    };

    const toggleStatus = (product: ProductItem) => {
        router.patch(route('admin.products.toggle-status', product.id), {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Products', href: route('admin.products.index') }]}>
            <Head title="Global Products - Admin" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Global Product Catalog</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage system-wide shared products and monitor shop assignments.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={route('admin.products.create')}>
                            <Plus className="mr-2 size-4" />
                            Create Global Product
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center gap-2">
                        <Input
                            placeholder="Search by name or SKU..."
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
                            onClick={() => router.get(route('admin.products.index'), { search }, { preserveState: true })}
                        >
                            All
                        </Button>
                        <Button
                            variant={filters.status === 'active' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => router.get(route('admin.products.index'), { search, status: 'active' }, { preserveState: true })}
                        >
                            Active
                        </Button>
                        <Button
                            variant={filters.status === '0' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => router.get(route('admin.products.index'), { search, status: '0' }, { preserveState: true })}
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
                                    <th className="px-4 py-3">Base Price</th>
                                    <th className="px-4 py-3">Creator</th>
                                    <th className="px-4 py-3">Assigned Shops</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                            No global products found.
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((product) => (
                                        <tr key={product.id} className="hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {product.thumbnail ? (
                                                        <img
                                                            src={product.thumbnail}
                                                            alt={product.name}
                                                            className="size-10 rounded-md object-cover border"
                                                        />
                                                    ) : (
                                                        <div className="flex size-10 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                                                            N/A
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-foreground">{product.name}</div>
                                                        <div className="text-xs text-muted-foreground">{product.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                                            <td className="px-4 py-3 font-medium">৳{product.base_price.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-xs">
                                                {product.creator ? (
                                                    <div>
                                                        <div className="font-medium">{product.creator.name}</div>
                                                        <div className="text-muted-foreground">{product.creator.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={product.assigned_shops_count > 0 ? 'secondary' : 'outline'} className="gap-1">
                                                    <Store className="size-3" />
                                                    {product.assigned_shops_count} Shops
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => toggleStatus(product)}
                                                    className="flex items-center gap-1.5 focus:outline-none"
                                                    title="Click to toggle status"
                                                >
                                                    {product.is_active ? (
                                                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-muted-foreground">
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild title="View Details">
                                                        <Link href={route('admin.products.show', product.id)}>
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild title="Edit Product">
                                                        <Link href={route('admin.products.edit', product.id)}>
                                                            <Pencil className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(product)}
                                                        className="text-destructive hover:bg-destructive/10"
                                                        title="Delete Product"
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

            {/* Allowed Delete Confirmation */}
            <ConfirmDialog
                open={productToDelete !== null}
                onOpenChange={(open) => !open && setProductToDelete(null)}
                title="Delete Global Product?"
                description={`Are you sure you want to delete "${productToDelete?.name}"? Since it is not assigned to any shop, it can be deleted.`}
                confirmLabel="Delete"
                onConfirm={confirmDelete}
            />

            {/* Blocked Delete Dialog */}
            <Dialog open={blockedProduct !== null} onOpenChange={(open) => !open && setBlockedProduct(null)}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="size-5" />
                            <DialogTitle>Product Cannot Be Deleted</DialogTitle>
                        </div>
                        <DialogDescription className="pt-2 text-sm">
                            এই Product বর্তমানে {blockedProduct?.assigned_shops_count}টি Shop-এ Assigned রয়েছে।
                            <br />
                            Product Delete করা সম্ভব নয়। আপনি চাইলে Product Inactive করতে পারেন।
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                if (blockedProduct) {
                                    toggleStatus(blockedProduct);
                                    setBlockedProduct(null);
                                }
                            }}
                        >
                            {blockedProduct?.is_active ? 'Deactivate Product' : 'Activate Product'}
                        </Button>
                        <Button variant="outline" onClick={() => setBlockedProduct(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
