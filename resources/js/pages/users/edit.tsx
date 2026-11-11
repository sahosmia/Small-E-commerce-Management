import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import PageHeader from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { pageContainer } from '@/lib/page-container';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, Store, XCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    username: string | null;
    role: number;
    role_label: string;
    is_active: boolean;
}

interface UserEditProps {
    user: UserData;
}

export default function UserEdit({ user }: UserEditProps) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 1;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/users' },
        { title: `Edit ${user.name}`, href: `/users/${user.id}/edit` },
    ];

    const form = useForm({
        _method: 'PUT',
        name: user.name,
        email: user.email,
        username: user.username || '',
        password: '',
        role: user.role,
        is_active: user.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // If not admin, omit role and is_active from submission to prevent modifications
        if (!isAdmin) {
            form.transform((data) => ({
                _method: 'PUT',
                name: data.name,
                email: data.email,
                username: data.username,
                password: data.password,
            }));
        }

        form.post(route('users.update', user.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name}`} />

            <div className={pageContainer.narrow}>
                <PageHeader
                    title="Edit User"
                    description={`Update profile details and credentials for ${user.name}.`}
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
                        <CardTitle className="text-lg">Profile Information</CardTitle>
                        <CardDescription>
                            {isAdmin
                                ? 'Configure user credentials, system role, and active status.'
                                : 'Update your personal name, email, username, and login password.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Full Name */}
                            <FormInput
                                id="name"
                                label="Full Name"
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
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                error={form.errors.email}
                                required
                            />

                            {/* Username */}
                            <FormInput
                                id="username"
                                label="Username"
                                value={form.data.username}
                                onChange={(e) => form.setData('username', e.target.value)}
                                error={form.errors.username}
                                required
                            />

                            {/* Password */}
                            <FormInput
                                id="password"
                                label="Password (leave blank to keep unchanged)"
                                type="password"
                                placeholder="Enter new password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                error={form.errors.password}
                            />

                            {/* Role Selection or Read-Only Badge */}
                            {isAdmin ? (
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
                            ) : (
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1.5 text-muted-foreground">
                                        <Lock className="h-3.5 w-3.5" />
                                        User Role (Locked)
                                    </Label>
                                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
                                        {user.role === 1 ? (
                                            <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30 flex w-fit items-center gap-1 font-medium">
                                                <ShieldCheck className="h-3 w-3" />
                                                Admin
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 flex w-fit items-center gap-1 font-medium">
                                                <Store className="h-3 w-3" />
                                                Shop Owner
                                            </Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            Shop owners cannot change their own role. Only administrators can modify roles.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Status Selection or Read-Only Badge */}
                            {isAdmin ? (
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
                            ) : (
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1.5 text-muted-foreground">
                                        <Lock className="h-3.5 w-3.5" />
                                        Account Status (Locked)
                                    </Label>
                                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
                                        {user.is_active ? (
                                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 flex w-fit items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 flex w-fit items-center gap-1">
                                                <XCircle className="h-3 w-3" />
                                                Inactive
                                            </Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            Shop owners cannot change status. Only administrators can modify account status.
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                                <Link href={route('users.index')}>
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
