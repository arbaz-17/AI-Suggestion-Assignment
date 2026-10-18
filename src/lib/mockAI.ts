

const nebulaDriftVariations = [
  "Nebula Drift is an immersive sci-fi action adventure where players explore mysterious planets, battle hostile forces, and customize powerful spacecraft while uncovering the secrets of a vast galaxy.",

  "Embark on an unforgettable interstellar journey in Nebula Drift. Discover alien worlds, engage in thrilling space combat, and upgrade your ship as you navigate dangerous territories and hidden cosmic mysteries.",

  "Explore the unknown in Nebula Drift, a space exploration adventure combining intense combat, planetary discovery, and deep ship customization. Every mission brings new challenges across a mysterious galaxy.",
];

export async function generateMockSuggestion(
  input: string,
  variationIndex: number,
  shouldFail = false,
): Promise<string> {
  const source = input.trim();

  if (!source) {
    throw new Error("Please enter a game description first.");
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1200);
  });

  if (shouldFail) {
    throw new Error(
      "The simulated AI request failed. Please try again.",
    );
  }

  const index =
    variationIndex % nebulaDriftVariations.length;

  if (source.toLowerCase().includes("nebula drift")) {
    return nebulaDriftVariations[index];
  }

  const genericVariations = [
    `${source}\n\nDiscover exciting challenges, explore immersive environments, and experience an adventure designed to reward curiosity and skill.`,

    `${source}\n\nEmbark on a memorable gaming journey featuring engaging gameplay, surprising discoveries, and new challenges at every turn.`,

    `${source}\n\nGet ready for an adventure where exploration, strategy, and player creativity come together to create exciting moments.`,
  ];

  return genericVariations[index];
}
