import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react";

interface Props {
    children: ReactNode;
}

interface EventBusProps {
    setEvents: Dispatch<SetStateAction<Events>>;
    emit: (name: string, data: any) => void;
    on: (name: string, callback: EventCallback) => Function;
}

const EventBusContext = createContext<EventBusProps | null>(null);

const EventBusProvider = ({ children }: Props) => {
    const [events, setEvents] = useState<Events>({});

    const emit = (name: string, data: any) => {
        if (events[name]) {
            for (let callback of events[name]) {
                callback(data);
            }
        }
    };

    const on = (name: string, callback: EventCallback) => {
        if (!events[name]) {
            events[name] = [];
        }

        events[name].push(callback);

        return () => {
            events[name] = events[name].filter(
                (callback) => callback != callback
            );
        };
    };

    return (
        <EventBusContext.Provider value={{ emit, on, setEvents }}>
            {children}
        </EventBusContext.Provider>
    );
};

export const useEventBusContext = () =>
    useContext(EventBusContext) as EventBusProps;

export default EventBusProvider;
