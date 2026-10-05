import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import cz from './locales/cz.json';
import en from './locales/en.json';

/**
 * Maps app locales to Intl / OpenWeatherMap language tags.
 * Browser `cs*` is normalized to our `cz` catalogue via `convertDetectedLanguage`.
 */
export function getIntlLocale(language: string = i18n.language): string {
    return language.startsWith('cz') || language.startsWith('cs') ? 'cs' : 'en';
}

export function getOwmLang(language: string = i18n.language): string {
    return language.startsWith('cz') || language.startsWith('cs') ? 'cz' : 'en';
}

/** Translate known error keys; otherwise return the raw message. */
export function translateMessage(
    message: string | null | undefined,
    fallbackKey = 'forecast.failed',
): string {
    if (!message) {
        return i18n.t(fallbackKey);
    }
    if (message.startsWith('errors.') || i18n.exists(message)) {
        return i18n.t(message);
    }
    return message;
}

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            cz: { translation: cz },
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'cz'],
        nonExplicitSupportedLngs: true,
        // Treat browser Czech (`cs`, `cs-CZ`) as our `cz` catalogue.
        load: 'languageOnly',
        detection: {
            // Browser locales first; explicit switcher choice is remembered in localStorage.
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'weather-app-locale',
            convertDetectedLanguage: (lng) => {
                const normalized = lng.toLowerCase();
                if (normalized === 'cs' || normalized.startsWith('cs-')) {
                    return 'cz';
                }
                if (normalized === 'cz' || normalized.startsWith('cz-')) {
                    return 'cz';
                }
                return 'en';
            },
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
