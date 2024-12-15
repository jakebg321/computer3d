export const selectRandomCoin = (coinsData, displayedCoins = []) => {
    console.log('Selecting random coin from', coinsData?.length, 'coins');
    console.log('Previously displayed coins:', displayedCoins);
    
    if (!coinsData || coinsData.length === 0) {
        console.log('No coin data available');
        return null;
    }
    
    // First filter by market cap and previously displayed coins
    let availableCoins = coinsData.filter(coin => 
        coin.coin_info.market_cap >= 300000 && // Market cap filter
        !displayedCoins.includes(coin.coin_info.contract_address)
    );
    console.log('Available coins after market cap and display filtering:', availableCoins.length);
    
    // If we've shown all valid coins, reset but keep market cap filter
    if (availableCoins.length === 0) {
        console.log('All coins shown, resetting selection pool with market cap filter');
        availableCoins = coinsData.filter(coin => 
            coin.coin_info.market_cap >= 300000
        );
    }

    const randomIndex = Math.floor(Math.random() * availableCoins.length);
    const selectedCoin = availableCoins[randomIndex];
    
    console.log('Selected coin:', selectedCoin?.coin_info?.name, 
                'Market Cap:', selectedCoin?.coin_info?.market_cap);
    return selectedCoin;
};
export const processHolderData = (holders, maxBubbles = 40) => {
    console.log('Processing holders:', holders?.length);
    
    if (!holders || !holders.length) {
        console.log('No holders to process');
        return [];
    }
    const sortedHolders = [...holders].sort((a, b) => 
        parseFloat(b.percentage) - parseFloat(a.percentage)
    );
    console.log('Sorted holders by percentage');

    const processedHolders = sortedHolders.slice(0, maxBubbles).map(holder => {
        const processed = {
            address: holder.address,
            balance: parseFloat(holder.balance),
            percentage: parseFloat(holder.percentage),
            shortAddress: `${holder.address.slice(0, 6)}...${holder.address.slice(-4)}`
        };
        return processed;
    });

    console.log('Processed holders count:', processedHolders.length);
    return processedHolders;
};

export const calculateBubbleLayout = (processedHolders, width, height) => {
    console.log('Calculating bubble layout for', processedHolders.length, 'holders');
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    const HUB_RADIUS = 60;
    const positions = [];

    const calculatedPositions = processedHolders.map((holder, index) => {
        console.log(`Calculating position for holder ${index + 1}/${processedHolders.length}`);
        let x, y, attempts = 0;
        const bubbleRadius = Math.max(30, Math.min(80, holder.percentage * 3));
        
        // Try to find a valid position
        do {
            const angle = Math.random() * Math.PI * 2;
            const radiusFactor = 1 - (holder.percentage / 100);
            const minRadius = maxRadius * 0.2 + HUB_RADIUS;
            const randomRadius = minRadius + (maxRadius - minRadius) * Math.random() * radiusFactor;
            
            x = centerX + Math.cos(angle) * randomRadius;
            y = centerY + Math.sin(angle) * randomRadius;
            attempts++;

            if (attempts > 50) {
                console.log(`Position adjustment needed for holder ${index} after ${attempts} attempts`);
                const pushOutFactor = 1.1;
                x = centerX + Math.cos(angle) * randomRadius * pushOutFactor;
                y = centerY + Math.sin(angle) * randomRadius * pushOutFactor;
                break;
            }
        } while (!isPositionValid(x, y, bubbleRadius, positions));

        const position = { x, y, radius: bubbleRadius };
        positions.push(position);

        return {
            ...holder,
            ...position,
            animationDelay: index * 0.5
        };
    });

    console.log('Finished calculating bubble positions');
    return calculatedPositions;
};

const isPositionValid = (x, y, radius, existingPositions) => {
    const HUB_RADIUS = 60;
    
    // Check distance from center
    const distanceFromCenter = Math.sqrt(Math.pow(x - 400, 2) + Math.pow(y - 300, 2));
    if (distanceFromCenter < HUB_RADIUS + radius) {
        return false;
    }
    
    // Check overlap with existing bubbles
    for (const pos of existingPositions) {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        if (distance < (radius + pos.radius)) {
            return false;
        }
    }
    
    return true;
};

export const formatNumberWithSuffix = (number) => {
    console.log('Formatting number:', number);
    if (!number || isNaN(number)) {
        console.log('Invalid number provided');
        return '0';
    }

    try {
        if (number >= 1e9) {
            return `${(number / 1e9).toFixed(2)}B`;
        } else if (number >= 1e6) {
            return `${(number / 1e6).toFixed(2)}M`;
        } else if (number >= 1e3) {
            return `${(number / 1e3).toFixed(2)}K`;
        }
        return number.toFixed(2);
    } catch (error) {
        console.error('Error formatting number:', error);
        return '0';
    }
};