import { useEffect } from "react";

const audioCache: Record<string, HTMLAudioElement> = {};

const getAudioPath = (name: string) => {
  return new URL(`/src/assets/sounds/${name}.mp3`, import.meta.url).href;
};

export const SoundFunctions = {
  playSound: (path: string) => {
    console.log("Плеер не готов:", path);
  },
  backgroundMusic: () => {},
  stopBackgroundMusic: () => {},
};

export const SoundsPlayer = () => {
  const BG_MUSIC_KEY = getAudioPath("background_music_v2");

  useEffect(() => {
    if (!audioCache[BG_MUSIC_KEY]) {
      audioCache[BG_MUSIC_KEY] = new Audio(BG_MUSIC_KEY);
      audioCache[BG_MUSIC_KEY].loop = true;
    }

    const bgAudio = audioCache[BG_MUSIC_KEY];

    const initialSettings = JSON.parse(
      localStorage.getItem("settings") || "{}",
    );
    bgAudio.volume = initialSettings?.sounds?.background_music_volume ?? 1;

    const handleVolumeChange = () => {
      const settings = JSON.parse(localStorage.getItem("settings") || "{}");
      const currentBgVol = settings?.sounds?.background_music_volume ?? 1;

      if (bgAudio) {
        bgAudio.volume = currentBgVol;
      }
    };

    window.addEventListener("storage", handleVolumeChange);
    window.addEventListener("local-storage-update", handleVolumeChange);

    return () => {
      window.removeEventListener("storage", handleVolumeChange);
      window.removeEventListener("local-storage-update", handleVolumeChange);
    };
  }, [BG_MUSIC_KEY]);

  useEffect(() => {
    SoundFunctions.playSound = (path: string) => {
      const fullPath = getAudioPath(path);
      const settings = JSON.parse(localStorage.getItem("settings") || "{}");
      const volume = settings?.sounds?.notifications_volume ?? 1;

      if (!audioCache[fullPath]) {
        audioCache[fullPath] = new Audio(fullPath);
      }

      const audio = audioCache[fullPath];
      audio.pause();
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch((err) => console.error("Ошибка звука:", err));
    };

    return () => {
      SoundFunctions.playSound = () => {};
    };
  }, []);

  useEffect(() => {
    SoundFunctions.backgroundMusic = () => {
      const audio = audioCache[BG_MUSIC_KEY];

      if (audio && audio.paused) {
        const settings = JSON.parse(localStorage.getItem("settings") || "{}");
        audio.volume = settings?.sounds?.background_music_volume ?? 1;

        audio.play().catch((err) => {
          console.error("error", err);
        });
      }
    };

    return () => {
      SoundFunctions.backgroundMusic = () => {};
    };
  }, [BG_MUSIC_KEY]);

  useEffect(() => {
    SoundFunctions.stopBackgroundMusic = () => {
      const audio = audioCache[BG_MUSIC_KEY];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    return () => {
      SoundFunctions.stopBackgroundMusic = () => {};
    };
  }, [BG_MUSIC_KEY]);

  return null;
};
