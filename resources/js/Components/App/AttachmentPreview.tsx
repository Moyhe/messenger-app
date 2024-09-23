import {
    attachment,
    formatByes,
    isPdf,
    isPreviewable,
} from "@/services/formate-date";
import Attachement from "@/types/attachment";
import { PaperClipIcon } from "@heroicons/react/24/solid";

interface Props {
    file: Attachement;
}

const AttachmentPreview = ({ file }: Props) => {
    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-slate-800">
            <div>
                {isPdf(file.file as attachment) && (
                    <img src="/img/pdf.png" className="w-8" />
                )}
                {!isPreviewable(file.file as attachment) && (
                    <div className="flex justify-center items-center w-10 h-10 bg-gray-700 rounded">
                        <PaperClipIcon className="w-6" />
                    </div>
                )}
            </div>

            <div className="flex-1 text-gray-400 text-nowrap text-ellipsis overflow-hidden">
                <h3> {file.file.name} </h3>
                <p className="text-xs"> {formatByes(file.file.size)} </p>
            </div>
        </div>
    );
};

export default AttachmentPreview;
