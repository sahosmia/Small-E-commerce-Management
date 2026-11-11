import DataTableCheckbox from '@/components/data-table/data-table-checkbox';
import DataTableColumnHeader from '@/components/data-table/data-table-column-header';
import DataTableRowActions from '@/components/data-table/data-table-row-actions';
import { type DataTableColumnOption } from '@/components/data-table/types';
import { getProductActions } from '@/components/products/product-actions';
import { ProductImage } from '@/components/products/product-image';
import ProductStatusBadge from '@/components/products/product-status-badge';
import StockQuantity from '@/components/products/stock-quantity';
import { useMoneyFormat } from '@/hooks/use-money-format';
import { type ProductListItem } from '@/types/models';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { type ProductSortField } from '../types';

interface UseProductColumnsOptions {
    sort: ProductSortField;
    direction: 'asc' | 'desc';
    onSort: (column: string) => void;
    selection: {
        isSelected: (id: number) => boolean;
        toggle: (id: number, checked: boolean) => void;
        toggleAll: (checked: boolean) => void;
        isAllSelected: boolean;
        isSomeSelected: boolean;
    };
    onAdjustStock: (product: ProductListItem) => void;
    onDelete: (product: ProductListItem) => void;
}

/** The Table view's toggleable columns (Product bundles name+sku+image, so it's coarser than the export columns below). */
export const getVisibilityColumns = (): DataTableColumnOption[] => [
    { id: 'product', label: "Product" },
    { id: 'category', label: "Category / Brand" },
    { id: 'stock', label: "Stock" },
    { id: 'pap', label: "Purchase Average Price (P.A.P)" },
    { id: 'tpp', label: "Total Purchase Price (T.P.P)" },
    { id: 'price', label: "Selling Price" },
    { id: 'margin', label: "Margin" },
    { id: 'status', label: "Status" },
];

/** Fine-grained export columns — matches `ProductExportController::COLUMN_LABELS` on the backend. */
export const getExportColumns = (): DataTableColumnOption[] => [
    { id: 'name', label: "Name" },
    { id: 'sku', label: "SKU" },
    { id: 'barcode', label: "Barcode" },
    { id: 'category', label: "Category" },
    { id: 'brand', label: "Brand" },
    { id: 'stock', label: "Stock" },
    { id: 'pap', label: "Purchase Average Price (P.A.P)" },
    { id: 'tpp', label: "Total Purchase Price (T.P.P)" },
    { id: 'price', label: "Selling Price" },
    { id: 'margin', label: "Margin %" },
    { id: 'status', label: "Status" },
];

/** Column definitions for the Products table — kept next to the page, not inside the generic DataTable. */
export function useProductColumns({ sort, direction, onSort, selection, onAdjustStock, onDelete }: UseProductColumnsOptions) {
    const money = useMoneyFormat();
    
    return useMemo<ColumnDef<ProductListItem>[]>(
        () => [
            {
                id: 'select',
                header: () => (
                    <DataTableCheckbox
                        checked={selection.isAllSelected ? true : selection.isSomeSelected ? 'indeterminate' : false}
                        onCheckedChange={selection.toggleAll}
                    />
                ),
                meta: { headerClassName: 'w-10', cellClassName: 'w-10', printHidden: true },
                cell: ({ row }) => (
                    <DataTableCheckbox
                        checked={selection.isSelected(row.original.id)}
                        onCheckedChange={(checked) => selection.toggle(row.original.id, checked)}
                    />
                ),
            },
            {
                id: 'actions',
                header: '',
                meta: { headerClassName: 'w-10', cellClassName: 'w-10', printHidden: true },
                cell: ({ row }) => <DataTableRowActions actions={getProductActions(row.original, { onAdjustStock, onDelete })} />,
            },
            {
                id: 'product',
                header: () => (
                    <DataTableColumnHeader
                        title={"Product"}
                        sortKey="name"
                        currentSort={sort}
                        currentDirection={direction}
                        onSort={onSort}
                    />
                ),
                meta: { label: "Product" },
                cell: ({ row }) => {
                    const product = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <ProductImage src={product.image_url} alt={product.name} className="size-10 rounded-md border object-cover" />
                            <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-muted-foreground text-xs">{product.sku}</div>
                            </div>
                        </div>
                    );
                },
            },
            {
                id: 'category',
                header: "Category / Brand",
                meta: { label: "Category / Brand" },
                cell: ({ row }) => (
                    <div>
                        <div>{row.original.category?.name ?? '—'}</div>
                        {row.original.brand && <div className="text-muted-foreground text-xs">{row.original.brand.name}</div>}
                    </div>
                ),
            },
            {
                id: 'stock',
                header: () => (
                    <DataTableColumnHeader
                        title={"Stock"}
                        sortKey="current_stock"
                        currentSort={sort}
                        currentDirection={direction}
                        onSort={onSort}
                        align="right"
                    />
                ),
                meta: { headerClassName: 'text-right', cellClassName: 'text-right tabular-nums', label: "Stock" },
                cell: ({ row }) => <StockQuantity product={row.original} />,
            },
            {
                id: 'pap',
                header: () => (
                    <DataTableColumnHeader
                        title={"Purchase Average Price (P.A.P)"}
                        sortKey="avg_cost"
                        currentSort={sort}
                        currentDirection={direction}
                        onSort={onSort}
                        align="right"
                    />
                ),
                meta: { headerClassName: 'text-right', cellClassName: 'text-right tabular-nums', label: "Purchase Average Price (P.A.P)" },
                cell: ({ row }) => money(row.original.avg_cost),
            },
            {
                id: 'tpp',
                header: "Total Purchase Price (T.P.P)",
                meta: { headerClassName: 'text-right', cellClassName: 'text-right tabular-nums', label: "Total Purchase Price (T.P.P)" },
                cell: ({ row }) => (row.original.manage_stock ? money(row.original.avg_cost * row.original.current_stock) : '—'),
            },
            {
                id: 'price',
                header: () => (
                    <DataTableColumnHeader
                        title={"Selling Price"}
                        sortKey="selling_price"
                        currentSort={sort}
                        currentDirection={direction}
                        onSort={onSort}
                        align="right"
                    />
                ),
                meta: { headerClassName: 'text-right', cellClassName: 'text-right tabular-nums', label: "Selling Price" },
                cell: ({ row }) => money(row.original.selling_price),
            },
            {
                id: 'margin',
                header: "Margin",
                meta: { headerClassName: 'text-right', cellClassName: 'text-right tabular-nums', label: "Margin" },
                cell: ({ row }) => `${row.original.profit_margin}%`,
            },
            {
                id: 'status',
                header: "Status",
                meta: { label: "Status" },
                cell: ({ row }) => <ProductStatusBadge product={row.original} hideStockStatus />,
            },
        ],
        [selection, onAdjustStock, onDelete, sort, direction, onSort, money],
    );
}
