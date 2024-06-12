<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Group::factory()
            ->count(5)
            ->hasAttached(User::factory()->count(3))
            ->create(['owner_id' => 1]);
    }
}
