import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import type { FamilyMember } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { colors, gradients, fonts, radius, kawaiiButton, kawaiiCard } from '../styles/theme';

// Get kawaii art from fal.ai cache
function getCachedArt(letter: string): string | null {
  try {
    const cache = JSON.parse(localStorage.getItem('panda-keys-art-cache') || '{}');
    return cache[letter] || cache[`${letter}-default`] || null;
  } catch { return null; }
}

// Kawaii image component — shows generated art if available, falls back to emoji
function KawaiiImg({ letter, fallback, size = 60, style }: { letter: string; fallback: string; size?: number; style?: React.CSSProperties }) {
  const art = getCachedArt(letter);
  if (art) {
    return <img src={art} alt={fallback} style={{ width: size, height: size, objectFit: 'contain', borderRadius: '50%', mixBlendMode: 'multiply' as const, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))', ...style }} />;
  }
  return <span style={{ fontSize: size * 0.6, ...style }}>{fallback}</span>;
}

const KAWAII_COLORS = [
  { base: colors.pink, accent: colors.blush },
  { base: colors.sky, accent: `${colors.sky}40` },
  { base: colors.mint, accent: `${colors.mint}40` },
  { base: colors.peach, accent: `${colors.peach}40` },
  { base: colors.lavender, accent: `${colors.lavender}40` },
  { base: colors.butter, accent: `${colors.butter}60` },
];

const ROLE_EMOJIS: Record<string, string> = {
  mom: '🐼',
  dad: '🐼',
  sibling: '🐼',
  grandparent: '🐼',
  pet: '🐾',
  friend: '🐼',
};

const EYE_STYLES = ['round', 'sparkle', 'sleepy', 'happy'] as const;

function FloatingKawaii() {
  const critters = [
    { top: '5%', left: '5%', delay: 0, size: 50, letter: 'P' },
    { top: '70%', right: '5%', delay: 1.5, size: 36, letter: 'P' },
  ];

  return (
    <>
      {critters.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 3, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            top: p.top,
            left: p.left,
            right: (p as any).right,
            zIndex: 2,
            opacity: 0.7,
          }}
        >
          <KawaiiImg letter={p.letter} fallback="🐼" size={p.size} />
        </motion.div>
      ))}
    </>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ textAlign: 'center', maxWidth: '500px', padding: '0 16px' }}
    >
      <motion.div
        animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1], y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ marginBottom: '10px' }}
      >
        <KawaiiImg letter="P" fallback="🐼" size={100} />
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          >
            <KawaiiImg letter="P" fallback="🐼" size={44} />
          </motion.div>
        ))}
      </div>

      <h1 style={{
        fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
        color: colors.textAccent,
        margin: '0 0 12px',
        fontFamily: fonts.fun,
      }}>
        Welcome to Panda Keys!
      </h1>
      <p style={{ fontSize: '1.2rem', color: colors.textMedium, margin: '0 0 30px', fontFamily: fonts.body }}>
        Type with your panda friends! 🎋
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        style={{
          ...kawaiiButton(),
          padding: '16px 48px',
          fontSize: '1.3rem',
        }}
      >
        Let's Go! 🐼
      </motion.button>
    </motion.div>
  );
}

