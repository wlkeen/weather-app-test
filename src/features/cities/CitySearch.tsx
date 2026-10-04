interface CitySearchProps {
  value: string;
  onChange: (value: string) => void;
  /** Placeholder for future autocomplete suggestions. */
  suggestions?: string[];
  onSelectSuggestion?: (value: string) => void;
}

/**
 * City search input shell. Autocomplete wiring lands in a later commit.
 */
export function CitySearch({
  value,
  onChange,
  suggestions = [],
  onSelectSuggestion,
}: CitySearchProps) {
  const listId = 'city-suggestions';

  return (
    <section aria-label="City search">
      <label htmlFor="city-input">City</label>
      <input
        id="city-input"
        type="text"
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
        <ul id={listId} role="listbox">
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
