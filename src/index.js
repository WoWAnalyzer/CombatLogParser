import path from 'path';

import { difficultyLabel } from 'common/DIFFICULTIES';

import CombatLog from './CombatLog';
import splitLine from './splitLine';

const filePath = path.resolve('WoWCombatLog.txt'); // TODO: Feed `filePath` through a file function argument

// TODO: Make this a class since we'll probably need combatlog version in order to determine how to parse it.
const eventParsers = {
  COMBATANT_INFO: event => {
    const parts = splitLine(event.params);
    // TODO: I don't think doing this here is clean, would be duplicated into every single event...
    const result = {
      type: event.type,
    };

    let i = 0;
    // This approach is to make it easier to update when Blizzard adds a field somewhere in the middle.
    result.playerId = parts[i++];
    result.strength = parts[i++];
    result.agility = parts[i++];
    result.stamina = parts[i++];
    result.intellect = parts[i++];
    result.dodge = parts[i++];
    result.parry = parts[i++];
    result.block = parts[i++];
    // TODO: I think at this point we can merge this into one prop. Blizzard isn't going to add different variant of crit anyway I reckon.
    result.critMelee = parts[i++];
    result.critRanged = parts[i++];
    result.critSpell = parts[i++];
    result.speed = parts[i++];
    result.leech = parts[i++];
    // TODO: I think at this point we can merge this into one prop. Blizzard isn't going to add different variant of Haste anyway I reckon.
    result.hasteMelee = parts[i++];
    result.hasteRanged = parts[i++];
    result.hasteSpell = parts[i++];
    result.avoidance = parts[i++];
    result.mastery = parts[i++];
    // TODO: I think at this point we can merge this into one prop. Blizzard isn't going to add different variant of versa anyway I reckon.
    result.versatilityDamageDone = parts[i++];
    result.versatilityHealingDone = parts[i++];
    result.versatilityDamageReduction = parts[i++];
    result.armor = parts[i++];
    result.specId = parts[i++];
    // TODO: Parse
    result.talents = parts[i++];
    // TODO: Parse
    result.pvpTalents = parts[i++];
    // TODO: Parse
    result.traits = parts[i++];
    // TODO: Parse
    result.gear = parts[i++];
    // TODO: Parse.
    // TODO: Maybe rename to "incompletePrepullBuffsThatDependsOnIfBlizzardFeltLikeAddingABuff". See: https://blue.mmo-champion.com/topic/398157-new-logging-feature-combatant-info/. Quote: "Interesting Auras – This is a list of interesting auras (buffs/debuffs) that we have manually flagged to be included in this log line. We’ll welcome feedback about what should be included here but currently plan for set bonuses, well fed, flasks, combat potions, Vantus runes, and player buffs. Nothing has been flagged for this yet, so you won’t see anything here in the current build."
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
