
import React from 'react';
import { useStore } from '../hooks/useStore';
import { Box, Circle, Cone, Torus, Square } from 'lucide-react';
import type { ObjectType } from '../types';

const getIconForType = (type: ObjectType) => {
  switch (type) {
    case 'cube': return <Box className="w-4 h-4 mr-2" />;
    case 'sphere': return <Circle className="w-4 h-4 mr-2" />;
    case 'cone': return <Cone className="w-4 h-4 mr-2" />;
    case 'torus': return <Torus className="w-4 h-4 mr-2" />;
    case 'plane': return <Square className="w-4 h-4 mr-2" />;
    default: return <Box className="w-4 h-4 mr-2" />;
  }
}

const Outliner: React.FC = () => {
  const { objects, selectedObjectId, selectObject } = useStore();

  return (
    <div className="p-2 border-b border-zinc-700 flex-shrink-0">
      <h2 className="text-sm font-bold mb-2 px-2 text-zinc-400">Scene Collection</h2>
      <div className="max-h-60 overflow-y-auto">
        <ul>
          {objects.map((obj) => (
            <li
              key={obj.id}
              onClick={() => selectObject(obj.id)}
              className={`flex items-center text-sm px-2 py-1 rounded-md cursor-pointer ${
                selectedObjectId === obj.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-zinc-700'
              }`}
            >
              {getIconForType(obj.type)}
              <span className="capitalize flex-grow truncate">{`${obj.type}`}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Outliner;
