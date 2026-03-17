import { motion } from 'framer-motion';
import { colors } from '../styles/theme';

// Animated background — soft kawaii landscape (panda only, no other animals)
export default function Garden() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      background: `linear-gradient(180deg,
        ${colors.sky}50 0%,
        ${colors.cream} 25%,
        ${colors.mint}40 50%,
        ${colors.mint}80 70%,
        ${colors.mintDeep} 100%)`,
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
        { top: '6%', left: '10%', size: 1.1, duration: 30 },
        { top: '12%', left: '50%', size: 0.7, duration: 25 },
        { top: '3%', left: '70%', size: 0.85, duration: 35 },
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
            opacity: 0.45,
            filter: 'blur(1px)',
          }}
        >
          ☁️
        </motion.div>
      ))}

      {/* Rolling hills — layered for depth */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '-5%',
        right: '-5%',
        height: '38%',
        background: `linear-gradient(180deg, ${colors.mint}90, ${colors.mintDeep})`,
        borderRadius: '50% 50% 0 0 / 30% 30% 0 0',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '10%',
        right: '-10%',
        height: '32%',
        background: `linear-gradient(180deg, ${colors.mint}70, ${colors.mintDeep}dd)`,
        borderRadius: '60% 40% 0 0 / 25% 20% 0 0',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '-10%',
        right: '10%',
        height: '28%',
        background: `linear-gradient(180deg, ${colors.mintDeep}cc, ${colors.mintDeep})`,
        borderRadius: '40% 60% 0 0 / 20% 25% 0 0',
      }} />

      {/* Flowers scattered on the hills */}
      {[
        { bottom: '27%', left: '8%', flower: '🌸', delay: 0 },
        { bottom: '24%', left: '22%', flower: '🌼', delay: 0.5 },
        { bottom: '29%', left: '38%', flower: '🌷', delay: 1 },
        { bottom: '22%', left: '55%', flower: '🌻', delay: 1.5 },
        { bottom: '28%', left: '72%', flower: '🌺', delay: 0.8 },
        { bottom: '25%', left: '88%', flower: '🌸', delay: 1.2 },
      ].map((f, i) => (
        <motion.div
          key={`flower-${i}`}
          animate={{ rotate: [-5, 5, -5], y: [0, -3, 0] }}
          transition={{ duration: 3, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: f.bottom,
            left: f.left,
            fontSize: '1.3rem',
          }}
        >
          {f.flower}
        </motion.div>
      ))}

      {/* Butterflies */}
      {[
        { startX: '15%', startY: '35%' },
        { startX: '65%', startY: '30%' },
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

      {/* Rainbow (subtle) */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '25%',
        width: '350px',
        height: '175px',
        borderRadius: '175px 175px 0 0',
        border: '8px solid transparent',
        borderTop: `8px solid ${colors.pink}15`,
        background: `linear-gradient(180deg, ${colors.pink}06, ${colors.peach}06, ${colors.butter}06, ${colors.mint}06, ${colors.sky}06, ${colors.lavender}06) padding-box`,
        opacity: 0.6,
      }} />
    </div>
  );
}
