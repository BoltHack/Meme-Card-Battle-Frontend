import { useEffect } from "react";

const audioCache: Record<string, HTMLAudioElement> = {};

const getAudioPath = (name: string) => {
  return new URL(`/src/assets/sounds/play/${name}.mp3`, import.meta.url).href;
};
const getGameAudioPath = (name: string) => {
  return new URL(`/src/assets/sounds/game/${name}.mp3`, import.meta.url).href;
};

export const SoundFunctions = {
  playSound: (path: string) => {
    console.log("Плеер не готов:", path);
  },
  playGameSound: (path: string) => {
    console.log("Плеер не готов:", path);
  },
  fixedVolumeSound: (type: string, path: string, volume: number) => {
    console.log("Плеер не готов:", type, path, volume);
  },
  GameBackgroundMusic: () => {},
  StopGameBackgroundMusic: () => {},
};

export const SoundsPlayer = () => {
  const BG_MUSIC_KEY = getGameAudioPath("game_background_music");

  // useEffect(() => {
  //   if (!audioCache[BG_MUSIC_KEY]) {
  //     audioCache[BG_MUSIC_KEY] = new Audio(BG_MUSIC_KEY);
  //     audioCache[BG_MUSIC_KEY].loop = true;
  //   }

  //   const bgAudio = audioCache[BG_MUSIC_KEY];

  //   const initialSettings = JSON.parse(
  //     localStorage.getItem("settings") || "{}",
  //   );
  //   bgAudio.volume = initialSettings?.sounds?.game_background_music_volume ?? 1;

  //   const handleVolumeChange = () => {
  //     const settings = JSON.parse(localStorage.getItem("settings") || "{}");
  //     const currentBgVol = settings?.sounds?.game_background_music_volume ?? 1;

  //     if (bgAudio) {
  //       bgAudio.volume = currentBgVol;
  //     }
  //   };

  //   window.addEventListener("storage", handleVolumeChange);
  //   window.addEventListener("local-storage-update", handleVolumeChange);

  //   return () => {
  //     window.removeEventListener("storage", handleVolumeChange);
  //     window.removeEventListener("local-storage-update", handleVolumeChange);
  //   };
  // }, [BG_MUSIC_KEY]);

  useEffect(() => {
    SoundFunctions.playSound = (path: string) => {
      const fullPath = getAudioPath(path);

      const settings = JSON.parse(localStorage.getItem("settings") || "{}");
      const volume = settings?.sounds?.notifications_volume ?? 1;

      if (!audioCache[fullPath]) {
        audioCache[fullPath] = new Audio(fullPath);
      }

      const audio = audioCache[fullPath];
      // const audio = new Audio(fullPath);
      audio.pause();
      audio.currentTime = 0;
      audio.volume = volume;

      audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Ошибка звука:", err);
        }
      });
    };

    return () => {
      SoundFunctions.playSound = () => {};
    };
  }, []);

  useEffect(() => {
    SoundFunctions.playGameSound = (path: string) => {
      const fullPath = getGameAudioPath(path);

      const settings = JSON.parse(localStorage.getItem("settings") || "{}");
      const volume = settings?.sounds?.notifications_volume ?? 1;

      if (!audioCache[fullPath]) {
        audioCache[fullPath] = new Audio(fullPath);
      }

      const audio = audioCache[fullPath];
      // const audio = new Audio(fullPath);
      audio.pause();
      audio.currentTime = 0;
      audio.volume = volume;

      audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Ошибка звука:", err);
        }
      });
    };

    return () => {
      SoundFunctions.playGameSound = () => {};
    };
  }, []);

  useEffect(() => {
    SoundFunctions.fixedVolumeSound = (
      type: string,
      path: string,
      volume: number,
    ) => {
      let fullPath;

      if (type === "play") {
        fullPath = getAudioPath(path);
      } else if (type === "game") {
        fullPath = getGameAudioPath(path);
      } else {
        return;
      }

      if (!audioCache[fullPath]) {
        audioCache[fullPath] = new Audio(fullPath);
      }

      const audio = audioCache[fullPath];
      // const audio = new Audio(fullPath);
      audio.pause();
      audio.currentTime = 0;
      audio.volume = volume;

      audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Ошибка звука:", err);
        }
      });
    };

    return () => {
      SoundFunctions.fixedVolumeSound = () => {};
    };
  }, []);

  useEffect(() => {
    SoundFunctions.GameBackgroundMusic = () => {
      const audio = audioCache[BG_MUSIC_KEY];

      if (audio && audio.paused) {
        // const settings = JSON.parse(localStorage.getItem("settings") || "{}");
        // audio.volume = settings?.sounds?.game_background_music_volume ?? 1;
        audio.volume = 0.4;

        audio.play().catch((err) => {
          console.error("error", err);
        });
      }
    };

    return () => {
      SoundFunctions.GameBackgroundMusic = () => {};
    };
  }, []);

  useEffect(() => {
    SoundFunctions.StopGameBackgroundMusic = () => {
      const audio = audioCache[BG_MUSIC_KEY];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    return () => {
      SoundFunctions.StopGameBackgroundMusic = () => {};
    };
  }, []);

  return null;
};
