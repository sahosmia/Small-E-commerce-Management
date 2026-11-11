import { Breadcrumbs } from '@/components/breadcrumbs';
import HeaderUserMenu from '@/components/header-user-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';


export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="border-brand-card-border bg-card sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b px-3 shadow-[0_1px_3px_rgb(16_24_40/0.06)] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:px-4 md:px-6 print:hidden">
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1 shrink-0" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
                <HeaderUserMenu />
            </div>
        </header>
    );
}
