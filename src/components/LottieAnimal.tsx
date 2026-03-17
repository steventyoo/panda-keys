import { useEffect, useState, useRef } from 'react';
import Lottie from 'lottie-react';
import type { LottieRefCurrentProps } from 'lottie-react';

// Free kawaii/cute animal Lottie animations from LottieFiles CDN
// These are publicly available free animations
const LOTTIE_URLS: Record<string, string> = {
  A: 'https://lottie.host/e1b7c4f8-9b5a-4c3e-8d2f-1a6b9c0d5e7f/alpaca.json', // fallback
  B: 'https://assets10.lottiefiles.com/packages/lf20_ygiuluqn.json', // bunny
  C: 'https://assets2.lottiefiles.com/packages/lf20_ysas4vcp.json', // cat
  D: 'https://assets9.lottiefiles.com/packages/lf20_syqnfe7c.json', // dog
  E: 'https://assets2.lottiefiles.com/packages/lf20_x1gjdldd.json', // elephant
  F: 'https://assets10.lottiefiles.com/packages/lf20_ygiuluqn.json', // fox (reuse)
  L: 'https://assets2.lottiefiles.com/packages/lf20_ysas4vcp.json', // lion (reuse cat)
  P: 'https://assets3.lottiefiles.com/packages/lf20_OT15QW.json', // panda
};

interface Props {
  letter: string;
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
  onComplete?: () => void;
}

export default function LottieAnimal({ letter, size = 120, loop = true, autoplay = true, onComplete }: Props) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [failed, setFailed] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    const url = LOTTIE_URLS[letter.toUpperCase()];
    if (!url) {
      setFailed(true);
      return;
    }

    let cancelled = false;
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      })
      .then(data => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => { cancelled = true; };
  }, [letter]);

  if (failed || !animationData) return null;

  return (
    <div style={{ width: size, height: size }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        onComplete={onComplete}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
