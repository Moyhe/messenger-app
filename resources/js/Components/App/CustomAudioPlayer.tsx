import Attachement from "@/types/attachment";
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useRef, useState } from "react";

interface Props {
    file: Attachement;
    showVolume: boolean;
}

const CustomAudioPlayer = ({ file, showVolume = true }: Props) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlayerPause = () => {
        const audio = audioRef.current;

        if (isPlaying) {
            audio?.pause();
        } else {
            console.log(audio, audio?.duration);
            setDuration(audio!.duration);
            audio?.play();
        }

        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const volume = e.target.value;
        audioRef.current!.volume = Number(volume);
        setVolume(Number(volume));
    };

    const handleTimeUpdate = (e: ChangeEvent<HTMLAudioElement>) => {
        const audio = audioRef.current;
        setDuration(audio!.duration);
        setCurrentTime(e.target.currentTime);
    };

    const handleLoadMetaData = (e: ChangeEvent<HTMLAudioElement>) => {
        setDuration(e.target.duration);
    };

    const handleSeekChange = (e: ChangeEvent<HTMLInputElement>) => {
        const time = e.target.value;
        audioRef.current!.currentTime = Number(time);
        setCurrentTime(Number(time));
    };

    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-slate-800">
            <audio
                ref={audioRef}
                src={file.url}
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadMetaData}
                className="hidden"
            />

            <button onClick={togglePlayerPause}>
                {isPlaying && <PauseCircleIcon className="w-6 text-gray-400" />}
                {!isPlaying && <PlayCircleIcon className="w-6 text-gray-400" />}
            </button>
            {showVolume && (
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolumeChange}
                />
            )}

            <input
                type="range"
                className="flex-1"
                min={0}
                max={duration}
                step={0.01}
                value={currentTime}
                onChange={handleSeekChange}
            />
        </div>
    );
};

export default CustomAudioPlayer;
