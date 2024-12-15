// Monitor.jsx
import { useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { DIMENSIONS } from './constants';
import MonitorDisplay from './MonitorDisplay';
import { useFrame } from '@react-three/fiber';
import { Color, BackSide } from 'three';

const Monitor = ({ activeView }) => {
  const monitorRef = useRef();
  const glowRef = useRef();
  const { SCREEN, MONITOR_STAND, BASE } = DIMENSIONS;
  
  // Adjusted screen dimensions for better proportions
  const screenWidth = SCREEN.width - (SCREEN.bezelThickness * 2.5);
  const screenHeight = SCREEN.height - (SCREEN.bezelThickness * 2.5);

  // Subtle screen glow animation
  useFrame((state) => {
    if (glowRef.current) {
      const intensity = 0.2 + Math.sin(state.clock.getElapsedTime()) * 0.05;
      glowRef.current.material.emissiveIntensity = intensity;
    }
  });

  const retroColor = "#94a3a3"; // Softer retro color
  const screenGlow = new Color("#00ffff").multiplyScalar(0.6); // Softened glow

  return (
    <group ref={monitorRef}>
      {/* Main Monitor Body with Rounded Edges */}
      <mesh>
        <boxGeometry args={[SCREEN.width + 1.6, SCREEN.height + 0.9, SCREEN.depth]} />
        <meshStandardMaterial 
          color={retroColor}
          metalness={0.1}
          roughness={0.9}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Inset Screen Area (Dark Frame) */}
      <mesh position={[0, 0, SCREEN.depth/2 - 0.05]}>
        <boxGeometry args={[screenWidth + 0.4, screenHeight + 0.4, 0.1]} />
        <meshStandardMaterial 
          color="#121212"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Screen Glass Effect */}
      <mesh position={[0, 0, SCREEN.depth/2 - 0.02]}>
        <planeGeometry args={[screenWidth + 0.3, screenHeight + 0.3]} />
        <meshPhysicalMaterial 
          color="#000000"
          metalness={0.1}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          opacity={0.1}
          transparent={true}
        />
      </mesh>

      {/* Screen Display Group */}
      <group position={[0, 0, SCREEN.depth/2]}>
        {/* Black Background with Subtle Glow */}
        <mesh ref={glowRef}>
          <planeGeometry args={[screenWidth, screenHeight]} />
          <meshStandardMaterial 
            color="#000000"
            emissive={screenGlow}
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Content Layer */}
        <Html
          transform
          occlude
          distanceFactor={1}
          position={[0, 0, 0.001]}
          style={{
            width: `${screenWidth * 595}px`,
            height: `${screenHeight * 585}px`,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'transparent',
            pointerEvents: 'none',
          }}
          className="screen-container"
        >
          <MonitorDisplay activeView={activeView} />
        </Html>

        {/* Anti-glitch overlay */}
        <mesh position={[0, 0, -0.10101]}>
          <planeGeometry args={[screenWidth, screenHeight]} />
          <meshBasicMaterial 
            color="#000000"
            opacity={0.1}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Monitor Stand - More vintage style */}
      <mesh position={[0, -SCREEN.height/2 - MONITOR_STAND.height/2, 0]}>
        <boxGeometry 
          args={[MONITOR_STAND.width * 1.2, MONITOR_STAND.height, MONITOR_STAND.depth]} 
        />
        <meshStandardMaterial 
          color={retroColor}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Wider Base */}
      <mesh position={[0, -SCREEN.height/2 - MONITOR_STAND.height + 0.1, 0]}>
        <boxGeometry args={[BASE.width * 1.4, BASE.height, BASE.depth * 1.3]} />
        <meshStandardMaterial 
          color={retroColor}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Vintage-style Power LED */}
      <group position={[SCREEN.width/2 - 0.15, -SCREEN.height/2 + 0.15, SCREEN.depth/2]}>
        <pointLight color="#00ff00" intensity={0.3} distance={0.4} />
        <mesh>
          <sphereGeometry args={[0.025]} />
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#00ff00"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* Subtle Screen Edge Light */}
      <pointLight 
        position={[0, 0, SCREEN.depth * 0.8]}
        color="#00ffff"
        intensity={0.2}
        distance={1.5}
        decay={2}
      />

      {/* Ventilation Pattern */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={i} position={[SCREEN.width/2, (i - 3.5) * 0.15, 0]}>
          <mesh>
            <boxGeometry args={[10.03, 0.08, SCREEN.depth * 0.7]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default Monitor;