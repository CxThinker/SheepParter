export type CatchResult = "correct" | "wrong";

export type CatchItem = {
  id: string;
  label: string;
  target: string;
};

export type RhythmPair = {
  id: string;
  left: string;
  right: string;
};

export type RhythmChoiceResult = {
  isComplete: boolean;
  isCorrect: boolean;
  nextSelected: string[];
};

export type WordLinkStep = {
  id: string;
  label: string;
};

export type WordLinkStepResult = {
  isComplete: boolean;
  isCorrect: boolean;
  nextLinkedIds: string[];
};

export function classifyCatch(item: CatchItem, cartTarget: string): CatchResult {
  return item.target === cartTarget ? "correct" : "wrong";
}

export function resolveRhythmChoice(
  pairs: readonly RhythmPair[],
  selectedIds: string[],
  choiceId: string
): RhythmChoiceResult {
  const expected = pairs[selectedIds.length]?.id;

  if (choiceId !== expected) {
    return { isComplete: false, isCorrect: false, nextSelected: selectedIds };
  }

  const nextSelected = [...selectedIds, choiceId];
  return { isComplete: nextSelected.length === pairs.length, isCorrect: true, nextSelected };
}

export function resolveWordLinkStep(
  steps: readonly WordLinkStep[],
  linkedIds: string[],
  tileId: string
): WordLinkStepResult {
  const expected = steps[linkedIds.length]?.id;

  if (tileId !== expected) {
    return { isComplete: false, isCorrect: false, nextLinkedIds: linkedIds };
  }

  const nextLinkedIds = [...linkedIds, tileId];
  return { isComplete: nextLinkedIds.length === steps.length, isCorrect: true, nextLinkedIds };
}
