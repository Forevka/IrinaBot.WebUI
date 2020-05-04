<template>
  <div class="game-in-connector-wrapper" style="min-width: 100%; width: 100%;">
    <form action>
      <div class="modal-card" style="min-width: 100%; width: 100%;">
        <header class="modal-card-head">
          <p class="modal-card-title">Games in connector</p>
        </header>
        <section class="modal-card-body">
            <b-table
                v-on:select="clicked"
                :paginated="true"
                :pagination-simple="false"
                :pagination-position="'bottom'"
                :current-page="1"
                :per-page="10"
                :data="localGames().gameList"
                :bordered="true"
                :striped="true"
                :narrowed="true"
                :selected.sync="selected"
                :sort-icon="sortIcon"
                :sort-icon-size="sortIconSize"
                default-sort="realPlayersCount"
                default-sort-direction="desc">
                <template slot-scope="props">
                    <b-table-column width="30%" field="gameName" label="Имя игры" sortable>
                        <b-input
                        slot="subheading"
                        placeholder="Поиск..."
                        v-model="gameNameValue"
                        icon="magnify"
                        size="is-small" />
                        {{ props.row.gameName }}
                    </b-table-column>

                    <b-table-column width="5%" field="play" centered>
                        <b-button icon-left="gamepad" type="is-danger" @click="deleteFromLocal(props.row)"> 
                            Delete
                        </b-button>
                    </b-table-column>
                </template>
                <template slot="empty">
                    <section class="section">
                        <div class="content has-text-grey has-text-centered">
                            <p>
                                <b-icon
                                    icon="emoticon-sad"
                                    size="is-large">
                                </b-icon>
                            </p>
                            <p>Ничего нету</p>
                        </div>
                    </section>
                </template>
            </b-table>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" type="button" @click="deleteAll()">
            Delete all games
          </button>
          <button class="button" type="button" @click="stop()">Ok</button>
        </footer>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import client from "@/services/Implementations/ApiClient";
import localClient from "@/services/Implementations/LocalClient";

import eventBus from "@/utilities/EventBus";
import DataBuffer from "@/utilities/DataBuffer";
import { DefaultContextHeaders } from "@/models/enum/DefaultContextHeaders";
import { IApiClient } from "@/services/Abstractions/IApiClient";
import ILocalClient from "@/services/Abstractions/ILocalClient";
import DefaultContextHelper from "@/services/Implementations/DefaultContextHelper";
import NavBarComponent from "@/components/NavBarComponent.vue";

import IGlobalContextHelper from "@/services/Abstractions/IGlobalContextHelper";
import { IDefaultContextHelper } from "@/services/Abstractions/IDefaultContextHelper";
import GlobalContextHelper from "@/services/Implementations/GlobalContextHelper";
import HostedGameComponent from "./components/HostedGameComponent.vue";
import LocalGameModel, { LocalGameList } from '../models/responses/LocalGameModel';

@Component({
  components: {},
})
export default class GamesInConnectorComponent extends Vue {
    public selected: LocalGameModel = new LocalGameModel();
    
    private sortIcon: string = 'arrow-up';
    private sortIconSize: string = 'is-small';

    private gameNameValue: string = "";

    public client: IApiClient;
    public localClient: ILocalClient;
    public eventBus: any;

    private globalHelper: IGlobalContextHelper = new GlobalContextHelper();
    private defaultHelper: IDefaultContextHelper = new DefaultContextHelper();

    constructor() {
        super();

        this.localClient = localClient;
    }

    localGames(): LocalGameList {
        return this.localClient.localGames()
    }

    deleteFromLocal(row: LocalGameModel) {
        this.localClient.sendMessage(this.deleteGame(row.localGameId));
        
        this.$awn.success(`Game ${row.gameName} deleted.`, {})
    }

    deleteGame(localGameId: number): ArrayBuffer
    {
        var send = new ArrayBuffer(9);
        var df = new DataView(send);
        df.setInt8(0, 1);
        df.setInt8(1, 247);
        df.setInt8(2, 51);
        df.setInt8(3, 8);
        df.setInt8(4, 0);
        df.setInt32(5, localGameId, true);

        return df.buffer;
    }

    deleteAllGames(): ArrayBuffer
    {
        let send = new ArrayBuffer(1);
        let df = new DataView(send);
        
        df.setInt8( 0, 3 );
        
        return df.buffer;
    }

    clicked(row: LocalGameModel) {
        /*if (row.gameCounter != this.selected.gameCounter)
        {   
            console.log("sending")
            this.selected = row;
            this.$emit("onrowchoose", this, this.selected)
            console.log("sending2")
        }*/
        //console.log(row)
    }

    deleteAll() {
        this.localClient.sendMessage(this.deleteAllGames())
        this.$awn.success('Connector was cleared!', {})
    }

    async created() {

    }

    stop() {
        // @ts-ignore
        this.$parent.close();
    }
}
</script>

<style lang="scss" scoped></style>
