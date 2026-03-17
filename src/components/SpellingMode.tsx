import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { getRandomWord, type SpellingWord } from '../data/spellingWords';
import { colors, gradients, fonts, radius, kawaiiButton, kawaiiCard } from '../styles/theme';

function getWordImage(word: string): string {
  return `/words/${word}.jpg`;
}

// Map age to starting difficulty
function getDifficultyForAge(age: number): 1 | 2 | 3 {
  if (age <= 5) return 1;
  if (age <= 7) return 2;
  return 3;
}

export default function SpellingMode() {
  const { state, dispatch } = useGame();
  const { play } = useSound();
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(getDifficultyForAge(state.playerAge));
  const [currentWord, setCurrentWord] = useState<SpellingWord>(() => getRandomWord(difficulty));
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);

  const wordLetters = currentWord.word.toUpperCase().split('');
  const currentIndex = typedLetters.length;
  const expectedLetter = wordLetters[currentIndex];

  const nextWord = useCallback(() => {
    setShowSuccess(false);
    setTypedLetters([]);
    setHintVisible(false);
    const newWord = getRandomWord(difficulty);
    setCurrentWord(newWord);
  }, [difficulty]);

  const handleKeyPress = useCallback((key: string) => {
    if (showSuccess) return;
    const letter = key.toUpperCase();
    if (letter.length !== 1 || letter < 'A' || letter > 'Z') return;

    if (letter === expectedLetter) {
      // Correct letter
      play('pop');
      const newTyped = [...typedLetters, letter];
      setTypedLetters(newTyped);

      if (newTyped.length === wordLetters.length) {
        // Word completed!
        play('celebrate');
        setScore(s => s + 1);
        setStreak(s => s + 1);
        setWordsCompleted(w => w + 1);
        setShowSuccess(true);
        setTimeout(nextWord, 2500);
      }
    } else {
      // Wrong letter
      play('wrong');
      setStreak(0);
      setShakeIndex(currentIndex);
      setTimeout(() => setShakeIndex(null), 500);
    }
  }, [typedLetters, expectedLetter, wordLetters.length, showSuccess, play, currentIndex, nextWord]);

  // Keyboard listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        handleKeyPress(e.key);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeyPress]);

  const difficultyLabels = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
  const difficultyColors = { 1: colors.mint, 2: colors.butter, 3: colors.peach };

  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '8px',
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

        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{
            ...kawaiiCard(colors.mint),
            padding: '6px 14px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: colors.mintDeep,
            fontFamily: fonts.heading,
            border: `2px solid ${colors.mint}60`,
          }}>
            ⭐ {score}
          </div>
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                ...kawaiiCard(colors.peach),
                padding: '6px 14px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: colors.pinkDeep,
                fontFamily: fonts.heading,
                border: `2px solid ${colors.peach}60`,
              }}
            >
              🔥 {streak}
            </motion.div>
          )}
        </div>
      </div>

      {/* Difficulty selector */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
      }}>
        {([1, 2, 3] as const).map(d => (
          <motion.button
            key={d}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setDifficulty(d);
              setTypedLetters([]);
              setCurrentWord(getRandomWord(d));
              setHintVisible(false);
            }}
            style={{
              padding: '6px 16px',
              borderRadius: radius.full,
              border: `2.5px solid ${difficulty === d ? difficultyColors[d] : colors.lavender + '40'}`,
              background: difficulty === d ? `${difficultyColors[d]}40` : colors.cream,
              color: difficulty === d ? colors.textDark : colors.textLight,
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: fonts.heading,
            }}
          >
            {difficultyLabels[d]}
          </motion.button>
        ))}
      </div>

      {/* Word image */}
      <motion.div
        key={currentWord.word}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'backOut' }}
        style={{
          ...kawaiiCard(colors.lavender),
          padding: '16px',
          border: `2.5px solid ${colors.lavender}30`,
          marginBottom: '16px',
          textAlign: 'center',
          maxWidth: '280px',
          width: '100%',
        }}
      >
        <img
          src={getWordImage(currentWord.word)}
          alt={currentWord.hint}
          style={{
            width: '100%',
            maxWidth: '220px',
            aspectRatio: '1',
            objectFit: 'contain',
            borderRadius: radius.md,
          }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setHintVisible(!hintVisible)}
          style={{
            marginTop: '8px',
            background: 'none',
            border: 'none',
            color: colors.textLight,
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontFamily: fonts.body,
            textDecoration: 'underline',
          }}
        >
          {hintVisible ? 'Hide hint' : '💡 Need a hint?'}
        </motion.button>
        <AnimatePresence>
          {hintVisible && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                fontSize: '0.85rem',
                color: colors.textMedium,
                margin: '6px 0 0',
                fontFamily: fonts.body,
              }}
            >
              {currentWord.hint}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Letter slots */}
      <div style={{
        display: 'flex',
        gap: 'clamp(6px, 2vw, 12px)',
        marginBottom: '24px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {wordLetters.map((letter, i) => {
          const isTyped = i < typedLetters.length;
          const isCurrent = i === currentIndex;
          const isShaking = i === shakeIndex;

          return (
            <motion.div
              key={`${currentWord.word}-${i}`}
              initial={{ scale: 0, y: 20 }}
              animate={{
                scale: 1,
                y: 0,
                x: isShaking ? [0, -8, 8, -5, 5, 0] : 0,
              }}
              transition={{
                delay: i * 0.05,
                x: isShaking ? { duration: 0.4 } : undefined,
              }}
              style={{
                width: 'clamp(40px, 12vw, 56px)',
                height: 'clamp(48px, 14vw, 64px)',
                borderRadius: radius.md,
                border: `3px solid ${isTyped ? colors.mintDeep : isCurrent ? colors.lavender : colors.lavender + '40'}`,
                background: isTyped
                  ? `linear-gradient(135deg, ${colors.mint}40, ${colors.cream})`
                  : isCurrent
                    ? `linear-gradient(135deg, ${colors.lavender}20, ${colors.cream})`
                    : colors.cream,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isCurrent ? `0 0 12px ${colors.lavender}40` : 'none',
              }}
            >
              {isTyped ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  style={{
                    fontSize: 'clamp(1.4rem, 5vw, 2rem)',
                    fontWeight: 800,
                    color: colors.mintDeep,
                    fontFamily: fonts.fun,
                  }}
                >
                  {letter}
                </motion.span>
              ) : (
                <span style={{
                  fontSize: 'clamp(1.4rem, 5vw, 2rem)',
                  fontWeight: 800,
                  color: colors.lavender + '30',
                  fontFamily: fonts.fun,
                }}>
                  {isCurrent ? '_' : '·'}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'fixed',
              top: '30%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{
                fontSize: 'clamp(2rem, 8vw, 3rem)',
                fontWeight: 800,
                color: colors.mintDeep,
                fontFamily: fonts.fun,
                textShadow: `0 3px 10px ${colors.mint}60`,
                ...kawaiiCard(colors.mint),
                padding: '16px 32px',
                border: `3px solid ${colors.mint}60`,
              }}
            >
              ✨ {currentWord.word.toUpperCase()}! ✨
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: '1.2rem',
                color: colors.textAccent,
                marginTop: '8px',
                fontFamily: fonts.body,
                fontWeight: 600,
              }}
            >
              {['Great job! 🌟', 'Amazing! ⭐', 'You did it! 🎉', 'Awesome! 🌈', 'Super! 🦄'][Math.floor(Math.random() * 5)]}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* On-screen keyboard for mobile */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: `linear-gradient(180deg, ${colors.cream}f0, ${colors.cream})`,
        padding: '6px 4px max(10px, env(safe-area-inset-bottom))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        borderTop: `2px solid ${colors.lavender}20`,
      }}>
        {[
          ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
          ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
          ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        ].map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: '3px' }}>
            {row.map(letter => {
              const isExpected = letter === expectedLetter && !showSuccess;
              return (
                <motion.button
                  key={letter}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleKeyPress(letter)}
                  style={{
                    width: 'min(9vw, 38px)',
                    height: 'min(11vw, 44px)',
                    borderRadius: radius.sm,
                    border: `2px solid ${isExpected ? colors.lavender : colors.lavender + '30'}`,
                    background: isExpected ? `${colors.lavender}20` : colors.cream,
                    color: colors.textDark,
                    fontSize: 'clamp(0.7rem, 3vw, 0.95rem)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: fonts.heading,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isExpected ? `0 0 8px ${colors.lavender}30` : 'none',
                  }}
                >
                  {letter}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
