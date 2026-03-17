import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { KawaiiAnimal } from '../data/animals';

// Check if there's AI-generated art cached for this animal
function getGeneratedArt(letter: string): string | null {
  try {
    const cache = JSON.parse(localStorage.getItem('panda-keys-art-cache') || '{}');
    return cache[letter] || null;
  } catch { return null; }
}

interface Props {
  animal: KawaiiAnimal;
  id: string;
  onComplete?: () => void;
  size?: 'small' | 'medium' | 'large';
  persistent?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const entranceVariants: Record<string, { initial: any; animate: any; exit: any }> = {
  bounce: {
    initial: { scale: 0, y: 100, opacity: 0 },
    animate: {
      scale: [0, 1.3, 0.9, 1.1, 1],
      y: [100, -20, 5, -10, 0],
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    exit: { scale: 0, y: -100, opacity: 0, transition: { duration: 0.5 } },
  },
  float: {
    initial: { scale: 0, y: -100, opacity: 0 },
    animate: {
      scale: 1,
      y: [0, -10, 0],
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
    exit: { y: -200, opacity: 0, transition: { duration: 0.8 } },
  },
  pop: {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.5, 0.8, 1.1, 1],
      opacity: 1,
      rotate: [0, -10, 10, -5, 0],
      transition: { duration: 0.5 },
    },
    exit: { scale: 0, opacity: 0, rotate: 180, transition: { duration: 0.4 } },
  },
  spin: {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'backOut' },
    },
    exit: { scale: 0, rotate: 180, opacity: 0, transition: { duration: 0.4 } },
  },
  wiggle: {
    initial: { scale: 0, x: -50, opacity: 0 },
    animate: {
      scale: 1,
      x: [0, 10, -10, 5, -5, 0],
      opacity: 1,
      transition: { duration: 0.6 },
    },
    exit: { scale: 0, x: 50, opacity: 0, transition: { duration: 0.4 } },
  },
  slide: {
    initial: { x: -200, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'backOut' },
    },
    exit: { x: 200, opacity: 0, transition: { duration: 0.5 } },
  },
};

const sizeMap = {
  small: { emoji: '3rem', container: '80px', name: '0.7rem', letter: '0.6rem' },
  medium: { emoji: '5rem', container: '120px', name: '0.9rem', letter: '0.75rem' },
  large: { emoji: '7rem', container: '160px', name: '1.1rem', letter: '0.9rem' },
};

export default function KawaiiAnimalDisplay({ animal, id, onComplete, size = 'medium', persistent = false }: Props) {
  const variant = entranceVariants[animal.entrance];
  const s = sizeMap[size];
  const [generatedArt, setGeneratedArt] = useState<string | null>(null);

  useEffect(() => {
    setGeneratedArt(getGeneratedArt(animal.letter));
  }, [animal.letter]);

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        initial={variant.initial}
        animate={variant.animate}
        exit={variant.exit}
        onAnimationComplete={() => {
          if (!persistent && onComplete) {
            setTimeout(onComplete, 2000);
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Kawaii card */}
        <motion.div
          style={{
            width: s.container,
            height: s.container,
            borderRadius: '24px',
            background: generatedArt
              ? `url(${generatedArt}) center/contain no-repeat, linear-gradient(135deg, ${animal.bgColor}, ${animal.color}40)`
              : `linear-gradient(135deg, ${animal.bgColor}, ${animal.color}40)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 20px ${animal.color}60`,
            border: `3px solid ${animal.color}`,
            position: 'relative',
            overflow: 'hidden',
          }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Sparkle effect */}
          <motion.div
            style={{
              position: 'absolute',
              top: '10%',
              right: '15%',
              fontSize: '0.8rem',
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>

          {/* Animal emoji (hidden if generated art exists) */}
          {!generatedArt && (
            <span style={{ fontSize: s.emoji, lineHeight: 1 }}>
              {animal.emoji}
            </span>
          )}
        </motion.div>

        {/* Name label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontSize: s.name,
            fontWeight: 700,
            color: '#5D4037',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            {animal.name}
          </div>
          <div style={{
            fontSize: s.letter,
            fontWeight: 800,
            color: animal.color,
            background: '#fff',
            borderRadius: '8px',
            padding: '1px 8px',
            marginTop: '2px',
            border: `2px solid ${animal.color}`,
          }}>
            {animal.letter}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
