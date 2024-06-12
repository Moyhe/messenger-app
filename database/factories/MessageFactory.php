<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{

    protected $model = Message::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sender_id = fake()->randomElement([0, 1]);
        if ($sender_id == 0) {
            $sender_id = fake()->randomElement(User::query()->where('id', '!=', 1)->pluck('id')->toArray());
            $recevier_id = 1;
        } else {
            $recevier_id = fake()->randomElement(User::pluck('id')->toArray());
        }

        $group_id = null;
        if (fake()->boolean(50)) {
            $group_id = fake()->randomElement(Group::pluck('id')->toArray());
            $group = Group::query()->findOrFail($group_id);

            $sender_id = fake()->randomElement($group->users->pluck('id')->toArray());
            $recevier_id = null;
        }

        return [
            'sender_id' => $sender_id,
            'receiver_id' => $recevier_id,
            'group_id' => $group_id,
            'message' => fake()->realText(100),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now')

        ];
    }
}
