import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';

export default function OwnerProductCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        slug: '',
        base_price: '',
        description: '',
        thumbnail: null as File | null,
        // Shop-specific initial values
        shop_price: '',
        shop_description: '',
        shop_thumbnail: null as File | null,
        status: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('owner.products.store'));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'My Products', href: route('owner.products.index') },
            { title: 'Create', href: route('owner.products.create') },
        ]}>
            <Head title="Create New Product - My Shop" />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('owner.products.index')}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create & Assign Product</h1>
                        <p className="text-muted-foreground text-sm">
                            Creates a global product and immediately assigns it to your shop inventory.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="space-y-4">
                        <div className="border-b pb-3 font-semibold text-foreground">1. Global Product Information</div>

                        <div>
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Mechanical Keyboard"
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="sku">SKU *</Label>
                                <Input
                                    id="sku"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    placeholder="e.g. KB-101"
                                    required
                                />
                                {errors.sku && <p className="mt-1 text-xs text-destructive">{errors.sku}</p>}
                            </div>

                            <div>
                                <Label htmlFor="base_price">Global Base Price (৳) *</Label>
                                <Input
                                    id="base_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.base_price}
                                    onChange={(e) => setData('base_price', e.target.value)}
                                    placeholder="0.00"
                                    required
                                />
                                {errors.base_price && <p className="mt-1 text-xs text-destructive">{errors.base_price}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Global Description</Label>
                            <Textarea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Product specification..."
                            />
                            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
                        </div>

                        <div>
                            <Label htmlFor="thumbnail">Global Image</Label>
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('thumbnail', e.target.files?.[0] || null)}
                            />
                            {errors.thumbnail && <p className="mt-1 text-xs text-destructive">{errors.thumbnail}</p>}
                        </div>

                        <div className="border-b pb-3 pt-4 font-semibold text-foreground">
                            2. My Shop Initial Settings (Optional Overrides)
                        </div>

                        <div>
                            <Label htmlFor="shop_price">My Shop Price (৳) (Defaults to Base Price if blank)</Label>
                            <Input
                                id="shop_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.shop_price}
                                onChange={(e) => setData('shop_price', e.target.value)}
                                placeholder="Leave blank to use base price"
                            />
                            {errors.shop_price && <p className="mt-1 text-xs text-destructive">{errors.shop_price}</p>}
                        </div>

                        <div>
                            <Label htmlFor="shop_description">Custom Shop Description</Label>
                            <Textarea
                                id="shop_description"
                                rows={3}
                                value={data.shop_description}
                                onChange={(e) => setData('shop_description', e.target.value)}
                                placeholder="Leave blank to inherit global description"
                            />
                            {errors.shop_description && <p className="mt-1 text-xs text-destructive">{errors.shop_description}</p>}
                        </div>

                        <div>
                            <Label htmlFor="shop_thumbnail">Custom Shop Image</Label>
                            <Input
                                id="shop_thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('shop_thumbnail', e.target.files?.[0] || null)}
                            />
                            {errors.shop_thumbnail && <p className="mt-1 text-xs text-destructive">{errors.shop_thumbnail}</p>}
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <div className="font-medium text-sm">Shop Listing Active</div>
                                <div className="text-muted-foreground text-xs">
                                    When disabled, this product won't be visible in your storefront.
                                </div>
                            </div>
                            <Switch
                                checked={data.status}
                                onCheckedChange={(val) => setData('status', val)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t pt-4">
                        <Button variant="outline" asChild>
                            <Link href={route('owner.products.index')}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" />
                            {processing ? 'Creating...' : 'Create & Assign to Shop'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
