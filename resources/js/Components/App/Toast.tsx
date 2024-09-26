import { useEventBusContext } from "@/EventBus";
import Toasts from "@/types/toasts";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Toast = () => {
    const [toasts, setToasts] = useState<Toasts[]>([]);
    const { on } = useEventBusContext();

    useEffect(() => {
        on("toast.show", (message: string) => {
            const uuid = uuidv4();
            setToasts((oldToasts) => [...oldToasts, { message, uuid }]);

            setTimeout(() => {
                setToasts((oldToasts) =>
                    oldToasts.filter((toast) => toast.uuid !== uuid)
                );
            }, 3000);
        });
    }, [on]);

    return (
        <div className="toast min-w-[280px] w-full xs:w-auto">
            {toasts.map((toast) => (
                <div
                    key={toast.uuid}
                    className="alert alert-success py-3 px-4 text-gray-100 rounded-md"
                >
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
};

export default Toast;
