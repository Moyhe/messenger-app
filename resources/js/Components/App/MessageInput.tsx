import { UserGroup } from "@/types/conversations";
import {
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    PhotoIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";
import { ChangeEvent, useState } from "react";
import NewMessageInput from "./NewMessageInput";
import axios, { AxiosResponse } from "axios";
import { Popover } from "@headlessui/react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import Attachement from "@/types/attachment";
import { attachment, isAudio, isImage } from "@/services/formate-date";
import CustomAudioPlayer from "./CustomAudioPlayer";
import AttachmentPreview from "./AttachmentPreview";
import AudioRecorder from "./AudioRecorder";
import { useEventBusContext } from "@/EventBus";

interface Props {
    conversation: UserGroup;
}

const MessageInput = ({ conversation }: Props) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessagem, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState<Attachement[]>([]);
    const [uploadProgess, setUploadProgress] = useState(0);

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        const updatedFiles = Array.from(files as FileList).map((file) => {
            return {
                file: file,
                url: URL.createObjectURL(file),
            };
        });

        e.target.value = "";

        setChosenFiles((prevFiles) => {
            return [...prevFiles, ...updatedFiles];
        });
    };

    const recordedAudioReady = (file: File, url: string) => {
        setChosenFiles((prevFiles) => {
            return [...prevFiles, { file, url }];
        });
    };

    const onSend = () => {
        if (messageSending) {
            return;
        }

        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            setInputErrorMessage(
                "please provide a message or upload attachments"
            );

            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000);

            return;
        }

        const formData = new FormData();
        chosenFiles.forEach((file) => {
            formData.append("attachments[]", file.file);
        });
        formData.append("message", newMessage);

        if (conversation.is_user) {
            formData.append("receiver_id", String(conversation.id));
        } else if (conversation.is_group) {
            formData.append("group_id", String(conversation.id));
        }

        setMessageSending(true);

        axios
            .post(route("message.store"), formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total!) * 100
                    );
                    console.log(progress);
                    setUploadProgress(progress);
                },
            })
            .then((response: AxiosResponse) => {
                setNewMessage("");
                setMessageSending(false);
                setUploadProgress(0);
                setChosenFiles([]);
            })
            .catch((error: Error) => {
                setMessageSending(false);
                setUploadProgress(0);
                setInputErrorMessage(
                    error.message || "An Erro Occured while sending message"
                );
            });
    };

    const onLikeClick = () => {
        if (messageSending) {
            return;
        }

        const data: Record<string, string> = {
            message: "👍",
        };

        if (conversation.is_user) {
            data["receiver_id"] = String(conversation.id);
        } else if (conversation.is_group) {
            data["group_id"] = String(conversation.id);
        }

        axios.post(route("message.store"), data);
    };

    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6" />
                    <input
                        type="file"
                        onChange={onFileChange}
                        multiple
                        className="absolute left-0 right-0 top-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>

                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input
                        type="file"
                        onChange={onFileChange}
                        multiple
                        accept="image/*"
                        className="absolute left-0 right-0 top-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <AudioRecorder fileReady={recordedAudioReady} />
            </div>

            <div className="order-1 px-3 xs:p-0 min-w-[220px]  xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput
                        value={newMessage}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setNewMessage(e.target.value)
                        }
                        onSend={onSend}
                    />
                    <button
                        onClick={onSend}
                        disabled={messageSending}
                        className="btn btn-info rounded-none"
                    >
                        <PaperAirplaneIcon className="w-6" />
                        <span className="hidden sm:inline">send</span>
                    </button>
                </div>
                {!!uploadProgess && (
                    <progress
                        className="progress progress-info w-full"
                        value={uploadProgess}
                        max={100}
                    ></progress>
                )}
                {inputErrorMessagem && (
                    <p className="text-xs text-red-400">{inputErrorMessagem}</p>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                    {chosenFiles.map((file) => (
                        <div
                            key={file.file.name}
                            className={
                                `relative flex justify-between cursor-pointer` +
                                (!isImage(file.file as attachment)
                                    ? "w-[240px]"
                                    : "")
                            }
                        >
                            {isImage(file.file as attachment) && (
                                <img
                                    src={file.url}
                                    alt={file.url}
                                    className="w-16 h-16 object-cover"
                                />
                            )}
                            {isAudio(file.file as attachment) && (
                                <CustomAudioPlayer
                                    file={file}
                                    showVolume={false}
                                />
                            )}

                            {!isImage(file.file as attachment) &&
                                !isAudio(file.file as attachment) && (
                                    <AttachmentPreview file={file} />
                                )}

                            <button
                                onClick={() =>
                                    setChosenFiles(
                                        chosenFiles.filter(
                                            (f) =>
                                                f.file.name !== file.file.name
                                        )
                                    )
                                }
                                className="absolute w-6 rounded-full bg-gray-800 -right-2 -top-2 text-gray-300 hover:text-gray-100 z-10"
                            >
                                <XCircleIcon className="w-6" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className="relative">
                    <Popover.Button className="p-1 text-gray-400 hover:text-gray-300">
                        <FaceSmileIcon className="w-6 h-6" />
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10 right-0 bottom-full">
                        <EmojiPicker
                            theme={Theme.DARK}
                            onEmojiClick={(e) =>
                                setNewMessage(newMessage + e.emoji)
                            }
                        ></EmojiPicker>
                    </Popover.Panel>
                </Popover>

                <button
                    onClick={onLikeClick}
                    className="p-1 text-gray-400 hover:text-gray-300"
                >
                    <HandThumbUpIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
