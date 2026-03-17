import { useState } from 'react';
import { motion } from 'framer-motion';
import { animals } from '../data/animals';
import { useFalAI } from '../hooks/useFalAI';
import { useGame } from '../context/GameContext';

export default function ArtGenerator() {
  const { state, dispatch } = useGame();
  const { generateKawaiiAnimal, generateAllAnimals, generating, error } = useFalAI();
  const [apiKey, setApiKey] = useState(localStorage.getItem('fal-api-key') || '');
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('panda-keys-art-cache') || '{}');
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
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'SET_MODE', mode: 'menu' })}
          style={{
            background: '#fff',
            border: '3px solid #F8BBD0',
            borderRadius: '16px',
            padding: '8px 16px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 700,
            color: '#E91E63',
          }}
        >
          ← Back
        </motion.button>

        <div style={{
          fontSize: '1.3rem',
          fontWeight: 900,
          color: '#7B1FA2',
          background: '#ffffffcc',
          borderRadius: '16px',
          padding: '8px 24px',
          border: '3px solid #CE93D8',
        }}>
          🎨 Art Studio
        </div>
      </div>

      {/* API Key */}
      <div style={{
        background: '#ffffffcc',
        borderRadius: '20px',
        padding: '20px',
        border: '3px solid #CE93D8',
        marginBottom: '20px',
        maxWidth: '600px',
        margin: '0 auto 20px',
      }}>
        <h3 style={{ color: '#7B1FA2', margin: '0 0 12px', fontSize: '1.1rem' }}>
          🤖 fal.ai - Generate Kawaii Art
        </h3>
        <p style={{ color: '#9C27B0', fontSize: '0.85rem', margin: '0 0 12px' }}>
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
                borderRadius: '12px',
                border: '2px solid #CE93D8',
                outline: 'none',
                fontSize: '0.9rem',
                color: '#7B1FA2',
                background: '#FAF0FF',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveKey}
              disabled={!apiKey}
              style={{
                background: apiKey ? '#CE93D8' : '#E0E0E0',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: 700,
                cursor: apiKey ? 'pointer' : 'default',
              }}
            >
              Save
            </motion.button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#4CAF50', fontWeight: 700, fontSize: '0.9rem' }}>
              ✓ API key saved
            </span>
            <button
              onClick={() => setShowApiInput(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9C27B0',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textDecoration: 'underline',
              }}
            >
              Change
            </button>
          </div>
        )}

        {/* Generate all button */}
        {apiKey && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateAll}
            disabled={generating}
            style={{
              marginTop: '16px',
              width: '100%',
              background: generating
                ? '#E0E0E0'
                : 'linear-gradient(135deg, #CE93D8, #F48FB1)',
              color: '#fff',
              border: 'none',
              borderRadius: '16px',
              padding: '14px',
              fontSize: '1.1rem',
              fontWeight: 800,
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
            color: '#F44336',
            fontSize: '0.85rem',
            background: '#FFEBEE',
            borderRadius: '8px',
            padding: '8px 12px',
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Animal grid with generated/emoji art */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '12px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {Object.values(animals).map(animal => {
          const hasGenerated = generatedImages[animal.letter];
          const hasActionGenerated = generatedImages[`${animal.letter}-roaring`] || generatedImages[`${animal.letter}-waving`];

          return (
            <motion.div
              key={animal.letter}
              whileHover={{ scale: 1.05, y: -3 }}
              style={{
                background: '#ffffffcc',
                borderRadius: '16px',
                padding: '12px',
                border: `2px solid ${hasGenerated ? animal.color : '#E0E0E0'}`,
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
                    borderRadius: '12px',
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
                color: '#5D4037',
                marginTop: '4px',
              }}>
                {animal.letter} - {animal.name}
              </div>
              {!hasGenerated && apiKey && (
                <div style={{
                  fontSize: '0.65rem',
                  color: '#9C27B0',
                  marginTop: '2px',
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
