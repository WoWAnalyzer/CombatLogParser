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
  handleEvent(eventName, eventParts, lineNo, time) {
    if (eventName === 'ENCOUNTER_START' || eventName === 'ENCOUNTER_END') {
      console.log(`#${lineNo}`, eventName, ...eventParts);
    }
  }
}

export default FightScanner;
