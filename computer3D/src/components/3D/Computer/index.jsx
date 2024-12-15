import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import Monitor from './Monitor'; ////update theis to make render happy
import Case from './Case';
import Keyboard from './Keyboard';
import { parseCoinMatchLog } from '../../../utils/parser';
import { DIMENSIONS } from './constants';

const Computer = ({ isMobile }) => {
  const groupRef = useRef();
  const [matches, setMatches] = useState([]);
  const [currentCoin, setCurrentCoin] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/coin-matches.log');
        const logContent = await response.text();
        const parsedMatches = parseCoinMatchLog(logContent);
        setMatches(parsedMatches);
        
        if (parsedMatches.length > 0) {
          setCurrentCoin(parsedMatches[0]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // This is the only place we handle mobile scaling
  const scale = isMobile ? 0.7 : 1;

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <Monitor 
        currentCoin={currentCoin}
        dimensions={DIMENSIONS.SCREEN}
      />
      <Case 
        position={[DIMENSIONS.SCREEN.width/2 + DIMENSIONS.CASE.width/2, -DIMENSIONS.CASE.height/2, 0]}
        dimensions={DIMENSIONS.CASE}
      />
      <Keyboard />
    </group>
  );
};

export default Computer;