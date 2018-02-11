import fs from 'fs';
import readline from 'readline';

const TIME_SEPARATOR = '  ';
const ENCOUNTER_START = 'ENCOUNTER_START';

const entities = {};

function processEntity(parts, startIndex) {
  const id = parts[startIndex + 0];
  const name = parts[startIndex + 1];
  const flags = parts[startIndex + 2];
  const flags2 = parts[startIndex + 3];

  entities[id] = name;

  return startIndex + 4;
}

class CombatLogParser {
  lineNo = null;
  time = null;

  on_event(lineNo, time, event) {
    this.lineNo = lineNo;
    this.time = time;

    const eventName = event[0];

    const startIndex = 1;
    // const sourceEndIndex = processEntity(parts, startIndex);
    // const targetEndIndex = processEntity(parts, sourceEndIndex);
    //
    // const spellId = parts[9];
    // const spellName = parts[10];
    // const someFlag = parts[11];
    // const buffType = parts[12];

    // TODO: Just use reflection to call methods automatically and if one event isn't supported have a clean fallback that tries to figure it out and still sends the data
    switch (eventName) {
      case ENCOUNTER_START:
        this.on_ENCOUNTER_START(event, startIndex);
        break;
      case 'SPELL_CAST_SUCCESS':
        break;
      case 'SPELL_AURA_REFRESH':
        break;
      default: break;
    }
  }
  on_ENCOUNTER_START(parts, startIndex) {
    const bossId = parts[startIndex + 0];
    const bossName = parts[startIndex + 1];
    const difficulty = parts[startIndex + 2];
    const players = parts[startIndex + 3];

    console.log(this.lineNo, this.time, bossId, bossName, difficulty, players);
  }
}

console.time('parse');
const rl = readline.createInterface({
  input: fs.createReadStream('WoWCombatLog.txt'),
  crlfDelay: Infinity
});
let lineNr = 0;
const timeSeparatorLength = TIME_SEPARATOR.length;
const parser = new CombatLogParser();
rl.on('line', line => {
  lineNr += 1;
  const timeEndIndex = line.indexOf(TIME_SEPARATOR);
  const time = line.substr(0, timeEndIndex); // TODO: Parse this, pass this
  const eventIndex = timeEndIndex + timeSeparatorLength;
  const event = line.substr(eventIndex);
  const eventParts = event.split(',');
  parser.on_event(lineNr, time, eventParts);
});
rl.on('close', () => {
  console.timeEnd('parse');
  console.log('Read entire file.', lineNr, 'lines');
  process.exit(0);
});
