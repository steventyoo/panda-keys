import { motion } from 'framer-motion';
import { colors, gradients } from '../styles/theme';

// Animated background garden scene — soft kawaii palette
export default function Garden() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      background: gradients.garden,
    }}>
      {/* Sun */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '5%',
          right: '10%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.butter}, ${colors.peach})`,
          boxShadow: `0 0 40px ${colors.butter}80, 0 0 80px ${colors.butter}40`,
        }}
      />

      {/* Clouds */}
      {[
        { top: '8%', left: '15%', size: 1, duration: 30 },
        { top: '15%', left: '55%', size: 0.7, duration: 25 },
        { top: '5%', left: '75%', size: 0.85, duration: 35 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: cloud.duration, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: cloud.top,
            left: cloud.left,
            fontSize: `${cloud.size * 4}rem`,
            opacity: 0.5,
            filter: 'blur(1px)',
          }}
        >
          ☁️
        </motion.div>
      ))}

      {/* Grass hills — soft mint */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: `linear-gradient(180deg, ${colors.mint}, ${colors.mintDeep})`,
        borderRadius: '50% 50% 0 0 / 20% 20% 0 0',
      }} />

      {/* Flowers */}
      {[
        { bottom: '25%', left: '10%', flower: '🌸', delay: 0 },
        { bottom: '22%', left: '25%', flower: '🌼', delay: 0.5 },
        { bottom: '28%', left: '40%', flower: '🌷', delay: 1 },
        { bottom: '20%', left: '60%', flower: '🌻', delay: 1.5 },
        { bottom: '26%', left: '75%', flower: '🌺', delay: 0.8 },
        { bottom: '23%', left: '88%', flower: '🌸', delay: 1.2 },
        { bottom: '18%', left: '5%', flower: '🌼', delay: 0.3 },
        { bottom: '15%', left: '50%', flower: '🌷', delay: 0.7 },
      ].map((f, i) => (
        <motion.div
          key={i}
          animate={{ rotate: [-5, 5, -5], y: [0, -3, 0] }}
          transition={{ duration: 3, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: f.bottom,
            left: f.left,
            fontSize: '1.5rem',
          }}
        >
          {f.flower}
        </motion.div>
      ))}

      {/* Butterflies */}
      {[
        { color: colors.pink, startX: '20%', startY: '40%' },
        { color: colors.lavender, startX: '70%', startY: '35%' },
      ].map((b, i) => (
        <motion.div
          key={`butterfly-${i}`}
          animate={{
            x: [0, 50, -30, 70, 0],
            y: [0, -30, -50, -20, 0],
          }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: b.startX,
            top: b.startY,
            fontSize: '1.2rem',
          }}
        >
          🦋
        </motion.div>
      ))}

      {/* Rainbow (subtle pastel) */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '30%',
        width: '300px',
        height: '150px',
        borderRadius: '150px 150px 0 0',
        border: '8px solid transparent',
        borderTop: `8px solid ${colors.pink}20`,
        background: `linear-gradient(180deg, ${colors.pink}08, ${colors.peach}08, ${colors.butter}08, ${colors.mint}08, ${colors.sky}08, ${colors.lavender}08) padding-box`,
        opacity: 0.5,
      }} />

      {/* Pandas peeking from behind the hill */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '22%',
          left: '15%',
          fontSize: '2rem',
          zIndex: 1,
        }}
      >
        🐼
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '12%',
          fontSize: '1.8rem',
          zIndex: 1,
        }}
      >
        🐼
      </motion.div>
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '24%',
          left: '55%',
          fontSize: '1.4rem',
          zIndex: 1,
        }}
      >
        🐼
      </motion.div>

      {/* Bamboo stalks */}
      {[
        { left: '3%', height: '35%' },
        { left: '6%', height: '30%' },
        { right: '4%', height: '33%' },
        { right: '7%', height: '28%' },
      ].map((bamboo, i) => (
        <motion.div
          key={`bamboo-${i}`}
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 4, delay: i * 0.3, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: bamboo.left,
            right: (bamboo as any).right,
            height: bamboo.height,
            fontSize: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            opacity: 0.5,
          }}
        >
          🎋
        </motion.div>
      ))}
    </div>
  );
}
