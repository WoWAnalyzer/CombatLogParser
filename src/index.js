import path from 'path';
import fs from 'fs';

import { difficultyLabel } from 'common/DIFFICULTIES';

import CombatLog from './CombatLog';

const filePath = path.resolve('WoWCombatLog.txt'); // TODO: Feed `filePath` through a file function argument
const tempFile = path.resolve('../output.txt'); // TODO: Feed `filePath` through a file function argument
const outputStream = fs.createWriteStream(tempFile, { flags: 'a' });

async function main(path) {
  const combatLog = new CombatLog(path);
  const fights = [];
  await combatLog.getFights(fight => {
    const startDateTime = fight.startDateTime;
    const duration = fight.endDateTime - startDateTime;
    console.log(`#${fight.startLineNo}-#${fight.endLineNo}`, `${startDateTime} (${(duration / 1000).toFixed(3)}s)`, fight.bossId, difficultyLabel(fight.difficulty), fight.bossName, fight.kill ? 'KILL' : 'WIPE');
    fights.push(fight);
  });

  for (const fight of fights) {
    await combatLog.getEventsForFight(fight, event => {
      outputStream.write(`${event.timestamp} ${event.type} ${event.params}\n`);
    });
  }
  outputStream.end();
  process.exit(0);
}
main(filePath);

// When all that is done fight scanning is finished.
// TODO: Parse timestamps
// Stage 1.2: parsing a single fight.
