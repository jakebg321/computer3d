// src/components/3D/Computer/ComputerBase.jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

const ComputerBase = () => {
  const groupRef = useRef()
  
  // Define dimensions for consistent sizing
  const SCREEN = {
    width: 4,
    height: 3,
    depth: 0.2,
    bezelThickness: 0.1
  }

  const BASE = {
    width: 1.5,
    height: 0.5,
    depth: 1
  }

  const KEYBOARD = {
    width: 3,
    height: 0.1,
    depth: 1.2
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Monitor Screen */}
      <group position={[0, SCREEN.height / 2, 0]}>
        {/* Monitor Frame */}
        <mesh>
          <boxGeometry args={[SCREEN.width, SCREEN.height, SCREEN.depth]} />
          <meshStandardMaterial 
            color="#1a1a1a"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Screen Display */}
        <mesh position={[0, 0, SCREEN.depth / 2 + 0.01]}>
          <planeGeometry args={[SCREEN.width - 0.2, SCREEN.height - 0.2]} />
          <meshBasicMaterial color="black" />
          <Html
            transform
            occlude
            position={[0, 0, 0.01]}
            style={{
              width: `${(SCREEN.width - 0.4) * 100}px`,
              height: `${(SCREEN.height - 0.4) * 100}px`,
              background: '#000000',
              border: '1px solid #00ffff',
              color: '#00ffff',
              padding: '20px',
              fontSize: '14px',
            }}
          >
            <div>COINMATCH</div>
          </Html>
        </mesh>
      </group>

      {/* Monitor Stand */}
      <mesh position={[0, -0.25, -0.3]}>
        <boxGeometry args={[0.6, 1.5, BASE.depth]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Monitor Base */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[BASE.width, BASE.height, BASE.depth]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, -1.1, KEYBOARD.depth]}>
        <boxGeometry args={[KEYBOARD.width, KEYBOARD.height, KEYBOARD.depth]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

export default ComputerBase