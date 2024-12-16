import { useRef } from 'react';
import { DIMENSIONS } from './constants';

const Table = () => {
  const tableRef = useRef();
  
  const TABLE = {
    width: 11,
    height: 0.8,
    depth: 6,
    legWidth: 0.4,
    legHeight: 3,
    trimHeight: 0.2
  };

  // Fixed table position - no mobile adjustments
  const tableTopY = -3.5;
  const tableLegY = tableTopY - TABLE.legHeight / 2;

  const retroMaterial = {
    color: "#94a3a3",
    metalness: 0.1,
    roughness: 0.9,
    envMapIntensity: 0.3
  };

  return (
    <group ref={tableRef} position={[0, tableLegY, 1]}>
      {/* Table Top */}
      <mesh position={[0, TABLE.legHeight/2, 0]}>
        <boxGeometry args={[TABLE.width, TABLE.height, TABLE.depth]} />
        <meshStandardMaterial {...retroMaterial} />
      </mesh>

      {/* Table Legs */}
      {[
        [-TABLE.width/2 + TABLE.legWidth/2, -TABLE.legHeight/2, -TABLE.depth/2 + TABLE.legWidth/2],
        [-TABLE.width/2 + TABLE.legWidth/2, -TABLE.legHeight/2, TABLE.depth/2 - TABLE.legWidth/2],
        [TABLE.width/2 - TABLE.legWidth/2, -TABLE.legHeight/2, -TABLE.depth/2 + TABLE.legWidth/2],
        [TABLE.width/2 - TABLE.legWidth/2, -TABLE.legHeight/2, TABLE.depth/2 - TABLE.legWidth/2]
      ].map((position, index) => (
        <mesh key={index} position={position}>
          <boxGeometry args={[TABLE.legWidth, TABLE.legHeight, TABLE.legWidth]} />
          <meshStandardMaterial {...retroMaterial} />
        </mesh>
      ))}

      {/* Decorative Trim */}
      <mesh position={[0, -TABLE.legHeight/2 + TABLE.trimHeight/2, 0]}>
        <boxGeometry args={[TABLE.width + 0.1, TABLE.trimHeight, TABLE.depth + 0.1]} />
        <meshStandardMaterial 
          color="#121212"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

export default Table;