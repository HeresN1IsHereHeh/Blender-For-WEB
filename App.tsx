
import React from 'react';
import Toolbar from './components/Toolbar';
import Viewport from './components/Viewport';
import PropertiesPanel from './components/PropertiesPanel';
import Outliner from './components/Outliner';
import Timeline from './components/Timeline';
import { useStore } from './hooks/useStore';

const App: React.FC = () => {
  const { editorMode } = useStore();

  return (
    <div className="flex h-screen w-screen bg-zinc-800 text-zinc-300 font-sans">
      <Toolbar />
      <main className="flex-1 h-full flex flex-col">
        <Viewport />
        {editorMode === 'animate' && <Timeline />}
      </main>
      <aside className="w-72 h-full bg-zinc-900 border-l border-zinc-700 flex flex-col">
        <Outliner />
        <PropertiesPanel />
      </aside>
    </div>
  );
};

export default App;
