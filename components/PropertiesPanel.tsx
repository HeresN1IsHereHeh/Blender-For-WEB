import React from 'react';
import { useStore } from '../hooks/useStore';
import { MathUtils } from 'three';
import { Trash2 } from 'lucide-react';
import AnimationPanel from './AnimationPanel';

interface Vector3InputProps {
  label: string;
  value: [number, number, number];
  onChange: (value: [number, number, number]) => void;
  step?: number;
  isDegrees?: boolean;
}

const Vector3Input: React.FC<Vector3InputProps> = ({ label, value, onChange, step = 0.1, isDegrees = false }) => {
  const handleInputChange = (axis: number, val: string) => {
    const numericValue = parseFloat(val) || 0;
    // FIX: Spreading a tuple creates an array, but TypeScript infers its type as a
    // general array (e.g., number[]) rather than a tuple. We use a type assertion
    // to ensure the new array is treated as a [number, number, number] tuple.
    const newValue = [...value] as [number, number, number];
    newValue[axis] = isDegrees ? MathUtils.degToRad(numericValue) : numericValue;
    onChange(newValue);
  };

  const displayValue = isDegrees
    ? value.map(v => parseFloat(MathUtils.radToDeg(v).toFixed(2)))
    // Ensure we handle potential NaN or undefined values gracefully
    : value.map(v => parseFloat((v || 0).toFixed(2)));

  return (
    <div className="mb-2">
      <label className="text-xs text-zinc-400">{label}</label>
      <div className="grid grid-cols-3 gap-2 mt-1">
        {(['X', 'Y', 'Z'] as const).map((axis, index) => (
          <div key={axis} className="relative">
            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">{axis}</span>
            <input
              type="number"
              step={step}
              value={displayValue[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-full bg-zinc-700 rounded-md p-1 pl-5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const PropertiesPanel: React.FC = () => {
  const { selectedObjectId, objects, updateObject, removeObject, editorMode } = useStore();
  const selectedObject = objects.find((obj) => obj.id === selectedObjectId);

  if (!selectedObject) {
    return (
      <div className="p-4 text-center text-sm text-zinc-500 flex-grow">
        Select an object to see its properties.
      </div>
    );
  }

  const handleUpdate = <K extends keyof typeof selectedObject>(
    prop: K,
    value: (typeof selectedObject)[K]
  ) => {
    if (selectedObjectId) {
      updateObject(selectedObjectId, { [prop]: value });
    }
  };
  
  const handleDelete = () => {
    if(selectedObjectId) {
      removeObject(selectedObjectId);
    }
  }

  return (
    <div className="p-4 flex-grow overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-zinc-400 capitalize">{selectedObject.type} Properties</h2>
        <button onClick={handleDelete} title="Delete Object" className="p-1 text-red-400 hover:text-red-300 hover:bg-zinc-700 rounded-md">
           <Trash2 size={16} />
        </button>
      </div>

      {editorMode === 'animate' && <AnimationPanel />}

      <Vector3Input
        label="Position"
        value={selectedObject.position}
        onChange={(v) => handleUpdate('position', v)}
      />
      <Vector3Input
        label={`Rotation ${String.fromCharCode(176)}`}
        value={selectedObject.rotation}
        onChange={(v) => handleUpdate('rotation', v)}
        step={1}
        isDegrees={true}
      />
      <Vector3Input
        label="Scale"
        value={selectedObject.scale}
        onChange={(v) => handleUpdate('scale', v)}
      />
       <div className="mt-4">
          <label className="text-xs text-zinc-400">Color</label>
          <input
            type="color"
            value={selectedObject.color}
            onChange={(e) => handleUpdate('color', e.target.value)}
            className="w-full h-8 mt-1 p-0 border-none rounded-md cursor-pointer bg-zinc-700"
          />
        </div>
    </div>
  );
};

export default PropertiesPanel;