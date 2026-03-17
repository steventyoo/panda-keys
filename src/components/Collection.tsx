import { motion } from 'framer-motion';
import { animals, getAnimalForLetter } from '../data/animals';
import KawaiiAnimalDisplay from './KawaiiAnimalDisplay';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';

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
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
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
          fontSize: '1.5rem',
          fontWeight: 900,
          color: '#7B1FA2',
          background: '#ffffffcc',
          borderRadius: '16px',
          padding: '8px 24px',
          border: '3px solid #CE93D8',
        }}>
          🐾 {state.playerName ? `${state.playerName}'s` : 'My'} Critters: {state.collectedAnimals.length}/26
        </div>
      </div>

      {/* Animal grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '16px',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
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
                borderRadius: '20px',
                background: collected ? '#ffffffcc' : '#f5f5f5aa',
                border: collected ? `3px solid ${animal?.color || '#ddd'}` : '3px dashed #ddd',
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
                  borderRadius: '24px',
                  background: '#E0E0E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                  {/* Egg */}
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
                    fontWeight: 800,
                    color: '#BDBDBD',
                    background: '#F5F5F5',
                    borderRadius: '6px',
                    padding: '1px 8px',
                    border: '2px solid #E0E0E0',
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
          background: '#ffffffcc',
          borderRadius: '16px',
          border: '3px solid #CE93D8',
          maxWidth: '500px',
          margin: '24px auto',
        }}
      >
        {state.collectedAnimals.length === 0 && (
          <div style={{ fontSize: '1.1rem', color: '#7B1FA2', fontWeight: 700 }}>
            🥚 Play to hatch your critters! 🥚
          </div>
        )}
        {state.collectedAnimals.length > 0 && state.collectedAnimals.length < 26 && (
          <div style={{ fontSize: '1.1rem', color: '#7B1FA2', fontWeight: 700 }}>
            ✨ {26 - state.collectedAnimals.length} more critters to discover! ✨
          </div>
        )}
        {state.collectedAnimals.length === 26 && (
          <div style={{ fontSize: '1.3rem', color: '#4CAF50', fontWeight: 900 }}>
            🎉 You collected ALL 26 critters! 🎉
          </div>
        )}
      </motion.div>
    </div>
  );
}
