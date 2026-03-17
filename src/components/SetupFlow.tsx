import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import type { FamilyMember } from '../context/GameContext';
import { useSound } from '../hooks/useSound';

const KAWAII_COLORS = [
  { base: '#F8B4C8', accent: '#FFD4E8' },
  { base: '#B4D8F8', accent: '#D4ECFF' },
  { base: '#C8E6C9', accent: '#E8F5E9' },
  { base: '#FFE082', accent: '#FFF9E6' },
  { base: '#CE93D8', accent: '#F3E5F5' },
  { base: '#FFAB91', accent: '#FBE9E7' },
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

// Floating pandas decoration
function FloatingPandas() {
  const pandas = [
    { top: '5%', left: '5%', delay: 0, size: '2.5rem' },
    { top: '8%', right: '8%', delay: 0.5, size: '2rem' },
    { top: '75%', left: '3%', delay: 1, size: '2.2rem' },
    { top: '70%', right: '5%', delay: 1.5, size: '1.8rem' },
    { top: '40%', left: '2%', delay: 0.8, size: '1.5rem' },
    { top: '35%', right: '3%', delay: 1.2, size: '1.6rem' },
  ];

  return (
    <>
      {pandas.map((p, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -15, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 3,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'fixed',
            top: p.top,
            left: p.left,
            right: (p as any).right,
            fontSize: p.size,
            zIndex: 2,
            opacity: 0.7,
          }}
        >
          🐼
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
      style={{ textAlign: 'center', maxWidth: '500px' }}
    >
      {/* Big panda mascot */}
      <motion.div
        animate={{
          rotate: [-5, 5, -5],
          scale: [1, 1.1, 1],
          y: [0, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontSize: '6rem', marginBottom: '10px' }}
      >
        🐼
      </motion.div>

      {/* Little panda friends */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
        {['🐼', '🐼', '🐼'].map((p, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
            style={{ fontSize: '2rem' }}
          >
            {p}
          </motion.span>
        ))}
      </div>

      <h1 style={{
        fontSize: '2.5rem',
        color: '#7B1FA2',
        margin: '0 0 12px',
        fontFamily: "'Nunito', system-ui, sans-serif",
      }}>
        Welcome to Panda Keys!
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#9C27B0', margin: '0 0 30px' }}>
        Type with your panda friends! 🎋
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        style={{
          background: 'linear-gradient(135deg, #CE93D8, #F48FB1)',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          padding: '16px 48px',
          fontSize: '1.3rem',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(206, 147, 216, 0.5)',
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
      style={{ textAlign: 'center', maxWidth: '500px' }}
    >
      {/* Panda asking your name */}
      <motion.div
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontSize: '4rem', marginBottom: '8px' }}
      >
        🐼
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '8px 16px',
          display: 'inline-block',
          marginBottom: '16px',
          border: '2px solid #E0E0E0',
          position: 'relative',
        }}
      >
        <span style={{ fontSize: '0.9rem', color: '#5D4037' }}>Hi there! What's your name?</span>
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: '8px solid #E0E0E0',
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
          fontSize: '1.5rem',
          borderRadius: '16px',
          border: '3px solid #CE93D8',
          outline: 'none',
          textAlign: 'center',
          fontWeight: 700,
          color: '#7B1FA2',
          background: '#FAF0FF',
          marginBottom: '16px',
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '1rem', color: '#9C27B0', fontWeight: 700 }}>
          How old are you?
        </label>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
          {[5, 6, 7, 8, 9, 10].map(a => (
            <motion.button
              key={a}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAge(a)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: `3px solid ${age === a ? '#CE93D8' : '#E0E0E0'}`,
                background: age === a ? '#CE93D8' : '#fff',
                color: age === a ? '#fff' : '#666',
                fontSize: '1.2rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {a}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Photo upload */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.9rem', color: '#9C27B0', fontWeight: 700 }}>
          Upload your photo (we'll make you a kawaii panda!)
        </label>
        <div style={{ marginTop: '8px' }}>
          {state.playerPhotoUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #CE93D8',
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
                  background: 'linear-gradient(135deg, #E0E0E0, #F5F5F5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #CE93D8',
                  fontSize: '2.5rem',
                }}
              >
                🐼
              </motion.div>
              <span style={{ fontSize: '0.75rem', color: '#9C27B0', maxWidth: '80px' }}>Your kawaii panda!</span>
            </div>
          ) : (
            <label style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: '#F3E5F5',
              borderRadius: '12px',
              border: '2px dashed #CE93D8',
              cursor: 'pointer',
              color: '#7B1FA2',
              fontWeight: 600,
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
          background: name.trim() ? 'linear-gradient(135deg, #CE93D8, #F48FB1)' : '#E0E0E0',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          padding: '14px 40px',
          fontSize: '1.2rem',
          fontWeight: 800,
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
      style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}
    >
      {/* Panda family */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
        {['🐼', '🐼', '🐼', '🐼'].map((p, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            style={{ fontSize: i === 0 || i === 1 ? '2.5rem' : '1.8rem' }}
          >
            {p}
          </motion.span>
        ))}
      </div>

      <h2 style={{ fontSize: '1.8rem', color: '#7B1FA2', margin: '0 0 8px' }}>
        {state.playerName}'s Panda Family
      </h2>
      <p style={{ fontSize: '1rem', color: '#9C27B0', margin: '0 0 24px' }}>
        Add your family, pets & friends! They become pandas too! 🐼
      </p>

      {/* Added members */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        {state.family.map(member => (
          <motion.div
            key={member.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              background: `linear-gradient(135deg, ${member.kawaiiStyle.accentColor}, ${member.kawaiiStyle.baseColor}40)`,
              border: `3px solid ${member.kawaiiStyle.baseColor}`,
              borderRadius: '16px',
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
              <div style={{ fontWeight: 700, color: '#5D4037', fontSize: '0.9rem' }}>{member.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#795548' }}>{member.role}</div>
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
                background: '#FF5252',
                color: '#fff',
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

      {/* Add member form */}
      {addingMember ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: '#ffffffcc',
            borderRadius: '20px',
            padding: '20px',
            border: '3px solid #CE93D8',
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
                  borderRadius: '12px',
                  border: `2px solid ${memberRole === role ? '#CE93D8' : '#E0E0E0'}`,
                  background: memberRole === role ? '#F3E5F5' : '#fff',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
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
              borderRadius: '12px',
              border: '2px solid #CE93D8',
              outline: 'none',
              textAlign: 'center',
              fontWeight: 600,
              color: '#7B1FA2',
              background: '#FAF0FF',
              marginBottom: '12px',
              boxSizing: 'border-box',
            }}
          />

          {/* Photo upload */}
          <div style={{ marginBottom: '12px' }}>
            {memberPhoto ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #CE93D8',
                }}>
                  <img src={memberPhoto} alt="Member" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span>→ 🐼</span>
                <button
                  onClick={() => setMemberPhoto(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF5252', fontSize: '0.8rem' }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <label style={{
                display: 'inline-block',
                padding: '6px 14px',
                background: '#F3E5F5',
                borderRadius: '10px',
                border: '2px dashed #CE93D8',
                cursor: 'pointer',
                color: '#7B1FA2',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>
                📷 Add Photo (becomes a panda!)
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
                background: memberName.trim() ? '#CE93D8' : '#E0E0E0',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 24px',
                fontWeight: 700,
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
                background: '#fff',
                color: '#999',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                padding: '10px 24px',
                fontWeight: 700,
                cursor: 'pointer',
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
            background: '#fff',
            border: '3px dashed #CE93D8',
            borderRadius: '16px',
            padding: '14px 28px',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#7B1FA2',
            cursor: 'pointer',
            marginBottom: '20px',
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
            background: 'linear-gradient(135deg, #CE93D8, #F48FB1)',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '16px 48px',
            fontSize: '1.3rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(206, 147, 216, 0.5)',
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
    }}>
      <FloatingPandas />
      <AnimatePresence mode="wait">
        {step === 0 && <WelcomeStep key="welcome" onNext={handleNext} />}
        {step === 1 && <NameStep key="name" onNext={handleNext} />}
        {step >= 2 && <FamilyStep key="family" />}
      </AnimatePresence>
    </div>
  );
}
