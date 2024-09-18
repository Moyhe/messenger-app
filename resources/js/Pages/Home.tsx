import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/MessageItem";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ChatLayout from "@/Layouts/ChatLayout";
import { UserGroup } from "@/types/conversations";
import { Message, Messages } from "@/types/messages";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

interface Props {
    messages: Message;
    selectedConversations: UserGroup;
}

export default function Home({ messages, selectedConversations }: Props) {
    const [localMessages, setLocalMessages] = useState<Messages[]>([]);

    console.log("messages", messages);
    console.log("-----------------------------");
    console.log("local messages", localMessages);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalMessages(messages ? messages.data : []);
    }, [messages]);

    return (
        <AuthenticatedLayout>
            <ChatLayout>
                {!messages && (
                    <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                        <div className="text-2xl md:text-4xl p-16 text-slate-200">
                            please select conversation to see messages
                        </div>
                        <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                    </div>
                )}

                {messages && (
                    <>
                        <ConversationHeader
                            selectedConversations={selectedConversations}
                        />
                        <div ref={ref} className="flex-1 overflow-y-auto p-5">
                            {localMessages.length == 0 && (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-lg text-slate-200">
                                        No Messages Found
                                    </div>
                                </div>
                            )}

                            {localMessages.length > 0 && (
                                <div className="flex flex-1 flex-col">
                                    {localMessages.map((message) => (
                                        <MessageItem
                                            key={message.id}
                                            message={message}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* <MessageInput conversation={selectedConversations} /> */}
                    </>
                )}
            </ChatLayout>
        </AuthenticatedLayout>
    );
}
