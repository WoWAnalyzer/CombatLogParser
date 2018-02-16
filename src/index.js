import path from 'path';

import { difficultyLabel } from 'common/DIFFICULTIES';

import CombatLog from './CombatLog';

const filePath = path.resolve('WoWCombatLog.txt'); // TODO: Feed `filePath` through a file function argument

const year = (new Date()).getFullYear();

function parseDateTime(dateTime) { // e.g. 2/13 21:58:49.757
  // https://jsperf.com/2-part-split-vs-indexof/1
  // https://jsperf.com/wow-datetime-parsing/1 - also string-based parsing is unreliable due to differences per locale
  const dateTimeSeparatorIndex = dateTime.indexOf(' ');
  const date = dateTime.substr(0, dateTimeSeparatorIndex);
  const time = dateTime.substr(dateTimeSeparatorIndex + 1);

  const dateSeparatorIndex = date.indexOf('/');
  const month = date.substr(0, dateSeparatorIndex);
  const day = date.substr(dateSeparatorIndex + 1);

  const minuteSeparatorIndex = time.indexOf(':');
  const hour = time.substr(0, minuteSeparatorIndex);
  const minutesAndSeconds = time.substr(minuteSeparatorIndex + 1);
  const secondSeparatorIndex = minutesAndSeconds.indexOf(':');
  const minute = minutesAndSeconds.substr(0, secondSeparatorIndex);
  const secondsAndMilliseconds = minutesAndSeconds.substr(secondSeparatorIndex + 1);
  const millisecondSeparatorIndex = secondsAndMilliseconds.indexOf('.');
  const second = secondsAndMilliseconds.substr(0, millisecondSeparatorIndex);
  const millisecond = secondsAndMilliseconds.substr(millisecondSeparatorIndex + 1);

  // noinspection JSCheckFunctionSignatures
  return new Date(year, month - 1, day, hour, minute, second, millisecond);
}

async function main(path) {
  const combatLog = new CombatLog(path);
  await combatLog.getFights(fight => {
    const startTime = parseDateTime(fight.startTime);
    const duration = parseDateTime(fight.endTime) - startTime;
    console.log(`#${fight.startLineNo}-#${fight.endLineNo}`, `${startTime} (${(duration / 1000).toFixed(3)}s)`, fight.bossId, difficultyLabel(fight.difficulty), fight.bossName, fight.kill ? 'KILL' : 'WIPE');
  });
  process.exit(0);
}
main(filePath);

// When all that is done fight scanning is finished.
// TODO: Parse timestamps
// Stage 1.2: parsing a single fight.
