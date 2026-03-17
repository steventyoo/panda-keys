import { motion } from 'framer-motion';

const COLORS = ['#FF6B9D', '#C084FC', '#60A5FA', '#34D399', '#FBBF24', '#FB923C', '#F472B6'];

interface Props {
  count?: number;
}

export default function Confetti({ count = 30 }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const size = 6 + Math.random() * 10;
        const color = COLORS[i % COLORS.length];
        const shape = Math.random() > 0.5 ? '50%' : '2px';

        return (
          <motion.div
            key={i}
            initial={{
              x: `${x}vw`,
              y: '-5vh',
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: '105vh',
              rotate: Math.random() * 720 - 360,
              x: `${x + (Math.random() * 20 - 10)}vw`,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay,
              ease: 'easeIn',
            }}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: shape,
              background: color,
            }}
          />
        );
      })}
    </div>
  );
}
