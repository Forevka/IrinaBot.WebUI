import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

export const availableLanguages = ["en", "ru"];

const translations = {
    'en': {
        GameList: 'Game List',
        LangChange: 'Change Language',
    },
    'ru': {
        GameList: 'Список игр',
        LangChange: 'Сменить язык',
    }
};

export const i18n = new VueI18n({ 
    locale: 'ru', 
    fallbackLocale: 'en',
    messages: translations,
});