import { useCallback, useRef } from 'react';

// Web Audio API based sound synthesis with realistic animal sounds
class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  pop() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  sparkle() {
    const ctx = this.getContext();
    [800, 1000, 1200, 1400].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.2);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.2);
    });
  }

  bounce() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  squeak() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  whoosh() {
    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.3);
    filter.Q.value = 2;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }

  celebrate() {
    const ctx = this.getContext();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  }

  wrong() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  eggCrack() {
    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    setTimeout(() => this.sparkle(), 100);
  }

  // ===== ANIMAL SOUNDS =====

  private meow() {
    const ctx = this.getContext();
    // Two-part meow: rising then falling
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.linearRampToValueAtTime(700, t + 0.15);
    osc.frequency.linearRampToValueAtTime(550, t + 0.3);
    osc.frequency.linearRampToValueAtTime(400, t + 0.4);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  private woof() {
    const ctx = this.getContext();
    // Short percussive bark
    const t = ctx.currentTime;
    // Noise burst for the "b" attack
    const bufSize = ctx.sampleRate * 0.05;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 3);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.2, t);
    noise.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(t);
    // Tonal bark
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.15);
    gain.gain.setValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  private roar() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    // Deep rumbling roar
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.frequency.setValueAtTime(80, t);
    osc1.frequency.linearRampToValueAtTime(150, t + 0.2);
    osc1.frequency.linearRampToValueAtTime(100, t + 0.5);
    osc2.frequency.setValueAtTime(120, t);
    osc2.frequency.linearRampToValueAtTime(200, t + 0.2);
    osc2.frequency.linearRampToValueAtTime(130, t + 0.5);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.1);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.6);
    osc2.stop(t + 0.6);
    // Add noise for texture
    const bufSize = ctx.sampleRate * 0.5;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = 'lowpass';
    nFilter.frequency.value = 400;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.01, t);
    nGain.gain.linearRampToValueAtTime(0.08, t + 0.15);
    nGain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(t);
  }

  private trumpetElephant() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 3;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.linearRampToValueAtTime(600, t + 0.15);
    osc.frequency.linearRampToValueAtTime(500, t + 0.3);
    osc.frequency.linearRampToValueAtTime(350, t + 0.5);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
    gain.gain.setValueAtTime(0.2, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.55);
    osc.start(t);
    osc.stop(t + 0.55);
  }

  private chirpBird() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    // Quick chirp-chirp
    [0, 0.15].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(2000, t + delay);
      osc.frequency.linearRampToValueAtTime(2800, t + delay + 0.04);
      osc.frequency.linearRampToValueAtTime(1800, t + delay + 0.08);
      gain.gain.setValueAtTime(0.15, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.1);
      osc.start(t + delay);
      osc.stop(t + delay + 0.1);
    });
  }

  private hoot() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    // Deep, resonant hoo-hoo
    [0, 0.3].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(350, t + delay);
      osc.frequency.linearRampToValueAtTime(300, t + delay + 0.2);
      gain.gain.setValueAtTime(0.01, t + delay);
      gain.gain.linearRampToValueAtTime(0.18, t + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.25);
      osc.start(t + delay);
      osc.stop(t + delay + 0.25);
    });
  }

  private monkeyOoh() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    // Ooh-ooh-ah-ah!
    const freqs = [600, 800, 500, 700];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      const delay = i * 0.1;
      osc.frequency.setValueAtTime(freq, t + delay);
      osc.frequency.linearRampToValueAtTime(freq * 1.2, t + delay + 0.05);
      osc.frequency.linearRampToValueAtTime(freq * 0.8, t + delay + 0.08);
      gain.gain.setValueAtTime(0.15, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.1);
      osc.start(t + delay);
      osc.stop(t + delay + 0.1);
    });
  }

  private splashSound() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    // Water splash: noise burst + descending bubbles
    const bufSize = ctx.sampleRate * 0.2;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.12, t);
    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(t);
    // Bubbles
    [0.1, 0.18, 0.25].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      const baseFreq = 400 + Math.random() * 300;
      osc.frequency.setValueAtTime(baseFreq, t + delay);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + delay + 0.06);
      gain.gain.setValueAtTime(0.1, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.08);
      osc.start(t + delay);
      osc.stop(t + delay + 0.08);
    });
  }

  private whaleSong() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(250, t + 0.3);
    osc.frequency.linearRampToValueAtTime(180, t + 0.5);
    osc.frequency.linearRampToValueAtTime(120, t + 0.8);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.1);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.9);
    osc.start(t);
    osc.stop(t + 0.9);
  }

  private yip() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    // Quick fox yip
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(1000, t + 0.05);
    osc.frequency.linearRampToValueAtTime(700, t + 0.12);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  private moo() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.linearRampToValueAtTime(150, t + 0.2);
    osc.frequency.linearRampToValueAtTime(130, t + 0.5);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
    gain.gain.setValueAtTime(0.12, t + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.55);
    osc.start(t);
    osc.stop(t + 0.55);
  }

  private neigh() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 2;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.linearRampToValueAtTime(400, t + 0.1);
    osc.frequency.linearRampToValueAtTime(350, t + 0.2);
    osc.frequency.linearRampToValueAtTime(250, t + 0.35);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  private snore() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    // Cute sleepy snore
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(200, t + 0.2);
    osc.frequency.linearRampToValueAtTime(100, t + 0.5);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.1);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  private munch() {
    const ctx = this.getContext();
    const t = ctx.currentTime;
    [0, 0.1, 0.2].forEach(delay => {
      const bufSize = ctx.sampleRate * 0.04;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 4);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, t + delay);
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(t + delay);
    });
  }

  animalSound(type: string) {
    switch (type) {
      case 'meow': this.meow(); break;
      case 'woof': this.woof(); break;
      case 'roar': case 'growl': this.roar(); break;
      case 'trumpet': this.trumpetElephant(); break;
      case 'chirp': case 'tweet': this.chirpBird(); break;
      case 'hoot': case 'caw': this.hoot(); break;
      case 'ooh-ooh': this.monkeyOoh(); break;
      case 'splash': case 'bloop': case 'bubble': this.splashSound(); break;
      case 'whale-song': this.whaleSong(); break;
      case 'yip': this.yip(); break;
      case 'moo': this.moo(); break;
      case 'neigh': this.neigh(); break;
      case 'snore': case 'yawn': this.snore(); break;
      case 'munch': case 'chitter': this.munch(); break;
      case 'squeak': case 'soft-bleat': this.squeak(); break;
      case 'sparkle': this.sparkle(); break;
      case 'hum': this.snore(); break;
      default: this.pop();
    }
  }
}

const soundEngine = new SoundEngine();

export function useSound() {
  const engineRef = useRef(soundEngine);

  const play = useCallback((sound: 'pop' | 'sparkle' | 'bounce' | 'squeak' | 'whoosh' | 'celebrate' | 'wrong' | 'eggCrack') => {
    try { engineRef.current[sound](); } catch { /* ignore */ }
  }, []);

  const playAnimalSound = useCallback((soundType: string) => {
    try { engineRef.current.animalSound(soundType); } catch { /* ignore */ }
  }, []);

  return { play, playAnimalSound };
}
