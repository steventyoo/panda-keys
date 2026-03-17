import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFalAI } from '../hooks/useFalAI';
import { useGame } from '../context/GameContext';
import { colors, fonts, radius, kawaiiButton, kawaiiCard, gradients } from '../styles/theme';

interface CreatedImage {
  url: string;
  prompt: string;
}

export default function ArtGenerator() {
  const { dispatch } = useGame();
  const { generateFreeform, generating, error } = useFalAI();
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<CreatedImage | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;
    const url = await generateFreeform(prompt.trim());
    if (url) {
      setImage({ url, prompt: prompt.trim() });
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
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
            disabled={generating || !prompt.trim()}
            style={{
              marginTop: '12px',
              width: '100%',
              ...kawaiiButton(
                colors.pink,
                generating || !prompt.trim() ? `${colors.lavender}40` : gradients.primary,
              ),
              padding: '14px',
              fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
              cursor: generating || !prompt.trim() ? 'default' : 'pointer',
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
        </div>

        {/* Generated image — big display */}
        {image && (
          <motion.div
            key={image.url}
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
              src={image.url}
              alt={image.prompt}
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
              {image.prompt}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
