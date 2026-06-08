import React, { useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

const AudioPlayer = () => {
    const {
        currentBeat,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        pause,
        resume,
        seek,
        setVolume,
        toggleMute
    } = useAudio();

    const progressBarRef = useRef<HTMLDivElement>(null);
    const volumeBarRef = useRef<HTMLDivElement>(null);

    const formatTime = (time: number): string => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressBarRef.current && duration) {
            const rect = progressBarRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            const newTime = percentage * duration;
            seek(newTime);
        }
    };

    const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
        if (volumeBarRef.current) {
            const rect = volumeBarRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const newVolume = Math.max(0, Math.min(1, x / rect.width));
            setVolume(newVolume);
        }
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            pause();
        } else if (currentBeat) {
            resume();
        }
    };

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    if (!currentBeat) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-[#0f0f12]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-4 px-6 min-w-[380px] md:min-w-[520px]">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/50 flex-shrink-0 relative">
                        {currentBeat.cloudinaryUrl ? (
                            <img
                                src={currentBeat.cloudinaryUrl}
                                alt={currentBeat.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-artist/20 to-transparent">
                                <Disc size={20} className="text-subtitle/40" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-light font-black text-sm uppercase tracking-wider truncate">
                                {currentBeat.title}
                            </h4>
                            <span className="text-[8px] font-mono text-subtitle/40 bg-white/5 px-2 py-0.5 rounded">
                                {currentBeat.genre || 'Beat'}
                            </span>
                            {currentBeat.bpm && (
                                <span className="text-[8px] font-mono text-subtitle/40 bg-white/5 px-2 py-0.5 rounded">
                                    {currentBeat.bpm} BPM
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[9px] font-mono text-subtitle/40 tabular-nums min-w-8">
                                {formatTime(currentTime)}
                            </span>
                            <div
                                ref={progressBarRef}
                                className="flex-1 h-1.5 bg-white/10 rounded-full relative group cursor-pointer"
                                onClick={handleSeek}
                            >
                                <div
                                    className="absolute h-full bg-gradient-to-r from-artist to-artist/80 rounded-full"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                    style={{ left: `${progressPercentage}%`, transform: 'translate(-50%, -50%)' }}
                                />
                            </div>
                            <span className="text-[9px] font-mono text-subtitle/40 tabular-nums min-w-8">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePlayPause}
                            className="w-10 h-10 bg-artist rounded-full flex items-center justify-center text-white shadow-lg shadow-artist/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleMute}
                                className="text-subtitle/40 hover:text-artist transition-colors"
                            >
                                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                            <div
                                ref={volumeBarRef}
                                className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden group cursor-pointer"
                                onClick={handleVolumeChange}
                            >
                                <div
                                    className="h-full bg-artist/60 group-hover:bg-artist transition-all rounded-full"
                                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;