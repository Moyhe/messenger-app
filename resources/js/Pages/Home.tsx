import AttachmentPreviewModel from "@/Components/App/AttachmentPreviewModel";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageInput from "@/Components/App/MessageInput";
import MessageItem from "@/Components/App/MessageItem";
import { useEventBusContext } from "@/EventBus";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ChatLayout from "@/Layouts/ChatLayout";
import { UserGroup } from "@/types/conversations";
import { Attachments, Message, Messages } from "@/types/messages";
import PreviewAttachment from "@/types/previewAttachment";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
    messages: Message;
    selectedConversations: UserGroup;
}

export default function Home({ messages, selectedConversations }: Props) {
    const [localMessages, setLocalMessages] = useState<Messages[]>([]);

    const [noMoreMessage, setNoMoreMessage] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);

    const messageRef = useRef<HTMLDivElement>(null);
    const loadMoreIntersect = useRef<HTMLDivElement>(null);

    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);

    const [previewAttachment, setPreviewAttachment] =
        useState<PreviewAttachment>({} as PreviewAttachment);

    const { on } = useEventBusContext();

    const loadMoreMessages = useCallback(() => {
        if (noMoreMessage) {
            return;
        }

        const firstMessage = localMessages[0];

        axios
            .get<Message>(route("message.load", firstMessage.id))
            .then(({ data }) => {
                if (data.data.length == 0) {
                    setNoMoreMessage(true);
                    return;
                }

                const scrollHeight = messageRef.current!.scrollHeight;
                const scrollTop = messageRef.current!.scrollTop;
                const clientHight = messageRef.current!.clientHeight;

                const scrollFromBottom = scrollHeight - scrollTop - clientHight;

                console.log("scroll form bottom", scrollFromBottom);

                setScrollFromBottom(scrollFromBottom);

                setLocalMessages((prevMessage) => {
                    return [...data.data.reverse(), ...prevMessage];
                });
            });
    }, [localMessages, noMoreMessage]);

    const onAttachmentClick = (attachments: any, index: number) => {
        setPreviewAttachment({
            attachments,
            index,
        });

        setShowAttachmentPreview(true);
    };

    useEffect(() => {
        if (messageRef.current && scrollFromBottom !== null) {
            messageRef.current.scrollTop =
                messageRef.current.scrollHeight -
                messageRef.current.offsetHeight -
                scrollFromBottom;
        }

        if (noMoreMessage) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages()
                ),
            {
                rootMargin: "0px 0px 250px 0px",
            }
        );

        if (loadMoreIntersect.current) {
            setTimeout(
                () => observer.observe(loadMoreIntersect.current as Element),
                100
            );
        }

        return () => {
            observer.disconnect();
        };
    }, [localMessages]);

    const messageCreated = (message: Messages) => {
        if (
            selectedConversations &&
            selectedConversations.is_group &&
            selectedConversations.id == message.group_id
        ) {
            setLocalMessages((prevMessage) => [...prevMessage, message]);
        }

        if (
            selectedConversations &&
            selectedConversations.is_user &&
            (selectedConversations.id == message.sender_id ||
                selectedConversations.id == message.receiver_id)
        ) {
            setLocalMessages((prevMessage) => [...prevMessage, message]);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            if (messageRef.current) {
                messageRef.current!.scrollTop =
                    messageRef.current!.scrollHeight;
            }
        }, 10);

        const offCreated = on("message.created", messageCreated);

        setScrollFromBottom(0);
        setNoMoreMessage(false);

        return () => {
            offCreated();
        };
    }, [selectedConversations]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
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
                        <div
                            ref={messageRef}
                            className="flex-1 overflow-y-auto p-5"
                        >
                            {localMessages.length == 0 && (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-lg text-slate-200">
                                        No Messages Found
                                    </div>
                                </div>
                            )}

                            {localMessages.length > 0 && (
                                <div className="flex flex-1 flex-col">
                                    <div ref={loadMoreIntersect}></div>
                                    {localMessages.map((message) => (
                                        <MessageItem
                                            key={message.id}
                                            message={message}
                                            attachmentClick={onAttachmentClick}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <MessageInput conversation={selectedConversations} />
                    </>
                )}

                {previewAttachment.attachments && (
                    <AttachmentPreviewModel
                        attachments={previewAttachment.attachments}
                        index={previewAttachment.index}
                        show={showAttachmentPreview}
                        onClose={() => setShowAttachmentPreview(false)}
                    />
                )}
            </ChatLayout>
        </AuthenticatedLayout>
    );
}
