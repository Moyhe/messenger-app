<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Factories\UserFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Geni',
            'email' => 'geni@gmail.com',
            'password' => Hash::make('kenkanekiTouka123'),
            'is_admin' => true
        ]);

        User::factory()->create([
            'name' => 'keth',
            'email' => 'keth@gmail.com',
            'password' => Hash::make('kenkanekiTouka123'),

        ]);

        UserFactory::new()->count(10)->create();
    }
}
