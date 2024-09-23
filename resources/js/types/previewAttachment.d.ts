import { Attachments } from "./messages";

export default interface PreviewAttachment {
    attachments: Attachments[];
    index: number;
}
