<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;

class MessageController extends Controller
{

    public function byUser(User $user)
    {
        $messages = Message::query()
            ->where(function (Builder $query) use ($user) {
                $query->where([
                    ['sender_id', auth()->id()],
                    ['receiver_id', $user->id]
                ])->orWhere(function (Builder $query) use ($user) {
                    $query->where([
                        ['sender_id', $user->id],
                        ['receiver_id', auth()->id()]
                    ]);
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Home', [
            'selectedConversations' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }


    public function byGroup(Group $group)
    {
        $messages = Message::query()->where('group_id', $group->id)
            ->latest()->paginate(10);


        return Inertia::render('Home', [
            'selectedConversations' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    public function loadOlderMessages(Message $message)
    {
        if ($message->group_id) {
            $messages = Message::query()
                ->where('created_at', '<', $message->created_at)
                ->where('group_id', $message->group_id)
                ->latest()
                ->paginate(10);
        } else {
            $messages = Message::query()
                ->where('created_at', '<', $message->created_at)
                ->where(function (Builder $query) use ($message) {

                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)

                        ->orWhere(function (Builder $subquery) use ($message) {
                            $subquery->where('sender_id', $message->receiver_id)
                                ->where('receiver_id', $message->sender_id);
                        });
                })
                ->latest()
                ->paginate(10);
        }

        return MessageResource::collection($messages);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['sender_id'] = auth()->id();
        $receiver_id = $data['receiver_id'] ?? null;
        $gorup_id = $data['group_id'] ?? null;
        $files = $data['attachments'] ?? [];

        unset($data['attachments']);

        $message = Message::create($data);

        $attachments = [];
        if ($files) {
            foreach ($files as $file) {

                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store('attachments')
                ];
            }

            $attachments[] = MessageAttachment::create($model);

            $message->attachments = $attachments;
        }

        if ($receiver_id) {
            Conversation::updateConversationWithMessage($receiver_id, auth()->id(), $message);
        }

        if ($gorup_id) {
            Group::updateGroupWithMessage($gorup_id, $message);
        }

        SocketMessage::dispatch($message);

        return new MessageResource($message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        if ($message->sender_id !== auth()->id()) {
            return response()->json([
                'message' => "Forbidden"
            ], 403);

            $message->delete();

            foreach ($message->attachments() as $attachments) {
                $attachments->delete();
            }

            return response()->json('', 204);
        }
    }
}
