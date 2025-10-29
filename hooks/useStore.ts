import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, ObjectType, SceneObject, AnimatableProperty, EditorMode, TransformMode } from '../types';

export const useStore = create<AppState>((set, get) => ({
  objects: [
    {
      id: uuidv4(),
      type: 'cube',
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#fca5a5',
      animations: {},
    }
  ],
  selectedObjectId: null,
  editorMode: 'translate',
  transformMode: 'translate',
  animationState: {
    isPlaying: false,
    currentTime: 0,
    duration: 5, // Default 5 second animation
    loop: true,
  },

  addObject: (type: ObjectType) => {
    const newObject: SceneObject = {
      id: uuidv4(),
      type,
      position: [
        (Math.random() - 0.5) * 4,
        1,
        (Math.random() - 0.5) * 4,
      ],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      animations: {},
    };
    set((state) => ({ objects: [...state.objects, newObject] }));
  },

  selectObject: (id: string | null) => {
    set({ selectedObjectId: id });
  },

  setEditorMode: (mode: EditorMode) => {
    if (mode !== 'animate') {
        set({ editorMode: mode, transformMode: mode });
    } else {
        set({ editorMode: mode });
    }
    
    if (mode !== 'animate') {
        // Stop animation when leaving animation mode
        get().setAnimationState({ isPlaying: false });
    }
  },
  
  setTransformMode: (mode: TransformMode) => {
    set({ transformMode: mode });
  },

  updateObject: (id, newProps) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...newProps } : obj
      ),
    }));
  },
  
  removeObject: (id: string) => {
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
    }));
  },

  setAnimationState: (newState) => {
    set((state) => ({
        animationState: { ...state.animationState, ...newState },
    }));
  },

  addKeyframe: (objectId: string, property: AnimatableProperty) => {
    const object = get().objects.find(obj => obj.id === objectId);
    if (!object) return;

    const currentTime = get().animationState.currentTime;
    const value = object[property];

    const newKeyframe = { time: currentTime, value };

    const existingClip = object.animations[property] || [];
    
    // Remove existing keyframe at the same time before adding new one
    const filteredClip = existingClip.filter(kf => kf.time !== currentTime);
    
    const newClip = [...filteredClip, newKeyframe].sort((a, b) => a.time - b.time);

    get().updateObject(objectId, {
        animations: {
            ...object.animations,
            [property]: newClip,
        }
    });
  },

  removeKeyframe: (objectId: string, property: AnimatableProperty, time: number) => {
    const object = get().objects.find(obj => obj.id === objectId);
    if (!object) return;

    const existingClip = object.animations[property] || [];
    const newClip = existingClip.filter(kf => kf.time !== time);

    get().updateObject(objectId, {
        animations: {
            ...object.animations,
            [property]: newClip,
        }
    });
  }
}));