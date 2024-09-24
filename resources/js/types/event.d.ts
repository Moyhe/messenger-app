type EventCallback = (...data: any) => void;

interface Events {
    [key: string]: EventCallback[];
}
