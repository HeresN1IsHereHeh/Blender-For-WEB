
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import type { AnimatableProperty } from '../types';
import { Trash2 } from 'lucide-react';

const Timeline: React.FC = () => {
    const {
        selectedObjectId,
        objects,
        animationState,
        setAnimationState,
        removeKeyframe,
    } = useStore();
    const rulerRef = useRef<HTMLDivElement>(null);
    const [isScrubbing, setIsScrubbing] = useState(false);
    
    const selectedObject = objects.find(o => o.id === selectedObjectId);
    const { duration, currentTime } = animationState;

    const handleScrub = useCallback((clientX: number) => {
        if (!rulerRef.current) return;
        const rect = rulerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        setAnimationState({ isPlaying: false, currentTime: percentage * duration });
    }, [duration, setAnimationState]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsScrubbing(true);
        handleScrub(e.clientX);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isScrubbing) {
            handleScrub(e.clientX);
        }
    }, [isScrubbing, handleScrub]);

    const handleMouseUp = useCallback(() => {
        setIsScrubbing(false);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);


    const renderTicks = () => {
        if (duration <= 0) return null;
        const ticks = [];
        const majorTickInterval = duration > 20 ? 5 : (duration > 5 ? 2 : 1);
        const minorTicksPerMajor = duration > 5 ? 5 : 2;
        
        for (let t = 0; t <= duration; t += majorTickInterval / minorTicksPerMajor) {
             const isMajorTick = t % majorTickInterval === 0;
             ticks.push(
                <div key={`tick-${t}`} 
                    className="absolute top-0 h-full -translate-x-px" 
                    style={{ left: `${(t / duration) * 100}%` }}
                >
                    <div className={`w-px ${isMajorTick ? 'h-3 bg-zinc-400' : 'h-2 bg-zinc-600'}`}></div>
                    {isMajorTick && <span className="absolute top-3 left-0 -translate-x-1/2 text-xs text-zinc-500">{t}s</span>}
                </div>
            );
        }
        return ticks;
    };
    
    return (
        <div className="h-48 bg-zinc-800 border-t-2 border-zinc-700 p-2 flex flex-col select-none">
            {/* Ruler and playhead */}
            <div className="relative h-8 flex-shrink-0 mb-3 pt-1">
                <div 
                    ref={rulerRef}
                    className="relative w-full h-4 mt-3 cursor-pointer"
                    onMouseDown={handleMouseDown}
                >
                   {renderTicks()}
                </div>
                <div 
                    className="absolute top-0 w-0.5 h-full bg-blue-500 pointer-events-none" 
                    style={{ left: `${(currentTime / duration) * 100}%`, transition: isScrubbing ? 'none' : 'left 0.1s linear' }}
                >
                    <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-2.5 -left-1 transform -translate-x-1/2"></div>
                </div>
            </div>

            {/* Tracks */}
            <div className="flex-grow overflow-y-auto pr-2">
                {!selectedObject ? (
                    <div className="flex items-center justify-center h-full text-sm text-zinc-500">Select an object to see animation tracks.</div>
                ) : (
                    <div className="space-y-1">
                        {(['position', 'rotation', 'scale'] as AnimatableProperty[]).map(prop => {
                            const keyframes = selectedObject.animations[prop] || [];
                            return (
                                <div key={prop} className="flex items-center h-8 bg-zinc-900 rounded-md p-2">
                                    <div className="w-24 text-xs capitalize text-zinc-400 font-mono">{prop}</div>
                                    <div className="relative flex-grow h-full bg-zinc-700/50 rounded">
                                        {keyframes.map(kf => (
                                            <div 
                                                key={`${prop}-${kf.time}`} 
                                                title={`Keyframe at ${kf.time.toFixed(2)}s`}
                                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 group cursor-pointer"
                                                style={{ left: `calc(${(kf.time / duration) * 100}% - 6px)` }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAnimationState({ currentTime: kf.time });
                                                }}
                                            >
                                                <div className="w-full h-full bg-yellow-400 transform rotate-45 rounded-sm group-hover:bg-yellow-200"></div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeKeyframe(selectedObject.id, prop, kf.time);
                                                    }}
                                                    className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-600 rounded-full text-white z-10"
                                                    title="Delete keyframe"
                                                >
                                                    <Trash2 size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timeline;
