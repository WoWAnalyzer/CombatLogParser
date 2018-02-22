import path from 'path';

import { difficultyLabel } from 'common/DIFFICULTIES';

import CombatLog from './CombatLog';
import splitLine from './splitLine';

const filePath = path.resolve('WoWCombatLog.txt'); // TODO: Feed `filePath` through a file function argument

const eventParsers = {
  COMBATANT_INFO: event => {
    const parts = splitLine(event.params);
    const result = {
      type: event.type,
    };

    let i = 0;
    result.playerId = parts[i++];
    result.strength = parts[i++];
    result.agility = parts[i++];
    result.stamina = parts[i++];
    result.intellect = parts[i++];
    result.dodge = parts[i++];
    result.parry = parts[i++];
    result.block = parts[i++];
    result.critMelee = parts[i++];
    result.critRanged = parts[i++];
    result.critSpell = parts[i++];
    result.speed = parts[i++];
    result.leech = parts[i++];
    result.hasteMelee = parts[i++];
    result.hasteRanged = parts[i++];
    result.hasteSpell = parts[i++];
    result.avoidance = parts[i++];
    result.mastery = parts[i++];
    result.versatilityDamageDone = parts[i++];
    result.versatilityHealingDone = parts[i++];
    result.versatilityDamageReduction = parts[i++];
    result.armor = parts[i++];
    result.specId = parts[i++];
    result.talents = parts[i++];
    result.pvpTalents = parts[i++];
    result.traits = parts[i++];
    result.gear = parts[i++];
    result.buffs = parts[i++];

    return result;
  },
};

async function main(path) {
  const combatLog = new CombatLog(path);
  const fights = [];
  await combatLog.getFights(fight => {
    const startDateTime = fight.startDateTime;
    const duration = fight.endDateTime - startDateTime;
    console.log(`#${fight.startLineNo}-#${fight.endLineNo}`, /*${startDateTime}*/` (${(duration / 1000).toFixed(3)}s)`, fight.bossId, difficultyLabel(fight.difficulty), fight.bossName, fight.kill ? 'KILL' : 'WIPE');
    fights.push(fight);
  });

  let i = 0;
  await combatLog.getEventsForFight(fights[0], event => {
    const parser = eventParsers[event.type];

    if (parser) {
      if (i < 10) {
        console.log(parser(event));
      }
    }
    i += 1;
    // console.log(`${event.timestamp} ${event.type} ${event.params}\n`);
  });
  // for (const fight of fights) {
  //   await combatLog.getEventsForFight(fight, event => {
  //     outputStream.write(`${event.timestamp} ${event.type} ${event.params}\n`);
  //   });
  // }
  process.exit(0);
}
main(filePath);

// When all that is done fight scanning is finished.
// TODO: Parse timestamps
// Stage 1.2: parsing a single fight.
