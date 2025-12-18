/**
 * 🎬 NEXUS ANIMATION LIBRARY V2
 * Ultra-modern 3D and 2D animations with Framer Motion & GSAP
 * Production-grade animation system with accessibility support
 */

import { Variants, TargetAndTransition, VariantLabels } from 'framer-motion';

// ============================================================================
// FADE & OPACITY ANIMATIONS
// ============================================================================

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const fadeInScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideInFromLeftVariants: Variants = {
  hidden: { x: -40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 80,
      damping: 12
    }
  },
  exit: {
    x: -40,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const slideInFromRightVariants: Variants = {
  hidden: { x: 40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 80,
      damping: 12
    }
  },
  exit: {
    x: 40,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const slideInFromTopVariants: Variants = {
  hidden: { y: -40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 80,
      damping: 12
    }
  },
  exit: {
    y: -40,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const slideInFromBottomVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 80,
      damping: 12
    }
  },
  exit: {
    y: 40,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// ============================================================================
// ROTATION & 3D ANIMATIONS
// ============================================================================

export const rotateInVariants: Variants = {
  hidden: { rotate: -180, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 70,
      damping: 12
    }
  },
  exit: {
    rotate: 180,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const flipInVariants: Variants = {
  hidden: { rotateY: 90, opacity: 0 },
  visible: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    rotateY: -90,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const flip3DVariants: Variants = {
  hidden: { rotateX: 90, rotateY: 45, opacity: 0 },
  visible: {
    rotateX: 0,
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  },
  exit: {
    rotateX: -90,
    rotateY: -45,
    opacity: 0,
    transition: { duration: 0.4 }
  }
};

// ============================================================================
// PULSE & GLOW ANIMATIONS
// ============================================================================

export const pulseVariants: Variants = {
  animate: {
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const glowVariants: Variants = {
  animate: {
    boxShadow: [
      '0 0 10px rgba(255, 0, 255, 0.3)',
      '0 0 30px rgba(255, 0, 255, 0.6)',
      '0 0 10px rgba(255, 0, 255, 0.3)'
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// ============================================================================
// BOUNCE & SPRING ANIMATIONS
// ============================================================================

export const bounceInVariants: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 200,
      damping: 25
    }
  }
};

export const bounceUpVariants: Variants = {
  animate: {
    y: [-10, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

// ============================================================================
// HOVER ANIMATIONS
// ============================================================================

export const hoverScaleVariants: Variants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

export const hoverLiftVariants: Variants = {
  normal: {
    y: 0,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  hover: {
    y: -4,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    transition: { duration: 0.3 }
  }
};

export const hoverGlowVariants: Variants = {
  normal: {
    boxShadow: '0 0 0px rgba(255, 0, 255, 0)'
  },
  hover: {
    boxShadow: '0 0 20px rgba(255, 0, 255, 0.6)',
    transition: { duration: 0.3 }
  }
};

// ============================================================================
// MORPHING ANIMATIONS
// ============================================================================

export const morphCircleToSquareVariants: Variants = {
  circle: {
    borderRadius: '50%',
    transition: { duration: 0.5 }
  },
  square: {
    borderRadius: '8px',
    transition: { duration: 0.5 }
  }
};

// ============================================================================
// TYPING ANIMATIONS
// ============================================================================

export const typingDotVariants: Variants = {
  animate: (index: number) => ({
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay: index * 0.15
    }
  })
};

export const cursorBlinkVariants: Variants = {
  blink: {
    opacity: [1, 1, 0, 0],
    transition: {
      duration: 1,
      repeat: Infinity
    }
  }
};

// ============================================================================
// MENU ANIMATIONS
// ============================================================================

export const menuVariants: Variants = {
  closed: {
    opacity: 0,
    y: -20,
    pointerEvents: 'none'
  },
  open: {
    opacity: 1,
    y: 0,
    pointerEvents: 'auto',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const menuItemVariants: Variants = {
  closed: {
    opacity: 0,
    x: -20
  },
  open: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.2
    }
  })
};

// ============================================================================
// MODAL ANIMATIONS
// ============================================================================

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 40
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 150,
      damping: 20
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 40,
    transition: { duration: 0.2 }
  }
};

// ============================================================================
// PROGRESS ANIMATIONS
// ============================================================================

export const progressBarVariants: Variants = {
  initial: { width: '0%' },
  animate: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  })
};

export const progressIndicatorVariants: Variants = {
  initial: { scaleX: 0 },
  animate: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: 'easeInOut'
    }
  }
};

// ============================================================================
// NOTIFICATION ANIMATIONS
// ============================================================================

export const notificationVariants: Variants = {
  hidden: {
    x: 400,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    x: 400,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// ============================================================================
// PARALLAX ANIMATIONS
// ============================================================================

export const parallaxVariants = (offset: number): Variants => ({
  offscreen: {
    y: offset
  },
  onscreen: {
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8
    }
  }
});

// ============================================================================
// SHIMMER LOADING ANIMATION
// ============================================================================

export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// ============================================================================
// GRADIENT ANIMATION
// ============================================================================

export const gradientAnimationVariants: Variants = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};
