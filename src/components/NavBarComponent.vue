<template>
    <b-navbar toggleable="lg" type="dark" variant="info">
        <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
            <b-nav-item-dropdown :text="langToName(currentLanguage)">
                <b-dropdown-item v-for="lang in langList" :key="lang" @click="changeLanguage(lang)">
                    {{langToName(lang)}}
                </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item @click="$router.push('/')">
                {{$t('Home')}}
            </b-nav-item>
            <b-nav-item @click="$router.push('/games')">
                {{$t('GameList')}}
            </b-nav-item>
            <b-nav-item @click="$router.push('/settings')">
                {{$t('Settings')}}
            </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
            <b-button variant="info" @click="openConnectorGames()">
                {{$t('GamesInConnector')}}
            </b-button>
            <b-button variant="info" @click="openUploadMap()">
                {{$t('UploadMap')}}
            </b-button>
            <b-nav-item-dropdown right v-if="client.isLogged()">
                <template v-slot:button-content>
                    <em>{{client.userObj.nickname}}</em>
                </template>
                <b-dropdown-item>{{$t('HostNewGame')}}</b-dropdown-item>
                <b-dropdown-item>{{$t('Logout')}}</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown right v-else>
                <template v-slot:button-content>
                    <em>Login</em>
                </template>
                <b-dropdown-item v-for="option in availableAuthOptions" :key="option[0]" @click="login(option[1])">
                    {{option[0]}}
                </b-dropdown-item>
            </b-nav-item-dropdown>
        </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script lang="ts">
/*
<template slot="start">
            <b-navbar-dropdown :label="langToName(currentLanguage)">
                <b-navbar-item v-for="lang in langList" :key="lang" @click="changeLanguage(lang)">
                    {{langToName(lang)}}
                </b-navbar-item>
            </b-navbar-dropdown>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                {{$t('Home')}}
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/games' }">
                {{$t('GameList')}}
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-info" @click="openConnectorGames()" :disabled="localClient.isConnected() === false">
                        <font-awesome-icon icon="random" style="margin-right: 5px;"/>
                        {{$t('GamesInConnector')}}
                    </a>
                    <a class="button is-info" @click="openUploadMap()">
                        <font-awesome-icon icon="upload" style="margin-right: 5px;"/>
                        {{$t('UploadMap')}}
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
                    {{$t('HostNewGame')}}
                </b-navbar-item>
                <b-navbar-item @click="settings()">
                    {{$t('Settings')}}
                </b-navbar-item>
                <b-navbar-item @click="unlogin()">
                    {{$t('Logout')}}
                </b-navbar-item>
            </b-navbar-dropdown>
        </template> 
        */

import { Component, Prop, Vue } from "vue-property-decorator";
import { Game, Player } from '../models/responses/GameModel';
import {playerColors} from "@/utilities/PlayerColors";
import MapUploadComponent from './MapUploadComponent.vue';
import {availableLanguages, i18n} from '@/I18n/languages';
import client from '@/services/Implementations/ApiClient';
import localClient from '@/services/Implementations/LocalClient';
import { IApiClient } from '../services/Abstractions/IApiClient';
import ILocalClient from '../services/Abstractions/ILocalClient';
import UserAuthModel from '../models/responses/UserAuthModel';
import GameHostComponent from './GameHostComponent.vue';
import GamesInConnectorComponent from './GamesInConnectorComponent.vue';


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
    public localClient: ILocalClient;

    constructor() {
        super();

        this.client = client;
        this.localClient = localClient;

        let userLang = localStorage.getItem('userPrefferedLanguage');
        
        if (userLang === undefined || userLang === null)
            userLang = 'ru';

        this.currentLanguage = userLang;
        this.changeLanguage(this.currentLanguage)

        this.availableAuthOptions.set('Discord', 'https://discordapp.com/oauth2/authorize?client_id=517423360091881484&redirect_uri=https%3A%2F%2Fptr.irinabot.ru%2Fdiscord%2F&response_type=token&scope=identify%20guilds.join')

    }

    openConnectorGames(): void {
        /*this.$buefy.modal.open({
            canCancel: ['outside'],
            parent: this,
            component: GamesInConnectorComponent,
            hasModalCard: true,
            customClass: 'game-in-connector-wrapper',
            trapFocus: true
        })*/
    }

    hostGame(): void {
        /*this.$buefy.modal.open({
            canCancel: [''],
            parent: this,
            component: GameHostComponent,
            hasModalCard: true,
            customClass: 'game-host-wrapper',
            trapFocus: true
        })*/
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
        /*this.$buefy.modal.open({
            canCancel: [''],
            parent: this,
            component: MapUploadComponent,
            hasModalCard: true,
            customClass: 'custom-class custom-class-2',
            trapFocus: true
        })*/
    }
}
</script>

<style scoped lang="scss">
.shift-down {
    padding-top: 7px;
}
</style>