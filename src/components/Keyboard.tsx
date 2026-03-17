import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAnimalForLetter } from '../data/animals';
import { colors, fonts, radius } from '../styles/theme';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

interface Props {
  collectedAnimals: string[];
  onKeyClick?: (letter: string) => void;
}

export default function Keyboard({ collectedAnimals, onKeyClick }: Props) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        setPressedKey(key);
      }
    };
    const handleKeyUp = () => {
      setPressedKey(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '6px 4px max(10px, env(safe-area-inset-bottom))',
      background: `linear-gradient(0deg, ${colors.cream}ee, ${colors.cream}cc)`,
      backdropFilter: 'blur(10px)',
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      borderTop: `2px solid ${colors.lavender}30`,
    }}>
      {KEYBOARD_ROWS.map((row, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'flex',
            gap: '3px',
            justifyContent: 'center',
            marginLeft: rowIdx === 1 ? '16px' : rowIdx === 2 ? '36px' : '0',
          }}
        >
          {row.map(letter => {
            const animal = getAnimalForLetter(letter);
            const isPressed = pressedKey === letter;
            const isCollected = collectedAnimals.includes(letter);

            return (
              <motion.button
                key={letter}
                animate={isPressed ? {
                  scale: 0.9,
                  y: 2,
                } : {
                  scale: 1,
                  y: 0,
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.1 }}
                onClick={() => {
                  if (onKeyClick) onKeyClick(letter);
                  const event = new KeyboardEvent('keydown', {
                    key: letter.toLowerCase(),
                    code: `Key${letter}`,
                    bubbles: true,
                  });
                  window.dispatchEvent(event);
                  setPressedKey(letter);
                  setTimeout(() => setPressedKey(null), 150);
                }}
                style={{
                  width: 'min(9vw, 38px)',
                  height: 'min(11vw, 44px)',
                  borderRadius: radius.sm,
                  border: isPressed
                    ? `2px solid ${animal?.color || colors.lavender}`
                    : isCollected
                      ? `2px solid ${animal?.color || colors.mint}50`
                      : `2px solid ${colors.lavender}30`,
                  background: isPressed
                    ? `linear-gradient(135deg, ${animal?.color || colors.lavender}, ${animal?.bgColor || colors.blush})`
                    : isCollected
                      ? `linear-gradient(135deg, ${animal?.bgColor || colors.cream}, ${colors.cream})`
                      : colors.white,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isPressed
                    ? `0 1px 4px ${animal?.color || colors.lavender}40`
                    : `0 2px 6px ${colors.shadow}`,
                  padding: '2px',
                  position: 'relative',
                  overflow: 'hidden',
                  fontFamily: fonts.heading,
                }}
              >
                <span style={{
                  fontSize: isCollected ? 'min(2.5vw, 0.7rem)' : 'min(3vw, 0.85rem)',
                  fontWeight: 700,
                  color: isPressed
                    ? colors.white
                    : isCollected
                      ? animal?.color || colors.textAccent
                      : colors.textLight,
                  lineHeight: 1,
                  fontFamily: fonts.heading,
                }}>
                  {letter}
                </span>

                {isCollected && animal && (
                  <span style={{
                    fontSize: 'min(2.5vw, 0.7rem)',
                    lineHeight: 1,
                    marginTop: '1px',
                  }}>
                    {animal.emoji}
                  </span>
                )}

                {isPressed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0.5, 0], scale: 2 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: radius.sm,
                      background: animal?.color || colors.lavender,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
