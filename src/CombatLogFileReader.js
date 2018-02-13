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
  static EVENT_VALUE_SEPARATOR = ',';
  // static splitLine(line) {
  //   return line.split(',');
  // }
  static splitLine(line) {
    const parts = [];
    const lineLength = line.length;
    let currentPartStartIndex = 0;
    let isPartString = false;
    for (let i = 0; i < lineLength; i++) {
      const character = line[i];
      if (character === '"' && i === currentPartStartIndex) {
        // If we're still at the start of the part we can be sure this is a string
        isPartString = true;
      }
      if (character === this.EVENT_VALUE_SEPARATOR) {
        if (isPartString) {
          // We determined earlier that we're in a string, so verify we reached the end and not just a comma within the string
          const previousCharacter = line[i - 1];
          if (previousCharacter === '"') {
            // This comma is after the string closer, so proceed
          } else {
            // We're still in the middle of the string
            continue;
          }
        }

        const partStartIndex = isPartString ? currentPartStartIndex + 1 : currentPartStartIndex;
        const partEndIndex = isPartString ? i - 2 : i;
        const partLength = partEndIndex - currentPartStartIndex;
        const part = line.substr(partStartIndex, partLength);
        parts.push(part);
        currentPartStartIndex = i + 1;
        isPartString = false;
      }
    }
    parts.push(line.substr(currentPartStartIndex));

    return parts;
  }

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
      const eventParts = this.constructor.splitLine(event);
      const eventName = eventParts.shift();
      this.emit('event', eventName, eventParts, lineNo, time);
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
