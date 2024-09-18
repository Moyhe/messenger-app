<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Message::factory()->count(1000)->create();

        $messages = Message::query()->whereNull('group_id')->orderBy('created_at')->get();

        $conversations = $messages->groupBy(function ($message) {
            return collect([$message->sender_id, $message->receiver_id])
                ->sort()->implode('_');
        })->map(function ($groupedMessage) {
            return [
                'user_id1' => $groupedMessage->first()->sender_id,
                'user_id2' => $groupedMessage->first()->receiver_id,
                'last_message_id' => $groupedMessage->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon()
            ];
        })->values();

        Conversation::insertOrIgnore($conversations->toArray());
    }
}
