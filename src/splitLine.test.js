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
  // Benchmarking in a test is fun while doing on a single machine to determine what's quicker, but once you start running things on different environments this becomes pretty useless.
  // it('runs quickly', () => {
  //   const raw = 'SPELL_AURA_APPLIED,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,207589,"Ilterendi, Crown Jewel of Silvermoon",0x2,BUFF';
  //   const start = +new Date();
  //   for (let i = 0; i < 300000; i++) {
  //     splitLine(raw);
  //   }
  //   const duration = +new Date() - start;
  //   expect(duration).toBeLessThan(1000);
  // });
});
