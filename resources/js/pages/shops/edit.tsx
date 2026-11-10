import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { pageContainer } from '@/lib/page-container';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Store, Upload } from 'lucide-react';
import { ChangeEvent, FormEventHandler, useState } from 'react';

interface UserOption {
    id: number;
    name: string;
    email: string;
}

interface ShopData {
    id: number;
    name: string;
    slug: string;
    status: string;
    user_id: number;
    logo: string | null;
}

interface ShopEditProps {
    shop: ShopData;
    users: UserOption[];
}

export default function ShopEdit({ shop, users }: ShopEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Shops', href: '/shops' },
        { title: `Edit ${shop.name}`, href: `/shops/${shop.id}/edit` },
    ];

    const [logoPreview, setLogoPreview] = useState<string | null>(shop.logo);

    const form = useForm<{
        _method: string;
        name: string;
        slug: string;
        user_id: string | number;
        status: string;
        logo: File | null;
    }>({
        _method: 'PUT',
        name: shop.name,
        slug: shop.slug,
        user_id: shop.user_id,
        status: shop.status,
        logo: null,
    });

    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(route('shops.update', shop.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${shop.name}`} />

            <div className={pageContainer.narrow}>
                <PageHeader
                    title="Edit Shop"
                    description={`Update details and settings for ${shop.name}.`}
                    actions={
                        <Link href={route('shops.index')}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Shops
                            </Button>
                        </Link>
                    }
                />

                <Card className="mt-6 border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Shop Details</CardTitle>
                        <CardDescription>
                            Configure logo, shop name, slug, owner, and operational status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Logo Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="logo">Shop Logo</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/50">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <Store className="h-6 w-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="logo"
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted"
                                        >
                                            <Upload className="h-3.5 w-3.5" />
                                            Change Logo
                                            <input
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleLogoChange}
                                            />
                                        </label>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            PNG, JPG, or WEBP up to 2MB.
                                        </p>
                                    </div>
                                </div>
                                {form.errors.logo && (
                                    <p className="text-xs text-destructive">{form.errors.logo}</p>
                                )}
                            </div>

                            {/* Shop Name */}
                            <FormInput
                                id="name"
                                label="Shop Name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                error={form.errors.name}
                                required
                            />

                            {/* Slug */}
                            <FormInput
                                id="slug"
                                label="Shop Slug (URL identifier)"
                                value={form.data.slug}
                                onChange={(e) => form.setData('slug', e.target.value)}
                                error={form.errors.slug}
                                required
                            />

                            {/* Owner */}
                            <FormSelect
                                id="user_id"
                                label="Shop Owner (User)"
                                value={form.data.user_id}
                                onChange={(val) => form.setData('user_id', val ? Number(val) : '')}
                                options={users.map((u) => ({
                                    value: String(u.id),
                                    label: `${u.name} (${u.email})`,
                                }))}
                                placeholder="Select an owner"
                                error={form.errors.user_id}
                                required
                            />

                            {/* Status */}
                            <FormSelect
                                id="status"
                                label="Shop Status"
                                value={form.data.status}
                                onChange={(val) => form.setData('status', val as string)}
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'inactive', label: 'Inactive' },
                                ]}
                                error={form.errors.status}
                                required
                            />

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                                <Link href={route('shops.index')}>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
