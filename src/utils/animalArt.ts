// Returns the kawaii art URL for a given letter (A-Z)
// Uses static assets bundled in /public/animals/
export function getAnimalArt(letter: string): string {
  return `/animals/${letter.toUpperCase()}.jpg`;
}
