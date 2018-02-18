import path from 'path';

import { difficultyLabel } from 'common/DIFFICULTIES';

import CombatLog from './CombatLog';
import parseDateTime from './parseDateTime';

const filePath = path.resolve('WoWCombatLog.txt'); // TODO: Feed `filePath` through a file function argument

async function main(path) {
  const combatLog = new CombatLog(path);
  let firstFight = null;
  await combatLog.getFights(fight => {
    const startTime = parseDateTime(fight.startTime);
    const duration = parseDateTime(fight.endTime) - startTime;
    console.log(`#${fight.startLineNo}-#${fight.endLineNo}`, `${startTime} (${(duration / 1000).toFixed(3)}s)`, fight.bossId, difficultyLabel(fight.difficulty), fight.bossName, fight.kill ? 'KILL' : 'WIPE');
    if (firstFight === null) {
      firstFight = fight;
    }
  });
  let eventNo = 0;
  await combatLog.getEventsForFight(firstFight, event => {
    if (eventNo < 10) {
      console.log(event);
    }
    eventNo += 1;
  });
  console.log('Total events:', eventNo);
  process.exit(0);
}
main(filePath);

// When all that is done fight scanning is finished.
// TODO: Parse timestamps
// Stage 1.2: parsing a single fight.
