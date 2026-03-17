export interface SpellingWord {
  word: string;
  imagePrompt: string; // used to generate kawaii image
  hint: string; // hint shown to the kid
  difficulty: 1 | 2 | 3;
}

// Difficulty 1: 3-letter words (ages 5-6)
// Difficulty 2: 4-letter words (ages 6-7)
// Difficulty 3: 5+ letter words (ages 7-10)

export const spellingWords: SpellingWord[] = [
  // === Difficulty 1: 3-letter words ===
  { word: 'cat', imagePrompt: 'a cute cat sitting', hint: 'A furry pet that says meow', difficulty: 1 },
  { word: 'dog', imagePrompt: 'a happy puppy', hint: 'A furry pet that says woof', difficulty: 1 },
  { word: 'sun', imagePrompt: 'a bright smiling sun', hint: 'It shines in the sky', difficulty: 1 },
  { word: 'hat', imagePrompt: 'a cute hat with a bow', hint: 'You wear it on your head', difficulty: 1 },
  { word: 'cup', imagePrompt: 'a cute teacup', hint: 'You drink from it', difficulty: 1 },
  { word: 'bed', imagePrompt: 'a cozy bed with pillows', hint: 'You sleep in it', difficulty: 1 },
  { word: 'pig', imagePrompt: 'a cute pink pig', hint: 'A pink farm animal', difficulty: 1 },
  { word: 'bug', imagePrompt: 'a cute ladybug', hint: 'A tiny crawling creature', difficulty: 1 },
  { word: 'fox', imagePrompt: 'a cute orange fox', hint: 'An orange animal with a fluffy tail', difficulty: 1 },
  { word: 'owl', imagePrompt: 'a cute owl with big eyes', hint: 'A bird that says hoo hoo', difficulty: 1 },
  { word: 'bee', imagePrompt: 'a cute bumble bee', hint: 'It makes honey and buzzes', difficulty: 1 },
  { word: 'car', imagePrompt: 'a cute little car', hint: 'You ride in it on the road', difficulty: 1 },
  { word: 'egg', imagePrompt: 'a cute egg with a face', hint: 'Chickens lay these', difficulty: 1 },
  { word: 'ice', imagePrompt: 'a cute ice cube', hint: 'Frozen water', difficulty: 1 },
  { word: 'ant', imagePrompt: 'a cute little ant', hint: 'A tiny bug that works hard', difficulty: 1 },

  // === Difficulty 2: 4-letter words ===
  { word: 'star', imagePrompt: 'a cute sparkling star', hint: 'It twinkles in the night sky', difficulty: 2 },
  { word: 'fish', imagePrompt: 'a cute fish swimming', hint: 'It swims in water', difficulty: 2 },
  { word: 'bird', imagePrompt: 'a cute little bird', hint: 'It flies in the sky', difficulty: 2 },
  { word: 'cake', imagePrompt: 'a cute birthday cake', hint: 'You eat it on your birthday', difficulty: 2 },
  { word: 'frog', imagePrompt: 'a cute green frog', hint: 'A green animal that hops', difficulty: 2 },
  { word: 'bear', imagePrompt: 'a cute teddy bear', hint: 'A big fluffy animal', difficulty: 2 },
  { word: 'tree', imagePrompt: 'a cute tree with a face', hint: 'It grows in the ground with leaves', difficulty: 2 },
  { word: 'moon', imagePrompt: 'a cute crescent moon', hint: 'It lights up the night', difficulty: 2 },
  { word: 'duck', imagePrompt: 'a cute yellow duck', hint: 'It says quack quack', difficulty: 2 },
  { word: 'rain', imagePrompt: 'cute rain drops falling', hint: 'Water falling from clouds', difficulty: 2 },
  { word: 'book', imagePrompt: 'a cute open book', hint: 'You read stories in it', difficulty: 2 },
  { word: 'boat', imagePrompt: 'a cute little boat', hint: 'It floats on water', difficulty: 2 },
  { word: 'ball', imagePrompt: 'a cute colorful ball', hint: 'You throw and catch it', difficulty: 2 },
  { word: 'lion', imagePrompt: 'a cute baby lion', hint: 'The king of the jungle', difficulty: 2 },
  { word: 'snow', imagePrompt: 'cute snowflakes falling', hint: 'Cold white flakes from the sky', difficulty: 2 },

  // === Difficulty 3: 5+ letter words ===
  { word: 'chair', imagePrompt: 'a cute chair with a cushion', hint: 'You sit on it', difficulty: 3 },
  { word: 'house', imagePrompt: 'a cute little house', hint: 'You live in it', difficulty: 3 },
  { word: 'apple', imagePrompt: 'a cute red apple', hint: 'A red fruit that keeps the doctor away', difficulty: 3 },
  { word: 'puppy', imagePrompt: 'an adorable puppy', hint: 'A baby dog', difficulty: 3 },
  { word: 'bunny', imagePrompt: 'a cute fluffy bunny', hint: 'A fluffy animal with long ears', difficulty: 3 },
  { word: 'happy', imagePrompt: 'a happy smiling face', hint: 'How you feel when something good happens', difficulty: 3 },
  { word: 'cloud', imagePrompt: 'a cute fluffy cloud', hint: 'White and fluffy in the sky', difficulty: 3 },
  { word: 'heart', imagePrompt: 'a cute pink heart', hint: 'A shape that means love', difficulty: 3 },
  { word: 'piano', imagePrompt: 'a cute little piano', hint: 'A musical instrument with keys', difficulty: 3 },
  { word: 'candy', imagePrompt: 'cute colorful candy', hint: 'A sweet treat', difficulty: 3 },
  { word: 'tiger', imagePrompt: 'a cute baby tiger', hint: 'A big cat with stripes', difficulty: 3 },
  { word: 'plant', imagePrompt: 'a cute potted plant', hint: 'It grows in soil and needs water', difficulty: 3 },
  { word: 'robot', imagePrompt: 'a cute little robot', hint: 'A machine that can move and talk', difficulty: 3 },
  { word: 'panda', imagePrompt: 'a cute baby panda', hint: 'A black and white bear', difficulty: 3 },
  { word: 'ocean', imagePrompt: 'a cute ocean wave', hint: 'A huge body of salty water', difficulty: 3 },
];

export function getWordsByDifficulty(difficulty: 1 | 2 | 3): SpellingWord[] {
  return spellingWords.filter(w => w.difficulty === difficulty);
}

export function getRandomWord(difficulty: 1 | 2 | 3): SpellingWord {
  const words = getWordsByDifficulty(difficulty);
  return words[Math.floor(Math.random() * words.length)];
}
