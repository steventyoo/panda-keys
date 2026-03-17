import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { colors, gradients, fonts, radius, kawaiiButton, kawaiiCard } from '../styles/theme';

export default function MainMenu() {
  const { state, dispatch } = useGame();
  const { play } = useSound();

  const menuItems = [
    {
      title: '🌸 Explore Garden',
      subtitle: 'Press any key for surprises!',
      mode: 'freeplay' as const,
      color: colors.lavender,
      bgColor: colors.blush,
    },
    {
      title: '🎯 Find the Letter',
      subtitle: 'Match letters to unlock critters!',
      mode: 'guided' as const,
      color: colors.mint,
      bgColor: `${colors.mint}30`,
    },
    {
      title: '📝 Spell It!',
      subtitle: 'Learn to spell fun words!',
      mode: 'spelling' as const,
      color: colors.butter,
      bgColor: `${colors.butter}40`,
    },
    {
      title: '🐾 My Critters',
      subtitle: `${state.collectedAnimals.length}/26 collected`,
      mode: 'collection' as const,
      color: colors.peach,
      bgColor: `${colors.peach}40`,
    },
    {
      title: '🎨 Art Studio',
      subtitle: 'Generate kawaii art with AI!',
      mode: 'artgen' as const,
      color: colors.pink,
      bgColor: `${colors.pink}30`,
    },
  ];

  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '20px',
    }}>
      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textAlign: 'center', marginBottom: '20px' }}
      >
        <motion.h1
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
            color: colors.textAccent,
            margin: 0,
            textShadow: `0 3px 10px ${colors.lavender}60`,
            fontFamily: fonts.fun,
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          ✨ Panda Keys ✨
        </motion.h1>
        {state.playerName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '1.3rem',
              color: colors.textMedium,
              margin: '8px 0 0',
              fontWeight: 600,
              fontFamily: fonts.body,
            }}
          >
            Welcome back, {state.playerName}! 🌟
          </motion.p>
        )}

        {/* Family cheering */}
        {state.family.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginTop: '12px',
            }}
          >
            {state.family.map(member => (
              <motion.div
                key={member.id}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {member.photoUrl ? (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `2px solid ${member.kawaiiStyle.baseColor}`,
                  }}>
                    <img src={member.photoUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>{member.avatar}</span>
                )}
                <span style={{ fontSize: '0.6rem', color: colors.textMedium, fontWeight: 600, fontFamily: fonts.body }}>
                  {member.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Menu buttons */}
      {menuItems.map((item, i) => (
        <motion.button
          key={item.mode}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            play('pop');
            dispatch({ type: 'SET_MODE', mode: item.mode });
          }}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '20px 28px',
            borderRadius: radius.lg,
            border: `2.5px solid ${item.color}60`,
            background: `linear-gradient(135deg, ${item.bgColor}, ${colors.cream})`,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: `0 4px 15px ${item.color}25`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: colors.textDark, fontFamily: fonts.heading }}>
            {item.title}
          </div>
          <div style={{ fontSize: '0.9rem', color: colors.textMedium, fontWeight: 500, marginTop: '4px', fontFamily: fonts.body }}>
            {item.subtitle}
          </div>
        </motion.button>
      ))}

      {/* Settings row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '20px',
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: radius.full,
            border: `2px solid ${colors.lavender}50`,
            background: colors.cream,
            cursor: 'pointer',
            fontSize: '1.2rem',
          }}
        >
          {state.soundEnabled ? '🔊' : '🔇'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            dispatch({ type: 'SET_MODE', mode: 'setup' });
          }}
          style={{
            padding: '8px 16px',
            borderRadius: radius.full,
            border: `2px solid ${colors.lavender}50`,
            background: colors.cream,
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: colors.textLight,
            fontFamily: fonts.body,
          }}
        >
          ⚙️ Edit Profile
        </motion.button>
      </motion.div>
    </div>
  );
}
