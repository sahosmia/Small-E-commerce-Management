<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Hand-picked demo products matching the Global Product architecture.
     *
     * @var array<int, array<string, mixed>>
     */
    public const SPECS = [
        [
            'name' => 'Walton AC 1.5 Ton Inverter',
            'sku' => 'WAL-AC-15T',
            'base_price' => 46000.00,
            'description' => 'Energy efficient 1.5 ton inverter split air conditioner with intelligent cooling.',
            'is_active' => true,
        ],
        [
            'name' => 'Samsung AC 1 Ton Inverter',
            'sku' => 'SAM-AC-1T',
            'base_price' => 50000.00,
            'description' => 'Fast cooling digital inverter 1 ton AC with durable copper condenser.',
            'is_active' => true,
        ],
        [
            'name' => 'Walton Refrigerator 300L',
            'sku' => 'WAL-RF-300',
            'base_price' => 40000.00,
            'description' => 'Direct cool 300 liter refrigerator with wide voltage design and nano healthcare.',
            'is_active' => true,
        ],
        [
            'name' => 'LG Refrigerator 400L Frost-Free',
            'sku' => 'LG-RF-400',
            'base_price' => 68000.00,
            'description' => 'Smart inverter double door frost-free refrigerator with multi air flow.',
            'is_active' => true,
        ],
        [
            'name' => 'Samsung 4K UHD Smart TV 43"',
            'sku' => 'SAM-TV-43',
            'base_price' => 38000.00,
            'description' => 'Crystal 4K UHD smart television with HDR10+ and bezel-less design.',
            'is_active' => true,
        ],
        [
            'name' => 'Walton Android Smart LED TV 32"',
            'sku' => 'WAL-TV-32',
            'base_price' => 19500.00,
            'description' => 'HD ready Android 11 smart TV with built-in Chromecast and Dolby Audio.',
            'is_active' => true,
        ],
        [
            'name' => 'Vision Washing Machine 7kg Fully Automatic',
            'sku' => 'VIS-WM-7',
            'base_price' => 28000.00,
            'description' => 'Top load fully automatic 7kg washing machine with fuzzy logic control.',
            'is_active' => true,
        ],
        [
            'name' => 'Walton Microwave Oven 25L Grill',
            'sku' => 'WAL-MW-25',
            'base_price' => 11000.00,
            'description' => '25 liter grill microwave oven with digital display and multi-stage cooking.',
            'is_active' => true,
        ],
        [
            'name' => 'Singer Rice Cooker 1.8L Double Pot',
            'sku' => 'SIN-RC-18',
            'base_price' => 2500.00,
            'description' => '1.8L automatic rice cooker with non-stick coating and keep warm function.',
            'is_active' => true,
        ],
        [
            'name' => 'Logitech MX Master 3S Wireless Mouse',
            'sku' => 'LOGI-MX3S',
            'base_price' => 12500.00,
            'description' => 'Ergonomic performance wireless mouse with 8K DPI tracking and MagSpeed scrolling.',
            'is_active' => true,
        ],
        [
            'name' => 'Discontinued Vintage Radio',
            'sku' => 'DISC-RAD-01',
            'base_price' => 1500.00,
            'description' => 'Sample inactive global product for catalog status testing.',
            'is_active' => false,
        ],
    ];

    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@gmail.com')->first()
            ?? User::query()->first();

        $createdProducts = [];

        foreach (self::SPECS as $spec) {
            $createdProducts[] = Product::updateOrCreate(
                ['sku' => $spec['sku']],
                [
                    'name' => $spec['name'],
                    'slug' => Str::slug($spec['name']),
                    'sku' => $spec['sku'],
                    'description' => $spec['description'],
                    'base_price' => $spec['base_price'],
                    'is_active' => $spec['is_active'],
                    'created_by' => $admin?->id,
                ]
            );
        }

        // Assign some active products to active demo shops
        $apexShop = Shop::query()->where('slug', 'apex-electronics')->first();
        $techHaven = Shop::query()->where('slug', 'tech-haven-store')->first();

        if ($apexShop) {
            // Assign first 6 active products to Apex Electronics
            $activeProducts = array_filter($createdProducts, fn ($p) => (bool) $p->is_active);
            $apexSelection = array_slice($activeProducts, 0, 6);

            foreach ($apexSelection as $product) {
                ShopProduct::updateOrCreate(
                    [
                        'shop_id' => $apexShop->id,
                        'product_id' => $product->id,
                    ],
                    [
                        'price' => (float) $product->base_price,
                        'description' => null, // inherits global description
                        'thumbnail' => null,   // inherits global thumbnail
                        'status' => true,
                    ]
                );
            }
        }

        if ($techHaven) {
            // Assign next 4 products to Tech Haven Store with a custom price
            $activeProducts = array_filter($createdProducts, fn ($p) => (bool) $p->is_active);
            $techSelection = array_slice($activeProducts, 3, 4);

            foreach ($techSelection as $product) {
                ShopProduct::updateOrCreate(
                    [
                        'shop_id' => $techHaven->id,
                        'product_id' => $product->id,
                    ],
                    [
                        'price' => round((float) $product->base_price * 1.05, 2), // 5% shop markup
                        'description' => "Special warranty offer available at Tech Haven Store for {$product->name}!",
                        'thumbnail' => null,
                        'status' => true,
                    ]
                );
            }
        }
    }
}
