<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@gmail.com',
                'username' => 'admin',
                'password' => Hash::make('password'),
                'role' => UserRole::Admin,
                'is_active' => true,
            ],
            [
                'name' => 'Demo User',
                'email' => 'demo@gmail.com',
                'username' => 'demo',
                'password' => Hash::make('12345678'),
                'role' => UserRole::Admin,
                'is_active' => true,
            ],
            [
                'name' => 'John Shop Owner',
                'email' => 'owner@gmail.com',
                'username' => 'john.owner',
                'password' => Hash::make('password'),
                'role' => UserRole::ShopOwner,
                'is_active' => true,
            ],
            [
                'name' => 'Sarah Shop Owner',
                'email' => 'owner2@gmail.com',
                'username' => 'sarah.owner',
                'password' => Hash::make('password'),
                'role' => UserRole::ShopOwner,
                'is_active' => true,
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
