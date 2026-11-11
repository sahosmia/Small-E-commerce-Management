import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Trash, Lock } from 'lucide-react';

interface Props {
    shopProduct: {
        id: number;
        shop_id: number;
        product_id: number;
        name: string;
        sku: string;
        global_base_price: number;
        global_description: string | null;
        global_thumbnail: string | null;
        global_status: boolean;
        price: number;
        description: string | null;
        custom_thumbnail: string | null;
        status: boolean;
    };
}

export default function OwnerProductEdit({ shopProduct }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        price: shopProduct.price.toString(),
        description: shopProduct.description || '',
        thumbnail: null as File | null,
        remove_thumbnail: false,
        status: shopProduct.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('owner.products.update', shopProduct.id));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'My Products', href: route('owner.products.index') },
            { title: `Edit ${shopProduct.name}`, href: route('owner.products.edit', shopProduct.id) },
        ]}>
            <Head title={`Edit ${shopProduct.name} - My Shop`} />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('owner.products.index')}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Shop Product</h1>
                        <p className="text-muted-foreground text-sm">
                            Global product information is locked. You can customize your shop's price, description, and photo.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
                    {/* Read-only Global Info Card */}
                    <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <Lock className="size-3.5" />
                            Global Product Information (Read-Only)
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <span className="text-xs text-muted-foreground">Product Name</span>
                                <div className="font-semibold text-sm">{shopProduct.name}</div>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">Global SKU</span>
                                <div className="font-mono text-sm">{shopProduct.sku}</div>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">Global Base Price</span>
                                <div className="font-semibold text-sm">৳{shopProduct.global_base_price.toLocaleString()}</div>
                            </div>
                        </div>

                        {shopProduct.global_thumbnail && (
                            <div className="pt-2">
                                <span className="text-xs text-muted-foreground block mb-1">Global Default Image</span>
                                <img
                                    src={shopProduct.global_thumbnail}
                                    alt={shopProduct.name}
                                    className="size-16 rounded border object-cover"
                                />
                            </div>
                        )}

                        {shopProduct.global_description && (
                            <div className="pt-1">
                                <span className="text-xs text-muted-foreground block mb-0.5">Global Description Preview</span>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {shopProduct.global_description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Editable Shop Fields */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="price">My Shop Price (৳) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                required
                            />
                            {errors.price && <p className="mt-1 text-xs text-destructive">{errors.price}</p>}
                        </div>

                        <div>
                            <Label htmlFor="description">Custom Shop Description</Label>
                            <Textarea
                                id="description"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Leave blank to inherit the global description automatically..."
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                If empty, the global description will be displayed to your customers.
                            </p>
                            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
                        </div>

                        <div>
                            <Label>Custom Shop Thumbnail</Label>
                            {shopProduct.custom_thumbnail && !data.remove_thumbnail && (
                                <div className="mb-3 flex items-center gap-3">
                                    <img
                                        src={shopProduct.custom_thumbnail}
                                        alt={shopProduct.name}
                                        className="size-16 rounded-lg object-cover border"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => setData('remove_thumbnail', true)}
                                    >
                                        <Trash className="mr-1 size-3" />
                                        Remove Custom Image (Revert to Global)
                                    </Button>
                                </div>
                            )}
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('thumbnail', e.target.files?.[0] || null)}
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                Upload to override the global image for your shop only.
                            </p>
                            {errors.thumbnail && <p className="mt-1 text-xs text-destructive">{errors.thumbnail}</p>}
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <div className="font-medium text-sm">Shop Listing Active</div>
                                <div className="text-muted-foreground text-xs">
                                    Control whether customers can view and purchase this item in your shop.
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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
