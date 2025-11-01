import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';

i18next.use(I18nextBrowserLanguageDetector).use(initReactI18next).init({
   debug: true,
   resources: {
    en: {
        translation: enTranslations
    },
    ru: {
        translation: ruTranslations
    },
    
    
   }
})

export default i18next