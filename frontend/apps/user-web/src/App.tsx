import { ApiClient, type AuthenticatedUser } from "@sheepparter/api-client";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  localeOptions,
  localeStorageKey,
  messagesByLocale,
  resolveLocale,
  type AuthStatus,
  type Locale,
  type Messages,
  type PageKey
} from "./i18n";
import { StartPage } from "./StartPage";

type SettingsModel = {
  challengeMode: boolean;
  dailyGoal: number;
  locale: Locale;
  pinyinHints: boolean;
  setChallengeMode: (value: boolean) => void;
  setDailyGoal: (value: number) => void;
  setLocale: (value: Locale) => void;
  setPinyinHints: (value: boolean) => void;
  setSoundEffects: (value: boolean) => void;
  soundEffects: boolean;
};

function readInitialLocale() {
  try {
    return resolveLocale(localStorage.getItem(localeStorageKey));
  } catch {
    return resolveLocale(null);
  }
}

function storeLocale(value: Locale) {
  try {
    localStorage.setItem(localeStorageKey, value);
  } catch {
    return;
  }
}

export function App() {
  const api = useMemo(() => new ApiClient(import.meta.env.VITE_API_BASE_URL), []);
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);
  const [apiStatus, setApiStatus] = useState("checking");
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [email, setEmail] = useState("demo@sheepparter.test");
  const [password, setPassword] = useState("LearnChinese123");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePage, setActivePage] = useState<PageKey>("home");
  const [dailyGoal, setDailyGoal] = useState(20);
  const [pinyinHints, setPinyinHints] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [challengeMode, setChallengeMode] = useState(false);
  const messages = messagesByLocale[locale];

  useEffect(() => {
    let isAlive = true;

    api
      .health()
      .then((health) => {
        if (isAlive) {
          setApiStatus(health.status);
        }
      })
      .catch(() => {
        if (isAlive) {
          setApiStatus("offline");
        }
      });

    api
      .me()
      .then((response) => {
        if (!isAlive) {
          return;
        }
        setUser(response.user);
        setAuthStatus("authenticated");
      })
      .catch(() => {
        if (!isAlive) {
          return;
        }
        setUser(null);
        setAuthStatus("anonymous");
      });

    return () => {
      isAlive = false;
    };
  }, [api]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthError("");

    try {
      const response = await api.login({ email, password });
      setUser(response.user);
      setActivePage("home");
      setAuthStatus("authenticated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setAuthError(
        message.includes("Failed to fetch") ? messages.auth.apiUnavailable : messages.auth.invalidCredentials
      );
      setAuthStatus("anonymous");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    await api.logout();
    setUser(null);
    setActivePage("home");
    setAuthStatus("anonymous");
  }

  function setLocale(value: Locale) {
    setLocaleState(value);
    storeLocale(value);
  }

  if (authStatus === "checking") {
    return (
      <main className="auth-screen neon-surface">
        <section className="auth-card auth-card--loading" aria-live="polite">
          <p className="section-kicker">{messages.auth.sessionEyebrow}</p>
          <h1>{messages.auth.checkingAccess}</h1>
        </section>
      </main>
    );
  }

  if (authStatus === "anonymous") {
    return (
      <main className="auth-screen neon-surface">
        <section className="auth-card neon-panel neon-panel--orange" aria-label={messages.shell.loginForm}>
          <form className="login-form neon-panel neon-panel--orange" onSubmit={handleLogin}>
            <label>
              <span>{messages.auth.emailLabel}</span>
              <input
                autoComplete="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
              <small>{messages.auth.emailHelp}</small>
            </label>

            <label>
              <span>{messages.auth.passwordLabel}</span>
              <input
                autoComplete="current-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
              <small>{messages.auth.passwordHelp}</small>
            </label>

            {authError ? (
              <p className="form-error" role="alert">
                {authError}
              </p>
            ) : null}

            <button className="neon-button neon-button--orange" data-testid="login-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? messages.auth.submitting : messages.auth.submit}
            </button>
          </form>
        </section>

        <aside className="signal-card neon-panel neon-panel--green" aria-labelledby="login-title">
          <div className="auth-copy">
            <p className="section-kicker">{messages.auth.eyebrow}</p>
            <h1 id="login-title">{messages.auth.title}</h1>
            <p>{messages.auth.subtitle}</p>
          </div>
          <div className="signal-card__footer">
            <p className="section-kicker">[ SIGNAL / 信号 ]</p>
            <h2>{messages.auth.signalTitle}</h2>
            <p>{messages.auth.signalBody}</p>
          </div>
        </aside>
      </main>
    );
  }

  return (
    <main className={`app-frame neon-surface neon-surface--${activePage}`}>
      <header className="top-nav">
        <div className="brand-lockup">
          <span className="brand-mark">SP</span>
          <div>
            <p>{messages.shell.product}</p>
            <span>{messages.shell.subtitle}</span>
          </div>
        </div>

        <nav className="nav-tabs" aria-label={messages.shell.navLabel}>
          {messages.nav.map((item) => (
            <button
              className={`nav-tab nav-tab--${item.tone}${activePage === item.key ? " is-active" : ""}`}
              data-testid={`nav-${item.key}`}
              key={item.key}
              onClick={() => setActivePage(item.key)}
              type="button"
            >
              <span>{item.label}</span>
              <small>{item.caption}</small>
            </button>
          ))}
        </nav>

        <div className="session-strip">
          <span className={`status-dot ${apiStatus === "ok" ? "status-dot--ok" : "status-dot--warn"}`} />
          <span>
            {messages.shell.api}: {apiStatus}
          </span>
          <button className="text-button" onClick={handleLogout} type="button">
            {messages.shell.logout}
          </button>
        </div>
      </header>

      <section className="page-shell">{renderPage(activePage, user, handleLogout, settingsModel(), messages)}</section>
    </main>
  );

  function settingsModel() {
    return {
      challengeMode,
      dailyGoal,
      locale,
      pinyinHints,
      setChallengeMode,
      setDailyGoal,
      setLocale,
      setPinyinHints,
      setSoundEffects,
      soundEffects
    };
  }
}

