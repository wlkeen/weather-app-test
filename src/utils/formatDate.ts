/**
 * Formats a Unix timestamp (seconds) using the browser's current locale.
 */
export function formatForecastDate(dateUnix: number, locale: string = navigator.language): string {
    return new Intl.DateTimeFormat(locale, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(dateUnix * 1000));
}