function NameStep({ onNext }: { onNext: () => void }) {
  const { state, dispatch } = useGame();
  const [name, setName] = useState(state.playerName);
  const [age, setAge] = useState(state.playerAge);

  const handlePlayerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      dispatch({ type: 'SET_PLAYER_PHOTO', photoUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (name.trim()) {
      dispatch({ type: 'SET_PLAYER', name: name.trim(), age });
      onNext();
    }
  };

  return (
    <motion.div
      key="name"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ textAlign: 'center', maxWidth: '500px', padding: '0 16px' }}
    >
      <motion.div
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ marginBottom: '8px' }}
      >
        <KawaiiImg letter="P" fallback="🐼" size={80} />
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          ...kawaiiCard(colors.lavender),
          padding: '8px 16px',
          display: 'inline-block',
          marginBottom: '16px',
          position: 'relative',
        }}
      >
        <span style={{ fontSize: '0.9rem', color: colors.textDark, fontFamily: fonts.body }}>Hi there! What's your name?</span>
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: `8px solid ${colors.lavender}40`,
        }} />
      </motion.div>

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Type your name..."
        autoFocus
        style={{
          width: '100%',
          padding: '16px 24px',
          fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
          borderRadius: radius.md,
          border: `2.5px solid ${colors.lavender}`,
          outline: 'none',
          textAlign: 'center',
          fontWeight: 700,
          color: colors.textAccent,
          background: colors.cream,
          marginBottom: '16px',
          fontFamily: fonts.heading,
          boxSizing: 'border-box',
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '1rem', color: colors.textAccent, fontWeight: 700, fontFamily: fonts.heading }}>
          How old are you?
        </label>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
          {[5, 6, 7, 8, 9, 10].map(a => (
            <motion.button
              key={a}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAge(a)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: radius.full,
                border: `2.5px solid ${age === a ? colors.lavender : colors.lavender + '40'}`,
                background: age === a ? gradients.primary : colors.cream,
                color: age === a ? colors.white : colors.textMedium,
                fontSize: '1.2rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: fonts.heading,
              }}
            >
              {a}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.9rem', color: colors.textAccent, fontWeight: 700, fontFamily: fonts.heading }}>
          Upload your photo (we'll make you kawaii!)
        </label>
        <div style={{ marginTop: '8px' }}>
          {state.playerPhotoUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid ${colors.lavender}`,
              }}>
                <img src={state.playerPhotoUrl} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ fontSize: '1.5rem' }}
              >
                →
              </motion.span>
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.blush}, ${colors.cream})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `3px solid ${colors.lavender}`,
                  fontSize: '2.5rem',
                }}
              >
                🐼
              </motion.div>
              <span style={{ fontSize: '0.75rem', color: colors.textAccent, maxWidth: '80px', fontFamily: fonts.body }}>Your kawaii avatar!</span>
            </div>
          ) : (
            <label style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: colors.cream,
              borderRadius: radius.sm,
              border: `2px dashed ${colors.lavender}`,
              cursor: 'pointer',
              color: colors.textAccent,
              fontWeight: 600,
              fontFamily: fonts.body,
            }}>
              📷 Choose Photo
              <input type="file" accept="image/*" onChange={handlePlayerPhotoUpload} style={{ display: 'none' }} />
            </label>
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        disabled={!name.trim()}
        style={{
          ...kawaiiButton(),
          background: name.trim() ? gradients.primary : `${colors.lavender}40`,
          padding: '14px 40px',
          fontSize: '1.2rem',
          cursor: name.trim() ? 'pointer' : 'default',
        }}
      >
        Next 🐼✨
      </motion.button>
    </motion.div>
  );
}

function FamilyStep() {
  const { state, dispatch } = useGame();
  const { play } = useSound();
  const [addingMember, setAddingMember] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('mom');
  const [memberPhoto, setMemberPhoto] = useState<string | null>(null);

  const handleAddMember = () => {
    const colorSet = KAWAII_COLORS[state.family.length % KAWAII_COLORS.length];
    const member: FamilyMember = {
      id: Date.now().toString(),
      name: memberName,
      role: memberRole,
      avatar: ROLE_EMOJIS[memberRole] || '🐼',
      kawaiiStyle: {
        baseColor: colorSet.base,
        accentColor: colorSet.accent,
        eyes: EYE_STYLES[Math.floor(Math.random() * EYE_STYLES.length)],
      },
      photoUrl: memberPhoto || undefined,
    };
    dispatch({ type: 'ADD_FAMILY', member });
    play('pop');
    setMemberName('');
    setMemberPhoto(null);
    setAddingMember(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setMemberPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      key="family"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ textAlign: 'center', maxWidth: '600px', width: '100%', padding: '0 16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px', alignItems: 'flex-end' }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
          >
            <KawaiiImg letter="P" fallback="🐼" size={i === 0 || i === 1 ? 50 : 38} />
          </motion.div>
        ))}
      </div>

      <h2 style={{ fontSize: 'clamp(1.3rem, 5vw, 1.8rem)', color: colors.textAccent, margin: '0 0 8px', fontFamily: fonts.fun }}>
        {state.playerName}'s Panda Family
      </h2>
      <p style={{ fontSize: '1rem', color: colors.textMedium, margin: '0 0 24px', fontFamily: fonts.body }}>
        Add your family, pets & friends! They become pandas too! 🐼
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        {state.family.map(member => (
          <motion.div
            key={member.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              background: `linear-gradient(135deg, ${member.kawaiiStyle.accentColor}, ${member.kawaiiStyle.baseColor}40)`,
              border: `2.5px solid ${member.kawaiiStyle.baseColor}60`,
              borderRadius: radius.md,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
            }}
          >
            {member.photoUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${member.kawaiiStyle.baseColor}`,
                }}>
                  <img src={member.photoUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '1.2rem' }}>🐼</span>
              </div>
            ) : (
              <span style={{ fontSize: '1.5rem' }}>🐼</span>
            )}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: colors.textDark, fontSize: '0.9rem', fontFamily: fonts.heading }}>{member.name}</div>
              <div style={{ fontSize: '0.7rem', color: colors.textMedium, fontFamily: fonts.body }}>{member.role}</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => dispatch({ type: 'REMOVE_FAMILY', id: member.id })}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: colors.pinkDeep,
                color: colors.white,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </motion.button>
          </motion.div>
        ))}
      </div>

      {addingMember ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            ...kawaiiCard(colors.lavender),
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
            {Object.entries(ROLE_EMOJIS).map(([role, emoji]) => (
              <motion.button
                key={role}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMemberRole(role)}
                style={{
                  padding: '8px 14px',
                  borderRadius: radius.sm,
                  border: `2px solid ${memberRole === role ? colors.lavender : colors.lavender + '30'}`,
                  background: memberRole === role ? `${colors.lavender}30` : colors.cream,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: fonts.body,
                  color: colors.textDark,
                }}
              >
                {emoji} {role}
              </motion.button>
            ))}
          </div>
          <input
            type="text"
            value={memberName}
            onChange={e => setMemberName(e.target.value)}
            placeholder={`${memberRole === 'pet' ? "Pet's" : "Their"} name...`}
            autoFocus
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1.1rem',
              borderRadius: radius.sm,
              border: `2px solid ${colors.lavender}`,
              outline: 'none',
              textAlign: 'center',
              fontWeight: 600,
              color: colors.textAccent,
              background: colors.cream,
              marginBottom: '12px',
              boxSizing: 'border-box',
              fontFamily: fonts.heading,
            }}
          />

          <div style={{ marginBottom: '12px' }}>
            {memberPhoto ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${colors.lavender}`,
                }}>
                  <img src={memberPhoto} alt="Member" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span>→ 🐼</span>
                <button
                  onClick={() => setMemberPhoto(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.pinkDeep, fontSize: '0.8rem', fontFamily: fonts.body }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <label style={{
                display: 'inline-block',
                padding: '6px 14px',
                background: colors.cream,
                borderRadius: radius.sm,
                border: `2px dashed ${colors.lavender}`,
                cursor: 'pointer',
                color: colors.textAccent,
                fontSize: '0.85rem',
                fontWeight: 600,
                fontFamily: fonts.body,
              }}>
                📷 Add Photo (becomes kawaii!)
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddMember}
              disabled={!memberName.trim()}
              style={{
                ...kawaiiButton(colors.lavender, memberName.trim() ? gradients.primary : `${colors.lavender}40`),
                padding: '10px 24px',
                fontSize: '1rem',
                cursor: memberName.trim() ? 'pointer' : 'default',
              }}
            >
              Add 🐼
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setAddingMember(false); setMemberName(''); setMemberPhoto(null); }}
              style={{
                background: colors.cream,
                color: colors.textLight,
                border: `2px solid ${colors.lavender}30`,
                borderRadius: radius.xl,
                padding: '10px 24px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: fonts.heading,
                fontSize: '1rem',
              }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAddingMember(true)}
          style={{
            background: colors.cream,
            border: `2.5px dashed ${colors.lavender}`,
            borderRadius: radius.md,
            padding: '14px 28px',
            fontSize: '1rem',
            fontWeight: 700,
            color: colors.textAccent,
            cursor: 'pointer',
            marginBottom: '20px',
            fontFamily: fonts.heading,
          }}
        >
          + Add Family, Pet, or Friend 🐼
        </motion.button>
      )}

      <div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            dispatch({ type: 'COMPLETE_SETUP' });
            play('celebrate');
          }}
          style={{
            ...kawaiiButton(),
            padding: '16px 48px',
            fontSize: '1.3rem',
          }}
        >
          Start Playing! 🐼🎮
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function SetupFlow() {
  const [step, setStep] = useState(0);
  const { play } = useSound();

  const handleNext = () => {
    try { play('sparkle'); } catch { /* ignore audio errors */ }
    setStep(s => s + 1);
  };

  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflow: 'auto',
    }}>
      <FloatingKawaii />
      <AnimatePresence mode="wait">
        {step === 0 && <WelcomeStep key="welcome" onNext={handleNext} />}
        {step === 1 && <NameStep key="name" onNext={handleNext} />}
        {step >= 2 && <FamilyStep key="family" />}
      </AnimatePresence>
    </div>
  );
}
