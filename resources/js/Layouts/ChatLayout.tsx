import echo from "@/echo";
import { PageProps, User } from "@/types";
import { usePage } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";
import AuthenticatedLayout from "./AuthenticatedLayout";

interface Props {
    children: ReactNode;
    user: User;
}

const ChatLayout = ({ children, user }: Props) => {
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const page = usePage().props;

    const conversations = page.conversations;
    const selectedConversation = page.selectedConversation;

    console.log(conversations);

    const [localConversation, setLocalConversation] = useState<User[]>([]);
    const [sortConversation, setSortConversation] = useState<User[]>([]);

    const isUserOnline = (usrerId: number) => onlineUsers[usrerId];

    useEffect(() => {
        setSortConversation(
            localConversation.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                } else if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        b.last_message_date
                    );
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [localConversation]);

    useEffect(() => {
        setLocalConversation(localConversation);
    }, [conversations]);

    useEffect(() => {
        echo.join("chat")
            .here((users: User) => {
                setOnlineUsers([{ ...users }]);
            })
            .joining((user: User) => {
                setOnlineUsers([...onlineUsers, user]);
            })
            .leaving((user: User) => {
                setOnlineUsers([user]);
            })
            .error((error: Error) => {
                console.error(error);
            });
        return () => {
            return echo.leave("online");
        };
    }, []);

    return (
        <AuthenticatedLayout user={user}>
            <p> ChatLayout </p>
            <div>{children}</div>
            <div></div>
            <div>{onlineUsers.map((onlineUser) => onlineUser.id)}</div>
        </AuthenticatedLayout>
    );
};

export default ChatLayout;
