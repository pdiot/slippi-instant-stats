import {
  FrameEntryType,
  FramesType,
  GameEndType,
  GameStartType,
  MetadataType,
  SlippiGame,
  StatsType,
} from "@slippi/slippi-js";

export interface GameDetails {
  filePath: string;
  settings: GameStartType;
  frames: FramesType;
  stats: StatsType;
  metadata: MetadataType;
  latestFrame: FrameEntryType | null;
  gameEnd: GameEndType | null;
}

export async function readFileAsSlippiGame(file: File): Promise<SlippiGame> {
  const data = (await readFileAsArrayBuffer(file)) as ArrayBuffer;
  const arr = new Int8Array(data);
  const buf = Buffer.from(arr);
  return new SlippiGame(buf);
}

export function generateGameDetails(name: string, game: SlippiGame): GameDetails {
  // For a valid SLP game, at the very least we should have valid settings
  const settings = game.getSettings();
  if (!settings) {
    throw new Error(`Invalid SLP file. Could not find game settings in file: ${name}`);
  }

  return {
    filePath: name,
    settings,
    frames: game.getFrames(),
    stats: game.getStats(),
    metadata: game.getMetadata(),
    latestFrame: game.getLatestFrame(),
    gameEnd: game.getGameEnd(),
  };
}

async function readFileAsArrayBuffer(file: File): Promise<string | ArrayBufferLike> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onabort = () => reject("file reading was aborted");
    fr.onerror = () => reject("file reading has failed");
    if (fr.readAsBinaryString) {
      fr.addEventListener(
        "load",
        function () {
          const string = (this as any).resultString != null ? (this as any).resultString : this.result;
          const result = new Uint8Array(string.length);
          for (let i = 0; i < string.length; i++) {
            result[i] = string.charCodeAt(i);
          }
          resolve(result.buffer);
        },
        false
      );
      fr.readAsBinaryString(file);
    } else {
      fr.addEventListener(
        "load",
        function () {
          if (this.result) {
            resolve(this.result);
          } else {
            reject("no data read");
          }
        },
        false
      );
      fr.readAsArrayBuffer(file);
    }
  });
}
