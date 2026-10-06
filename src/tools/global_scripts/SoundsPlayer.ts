const audioCache: Record<string, HTMLAudioElement> = {};

class SoundsPlayer {
  static playSound(soundPath: string) {
    const settings = JSON.parse(localStorage.getItem("settings") || "{}");

    const fullPath = `/src/assets/sounds/${soundPath}.mp3`;

    if (!audioCache[fullPath]) {
      audioCache[fullPath] = new Audio(fullPath);
    }

    const audio = audioCache[fullPath];

    audio.pause();
    audio.currentTime = 0;

    console.log(
      "settings?.sounds?.notifications_volume",
      settings?.sounds?.notifications_volume,
    );
    audio.volume = settings?.sounds?.notifications_volume ?? 1;

    audio.play().catch((err) => {
      console.error("Ошибка воспроизведения аудио:", err);
    });
  }

  static backgroundMusic() {
    const settings = JSON.parse(localStorage.getItem("settings") || "{}");
    
    const fullPath = `/src/assets/sounds/background_music.mp3`;

    if (!audioCache[fullPath]) {
      audioCache[fullPath] = new Audio(fullPath);
    }

    const audio = audioCache[fullPath];

    audio.loop = true;
    audio.volume = settings?.sounds?.background_music_volume ?? 1;

    console.log(
      "settings?.sounds?.background_music_volume",
      settings?.sounds?.background_music_volume,
    );

    if (audio.paused) {
      audio.play().catch((err) => {
        console.error("Ошибка воспроизведения аудио:", err);
      });
    }
  }

  static stopBackgroundMusic() {
    const fullPath = `/src/assets/sounds/background_music.mp3`;
    const audio = audioCache[fullPath];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
}

export default SoundsPlayer;
