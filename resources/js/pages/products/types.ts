import { type Brand, type Category, type Paginated, type ProductListItem, type Unit } from '@/types/models';

export type ProductSortField = 'name' | 'selling_price' | 'avg_cost';

export interface ProductFilters {
    search: string | null;
    category_id: number | null;
    brand_id: number | null;
    sort: ProductSortField;
    direction: 'asc' | 'desc';
    per_page: number | 'all';
}

export interface ProductsIndexProps {
    products: Paginated<ProductListItem>;
    categories: Category[];
    brands: Brand[];
    units: Unit[];
    filters: ProductFilters;
}
