import React, { useRef, useMemo, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import * as THREE from 'three';
import { OrbitControls, TransformControls } from '@react-three/drei';
import type { SceneObject, Keyframe, AnimatableProperty } from '../types';
import { useFrame } from '@react-three/fiber';

// --- Helper functions for animation ---

const getInterpolatedValue = (keyframes: Keyframe[], time: number, property: AnimatableProperty): [number, number, number] => {
  if (!keyframes || keyframes.length === 0) {
    return [0, 0, 0]; // Should not happen if called correctly
  }
  if (keyframes.length === 1 || time <= keyframes[0].time) {
    return keyframes[0].value;
  }
  if (time >= keyframes[keyframes.length - 1].time) {
    return keyframes[keyframes.length - 1].value;
  }

  const nextKeyIndex = keyframes.findIndex(kf => kf.time > time);
  const prevKey = keyframes[nextKeyIndex - 1];
  const nextKey = keyframes[nextKeyIndex];
  
  const progress = (time - prevKey.time) / (nextKey.time - prevKey.time);

  const prevValue = prevKey.value;
  const nextValue = nextKey.value;
  
  if (property === 'rotation') {
      const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(...prevValue));
      const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(...nextValue));
      const qm = new THREE.Quaternion().slerpQuaternions(q1, q2, progress);
      const euler = new THREE.Euler().setFromQuaternion(qm, 'XYZ');
      return [euler.x, euler.y, euler.z];
  } else {
      const v1 = new THREE.Vector3(...prevValue);
      const v2 = new THREE.Vector3(...nextValue);
      const vm = new THREE.Vector3().lerpVectors(v1, v2, progress);
      return [vm.x, vm.y, vm.z];
  }
};


interface MeshComponentProps {
  object: SceneObject;
}

const MeshComponent = React.forwardRef<THREE.Mesh, MeshComponentProps>(({ object }, ref) => {
  const { selectObject, animationState } = useStore();
  const meshRef = ref as React.MutableRefObject<THREE.Mesh>;

  const geometry = useMemo(() => {
    switch (object.type) {
      case 'sphere': return new THREE.SphereGeometry(0.75, 32, 32);
      case 'cone': return new THREE.ConeGeometry(0.75, 1.5, 32);
      case 'torus': return new THREE.TorusGeometry(0.5, 0.25, 16, 100);
      case 'plane': return new THREE.PlaneGeometry(2, 2);
      case 'cube': default: return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [object.type]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    const { currentTime } = animationState;
    const { animations } = object;

    const hasPositionKeys = animations.position && animations.position.length > 0;
    const hasRotationKeys = animations.rotation && animations.rotation.length > 0;
    const hasScaleKeys = animations.scale && animations.scale.length > 0;

    if (hasPositionKeys) {
        const iPos = getInterpolatedValue(animations.position!, currentTime, 'position');
        meshRef.current.position.set(...iPos);
    } else {
        meshRef.current.position.set(...object.position);
    }

    if (hasRotationKeys) {
        const iRot = getInterpolatedValue(animations.rotation!, currentTime, 'rotation');
        meshRef.current.rotation.set(...iRot);
    } else {
        meshRef.current.rotation.set(...object.rotation);
    }

    if (hasScaleKeys) {
        const iScale = getInterpolatedValue(animations.scale!, currentTime, 'scale');
        meshRef.current.scale.set(...iScale);
    } else {
        meshRef.current.scale.set(...object.scale);
    }
  });


  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    selectObject(object.id);
  };
  
  return (
    <mesh
      ref={ref}
      onPointerDown={handlePointerDown}
      castShadow
      receiveShadow
    >
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color={object.color} />
    </mesh>
  );
});

const Scene: React.FC = () => {
  const { objects, selectedObjectId, transformMode, selectObject, updateObject, animationState, setAnimationState } = useStore();
  const sceneObjectRefs = useRef<Map<string, THREE.Object3D>>(new Map());

  useEffect(() => {
    sceneObjectRefs.current = new Map();
  }, [objects]);

  useFrame((_, delta) => {
    if (animationState.isPlaying) {
      let newTime = animationState.currentTime + delta;
      if (newTime > animationState.duration) {
        if (animationState.loop) {
          newTime = newTime % animationState.duration;
        } else {
          newTime = animationState.duration;
          setAnimationState({ isPlaying: false });
        }
      }
      setAnimationState({ currentTime: newTime });
    }
  });

  const selectedObjectRef = selectedObjectId ? sceneObjectRefs.current.get(selectedObjectId) : undefined;

  const handleTransformChange = (e: THREE.Event | undefined) => {
    if (e && e.target.object && selectedObjectId) {
      const { position, rotation, scale } = e.target.object;
      updateObject(selectedObjectId, {
        position: [position.x, position.y, position.z],
        rotation: [rotation.x, rotation.y, rotation.z],
        scale: [scale.x, scale.y, scale.z],
      });
    }
  };

  return (
    <>
      <color attach="background" args={['#27272a']} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <gridHelper args={[100, 100, '#444444', '#888888']} />

      <OrbitControls makeDefault />

      {selectedObjectRef && (
        <TransformControls
          object={selectedObjectRef}
          mode={transformMode}
          onMouseUp={handleTransformChange}
        />
      )}

      {objects.map((obj) => (
        <MeshComponent
          key={obj.id}
          object={obj}
          ref={(el) => {
            if (el) {
              sceneObjectRefs.current.set(obj.id, el);
            } else {
              sceneObjectRefs.current.delete(obj.id);
            }
          }}
        />
      ))}
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </>
  );
};

export default Scene;