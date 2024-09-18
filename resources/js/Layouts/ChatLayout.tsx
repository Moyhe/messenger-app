import { ConversationItem } from "@/Components/App/ConversationItem";
import TextInput from "@/Components/TextInput";
import echo from "@/echo";
import { User } from "@/types";
import { ConversationProps, UserGroup } from "@/types/conversations";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import { usePage } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";

interface Props {
    children: ReactNode;
}

const ChatLayout = ({ children }: Props) => {
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const page = usePage<ConversationProps>().props;

    const conversations = page.conversations;
    const selectedConversation = page.selectedConversation;

    const [localConversations, setLocalConversations] = useState<UserGroup[]>(
        []
    );
    const [sortConversations, setSortConversations] = useState<UserGroup[]>([]);

    const isUserOnline = (usrerId: number) => onlineUsers[usrerId];

    const onSearch = (event: any) => {
        const search = event.target.value.toLowerCase();
        console.log(search);
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            })
        );
    };

    useEffect(() => {
        setSortConversations(
            localConversations.sort((a, b) => {
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
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
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
        <div className="flex-1 w-full flex overflow-hidden">
            <div
                id="app"
                className={`transition-all w-full sm-w[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden
                        ${selectedConversation ? "-ml-100% sm:ml-0" : ""}`}
            >
                <div className="flex items-center justify-between py-2 px-3 text-xl font-medium text-white">
                    My Conversations
                    <div
                        className="tooltip tooltip-left"
                        data-tip="Creat New Group"
                    >
                        <button className="text-gray-400 hover:text-gray-200">
                            <PencilSquareIcon className="w-4 h-4 inline-block ml-2 " />
                        </button>
                    </div>
                </div>
                <div className="p-3">
                    <TextInput
                        onKeyUp={onSearch}
                        placeholder="Filter users and groups"
                        className="w-full"
                    />
                </div>
                <div className="flex-1 overflow-auto">
                    {sortConversations &&
                        sortConversations.map((conversation) => (
                            <ConversationItem
                                key={`${
                                    conversation.is_group ? "group_" : "user_"
                                }${conversation.id}`}
                                online={!!isUserOnline(conversation.id)}
                                conversations={conversation}
                            />
                        ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default ChatLayout;
