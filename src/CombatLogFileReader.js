import fs from 'fs';
import readline from 'readline';
import EventEmitter from 'events';

/**
 * This *reads* the combatlog file, only doing minimal parsing such as separating the time from the event and splitting the event into parts. Triggers the following events:
 * - `start` when it begins.
 * - `event` for every event. Contains: eventParts, lineNo, time
 * - `finish` when finished reading the file. Contains: totalLines (includes offset)
 */
class CombatLogFileReader extends EventEmitter {
  static TIME_SEPARATOR = '  ';

  _path = null;
  constructor(path) {
    super();
    this._path = path;

    this._performanceMeasurer();
    this._lineLengthReporter();
  }

  _performanceMeasurer() {
    this.on('start', () => {
      console.time('read');
    });
    this.on('finish', () => {
      console.timeEnd('read');
    });
  }
  _lineLengthReporter() {
    this.on('finish', lineNo => {
      console.log('Read entire file.', lineNo, 'lines');
    });
  }

  start(offset = 0) {
    const rl = readline.createInterface({
      input: fs.createReadStream(this._path),
      crlfDelay: Infinity
    });

    const timeSeparator = this.constructor.TIME_SEPARATOR;
    const timeSeparatorLength = timeSeparator.length; // just an inconsequential performance thing
    let lineNo = 0;

    this.emit('start');
    rl.on('line', line => {
      if (offset > lineNo) {
        return;
      }
      lineNo += 1;

      const timeEndIndex = line.indexOf(timeSeparator);
      const time = this._convertTime(line.substr(0, timeEndIndex));
      const eventIndex = timeEndIndex + timeSeparatorLength;
      const event = line.substr(eventIndex);
      const eventNameEndIndex = event.indexOf(',');
      const eventName = event.substr(0, eventNameEndIndex);
      const eventParams = event.substr(eventNameEndIndex + 1);
      this.emit('event', lineNo, time, eventName, eventParams);
    });
    rl.on('close', () => {
      this.emit('finish', lineNo);
    });
  }
  _convertTime(time) {
    // TODO: Convert time into a date
    return time;
  }
}

export default CombatLogFileReader;
