import EventEmitter from 'events';

class FightParser extends EventEmitter {
  _reader = null;
  constructor(reader) {
    super();
    this._reader = reader;
  }

  parse(fight) {
    this._reader.on('event', this.handleEvent.bind(this));
    this._reader.on('finish', this.handleFinish.bind(this));
    this._reader.start(fight.startLineNo);
  }

  handleEvent(lineNo, time, eventName, eventParams) {
    this.emit('event', {
      lineNo, time, eventName, eventParams,
    });
  }
  handleFinish() {
    this.emit('finish');
  }
}

export default FightParser;
