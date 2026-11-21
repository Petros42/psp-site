import type { Language } from '../types';

interface TopBarProps {
  menuLabel: string;
  currentLang: Language;
  onOpenDrawer: () => void;
  onSelectLanguage: (lang: Language) => void;
}

export function TopBar({
  menuLabel,
  currentLang,
  onOpenDrawer,
  onSelectLanguage,
}: TopBarProps) {
  return (
    <header className="top-bar">
      <button
        type="button"
        className="nav-trigger"
        id="menuBtn"
        aria-label="Open menu"
        onClick={onOpenDrawer}
      >
        <span className="hamburger-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span id="menuLabel">{menuLabel}</span>
      </button>

      <nav className="lang-switcher" aria-label="Language selector">
        <button
          type="button"
          className={`lang-btn${currentLang === 'el' ? ' active' : ''}`}
          data-lang="el"
          onClick={() => onSelectLanguage('el')}
        >
          ΕΛ
        </button>
        <span className="lang-sep">|</span>
        <button
          type="button"
          className={`lang-btn${currentLang === 'en' ? ' active' : ''}`}
          data-lang="en"
          onClick={() => onSelectLanguage('en')}
        >
          EN
        </button>
        <span className="lang-sep">|</span>
        <button
          type="button"
          className={`lang-btn${currentLang === 'ru' ? ' active' : ''}`}
          data-lang="ru"
          onClick={() => onSelectLanguage('ru')}
        >
          RU
        </button>
      </nav>
    </header>
  );
}
