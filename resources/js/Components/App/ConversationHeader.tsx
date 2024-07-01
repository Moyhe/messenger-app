import { UserGroup } from "@/types/conversations";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Link } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";

interface Props {
    selectedConversations: UserGroup;
}

const ConversationHeader = ({ selectedConversations }: Props) => {
    return (
        <div>
            {selectedConversations && (
                <div className="p-3 flex justify-between items-center border-b border-slate-700 ">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("dashboard")}
                            className="inline-block sm:hidden "
                        >
                            <ArrowLeftIcon className="w-6" />
                        </Link>

                        {selectedConversations.is_user && (
                            <UserAvatar user={selectedConversations} />
                        )}

                        {selectedConversations.is_group && <GroupAvatar />}

                        <div>
                            <h3 className="text-white">
                                {selectedConversations.name}
                            </h3>

                            {selectedConversations.is_group && (
                                <p className="text-xs text-gray-500">
                                    {selectedConversations.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConversationHeader;
