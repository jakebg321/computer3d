import { useState } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Text } from '@react-three/drei';
import { DIMENSIONS } from './constants';

const KeyboardKey = ({ position, label, isActive, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  const { emissive, scale } = useSpring({
    emissive: hovered ? 0.4 : isActive ? 0.3 : 0.1,
    scale: hovered ? 1.1 : 1
  });

  return (
    <animated.mesh
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.3, 0.1, 0.3]} />
      <animated.meshStandardMaterial
        color="#95c1d1"
        emissive="#00ffff"
        emissiveIntensity={emissive}
        metalness={0.5}
        roughness={0.2}
      />
      <Text
        position={[0, 0.06, 0]}
        fontSize={0.05}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </animated.mesh>
  );
};

const Keyboard = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { KEYBOARD } = DIMENSIONS;
  
  // Table surface calculation
  const TABLE_BASE_Y = -3.5;
  const TABLE_HEIGHT = 0.8;
  const TABLE_SURFACE_Y = TABLE_BASE_Y + (TABLE_HEIGHT / 2);
  
  // Position keyboard on table surface
  const KEYBOARD_Y = TABLE_SURFACE_Y + (KEYBOARD.height / 2);
  
  const position = {
    x: 0,
    y: KEYBOARD_Y,
    z: 2
  };
  
  const tabSpacing = KEYBOARD.width / 5;
  const tabs = [
    { label: 'MATCH', position: [-tabSpacing * 1.5, 0.06, 0.2] },
    { label: 'MAP', position: [-tabSpacing * 0.5, 0.06, 0.2] },
    { label: 'INFO', position: [tabSpacing * 0.5, 0.06, 0.2] },
    { label: 'DATA', position: [tabSpacing * 1.5, 0.06, 0.2] }
  ];

  return (
    <group 
      position={[position.x, position.y, position.z]}
      rotation={[0.1, 0, 0]} // Slight tilt
    >
      <mesh>
        <boxGeometry args={[KEYBOARD.width, KEYBOARD.height, KEYBOARD.depth]} />
        <meshStandardMaterial 
          color="#95c1d1"
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>

      {tabs.map((tab, index) => (
        <KeyboardKey
          key={index}
          position={tab.position}
          label={tab.label}
          isActive={activeTab === index}
          onClick={() => {
            setActiveTab(index);
            onTabChange?.(index);
          }}
        />
      ))}
    </group>
  );
};

export default Keyboard;