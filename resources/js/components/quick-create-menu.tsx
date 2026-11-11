import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { router, usePage } from '@inertiajs/react';
import { type LucideIcon, Package, Plus } from 'lucide-react';
import { type SharedData } from '@/types';

interface QuickCreateItem {
    label: string;
    icon: LucideIcon;
    href: string;
}

interface QuickCreateGroup {
    heading: string;
    items: QuickCreateItem[];
}

function buildGroups(isAdmin: boolean): QuickCreateGroup[] {
    return [
        {
            heading: 'Catalog',
            items: [
                {
                    label: isAdmin ? 'New Global Product' : 'Add New Product',
                    icon: Package,
                    href: isAdmin ? route('admin.products.create') : route('owner.products.create'),
                },
            ],
        },
    ];
}

/**
 * A global "+ Quick Create" menu in the header, reachable from anywhere in
 * the app instead of only from each resource's own list page.
 */
export default function QuickCreateMenu() {
    const { auth } = usePage<SharedData>().props;
    const roleVal = auth?.user?.role;
    const isAdmin = roleVal === 1 || (typeof roleVal === 'object' && roleVal !== null && 'value' in roleVal && (roleVal as { value: number }).value === 1);
    const groups = buildGroups(isAdmin);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Plus className="size-5" />
                    <span className="sr-only">Quick Create</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                {groups.map((group, index) => (
                    <DropdownMenuGroup key={group.heading}>
                        {index > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuLabel>{group.heading}</DropdownMenuLabel>
                        {group.items.map((item) => (
                            <DropdownMenuItem key={item.label} onSelect={() => router.visit(item.href)}>
                                <item.icon />
                                {item.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
