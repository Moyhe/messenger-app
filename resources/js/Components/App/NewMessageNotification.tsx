import { useEventBusContext } from "@/EventBus";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";
import Notification from "@/types/NewMessage";

const NewMessageNotification = () => {
    const [toasts, setToasts] = useState<Notification[]>([]);
    const { on } = useEventBusContext();

    useEffect(() => {
        on(
            "NewMessageNotification",
            (message: string, user: any, group_id: number) => {
                const uuid = uuidv4();
                console.log(user);

                setToasts((oldToasts) => [
                    ...oldToasts,
                    { message, uuid, user, group_id },
                ]);

                setTimeout(() => {
                    setToasts((oldToasts) =>
                        oldToasts.filter((toast) => toast.uuid !== uuid)
                    );
                }, 3000);
            }
        );
    }, [on]);

    return (
        <div className="toast toast-center toast-top min-w-[280px]">
            {toasts.map((toast) => (
                <div
                    key={toast.uuid}
                    className="alert alert-success py-3 px-4 text-gray-100 rounded-md"
                >
                    <Link
                        href={
                            toast.group_id
                                ? route("chat.group", toast.group_id)
                                : route("chat.user", toast.user.id)
                        }
                        className="flex items-center gap-2"
                    >
                        <UserAvatar user={toast.user} />
                        <span>{toast.message}</span>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default NewMessageNotification;
