// RetroMonitor.jsx
import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const RetroMonitor = ({ activeView }) => {
    const monitorRef = useRef();
    const glowRef = useRef();

    // Keeping exact working positions
    const BASE = {
        POSITION: [-10, 1, 0],
        ROTATION: [0, Math.PI * 0.15, 0]
    };

    const BUBBLE_MAP = {
        GROUP_POSITION: [3, -2.1, 0.2],
        HTML_POSITION: [1.9, -1, 1.001],
        ROTATION: [0.0, -Math.PI * 0.15 + 0.4, 0.0],
        SCALE: [0.15, 0.15, 0.15],
        DIMENSIONS: {
            width: 1500,
            height: 1200
        }
    };

    const SCREEN = {
        width: (BUBBLE_MAP.DIMENSIONS.width * BUBBLE_MAP.SCALE[0]) / 40,
        height: (BUBBLE_MAP.DIMENSIONS.height * BUBBLE_MAP.SCALE[1]) / 40,
        depth: 0.4,
        position: BUBBLE_MAP.GROUP_POSITION
    };

    const CASE = {
        width: SCREEN.width + 0.8,
        height: SCREEN.height + 0.8,
        depth: 2,
        position: [
            SCREEN.position[0]-1,
            SCREEN.position[1]+1.5,
            SCREEN.position[2] - 0.4
        ]
    };

    useFrame((state) => {
        if (glowRef.current) {
            const intensity = 0.5 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
            glowRef.current.material.emissiveIntensity = intensity;
        }
    });

    return (
        <group position={BASE.POSITION} rotation={BASE.ROTATION}>
            {/* Monitor Case - Back */}
            <mesh position={[
                CASE.position[0],
                CASE.position[1],
                CASE.position[2] - 0.2
            ]}>
                <boxGeometry args={[CASE.width, CASE.height, CASE.depth - 0.4]} />
                <meshPhysicalMaterial
                    color="#89CFF0"
                    metalness={0.2}
                    roughness={0.3}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </mesh>

            {/* Screen Glass - Behind Content */}
            <mesh position={[
                CASE.position[0],
                CASE.position[1],
                CASE.position[2] + CASE.depth/2 - 0.2
            ]}>
                <boxGeometry args={[
                    CASE.width - 0.4,
                    CASE.height - 0.4,
                    0.1
                ]} />
                <meshPhysicalMaterial
                    color="#000000"
                    metalness={0.1}
                    roughness={0.1}
                    transparent={true}
                    opacity={0.9}
                    side={2}
                />
            </mesh>

            {/* Bubble Map Screen */}
            <group position={BUBBLE_MAP.GROUP_POSITION}>
                <Html
                    transform
                    occlude
                    prepend
                    center
                    scale={BUBBLE_MAP.SCALE}
                    rotation={BUBBLE_MAP.ROTATION}
                    position={BUBBLE_MAP.HTML_POSITION}
                    style={{
                        width: `${BUBBLE_MAP.DIMENSIONS.width}px`,
                        height: `${BUBBLE_MAP.DIMENSIONS.height}px`,
                        transform: 'translate(-50%, -50%)',
                        transformOrigin: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        border: '1px solid #89CFF0',
                        overflow: 'hidden',
                        zIndex: 1
                    }}
                >
                    {activeView}
                </Html>
            </group>

            {/* Screen Bezel - Front */}
            <mesh position={[
                CASE.position[0],
                CASE.position[1],
                CASE.position[2] + CASE.depth/2
            ]}>
                <boxGeometry args={[
                    CASE.width,
                    CASE.height,
                    0.2
                ]} />
                <meshPhysicalMaterial
                    color="#89CFF0"
                    metalness={0.3}
                    roughness={0.2}
                    transparent={true}
                    opacity={1}
                />
            </mesh>

            {/* Screen Frame */}
            <mesh position={[
                CASE.position[0],
                CASE.position[1],
                CASE.position[2] + CASE.depth/2 - 0.1
            ]}>
                <boxGeometry args={[
                    CASE.width - 0.3,
                    CASE.height - 0.3,
                    0.1
                ]} />
                <meshPhysicalMaterial
                    color="#111111"
                    metalness={0.5}
                    roughness={0.2
                } />
            </mesh>

            {/* Control Buttons */}
            <group position={[
                CASE.position[0] + CASE.width/2 - 0.2,
                CASE.position[1] - CASE.height/3,
                CASE.position[2] + CASE.depth/2 - 0.1
            ]}>
                {[0, 0.3, 0.6].map((y, i) => (
                    <mesh key={i} position={[0, y, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
                        <meshPhysicalMaterial
                            color="#222222"
                            metalness={0.5}
                            roughness={0.4}
                        />
                    </mesh>
                ))}
            </group>

            {/* Screen Glow */}
            <pointLight
                position={[
                    CASE.position[0],
                    CASE.position[1],
                    CASE.position[2] + 1
                ]}
                color="#89CFF0"
                intensity={0.3}
                distance={3}
                decay={2}
            />
        </group>
    );
};

export default RetroMonitor;