import { ChangeEvent, useEffect, useRef } from "react";

interface Props {
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onSend: () => void;
}

const NewMessageInput = ({ value, onChange, onSend }: Props) => {
    const input = useRef<HTMLTextAreaElement>(null);

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };
    const onChangeEvent = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setTimeout(() => {
            adjustHeight();
        }, 10);

        onChange(e);
    };

    const adjustHeight = () => {
        setTimeout(() => {
            input.current!.style.height = "auto";
            input.current!.style.height =
                input.current!.scrollHeight + 1 + "px";
        }, 100);
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea
            ref={input}
            value={value}
            rows={1}
            placeholder="type a message"
            onKeyDown={onInputKeyDown}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChangeEvent(e)}
            className="input input-bordered w-full rounded-r-none resize-none overflow-y-auto max-h-40"
        />
    );
};

export default NewMessageInput;
