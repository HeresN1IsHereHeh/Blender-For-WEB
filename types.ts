
export type TransformMode = 'translate' | 'rotate' | 'scale';
export type EditorMode = TransformMode | 'animate';

export type ObjectType = 'cube' | 'sphere' | 'cone' | 'torus' | 'plane';

export interface Keyframe {
  time: number;
  value: [number, number, number];
}

export type AnimatableProperty = 'position' | 'rotation' | 'scale';

export interface AnimationClips {
  position?: Keyframe[];
  rotation?: Keyframe[];
  scale?: Keyframe[];
}

export interface SceneObject {
  id: string;
  type: ObjectType;
  position: [number, number, number];
  rotation: [number, number, number]; // Stored as radians
  scale: [number, number, number];
  color: string;
  animations: AnimationClips;
}

export interface AppState {
  objects: SceneObject[];
  selectedObjectId: string | null;
  editorMode: EditorMode;
  transformMode: TransformMode;
  animationState: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    loop: boolean;
  };
  addObject: (type: ObjectType) => void;
  selectObject: (id: string | null) => void;
  setEditorMode: (mode: EditorMode) => void;
  setTransformMode: (mode: TransformMode) => void;
  updateObject: (id: string, newProps: Partial<SceneObject>) => void;
  removeObject: (id: string) => void;
  setAnimationState: (newState: Partial<AppState['animationState']>) => void;
  addKeyframe: (objectId: string, property: AnimatableProperty) => void;
  removeKeyframe: (objectId: string, property: AnimatableProperty, time: number) => void;
}