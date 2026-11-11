<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopProduct extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'shop_id',
        'product_id',
        'price',
        'description',
        'thumbnail',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'status' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Shop, $this>
     */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Effective description (Shop override or fallback to global product).
     */
    public function getEffectiveDescriptionAttribute(): ?string
    {
        return $this->description ?? $this->product?->description;
    }

    /**
     * Effective thumbnail (Shop override or fallback to global product thumbnail).
     */
    public function getEffectiveThumbnailAttribute(): ?string
    {
        return $this->thumbnail ?? $this->product?->thumbnail;
    }

    /**
     * Effective thumbnail URL (Storage or absolute URL).
     */
    public function effectiveThumbnailUrl(): ?string
    {
        $thumb = $this->effective_thumbnail;

        if (! $thumb) {
            return null;
        }

        if (str_starts_with($thumb, 'http://') || str_starts_with($thumb, 'https://')) {
            return $thumb;
        }

        return '/storage/'.$thumb;
    }

    /**
     * Custom thumbnail URL if set.
     */
    public function customThumbnailUrl(): ?string
    {
        if (! $this->thumbnail) {
            return null;
        }

        if (str_starts_with($this->thumbnail, 'http://') || str_starts_with($this->thumbnail, 'https://')) {
            return $this->thumbnail;
        }

        return '/storage/'.$this->thumbnail;
    }
}
