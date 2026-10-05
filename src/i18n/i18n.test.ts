import { describe, expect, it } from 'vitest';
import i18n, { getIntlLocale, getOwmLang } from './index';

describe('i18n', () => {
  it('translates English and Czech catalogues', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t('app.title')).toBe('Weather Forecast');

    await i18n.changeLanguage('cz');
    expect(i18n.t('app.title')).toBe('Předpověď počasí');
  });

  it('maps app language to Intl and OpenWeatherMap tags', () => {
    expect(getIntlLocale('cz')).toBe('cs');
    expect(getIntlLocale('en')).toBe('en');
    expect(getOwmLang('cz')).toBe('cz');
    expect(getOwmLang('en')).toBe('en');
  });
});
