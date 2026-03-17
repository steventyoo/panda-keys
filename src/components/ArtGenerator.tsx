import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFalAI } from '../hooks/useFalAI';
import { useGame } from '../context/GameContext';
import { colors, gradients, fonts, radius, kawaiiButton, kawaiiCard } from '../styles/theme';

interface CreatedImage {
  url: string;
  prompt: string;
}

export default function ArtGenerator() {
  const { dispatch } = useGame();
  const { generateFreeform, generating, error } = useFalAI();
  const [apiKey, setApiKey] = useState(localStorage.getItem('fal-api-key') || '');
  const [showApiInput, setShowApiInput] = useState(!apiKey);
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<CreatedImage[]>([]);

  const handleSaveKey = () => {
    localStorage.setItem('fal-api-key', apiKey);
    setShowApiInput(false);
  };

  const handleGenerate = async () => {
    if (!apiKey || !prompt.trim() || generating) return;
    localStorage.setItem('fal-api-key', apiKey);
    const url = await generateFreeform(prompt.trim(), apiKey);
    if (url) {
      setImages(prev => [{ url, prompt: prompt.trim() }, ...prev]);
      setPrompt('');
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

      {/* Main content */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        {/* API Key section (collapsed when saved) */}
        {(showApiInput || !apiKey) && (
          <div style={{
            ...kawaiiCard(colors.lavender),
            padding: '16px',
            border: `2.5px solid ${colors.lavender}40`,
            marginBottom: '16px',
          }}>
            <p style={{ color: colors.textMedium, fontSize: '0.85rem', margin: '0 0 10px', fontFamily: fonts.body }}>
              Enter your fal.ai API key to create art
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="fal.ai API key..."
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
          </div>
        )}

        {/* Prompt input */}
        <div style={{
          ...kawaiiCard(colors.butter),
          padding: '20px',
          border: `2.5px solid ${colors.butter}60`,
          marginBottom: '20px',
        }}>
          <h2 style={{
            margin: '0 0 12px',
            fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
            color: colors.textAccent,
            fontFamily: fonts.fun,
            textAlign: 'center',
          }}>
            What do you want to draw?
          </h2>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="A princess riding a dragon above a castle..."
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '14px',
              borderRadius: radius.md,
              border: `2.5px solid ${colors.lavender}50`,
              outline: 'none',
              fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
              color: colors.textDark,
              background: colors.cream,
              fontFamily: fonts.body,
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            disabled={generating || !prompt.trim() || !apiKey}
            style={{
              marginTop: '12px',
              width: '100%',
              ...kawaiiButton(
                colors.pink,
                generating || !prompt.trim() || !apiKey ? `${colors.lavender}40` : gradients.primary,
              ),
              padding: '14px',
              fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
              cursor: generating || !prompt.trim() || !apiKey ? 'default' : 'pointer',
            }}
          >
            {generating ? '✨ Creating...' : '✨ Create!'}
          </motion.button>

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

          {!apiKey && (
            <p style={{
              margin: '8px 0 0',
              fontSize: '0.8rem',
              color: colors.textLight,
              textAlign: 'center',
              fontFamily: fonts.body,
            }}>
              Add your fal.ai API key above to start creating
            </p>
          )}

          {apiKey && !showApiInput && (
            <button
              onClick={() => setShowApiInput(true)}
              style={{
                display: 'block',
                margin: '8px auto 0',
                background: 'none',
                border: 'none',
                color: colors.textLight,
                cursor: 'pointer',
                fontSize: '0.75rem',
                textDecoration: 'underline',
                fontFamily: fonts.body,
              }}
            >
              Change API key
            </button>
          )}
        </div>

        {/* Generated image — big display */}
        {images.length > 0 && (
          <motion.div
            key={images[0].url}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            style={{
              ...kawaiiCard(colors.lavender),
              padding: '16px',
              border: `2.5px solid ${colors.lavender}30`,
              textAlign: 'center',
            }}
          >
            <img
              src={images[0].url}
              alt={images[0].prompt}
              style={{
                width: '100%',
                maxWidth: '500px',
                aspectRatio: '1',
                objectFit: 'contain',
                borderRadius: radius.md,
              }}
            />
            <p style={{
              margin: '10px 0 0',
              fontSize: 'clamp(0.85rem, 3vw, 1rem)',
              color: colors.textMedium,
              fontFamily: fonts.body,
              lineHeight: 1.4,
            }}>
              {images[0].prompt}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
