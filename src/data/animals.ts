export interface KawaiiAnimal {
  letter: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  sound: string; // description for Web Audio synthesis
  entrance: 'bounce' | 'float' | 'pop' | 'spin' | 'wiggle' | 'slide';
}

export const animals: Record<string, KawaiiAnimal> = {
  A: { letter: 'A', name: 'Alpaca', emoji: '🦙', color: '#F8B4C8', bgColor: '#FFF0F5', sound: 'soft-bleat', entrance: 'float' },
  B: { letter: 'B', name: 'Bunny', emoji: '🐰', color: '#B4D8F8', bgColor: '#F0F8FF', sound: 'squeak', entrance: 'bounce' },
  C: { letter: 'C', name: 'Cat', emoji: '🐱', color: '#FFD4A8', bgColor: '#FFF8F0', sound: 'meow', entrance: 'pop' },
  D: { letter: 'D', name: 'Dog', emoji: '🐶', color: '#C8E6C9', bgColor: '#F0FFF0', sound: 'woof', entrance: 'bounce' },
  E: { letter: 'E', name: 'Elephant', emoji: '🐘', color: '#D1C4E9', bgColor: '#F5F0FF', sound: 'trumpet', entrance: 'slide' },
  F: { letter: 'F', name: 'Fox', emoji: '🦊', color: '#FFCCBC', bgColor: '#FFF5F0', sound: 'yip', entrance: 'spin' },
  G: { letter: 'G', name: 'Giraffe', emoji: '🦒', color: '#FFF9C4', bgColor: '#FFFFF0', sound: 'hum', entrance: 'float' },
  H: { letter: 'H', name: 'Hamster', emoji: '🐹', color: '#F8BBD0', bgColor: '#FFF0F5', sound: 'squeak', entrance: 'pop' },
  I: { letter: 'I', name: 'Iguana', emoji: '🦎', color: '#A5D6A7', bgColor: '#F0FFF0', sound: 'chirp', entrance: 'slide' },
  J: { letter: 'J', name: 'Jellyfish', emoji: '🪼', color: '#CE93D8', bgColor: '#F8F0FF', sound: 'bloop', entrance: 'float' },
  K: { letter: 'K', name: 'Koala', emoji: '🐨', color: '#B0BEC5', bgColor: '#F5F5F5', sound: 'snore', entrance: 'pop' },
  L: { letter: 'L', name: 'Lion', emoji: '🦁', color: '#FFE082', bgColor: '#FFFFF0', sound: 'roar', entrance: 'bounce' },
  M: { letter: 'M', name: 'Monkey', emoji: '🐵', color: '#BCAAA4', bgColor: '#FFF8F5', sound: 'ooh-ooh', entrance: 'spin' },
  N: { letter: 'N', name: 'Narwhal', emoji: '🐋', color: '#80DEEA', bgColor: '#F0FFFF', sound: 'splash', entrance: 'float' },
  O: { letter: 'O', name: 'Owl', emoji: '🦉', color: '#D7CCC8', bgColor: '#FAF5F0', sound: 'hoot', entrance: 'pop' },
  P: { letter: 'P', name: 'Panda', emoji: '🐼', color: '#E0E0E0', bgColor: '#FAFAFA', sound: 'munch', entrance: 'bounce' },
  Q: { letter: 'Q', name: 'Quail', emoji: '🐦', color: '#FFE0B2', bgColor: '#FFF8F0', sound: 'tweet', entrance: 'float' },
  R: { letter: 'R', name: 'Raccoon', emoji: '🦝', color: '#CFD8DC', bgColor: '#F5F8FA', sound: 'chitter', entrance: 'wiggle' },
  S: { letter: 'S', name: 'Sloth', emoji: '🦥', color: '#C8E6C9', bgColor: '#F0FFF0', sound: 'yawn', entrance: 'slide' },
  T: { letter: 'T', name: 'Tiger', emoji: '🐯', color: '#FFCC80', bgColor: '#FFF8F0', sound: 'growl', entrance: 'bounce' },
  U: { letter: 'U', name: 'Unicorn', emoji: '🦄', color: '#F3E5F5', bgColor: '#FDF0FF', sound: 'sparkle', entrance: 'spin' },
  V: { letter: 'V', name: 'Vulture', emoji: '🦅', color: '#D7CCC8', bgColor: '#FAF5F0', sound: 'caw', entrance: 'float' },
  W: { letter: 'W', name: 'Whale', emoji: '🐳', color: '#B3E5FC', bgColor: '#F0FAFF', sound: 'whale-song', entrance: 'float' },
  X: { letter: 'X', name: 'X-ray Fish', emoji: '🐟', color: '#B2EBF2', bgColor: '#F0FFFF', sound: 'bubble', entrance: 'wiggle' },
  Y: { letter: 'Y', name: 'Yak', emoji: '🐃', color: '#D7CCC8', bgColor: '#FAF5F0', sound: 'moo', entrance: 'slide' },
  Z: { letter: 'Z', name: 'Zebra', emoji: '🦓', color: '#F5F5F5', bgColor: '#FAFAFA', sound: 'neigh', entrance: 'bounce' },
};

export const getAnimalForLetter = (letter: string): KawaiiAnimal | undefined => {
  return animals[letter.toUpperCase()];
};
