import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimalForLetter } from '../data/animals';
import type { KawaiiAnimal } from '../data/animals';
import KawaiiAnimalDisplay from './KawaiiAnimalDisplay';
import Keyboard from './Keyboard';
import Confetti from './Confetti';
import { useSound } from '../hooks/useSound';
import { useGame } from '../context/GameContext';
import { colors, fonts, radius, kawaiiCard } from '../styles/theme';

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

    switch (animal.entrance) {
      case 'bounce': play('bounce'); break;
      case 'float': play('whoosh'); break;
      case 'pop': play('pop'); break;
      case 'spin': play('sparkle'); break;
      case 'wiggle': play('squeak'); break;
      case 'slide': play('whoosh'); break;
    }

    setTimeout(() => playAnimalSound(animal.sound), 200);

    const x = 5 + Math.random() * 75;
    const y = 8 + Math.random() * 40;

    const id = `${key}-${Date.now()}`;
    setActiveAnimals(prev => [...prev, { id, animal, x, y }]);
    setLastLetter(key);

    setTimeout(() => {
      setActiveAnimals(prev => prev.filter(a => a.id !== id));
    }, 4000);

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
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'SET_MODE', mode: 'menu' })}
          style={{
            ...kawaiiCard(colors.pink),
            padding: '8px 16px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 700,
            color: colors.pinkDeep,
            fontFamily: fonts.heading,
            border: `2.5px solid ${colors.pink}60`,
          }}
        >
          ← Back
        </motion.button>

        <div style={{
          ...kawaiiCard(colors.lavender),
          padding: '8px 16px',
          fontWeight: 700,
          color: colors.textAccent,
          fontSize: 'clamp(0.7rem, 2.5vw, 0.9rem)',
          fontFamily: fonts.heading,
          border: `2.5px solid ${colors.lavender}40`,
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
              width: '90%',
              maxWidth: '400px',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                fontWeight: 700,
                color: colors.textAccent,
                ...kawaiiCard(colors.lavender),
                padding: '20px 30px',
                border: `2.5px dashed ${colors.lavender}`,
                fontFamily: fonts.heading,
              }}
            >
              🐼 Press any key or tap the keyboard! 🐼
              <div style={{ fontSize: 'clamp(0.8rem, 3vw, 1rem)', marginTop: '8px', color: colors.textMedium, fontFamily: fonts.body }}>
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
              color: `${colors.lavender}80`,
              pointerEvents: 'none',
              zIndex: 5,
              fontFamily: fonts.fun,
            }}
          >
            {lastLetter}
          </motion.div>
        )}
      </AnimatePresence>

      <Keyboard collectedAnimals={state.collectedAnimals} />

      {showConfetti && <Confetti />}
    </div>
  );
}
