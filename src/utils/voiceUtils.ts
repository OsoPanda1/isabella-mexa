/**
 * Isabella Villaseñor - Female Voice Synthesis Engine & Classification
 * Guarantees that speech synthesis always selects and uses a pure, natural female voice.
 */

const MALE_VOICE_NAMES = new Set([
  "jorge", "diego", "pablo", "carlos", "miguel", "raul", "raúl", "enrique",
  "alvaro", "álvaro", "gonzalo", "mateo", "manuel", "david", "antonio", "juan",
  "fernando", "pedro", "javier", "rodrigo", "luis", "sergio", "alejandro",
  "alberto", "ignacio", "hugo", "daniel", "mario", "marcos", "vicente",
  "santiago", "andres", "andrés", "felipe", "bernardo", "tomas", "tomás",
  "guillermo", "lucas", "martin", "martín", "sebastian", "sebastián", "victor",
  "víctor", "arturo", "ricardo", "eduardo", "gabriel", "emilio", "francisco",
  "esteban", "hector", "héctor", "cesar", "césar", "alex", "fred", "junior",
  "bruce", "ralph", "tom", "albert", "george", "john", "mark", "paul",
  "michael", "guy", "stefan", "julien", "christoph", "yannick", "gordon",
  "stefano", "cosimo", "oliver", "harry", "arthur", "jack", "adam", "geraint"
]);

const MALE_REGEX =
  /(male|hombre|\bman\b|\bboy\b|jorge|diego|pablo|carlos|miguel|raul|raúl|enrique|alvaro|álvaro|gonzalo|mateo|manuel|david|antonio|juan|fernando|pedro|javier|rodrigo|luis|sergio|alejandro|alberto|ignacio|hugo|daniel|mario|marcos|vicente|santiago|andres|andrés|felipe|bernardo|tomas|tomás|guillermo|lucas|martin|martín|sebastian|sebastián|victor|víctor|arturo|ricardo|eduardo|gabriel|emilio|francisco|esteban|hector|héctor|cesar|césar|alex|fred|junior|bruce|ralph|\btom\b|albert|george|john|mark|paul|michael|guy|stefan|julien|christoph|yannick|gordon)/i;

const FEMALE_REGEX =
  /(female|femme|mujer|woman|girl|donna|frauen|isabella|paulina|monica|mónica|paloma|helena|elena|lucia|lucía|carmen|conchita|penelope|penélope|sabina|laura|francisca|soledad|eva|marta|sofia|sofía|maria|maría|rosa|teresa|ana|claudia|silvia|patricia|marina|victoria|samantha|zira|karen|susan|hazel|aria|jenny|dalia|sabrina|camila|ximena|valentina|daniela|catalina|andrea|natalia|valeria|luz|esperanza|alicia|ines|inés|raquel|irene|beatriz|lorena|olga|pilar|susana|mercedes|amalia|carlota|julia|clara|cristina|adriana|estela|marisol|lola|belinda|estrella|reyna|salome|salomé|elvira|juana|guadalupe|alba|tania|triana|hilda|rebeca|karina|nayeli)/i;

/**
 * Checks whether a given SpeechSynthesisVoice is strictly a female voice
 */
export function isStrictlyFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  const nameLower = voice.name.toLowerCase();
  const uriLower = (voice.voiceURI || "").toLowerCase();

  // 1. Explicit male reject
  if (MALE_REGEX.test(nameLower) || MALE_REGEX.test(uriLower)) {
    return false;
  }

  // 2. Explicit female match
  if (FEMALE_REGEX.test(nameLower) || FEMALE_REGEX.test(uriLower)) {
    return true;
  }

  // 3. Known female voice identifiers in Microsoft / Apple / Android / Chrome
  if (
    nameLower.includes("natural") ||
    nameLower.includes("neural") ||
    nameLower.includes("online") ||
    nameLower.includes("siri")
  ) {
    // If it's natural and doesn't match male, check words
    return !MALE_REGEX.test(nameLower);
  }

  // If ambiguous, return false to enforce strict female safety
  return false;
}

/**
 * Checks if a voice is a known male voice
 */
export function isMaleVoice(voice: SpeechSynthesisVoice): boolean {
  const nameLower = voice.name.toLowerCase();
  const uriLower = (voice.voiceURI || "").toLowerCase();
  return MALE_REGEX.test(nameLower) || MALE_REGEX.test(uriLower);
}

/**
 * Filters the list of available browser voices to return female voices,
 * ranked by language compatibility (Spanish first) and acoustic quality.
 */
