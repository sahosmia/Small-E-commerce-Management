import ListTable from '@/components/data-table/list-table';
import { getProductActions } from '@/components/products/product-actions';
import ProductFilters from '@/components/products/product-filters';
import ProductGridCard from '@/components/products/product-grid-card';
import ProductStatCards from '@/components/products/product-stat-cards';
import StockAdjustmentModal from '@/components/products/stock-adjustment-modal';
import { AddButton } from '@/components/shared/action-buttons';
import BulkDeleteBar from '@/components/shared/bulk-delete-bar';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import EmptyState from '@/components/shared/empty-state';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { useListPage } from '@/hooks/table/use-list-page';
import { useConfirmDelete } from '@/hooks/use-confirm-delete';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type ProductListItem } from '@/types/models';
import { Head } from '@inertiajs/react';
import { Package } from 'lucide-react';
import { useState } from 'react';
import { getExportColumns, getVisibilityColumns, useProductColumns } from './table/columns';
import { type ProductsIndexProps } from './types';

/** Table column → export columns that start ticked while it's visible (the product column covers name + SKU, and so on). */
const PRODUCT_EXPORT_COLUMN_MAP: Record<string, string[]> = {
    product: ['name', 'sku'],
    category: ['category', 'brand'],
    stock: ['stock'],
    pap: ['pap'],
    tpp: ['tpp'],
    price: ['price'],
    margin: ['margin'],
    status: ['status'],
};

export default function ProductsIndex({ products, stats, categories, brands, filters }: ProductsIndexProps) {
        const breadcrumbs: BreadcrumbItem[] = [{ title: "Products", href: '/products' }];

    const [adjusting, setAdjusting] = useState<ProductListItem | null>(null);

    const list = useListPage({
        routeName: 'products.index',
        filters,
        emptyFilters: { category_id: null, brand_id: null, stock_status: null },
        rows: products.data,
        getId: (product) => product.id,
        // Status only adds "Service"/"Inactive" tags, so it starts hidden; the Columns menu brings it back.
        initialColumnVisibility: { status: false },
        export: {
            routeName: 'products.export',
            filterKeys: ['category_id', 'brand_id', 'stock_status'],
            columnMap: PRODUCT_EXPORT_COLUMN_MAP,
        },
    });

    const deletion = useConfirmDelete<ProductListItem>({
        routeName: 'products.destroy',
        errorKey: 'product',
        fallbackError: "Could not delete product.",
        successMessage: (product) => `"${product.name}" ${"deleted."}`,
    });

    const columns = useProductColumns({
        sort: filters.sort,
        direction: filters.direction,
        onSort: list.handleSort,
        selection: list.selection,
        onAdjustStock: setAdjusting,
        onDelete: deletion.setTarget,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={"Products"} />

            <div className="space-y-6 px-4 py-6">
                <PageHeader
                    icon={Package}
                    iconClassName="bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/20 dark:text-violet-400"
                    title={"Products"}
                    description={"All products — with stock, price and profit margin"}
                    actions={<AddButton href={route('products.create')} title={"Add Product"} />}
                />

                {stats && <ProductStatCards stats={stats} />}

                <ListTable
                    selectionSlot={
                        <BulkDeleteBar selection={list.selection} routeName="products.bulk-delete" noun="products" />
                    }
                    list={list}
                    data={products}
                    filters={filters}
                    columns={columns}
                    getRowKey={(product) => product.id}
                    renderGridCard={(product) => (
                        <ProductGridCard
                            product={product}
                            selected={list.selection.isSelected(product.id)}
                            onToggleSelected={(checked) => list.selection.toggle(product.id, checked)}
                            actions={getProductActions(product, { onAdjustStock: setAdjusting, onDelete: deletion.setTarget })}
                        />
                    )}
                    itemLabel={"products"}
                    searchPlaceholder={"Name, SKU or barcode"}
                    visibilityColumns={getVisibilityColumns()}
                    exportColumns={getExportColumns()}
                    filterSlot={
                        <ProductFilters
                            categoryId={filters.category_id}
                            brandId={filters.brand_id}
                            stockStatus={filters.stock_status}
                            categories={categories}
                            brands={brands}
                            onChange={list.applyFilters}
                        />
                    }
                    emptyState={
                        <EmptyState title={"No products yet"} description={"Add your first product"}>
                            <AddButton href={route('products.create')} title={"Add Product"} className="mt-2" />
                        </EmptyState>
                    }
                    filteredEmptyState={
                        <EmptyState title={"No results"} description={"Try a different search or filter"}>
                            <Button className="mt-2" variant="outline" onClick={list.resetFilters}>
                                {"Clear filters"}
                            </Button>
                        </EmptyState>
                    }
                />
            </div>

            <StockAdjustmentModal product={adjusting} onOpenChange={(open) => !open && setAdjusting(null)} />

            <ConfirmDialog
                open={deletion.target !== null}
                onOpenChange={(open) => !open && deletion.setTarget(null)}
                title={"Delete product?"}
                description={`"${deletion.target?.name}" ${"will be deleted. Cannot be done if it has stock movement."}`}
                confirmLabel={"Delete"}
                onConfirm={deletion.confirm}
            />
        </AppLayout>
    );
}
