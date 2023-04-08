import seedrandom from 'seedrandom';

export function random(seed: string): number {
  const rng = seedrandom(seed);
  return rng();
}

// 