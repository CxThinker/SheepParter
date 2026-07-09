import { type CSSProperties, useEffect, useMemo, useState } from "react";

import type { Messages } from "../i18n";
import { classifyCatch, type CatchItem } from "./gameLogic";

type CatchGameProps = {
  modeId: "color-storm" | "vocabulary-hunter";
  messages: Messages;
};

type FallingItem = CatchItem & {
  color?: string;
  lane: number;
};

export function CatchGame({ modeId, messages }: CatchGameProps) {
  const common = messages.pages.start.games.common;
  const game =
    modeId === "color-storm"
      ? messages.pages.start.games.colorStorm
      : messages.pages.start.games.vocabularyHunter;
  const lanes = game.lanes;
  const items = game.items as readonly FallingItem[];
  const [cartIndex, setCartIndex] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fallPercent, setFallPercent] = useState(8);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [status, setStatus] = useState<string>(game.help);
  const current = items[currentIndex];
  const cartTarget = lanes[cartIndex]?.id ?? lanes[0].id;
  const cardLeft = `${((current.lane + 0.5) / lanes.length) * 100}%`;
  const cardStyle = useMemo(
    () => (current.color ? ({ "--fall-card-bg": current.color } as CSSProperties) : undefined),
    [current.color]
  );

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setFallPercent((value) => {
        const next = value + 12;
        if (next < 84) {
          return next;
        }

        settleCatch();
        return 8;
      });
    }, 520);

    return () => window.clearInterval(timer);
  }, [cartIndex, currentIndex, isRunning]);

  function settleCatch() {
    const isCaught = current.lane === cartIndex;
    const result = isCaught ? classifyCatch(current, cartTarget) : "wrong";

    if (isCaught && result === "correct") {
      setScore((value) => value + 1);
      setStatus(`${common.correct}: ${current.label}`);
    } else {
      setMisses((value) => value + 1);
      setStatus(`${isCaught ? common.wrong : common.missed}: ${current.label}`);
    }

    setCurrentIndex((value) => (value + 1) % items.length);
  }

  function resetGame() {
    setCartIndex(1);
    setCurrentIndex(0);
    setFallPercent(8);
    setIsRunning(false);
    setScore(0);
    setMisses(0);
    setStatus(game.help);
  }

  return (
    <div className="game-stage game-stage--catch">
      <div className="game-toolbar">
        <p>{game.help}</p>
        <div className="game-actions">
          <button className="mini-button" onClick={() => setIsRunning((value) => !value)} type="button">
            {isRunning ? common.pause : common.start}
          </button>
          <button className="mini-button" onClick={resetGame} type="button">
            {common.reset}
          </button>
        </div>
      </div>

      <div className="catch-field" style={{ "--lane-count": lanes.length } as CSSProperties}>
        {lanes.map((lane) => (
          <div className="catch-lane" key={lane.id}>
            <span>{lane.label}</span>
          </div>
        ))}
        <div
          className={`fall-card${current.color ? " fall-card--color" : ""}`}
          style={{ ...cardStyle, left: cardLeft, top: `${fallPercent}%` }}
        >
          {current.label}
        </div>
        <div className="catch-cart" style={{ gridColumn: cartIndex + 1 }}>
          <span>
            {game.cartLabel}: {lanes[cartIndex]?.label}
          </span>
          <div className="catch-cart__basket" />
        </div>
      </div>

      <div className="game-controls">
        <button className="mini-button" disabled={cartIndex === 0} onClick={() => setCartIndex((value) => value - 1)} type="button">
          {common.left}
        </button>
        <span>{status}</span>
        <button
          className="mini-button"
          disabled={cartIndex === lanes.length - 1}
          onClick={() => setCartIndex((value) => value + 1)}
          type="button"
        >
          {common.right}
        </button>
      </div>

      <div className="score-strip">
        <span>
          {common.correct}: {score}
        </span>
        <span>
          {common.wrong}: {misses}
        </span>
      </div>
    </div>
  );
}
