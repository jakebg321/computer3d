// src/utils/dataLoader.js
import { parseCoinMatchLog } from './parser';
import { processHolderData } from './holderUtils';

export const loadInitialData = async () => {
  try {
    // Load and parse coin matches
    const matchesResponse = await fetch('/data/coin-matches.log');
    const matchesText = await matchesResponse.text();
    const matches = parseCoinMatchLog(matchesText);
    console.log('Parsed matches:', matches); // Debug log

    // Load processed crypto data
    const cryptoResponse = await fetch('/data/processed_crypto_data.json');
    const rawCryptoData = await cryptoResponse.json();
    const cryptoData = Array.isArray(rawCryptoData) ? rawCryptoData : Object.values(rawCryptoData);
    console.log('Processed crypto data:', cryptoData); // Debug log

    // Load holders data
    const holdersResponse = await fetch('/data/holders.json');
    const holdersData = await holdersResponse.json();
    
    // Ensure we have arrays to work with
    if (!Array.isArray(matches)) {
      console.error('Matches is not an array:', matches);
      return [];
    }

    // Combine data with proper checks
    const combinedData = matches.map(match => {
      const cryptoInfo = cryptoData.find(c => c?.contract === match?.coin?.contract) || {};
      const holders = holdersData[match?.coin?.contract] || [];
      
      return {
        ...match,
        marketData: cryptoInfo,
        holders: processHolderData(holders)
      };
    });

    return combinedData;
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
};

export const formatDisplayData = (combinedData) => {
  if (!combinedData) return null;
  
  return {
    leftPanel: combinedData.map(item => ({
      name: item.coin.name,
      memeTitle: item.meme.name,
      score: item.meme.matchScore,
      change: item.price.changes.h24
    })),
    
    rightPanel: (selectedCoin) => {
      if (!selectedCoin) return null;
      
      return {
        tokenDetails: {
          name: selectedCoin.coin.name,
          symbol: selectedCoin.coin.symbol,
          chain: selectedCoin.coin.chain,
          price: selectedCoin.price.current
        },
        performance: {
          h1: selectedCoin.price.changes.h1,
          h6: selectedCoin.price.changes.h6,
          h24: selectedCoin.price.changes.h24
        },
        volume: {
          h1: selectedCoin.volume.h1,
          h6: selectedCoin.volume.h6,
          h24: selectedCoin.volume.h24
        },
        links: selectedCoin.links
      };
    }
  };
};