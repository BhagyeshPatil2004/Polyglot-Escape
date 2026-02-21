// Lightweight SFX helper for UI/game interactions.
// Uses short one-shot audio elements (separate from the looping bg music).

const SFX_SOURCES: Record<"click" | "chime", string> = {
  click: "/assets/click.mp3",
  chime: "/assets/chime.mp3",
};

const cache: Partial<Record<keyof typeof SFX_SOURCES, HTMLAudioElement>> = {};

export function playSfx(type: keyof typeof SFX_SOURCES) {
  if (typeof window === "undefined") return;

  const src = SFX_SOURCES[type];
  if (!src) return;

  let audio = cache[type];
  if (!audio) {
    audio = new Audio(src);
    audio.volume = type === "click" ? 0.45 : 0.7;
    cache[type] = audio;
  }

  try {
    if (audio) {
      audio.currentTime = 0;
      void audio.play();
    }
  } catch {
    // Ignore autoplay / user-gesture errors – SFX are purely cosmetic.
  }
}

