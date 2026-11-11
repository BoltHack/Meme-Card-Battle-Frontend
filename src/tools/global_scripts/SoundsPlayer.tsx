import { useEffect, useRef } from "react";

// const audioCache: Record<string, HTMLAudioElement> = {};

const getAudioPath_Play = (name: string) => {
  return new URL(`/src/assets/sounds/play/${name}.mp3`, import.meta.url).href;
};
const getAudioPath_Game = (name: string) => {
  return new URL(`/src/assets/sounds/game/${name}.mp3`, import.meta.url).href;
};

const SOUNDS_MAP_PLAY = {
  element_move: getAudioPath_Play("element_move"),

  toggle_screen: getAudioPath_Play("toggle_screen"),

  battle_invite: getAudioPath_Play("battle_invite"),

  value_change: getAudioPath_Play("value_change"),

  volume_change: getAudioPath_Play("volume_change"),

  btn_click: getAudioPath_Play("btn_click"),
  btn_click_v2: getAudioPath_Play("btn_click_v2"),
  btn_click_v3: getAudioPath_Play("btn_click_v3"),
  btn_click_v4: getAudioPath_Play("btn_click_v4"),

  menu_open: getAudioPath_Play("menu_open"),
  menu_close_v2: getAudioPath_Play("menu_close_v2"),

  game_searching_menu_open: getAudioPath_Play("game_searching_menu_open"),
  game_searching_menu_close: getAudioPath_Play("game_searching_menu_close"),

  success_notification: getAudioPath_Play("success_notification"),
  // error_notification: getAudioPath_Play("error_notification"),

  successful_purchase: getAudioPath_Play("successful_purchase"),

  open_case: getAudioPath_Play("open_case"),
  open_case_result: getAudioPath_Play("open_case_result"),
};

const SOUNDS_MAP_GAME = {
  card_remove: getAudioPath_Game("card_remove"),
  card_select: getAudioPath_Game("card_select"),

  card_select_v2: getAudioPath_Game("card_select_v2"),
  card_select_v3: getAudioPath_Game("card_select_v3"),
  card_select_v4: getAudioPath_Game("card_select_v4"),
  card_selection: getAudioPath_Game("card_selection"),

  error_notification: getAudioPath_Game("error_notification"),

  game_background_music: getAudioPath_Game("game_background_music"),
  game_background_music_v2: getAudioPath_Game("game_background_music_v2"),

  game_start: getAudioPath_Game("game_start"),
  ready_btn_click: getAudioPath_Game("ready_btn_click"),

  versus_zoom: getAudioPath_Game("versus_zoom"),
};

type SoundName_Play = keyof typeof SOUNDS_MAP_PLAY;
type SoundName_Game = keyof typeof SOUNDS_MAP_GAME;

export const SoundFunctions = {
  PlaySound_Play: (path: SoundName_Play) => {
    console.log("Плеер не готов:", path);
  },
  PlaySound_Game: (path: SoundName_Game) => {
    console.log("Плеер не готов:", path);
  },
  fixedVolumeSound: (type: string, path: string, volume: number) => {
    console.log("Плеер не готов:", type, path, volume);
  },
  BackgroundMusic_Start_Game: (path: SoundName_Game) => {
    console.log("Плеер не готов:", path);
  },
  BackgroundMusic_Stop_Game: (path: SoundName_Game) => {
    console.log("Плеер не готов:", path);
  },
};

