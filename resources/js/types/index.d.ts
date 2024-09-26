interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    is_admin: boolean;
    is_group: boolean;
    is_user: boolean;
    avatar: string | File;
    blocked_at: string;
    last_message_date: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
