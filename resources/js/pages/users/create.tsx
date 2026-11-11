import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { pageContainer } from '@/lib/page-container';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function UserCreate() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/users' },
        { title: 'Create Shop Owner', href: '/users/create' },
    ];

    const form = useForm({
        name: '',
        email: '',
        username: '',
        password: '',
        role: 2, // Default to Shop Owner
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(route('users.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Shop Owner" />

            <div className={pageContainer.narrow}>
                <PageHeader
                    title="Create Shop Owner"
                    description="Fill in the information below to create a new shop owner account in the system."
                    actions={
                        <Link href={route('users.index')}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Users
                            </Button>
                        </Link>
                    }
                />

                <Card className="mt-6 border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Account Details</CardTitle>
                        <CardDescription>
                            Configure name, email, credentials, role, and initial account status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Full Name */}
                            <FormInput
                                id="name"
                                label="Full Name"
                                placeholder="e.g. Rahim Ahmed"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                error={form.errors.name}
                                required
                            />

                            {/* Email */}
                            <FormInput
                                id="email"
                                label="Email Address"
                                type="email"
                                placeholder="e.g. rahim@example.com"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                error={form.errors.email}
                                required
                            />

                            {/* Username */}
                            <FormInput
                                id="username"
                                label="Username"
                                placeholder="e.g. rahim.ahmed"
                                value={form.data.username}
                                onChange={(e) => form.setData('username', e.target.value)}
                                error={form.errors.username}
                                required
                            />

                            {/* Password */}
                            <FormInput
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Enter secure password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                error={form.errors.password}
                                required
                            />

                            {/* Role */}
                            <FormSelect
                                id="role"
                                label="User Role"
                                value={String(form.data.role)}
                                onChange={(val) => form.setData('role', Number(val))}
                                options={[
                                    { value: '2', label: 'Shop Owner' },
                                    { value: '1', label: 'Admin' },
                                ]}
                                error={form.errors.role}
                                required
                            />

                            {/* Status */}
                            <FormSelect
                                id="is_active"
                                label="Account Status"
                                value={form.data.is_active ? '1' : '0'}
                                onChange={(val) => form.setData('is_active', val === '1')}
                                options={[
                                    { value: '1', label: 'Active' },
                                    { value: '0', label: 'Inactive' },
                                ]}
                                error={form.errors.is_active}
                                required
                            />

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                                <Link href={route('users.index')}>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? 'Creating...' : 'Create Account'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
