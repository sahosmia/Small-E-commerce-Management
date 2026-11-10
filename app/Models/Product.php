<?php

namespace App\Models;

use App\Models\Concerns\HasCreator;
use App\Models\Concerns\LogsActivityDefaults;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use HasCreator;

    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    use InteractsWithMedia;
    use LogsActivityDefaults;

    /**
     * `avg_cost` and `current_stock` are deliberately not fillable — they
     * may only change through StockService, alongside a stock_movements row.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'sku',
        'base_price',
        
        'is_active',
        'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
           
            'is_active' => 'boolean',
           
        ];
    }

 


  

    /**
     * SKU is optional on the create form — an admin who doesn't care to pick
     * one yet gets a short, unique placeholder instead of a blank/duplicate value.
     */
    public static function generateUniqueSku(): string
    {
        do {
            $sku = 'SKU-'.strtoupper(Str::random(6));
        } while (static::query()->where('sku', $sku)->exists());

        return $sku;
    }

   

    /**
     * The photo's URL as a path on this site ("/storage/…"), not an absolute one built from APP_URL — so it still loads
     * when the app is opened on a different host or port than APP_URL says (localhost vs 127.0.0.1, a vhost, a LAN IP).
     */
    public function imageUrl(): ?string
    {
        $url = $this->getFirstMediaUrl('images');

        return $url === '' ? null : (parse_url($url, PHP_URL_PATH) ?: null);
    }

    /**
     * A single product photo — no custom column, just the package's
     * polymorphic `media` table.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
    }
}
