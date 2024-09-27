import { PageProps } from "@/types";
import { UserGroup } from "@/types/conversations";
import { Link, usePage } from "@inertiajs/react";
import GroupAvatar from "./GroupAvatar";
import UserAvatar from "./UserAvatar";
import UserOptionsDropdown from "./UserOptionsDropdown";
import { formatMessageDateShort } from "@/services/formate-date";

interface Props {
    online?: boolean;
    conversations: UserGroup;
    // selectedConversations: UserGroup;
}

export const ConversationItem = ({
    online,
    conversations,
}: // selectedConversations,
Props) => {
    const page = usePage<PageProps>().props;
    const currentUser = page.auth.user;

    let classes = "border-transparent";

    // if (selectedConversations) {
    //     if (
    //         !selectedConversations.is_group &&
    //         !conversations.is_group &&
    //         selectedConversations.id == conversations.id
    //     ) {
    //         classes = "border-blue-500 bg-black/20";
    //     }
    //     if (
    //         selectedConversations.is_group &&
    //         conversations.is_group &&
    //         selectedConversations.id == conversations.id
    //     ) {
    //         classes = "border-blue-500 bg-black/20";
    //     }
    // }

    return (
        <Link
            href={
                conversations.is_group
                    ? route("chat.group", conversations.id)
                    : route("chat.user", conversations.id)
            }
            preserveState
            className={
                "conversation-item  flex items-center gap-2 p-2 text-gray-300 transition-all cursor-pointer border-1-4 hover:bg-black/20" +
                classes +
                (conversations.is_user && currentUser.is_admin
                    ? "pr-2"
                    : "pr-4")
            }
        >
            {conversations.is_user && (
                <UserAvatar
                    user={conversations}
                    online={online}
                    profile={false}
                />
            )}

            {conversations.is_group && <GroupAvatar />}

            <div
                className={
                    `flex-1 text-xs max-w-full overflow-hidden` +
                    (conversations.is_user && conversations.blocked_at
                        ? "opacity-50"
                        : "")
                }
            >
                <div className="flex grid-flow-col justify-between items-center">
                    <h3 className="text-sm font-semibold truncate">
                        {conversations.name}
                    </h3>
                    {conversations.last_message_date && (
                        <span className="text-nowrap">
                            {formatMessageDateShort(
                                conversations.last_message_date
                            )}
                        </span>
                    )}
                </div>

                {conversations.last_message && (
                    <p className="text-xs  truncate">
                        {conversations.last_message}
                    </p>
                )}
            </div>
            {!!currentUser.is_admin && conversations.is_user && (
                <UserOptionsDropdown conversations={conversations} />
            )}
        </Link>
    );
};