export const SoundsPlayer = () => {
  const audioPoolRef = useRef<Record<string, HTMLAudioElement>>({});
  const volume_ref = useRef({
    interface_volume: 1,
    game_background_music_volume: 1,
  });

  useEffect(() => {
    Object.entries(SOUNDS_MAP_PLAY).forEach(([name, path]) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      audioPoolRef.current[name] = audio;
    });

    Object.entries(SOUNDS_MAP_GAME).forEach(([name, path]) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      audioPoolRef.current[name] = audio;
    });

    return () => {
      audioPoolRef.current = {};
    };
  }, []);

  useEffect(() => {
    const updateVolume = () => {
      const settings = JSON.parse(localStorage.getItem("settings") || "{}");
      const sounds = settings?.sounds || {};

      try {
        volume_ref.current = {
          interface_volume: sounds.interface_volume ?? 1,
          game_background_music_volume:
            sounds.game_background_music_volume ?? 1,
        };
      } catch {
        volume_ref.current = {
          interface_volume: 1,
          game_background_music_volume: 1,
        };
      }
    };

    updateVolume();

    window.addEventListener("local-storage-volume-update", updateVolume);
    window.addEventListener("storage", updateVolume);

    return () => {
      window.removeEventListener("local-storage-volume-update", updateVolume);
      window.removeEventListener("storage", updateVolume);
    };
  }, []);

  useEffect(() => {
    SoundFunctions.BackgroundMusic_Start_Game = (path: SoundName_Game) => {
      const audio = audioPoolRef.current[path];

      if (!audio) {
        console.warn(`Звук ${path} еще не предзагружен.`);
        return;
      }

      audio.loop = true;
      audio.pause();
      audio.currentTime = 0;
      const finalVolume = Math.max(
        0,
        Math.min(1, 0.4 * volume_ref.current.game_background_music_volume),
      );
      audio.volume = finalVolume;

      audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Ошибка звука:", err);
        }
      });
    };

    return () => {
      SoundFunctions.BackgroundMusic_Start_Game = () => {};
    };
  }, []);

  useEffect(() => {
    SoundFunctions.BackgroundMusic_Stop_Game = (path: SoundName_Game) => {
      const audio = audioPoolRef.current[path];

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Ошибка звука:", err);
        }
      });
    };

    return () => {
      SoundFunctions.BackgroundMusic_Stop_Game = () => {};
    };
  }, []);

  useEffect(() => {
    SoundFunctions.PlaySound_Play = (path: SoundName_Play) => {
      const audio = audioPoolRef.current[path];

      if (!audio) {
        console.warn(`Звук ${path} еще не предзагружен.`);
        return;
      }

      audio.pause();
      audio.currentTime = 0;
      audio.volume = volume_ref.current.interface_volume;

      audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Ошибка звука:", err);
        }
      });
    };

    return () => {
      SoundFunctions.PlaySound_Play = () => {};
    };
  }, []);

  useEffect(() => {
    SoundFunctions.PlaySound_Game = (path: SoundName_Game) => {
      const audio = audioPoolRef.current[path];

      if (!audio) {
        console.warn(`Звук ${path} еще не предзагружен.`);
        return;
      }

      audio.pause();
      audio.currentTime = 0;
      audio.volume = volume_ref.current.interface_volume;

      audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Ошибка звука:", err);
        }
      });
    };

    return () => {
      SoundFunctions.PlaySound_Game = () => {};
    };
  }, []);

  useEffect(() => {
    SoundFunctions.fixedVolumeSound = (
      type: string,
      path: string,
      volume: number,
    ) => {
      const audio = audioPoolRef.current[path];

      if (!audio) {
        console.warn(`Звук ${path} типа ${type} не найден в предзагруженном.`);
        return;
      }

      audio.pause();
      audio.currentTime = 0;

      const finalVolume = Math.max(
        0,
        Math.min(1, volume * volume_ref.current.interface_volume),
      );
      audio.volume = finalVolume;

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

  // useEffect(() => {
  //   SoundFunctions.GameBackgroundMusic = () => {
  //     const audio = audioCache[BG_MUSIC_KEY];

  //     console.log("audio", audio);

  //     if (audio && audio.paused) {
  //       // const settings = JSON.parse(localStorage.getItem("settings") || "{}");
  //       // audio.volume = settings?.sounds?.game_background_music_volume ?? 1;
  //       audio.volume = 0.2;

  //       audio.play().catch((err) => {
  //         console.error("error", err);
  //       });
  //     }
  //   };

  //   return () => {
  //     SoundFunctions.GameBackgroundMusic = () => {};
  //   };
  // }, [BG_MUSIC_KEY]);

  // useEffect(() => {
  //   SoundFunctions.StopGameBackgroundMusic = () => {
  //     const audio = audioCache[BG_MUSIC_KEY];
  //     if (audio) {
  //       audio.pause();
  //       audio.currentTime = 0;
  //     }
  //   };

  //   return () => {
  //     SoundFunctions.StopGameBackgroundMusic = () => {};
  //   };
  // }, [BG_MUSIC_KEY]);

  return null;
};
