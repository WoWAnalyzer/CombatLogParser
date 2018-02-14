import splitLine from './splitLine';

class FightScanner {
  _reader = null;
  constructor(reader) {
    this._reader = reader;
  }

  scan(offset) {
    return new Promise((resolve, reject) => {
      this._reader.on('event', this.handleEvent);
      this._reader.on('finish', resolve);
      this._reader.start(offset);
    });
  }
  handleEvent(lineNo, time, eventName, eventParams) {
    if (eventName === 'ENCOUNTER_START' || eventName === 'ENCOUNTER_END') {
      console.log(`#${lineNo}`, eventName, ...splitLine(eventParams));
    }
  }
}

export default FightScanner;
