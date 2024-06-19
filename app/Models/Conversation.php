<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Conversation extends Model
{
    use HasFactory;

    /**
     * Get the lastMessage that owns the Conversation
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    /**
     * Get the user1 that owns the Conversation
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id1');
    }

    /**
     * Get the user2 that owns the Conversation
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id2');
    }

    public static function getConversationsForSidebar(User $user)
    {
        $users = User::getUserExceptUser($user);
        $groups = Group::getGroupForUser($user);

        return $users->map(function (User $user) {
            return $user->toConversationArray();
        })->concat($groups->map(function (Group $group) {
            return $group->toConversationArray();
        }));
    }
}
