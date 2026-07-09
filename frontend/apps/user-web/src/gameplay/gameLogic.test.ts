import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyCatch,
  resolveRhythmChoice,
  resolveWordLinkStep,
  type CatchItem,
  type RhythmPair,
  type WordLinkStep
} from "./gameLogic.ts";

test("classifyCatch marks matching cart labels as correct", () => {
  const item: CatchItem = { id: "rice", label: "米饭", target: "food" };

  assert.equal(classifyCatch(item, "food"), "correct");
  assert.equal(classifyCatch(item, "drink"), "wrong");
});

test("resolveRhythmChoice advances only when translation order matches", () => {
  const pairs: RhythmPair[] = [
    { id: "hello", left: "你好", right: "hello" },
    { id: "water", left: "水", right: "water" }
  ];

  assert.deepEqual(resolveRhythmChoice(pairs, ["hello"], "water"), {
    isCorrect: true,
    nextSelected: ["hello", "water"],
    isComplete: true
  });
  assert.deepEqual(resolveRhythmChoice(pairs, [], "water"), {
    isCorrect: false,
    nextSelected: [],
    isComplete: false
  });
});

test("resolveWordLinkStep advances only when the pointer touches the current target card", () => {
  const steps: WordLinkStep[] = [
    { id: "i", label: "我" },
    { id: "eat", label: "吃" },
    { id: "rice", label: "米饭" }
  ];

  assert.deepEqual(resolveWordLinkStep(steps, ["i"], "eat"), {
    isCorrect: true,
    nextLinkedIds: ["i", "eat"],
    isComplete: false
  });
  assert.deepEqual(resolveWordLinkStep(steps, ["i"], "rice"), {
    isCorrect: false,
    nextLinkedIds: ["i"],
    isComplete: false
  });
});
