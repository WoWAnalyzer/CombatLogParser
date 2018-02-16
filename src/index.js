import path from 'path';

import { difficultyLabel } from 'common/DIFFICULTIES';

import CombatLog from './CombatLog';

const filePath = path.resolve('WoWCombatLog.txt'); // TODO: Feed `filePath` through a file function argument

async function main(path) {
  const combatLog = new CombatLog(path);
  await combatLog.getFights(fight => {
    console.log(`#${fight.startLineNo}-#${fight.endLineNo}`, `${fight.startTime}-${fight.endTime}`, fight.bossId, difficultyLabel(fight.difficulty), fight.bossName, fight.kill ? 'KILL' : 'WIPE');
  });
  process.exit(0);
}
main(filePath);

// When all that is done fight scanning is finished.
// TODO: Parse timestamps
// Stage 1.2: parsing a single fight.
