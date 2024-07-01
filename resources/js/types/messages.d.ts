import { User } from ".";

interface Attachments {

    id: number;
    message_id: number;
    name: string;
    mime: string;
    size: number;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface Messages {
    id: number;
    message: string;
    sender_id: number;
    receiver_id: number;
    sender: User;
    group_id: number;
    attachments: Attachments[];
    created_at: string;
    updated_at: string;
}

