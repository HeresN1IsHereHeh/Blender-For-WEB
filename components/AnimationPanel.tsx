import React from 'react';
import { useStore } from '../hooks/useStore';
import { Play, Pause, Square, KeySquare } from 'lucide-react';

const AnimationPanel: React.FC = () => {
  const {
    selectedObjectId,
    animationState,
    setAnimationState,
    addKeyframe,
  } = useStore();
  const { isPlaying, currentTime, duration, loop } = animationState;

  // The parent PropertiesPanel now ensures an object is selected.
  if (!selectedObjectId) return null;

  const handlePlayPause = () => {
    setAnimationState({ isPlaying: !isPlaying });
  };
  
  const handleStop = () => {
    setAnimationState({ isPlaying: false, currentTime: 0 });
  };

  return (
    <div className="mb-4 border-b border-zinc-700 pb-4 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-bold text-zinc-400 mb-2">Playback Controls</h2>
        <div className="flex items-center gap-2">
            <button onClick={handlePlayPause} title={isPlaying ? 'Pause' : 'Play'} className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-md">
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button onClick={handleStop} title="Stop" className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-md">
                <Square size={16} />
            </button>
            <div className="flex-grow text-right text-xs text-zinc-400 tabular-nums">
                {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
            </div>
        </div>
      </div>

       <div>
        <label className="text-xs text-zinc-400">Settings</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
                 <label className="text-xs text-zinc-500">Duration (s)</label>
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={duration}
                    onChange={(e) => setAnimationState({ duration: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-700 rounded-md p-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex items-end pb-1">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="loop-animation"
                        checked={loop}
                        onChange={(e) => setAnimationState({ loop: e.target.checked })}
                        className="w-4 h-4 text-blue-600 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="loop-animation" className="text-xs text-zinc-300">Loop</label>
                </div>
            </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-zinc-400 mb-2">Set Keyframe</h3>
        <p className="text-xs text-zinc-500 mb-2">Adds a keyframe for the current values at the current time.</p>
        <div className="grid grid-cols-3 gap-2">
            <button onClick={() => addKeyframe(selectedObjectId, 'position')} className="flex items-center justify-center gap-2 p-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-xs">
                <KeySquare size={14} /> Position
            </button>
             <button onClick={() => addKeyframe(selectedObjectId, 'rotation')} className="flex items-center justify-center gap-2 p-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-xs">
                <KeySquare size={14} /> Rotation
            </button>
             <button onClick={() => addKeyframe(selectedObjectId, 'scale')} className="flex items-center justify-center gap-2 p-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-xs">
                <KeySquare size={14} /> Scale
            </button>
        </div>
      </div>
    </div>
  );
};

export default AnimationPanel;