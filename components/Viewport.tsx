
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { Perf } from 'r3f-perf'

const Viewport: React.FC = () => {
  return (
    <div className="flex-grow h-full bg-zinc-800 relative">
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
        <Scene />
      </Canvas>
      <div className="absolute bottom-2 left-2 text-xs text-zinc-500">
        Use mouse to orbit, scroll to zoom, right-click to pan.
      </div>
    </div>
  );
};

export default Viewport;
