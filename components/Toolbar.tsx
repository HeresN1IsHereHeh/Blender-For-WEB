import React from 'react';
import { useStore } from '../hooks/useStore';
import { Move, Rotate3d, Scaling, Box, Circle, Cone, Torus, Square, Play } from 'lucide-react';
import type { ObjectType, EditorMode, TransformMode } from '../types';

const ToolButton: React.FC<{
  label: string;
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
}> = ({ label, children, onClick, isActive }) => (
  <button
    title={label}
    onClick={onClick}
    className={`p-2 rounded-md transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'hover:bg-zinc-600'
    }`}
  >
    {children}
  </button>
);

const Toolbar: React.FC = () => {
  const { editorMode, setEditorMode, addObject, transformMode, setTransformMode } = useStore();

  const mainTools: { mode: EditorMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'translate', icon: <Move size={20} />, label: 'Move' },
    { mode: 'rotate', icon: <Rotate3d size={20} />, label: 'Rotate' },
    { mode: 'scale', icon: <Scaling size={20} />, label: 'Scale' },
    { mode: 'animate', icon: <Play size={20} />, label: 'Animate' },
  ];

  const objectTools: { type: ObjectType; icon: React.ReactNode; label: string }[] = [
    { type: 'cube', icon: <Box size={20} />, label: 'Add Cube' },
    { type: 'sphere', icon: <Circle size={20} />, label: 'Add Sphere' },
    { type: 'cone', icon: <Cone size={20} />, label: 'Add Cone' },
    { type: 'torus', icon: <Torus size={20} />, label: 'Add Torus' },
    { type: 'plane', icon: <Square size={20} />, label: 'Add Plane' },
  ];

  return (
    <nav className="w-16 bg-zinc-900 p-2 flex flex-col items-center gap-4 border-r border-zinc-700">
      <div className="text-blue-500 font-bold text-lg">3D</div>
      <div className="flex flex-col gap-2">
        {mainTools.map((tool) => (
          <ToolButton
            key={tool.mode}
            label={tool.label}
            onClick={() => {
              if (tool.mode === 'animate') {
                setEditorMode('animate');
              } else { // It's a transform tool
                if (editorMode === 'animate') {
                  setTransformMode(tool.mode as TransformMode);
                } else {
                  setEditorMode(tool.mode as EditorMode);
                }
              }
            }}
            isActive={
              (editorMode === 'animate' && (tool.mode === 'animate' || tool.mode === transformMode)) ||
              (editorMode !== 'animate' && editorMode === tool.mode)
            }
          >
            {tool.icon}
          </ToolButton>
        ))}
      </div>
      <div className="w-full border-t border-zinc-700 my-2"></div>
      <div className="flex flex-col gap-2">
        {objectTools.map((tool) => (
          <ToolButton
            key={tool.type}
            label={tool.label}
            onClick={() => addObject(tool.type)}
          >
            {tool.icon}
          </ToolButton>
        ))}
      </div>
    </nav>
  );
};

export default Toolbar;