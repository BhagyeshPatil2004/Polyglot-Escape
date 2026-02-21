export interface Clue {
  id: string;
  text: string;
  language: string;
  languageName: string;
  translation: string;
  position: { top: string; left: string };
  hint?: string;
}

export interface Puzzle {
  id: number;
  title: string;
  description: string;
  clues: Clue[];
  answer: string;
  answerHint: string;
  solvedMessage: string;
  // What object it unlocks
  unlocksObject: string;
  // Puzzle 2 specific
  requiredItems?: string[];
  // Puzzle 3 specific
  symbolOrder?: string[];
  babaHint: string;
  babaRoomIntro: string[];
}

export const PUZZLES: Puzzle[] = [
  {
    id: 1,
    title: "The Whispering Grimoire",
    description:
      "A massive, glowing Grimoire rests on the center pedestal. The door to the next room is sealed by a magical ward tied to this book. It refuses to open its pages until you speak the correct Magic Word. Three ancient scrolls are scattered around the room, containing the translation for its power.",
    clues: [
      {
        id: "plaque-jp",
        text: "最初の文字は「L」",
        language: "ja",
        languageName: "Japanese",
        translation: "The first letter of the magic word is L",
        position: { top: "18%", left: "18%" },
        hint: "SCROLL I",
      },
      {
        id: "plaque-de",
        text: "Der zweite Buchstabe ist U",
        language: "de",
        languageName: "German",
        translation: "The second letter is U",
        position: { top: "45%", left: "65%" },
        hint: "SCROLL II",
      },
      {
        id: "plaque-es",
        text: "La tercera letra es X",
        language: "es",
        languageName: "Spanish",
        translation: "The third letter is X",
        position: { top: "70%", left: "35%" },
        hint: "SCROLL III",
      },
    ],
    answer: "LUX",
    answerHint:
      "Three scrolls, three letters. Translate each one, then speak the full word to open the Grimoire.",
    solvedMessage:
      "📖 You speak the magic word! The Grimoire pulses with light, and the magical ward on the door shatters. You can now enter Room 2!",
    unlocksObject: "door ward",
    babaHint: "The Grimoire demands a magic word! Look for three ancient scrolls hidden in the library...",
    babaRoomIntro: [
      "The door to the next room is sealed by a magical ward.",
      "The Master Scholar linked the door's seal directly to this massive Grimoire.",
      "It only lifts for those who know the secret password...",
      "Search the room. Translate his ancient notes to find the letters of the word."
    ]
  },
  {
    id: 2,
    title: "The Alchemist's Antidote",
    description:
      "Purple gas is seeping through the vents! A recipe scrawled on the wall holds the antidote formula — but it's written in Russian. The bottles are labelled in foreign tongues too. Use the magnifying glass to translate everything and mix the correct two ingredients FAST!",
    clues: [
      {
        id: "recipe-ru",
        text: "Смешайте масло с огнём чтобы нейтрализовать яд",
        language: "ru",
        languageName: "Russian",
        translation: "Mix oil with fire to neutralise the poison",
        position: { top: "22%", left: "30%" },
      },
      {
        id: "bottle-ar",
        text: "نار",
        language: "ar",
        languageName: "Arabic",
        translation: "Fire",
        position: { top: "62%", left: "58%" },
      },
      {
        id: "bottle-ru",
        text: "масло",
        language: "ru",
        languageName: "Russian",
        translation: "Oil",
        position: { top: "62%", left: "74%" },
      },
    ],
    answer: "OIL+FIRE",
    answerHint:
      "The recipe says to mix two ingredients. Translate the bottle labels to find which ones match!",
    solvedMessage:
      "🔥 The Fire-Oil blazes! The gas clears and a hidden compartment pops open — you grab a glowing ORB...",
    unlocksObject: "cabinet",
    requiredItems: ["oil", "fire"],
    babaHint: "Purple gas! Quick! The antidote recipe is on the wall... in Russian! Translate it, then find the two matching bottles and mix them.",
    babaRoomIntro: [
      "Ah, the Alchemist's Laboratory...",
      "Wait! You tripped a security wire!",
      "A toxic purple gas is filling the room!",
      "The Alchemist always kept an antidote recipe on the wall in case of emergencies.",
      "You must translate the recipe, find the correct two ingredients, and mix them before it's too late!"
    ]
  },
  {
    id: 3,
    title: "The Guardian Door",
    description:
      "Three celestial symbols glow on the ancient door — ☀️ Sun, ⭐ Star, 🌙 Moon. Stone inscriptions carved in three languages reveal the order they must be awakened: from the first light of dawn, through the watching dusk, to the sleeping midnight. Translate the inscriptions to find the sequence.",
    clues: [
      {
        id: "door-fr",
        text: "le soleil — premier",
        language: "fr",
        languageName: "French",
        translation: "the sun — first",
        position: { top: "25%", left: "15%" },
      },
      {
        id: "door-hi",
        text: "चंद्रमा — तीसरा",
        language: "hi",
        languageName: "Hindi",
        translation: "moon — third",
        position: { top: "45%", left: "75%" },
      },
      {
        id: "door-es",
        text: "estrella — segunda",
        language: "es",
        languageName: "Spanish",
        translation: "star — second",
        position: { top: "65%", left: "40%" },
      },
    ],
    answer: "SUN-STAR-MOON",
    answerHint:
      "Dawn → Dusk → Midnight. Click the symbols in that order of time.",
    solvedMessage:
      "🚪 The door groans and swings open — daylight floods in. You are FREE! The linguist's study yields its secrets to those who speak its language.",
    unlocksObject: "door",
    symbolOrder: ["sun", "star", "moon"],
    babaHint: "The final door... Three celestial symbols. But what order do you press them? Look for the three stone inscriptions hidden in the room!",
    babaRoomIntro: [
      "You've made it to the final Guardian Door.",
      "Beyond this door lies your freedom.",
      "But the Master rigged it with a celestial locking mechanism.",
      "Three symbols: the Sun, the Star, and the Moon.",
      "They must be pressed in the exact order of the cosmos as he saw it.",
      "If you fail... well, let's not think about that.",
      "Search the room for the three stone inscriptions to find the correct order!"
    ]
  },
];
