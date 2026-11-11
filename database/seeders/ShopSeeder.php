<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner1 = User::query()->where('email', 'owner@gmail.com')->first();
        $owner2 = User::query()->where('email', 'owner2@gmail.com')->first();

        $shops = [
            [
                'name' => 'Apex Electronics',
                'slug' => 'apex-electronics',
                'owner_id' => $owner1?->id,
                'status' => 'active',
                'description' => 'Premier gadgets, appliances and consumer electronics.',
                'email' => 'contact@apexelectronics.com',
                'phone' => '+8801700000001',
                'address' => 'House 12, Road 4, Dhanmondi',
                'city' => 'Dhaka',
                'country' => 'Bangladesh',
            ],
            [
                'name' => 'Tech Haven Store',
                'slug' => 'tech-haven-store',
                'owner_id' => $owner2?->id,
                'status' => 'active',
                'description' => 'Smart lifestyle accessories, audio devices, and home appliances.',
                'email' => 'info@techhaven.com',
                'phone' => '+8801700000002',
                'address' => 'Plot 88, GEC Circle',
                'city' => 'Chittagong',
                'country' => 'Bangladesh',
            ],
            [
                'name' => 'Future Gadgets Outlet',
                'slug' => 'future-gadgets-outlet',
                'owner_id' => null,
                'status' => 'inactive',
                'description' => 'Upcoming showroom currently under setup.',
                'email' => 'support@futuregadgets.com',
                'phone' => '+8801700000003',
                'address' => 'Zindabazar Commercial Center',
                'city' => 'Sylhet',
                'country' => 'Bangladesh',
            ],
        ];

        foreach ($shops as $shopData) {
            Shop::firstOrCreate(
                ['slug' => $shopData['slug']],
                $shopData
            );
        }
    }
}
