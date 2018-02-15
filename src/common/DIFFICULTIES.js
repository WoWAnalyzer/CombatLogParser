const DIFFICULTIES = {
  HEROIC: 15,
  MYTHIC: 16,
};
export default DIFFICULTIES;

export function difficultyLabel(difficulty) {
  switch (difficulty) {
    case DIFFICULTIES.HEROIC: return 'Heroic';
    case DIFFICULTIES.MYTHIC: return 'Mythic';
    default: return 'Unknown';
  }
}
