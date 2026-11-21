export interface Attendee {
  name: string;
  github: string;
  company: string;
}

export function hasGithub(github: string | undefined): github is string {
  return !!github && !["NA", "none", "N/A", "n/a"].includes(github);
}

export function attendeeKey(a: Attendee) {
  return hasGithub(a.github) ? `gh:${a.github}` : `name:${a.name}`;
}
