export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    is_admin: boolean;
    avatar: string;
    blocked_at: string;
    last_message_date: string;
}


export interface Conversation {
    id: number;
    name: string;
    description: string;
    owner_id: boolean;
    users: User;
}


export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
