import { useState, useCallback } from 'react';

// fal.ai integration for generating kawaii images
const FAL_API_URL = 'https://fal.run/fal-ai/flux/schnell';
const FAL_API_KEY = 'a809ad1a-229b-40bf-a93d-890ab66d57eb:abed9695a2a80db885282bef1bc3186a';

interface GeneratedImage {
  url: string;
  letter: string;
  animalName: string;
}

// Cache generated images in localStorage
function getCachedImage(letter: string): string | null {
  try {
    const cache = JSON.parse(localStorage.getItem('panda-keys-art-cache') || '{}');
    return cache[letter] || null;
  } catch {
    return null;
  }
}

function setCachedImage(letter: string, url: string) {
  try {
    const cache = JSON.parse(localStorage.getItem('panda-keys-art-cache') || '{}');
    cache[letter] = url;
    localStorage.setItem('panda-keys-art-cache', JSON.stringify(cache));
  } catch { /* ignore */ }
}

export function useFalAI() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateKawaiiAnimal = useCallback(async (
    animalName: string,
    letter: string,
    action?: string,
  ): Promise<GeneratedImage | null> => {
    const cacheKey = `${letter}-${action || 'default'}`;
    const cached = getCachedImage(cacheKey);
    if (cached) {
      return { url: cached, letter, animalName };
    }

    setGenerating(true);
    setError(null);

    const actionDesc = action ? `, ${action}` : '';
    const prompt = `ultra cute kawaii ${animalName}${actionDesc}, pastel color palette, soft rounded shapes, chibi style, big glossy eyes, tiny mouth, blush cheeks, minimal clean design, smooth vector illustration, soft shading, centered character, white or light pastel background, sanrio style, duolingo mascot style, high quality, simple, no text`;

    try {
      const response = await fetch(FAL_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          image_size: 'square',
          num_images: 1,
          num_inference_steps: 4,
          enable_safety_checker: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`fal.ai error: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.images?.[0]?.url;

      if (!imageUrl) {
        throw new Error('No image returned');
      }

      setCachedImage(cacheKey, imageUrl);
      setGenerating(false);
      return { url: imageUrl, letter, animalName };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setGenerating(false);
      return null;
    }
  }, []);

  const generateAllAnimals = useCallback(async (
    animals: Array<{ name: string; letter: string }>,
    onProgress?: (completed: number, total: number) => void,
  ) => {
    const results: GeneratedImage[] = [];
    const total = animals.length;

    for (let i = 0; i < animals.length; i++) {
      const { name, letter } = animals[i];
      const result = await generateKawaiiAnimal(name, letter);
      if (result) results.push(result);
      onProgress?.(i + 1, total);
      if (i < animals.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    return results;
  }, [generateKawaiiAnimal]);

  // Generate a kawaii version of an uploaded photo
  const kawaiiifyPhoto = useCallback(async (
    photoDataUrl: string,
    description?: string,
  ): Promise<string | null> => {
    setGenerating(true);
    setError(null);

    const prompt = `ultra cute kawaii chibi version of a ${description || 'person'}, pastel color palette, soft rounded shapes, chibi style, big glossy eyes, tiny mouth, blush cheeks, minimal clean design, smooth vector illustration, soft shading, centered character, white or light pastel background, sanrio style, duolingo mascot style, high quality, simple, no text`;

    try {
      const response = await fetch('https://fal.run/fal-ai/flux/dev/image-to-image', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          image_url: photoDataUrl,
          strength: 0.75,
          num_images: 1,
          num_inference_steps: 20,
          enable_safety_checker: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`fal.ai error: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.images?.[0]?.url;
      setGenerating(false);
      return imageUrl || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setGenerating(false);
      return null;
    }
  }, []);

  // Generate any freeform kawaii image from a text description
  const generateFreeform = useCallback(async (
    description: string,
  ): Promise<string | null> => {
    setGenerating(true);
    setError(null);

    const prompt = `ultra cute kawaii ${description}, pastel color palette, soft rounded shapes, chibi style, big glossy eyes, tiny mouth, blush cheeks, minimal clean design, smooth vector illustration, soft shading, white or light pastel background, sanrio style, duolingo mascot style, high quality, simple, no text`;

    try {
      const response = await fetch(FAL_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          image_size: 'square',
          num_images: 1,
          num_inference_steps: 4,
          enable_safety_checker: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`fal.ai error: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.images?.[0]?.url;
      setGenerating(false);

      if (!imageUrl) {
        throw new Error('No image returned');
      }

      return imageUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setGenerating(false);
      return null;
    }
  }, []);

  return {
    generateKawaiiAnimal,
    generateAllAnimals,
    kawaiiifyPhoto,
    generateFreeform,
    generating,
    error,
  };
}
