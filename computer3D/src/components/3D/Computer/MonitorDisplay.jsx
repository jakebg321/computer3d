// MonitorDisplay.jsx
import { useState, useEffect } from 'react';
import { parseCoinMatchLog } from '../../../utils/parser';
import MatchFeed from './MatchFeed';
import TokenDetails from './TokenDetails';
import './styles.css';

const MonitorDisplay = ({ activeView = 0 }) => {
  const [allCoins, setAllCoins] = useState([]);
  const [displayedMatches, setDisplayedMatches] = useState([]);
  const [currentCoin, setCurrentCoin] = useState(null);
  const [displayedContracts, setDisplayedContracts] = useState(new Set());

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/coin-matches.log');
        const logContent = await response.text();
        const parsedMatches = parseCoinMatchLog(logContent);
        
        // Ensure proper data structure
        const transformedCoins = parsedMatches
          .filter(match => match && match.coin && match.coin.name) // Filter out invalid entries
          .map(match => ({
            coin: {
              name: match.coin.name,
              symbol: match.coin.symbol,
              chain: match.coin.chain,
              contract: match.coin.contract
            },
            price: {
              value: match.price?.value || 0,
              changes: {
                h1: match.price?.changes?.h1 || 0,
                h6: match.price?.changes?.h6 || 0,
                h24: match.price?.changes?.h24 || 0
              }
            },
            volume: {
              h1: match.volume?.h1 || 0,
              h6: match.volume?.h6 || 0,
              h24: match.volume?.h24 || 0
            },
            meme: {
              name: match.meme?.name || 'Unknown',
              matchScore: match.meme?.matchScore || 0
            }
          }));
        
        setAllCoins(transformedCoins);
        
        if (transformedCoins.length > 0) {
          const initial = transformedCoins[0];
          setCurrentCoin(initial);
          setDisplayedMatches([initial]);
          setDisplayedContracts(new Set([initial.coin.contract]));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Set empty states to prevent undefined errors
        setAllCoins([]);
        setDisplayedMatches([]);
        setCurrentCoin(null);
        setDisplayedContracts(new Set());
      }
    };

    loadData();
  }, []);

  // Coin cycling effect
  useEffect(() => {
    if (!allCoins.length) return;

    const interval = setInterval(() => {
      const unusedCoins = allCoins.filter(coin => 
        coin?.coin?.contract && !displayedContracts.has(coin.coin.contract)
      );

      if (unusedCoins.length > 0) {
        const randomIndex = Math.floor(Math.random() * unusedCoins.length);
        const newCoin = unusedCoins[randomIndex];
        
        setCurrentCoin(newCoin);
        setDisplayedMatches(prev => [newCoin, ...prev].slice(0, 7));
        setDisplayedContracts(prev => {
          const newSet = new Set(prev);
          if (newCoin?.coin?.contract) {
            newSet.add(newCoin.coin.contract);
          }
          if (newSet.size >= allCoins.length) {
            return new Set();
          }
          return newSet;
        });
      } else {
        setDisplayedContracts(new Set());
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [allCoins, displayedContracts]);

  return (
    <div className="screen-container">
      <div className="monitor-content">
        <div className="content-wrapper">
          <div className="left-panel">
            <MatchFeed matches={displayedMatches} />
          </div>
          <div className="right-panel">
            <TokenDetails coin={currentCoin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorDisplay;