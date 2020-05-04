import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

export const availableLanguages = ["en", "ru"];

const translations = {
    'en': {
        GameList: 'To game List',
        LangChange: 'Change Language',
        GamesInConnector: 'Games in connector',
        Home: 'Main Page',
        UploadMap: 'Upload Map',
        HostNewGame: 'Host new game',
        Settings: 'Settings',
        Logout: 'Logout'
    },
    'ru': {
        GameList: 'К списку игр',
        LangChange: 'Сменить язык',
        GamesInConnector: 'Игры в коннекторе',
        Home: 'На главную',
        UploadMap: 'Загрузить карту',
        HostNewGame: 'Новая игра',
        Settings: 'Настройки',
        Logout: 'Выйти'
    }
};

export const i18n = new VueI18n({ 
    locale: 'ru', 
    fallbackLocale: 'en',
    messages: translations,
});