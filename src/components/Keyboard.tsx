import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAnimalForLetter } from '../data/animals';

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
      padding: '8px 8px 12px',
      background: 'linear-gradient(0deg, #ffffffee, #ffffffcc)',
      backdropFilter: 'blur(10px)',
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '5px',
    }}>
      {KEYBOARD_ROWS.map((row, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'flex',
            gap: '4px',
            justifyContent: 'center',
            // Offset middle rows like a real keyboard
            marginLeft: rowIdx === 1 ? '20px' : rowIdx === 2 ? '44px' : '0',
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
                  // Simulate a keypress
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
                  width: '38px',
                  height: '44px',
                  borderRadius: '8px',
                  border: isPressed
                    ? `2px solid ${animal?.color || '#CE93D8'}`
                    : isCollected
                      ? `2px solid ${animal?.color || '#81C784'}50`
                      : '2px solid #E0E0E0',
                  background: isPressed
                    ? `linear-gradient(135deg, ${animal?.color || '#CE93D8'}, ${animal?.bgColor || '#F3E5F5'})`
                    : isCollected
                      ? `linear-gradient(135deg, ${animal?.bgColor || '#fff'}, #fff)`
                      : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isPressed
                    ? `0 1px 2px ${animal?.color || '#CE93D8'}40`
                    : '0 2px 4px rgba(0,0,0,0.08)',
                  padding: '2px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Letter */}
                <span style={{
                  fontSize: isCollected ? '0.7rem' : '0.85rem',
                  fontWeight: 800,
                  color: isPressed
                    ? '#fff'
                    : isCollected
                      ? animal?.color || '#7B1FA2'
                      : '#666',
                  lineHeight: 1,
                }}>
                  {letter}
                </span>

                {/* Tiny animal emoji if collected */}
                {isCollected && animal && (
                  <span style={{
                    fontSize: '0.7rem',
                    lineHeight: 1,
                    marginTop: '1px',
                  }}>
                    {animal.emoji}
                  </span>
                )}

                {/* Glow effect on press */}
                {isPressed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0.5, 0], scale: 2 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                      background: animal?.color || '#CE93D8',
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
