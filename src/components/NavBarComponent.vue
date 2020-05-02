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
                    <a class="button is-info" icon="home" @click="openUploadMap()">
                        <font-awesome-icon icon="upload" style="margin-right: 5px;"/>
                        Загрузить карту
                    </a>
                </div>
            </b-navbar-item>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-primary" @click="login()">
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
import MapUploadComponent from './MapUploadComponent.vue';

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
        window.open('')
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

</style>