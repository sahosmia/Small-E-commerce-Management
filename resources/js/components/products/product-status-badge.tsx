import { StatusBadge } from '@/components/shared/status-badge';

interface ProductStatusBadgeProps {
    product: {
        is_active: boolean;
    };
    hideStockStatus?: boolean;
}

/** Product status badge — Active / Inactive. */
export default function ProductStatusBadge({ product }: ProductStatusBadgeProps) {
    return (
        <span className="inline-flex items-center gap-1">
            {product.is_active ? (
                <StatusBadge status="active" label={"Active"} />
            ) : (
                <StatusBadge status="inactive" label={"Inactive"} />
            )}
        </span>
    );
}
