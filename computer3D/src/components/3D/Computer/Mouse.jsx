import { useRef } from 'react';
import { CatmullRomCurve3, Vector3, Shape, ExtrudeGeometry, TubeGeometry } from 'three';
import { DIMENSIONS } from './constants';

const Mouse = () => {
  const mouseRef = useRef();
  const { MOUSE, KEYBOARD } = DIMENSIONS;
  
  const TABLE_BASE_Y = -3.5;
  const TABLE_HEIGHT = 0.8;
  const TABLE_SURFACE_Y = TABLE_BASE_Y + (TABLE_HEIGHT / 2);
  const KEYBOARD_Y = TABLE_SURFACE_Y + (KEYBOARD.height / 2);
  
  const position = {
    x: MOUSE.positionX || 2,
    y: KEYBOARD_Y,
    z: MOUSE.positionZ || 2
  };

  // Mouse body shape
  const mouseShape = new Shape();
  mouseShape.moveTo(-0.3, -0.5);
  mouseShape.quadraticCurveTo(-0.35, -0.4, -0.35, -0.3);
  mouseShape.quadraticCurveTo(-0.35, 0.4, -0.3, 0.5);
  mouseShape.quadraticCurveTo(-0.2, 0.6, 0, 0.6);
  mouseShape.quadraticCurveTo(0.2, 0.6, 0.3, 0.5);
  mouseShape.quadraticCurveTo(0.35, 0.4, 0.35, -0.3);
  mouseShape.quadraticCurveTo(0.35, -0.4, 0.3, -0.5);
  mouseShape.quadraticCurveTo(0.2, -0.6, 0, -0.6);
  mouseShape.quadraticCurveTo(-0.2, -0.6, -0.3, -0.5);

  const extrudeSettings = {
    steps: 2,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3
  };

  // Enhanced wire curve with more pronounced path
  const wireCurve = new CatmullRomCurve3([
    // Start from monitor
    new Vector3(0, TABLE_SURFACE_Y + DIMENSIONS.MONITOR_STAND.height, 0),
    // Initial drop
    new Vector3(0.5, TABLE_SURFACE_Y + 0.3, 0.5),
    // Curve along table
    new Vector3(3, TABLE_SURFACE_Y + 0.15, 1),
    // Approach mouse
    new Vector3(position.x - .3, TABLE_SURFACE_Y + 0.1, position.z - 0.92),
    // Connect to mouse
    new Vector3(position.x, position.y + 0.08, position.z - 0.3)
  ]);

  return (
    <group ref={mouseRef}>
      {/* Main Mouse Body */}
      <group 
        position={[position.x, position.y + 0.1, position.z]} 
        rotation={[-Math.PI / 2, Math.PI, 0]}
      >
        {/* Base Mouse Shape */}
        <mesh>
          <extrudeGeometry args={[mouseShape, extrudeSettings]} />
          <meshPhysicalMaterial 
            color="#94a3a3"
            metalness={0.3}
            roughness={0.7}
            clearcoat={0.3}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* Left Button - Made more prominent */}
        <mesh position={[-0.15, 0.15, 0.21]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.25, 0.35, 0.02]} />
          <meshPhysicalMaterial 
            color="#858585"
            metalness={0.4}
            roughness={0.6}
            clearcoat={0.2}
          />
        </mesh>

        {/* Right Button - Made more prominent */}
        <mesh position={[0.15, 0.15, 0.21]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.25, 0.35, 0.02]} />
          <meshPhysicalMaterial 
            color="#858585"
            metalness={0.4}
            roughness={0.6}
            clearcoat={0.2}
          />
        </mesh>

        {/* Button Divider - More visible */}
        <mesh position={[0, 0.15, 0.21]}>
          <boxGeometry args={[0.02, 0.35, 0.025]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>

      {/* Enhanced Wire using Tube Geometry for better visibility */}
      <mesh>
        <tubeGeometry args={[wireCurve, 64, 0.025, 8, false]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Wire strain relief */}
      <mesh 
        position={[position.x, position.y + 0.05, position.z - 0.3]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
};

export default Mouse;