import { useState } from 'react';
import { motion } from 'framer-motion';
import { animals } from '../data/animals';
import { useFalAI } from '../hooks/useFalAI';
import { useGame } from '../context/GameContext';
import { colors, gradients, fonts, radius, kawaiiButton, kawaiiCard } from '../styles/theme';

export default function ArtGenerator() {
  const { state, dispatch } = useGame();
  const { generateKawaiiAnimal, generateAllAnimals, generating, error } = useFalAI();
  const [apiKey, setApiKey] = useState(localStorage.getItem('fal-api-key') || '');
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('panda-keys-art-cache') || '{}');
      // Normalize keys: "A-default" -> "A" for display lookup
      const normalized: Record<string, string> = {};
      for (const [key, val] of Object.entries(raw)) {
        const letter = key.replace('-default', '');
        normalized[letter] = val as string;
      }
      return normalized;
    } catch { return {}; }
  });
  const [showApiInput, setShowApiInput] = useState(!apiKey);

  const handleSaveKey = () => {
    localStorage.setItem('fal-api-key', apiKey);
    setShowApiInput(false);
  };

  const handleGenerateAll = async () => {
    if (!apiKey) return;
    localStorage.setItem('fal-api-key', apiKey);

    const animalList = Object.values(animals).map(a => ({
      name: a.name,
      letter: a.letter,
    }));

    const results = await generateAllAnimals(animalList, apiKey, (done, total) => {
      setProgress({ done, total });
    });

    const newImages: Record<string, string> = { ...generatedImages };
    results.forEach(r => { newImages[r.letter] = r.url; });
    setGeneratedImages(newImages);
  };

  const handleGenerateSingle = async (letter: string, name: string, action?: string) => {
    if (!apiKey) return;
    const result = await generateKawaiiAnimal(name, letter, apiKey, action);
    if (result) {
      setGeneratedImages(prev => ({ ...prev, [letter]: result.url }));
    }
  };

  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      minHeight: '100vh',
      padding: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'SET_MODE', mode: 'menu' })}
          style={{
            ...kawaiiCard(colors.pink),
            padding: '8px 16px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 700,
            color: colors.pinkDeep,
            fontFamily: fonts.heading,
            border: `2.5px solid ${colors.pink}60`,
          }}
        >
          ← Back
        </motion.button>

        <div style={{
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          fontWeight: 700,
          color: colors.textAccent,
          ...kawaiiCard(colors.lavender),
          padding: '8px 20px',
          border: `2.5px solid ${colors.lavender}40`,
          fontFamily: fonts.heading,
        }}>
          🎨 Art Studio
        </div>
      </div>

      {/* API Key section */}
      <div style={{
        ...kawaiiCard(colors.lavender),
        padding: '20px',
        border: `2.5px solid ${colors.lavender}40`,
        marginBottom: '20px',
        maxWidth: '600px',
        margin: '0 auto 20px',
      }}>
        <h3 style={{ color: colors.textAccent, margin: '0 0 12px', fontSize: '1.1rem', fontFamily: fonts.heading }}>
          🤖 fal.ai - Generate Kawaii Art
        </h3>
        <p style={{ color: colors.textMedium, fontSize: '0.85rem', margin: '0 0 12px', fontFamily: fonts.body }}>
          Generate unique kawaii animals with AI! Get a free API key at fal.ai
        </p>

        {showApiInput || !apiKey ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Enter fal.ai API key..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: radius.sm,
                border: `2px solid ${colors.lavender}`,
                outline: 'none',
                fontSize: '0.9rem',
                color: colors.textAccent,
                background: colors.cream,
                fontFamily: fonts.body,
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveKey}
              disabled={!apiKey}
              style={{
                ...kawaiiButton(colors.lavender, apiKey ? gradients.primary : `${colors.lavender}40`),
                padding: '10px 20px',
                fontSize: '0.9rem',
                cursor: apiKey ? 'pointer' : 'default',
              }}
            >
              Save
            </motion.button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: colors.mintDeep, fontWeight: 700, fontSize: '0.9rem', fontFamily: fonts.body }}>
              ✓ API key saved
            </span>
            <button
              onClick={() => setShowApiInput(true)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.textAccent,
                cursor: 'pointer',
                fontSize: '0.8rem',
                textDecoration: 'underline',
                fontFamily: fonts.body,
              }}
            >
              Change
            </button>
          </div>
        )}

        {apiKey && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateAll}
            disabled={generating}
            style={{
              marginTop: '16px',
              width: '100%',
              ...kawaiiButton(colors.lavender, generating ? `${colors.lavender}40` : gradients.primary),
              padding: '14px',
              fontSize: '1.1rem',
              cursor: generating ? 'default' : 'pointer',
            }}
          >
            {generating
              ? `Generating... ${progress.done}/${progress.total} 🎨`
              : '✨ Generate All 26 Kawaii Animals ✨'}
          </motion.button>
        )}

        {error && (
          <div style={{
            marginTop: '8px',
            color: colors.pinkDeep,
            fontSize: '0.85rem',
            background: `${colors.pink}30`,
            borderRadius: radius.sm,
            padding: '8px 12px',
            fontFamily: fonts.body,
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Animal grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(120px, 28vw), 1fr))',
        gap: '12px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {Object.values(animals).map(animal => {
          const hasGenerated = generatedImages[animal.letter];

          return (
            <motion.div
              key={animal.letter}
              whileHover={{ scale: 1.05, y: -3 }}
              style={{
                ...kawaiiCard(hasGenerated ? animal.color : colors.lavender),
                padding: '12px',
                border: `2px solid ${hasGenerated ? animal.color + '50' : colors.lavender + '30'}`,
                textAlign: 'center',
                cursor: apiKey ? 'pointer' : 'default',
              }}
              onClick={() => {
                if (apiKey && !generating) {
                  handleGenerateSingle(animal.letter, animal.name);
                }
              }}
            >
              {hasGenerated ? (
                <img
                  src={hasGenerated}
                  alt={animal.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain',
                    borderRadius: radius.sm,
                    mixBlendMode: 'multiply' as const,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  }}
                />
              ) : (
                <div style={{
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  margin: '0 auto',
                }}>
                  {animal.emoji}
                </div>
              )}
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.textDark,
                marginTop: '4px',
                fontFamily: fonts.heading,
              }}>
                {animal.letter} - {animal.name}
              </div>
              {!hasGenerated && apiKey && (
                <div style={{
                  fontSize: '0.65rem',
                  color: colors.textAccent,
                  marginTop: '2px',
                  fontFamily: fonts.body,
                }}>
                  Click to generate
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
