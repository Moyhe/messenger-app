import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

interface Props {
    fileReady: (file: File, url: string) => void;
}

const AudioRecorder = ({ fileReady }: Props) => {
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );

    const onMicroPhoneClick = async () => {
        if (recording) {
            setRecording(false);
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
            return;
        }

        setRecording(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const newMediaRecorder = new MediaRecorder(stream);
            const chunks: BlobPart[] | undefined = [];

            newMediaRecorder.addEventListener("dataavailable", (e) => {
                chunks.push(e.data);
            });

            newMediaRecorder.addEventListener("stop", (e) => {
                let audioBlob = new Blob(chunks, {
                    type: "audio/ogg; codecs=opus",
                });

                let audioFile = new File([audioBlob], "recored_audio.ogg", {
                    type: "audio/ogg; codecs=opus",
                });

                const url = URL.createObjectURL(audioFile);

                fileReady(audioFile, url);
            });

            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder);
        } catch (error) {
            setRecording(false);
        }
    };

    return (
        <button
            onClick={onMicroPhoneClick}
            className="p-1 text-gray-400 hover:text-gray-200"
        >
            {recording && <StopCircleIcon className="w-6 text-red-600" />}
            {!recording && <MicrophoneIcon className="w-6 text-gray-500" />}
        </button>
    );
};

export default AudioRecorder;
