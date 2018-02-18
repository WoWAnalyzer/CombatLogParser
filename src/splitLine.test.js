import splitLine from './splitLine';

describe('splitLine', () => {
  it('splits lines with strings with commas in the strings properly', () => {
    const raw = 'SPELL_AURA_APPLIED,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,207589,"Ilterendi, Crown Jewel of Silvermoon",0x2,BUFF';
    expect(splitLine(raw)).toEqual([
      'SPELL_AURA_APPLIED',
      'Player-639-0650F657',
      'Sling-Al\'Akir',
      '0x514',
      '0x0',
      'Player-639-0650F657',
      'Sling-Al\'Akir',
      '0x514',
      '0x0',
      '207589',
      'Ilterendi, Crown Jewel of Silvermoon',
      '0x2',
      'BUFF',
    ]);
  });
  it('splits lines with strings with escaped quotes in the strings properly', () => {
    const raw = 'SPELL_AURA_APPLIED,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,207589,"Throw \\"Stuff\\"",0x2,BUFF';
    expect(splitLine(raw)).toEqual([
      'SPELL_AURA_APPLIED',
      'Player-639-0650F657',
      'Sling-Al\'Akir',
      '0x514',
      '0x0',
      'Player-639-0650F657',
      'Sling-Al\'Akir',
      '0x514',
      '0x0',
      '207589',
      'Throw "Stuff"',
      '0x2',
      'BUFF',
    ]);
  });
  it('splits lines with strings with escaped quotes in the strings properly', () => {
    const raw = 'SPELL_AURA_APPLIED,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,207589,"Throw \\"Stuff\\", or don\'t?",0x2,BUFF';
    expect(splitLine(raw)).toEqual([
      'SPELL_AURA_APPLIED',
      'Player-639-0650F657',
      'Sling-Al\'Akir',
      '0x514',
      '0x0',
      'Player-639-0650F657',
      'Sling-Al\'Akir',
      '0x514',
      '0x0',
      '207589',
      'Throw "Stuff", or don\'t?',
      '0x2',
      'BUFF',
    ]);
  });
  it('splits lines with strings with unescaped quotes in the strings properly', () => {
    const raw = 'SPELL_AURA_APPLIED,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,207589,"Throw "Stuff"",0x2,BUFF';
    expect(splitLine(raw)).toEqual([
      'SPELL_AURA_APPLIED',
      'Player-639-0650F657',
      'Sling-Al\'Akir',
      '0x514',
      '0x0',
      'Player-639-0650F657',
      'Sling-Al\'Akir',
      '0x514',
      '0x0',
      '207589',
      'Throw "Stuff"',
      '0x2',
      'BUFF',
    ]);
  });
 it('splits combatant info with nested commas properly', () => {
   const raw = 'Player-73-0B633FAE,5929,7503,100159,79282,0,0,0,7152,7152,7152,617,0,11421,11421,11421,0,11642,972,972,972,2341,257,(193155,121536,196707,196985,32546,197031,193157),(208683,195330),[835,1,836,1,837,1,838,5,839,1,840,1,841,4,842,5,843,4,844,4,845,1,846,4,847,5,848,6,849,4,1346,1,1380,1,1649,1,1569,4,1570,1,1571,1,1572,21,834,1,1209,73,1257,73,1739,3,1784,1,1775,1,1782,1],[(152156,945,(),(3611,1487,3528),()),(152283,940,(5890,0,0),(3610,1472,3528),()),(134432,940,(),(3536,1808,42,1592,3528),(151584,110)),(0,0,(),(),()),(144473,955,(),(3536,1607,3337),()),(151952,930,(),(3610,1472,3528),()),(132447,1000,(),(3459,3630),()),(151940,945,(),(3611,1487,3528),()),(134310,965,(),(3536,1627,3337),()),(134420,925,(),(3509,1808,1577,3336),(151584,110)),(134530,945,(5429,0,0),(3536,1597,3336),()),(134487,950,(5429,0,0),(3536,1602,3336),()),(144258,1000,(),(3459,3630),()),(151958,955,(),(3611,1497,3336),()),(152154,935,(),(3610,1477,3336),()),(128825,981,(),(739),(152045,930,155854,960,155851,955)),(0,0,(),(),()),(0,0,(),(),())],[Player-73-0B02B23D,210372,Player-73-0B633FAE,207555,Player-73-0B633FAE,201640,Player-73-0B3373A7,166646,Player-73-0B633FAE,188031,Player-73-0B633FAE,251831]';
   expect(splitLine(raw)).toEqual([
     'Player-73-0B633FAE',
     '5929',
     '7503',
     '100159',
     '79282',
     '0',
     '0',
     '0',
     '7152',
     '7152',
     '7152',
     '617',
     '0',
     '11421',
     '11421',
     '11421',
     '0',
     '11642',
     '972',
     '972',
     '972',
     '2341',
     '257',
     // Talents
     '(193155,121536,196707,196985,32546,197031,193157)',
     // Honor talents
     '(208683,195330)',
     // Traits. Left side are trait ids, these are different from spell ids. Right side is the level.
     '[835,1,836,1,837,1,838,5,839,1,840,1,841,4,842,5,843,4,844,4,845,1,846,4,847,5,848,6,849,4,1346,1,1380,1,1649,1,1569,4,1570,1,1571,1,1572,21,834,1,1209,73,1257,73,1739,3,1784,1,1775,1,1782,1]',
     // Gear (item,itemLevel,?,?,?)
     '[(152156,945,(),(3611,1487,3528),()),(152283,940,(5890,0,0),(3610,1472,3528),()),(134432,940,(),(3536,1808,42,1592,3528),(151584,110)),(0,0,(),(),()),(144473,955,(),(3536,1607,3337),()),(151952,930,(),(3610,1472,3528),()),(132447,1000,(),(3459,3630),()),(151940,945,(),(3611,1487,3528),()),(134310,965,(),(3536,1627,3337),()),(134420,925,(),(3509,1808,1577,3336),(151584,110)),(134530,945,(5429,0,0),(3536,1597,3336),()),(134487,950,(5429,0,0),(3536,1602,3336),()),(144258,1000,(),(3459,3630),()),(151958,955,(),(3611,1497,3336),()),(152154,935,(),(3610,1477,3336),()),(128825,981,(),(739),(152045,930,155854,960,155851,955)),(0,0,(),(),()),(0,0,(),(),())]',
     // "Noteworthy" buffs - Blizzard manually decides what is shared here so this is usually incomplete.
     '[Player-73-0B02B23D,210372,Player-73-0B633FAE,207555,Player-73-0B633FAE,201640,Player-73-0B3373A7,166646,Player-73-0B633FAE,188031,Player-73-0B633FAE,251831]',
   ]);
 });
  // Benchmarking in a test is fun while doing on a single machine to determine what's quicker, but once you start running things on different environments this becomes pretty useless.
  it('runs quickly', () => {
    const raw = 'SPELL_AURA_APPLIED,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,207589,"Ilterendi, Crown Jewel of Silvermoon",0x2,BUFF';
    const start = +new Date();
    for (let i = 0; i < 300000; i++) {
      splitLine(raw);
    }
    const duration = +new Date() - start;
    expect(duration).toBeLessThan(1000);
  });
});
