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
  static EVENT_PART_SEPARATOR = ',';
  static splitLine(line) {
    const partSeparator = this.EVENT_PART_SEPARATOR;
    const partSeparatorLength = partSeparator.length;

    const parts = [];
    const lineLength = line.length;
    let currentPartStartIndex = 0;
    let isCurrentPartString = false;
    for (let i = 0; i < lineLength; i++) {
      const character = line[i];

      // If the first character is a quote we can be sure we're in a string
      if (character === '"' && i === currentPartStartIndex) {
        isCurrentPartString = true;
      }

      if (character === partSeparator) {
        if (isCurrentPartString) {
          // If we found a comma while in a string, check if the string was closed in the previous character.
          const previousCharacter = line[i - 1];
          if (previousCharacter !== '"') {
            // If the previous character was anything other than a quote we're still in the middle of the string.
            continue; // next character
          }
        }

        // End of part
        let partStartIndex = currentPartStartIndex;
        let partEndIndex = i;
        // Unwrap strings; turns '"abc"' into 'abc'
        if (isCurrentPartString) {
          partStartIndex += 1;
          partEndIndex -= 1;
        }
        // substr needs a length, not an end index
        const partLength = partEndIndex - partStartIndex;
        const part = line.substr(partStartIndex, partLength);
        parts.push(part);

        // Prepare next part
        currentPartStartIndex = i + partSeparatorLength;
        isCurrentPartString = false;
      }
    }
    // The last part doesn't end with a comma, so add the remaining stuff as the last part
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
