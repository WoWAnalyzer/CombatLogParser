import FightScanner from './FightScanner';
import CombatLogFileReader from "./CombatLogFileReader";

// const entities = {};
//
// function processEntity(parts, startIndex) {
//   const id = parts[startIndex + 0];
//   const name = parts[startIndex + 1];
//   const flags = parts[startIndex + 2];
//   const flags2 = parts[startIndex + 3];
//
//   entities[id] = name;
//
//   return startIndex + 4;
// }

const reader = new CombatLogFileReader('WoWCombatLog.txt');
const scanner = new FightScanner(reader);
scanner.scan()
  .then(results => {
    process.exit(0);
  }, error => {
    process.exit(0);
  });
