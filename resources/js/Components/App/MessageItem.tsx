import { PageProps } from "@/types";
import { Messages } from "@/types/messages";
import { usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import ReactMarkdown from "./ReactMarkdown";
import { formatMessageDateLoing } from "../../services/formate-date";

interface Props {
    message: Messages;
}

const MessageItem = ({ message }: Props) => {
    const currentUser = usePage<PageProps>().props.auth.user;

    return (
        <div
            className={
                "chat" +
                (message.sender_id === currentUser.id
                    ? "chat-end"
                    : "chat-start")
            }
        >
            {<UserAvatar user={message.sender} />}

            <div className="chat-header">
                {message.sender_id == currentUser.id ? message.sender.name : ""}
                <time className="text-xs opacity-50 ml-2">
                    {formatMessageDateLoing(message.created_at)}
                </time>
            </div>

            <div
                className={
                    "chat-bubble relative " +
                    (message.sender_id == currentUser.id
                        ? "chat-bubble-info"
                        : "")
                }
            >
                <div className="chat-message">
                    <div className="chat-message-content">
                        <ReactMarkdown> {message.message} </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
