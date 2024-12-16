import { useRef } from 'react';
import { DIMENSIONS } from './constants';

const Lamp = () => {
  const lampRef = useRef();
  
  // Increased lamp dimensions
  const LAMP = {
    base: {
      width: 0.8,     // Doubled from 0.4
      height: 0.2,    // Doubled from 0.1
      depth: 0.8      // Doubled from 0.4
    },
    arm: {
      width: 0.15,    // Increased from 0.1
      height: 1.6,    // Doubled from 0.8
      depth: 0.15     // Increased from 0.1
    },
    head: {
      width: 0.8,     // Doubled from 0.4
      height: 0.4,    // Doubled from 0.2
      depth: 0.8      // Doubled from 0.4
    }
  };

  // Calculate position on table surface (using same logic as keyboard)
  const TABLE_BASE_Y = -3.5;
  const TABLE_HEIGHT = 0.8;
  const TABLE_SURFACE_Y = TABLE_BASE_Y + (TABLE_HEIGHT / 2);
  
  // Position lamp on table surface (back right corner)
  const position = {
    x: 4,
    y: TABLE_SURFACE_Y + (LAMP.base.height / 2),
    z: -1.5  // Moved slightly further back
  };

  return (
    <group 
      ref={lampRef}
      position={[position.x, position.y, position.z]}
    >
      {/* Lamp Base */}
      <mesh>
        <cylinderGeometry args={[LAMP.base.width/2, LAMP.base.width/2, LAMP.base.height, 32]} />
        <meshStandardMaterial
          color="#95c1d1"
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>

      {/* Lamp Arm */}
      <mesh position={[0, LAMP.arm.height/2, 0]}>
        <boxGeometry args={[LAMP.arm.width, LAMP.arm.height, LAMP.arm.depth]} />
        <meshStandardMaterial
          color="#95c1d1"
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>

      {/* Lamp Head */}
      <group 
        position={[0, LAMP.arm.height, 0]}
        rotation={[-Math.PI/4, 0, 0]} // Tilt the head forward
      >
        <mesh>
          <cylinderGeometry args={[LAMP.head.width/2, LAMP.head.width/2 * 1.2, LAMP.head.height, 32]} />
          <meshStandardMaterial
            color="#95c1d1"
            metalness={0.2}
            roughness={0.4}
          />
        </mesh>

        {/* Light Source */}
        <pointLight
          position={[0, 0, 0]}
          color="#00ffff"
          intensity={1}  // Increased from 0.8
          distance={6}   // Increased from 4
          decay={2}
        />

        {/* Light Glow Effect */}
        <mesh position={[0, -LAMP.head.height/4, 0]}>
          <sphereGeometry args={[0.1]} /> // Increased from 0.05
          <meshBasicMaterial
            color="#00ffff"
            opacity={0.8}
            transparent
          />
        </mesh>
      </group>
    </group>
  );
};

export default Lamp;