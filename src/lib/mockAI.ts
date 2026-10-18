
const gtaVariations = [
  "Experience Grand Theft Auto VI, an open-world crime adventure set in the neon-lit streets of Vice City and the wider state of Leonida. Explore a vibrant world, encounter unforgettable characters, and dive into high-stakes action.",

  "Welcome to Vice City. Grand Theft Auto VI takes players into a sprawling world of crime, ambition, and action. Discover the diverse landscapes of Leonida and experience a story filled with danger and opportunity.",

  "Step into the world of Grand Theft Auto VI, where the streets of Vice City come alive. Explore Leonida, navigate a thrilling criminal underworld, and experience the freedom of a massive open-world adventure.",
];

export async function generateMockSuggestion(
  input: string,
  variationIndex: number,
  shouldFail = false,
): Promise<string> {
  const source = input.trim();

  if (!source) {
    throw new Error("Enter a game description first.");
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1200);
  });

  if (shouldFail) {
    throw new Error(
      "The simulated AI request failed. Please try again.",
    );
  }

  const index = variationIndex % gtaVariations.length;

  const lowerSource = source.toLowerCase();

  if (
    lowerSource.includes("grand theft auto vi") ||
    lowerSource.includes("gta vi") ||
    lowerSource.includes("gta 6")
  ) {
    return gtaVariations[index];
  }

  const genericVariations = [
    `${source}\n\nExplore immersive environments, take on exciting challenges, and experience a memorable adventure.`,

    `${source}\n\nDiscover engaging gameplay, memorable encounters, and a world full of opportunities.`,

    `${source}\n\nExperience an adventure where exploration, action, and player choice come together.`,
  ];

  return genericVariations[index];
}
