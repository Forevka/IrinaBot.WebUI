<template>
    <div class="hosted-game-wrapper" style="min-width: 100%; width: 100%;">
        <form action="">
            <div class="modal-card" style="min-width: 100%; width: 100%;">
                <header class="modal-card-head">
                    <p class="modal-card-title">You game</p>
                </header>
                <section class="modal-card-body">
                    {{game.description}}
                </section>
                <footer class="modal-card-foot">
                    <button v-if="game.password !== ''" class="button is-primary" type="button" @click="copyPassword()">Copy password</button>
                    <button class="button" type="button" @click="stop()">Ok</button>
                </footer>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {playerColors} from "@/utilities/PlayerColors";
import MapUploadComponent from './MapUploadComponent.vue';
import {availableLanguages, i18n} from '@/I18n/languages';
import client from '@/services/Implementations/ApiClient';
import { IApiClient } from '@/services/Abstractions/IApiClient';
import UserAuthModel from '@/models/responses/UserAuthModel';
import MapLoader from '@/services/Implementations/MapLoader';
import MapModel from '@/models/responses/MapModel';
import { IDefaultContextHelper } from '@/services/Abstractions/IDefaultContextHelper';
import DefaultContextHelper from '@/services/Implementations/DefaultContextHelper';
import CreateGameModel from '@/models/responses/CreateGameModel';


@Component({
  components: {
  }
})
export default class HostedGameComponent extends Vue {
    public client: IApiClient;
    public defaultHelper: IDefaultContextHelper = new DefaultContextHelper();
    @Prop() game!: CreateGameModel;

    constructor() {
        super();

        this.client = client;
    }

    copyPassword() {

    }

    stop() {
        // @ts-ignore
        this.$parent.close()
    }
}
</script>

<style scoped lang="scss">

</style>