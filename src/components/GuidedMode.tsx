import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimalForLetter } from '../data/animals';
import KawaiiAnimalDisplay from './KawaiiAnimalDisplay';
import Keyboard from './Keyboard';
import Confetti from './Confetti';
import { useSound } from '../hooks/useSound';
import { useGame } from '../context/GameContext';
import { colors, fonts, radius, kawaiiCard } from '../styles/theme';

const ROUNDS_FOR_PARADE = 5;

export default function GuidedMode() {
  const { state, dispatch } = useGame();
  const { play, playAnimalSound } = useSound();
  const [showAnimal, setShowAnimal] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [showParade, setShowParade] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const pickNewTarget = useCallback(() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const letter = letters[Math.floor(Math.random() * letters.length)];
    dispatch({ type: 'SET_GUIDED_TARGET', letter });
    setShowAnimal(false);
    setShowWrong(false);
  }, [dispatch]);

  useEffect(() => {
    if (!state.guidedTarget) {
      pickNewTarget();
    }
  }, [state.guidedTarget, pickNewTarget]);

  const targetAnimal = useMemo(
    () => state.guidedTarget ? getAnimalForLetter(state.guidedTarget) : null,
    [state.guidedTarget]
  );

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (key.length !== 1 || key < 'A' || key > 'Z') return;
    if (showAnimal || showParade) return;

    dispatch({ type: 'KEY_PRESSED' });

    if (key === state.guidedTarget) {
      dispatch({ type: 'GUIDED_CORRECT' });
      dispatch({ type: 'COLLECT_ANIMAL', letter: key });
      setShowAnimal(true);
      play('celebrate');
      setShowConfetti(true);

      if (targetAnimal) {
        setTimeout(() => playAnimalSound(targetAnimal.sound), 300);
      }

      setTimeout(() => setShowConfetti(false), 3000);

      if ((state.guidedRound + 1) % ROUNDS_FOR_PARADE === 0) {
        setTimeout(() => {
          setShowParade(true);
          play('celebrate');
        }, 2000);
        setTimeout(() => {
          setShowParade(false);
          pickNewTarget();
        }, 5000);
      } else {
        setTimeout(() => pickNewTarget(), 2500);
      }
    } else {
      dispatch({ type: 'GUIDED_WRONG' });
      play('wrong');
      setShowWrong(true);
      setTimeout(() => setShowWrong(false), 800);
    }
  }, [state.guidedTarget, showAnimal, showParade, dispatch, play, playAnimalSound, targetAnimal, pickNewTarget, state.guidedRound]);

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
      alignItems: 'center',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            dispatch({ type: 'SET_MODE', mode: 'menu' });
            dispatch({ type: 'RESET_GUIDED' });
          }}
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

        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{
            ...kawaiiCard(colors.mint),
            padding: '8px 16px',
            fontWeight: 700,
            color: colors.mintDeep,
            fontFamily: fonts.heading,
            border: `2.5px solid ${colors.mint}60`,
          }}>
            ⭐ {state.guidedScore}
          </div>
          <div style={{
            ...kawaiiCard(colors.peach),
            padding: '8px 16px',
            fontWeight: 700,
            color: colors.textMedium,
            fontFamily: fonts.heading,
            border: `2.5px solid ${colors.peach}60`,
          }}>
            🔥 {state.currentStreak}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px',
        padding: '0 16px',
      }}>
        <AnimatePresence mode="wait">
          {!showAnimal && !showParade && targetAnimal && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  fontSize: 'clamp(4rem, 12vw, 6rem)',
                  filter: 'grayscale(100%) brightness(0.2)',
                  opacity: 0.3,
                  marginBottom: '20px',
                }}
              >
                {targetAnimal.emoji}
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                  fontWeight: 700,
                  color: colors.textAccent,
                  ...kawaiiCard(colors.lavender),
                  padding: '20px 30px',
                  border: `3px solid ${colors.lavender}`,
                  fontFamily: fonts.heading,
                }}
              >
                Find the <span style={{
                  color: targetAnimal.color,
                  fontSize: 'clamp(2rem, 7vw, 3.5rem)',
                  textShadow: `0 2px 4px ${targetAnimal.color}60`,
                  fontFamily: fonts.fun,
                }}>{state.guidedTarget}</span>
                <div style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)', color: colors.textMedium, marginTop: '8px', fontFamily: fonts.body }}>
                  Who's hiding? 👀
                </div>
              </motion.div>
            </motion.div>
          )}

          {showAnimal && targetAnimal && (
            <motion.div
              key="animal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center' }}
            >
              <KawaiiAnimalDisplay
                animal={targetAnimal}
                id={`guided-${state.guidedTarget}`}
                size="large"
                persistent
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.3 }}
                style={{
                  marginTop: '20px',
                  fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                  fontWeight: 700,
                  color: colors.mintDeep,
                  ...kawaiiCard(colors.mint),
                  padding: '12px 32px',
                  border: `3px solid ${colors.mint}`,
                  fontFamily: fonts.fun,
                }}
              >
                🎉 YAY! 🎉
                {state.playerName && (
                  <div style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)', color: colors.textMedium, fontFamily: fonts.body }}>
                    Great job, {state.playerName}!
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wrong indicator */}
        <AnimatePresence>
          {showWrong && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, x: [0, -10, 10, -10, 0] }}
              exit={{ scale: 0 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: colors.textMedium,
                ...kawaiiCard(colors.peach),
                padding: '12px 24px',
                border: `3px solid ${colors.peach}`,
                zIndex: 50,
                fontFamily: fonts.heading,
              }}
            >
              Try again! 💪
            </motion.div>
          )}
        </AnimatePresence>

        {/* Parade */}
        <AnimatePresence>
          {showParade && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${colors.cream}cc`,
                zIndex: 40,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <motion.div
                  style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 700, color: colors.textAccent, marginBottom: '20px', fontFamily: fonts.fun }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎊 CRITTER PARADE! 🎊
                </motion.div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {state.collectedAnimals.slice(-5).map((letter, i) => {
                    const animal = getAnimalForLetter(letter);
                    if (!animal) return null;
                    return (
                      <motion.div
                        key={letter}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                      >
                        <KawaiiAnimalDisplay
                          animal={animal}
                          id={`parade-${letter}`}
                          size="medium"
                          persistent
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <Confetti count={50} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Keyboard collectedAnimals={state.collectedAnimals} />

      {showConfetti && !showParade && <Confetti />}
    </div>
  );
}
