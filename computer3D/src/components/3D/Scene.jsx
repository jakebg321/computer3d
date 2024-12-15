﻿// Scene.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Computer from './Computer';
import Table from './Computer/Table';
import Lamp from './Computer/Lamp';

export default function Scene() {
  return (
    <Canvas style={{ width: '100%', height: '100vh' }}>
      <color attach="background" args={['#000000']} />
      
      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, 5]} 
        fov={50}
      />
      
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight 
        position={[0, 0, 4]} 
        intensity={0.8} 
        color="#00ffff"
        distance={6}
        decay={2}
      />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
      
      <EffectComposer>
        <Bloom 
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          height={300}
        />
      </EffectComposer>
      
      {/* Scene Components */}
      <Table />
      <Computer />
      <Lamp />
    </Canvas>
  );
}