function renderPage(
  activePage: PageKey,
  user: AuthenticatedUser | null,
  onLogout: () => void,
  settings: SettingsModel,
  messages: Messages
) {
  switch (activePage) {
    case "home":
      return <HomePage messages={messages} />;
    case "start":
      return <StartPage messages={messages} />;
    case "settings":
      return <SettingsPage messages={messages} settings={settings} />;
    case "profile":
      return <ProfilePage messages={messages} onLogout={onLogout} user={user} />;
  }
}

function HomePage({ messages }: { messages: Messages }) {
  return (
    <article className="page-grid" data-testid="page-home">
      <section className="hero-panel neon-panel neon-panel--cyan">
        <p className="section-kicker">{messages.pages.home.eyebrow}</p>
        <h1>{messages.pages.home.title}</h1>
        <p>{messages.pages.home.description}</p>
      </section>

      <section className="stats-grid" aria-label="Learning stats">
        {messages.pages.home.cards.map((card) => (
          <div className={`stat-card neon-panel neon-panel--${card.tone}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.detail}</small>
          </div>
        ))}
      </section>

      <section className="mission-panel neon-panel neon-panel--green">
        <p className="section-kicker">{messages.pages.home.queueEyebrow}</p>
        <div className="mission-list">
          {messages.pages.home.missions.map((mission) => (
            <div className="mission-row" key={mission.title}>
              <div>
                <strong>{mission.title}</strong>
                <span>{mission.meta}</span>
              </div>
              <data>{mission.status}</data>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

function SettingsPage({ messages, settings }: { messages: Messages; settings: SettingsModel }) {
  const [minDailyGoal, maxDailyGoal, goalStep] = [5, 50, 5];
  const updateDailyGoal = (value: number) => {
    settings.setDailyGoal(Math.min(maxDailyGoal, Math.max(minDailyGoal, value)));
  };

  return (
    <article className="page-grid" data-testid="page-settings">
      <section className="hero-panel neon-panel neon-panel--green">
        <p className="section-kicker">{messages.pages.settings.eyebrow}</p>
        <h1>{messages.pages.settings.title}</h1>
        <p>{messages.pages.settings.description}</p>
      </section>

      <section className="settings-panel neon-panel neon-panel--cyan">
        <div className="range-setting">
          <div className="range-setting__header">
            <label htmlFor="daily-goal-slider">{messages.pages.settings.dailyGoal}</label>
            <output htmlFor="daily-goal-slider">
              {settings.dailyGoal} {messages.pages.settings.promptUnit}
            </output>
          </div>
          <div className="range-controls">
            <button
              aria-label={messages.pages.settings.decreaseDailyGoal}
              className="step-button"
              data-testid="daily-goal-decrease"
              disabled={settings.dailyGoal <= minDailyGoal}
              onClick={() => updateDailyGoal(settings.dailyGoal - goalStep)}
              type="button"
            >
              -
            </button>
            <input
              aria-label={messages.pages.settings.dailyGoal}
              data-testid="daily-goal-slider"
              id="daily-goal-slider"
              max={maxDailyGoal}
              min={minDailyGoal}
              onChange={(event) => updateDailyGoal(Number(event.target.value))}
              step={goalStep}
              type="range"
              value={settings.dailyGoal}
            />
            <button
              aria-label={messages.pages.settings.increaseDailyGoal}
              className="step-button"
              data-testid="daily-goal-increase"
              disabled={settings.dailyGoal >= maxDailyGoal}
              onClick={() => updateDailyGoal(settings.dailyGoal + goalStep)}
              type="button"
            >
              +
            </button>
          </div>
        </div>

        <div className="language-setting">
          <span>{messages.pages.settings.interfaceLanguage}</span>
          <div className="language-options">
            {localeOptions.map((option) => (
              <button
                aria-pressed={settings.locale === option.value}
                className={`language-option ${settings.locale === option.value ? "is-active" : ""}`}
                data-testid={`locale-${option.value}`}
                key={option.value}
                onClick={() => settings.setLocale(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow
          checked={settings.pinyinHints}
          label={messages.pages.settings.pinyinHints}
          messages={messages}
          onChange={settings.setPinyinHints}
          testId="toggle-pinyin-hints"
        />
        <ToggleRow
          checked={settings.soundEffects}
          label={messages.pages.settings.soundEffects}
          messages={messages}
          onChange={settings.setSoundEffects}
          testId="toggle-sound-effects"
        />
        <ToggleRow
          checked={settings.challengeMode}
          label={messages.pages.settings.challengeMode}
          messages={messages}
          onChange={settings.setChallengeMode}
          testId="toggle-challenge-mode"
        />
      </section>
    </article>
  );
}

function ToggleRow({ checked, label, messages, onChange, testId }: {
  checked: boolean;
  label: string;
  messages: Messages;
  onChange: (value: boolean) => void;
  testId: string;
}) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <button
        aria-pressed={checked}
        className={`toggle-switch ${checked ? "is-on" : ""}`}
        data-testid={testId}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span>{checked ? messages.pages.settings.enabled : messages.pages.settings.disabled}</span>
      </button>
    </label>
  );
}

function ProfilePage({
  messages,
  onLogout,
  user
}: {
  messages: Messages;
  onLogout: () => void;
  user: AuthenticatedUser | null;
}) {
  return (
    <article className="page-grid" data-testid="page-profile">
      <section className="hero-panel neon-panel neon-panel--cyan">
        <p className="section-kicker">{messages.pages.profile.eyebrow}</p>
        <h1>{messages.pages.profile.title}</h1>
        <p>{messages.pages.profile.description}</p>
      </section>

      <section className="profile-grid">
        <div className="profile-card neon-panel neon-panel--green">
          <span>{messages.pages.profile.account}</span>
          <strong>{user?.displayName ?? messages.pages.profile.fallbackName}</strong>
          <small>{user?.email ?? "demo@sheepparter.test"}</small>
        </div>
        <div className="profile-card neon-panel neon-panel--orange">
          <span>{messages.pages.profile.streak}</span>
          <strong>{messages.pages.profile.streakValue}</strong>
          <small>{messages.pages.profile.streakHint}</small>
        </div>
        <div className="profile-card neon-panel neon-panel--cyan">
          <span>{messages.pages.profile.mode}</span>
          <strong>{messages.pages.profile.modeValue}</strong>
          <button className="neon-button neon-button--green" onClick={onLogout} type="button">
            {messages.pages.profile.logout}
          </button>
        </div>
      </section>
    </article>
  );
}
