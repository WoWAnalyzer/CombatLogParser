import EventEmitter from 'events';

import splitLine from './splitLine';

class FightScanner extends EventEmitter {
  _reader = null;
  constructor(reader) {
    super();
    this._reader = reader;
  }

  scan(offset) {
    this._reader.on('event', this.handleEvent.bind(this));
    this._reader.on('finish', this.handleFinish.bind(this));
    this._reader.start(offset);
  }
  _lastStart = null;
  handleEvent(lineNo, time, eventName, eventParams) {
    switch (eventName) {
      case 'ENCOUNTER_START':
        this._lastStart = {
          lineNo,
          time,
          event: splitLine(eventParams),
        };
        break;
      case 'ENCOUNTER_END':
        const event = splitLine(eventParams);
        if (this._lastStart && this._isSameFight(this._lastStart.event, event)) {
          const startLineNo = this._lastStart.lineNo;
          const startTime = this._lastStart.time;
          const bossId = Number(event[0]);
          const bossName = event[1];
          const difficulty = Number(event[2]);
          // const size = Number(event[3]);
          // Since this is the result of a file split this is a string-type, but it might change at a later point. Because of the non-strict equals check this will continue to work if it turns into a number or bool.
          // noinspection EqualityComparisonWithCoercionJS
          const kill = event[4] == '1';

          const fight = {
            startLineNo,
            endLineNo: lineNo,
            startTime,
            endTime: time,
            bossId,
            bossName,
            difficulty,
            kill,
          };
          this.emit('fight', fight);
          // console.log(`#${startLineNo}-#${lineNo}`, `${startTime}-${time}`, bossId, difficultyLabel(difficulty), bossName, kill ? 'KILL' : 'WIPE');
        }
        break;
      default: break;
    }
  }
  handleFinish() {
    this.emit('finish');
  }
  _isSameFight(event1, event2) {
    const [bossId1, bossName1, difficulty1] = event1;
    const [bossId2, bossName2, difficulty2] = event2;
    // I don't think checking sizes (which would be the next part) makes sense since a player could leave the raid half way into the fight. I'm not sure if the combatlog continues to show the same amount of players. The likelyhood that this reveals a corrupt fight is very small anyway.

    return bossId1 === bossId2 && bossName1 === bossName2 && difficulty1 === difficulty2;
  }
}

export default FightScanner;
