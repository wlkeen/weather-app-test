import { useTranslation } from 'react-i18next';

interface CitySearchProps {
  value: string;
  onChange: (value: string) => void;
  /** Placeholder for future autocomplete suggestions. */
  suggestions?: string[];
  onSelectSuggestion?: (value: string) => void;
}

/**
 * Custom city autocomplete (no third-party UI kit).
 */
export function CitySearch({
  value,
  onChange,
  suggestions = [],
  onSelectSuggestion,
}: CitySearchProps) {
  const { t } = useTranslation();
  const listId = 'city-suggestions';

  return (
    <section className="city-search" aria-label={t('city.searchAria')}>
      <label htmlFor="city-input">{t('city.label')}</label>
      <input
        id="city-input"
        type="search"
        role="combobox"
        aria-expanded={suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={t('city.placeholder')}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {suggestions.length > 0 && (
        <ul id={listId} className="city-suggestions" role="listbox">
          {suggestions.map((suggestion) => (
            <li key={suggestion} role="option">
              <button type="button" onClick={() => onSelectSuggestion?.(suggestion)}>
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
