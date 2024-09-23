import {
    attachment,
    isAudio,
    isImage,
    isPdf,
    isPreviewable,
    isVideo,
} from "@/services/formate-date";
import { Attachments } from "@/types/messages";
import { Dialog, Transition } from "@headlessui/react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PaperClipIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import { Fragment, useEffect, useMemo, useState } from "react";

interface Props {
    attachments: Attachments[];
    index: number;
    show: boolean;
    onClose: () => void;
}

const AttachmentPreviewModel = ({
    attachments,
    index,
    onClose,
    show = false,
}: Props) => {
    const [currentInex, setCurrentIndex] = useState(0);

    const previewableAttachment = useMemo(() => {
        return Array.from(attachments).filter((attachment) =>
            isPreviewable(attachment as attachment)
        );
    }, [attachments]);

    const attachment = useMemo(() => {
        return previewableAttachment[currentInex];
    }, [attachments, currentInex]);

    const close = () => {
        onClose();
    };

    const prev = () => {
        if (currentInex == 0) {
            return;
        }

        setCurrentIndex(currentInex - 1);
    };

    const next = () => {
        if (currentInex === previewableAttachment.length - 1) {
            return;
        }

        setCurrentIndex(currentInex + 1);
    };

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    return (
        <Transition as={Fragment} show={show} leave="duration-200">
            <Dialog
                as="div"
                id="model"
                className="relative z-50"
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="h-screen w-screen">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="flex flex-col w-full h-full transform overflow-hidden bg-slate-800 text-left align-middle shadow-xl transition-all">
                                <button
                                    onClick={close}
                                    className="absolute right-3 top-3 w-10 h-10  rounded-full hover:bg-black/10 transition flex items-center justify-center text-gray-100 z-40"
                                >
                                    <XMarkIcon />
                                </button>
                                <div className="relative group h-full">
                                    {currentInex > 0 && (
                                        <div
                                            onClick={prev}
                                            className="absolute opacity-100 text-gray-100 cursor-pointer flex items-center justify-center w-16 h-16 left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 z-30"
                                        >
                                            <ChevronLeftIcon className="w-12" />
                                        </div>
                                    )}

                                    {currentInex <
                                        previewableAttachment.length - 1 && (
                                        <div
                                            onClick={next}
                                            className="absolute opacity-100 text-gray-100 cursor-pointer flex items-center justify-center w-16 h-16 right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 z-30"
                                        >
                                            <ChevronRightIcon className="w-12" />
                                        </div>
                                    )}

                                    {attachment && (
                                        <div className="flex items-center justify-center w-full h-full p-3">
                                            {isImage(
                                                attachment as attachment
                                            ) && (
                                                <img
                                                    src={attachment.url}
                                                    className="max-w-full max-h-full"
                                                />
                                            )}

                                            {isVideo(
                                                attachment as attachment
                                            ) && (
                                                <div className="flex items-center">
                                                    <video
                                                        src={attachment.url}
                                                        controls
                                                        autoPlay
                                                    ></video>
                                                </div>
                                            )}

                                            {isAudio(
                                                attachment as attachment
                                            ) && (
                                                <div className="relative flex justify-center items-center">
                                                    <audio
                                                        src={attachment.url}
                                                        controls
                                                        autoPlay
                                                    ></audio>
                                                </div>
                                            )}

                                            {isPdf(
                                                attachment as attachment
                                            ) && (
                                                <iframe
                                                    className="w-full h-full"
                                                    src={attachment.url}
                                                ></iframe>
                                            )}

                                            {!isPreviewable(
                                                attachment as attachment
                                            ) && (
                                                <div className="p-32 flex flex-col justify-center items-center text-gray-100">
                                                    <PaperClipIcon className="w-10 h-10 mb-3" />
                                                    <small>
                                                        {attachment.name}
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AttachmentPreviewModel;
