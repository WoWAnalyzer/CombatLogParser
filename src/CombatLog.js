import CombatLogFileReader from './CombatLogFileReader';
import FightScanner from './FightScanner';

class CombatLog {
  path = null;
  constructor(path) {
    this.path = path;
  }

  get reader() {
    return new CombatLogFileReader(this.path);
  }

  /**
   * Get the fight list, each time a fight is found in the log the `eventListener` argument is called. This method returns when finished.
   * @param eventListener
   * @returns {Promise<void>}
   */
  getFights(eventListener) {
    return new Promise((resolve, reject) => {
      // TODO: Read index
      // TODO: Validate index
      // TODO: Determine last scanned line
      // TODO: Offset scan by last scanned line
      // TODO: Store newly found fights in index
      // const fileName = path.basename(filePath, path.extname(filePath));
      // const indexFileName = `${fileName}.index.txt`;
      // const indexFilePath = path.join(path.dirname(filePath), indexFileName);

      const scanner = new FightScanner(this.reader);
      scanner.on('fight', fight => {
        eventListener(fight);
      });
      scanner.on('finish', () => {
        resolve();
      });
      scanner.scan();
    });
  }
  async getEventsForFight(fight, eventListener) {

  }
}

export default CombatLog;
