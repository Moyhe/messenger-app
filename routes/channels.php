<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat', function (User $user) {
    return $user ? new UserResource($user) : null;
});

Broadcast::channel('message.user.{user_id1}-{user_id2}', function (User $user, int $user_id1, int $user_id2) {
    return $user->id == $user_id1 || $user->id == $user_id2 ? $user : null;
});

Broadcast::channel('message.group.{group_id}', function (User $user, int $group_id) {
    return $user->groups->contains('id', $group_id) ? $user : null;
});


Broadcast::channel('group.deleted.{group_id}', function (User $user, int $group_id) {
    return $user->groups->contains('id', $group_id);
});
