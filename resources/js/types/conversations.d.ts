import { User } from ".";

interface Conversation {
    id: number;
    name: string;
    is_group: boolean;
    is_user: boolean;
    description: string;
    owner_id: number;
    last_message_date: string;
    last_message: string;
    users: User[];
}

type UserGroup = User & Conversation;

export type ConversationProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    conversations: UserGroup[];
};
