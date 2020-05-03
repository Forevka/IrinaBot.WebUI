<template>
    <b-navbar>
        <template slot="start">
            <b-navbar-dropdown :label="langToName(currentLanguage)">
                <b-navbar-item v-for="lang in langList" :key="lang" @click="changeLanguage(lang)">
                    {{langToName(lang)}}
                </b-navbar-item>
            </b-navbar-dropdown>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                Home
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/games' }">
                {{$t('GameList')}}
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-info" icon="home" @click="openUploadMap()">
                        <font-awesome-icon icon="upload" style="margin-right: 5px;"/>
                        Загрузить карту
                    </a>
                </div>
            </b-navbar-item>
            <b-navbar-dropdown label="Login" right v-if="!client.isLogged()">
                <b-navbar-item v-for="option in availableAuthOptions" :key="option[0]" @click="login(option[1])">
                    {{option[0]}}
                </b-navbar-item>
            </b-navbar-dropdown>
            <b-navbar-dropdown :label="client.userObj.nickname" right v-else>
                <b-navbar-item @click="hostGame()">
                    Захостить игру
                </b-navbar-item>
                <b-navbar-item @click="settings()">
                    Настройки
                </b-navbar-item>
                <b-navbar-item @click="unlogin()">
                    Выйти
                </b-navbar-item>
            </b-navbar-dropdown>
        </template>
    </b-navbar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Game, Player } from '../models/responses/GameModel';
import {playerColors} from "@/utilities/PlayerColors";
import MapUploadComponent from './MapUploadComponent.vue';
import {availableLanguages, i18n} from '@/I18n/languages';
import client from '@/services/Implementations/ApiClient';
import { IApiClient } from '../services/Abstractions/IApiClient';
import UserAuthModel from '../models/responses/UserAuthModel';
import GameHostComponent from './GameHostComponent.vue';


@Component({
  components: {
  }
})
export default class NavBarComponent extends Vue {
    public availableAuthOptions: Map<string, string> = new Map<string, string>()
    public availableGameOptions: Map<string, Function> = new Map<string, Function>()

    public langList: string[] = availableLanguages;
    public currentLanguage: string = 'Русский';

    public currentUser: UserAuthModel;
    public client: IApiClient;

    constructor() {
        super();

        this.client = client;

        let userLang = localStorage.getItem('userPrefferedLanguage');
        
        if (userLang === undefined || userLang === null)
            userLang = 'ru';

        this.currentLanguage = userLang;
        this.changeLanguage(this.currentLanguage)

        this.availableAuthOptions.set('Discord', 'https://discordapp.com/oauth2/authorize?client_id=517423360091881484&redirect_uri=https%3A%2F%2Fptr.irinabot.ru%2Fdiscord%2F&response_type=token&scope=identify%20guilds.join')

    }

    hostGame(): void {
        this.$buefy.modal.open({
            canCancel: [''],
            parent: this,
            component: GameHostComponent,
            hasModalCard: true,
            customClass: 'game-host-wrapper',
            trapFocus: true
        })
    }

    unlogin(): void {
        localStorage.removeItem('accessToken_Discord');
        this.$router.push('/');
    }
    
    settings(): void {

    }

    langToName(lang: string): string {
        let langDict = {
            'ru': 'Русский',
            'en': 'English',
        }

        return langDict[lang];
    }

    storeChosenLanguage() {
        localStorage.setItem('userPrefferedLanguage', this.currentLanguage)
    }

    changeLanguage(lang: string){
        i18n.locale = lang;
        this.currentLanguage = lang;
        this.storeChosenLanguage()
    }

    login(link: string) {
        window.open(link)
    }

    openUploadMap() {
        this.$buefy.modal.open({
            canCancel: [''],
            parent: this,
            component: MapUploadComponent,
            hasModalCard: true,
            customClass: 'custom-class custom-class-2',
            trapFocus: true
        })
    }
}
</script>

<style scoped lang="scss">
.shift-down {
    padding-top: 7px;
}
</style>