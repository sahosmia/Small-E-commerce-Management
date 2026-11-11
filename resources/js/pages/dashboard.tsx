import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('dashboard', 'title'), href: '/dashboard' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard', 'title')} />
        </AppLayout>
    );
}