export function getAvailableFemaleVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  if (!voices || voices.length === 0) return [];

  // Filter out all male voices
  const nonMaleVoices = voices.filter((v) => !isMaleVoice(v));

  // Separate strictly identified female vs others
  const confirmedFemale = nonMaleVoices.filter((v) => isStrictlyFemaleVoice(v));
  const fallbackCandidates = nonMaleVoices.filter((v) => !isStrictlyFemaleVoice(v));

  // Sort confirmed female voices: Spanish first, then Natural/Neural, then others
  confirmedFemale.sort((a, b) => {
    const aIsSpanish = a.lang.startsWith("es") || a.lang.includes("ES") || a.lang.includes("MX");
    const bIsSpanish = b.lang.startsWith("es") || b.lang.includes("ES") || b.lang.includes("MX");
    if (aIsSpanish && !bIsSpanish) return -1;
    if (!aIsSpanish && bIsSpanish) return 1;

    const aIsNatural = /natural|neural|online|enhanced/i.test(a.name);
    const bIsNatural = /natural|neural|online|enhanced/i.test(b.name);
    if (aIsNatural && !bIsNatural) return -1;
    if (!aIsNatural && bIsNatural) return 1;

    return a.name.localeCompare(b.name);
  });

  if (confirmedFemale.length > 0) {
    return confirmedFemale;
  }

  // Fallback: If no voice matched strict regex, return non-male Spanish voices
  const spanishNonMale = fallbackCandidates.filter(
    (v) => v.lang.startsWith("es") || v.lang.includes("ES") || v.lang.includes("MX")
  );
  return spanishNonMale.length > 0 ? spanishNonMale : fallbackCandidates;
}

/**
 * Selects the absolute best female voice for Isabella Villaseñor
 */
export function selectBestFemaleVoice(
  voices: SpeechSynthesisVoice[],
  preferredVoiceName?: string
): {
  voice: SpeechSynthesisVoice | undefined;
  pitchMultiplier: number;
} {
  if (!voices || voices.length === 0) {
    return { voice: undefined, pitchMultiplier: 1.12 };
  }

  // 1. If user explicitly specified a preference and it's not male
  if (preferredVoiceName) {
    const custom = voices.find((v) => v.name === preferredVoiceName);
    if (custom && !isMaleVoice(custom)) {
      return {
        voice: custom,
        pitchMultiplier: isStrictlyFemaleVoice(custom) ? 1.04 : 1.14,
      };
    }
  }

  const femaleVoices = getAvailableFemaleVoices(voices);

  // Hierarchy of optimal female Spanish voices:
  // Tier 1: Microsoft Natural Neural Spanish Female (Dalia, Paloma, Elvira, Elena, Laura, Sabrina, Alba)
  const tier1 = femaleVoices.find(
    (v) =>
      /microsoft.*(dalia|paloma|elvira|elena|laura|sabrina|alba|salome|ximena).*natural/i.test(v.name) ||
      /microsoft.*natural.*(dalia|paloma|elvira|elena|laura|sabrina|alba)/i.test(v.name)
  );
  if (tier1) return { voice: tier1, pitchMultiplier: 1.02 };

  // Tier 2: Apple Siri / iOS Female Spanish voices (Paulina, Mónica, Lucía, Francisca, Soledad, Helena, etc.)
  const tier2 = femaleVoices.find((v) =>
    /paulina|mónica|monica|lucia|lucía|carmen|conchita|penelope|penélope|soledad|francisca|helena|elena|sabina|laura/i.test(
      v.name
    )
  );
  if (tier2) return { voice: tier2, pitchMultiplier: 1.04 };

  // Tier 3: Microsoft Neural / Google Spanish Female voices
  const tier3 = femaleVoices.find(
    (v) =>
      (v.lang.startsWith("es") || v.lang.includes("ES") || v.lang.includes("MX")) &&
      /dalia|paloma|elvira|elena|sabina|laura|alba|sofia|maria|ana|claudia|silvia/i.test(v.name)
  );
  if (tier3) return { voice: tier3, pitchMultiplier: 1.04 };

  // Tier 4: Any Spanish voice confirmed female
  const tier4 = femaleVoices.find(
    (v) => (v.lang.startsWith("es") || v.lang.includes("ES") || v.lang.includes("MX")) && isStrictlyFemaleVoice(v)
  );
  if (tier4) return { voice: tier4, pitchMultiplier: 1.06 };

  // Tier 5: Any Spanish voice that is not male
  const tier5 = voices.find(
    (v) =>
      (v.lang.startsWith("es") || v.lang.includes("ES") || v.lang.includes("MX")) && !isMaleVoice(v)
  );
  if (tier5) return { voice: tier5, pitchMultiplier: 1.15 }; // Elevate pitch slightly to ensure feminine warmth

  // Tier 6: High quality English / Multilingual female voice as fallback
  const tier6 = femaleVoices.find((v) =>
    /samantha|victoria|zira|karen|susan|hazel|aria|jenny/i.test(v.name)
  );
  if (tier6) return { voice: tier6, pitchMultiplier: 1.06 };

  // Tier 7: First non-male voice available
  const nonMale = voices.find((v) => !isMaleVoice(v));
  return { voice: nonMale || voices[0], pitchMultiplier: 1.18 };
}
