// Word lists organized by difficulty level
const easyWords = [
  'cat', 'dog', 'sun', 'moon', 'star', 'tree', 'house', 'car', 'ball', 'fish',
  'bird', 'flower', 'apple', 'heart', 'smile', 'eye', 'hand', 'foot', 'hat', 'cup',
  'book', 'key', 'door', 'window', 'chair', 'table', 'bed', 'clock', 'phone', 'pen',
  'box', 'bag', 'shoe', 'sock', 'shirt', 'pants', 'coat', 'ring', 'watch', 'glass',
  'plate', 'fork', 'knife', 'spoon', 'bowl', 'mug', 'bottle', 'can', 'jar', 'pot'
];

const mediumWords = [
  'elephant', 'butterfly', 'mountain', 'rainbow', 'castle', 'dragon', 'princess', 'robot', 'rocket', 'planet',
  'guitar', 'piano', 'violin', 'trumpet', 'drums', 'microphone', 'camera', 'computer', 'television', 'radio',
  'bicycle', 'motorcycle', 'airplane', 'helicopter', 'submarine', 'sailboat', 'train', 'truck', 'ambulance', 'firetruck',
  'sandwich', 'hamburger', 'pizza', 'icecream', 'birthday', 'christmas', 'halloween', 'vacation', 'playground', 'swimming',
  'dancing', 'singing', 'reading', 'writing', 'painting', 'cooking', 'gardening', 'shopping', 'traveling', 'camping'
];

const hardWords = [
  'architecture', 'constellation', 'metamorphosis', 'photosynthesis', 'kaleidoscope', 'thunderstorm', 'waterfall', 'lighthouse', 'windmill', 'skyscraper',
  'microscope', 'telescope', 'stethoscope', 'thermometer', 'barometer', 'calculator', 'typewriter', 'refrigerator', 'dishwasher', 'lawnmower',
  'rollercoaster', 'ferriswheel', 'carousel', 'trampoline', 'skateboard', 'snowboard', 'surfboard', 'basketball', 'volleyball', 'badminton',
  'democracy', 'philosophy', 'psychology', 'archaeology', 'astronomy', 'geography', 'biography', 'photography', 'choreography', 'calligraphy',
  'entrepreneur', 'veterinarian', 'electrician', 'mathematician', 'scientist', 'engineer', 'architect', 'journalist', 'librarian', 'firefighter'
];

const expertWords = [
  'procrastination', 'serendipity', 'onomatopoeia', 'juxtaposition', 'metamorphosis', 'chrysanthemum', 'hippopotamus', 'rhinoceros', 'brontosaurus', 'tyrannosaurus',
  'pharmaceutical', 'electromagnetic', 'photosynthesis', 'thermodynamics', 'aerodynamics', 'hydrodynamics', 'electromagnetism', 'superconductor', 'semiconductor', 'nanotechnology',
  'biodegradable', 'sustainability', 'environmentalism', 'conservation', 'deforestation', 'globalization', 'industrialization', 'urbanization', 'modernization', 'civilization',
  'constitutional', 'international', 'multinational', 'intercontinental', 'transcendental', 'philosophical', 'psychological', 'archaeological', 'astronomical', 'geographical',
  'extraordinary', 'revolutionary', 'evolutionary', 'involuntary', 'contemporary', 'complementary', 'supplementary', 'documentary', 'commentary', 'elementary'
];

const masterWords = [
  'antidisestablishmentarianism', 'pneumonoultramicroscopicsilicovolcanoconiosiss', 'floccinaucinihilipilification', 'pseudopseudohypoparathyroidism', 'supercalifragilisticexpialidocious',
  'incomprehensibilities', 'uncharacteristically', 'electroencephalograph', 'spectrophotometrically', 'immunoelectrophoresis',
  'psychopharmacological', 'neuropsychopharmacology', 'electrocardiographic', 'echoencephalographic', 'pneumoencephalographic',
  'tetraiodophenolphthalein', 'radioimmunoelectrophoresis', 'psychoneuroendocrinology', 'hepaticocholangiogastrostomy', 'pneumonoultramicroscopicsilicovolcanoconiosis'
];

// Combine all word lists
const allWords = [...easyWords, ...mediumWords, ...hardWords, ...expertWords, ...masterWords];

// Get word based on level with progressive difficulty
export const getWordForLevel = (level: number): string => {
  let wordPool: string[];
  
  if (level <= 10) {
    wordPool = easyWords;
  } else if (level <= 25) {
    wordPool = [...easyWords, ...mediumWords];
  } else if (level <= 50) {
    wordPool = [...mediumWords, ...hardWords];
  } else if (level <= 75) {
    wordPool = [...hardWords, ...expertWords];
  } else {
    wordPool = [...expertWords, ...masterWords];
  }
  
  // Add some randomness but ensure progression
  const randomIndex = Math.floor(Math.random() * wordPool.length);
  return wordPool[randomIndex];
};

// Get difficulty label for level
export const getDifficultyForLevel = (level: number): string => {
  if (level <= 10) return 'Beginner';
  if (level <= 25) return 'Easy';
  if (level <= 50) return 'Medium';
  if (level <= 75) return 'Hard';
  return 'Master';
};

// Get all words for reference
export const getAllWords = (): string[] => {
  return [...allWords];
};

// Add custom word functionality
let customWords: string[] = [];

export const addCustomWord = (word: string): void => {
  if (!customWords.includes(word.toLowerCase())) {
    customWords.push(word.toLowerCase());
  }
};

export const removeCustomWord = (word: string): void => {
  customWords = customWords.filter(w => w !== word.toLowerCase());
};

export const getCustomWords = (): string[] => {
  return [...customWords];
};