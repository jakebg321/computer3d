// src/components/3D/Computer/Case.jsx
const Case = () => {
  return (
    <mesh position={[1.5, 0, 0]}>
      <boxGeometry args={[0.8, 1.2, 0.8]} />
      <meshStandardMaterial 
        color="#1a1a1a"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

export default Case