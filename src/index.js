import { difficultyLabel } from 'common/DIFFICULTIES';

import FightScanner from './FightScanner';
import CombatLogFileReader from './CombatLogFileReader';

const reader = new CombatLogFileReader('WoWCombatLog.txt');
// TODO: Read index
// TODO: Validate index
// TODO: Determine last scanned line
// TODO: Offset scan by last scanned line
// TODO: Store newly found fights in index
// When all that is done fight scanning is finished.
// TODO: Parse timestamps
// Stage 1.2: parsing a single fight.
const scanner = new FightScanner(reader);
scanner.on('fight', fight => {
  console.log(`#${fight.startLineNo}-#${fight.endLineNo}`, `${fight.startTime}-${fight.endTime}`, fight.bossId, difficultyLabel(fight.difficulty), fight.bossName, fight.kill ? 'KILL' : 'WIPE');
});
scanner.on('finish', () => {
  process.exit(0);
});
scanner.scan();
