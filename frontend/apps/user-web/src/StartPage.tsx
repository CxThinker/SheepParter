import { useMemo, useState } from "react";

import { CatchGame } from "./gameplay/CatchGame";
import { DragonGame } from "./gameplay/DragonGame";
import { RhythmGame } from "./gameplay/RhythmGame";
import type { Messages } from "./i18n";

export function StartPage({ messages }: { messages: Messages }) {
  const modes = messages.pages.start.modes;
  const [activeModeId, setActiveModeId] = useState<string>(modes[0].id);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const activeMode = useMemo(
    () => modes.find((mode) => mode.id === activeModeId) ?? modes[0],
    [activeModeId, modes]
  );

  return (
    <article
      className={`start-workbench${isCollapsed ? " is-collapsed" : ""}`}
      data-testid="page-start"
    >
      <aside className="mode-rail neon-panel neon-panel--orange" aria-label={messages.pages.start.selectorLabel}>
        <div className="mode-rail__header">
          {!isCollapsed && (
            <div>
              <p className="section-kicker">{messages.pages.start.eyebrow}</p>
              <h1>{messages.pages.start.title}</h1>
            </div>
          )}
          <button
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? messages.pages.start.expandLabel : messages.pages.start.collapseLabel}
            className="mode-rail__toggle"
            onClick={() => setIsCollapsed((value) => !value)}
            type="button"
          >
            {isCollapsed ? ">" : "<"}
          </button>
        </div>

        <div className="mode-list">
          {modes.map((mode) => (
            <button
              aria-pressed={activeMode.id === mode.id}
              className={`mode-card${activeMode.id === mode.id ? " is-active" : ""}`}
              data-testid={`start-mode-${mode.id}`}
              key={mode.id}
              onClick={() => setActiveModeId(mode.id)}
              type="button"
            >
              <span className="mode-card__mark">{mode.mark}</span>
              {!isCollapsed && <span className="mode-card__label">{mode.label}</span>}
            </button>
          ))}
        </div>
      </aside>

      <section className="start-stage neon-panel neon-panel--orange" aria-live="polite">
        <p className="section-kicker">{messages.pages.start.stageEyebrow}</p>
        <h1>{activeMode.label}</h1>
        {renderActiveGame(activeMode.id, messages)}
      </section>
    </article>
  );
}

function renderActiveGame(modeId: string, messages: Messages) {
  switch (modeId) {
    case "vocabulary-hunter":
      return <CatchGame messages={messages} modeId="vocabulary-hunter" />;
    case "color-storm":
      return <CatchGame messages={messages} modeId="color-storm" />;
    case "finger-rhythm":
      return <RhythmGame messages={messages} />;
    case "greedy-dragon":
      return <DragonGame messages={messages} />;
    default:
      return <p>{messages.pages.start.emptyBody}</p>;
  }
}
