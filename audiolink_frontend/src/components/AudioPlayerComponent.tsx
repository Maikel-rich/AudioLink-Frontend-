import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerComponentProps {
    audioUrl: string;
    beatId: number;
    isPlaying: boolean;
    onPlay: (beatId: number) => void;
    onPause: (beatId: number) => void;
}

export const AudioPlayerComponent: React.FC<AudioPlayerComponentProps> = ({
    audioUrl,
    beatId,
    isPlaying,
    onPlay,
    onPause
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);

    const formatTime = (time: number): string => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current && duration) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            const newTime = percentage * duration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        setIsMuted(false);
    };

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = volume;
                setIsMuted(false);
            } else {
                audioRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    };

    useEffect(() => {
        if (audioRef.current && !isMuted) {
            audioRef.current.volume = volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="flex items-center gap-3 bg-black/40 rounded-lg p-2">
            <button
                onClick={() => isPlaying ? onPause(beatId) : onPlay(beatId)}
                className="w-8 h-8 rounded-full bg-producer/20 hover:bg-producer/40 transition-colors flex items-center justify-center flex-shrink-0"
            >
                {isPlaying ? (
                    <Pause size={14} className="text-producer" />
                ) : (
                    <Play size={14} className="text-producer" />
                )}
            </button>

            <span className="text-[9px] font-mono text-subtitle/60 w-8">
                {formatTime(currentTime)}
            </span>

            <div
                className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer relative group"
                onClick={handleSeek}
            >
                <div
                    className="h-full bg-producer rounded-full relative transition-all duration-75"
                    style={{ width: `${progressPercentage}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-producer rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            <span className="text-[9px] font-mono text-subtitle/60 w-8">
                {formatTime(duration)}
            </span>

            <div className="flex items-center gap-2">
                <button
                    onClick={toggleMute}
                    className="text-subtitle/40 hover:text-producer transition-colors"
                >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-producer"
                />
            </div>

            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => onPause(beatId)}
            />
        </div>
    );
};