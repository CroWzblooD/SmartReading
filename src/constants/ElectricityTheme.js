// Professional Electricity Theme for Government App
// Yellow/White/Black Color Palette

export const ElectricityTheme = {
  // Primary Colors
  colors: {
    // Yellow Palette - Updated to consistent yellow theme
    primary: '#FF8F00',          // Main deep yellow/amber
    primaryLight: '#FFB300',     // Light yellow
    primaryLighter: '#FFC107',   // Very light yellow
    primaryBg: '#FFF8E1',        // Yellow background
    lightYellow: '#FFF9C4',      // Added missing lightYellow
    
    // Secondary Colors - Keep complementary colors
    secondary: '#FF9800',        // Orange accent
    secondaryLight: '#FFB74D',   // Light orange
    secondaryBg: '#FFF3E0',      // Orange background
    
    // Neutral Colors
    black: '#1A1A1A',           // Primary text
    white: '#FFFFFF',           // Pure white
    lightGray: '#F5F5F5',       // Light background
    mediumGray: '#9E9E9E',      // Secondary text
    darkGray: '#424242',        // Dark text
    
    // Accent Colors
    success: '#4CAF50',         // Green
    error: '#F44336',           // Red
    warning: '#FF9800',         // Orange
    info: '#2196F3',            // Blue
    
    // Background Colors
    background: '#FFFFFF',       // Main background
    cardBg: '#FFFFFF',          // Card background
    lightBg: '#FFF8E1',         // Light yellow background
    
    // Border Colors
    border: '#E0E0E0',          // Default border
    lightBorder: '#F0F0F0',     // Light border
    primaryBorder: '#FF8F00',   // Updated to match primary
    
    // Government Theme
    govBlue: '#0D47A1',         // Government blue
    govRed: '#C62828',          // Government red
    govGreen: '#2E7D32',        // Government green
  },
  
  // Typography
  typography: {
    // Font Sizes
    fontSize: {
      xs: 10,
      sm: 12,
      base: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      display: 32,
    },
    
    // Font Weights
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    }
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    base: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  
  // Border Radius
  borderRadius: {
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 50,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 5,
    }
  },
  
  // Component Styles
  components: {
    // Button Styles
    button: {
      primary: {
        backgroundColor: '#FFC107',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
      },
      secondary: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFC107',
        borderWidth: 2,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '#1A1A1A',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
      }
    },
    
    // Input Styles
    input: {
      default: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
      },
      focused: {
        borderColor: '#FFC107',
        borderWidth: 2,
      },
      error: {
        borderColor: '#F44336',
        borderWidth: 2,
      }
    },
    
    // Card Styles
    card: {
      default: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      elevated: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      }
    }
  },
  
  // Gradients - Updated to new yellow color scheme
  gradients: {
    primary: ['#FF8F00', '#FFB300', '#FFC107'],
    primaryGradient: ['#FF8F00', '#FFB300', '#FFC107'], // Alias for primary
    secondary: ['#FF9800', '#FFB74D', '#FFCC80'],
    government: ['#FF8F00', '#FFB300', '#FFC107'],
    light: ['#FFF8E1', '#FFFFFF', '#FAFAFA'],
    dark: ['#1A1A1A', '#424242', '#616161'],
  },
  
  // Animation Durations
  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
  }
};

// Helper functions for theme usage
export const getColor = (colorPath) => {
  const paths = colorPath.split('.');
  let color = ElectricityTheme.colors;
  for (const path of paths) {
    color = color[path];
  }
  return color;
};

export const getTypography = (property, value) => {
  return ElectricityTheme.typography[property][value];
};

export const getSpacing = (size) => {
  return ElectricityTheme.spacing[size];
};

export default ElectricityTheme;