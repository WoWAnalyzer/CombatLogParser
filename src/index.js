import fs from 'fs';
import readline from 'readline';

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
  static TIME_SEPARATOR = '  ';

  time = null;
  lineNo = null;

  _path = null;
  constructor(path) {
    this._path = path;
  }

  start() {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: fs.createReadStream(this._path),
        crlfDelay: Infinity
      });
      // TODO: Read from index file to determine how many lines we can skip

      this.lineNo = 0;
      const timeSeparatorLength = this.constructor.TIME_SEPARATOR.length;
      this.on_start();
      rl.on('line', line => {
        this.lineNo += 1;
        const timeEndIndex = line.indexOf(this.constructor.TIME_SEPARATOR);
        this.time = this._convertTime(line.substr(0, timeEndIndex));
        const eventIndex = timeEndIndex + timeSeparatorLength;
        const event = line.substr(eventIndex);
        const eventParts = event.split(',');
        this.on_event(eventParts);
      });
      rl.on('close', () => {
        this.on_finish();
        resolve(this.lineNo);
      });
    });
  }
  _convertTime(time) {
    // TODO: Convert time into a date
    return time;
  }

  on_start() {
    console.time('parse');
  }
  on_finish() {
    console.timeEnd('parse');
    console.log('Read entire file.', this.lineNo, 'lines');
  }

  on_event(event) {
    const eventName = event[0];

    const startIndex = 1;
    // const sourceEndIndex = processEntity(parts, startIndex);
    // const targetEndIndex = processEntity(parts, sourceEndIndex);
    //
    // const spellId = parts[9];
    // const spellName = parts[10];
    // const someFlag = parts[11];
    // const buffType = parts[12];

    const eventHandlerName = this._eventHandlerName(eventName);
    this._callMethod(eventHandlerName, event, startIndex);
    // TODO: Handle when the event handler doesn't exist so that no data gets lost
  }
  _eventHandlerName(eventType) {
    return `on_${eventType}`;
  }
  _callMethod(methodName, ...args) {
    const method = this[methodName];
    if (method) {
      method.call(this, ...args);
    }
  }

  on_ENCOUNTER_START(parts, startIndex) {
    const bossId = parts[startIndex + 0];
    const bossName = parts[startIndex + 1];
    const difficulty = parts[startIndex + 2];
    const players = parts[startIndex + 3];

    console.log(this.lineNo, this.time, bossId, bossName, difficulty, players);
    // TODO: Write this to an index file
    // TODO: Write last line parsed to an index file
  }
}

const parser = new CombatLogParser('WoWCombatLog.txt');
parser.start()
  .then(results => {
    process.exit(0);
  }, error => {
    process.exit(0);
  });
