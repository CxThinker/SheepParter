import { type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";

import type { Messages } from "../i18n";
import { resolveWordLinkStep } from "./gameLogic";

export function DragonGame({ messages }: { messages: Messages }) {
  const common = messages.pages.start.games.common;
  const game = messages.pages.start.games.dragon;
  const boardRef = useRef<HTMLDivElement | null>(null);
  const rejectedTouchIds = useRef<Set<string>>(new Set());
  const [linkedIds, setLinkedIds] = useState<string[]>([]);
  const [isLinking, setIsLinking] = useState(false);
  const [livePointer, setLivePointer] = useState<{ x: number; y: number } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState<string>(game.help);
  const nextStep = game.steps[linkedIds.length];
  const tileById = useMemo(
    () => new Map<string, (typeof game.tiles)[number]>(game.tiles.map((tile) => [tile.id, tile])),
    [game.tiles]
  );

  useEffect(() => {
    if (!isLinking) {
      return;
    }

    const handleWindowPointerMove = (event: PointerEvent) => {
      updateLivePointerFromClient(event.clientX, event.clientY);
      linkTileAtPoint(event.clientX, event.clientY);
    };
    const handleWindowPointerUp = (event: PointerEvent) => {
      linkTileAtPoint(event.clientX, event.clientY);
      stopLinking();
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", stopLinking);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", stopLinking);
    };
  }, [isLinking]);

  function linkTouchedTile(id: string) {
    setLinkedIds((current) => {
      if (current.includes(id)) {
        return current;
      }

      const result = resolveWordLinkStep(game.steps, current, id);
      if (result.isCorrect) {
        setStatus(result.isComplete ? common.complete : common.correct);
        setIsLinking(!result.isComplete);
        return result.nextLinkedIds;
      }

      if (!rejectedTouchIds.current.has(id)) {
        rejectedTouchIds.current.add(id);
        setMistakes((value) => value + 1);
        setStatus(common.wrong);
      }

      return current;
    });
  }

  function handleTilePointerDown(id: string, event: ReactPointerEvent<HTMLButtonElement>) {
    if (id !== nextStep?.id) {
      setMistakes((value) => value + 1);
      setStatus(game.dragHint);
      return;
    }

    rejectedTouchIds.current = new Set();
    setIsLinking(true);
    updateLivePointerFromClient(event.clientX, event.clientY);
    linkTouchedTile(id);
  }

  function linkTileAtPoint(clientX: number, clientY: number) {
    const element = document.elementFromPoint(clientX, clientY);
    const wordCard = element?.closest<HTMLElement>("[data-word-id]");
    const touchedId = wordCard?.dataset.wordId;
    if (touchedId) {
      linkTouchedTile(touchedId);
    }
  }

  function stopLinking() {
    setIsLinking(false);
    setLivePointer(null);
    rejectedTouchIds.current = new Set();
  }

  function updateLivePointerFromClient(clientX: number, clientY: number) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    setLivePointer({ x: clientX - rect.left, y: clientY - rect.top });
  }

  function resetGame() {
    setLinkedIds([]);
    setIsLinking(false);
    setLivePointer(null);
    setMistakes(0);
    setStatus(game.help);
  }

  return (
    <div className="game-stage">
      <div className="game-toolbar">
        <p>{game.help}</p>
        <button className="mini-button" onClick={resetGame} type="button">
          {common.reset}
        </button>
      </div>

      <section className="dragon-sentence">
        <span>{game.sentence}</span>
        <small>
          {game.next}: {nextStep?.label ?? common.complete}
        </small>
      </section>

      <div
        className={`dragon-board${isLinking ? " is-linking" : ""}`}
        ref={boardRef}
      >
        <svg className="word-link-lines" aria-hidden="true">
          {linkedIds.slice(1).map((id, index) => {
            const from = tileById.get(linkedIds[index]);
            const to = tileById.get(id);
            return from && to ? <WordLinkLine from={from.cell} key={`${from.id}-${id}`} to={to.cell} /> : null;
          })}
          {isLinking && livePointer && linkedIds.length > 0 ? (
            <WordLinkLine from={tileById.get(linkedIds[linkedIds.length - 1])?.cell} toPoint={livePointer} />
          ) : null}
        </svg>
        {game.tiles.map((tile) => (
          <button
            className={[
              "dragon-tile",
              linkedIds.includes(tile.id) ? "is-linked" : "",
              nextStep?.id === tile.id ? "is-next" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            data-word-id={tile.id}
            disabled={linkedIds.includes(tile.id)}
            key={tile.id}
            onPointerDown={(event) => handleTilePointerDown(tile.id, event)}
            style={{ gridArea: cellToArea(tile.cell) }}
            type="button"
          >
            {tile.label}
          </button>
        ))}
      </div>

      <div className="score-strip">
        <span>{status}</span>
        <span>
          {game.path}: {linkedIds.length}/{game.steps.length}
        </span>
        <span>
          {common.wrong}: {mistakes}
        </span>
      </div>
    </div>
  );
}

function WordLinkLine({
  from,
  to,
  toPoint
}: {
  from?: number;
  to?: number;
  toPoint?: { x: number; y: number };
}) {
  if (from === undefined) {
    return null;
  }

  if (toPoint) {
    const start = cellToPoint(from);
    return (
      <line
        className="word-link-line"
        x1={`${start.x}%`}
        x2={toPoint.x}
        y1={`${start.y}%`}
        y2={toPoint.y}
      />
    );
  }

  if (to === undefined) {
    return null;
  }

  const start = cellToPoint(from);
  const end = cellToPoint(to);
  return (
    <line
      className="word-link-line"
      x1={`${start.x}%`}
      x2={`${end.x}%`}
      y1={`${start.y}%`}
      y2={`${end.y}%`}
    />
  );
}

function cellToArea(cell: number) {
  const row = Math.floor(cell / 4) + 1;
  const column = (cell % 4) + 1;
  return `${row} / ${column}`;
}

function cellToPoint(cell: number) {
  const row = Math.floor(cell / 4);
  const column = cell % 4;
  return { x: ((column + 0.5) / 4) * 100, y: ((row + 0.5) / 4) * 100 };
}
