import { ConversationItem } from "@/Components/App/ConversationItem";
import GroupModal from "@/Components/App/GroupModal";
import TextInput from "@/Components/TextInput";
import echo from "@/echo";
import { useEventBusContext } from "@/EventBus";
import { User } from "@/types";
import { ConversationProps, UserGroup } from "@/types/conversations";
import { Messages } from "@/types/messages";
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
    const [showGroupModal, setShowGroupModal] = useState(false);

    const isUserOnline = (usrerId: number) => onlineUsers[usrerId];

    const { on } = useEventBusContext();

    const onSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const search = (event.target as HTMLInputElement).value.toLowerCase();
        console.log(search);
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            })
        );
    };

    const messageCreated = (message: Messages) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((user) => {
                if (
                    message.receiver_id &&
                    !user.is_group &&
                    (user.id == message.sender_id ||
                        user.id == message.receiver_id)
                ) {
                    user.last_message = message.message;
                    user.last_message_date = message.created_at;

                    return user;
                }

                if (
                    message.group_id &&
                    user.is_group &&
                    user.id == message.group_id
                ) {
                    user.last_message = message.message;
                    user.last_message_date = message.created_at;

                    return user;
                }

                return user;
            });
        });
    };

    const messageDeleted = ({ prevMessage }: any) => {
        if (!prevMessage) {
            return;
        }

        messageCreated(prevMessage);
    };

    useEffect(() => {
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        const offShowModal = on("GroupModal.show", (group) => {
            setShowGroupModal(true);
        });

        return () => {
            offCreated();
            offDeleted();
            offShowModal();
        };
    }, [on]);

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
            .here((users: User[]) => {
                setOnlineUsers([...users]);
            })
            .joining((user: User) => {
                setOnlineUsers((prevUsers) => [...prevUsers, user]);
            })
            .leaving((user: User) => {
                setOnlineUsers((prevUsers) =>
                    prevUsers.filter((u) => u.id !== user.id)
                );
            })
            .error((error: Error) => {
                console.error(error);
            });
        return () => {
            echo.leave("online");
        };
    }, []);

    return (
        <>
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
                            <button
                                onClick={() => setShowGroupModal(true)}
                                className="text-gray-400 hover:text-gray-200"
                            >
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
                    <div className="flex-1 mb-16 overflow-auto">
                        {sortConversations &&
                            sortConversations.map((conversation) => (
                                <ConversationItem
                                    key={`${
                                        conversation.is_group
                                            ? "group_"
                                            : "user_"
                                    }${conversation.id}`}
                                    online={!!isUserOnline(conversation.id)}
                                    conversations={conversation}
                                />
                            ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col">{children}</div>
            </div>
            <GroupModal
                show={showGroupModal}
                onClose={() => setShowGroupModal(false)}
            />
        </>
    );
};

export default ChatLayout;
