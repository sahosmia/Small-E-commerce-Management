<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Hand-picked demo products matching the Product model schema.
     *
     * @var array<string, array<string, mixed>>
     */
    public const SPECS = [
        'walton_ac' => ['name' => 'Walton AC 1.5 Ton Inverter', 'sku' => 'WAL-AC-15T', 'base_price' => 46000, 'is_active' => true],
        'samsung_ac' => ['name' => 'Samsung AC 1 Ton Inverter', 'sku' => 'SAM-AC-1T', 'base_price' => 50000, 'is_active' => true],
        'walton_fridge' => ['name' => 'Walton Refrigerator 300L', 'sku' => 'WAL-RF-300', 'base_price' => 40000, 'is_active' => true],
        'lg_fridge' => ['name' => 'LG Refrigerator 400L', 'sku' => 'LG-RF-400', 'base_price' => 68000, 'is_active' => true],
        'samsung_tv' => ['name' => 'Samsung LED TV 43"', 'sku' => 'SAM-TV-43', 'base_price' => 35000, 'is_active' => true],
        'walton_tv' => ['name' => 'Walton LED TV 32"', 'sku' => 'WAL-TV-32', 'base_price' => 19500, 'is_active' => true],
        'vision_wm' => ['name' => 'Vision Washing Machine 7kg', 'sku' => 'VIS-WM-7', 'base_price' => 28000, 'is_active' => true],
        'walton_microwave' => ['name' => 'Walton Microwave Oven 25L', 'sku' => 'WAL-MW-25', 'base_price' => 11000, 'is_active' => true],
        'singer_rice_cooker' => ['name' => 'Singer Rice Cooker 1.8L', 'sku' => 'SIN-RC-18', 'base_price' => 2500, 'is_active' => true],
        'vision_fan' => ['name' => 'Vision Ceiling Fan 56"', 'sku' => 'VIS-FN-56', 'base_price' => 1800, 'is_active' => true],
    ];

    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@gmail.com')->first()
            ?? User::query()->first();

        foreach (self::SPECS as $spec) {
            Product::firstOrCreate(
                ['sku' => $spec['sku']],
                [
                    'name' => $spec['name'],
                    'sku' => $spec['sku'],
                    'base_price' => $spec['base_price'],
                    'is_active' => $spec['is_active'],
                    'created_by' => $admin?->id,
                ]
            );
        }
    }
}
