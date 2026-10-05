import { useTranslation } from 'react-i18next';

const OPTIONS = ['en', 'cz'] as const;

/**
 * Compact EN / CZ language toggle using react-i18next.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const active = i18n.resolvedLanguage === 'cz' ? 'cz' : 'en';

  return (
    <div className="language-switcher" role="group" aria-label={t('app.language')}>
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={active === option ? 'is-active' : undefined}
          aria-pressed={active === option}
          onClick={() => {
            void i18n.changeLanguage(option);
          }}
        >
          {option === 'en' ? t('app.langEn') : t('app.langCz')}
        </button>
      ))}
    </div>
  );
}
