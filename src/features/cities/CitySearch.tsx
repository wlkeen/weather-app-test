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
  const listId = 'city-suggestions';

  return (
    <section className="city-search" aria-label="City search">
      <label htmlFor="city-input">City</label>
      <input
        id="city-input"
        type="search"
        role="combobox"
        aria-expanded={suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Start typing a city name…"
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
