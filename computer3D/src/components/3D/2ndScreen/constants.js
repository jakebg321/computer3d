// src/components/3D/2ndScreen/constants.js

export const RETRO_MONITOR = {
    POSITION: {
      X: -10,
      Y: 1,
      Z: 0,
    },
    ROTATION: {
      Y: Math.PI * 0.15 // 15 degrees
    },
    DIMENSIONS: {
      SCREEN: {
        width: 4,
        height: 3,
        depth: 0.4,
        bezelThickness: 0.5,
      },
      KEYBOARD: {
        width: 2.8,
        height: 0.15,
        depth: 1.8,
        angle: Math.PI * -0.1, // Slight angle for ergonomics
        keySpacing: 0.28, // Space between keys
        keySize: {
          width: 0.25,
          height: 0.05,
          depth: 0.18
        },
        layout: {
          rows: 8,
          cols: 15
        }
      },
      CASE: {
        width: 4.4,
        height: 3.8,
        depth: 2,
        bottomHeight: 0.8, // Extra height for the bottom portion
        standWidth: 0.2 // Width ratio for the bottom stand
      },
      CONTENT: {
      scale: 0.25,        // Reduced from 4.5
      zOffset: 0.001     // Reduced from 0.003
      }
    },
  
    // Colors
    COLORS: {
      PRIMARY: "#89CFF0", // Light blue matching reference
      GLOW: "#89CFF0",
      KEYS: "#222222",
      SCREEN_FRAME: "#111111"
    },
  
    // Material properties
    MATERIALS: {
      CASE: {
        metalness: 0.2,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.1
      },
      SCREEN: {
        metalness: 0.1,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        opacity: 0.1
      },
      KEYBOARD: {
        metalness: 0.2,
        roughness: 0.4,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
      }
    },
  
    // Light settings
    LIGHTING: {
      GLOW: {
        intensity: 0.5,
        distance: 3,
        decay: 2,
        pulseSpeed: 2, // Speed of the glow animation
        pulseIntensity: 0.1 // Amount of intensity variation in the pulse
      }
    },
  
    // HTML content settings
    HTML: {
        distanceFactor: 1, // A middle ground between 1 and 2
        occlude: true,
        transform: true,
        zIndexRange: [0, 100],
        className: "retro-monitor-content"
    },
  
    // Screen content area
    CONTENT_AREA: {
      padding: {
      top: 60,          // Tripled from 20
      right: 60,        // Tripled from 20
      bottom: 60,       // Tripled from 20
      left: 60          // Tripled from 20
      },
      viewBox: {
        width: 400,
        height: 300
      }
    }
  };
  
  // CSS Variables for consistent styling
  export const CSS_VARIABLES = {
    '--monitor-primary': RETRO_MONITOR.COLORS.PRIMARY,
    '--monitor-glow': RETRO_MONITOR.COLORS.GLOW,
    '--monitor-keys': RETRO_MONITOR.COLORS.KEYS,
    '--monitor-frame': RETRO_MONITOR.COLORS.SCREEN_FRAME,
    '--monitor-content-width': `${RETRO_MONITOR.DIMENSIONS.SCREEN.width * 250}px`,
    '--monitor-content-height': `${RETRO_MONITOR.DIMENSIONS.SCREEN.height * 250}px`
  };
  
  // Export default configuration
  export default {
    RETRO_MONITOR,
    CSS_VARIABLES
  };