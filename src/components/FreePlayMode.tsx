import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimalForLetter } from '../data/animals';
import type { KawaiiAnimal } from '../data/animals';
import KawaiiAnimalDisplay from './KawaiiAnimalDisplay';
import Keyboard from './Keyboard';
import Confetti from './Confetti';
import { useSound } from '../hooks/useSound';
import { useGame } from '../context/GameContext';

interface ActiveAnimal {
  id: string;
  animal: KawaiiAnimal;
  x: number;
  y: number;
}

export default function FreePlayMode() {
  const [activeAnimals, setActiveAnimals] = useState<ActiveAnimal[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastLetter, setLastLetter] = useState<string | null>(null);
  const { play, playAnimalSound } = useSound();
  const { state, dispatch } = useGame();

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (key.length !== 1 || key < 'A' || key > 'Z') return;

    const animal = getAnimalForLetter(key);
    if (!animal) return;

    dispatch({ type: 'KEY_PRESSED' });
    dispatch({ type: 'COLLECT_ANIMAL', letter: key });

    // Play entrance sound
    switch (animal.entrance) {
      case 'bounce': play('bounce'); break;
      case 'float': play('whoosh'); break;
      case 'pop': play('pop'); break;
      case 'spin': play('sparkle'); break;
      case 'wiggle': play('squeak'); break;
      case 'slide': play('whoosh'); break;
    }

    // Play animal sound slightly after
    setTimeout(() => playAnimalSound(animal.sound), 200);

    // Position randomly but within visible area (above keyboard)
    const x = 5 + Math.random() * 75;
    const y = 8 + Math.random() * 40;

    const id = `${key}-${Date.now()}`;
    setActiveAnimals(prev => [...prev, { id, animal, x, y }]);
    setLastLetter(key);

    // Remove after animation
    setTimeout(() => {
      setActiveAnimals(prev => prev.filter(a => a.id !== id));
    }, 4000);

    // Confetti every 5 presses
    if ((state.totalKeysPressed + 1) % 5 === 0) {
      setShowConfetti(true);
      play('celebrate');
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [play, playAnimalSound, dispatch, state.totalKeysPressed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'SET_MODE', mode: 'menu' })}
          style={{
            background: '#fff',
            border: '3px solid #F8BBD0',
            borderRadius: '16px',
            padding: '8px 16px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 700,
            color: '#E91E63',
          }}
        >
          ← Back
        </motion.button>

        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '8px 20px',
          border: '3px solid #CE93D8',
          fontWeight: 700,
          color: '#7B1FA2',
          fontSize: '0.9rem',
        }}>
          🐼 Keys: {state.totalKeysPressed} | 🐾 Critters: {state.collectedAnimals.length}/26
        </div>
      </div>

      {/* Prompt text */}
      <AnimatePresence>
        {activeAnimals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#7B1FA2',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                background: '#ffffffcc',
                borderRadius: '24px',
                padding: '20px 40px',
                border: '3px dashed #CE93D8',
              }}
            >
              🐼 Press any key or tap the keyboard! 🐼
              <div style={{ fontSize: '1rem', marginTop: '8px', color: '#9C27B0' }}>
                {state.playerName ? `Go ahead, ${state.playerName}!` : 'Each key has a surprise!'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active animals */}
      <AnimatePresence>
        {activeAnimals.map(({ id, animal, x, y }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0, y: -50 }}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              zIndex: 10,
            }}
          >
            <KawaiiAnimalDisplay
              animal={animal}
              id={id}
              size="large"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Last letter indicator */}
      <AnimatePresence>
        {lastLetter && (
          <motion.div
            key={`letter-${lastLetter}-${Date.now()}`}
            initial={{ scale: 3, opacity: 0.8 }}
            animate={{ scale: 0, opacity: 0, y: -100 }}
            transition={{ duration: 1 }}
            style={{
              position: 'fixed',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '5rem',
              fontWeight: 900,
              color: '#CE93D880',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            {lastLetter}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual QWERTY Keyboard */}
      <Keyboard collectedAnimals={state.collectedAnimals} />

      {showConfetti && <Confetti />}
    </div>
  );
}
