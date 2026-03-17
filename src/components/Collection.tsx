import { motion } from 'framer-motion';
import { getAnimalForLetter } from '../data/animals';
import KawaiiAnimalDisplay from './KawaiiAnimalDisplay';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { colors, fonts, radius, kawaiiCard } from '../styles/theme';

export default function Collection() {
  const { state, dispatch } = useGame();
  const { play } = useSound();

  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      minHeight: '100vh',
      padding: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
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

        <div style={{
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          fontWeight: 700,
          color: colors.textAccent,
          ...kawaiiCard(colors.lavender),
          padding: '8px 20px',
          border: `2.5px solid ${colors.lavender}40`,
          fontFamily: fonts.heading,
        }}>
          🐾 {state.playerName ? `${state.playerName}'s` : 'My'} Critters: {state.collectedAnimals.length}/26
        </div>
      </div>

      {/* Animal grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(130px, 28vw), 1fr))',
        gap: '12px',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '10px',
      }}>
        {allLetters.map((letter, i) => {
          const collected = state.collectedAnimals.includes(letter);
          const animal = getAnimalForLetter(letter);

          return (
            <motion.div
              key={letter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px',
                borderRadius: radius.lg,
                background: collected ? colors.cardBg : `${colors.cream}aa`,
                border: collected ? `2.5px solid ${animal?.color || colors.lavender}50` : `2.5px dashed ${colors.lavender}30`,
                cursor: collected ? 'pointer' : 'default',
              }}
              whileHover={collected ? { scale: 1.05, y: -5 } : {}}
              onClick={() => {
                if (collected && animal) {
                  play('pop');
                }
              }}
            >
              {collected && animal ? (
                <KawaiiAnimalDisplay
                  animal={animal}
                  id={`collection-${letter}`}
                  size="small"
                  persistent
                />
              ) : (
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: radius.lg,
                  background: `${colors.lavender}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                  <motion.div
                    animate={{ rotate: [-3, 3, -3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontSize: '2.5rem' }}
                  >
                    🥚
                  </motion.div>
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: colors.textLight,
                    background: colors.cream,
                    borderRadius: radius.sm,
                    padding: '1px 8px',
                    border: `2px solid ${colors.lavender}30`,
                    fontFamily: fonts.heading,
                  }}>
                    {letter}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: 'center',
          marginTop: '24px',
          padding: '16px',
          ...kawaiiCard(colors.lavender),
          border: `2.5px solid ${colors.lavender}40`,
          maxWidth: '500px',
          margin: '24px auto',
          fontFamily: fonts.heading,
        }}
      >
        {state.collectedAnimals.length === 0 && (
          <div style={{ fontSize: '1.1rem', color: colors.textAccent, fontWeight: 700 }}>
            🥚 Play to hatch your critters! 🥚
          </div>
        )}
        {state.collectedAnimals.length > 0 && state.collectedAnimals.length < 26 && (
          <div style={{ fontSize: '1.1rem', color: colors.textAccent, fontWeight: 700 }}>
            ✨ {26 - state.collectedAnimals.length} more critters to discover! ✨
          </div>
        )}
        {state.collectedAnimals.length === 26 && (
          <div style={{ fontSize: '1.3rem', color: colors.mintDeep, fontWeight: 700 }}>
            🎉 You collected ALL 26 critters! 🎉
          </div>
        )}
      </motion.div>
    </div>
  );
}
