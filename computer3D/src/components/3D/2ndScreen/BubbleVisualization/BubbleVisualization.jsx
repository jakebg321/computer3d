import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const BubbleVisualization = ({ 
    visibleHolders = [], 
    hoveredHolder, 
    setHoveredHolder,
    centerSymbol 
}) => {
    const [scanAngle, setScanAngle] = useState(0);
    const [discoveredHolders, setDiscoveredHolders] = useState(new Set());
    const [sweepCount, setSweepCount] = useState(0);
    const TOTAL_SWEEPS = 5;
    
    const CONSTANTS = {
        CENTER_X: 400,        
        CENTER_Y: 300,        
        HUB_RADIUS: 64,       // 4x the original 16
        DETECTION_ANGLE: Math.PI / 6,
        SCAN_SPEED: 0.05
    };

    // Add helper functions for collision detection
    const checkCollision = (bubble1, bubble2) => {
        const dx = bubble1.x - bubble2.x;
        const dy = bubble1.y - bubble2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = bubble1.radius + bubble2.radius + 5; // 5px padding
        return distance < minDistance;
    };

    const resolveCollisions = (holders) => {
        const ITERATIONS = 50;
        const FORCE_STRENGTH = 0.5;

        for (let iteration = 0; iteration < ITERATIONS; iteration++) {
            let moved = false;
            
            for (let i = 0; i < holders.length; i++) {
                for (let j = i + 1; j < holders.length; j++) {
                    const bubble1 = holders[i];
                    const bubble2 = holders[j];

                    if (checkCollision(bubble1, bubble2)) {
                        // Calculate repulsion vector
                        const dx = bubble2.x - bubble1.x;
                        const dy = bubble2.y - bubble1.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const minDistance = bubble1.radius + bubble2.radius + 5;
                        
                        if (distance < minDistance) {
                            const moveX = (dx / distance) * (minDistance - distance) * FORCE_STRENGTH;
                            const moveY = (dy / distance) * (minDistance - distance) * FORCE_STRENGTH;

                            // Move bubbles apart
                            bubble2.x += moveX;
                            bubble2.y += moveY;
                            bubble1.x -= moveX;
                            bubble1.y -= moveY;

                            // Keep within bounds
                            const boundaryPadding = Math.max(bubble1.radius, bubble2.radius);
                            const keepInBounds = (bubble) => {
                                bubble.x = Math.min(Math.max(bubble.x, boundaryPadding), 800 - boundaryPadding);
                                bubble.y = Math.min(Math.max(bubble.y, boundaryPadding), 600 - boundaryPadding);
                            };

                            keepInBounds(bubble1);
                            keepInBounds(bubble2);

                            moved = true;
                        }
                    }
                }
            }

            if (!moved) break; // Stop if no collisions were resolved
        }

        return holders;
    };

    // Process and group holders
    const processedHolders = useMemo(() => {
        if (!visibleHolders?.length) return [];

        const sortedHolders = [...visibleHolders]
            .sort((a, b) => b.percentage - a.percentage);

        let holders = sortedHolders.map((holder, index) => {
            const baseGroupSize = Math.ceil(sortedHolders.length / TOTAL_SWEEPS);
            const randomOffset = Math.floor(Math.random() * TOTAL_SWEEPS);
            const discoveryGroup = (Math.floor(index / baseGroupSize) + randomOffset) % TOTAL_SWEEPS;

            // Random angle and distance for more natural distribution
            const angle = Math.random() * Math.PI * 2;
            const minDistance = 120;  // Increased minimum distance
            const maxDistance = 300;  // Increased maximum distance
            const distance = minDistance + (Math.random() * (maxDistance - minDistance));
            
            // Convert to cartesian coordinates
            const x = CONSTANTS.CENTER_X + Math.cos(angle) * distance;
            const y = CONSTANTS.CENTER_Y + Math.sin(angle) * distance;

            // 4x the bubble radius scaling
            const bubbleRadius = Math.max(32, Math.min(80, 24 + (holder.percentage * 4)));

            return {
                ...holder,
                x,
                y,
                radius: bubbleRadius,
                angle,
                discoveryGroup,
                uniqueId: `holder-${index}-${holder.address.slice(0, 8)}`
            };
        });

        // Apply collision resolution
        holders = resolveCollisions(holders);

        return holders;
    }, [visibleHolders]);

    // Radar scanning effect with sweep counting
    useEffect(() => {
        const scanInterval = setInterval(() => {
            setScanAngle(prev => {
                const newAngle = (prev + CONSTANTS.SCAN_SPEED) % (Math.PI * 2);
                
                if (newAngle < prev) {
                    setSweepCount(prev => (prev + 1) % TOTAL_SWEEPS);
                }

                processedHolders.forEach(holder => {
                    if (holder.discoveryGroup <= sweepCount) {
                        const holderAngle = Math.atan2(
                            holder.y - CONSTANTS.CENTER_Y,
                            holder.x - CONSTANTS.CENTER_X
                        );
                        
                        // Normalize angles to 0-2π range
                        const normalizedScanAngle = (newAngle + Math.PI * 2) % (Math.PI * 2);
                        const normalizedHolderAngle = (holderAngle + Math.PI * 2) % (Math.PI * 2);
                        
                        // Check if holder is in detection zone
                        const angleDiff = Math.abs(normalizedScanAngle - normalizedHolderAngle);
                        if (angleDiff < CONSTANTS.DETECTION_ANGLE || 
                            Math.abs(angleDiff - Math.PI * 2) < CONSTANTS.DETECTION_ANGLE) {
                            setDiscoveredHolders(prev => new Set([...prev, holder.uniqueId]));
                        }
                    }
                });

                return newAngle;
            });
        }, 50);

        return () => clearInterval(scanInterval);
    }, [processedHolders, sweepCount]);

    // Reset states when holders change
    useEffect(() => {
        setDiscoveredHolders(new Set());
        setSweepCount(0);
    }, [visibleHolders]);

    const visibleHoldersArray = useMemo(() => {
        return processedHolders.filter(holder => discoveredHolders.has(holder.uniqueId));
    }, [processedHolders, discoveredHolders]);

    const topHolders = useMemo(() => {
        return [...visibleHoldersArray]
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5);
    }, [visibleHoldersArray]);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <svg 
                viewBox="0 0 800 600"  
                preserveAspectRatio="xMidYMid meet"
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.95)'
                }}
            >
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="blur" in2="SourceGraphic" operator="over" />
                    </filter>

                    <linearGradient id="radar-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#89CFF0" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#89CFF0" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Background circles - scale up ring sizes */}
                {[1, 2, 3].map((ring) => (
                    <circle
                        key={`ring-${ring}`}
                        cx={CONSTANTS.CENTER_X}
                        cy={CONSTANTS.CENTER_Y}
                        r={ring * 40}  // Doubled from 20
                        fill="none"
                        stroke="#89CFF0"
                        strokeWidth="2"  // Scaled up
                        opacity="0.2"
                    />
                ))}

                {/* Radar Scanner - scale up scan length */}
                <motion.path
                    d={`M ${CONSTANTS.CENTER_X} ${CONSTANTS.CENTER_Y} L ${
                        CONSTANTS.CENTER_X + Math.cos(scanAngle) * 160
                    } ${
                        CONSTANTS.CENTER_Y + Math.sin(scanAngle) * 160
                    }`}
                    stroke="url(#radar-gradient)"
                    strokeWidth="8"  // Scaled up
                    opacity="0.6"
                    style={{ 
                        transform: `rotate(${scanAngle}rad)`,
                        transformOrigin: `${CONSTANTS.CENTER_X}px ${CONSTANTS.CENTER_Y}px`
                    }}
                />

                {/* Connections for top holders */}
                {topHolders.map((holder) => (
                    <g key={`connection-${holder.uniqueId}`}>
                        <line
                            x1={CONSTANTS.CENTER_X}
                            y1={CONSTANTS.CENTER_Y}
                            x2={holder.x}
                            y2={holder.y}
                            stroke="#89CFF0"
                            strokeWidth="2"  // Scaled up
                            opacity="0.3"
                        />
                        <motion.circle
                            cx={CONSTANTS.CENTER_X}
                            cy={CONSTANTS.CENTER_Y}
                            r="2"  // Scaled up
                            fill="#89CFF0"
                            animate={{
                                cx: [CONSTANTS.CENTER_X, holder.x],
                                cy: [CONSTANTS.CENTER_Y, holder.y]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </g>
                ))}

                {/* Holder Bubbles */}
                <AnimatePresence>
                    {visibleHoldersArray.map((holder) => {
                        const isTopHolder = topHolders.includes(holder);
                        return (
                            <motion.g
                                key={holder.uniqueId}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                onMouseEnter={() => setHoveredHolder(holder.address)}
                                onMouseLeave={() => setHoveredHolder(null)}
                            >
                                <circle
                                    cx={holder.x}
                                    cy={holder.y}
                                    r={holder.radius}
                                    fill="none"
                                    stroke="#89CFF0"
                                    strokeWidth={isTopHolder ? "3" : "2"}  // Scaled up
                                    opacity={isTopHolder ? "1" : "0.6"}
                                    filter="url(#glow)"
                                />
                                <text
                                    x={holder.x}
                                    y={holder.y}
                                    fill="#89CFF0"
                                    fontSize={holder.radius * .8}  // Adjusted for better proportion
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {holder.percentage.toFixed(2)}%
                                </text>
                            </motion.g>
                        );
                    })}
                </AnimatePresence>

                {/* Center Hub */}
                <g filter="url(#glow)">
                    <circle
                        cx={CONSTANTS.CENTER_X}
                        cy={CONSTANTS.CENTER_Y}
                        r={CONSTANTS.HUB_RADIUS}
                        fill="none"
                        stroke="#89CFF0"
                        strokeWidth="4"  // Scaled up
                    />
                    <text
                        x={CONSTANTS.CENTER_X}
                        y={CONSTANTS.CENTER_Y}
                        fill="#89CFF0"
                        fontSize="48"  // 4x the original 12
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        {centerSymbol}
                    </text>
                </g>
            </svg>
        </div>
    );
};

BubbleVisualization.propTypes = {
    visibleHolders: PropTypes.arrayOf(PropTypes.shape({
        address: PropTypes.string.isRequired,
        percentage: PropTypes.number.isRequired
    })).isRequired,
    hoveredHolder: PropTypes.string,
    setHoveredHolder: PropTypes.func.isRequired,
    centerSymbol: PropTypes.string.isRequired
};

export default BubbleVisualization;