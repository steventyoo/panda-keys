import { motion } from 'framer-motion';
import { colors } from '../styles/theme';

// Get kawaii art from fal.ai cache
function getCachedArt(letter: string): string | null {
  try {
    const cache = JSON.parse(localStorage.getItem('panda-keys-art-cache') || '{}');
    return cache[letter] || cache[`${letter}-default`] || null;
  } catch { return null; }
}

// Kawaii animal that blends into the scene — no white box
function JungleAnimal({ letter, size, style }: { letter: string; size: number; style?: React.CSSProperties }) {
  const art = getCachedArt(letter);
  if (art) {
    return (
      <img
        src={art}
        alt=""
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          // Remove white background with mix-blend-mode
          mixBlendMode: 'multiply',
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
          ...style,
        }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.5, ...style }}>🐾</span>;
}

// All 26 animals scattered in the jungle
const JUNGLE_CRITTERS = [
  // Big animals on the hill
  { letter: 'P', bottom: '23%', left: '8%', size: 52, delay: 0, anim: 'bounce' },
  { letter: 'L', bottom: '25%', left: '30%', size: 48, delay: 0.4, anim: 'bounce' },
  { letter: 'E', bottom: '21%', right: '25%', size: 50, delay: 0.8, anim: 'bounce' },
  { letter: 'T', bottom: '24%', right: '8%', size: 46, delay: 1.2, anim: 'bounce' },
  // Medium animals scattered on grass
  { letter: 'B', bottom: '14%', left: '18%', size: 38, delay: 0.3, anim: 'wiggle' },
  { letter: 'K', bottom: '10%', left: '42%', size: 36, delay: 0.7, anim: 'wiggle' },
  { letter: 'M', bottom: '16%', right: '15%', size: 40, delay: 1.0, anim: 'wiggle' },
  { letter: 'D', bottom: '8%', left: '65%', size: 34, delay: 0.5, anim: 'wiggle' },
  { letter: 'F', bottom: '12%', left: '5%', size: 32, delay: 1.4, anim: 'wiggle' },
  { letter: 'R', bottom: '6%', right: '5%', size: 30, delay: 0.9, anim: 'wiggle' },
  // Small animals higher up (in the sky area)
  { letter: 'O', bottom: '35%', left: '5%', size: 28, delay: 0.2, anim: 'float' },
  { letter: 'C', bottom: '38%', right: '8%', size: 30, delay: 0.6, anim: 'float' },
  { letter: 'H', bottom: '42%', left: '22%', size: 26, delay: 1.1, anim: 'float' },
  { letter: 'G', bottom: '36%', right: '22%', size: 28, delay: 1.5, anim: 'float' },
  // Tiny ones sprinkled around
  { letter: 'N', bottom: '18%', left: '55%', size: 24, delay: 0.1, anim: 'wiggle' },
  { letter: 'S', bottom: '4%', left: '30%', size: 26, delay: 0.8, anim: 'wiggle' },
  { letter: 'U', bottom: '28%', left: '70%', size: 22, delay: 1.3, anim: 'float' },
  { letter: 'W', bottom: '32%', left: '48%', size: 24, delay: 0.4, anim: 'float' },
];

const animStyles = {
  bounce: (delay: number) => ({
    animate: { y: [0, -10, 0] },
    transition: { duration: 2.5, delay, repeat: Infinity, ease: 'easeInOut' as const },
  }),
  wiggle: (delay: number) => ({
    animate: { rotate: [-4, 4, -4], y: [0, -3, 0] },
    transition: { duration: 3, delay, repeat: Infinity, ease: 'easeInOut' as const },
  }),
  float: (delay: number) => ({
    animate: { y: [0, -8, 0], x: [0, 3, -3, 0] },
    transition: { duration: 4, delay, repeat: Infinity, ease: 'easeInOut' as const },
  }),
};

// Animated background — lush kawaii jungle
export default function Garden() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      // Rich jungle gradient — deeper greens at bottom, warm sky at top
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

      {/* Jungle hills — layered for depth */}
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

      {/* Jungle foliage — leaves and plants */}
      {[
        { bottom: '30%', left: '0%', emoji: '🌿', size: '2.5rem', opacity: 0.6 },
        { bottom: '32%', right: '0%', emoji: '🌿', size: '2.5rem', opacity: 0.6 },
        { bottom: '26%', left: '20%', emoji: '🍃', size: '1.8rem', opacity: 0.5 },
        { bottom: '28%', right: '18%', emoji: '🍃', size: '1.8rem', opacity: 0.5 },
        { bottom: '34%', left: '40%', emoji: '🌱', size: '1.5rem', opacity: 0.4 },
        { bottom: '33%', right: '35%', emoji: '🌱', size: '1.5rem', opacity: 0.4 },
      ].map((leaf, i) => (
        <motion.div
          key={`leaf-${i}`}
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 4, delay: i * 0.3, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: leaf.bottom,
            left: leaf.left,
            right: (leaf as any).right,
            fontSize: leaf.size,
            opacity: leaf.opacity,
          }}
        >
          {leaf.emoji}
        </motion.div>
      ))}

      {/* Flowers scattered on the hills */}
      {[
        { bottom: '27%', left: '8%', flower: '🌸', delay: 0 },
        { bottom: '24%', left: '22%', flower: '🌼', delay: 0.5 },
        { bottom: '29%', left: '38%', flower: '🌷', delay: 1 },
        { bottom: '22%', left: '55%', flower: '🌻', delay: 1.5 },
        { bottom: '28%', left: '72%', flower: '🌺', delay: 0.8 },
        { bottom: '25%', left: '88%', flower: '🌸', delay: 1.2 },
        { bottom: '20%', left: '3%', flower: '🌼', delay: 0.3 },
        { bottom: '17%', left: '48%', flower: '🌷', delay: 0.7 },
        { bottom: '15%', left: '78%', flower: '🌻', delay: 1.1 },
        { bottom: '19%', left: '33%', flower: '🌺', delay: 0.4 },
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
        { startX: '40%', startY: '45%' },
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

      {/* === KAWAII ANIMALS ALL OVER THE JUNGLE === */}
      {JUNGLE_CRITTERS.map((critter) => {
        const anim = animStyles[critter.anim as keyof typeof animStyles](critter.delay);
        return (
          <motion.div
            key={critter.letter}
            {...anim}
            style={{
              position: 'absolute',
              bottom: critter.bottom,
              left: critter.left,
              right: (critter as any).right,
              zIndex: 1,
            }}
          >
            <JungleAnimal letter={critter.letter} size={critter.size} />
          </motion.div>
        );
      })}

      {/* Bamboo/palm trees on edges */}
      {[
        { left: '1%', height: '40%', emoji: '🎋' },
        { left: '4%', height: '35%', emoji: '🌴' },
        { right: '2%', height: '38%', emoji: '🎋' },
        { right: '5%', height: '33%', emoji: '🌴' },
      ].map((tree, i) => (
        <motion.div
          key={`tree-${i}`}
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 4, delay: i * 0.3, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: tree.left,
            right: (tree as any).right,
            height: tree.height,
            fontSize: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            opacity: 0.45,
          }}
        >
          {tree.emoji}
        </motion.div>
      ))}
    </div>
  );
}
