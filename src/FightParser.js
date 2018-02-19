import EventEmitter from 'events';
import parseDateTime from './parseDateTime';
import splitLine from './splitLine';

class FightParser extends EventEmitter {
  /** @var {CombatLogFileReader} */
  _reader = null;
  constructor(reader) {
    super();
    this._reader = reader;
  }

  _fight = null;
  parse(fight) {
    this._fight = fight;
    this._reader.on('event', this.handleEvent.bind(this));
    this._reader.on('finish', this.handleFinish.bind(this));
    this._reader.start(fight.startLineNo, fight.endLineNo);
  }

  handleEvent(lineNo, rawDateTime, eventName, rawEventParams) {
    const dateTime = parseDateTime(rawDateTime);
    const timestamp = dateTime - this._fight.startDateTime;
    this.emit('event', {
      lineNo,
      timestamp,
      type: eventName,
      params: rawEventParams,
    });
  }
  handleFinish() {
    this.emit('finish');
  }
}

export default FightParser;
