export const parseCoinMatchLog = (logContent) => {
    console.log('Starting to parse log content');
    if (!logContent) {
      console.warn('No log content provided to parser');
      return [];
    }
  
    const matches = [];
    // Keep the original working split
    const sections = logContent.split('MATCH FOUND:');
    
    // Skip the first section (scanning info)
    sections.slice(1).forEach((section, index) => {
      try {
        // Get content up to next occurrence of double separator
        const matchSection = section.split('\n==================================================\n\n')[0];
        if (!matchSection.trim()) return;

        // Get name and symbol from the first line
        const firstLine = matchSection.trim();
        const nameSymbolMatch = firstLine.match(/^([^(]+)\(([^)]+)\)/);
        if (!nameSymbolMatch) {
          console.log('Failed to parse name/symbol from:', firstLine);
          return;
        }

        // Extract basic information
        const memeTitle = section.match(/Meme Title: ([^\n]+)/)?.[1]?.trim();
        const searchTerm = section.match(/Search Term: ([^\n]+)/)?.[1]?.trim();
        const matchScore = parseFloat(section.match(/Match Score: ([\d.]+)/)?.[1] || '0');

        // Extract chain and contract info
        const chain = section.match(/Chain: ([^\n]+)/)?.[1]?.trim();
        const contract = section.match(/Contract: ([^\n]+)/)?.[1]?.trim();
        const pairAddress = section.match(/Pair Address: ([^\n]+)/)?.[1]?.trim();
        const dex = section.match(/DEX: ([^\n]+)/)?.[1]?.trim();

        // Extract price information
        const currentPrice = section.match(/Current: \$([0-9.e-]+)/)?.[1]?.trim();
        
        // Price changes
        const priceChanges = {
          h1: section.match(/h1\s*:\s*([-0-9.]+)%/)?.[1] || '0',
          h6: section.match(/h6\s*:\s*([-0-9.]+)%/)?.[1] || '0',
          h24: section.match(/h24:\s*([-0-9.]+)%/)?.[1] || '0'
        };

        const volumeMatches = {
          h1: section.match(/h1\s*:\s*\$\s*([\d,]+\.?\d*)/)?.[1]?.replace(/,/g, '') || '0',
          h6: section.match(/h6\s*:\s*\$\s*([\d,]+\.?\d*)/)?.[1]?.replace(/,/g, '') || '0',
          h24: section.match(/h24:\s*\$\s*([\d,]+\.?\d*)/)?.[1]?.replace(/,/g, '') || '0'
        };

        // Extract liquidity
        const liquidityMatch = section.match(/Liquidity: \$([0-9,.]+)/);

        const links = {
          explorer: section.match(/Explorer: ([^\n]+)/)?.[1]?.trim(),
          dex: section.match(/dex_url: ([^\n]+)/)?.[1]?.trim(),
          dexscreener: section.match(/dexscreener: ([^\n]+)/)?.[1]?.trim(),
          dextools: section.match(/dextools: ([^\n]+)/)?.[1]?.trim()
        };

        const match = {
          id: `match-${index}`,
          meme: {
            name: memeTitle || 'Unknown Meme',
            searchTerm: searchTerm || '',
            matchScore: matchScore
          },
          coin: {
            name: nameSymbolMatch[1].trim(),
            symbol: nameSymbolMatch[2].trim(),
            chain: chain || '',
            contract: contract || '',
            pairAddress: pairAddress || '',
            dex: dex || ''
          },
          price: {
            current: currentPrice || '0',
            changes: priceChanges
          },
          volume: {
            h1: parseFloat(volumeMatches.h1) || 0,
            h6: parseFloat(volumeMatches.h6) || 0,
            h24: parseFloat(volumeMatches.h24) || 0
          },
          liquidity: parseFloat(liquidityMatch?.[1]?.replace(/,/g, '') || '0'),
          links: links
        };


        matches.push(match);
      } catch (error) {
        console.error('Error parsing section:', error);
        console.log('Problematic section start:', section.substring(0, 200));
      }
    });
  
    console.log('Total matches parsed:', matches.length);
    return matches;
};

export const validateCoinMatch = (match) => {
    const required = ['meme', 'coin', 'price', 'volume'];
    return required.every(field => match[field]);
};

export const analyzeCoinMatches = (matches) => {
    if (!matches || matches.length === 0) return null;
    
    return {
      totalMatches: matches.length,
      chains: [...new Set(matches.map(m => m.coin.chain))],
      topPerformers: matches
        .sort((a, b) => parseFloat(b.price.changes.h24) - parseFloat(a.price.changes.h24))
        .slice(0, 5),
      totalVolume24h: matches.reduce((sum, m) => sum + m.volume.h24, 0),
      averageMatchScore: matches.reduce((sum, m) => sum + m.meme.matchScore, 0) / matches.length
    };
};