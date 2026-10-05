// export const SoundPlayer = (soundPath: string) => {
//   const soundUrl = new URL(
//     `/src/assets/sounds/${soundPath}.mp3`,
//     import.meta.url,
//   ).href;

//   const audio = new Audio(soundUrl);
//   audio.volume = 0.1;
//   audio.play().catch((err) => console.log(err));
// };

const audioCache: Record<string, HTMLAudioElement> = {};

export function SoundPlayer(soundPath: string) {
  const fullPath = `/src/assets/sounds/${soundPath}.mp3`;

  if (!audioCache[fullPath]) {
    audioCache[fullPath] = new Audio(fullPath);
  }

  const audio = audioCache[fullPath];

  audio.pause();
  audio.currentTime = 0;
  
  // audio.volume = 0.2;
  audio.volume = 1;

  audio.play().catch((err) => {
    console.error("Ошибка воспроизведения аудио:", err);
  });
}