import FightScanner from './FightScanner';
import CombatLogFileReader from './CombatLogFileReader';

import { difficultyLabel } from './common/DIFFICULTIES';

// const entities = {};
//
// function processEntity(parts, startIndex) {
//   const id = parts[startIndex + 0];
//   const name = parts[startIndex + 1];
//   const flags = parts[startIndex + 2];
//   const flags2 = parts[startIndex + 3];
//
//   entities[id] = name;
//
//   return startIndex + 4;
// }

const reader = new CombatLogFileReader('WoWCombatLog.txt');
const scanner = new FightScanner(reader);
scanner.on('fight', fight => {
  console.log(`#${fight.startLineNo}-#${fight.endLineNo}`, `${fight.startTime}-${fight.endTime}`, fight.bossId, difficultyLabel(fight.difficulty), fight.bossName, fight.kill ? 'KILL' : 'WIPE');
});
scanner.on('finish', () => {
  process.exit(0);
});
scanner.scan();
