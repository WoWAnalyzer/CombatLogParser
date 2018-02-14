import splitLine from './splitLine';

const DIFFICULTIES = {
  HEROIC: 15,
  MYTHIC: 16,
};
function difficultyLabel(difficulty) {
  switch (difficulty) {
    case DIFFICULTIES.HEROIC: return 'Heroic';
    case DIFFICULTIES.MYTHIC: return 'Mythic';
    default: return 'Unknown';
  }
}

class FightScanner {
  _reader = null;
  constructor(reader) {
    this._reader = reader;
  }

  scan(offset) {
    return new Promise((resolve, reject) => {
      this._reader.on('event', this.handleEvent.bind(this));
      this._reader.on('finish', resolve);
      this._reader.start(offset);
    });
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
          const size = Number(event[3]);
          // noinspection EqualityComparisonWithCoercionJS
          const kill = event[4] == '1';

          console.log(`#${startLineNo}-#${lineNo}`, `${startTime}-${time}`, bossId, difficultyLabel(difficulty), bossName, kill ? 'KILL' : 'WIPE');
        }
        break;
    }
  }
  _isSameFight(event1, event2) {
    const [bossId1, bossName1, difficulty1] = event1;
    const [bossId2, bossName2, difficulty2] = event2;
    // I don't think checking sizes (which would be the next part) makes sense since a player could leave the raid half way into the fight. I'm not sure if the combatlog continues to show the same amount of players. The likelyhood that this reveals a corrupt fight is very small anyway.

    return bossId1 === bossId2 && bossName1 === bossName2 && difficulty1 === difficulty2;
  }
}

export default FightScanner;
