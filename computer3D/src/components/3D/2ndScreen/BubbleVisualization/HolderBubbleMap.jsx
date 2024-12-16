// src/components/3D/2ndScreen/BubbleVisualization/HolderBubbleMap.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BubbleVisualization from './BubbleVisualization';
import './styles.css';  // Import the CSS file

const HolderBubbleMap = () => {
    const [holderData, setHolderData] = useState([]);
    const [currentCoin, setCurrentCoin] = useState(null);
    const [displayedCoins, setDisplayedCoins] = useState([]);
    const [processedHolders, setProcessedHolders] = useState([]);
    const [hoveredHolder, setHoveredHolder] = useState(null);
    const ROTATION_INTERVAL = 15000;
    const MAX_DISPLAYED_COINS = 10;

    const processHolderData = (holders) => {
        console.log('Processing holders:', holders);
        return holders.map((holder, index) => {
            // Calculate position in a circular pattern
            const angle = (index / holders.length) * Math.PI * 2;
            const radius = 100; // Adjust based on monitor size
            return {
                address: holder.address,
                percentage: parseFloat(holder.percentage),
                balance: parseFloat(holder.balance),
                x: Math.cos(angle) * radius + 200, // Center X + offset
                y: Math.sin(angle) * radius + 150, // Center Y + offset
                radius: Math.max(10, Math.min(30, parseFloat(holder.percentage)))
            };
        });
    };

    const selectRandomCoin = useCallback((data = holderData) => {
        console.log('Selecting random coin from data:', data?.length);
        console.log('Currently displayed coins:', displayedCoins);
        
        if (!data?.length) {
            console.log('No data available for selection');
            return;
        }

        let availableCoins = data;
        
        // Reset if all coins shown
        if (displayedCoins.length >= data.length) {
            console.log('All coins shown, resetting display list');
            setDisplayedCoins([]);
            availableCoins = data;
        } else {
            // Filter out displayed coins
            availableCoins = data.filter(coin => 
                !displayedCoins.includes(coin.coin_info.contract_address)
            );
            console.log('Available coins after filtering:', availableCoins.length);
        }

        if (availableCoins.length === 0) {
            console.log('No available coins, resetting list');
            setDisplayedCoins([]);
            availableCoins = data;
        }

        const randomIndex = Math.floor(Math.random() * availableCoins.length);
        const selected = availableCoins[randomIndex];
        console.log('Selected coin:', selected);

        setCurrentCoin(selected);
        setDisplayedCoins(prev => [...prev, selected.coin_info.contract_address].slice(-MAX_DISPLAYED_COINS));

        if (selected?.holders) {
            console.log('Processing holders for visualization...');
            const processed = processHolderData(selected.holders);
            console.log('Processed holders:', processed.length);
            setProcessedHolders(processed);
        }
    }, [holderData, displayedCoins]);

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            console.log('Starting to load holder data...');
            try {
                const response = await fetch('/data/processed_crypto_data.json');
                console.log('Fetch response status:', response.status);
                const data = await response.json();
                console.log('Loaded holder data:', data);
                console.log('Number of coins loaded:', data.coins_data.length);
                
                setHolderData(data.coins_data);
                if (data.coins_data.length > 0) {
                    console.log('Selecting initial random coin...');
                    selectRandomCoin(data.coins_data);
                }
            } catch (error) {
                console.error('Error loading holder data:', error);
                console.log('Error details:', {
                    message: error.message,
                    stack: error.stack
                });
            }
        };
        
        loadData();
    }, []);

    // Rotation interval
    useEffect(() => {
        console.log('Setting up rotation interval');
        const interval = setInterval(() => {
            console.log('Rotation interval triggered');
            selectRandomCoin();
        }, ROTATION_INTERVAL);

        return () => {
            console.log('Cleaning up rotation interval');
            clearInterval(interval);
        };
    }, [selectRandomCoin]);

    console.log('Render state:', {
        currentCoin: currentCoin?.coin_info?.symbol,
        processedHoldersCount: processedHolders?.length,
        displayedCoinsCount: displayedCoins?.length
    });

    if (!currentCoin) {
        console.log('No current coin, returning null');
        return null;
    }

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-2 left-2 right-2">
                <div className="header-text">
                    <span className="font-bold">{currentCoin.coin_info.name}</span>
                    <span className="header-symbol">({currentCoin.coin_info.symbol})</span>
                </div>
                <div className="header-stats">
                    Price: ${currentCoin.coin_info.price_usd.toFixed(8)} • 
                    Market Cap: ${currentCoin.coin_info.market_cap.toLocaleString()}
                </div>
            </div>

            <BubbleVisualization
                visibleHolders={processedHolders}
                hoveredHolder={hoveredHolder}
                setHoveredHolder={setHoveredHolder}
                centerSymbol={currentCoin.coin_info.symbol}
            />
        </div>
    );
};

export default HolderBubbleMap;