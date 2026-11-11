<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shop extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'owner_id',
        'user_id',
        'status',
        'description',
        'logo',
        'banner',
        'email',
        'phone',
        'address',
        'city',
        'country',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Alias for owner
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * @return HasMany<ShopProduct, $this>
     */
    public function shopProducts(): HasMany
    {
        return $this->hasMany(ShopProduct::class);
    }

    /**
     * @return BelongsToMany<Product, $this>
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'shop_products')
            ->withPivot(['id', 'price', 'description', 'thumbnail', 'status'])
            ->withTimestamps();
    }

    /**
     * Backward-compatible accessor for user_id
     */
    public function getUserIdAttribute(): ?int
    {
        return $this->owner_id;
    }

    /**
     * Backward-compatible mutator for user_id
     */
    public function setUserIdAttribute(?int $value): void
    {
        $this->attributes['owner_id'] = $value;
    }

    /**
     * Helper to get logo URL
     */
    public function logoUrl(): ?string
    {
        if (! $this->logo) {
            return null;
        }

        if (str_starts_with($this->logo, 'http://') || str_starts_with($this->logo, 'https://')) {
            return $this->logo;
        }

        return '/storage/'.$this->logo;
    }

    /**
     * Helper to get banner URL
     */
    public function bannerUrl(): ?string
    {
        if (! $this->banner) {
            return null;
        }

        if (str_starts_with($this->banner, 'http://') || str_starts_with($this->banner, 'https://')) {
            return $this->banner;
        }

        return '/storage/'.$this->banner;
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isInactive(): bool
    {
        return $this->status === 'inactive';
    }

    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }
}
