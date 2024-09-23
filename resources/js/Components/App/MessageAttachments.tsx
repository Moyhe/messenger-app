import {
    attachment,
    isAudio,
    isImage,
    isPdf,
    isPreviewable,
    isVideo,
} from "@/services/formate-date";
import { Attachments } from "@/types/messages";
import {
    ArrowUpTrayIcon,
    PaperClipIcon,
    PlayCircleIcon,
} from "@heroicons/react/24/solid";

interface Props {
    attachments: Attachments[];
    attachmentClick: (attachments: Attachments, index: number) => void;
}

const MessageAttachments = ({ attachmentClick, attachments }: Props) => {
    return (
        <>
            {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-end gap-1">
                    {attachments.map((attachment, index) => (
                        <div
                            onClick={(e) => attachmentClick(attachment, index)}
                            key={attachment.id}
                            className={
                                `group flex flex-col items-center justify-center text-gray-500 relative cursor-pointer` +
                                (isAudio(attachment as attachment)
                                    ? "w-84"
                                    : "w-32 aspect-square bg-blue-100")
                            }
                        >
                            {!isAudio(attachment as attachment) && (
                                <a
                                    className="z-20 opacity-100 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center text-gray-100 bg-gray-700 rounded absolute right-0 top-0 cursor-pointer hover:bg-gray-800"
                                    href={attachment.url}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ArrowUpTrayIcon className="w-4 h-4" />
                                </a>
                            )}

                            {isImage(attachment as attachment) && (
                                <img
                                    src={attachment.url}
                                    className="object-contain aspect-square"
                                />
                            )}

                            {isVideo(attachment as attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <PlayCircleIcon className="z-20 absolute w-16 h-16 text-white opacity-70" />

                                    <div className="absolute left-0 top-0 w-full h-full bg-black/50 z-10"></div>
                                    <video src={attachment.url}></video>
                                </div>
                            )}

                            {isAudio(attachment as attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <audio controls src={attachment.url} />
                                </div>
                            )}

                            {isPdf(attachment as attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <div className="absolute left-0 top-0 right-0 bottom-0"></div>
                                    <iframe
                                        src={attachment.url}
                                        className="w-ful h-full"
                                    ></iframe>
                                </div>
                            )}

                            {!isPreviewable(attachment as attachment) && (
                                <a
                                    className="flex flex-col justify-center items-center"
                                    href={attachment.url}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <PaperClipIcon className="w-10 h-10 mb-3" />
                                    <small className="text-center">
                                        {attachment.name}
                                    </small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MessageAttachments;
