import { characters as characterUtil, moves as moveUtil } from "@slippi/slippi-js";

/*
 * Random functions are taken from: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 */

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDemoValues(): Record<string, any> {
  const paramMap: Record<string, any> = {};

  // Set names
  paramMap.name1 = "FOLLOW";
  paramMap.name2 = "ON";
  paramMap.sub1 = "@_vinceau";
  paramMap.sub2 = "TWITTER";

  // Set colors
  const [char1, color1] = generateRandomCharacter();
  const [char2, color2] = generateRandomCharacter();
  paramMap.char1 = char1;
  paramMap.color1 = color1;
  paramMap.char2 = char2;
  paramMap.color2 = color2;

  // Track game wins
  let leftWins = 0;
  let rightWins = 0;

  // Random games
  const totalGames = getRandomInt(3, 5);
  paramMap.gt = totalGames;
  for (let i = 1; i <= totalGames; i++) {
    const gameKey = `g${i}`;
    const leftWillWin = Math.random() < 0.5;
    const leftPlayerInfo = [char1, color1, leftWillWin ? "winner" : "loser"].join(",");
    const rightPlayerInfo = [char2, color2, leftWillWin ? "loser" : "winner"].join(",");
    const gameValue = generateRandomGame([leftPlayerInfo, rightPlayerInfo]);
    paramMap[gameKey] = gameValue;

    if (leftWillWin) {
      leftWins += 1;
    } else {
      rightWins += 1;
    }
  }

  // Set score
  paramMap.score = `${leftWins} - ${rightWins}`;
  // Set winner
  if (leftWins !== rightWins) {
    paramMap.winner = leftWins > rightWins ? "left" : "right";
  }

  // Random moves
  ["mckm1", "mckm2", "mcno1", "mcno2"].forEach((key) => {
    paramMap[key] = generateRandomMove();
  });

  // Random openings per kill
  ["opk1", "opk2"].forEach((key) => {
    paramMap[key] = getRandomArbitrary(5, 15).toFixed(1);
  });

  // Total damage done
  ["tdd1", "tdd2"].forEach((key) => {
    paramMap[key] = getRandomArbitrary(1000, 2000).toFixed(1);
  });

  // Average kill percent
  ["akp1", "akp2"].forEach((key) => {
    paramMap[key] = getRandomArbitrary(50, 200).toFixed(1);
  });

  // Neutral wins
  ["nw1", "nw2"].forEach((key) => {
    paramMap[key] = getRandomInt(30, 80);
  });

  return paramMap;
}

function generateRandomMove(): string {
  const move = getRandomInt(7, 21);
  const name = moveUtil.getMoveShortName(move).toUpperCase();
  return `${name} - ${move}`;
}

function generateRandomCharacter() {
  const charId = getRandomInt(0, 25);
  const charInfo = characterUtil.getCharacterInfo(charId);
  const colorIndex = getRandomInt(0, charInfo.colors.length - 1);
  const color = charInfo.colors[colorIndex];
  return [charId, color] as const;
}

const LEGAL_STAGE_IDS = [2, 3, 8, 28, 31, 32];

function generateRandomStageId(): number {
  const stageIndex = getRandomInt(0, LEGAL_STAGE_IDS.length - 1);
  return LEGAL_STAGE_IDS[stageIndex];
}

function generateRandomDuration(): string {
  const mins = getRandomInt(0, 7);
  const secs = String(getRandomInt(0, 60)).padStart(2, "0");
  return `${mins}:${secs}`;
}

function generateRandomGame(playerInfos: string[]): string {
  const stageId = generateRandomStageId();
  const gameDuration = generateRandomDuration();
  const gameValue = [stageId, gameDuration, ...playerInfos].join(",");
  return gameValue;
}
