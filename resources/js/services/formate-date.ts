import { Attachments } from "@/types/messages";

const formatMessageDateLoing = (date: string) => {
    const now = new Date();
    const inputDate = new Date(date);

    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (isYesterDay(inputDate)) {
        return (
            "Yesterday " +
            inputDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
        });
    } else {
        return inputDate.toLocaleDateString();
    }
};

const formatMessageDateShort = (date: string) => {
    const now = new Date();
    const inputDate = new Date(date);

    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (isYesterDay(inputDate)) {
        return "Yesterday ";
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
        });
    } else {
        return inputDate.toLocaleDateString();
    }
};

const isToday = (date: Date) => {
    const today = new Date();

    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const isYesterDay = (date: Date) => {
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    return (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
    );
};

export type attachment = File & Attachments;

const isImage = (attachment: attachment) => {
    let mime = attachment.type || attachment.mime;

    return mime.split("/")[0].toLowerCase() == "image";
};

const isAudio = (attachment: attachment) => {
    let mime = attachment.type || attachment.mime;

    return mime.split("/")[0].toLowerCase() == "audio";
};

const isVideo = (attachment: attachment) => {
    let mime = attachment.type || attachment.mime;

    return mime.split("/")[0].toLowerCase() == "video";
};

const isPdf = (attachment: attachment) => {
    let mime = attachment.type || attachment.mime;

    return mime == "application/pdf";
};

const isPreviewable = (attachment: attachment) => {
    return (
        isImage(attachment) ||
        isVideo(attachment) ||
        isPdf(attachment) ||
        isAudio(attachment)
    );
};

const formatByes = (bytes: number, decimals: number = 2) => {
    if (bytes == 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;

    const sizes = ["Bytes", "KB", "MB", "GB"];

    let i = 0;
    let size = bytes;

    while (size >= k) {
        size /= k;
        i++;
    }

    return parseFloat(size.toFixed(dm)) + " " + sizes[i];
};

export {
    formatMessageDateLoing,
    formatMessageDateShort,
    isImage,
    isAudio,
    isVideo,
    isPdf,
    isPreviewable,
    formatByes,
};
