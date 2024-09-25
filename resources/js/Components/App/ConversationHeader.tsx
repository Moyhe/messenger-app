import { UserGroup } from "@/types/conversations";
import {
    ArrowLeftIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import GroupDescriptionPopover from "./GroupDescriptionPopover";
import GrorupUsersPopover from "./GrorupUsersPopover";
import { useEventBusContext } from "@/EventBus";
import axios from "axios";
import { PageProps } from "@/types";

interface Props {
    selectedConversations: UserGroup;
}

const ConversationHeader = ({ selectedConversations }: Props) => {
    const { emit } = useEventBusContext();

    const AuthUser = usePage<PageProps>().props.auth.user;

    const onDeleteGroup = () => {
        if (!window.confirm("Are you sure you want to delete this group")) {
            return;
        }

        axios
            .delete(route("group.destroy", selectedConversations.id))
            .then((res) => {
                console.log(res);
            })
            .catch((err: Error) => {
                console.log(err.message);
            });
    };

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
                    {selectedConversations.is_group && (
                        <div className="flex gap-3">
                            <GroupDescriptionPopover
                                description={selectedConversations.description}
                            />

                            <GrorupUsersPopover
                                users={selectedConversations.users}
                            />

                            {selectedConversations.owner_id == AuthUser.id && (
                                <>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Edit Group"
                                    >
                                        <button
                                            onClick={() =>
                                                emit(
                                                    "GroupModal.show",
                                                    selectedConversations
                                                )
                                            }
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <PencilSquareIcon className="w-4" />
                                        </button>
                                    </div>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Delete Group"
                                    >
                                        <button
                                            onClick={onDeleteGroup}
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <TrashIcon className="w-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ConversationHeader;
