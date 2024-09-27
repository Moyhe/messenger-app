import { useEventBusContext } from "@/EventBus";
import { UserGroup } from "@/types/conversations";
import Toasts from "@/types/toasts";
import { Menu, Transition } from "@headlessui/react";
import {
    EllipsisVerticalIcon,
    LockOpenIcon,
    ShieldCheckIcon,
    UserIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { Fragment } from "react/jsx-runtime";

interface Props {
    conversations: UserGroup;
}

const UserOptionsDropdown = ({ conversations }: Props) => {
    const { emit } = useEventBusContext();

    const changeUserRole = () => {
        if (!conversations.is_user) return;

        axios
            .post<Toasts>(route("user.changeRole", conversations.id))
            .then((res) => {
                emit("toast.show", res.data.message);
                console.log(res.data);
            })
            .catch((err: Error) => console.log(err.message));
    };

    const onBlockUser = () => {
        if (!conversations.is_user) return;

        axios
            .post<Toasts>(route("user.blockUnBlock", conversations.id))
            .then((res) => {
                emit("toast.show", res.data.message);
                console.log(res.data);
            })
            .catch((err: Error) => console.log(err.message));
    };

    return (
        <div onClick={(e) => e.preventDefault()}>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50">
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={onBlockUser}
                                        className={`${
                                            active
                                                ? "bg-violet-500 text-white"
                                                : "text-gray-900"
                                        } group flex w-full items-center text-white rounded-md px-2 py-2 text-sm`}
                                    >
                                        {conversations.blocked_at && (
                                            <>
                                                <LockOpenIcon className="w-4 h-4 mr-2" />
                                                unblock user
                                            </>
                                        )}

                                        {!conversations.blocked_at && (
                                            <>
                                                <LockOpenIcon className="w-4 h-4 mr-2" />
                                                Block user
                                            </>
                                        )}
                                    </button>
                                )}
                            </Menu.Item>
                        </div>

                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={changeUserRole}
                                        className={`${
                                            active
                                                ? "bg-violet-500 text-white"
                                                : "text-gray-900"
                                        } group flex w-full items-center text-white rounded-md px-2 py-2 text-sm`}
                                    >
                                        {conversations.is_admin && (
                                            <>
                                                <UserIcon className="w-4 h-4 mr-2" />
                                                Make Regular User
                                            </>
                                        )}

                                        {!conversations.is_admin && (
                                            <>
                                                <ShieldCheckIcon className="w-4 h-4 mr-2 " />
                                                Make Admin
                                            </>
                                        )}
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

export default UserOptionsDropdown;
