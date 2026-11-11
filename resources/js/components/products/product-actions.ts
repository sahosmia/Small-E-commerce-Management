import { type RowAction } from '@/components/data-table/data-table-row-actions';
import { type ProductListItem } from '@/types/models';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface ProductActionHandlers {
    onDelete: (product: ProductListItem) => void;
}

/** Row actions shared by the table's action menu and the mobile card. */
export function getProductActions(product: ProductListItem, { onDelete }: ProductActionHandlers): RowAction[] {
    return [
        { label: 'View Details', icon: Eye, href: route('products.show', product.id) },
        { label: 'Edit', icon: Pencil, href: route('products.edit', product.id) },
        { label: 'Delete', icon: Trash2, variant: 'destructive', separatorBefore: true, onClick: () => onDelete(product) },
    ];
}
