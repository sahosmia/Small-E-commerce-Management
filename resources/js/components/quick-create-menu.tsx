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
import { router } from '@inertiajs/react';
import { Boxes, ClipboardList, type LucideIcon, Package, Plus, Receipt, RotateCcw, ShoppingBag, Undo2, UserPlus, Wallet, Wrench } from 'lucide-react';

interface QuickCreateItem {
    label: string;
    icon: LucideIcon;
    href: string;
}

interface QuickCreateGroup {
    heading: string;
    items: QuickCreateItem[];
}

// Contacts/Expenses/Assets have no standalone create route, so they link to their
// index with `?quick_create=1`, which auto-opens that page's Add modal (see its
// `useEffect`). Built inside the component, not at module scope, since it calls Ziggy's `route()`.
function buildGroups(): QuickCreateGroup[] {
    return [
        
       
      
        {
            heading: 'Catalog',
            items: [{ label: 'New Product', icon: Package, href: route('products.create') }],
        },
       
    ];
}

/**
 * A global "+ Quick Create" menu in the header, reachable from anywhere in
 * the app instead of only from each resource's own list page.
 */
export default function QuickCreateMenu() {
    const groups = buildGroups();

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
