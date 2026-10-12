export const MISSIONS = [
  {
    id: "easy-1",
    level: "easy",
    title: "Something green",
    instruction: "Find a living green leaf and take a close photo.",
    hint: "Look at the ground or on a tree branch.",
    points: 10,
    minutes: 2,
  },
  {
    id: "easy-2",
    level: "easy",
    title: "Look up",
    instruction: "Photograph the sky. It should fill half the photo.",
    hint: "Step outside and aim above buildings or trees.",
    points: 10,
    minutes: 2,
  },
  {
    id: "easy-3",
    level: "easy",
    title: "Round things",
    instruction: "Find a round pebble, fruit or flower head.",
    hint: "Search gravel, pavement edges, or planters.",
    points: 10,
    minutes: 2,
  },
  {
    id: "med-1",
    level: "medium",
    title: "Heart shape",
    instruction: "Find an object or shape that looks like a heart.",
    hint: "Look for twinned leaves, stones, or petal clusters.",
    points: 20,
    minutes: 4,
  },
  {
    id: "med-2",
    level: "medium",
    title: "Tiny life",
    instruction: "Photograph a small insect, snail or bird.",
    hint: "Inspect sunny masonry, damp soil, or shrubs.",
    points: 20,
    minutes: 4,
  },
  {
    id: "med-3",
    level: "medium",
    title: "Two textures",
    instruction: "Capture two different textures, like bark and moss.",
    hint: "Seek weathered tree trunks or mossy brickwork.",
    points: 20,
    minutes: 4,
  },
  {
    id: "hard-1",
    level: "hard",
    title: "Unusual leaf",
    instruction: "Find a leaf with an odd shape, color or pattern.",
    hint: "Look for serrated edges, insect marks, or autumn color.",
    points: 30,
    minutes: 6,
  },
  {
    id: "hard-2",
    level: "hard",
    title: "Pattern in nature",
    instruction: "Find a repeating natural pattern.",
    hint: "Notice pinecone scales, bark fissures, or fern frills.",
    points: 30,
    minutes: 6,
  },
  {
    id: "hard-3",
    level: "hard",
    title: "Shadow art",
    instruction: "Find a shadow that forms an interesting shape.",
    hint: "Check railings or tree shadows cast on pavement.",
    points: 30,
    minutes: 6,
  },
];

export const LEVELS = [
  {
    id: "easy",
    title: "Easy",
    pointsEach: 10,
    minutesEach: 2,
    unlockRequirement: null,
  },
  {
    id: "medium",
    title: "Medium",
    pointsEach: 20,
    minutesEach: 4,
    unlockRequirement: "Finish 2 Easy missions to unlock.",
  },
  {
    id: "hard",
    title: "Hard",
    pointsEach: 30,
    minutesEach: 6,
    unlockRequirement: "Finish 2 Medium missions to unlock.",
  },
];

export function getRankTitle(points) {
  if (points >= 120) return "Pathfinder";
  if (points >= 60) return "Ranger";
  if (points >= 20) return "Trail Finder";
  return "Seedling";
}

export function getMissionById(id) {
  return MISSIONS.find((m) => m.id === id) || null;
}
