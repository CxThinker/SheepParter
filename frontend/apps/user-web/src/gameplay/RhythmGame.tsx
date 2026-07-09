import { useEffect, useMemo, useState } from "react";

import type { Messages } from "../i18n";
import { resolveRhythmChoice } from "./gameLogic";

export function RhythmGame({ messages }: { messages: Messages }) {
  const common = messages.pages.start.games.common;
  const game = messages.pages.start.games.rhythm;
  const pairs = game.pairs;
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState<string>(game.locked);
  const unlocked = visibleCount >= pairs.length;
  const choices = useMemo(() => Array.from(pairs).reverse(), [pairs]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (visibleCount >= pairs.length) {
      setIsPlaying(false);
      setStatus(game.unlocked);
      return;
    }

    const timer = window.setTimeout(() => setVisibleCount((value) => value + 1), 650);
    return () => window.clearTimeout(timer);
  }, [game.unlocked, isPlaying, pairs.length, visibleCount]);

  function playRhythm() {
    setVisibleCount(0);
    setSelectedIds([]);
    setMistakes(0);
    setStatus(game.locked);
    setIsPlaying(true);
  }

  function resetGame() {
    setVisibleCount(0);
    setIsPlaying(false);
    setSelectedIds([]);
    setMistakes(0);
    setStatus(game.locked);
  }

  function chooseCard(id: string) {
    if (!unlocked) {
      return;
    }

    const result = resolveRhythmChoice(pairs, selectedIds, id);
    if (result.isCorrect) {
      setSelectedIds(result.nextSelected);
      setStatus(result.isComplete ? common.complete : common.correct);
    } else {
      setMistakes((value) => value + 1);
      setStatus(common.wrong);
    }
  }

  return (
    <div className="game-stage">
      <div className="game-toolbar">
        <p>{game.help}</p>
        <div className="game-actions">
          <button className="mini-button" onClick={playRhythm} type="button">
            {game.play}
          </button>
          <button className="mini-button" onClick={resetGame} type="button">
            {common.reset}
          </button>
        </div>
      </div>

      <div className="rhythm-board">
        <section className="rhythm-column">
          {pairs.map((pair, index) => (
            <div className={`rhythm-note${index < visibleCount ? " is-visible" : ""}`} key={pair.id}>
              {index < visibleCount ? pair.left : "--"}
            </div>
          ))}
        </section>

        <section className={`rhythm-column rhythm-column--answers${unlocked ? " is-unlocked" : ""}`}>
          <p>{status}</p>
          {choices.map((pair) => (
            <button
              className={`answer-card${selectedIds.includes(pair.id) ? " is-selected" : ""}`}
              disabled={!unlocked || selectedIds.includes(pair.id)}
              key={pair.id}
              onClick={() => chooseCard(pair.id)}
              type="button"
            >
              {pair.right}
            </button>
          ))}
        </section>
      </div>

      <div className="score-strip">
        <span>
          {common.progress}: {selectedIds.length}/{pairs.length}
        </span>
        <span>
          {common.wrong}: {mistakes}
        </span>
      </div>
    </div>
  );
}
