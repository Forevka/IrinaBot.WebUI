<template>
    <b-navbar>
        <template slot="start">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                Home
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/games' }">
                Game List
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-light" @click="login()">
                        Log in
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Game, Player } from '../models/responses/GameModel';
import {playerColors} from "@/utilities/PlayerColors";
//import DiscordOauth2 from 'discord-oauth2';

@Component({
  components: {
  }
})
export default class NavBarComponent extends Vue {
    //public discord: DiscordOauth2 = new DiscordOauth2();

    constructor() {
        super();
    }

    login() {
        console.log('login')
        window.open('https://discordapp.com/oauth2/authorize?client_id=517423360091881484&redirect_uri=https%3A%2F%2Firinabo.ru%2Fdiscord%2F&response_type=token&scope=identify%20guilds.join')
    }
}
</script>

<style scoped lang="scss">

</style>