import CombatLogFileReader from './CombatLogFileReader';

describe('CombatLogFileReader', () => {
  describe('line splitting', () => {
    it('splits lines with strings with commas in the strings properly', () => {
      const raw = 'SPELL_AURA_APPLIED,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,Player-639-0650F657,"Sling-Al\'Akir",0x514,0x0,207589,"Ilterendi, Crown Jewel of Silvermoon",0x2,BUFF';
      expect(CombatLogFileReader.splitLine(raw)).toEqual([
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
    })
  });
});
