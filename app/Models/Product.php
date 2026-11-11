<?php

namespace App\Models;

use App\Models\Concerns\HasCreator;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasCreator;

    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    use SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'sku',
        'description',
        'base_price',
        'image',
        'is_active',
        'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * SKU generator helper.
     */
    public static function generateUniqueSku(): string
    {
        do {
            $sku = 'SKU-'.strtoupper(Str::random(6));
        } while (static::query()->where('sku', $sku)->exists());

        return $sku;
    }

    /**
     * Slug generator helper.
     */
    public static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $count = 1;

        while (static::query()
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = "{$baseSlug}-{$count}";
            $count++;
        }

        return $slug;
    }

    /**
     * Product image URL helper stored in products table.
     */
    public function imageUrl(): ?string
    {
        if (! $this->image) {
            return null;
        }

        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        return '/storage/'.$this->image;
    }
}
