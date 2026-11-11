import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Brand, type Category } from '@/types/models';

interface ProductFiltersProps {
    categoryId: number | null;
    brandId: number | null;
    categories: Category[];
    brands: Brand[];
    onChange: (next: {
        category_id?: number | null;
        brand_id?: number | null;
    }) => void;
}

/** Dumb filter row — only renders the selects and reports what changed; the page decides what to do about it. */
export default function ProductFilters({ categoryId, brandId, categories, brands, onChange }: ProductFiltersProps) {
    
    return (
        <div className="flex flex-wrap items-end gap-3 pt-3">
            <div className="grid min-w-0 content-start gap-2">
                <Select
                    value={categoryId ? String(categoryId) : 'all'}
                    onValueChange={(value) => onChange({ category_id: value === 'all' ? null : Number(value) })}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder={"Category"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{"All categories"}</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid min-w-0 content-start gap-2">
                <Select
                    value={brandId ? String(brandId) : 'all'}
                    onValueChange={(value) => onChange({ brand_id: value === 'all' ? null : Number(value) })}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder={"Brand"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{"All brands"}</SelectItem>
                        {brands.map((brand) => (
                            <SelectItem key={brand.id} value={String(brand.id)}>
                                {brand.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
