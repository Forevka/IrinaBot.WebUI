<template>
<div class="game-list">
  <section>
    <b-collapse
        aria-id="contentIdForA11y2"
        class="card"
        
        :open.sync="isOpen"
        >
        <div
            slot="trigger"
            :class="'card-header ' + getTableColor()"
            role="button"
            aria-controls="contentIdForA11y2">
            <p class="card-header-title">{{getTableName() + " (" + gameList.length + ")"}}</p>
            <a class="card-header-icon">
                <b-icon
                    :icon="isOpen ? 'menu-down' : 'menu-up'">
                </b-icon>
            </a>
        </div>
        <b-field grouped group-multiline style="margin-left: 10px;margin-top: 4px;margin-bottom: 4px;">
            <b-field label="Игр показывать">
                <b-numberinput v-model="perPage" size="is-small" controls-position="compact" v-on:input="storeSettings()"/>
            </b-field>
            <b-checkbox v-model="dontShowFullGame">Не показывать фулл-пати</b-checkbox>
        </b-field>
        <b-table v-if="isOpen"
            v-on:click="clicked"
            :paginated="true"
            :pagination-simple="false"
            :pagination-position="'bottom'"
            :current-page="1"
            :per-page="perPage"
            :data="gameListFiltered()"
            :bordered="false"
            :striped="true"
            :narrowed="true"
            :selected.sync="selected"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="realPlayersCount"
            default-sort-direction="desc"
            :loading="gameList.length === 0">
            <template slot-scope="props">
                <b-table-column width="40%" field="name" label="Имя игры" sortable style="font-weight: 600;">
                    <b-input
                    slot="subheading"
                    placeholder="Поиск..."
                    v-model="gameNameValue"
                    icon="magnify"
                    size="is-small" />
                    {{ props.row.name }}
                </b-table-column>

                <b-table-column 
                width="50%" 
                field="formattedPlayers" 
                label="Игроки" 
                sortable 
                v-html="props.row.formattedPlayers" 
                style="display: grid;grid-template-columns: repeat(6, 0.1fr);"
                cell-class="player-name-list">
                    <b-input
                    slot="subheading"
                    placeholder="Поиск..."
                    v-model="playerNameValue"
                    icon="magnify"
                    size="is-small" />
                </b-table-column>

                <b-table-column  width="3%" field="realPlayersCount" label="Игроков в игре" sortable centered>
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :label="column.label" dashed>
                            И.
                        </b-tooltip>
                    </template> 
                    {{ props.row.realPlayersCount }}
                </b-table-column>
                <b-table-column width="2%" field="players.length" label="Максимум игроков" sortable centered>
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :label="column.label" dashed>
                            М.И
                        </b-tooltip>
                    </template> 
                    {{ props.row.players.length }}
                </b-table-column>

                <b-table-column width="5%" field="play" centered>
                    <b-button icon-left="gamepad" type="is-success" :disabled="!localClient.isConnected()" @click="sendToLocal(props.row)"> 
                        Play!
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
    </b-collapse>
    </section>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import client from "@/services/Implementations/ApiClient";
import { IApiClient } from '../services/Abstractions/IApiClient';
import { Game, Player } from '../models/responses/GameModel';
import { playerColors } from "@/utilities/PlayerColors";
import { DefaultContextHeaders } from '../models/enum/DefaultContextHeaders';
import DataBuffer from '../utilities/DataBuffer';
import DefaultContextHelper from '../services/Implementations/DefaultContextHelper';
import GameMapPreviewModel from '../models/responses/GameMapPreviewModel';
import GameMapPreviewComponent from '@/components/GameMapPreviewComponent.vue';
import ILocalClient from '../services/Abstractions/ILocalClient';
import localClient from '@/services/Implementations/LocalClient';
import { IDefaultContextHelper } from '../services/Abstractions/IDefaultContextHelper';

@Component({
  components: {
  }
})
export default class GameListComponent extends Vue {
    public selected: Game = new Game();
    public isOpen: boolean = true;
    public perPage: number;
    public dontShowFullGame: boolean = false;

    private gameNameValue: string = "";
    private playerNameValue: string = "";

    private localClient: ILocalClient;
    private client: IApiClient;
    private defaultHelper: IDefaultContextHelper = new DefaultContextHelper();

    @Prop() gameList!: Game[];
    @Prop() tableType!: number;
    @Prop() showByDefault!: boolean;

    private sortIcon: string = 'arrow-up';
    private sortIconSize: string = 'is-small';

    constructor() {
        super();
        this.loadSettings()
    }

    storeSettings() {
        let key: string = `gameListComponent_${this.tableType}`

        localStorage.setItem(key + "perPage", this.perPage.toString())
    }

    loadSettings() {
        let key: string = `gameListComponent_${this.tableType}`

        let perPage = localStorage.getItem(key + "perPage");
        if (perPage !== null)
            this.perPage = Number(perPage);
        else
            this.perPage = 20;
    }

    created() {
        this.localClient = localClient;
        this.client = client;

        this.isOpen = this.showByDefault;
    }

    gameListFiltered() {
        let toRet = this.gameList;
        if (this.gameNameValue !== "")
            toRet = toRet.filter(x => x.name.toLowerCase().includes(this.gameNameValue.toLowerCase()))
        
        if (this.playerNameValue !== "")
            toRet = toRet.filter(x => x.formattedPlayers.toLowerCase().includes(this.playerNameValue.toLowerCase()))
        
        if (this.dontShowFullGame === true)
        {
            let toDelete = toRet.filter(x => x.players.length === x.realPlayersCount).map(x => x.gameCounter);
            toRet = toRet.filter(x => !toDelete.includes(x.gameCounter));
        }

        return toRet;
    }

    beforeDestroy() {
        
    }

    clicked(row: Game) {
        console.log(row)
        if (row.gameCounter != this.selected.gameCounter)
        {   
            console.log("sending")
            this.selected = row;
            this.$emit("onrowchoose", this, this.selected)
            console.log("sending2")
        }
    }

    sendToLocal(row: Game) {
        this.client.sendMessage(this.defaultHelper.createGetGameUDP(0, row.gameCounter, ''))
    }

    getTableColor() {
        if (this.tableType === 0)
            return "red"
        if (this.tableType === 1)
            return ""
        if (this.tableType === 2)
            return "green"
    }

    getTableName() {
        if (this.tableType === 0)
            return "VIP Игры"
        if (this.tableType === 1)
            return "Обычные Игры"
        if (this.tableType === 2)
            return "Начавшиеся Игры"
    }

    gameNameStyle() {
        return {
            "color": "black"//this.game.isStarted === 1 ? "green" : "black"
        }
    }

    playerNameStyle(player: Player) {
        return {
            "color": playerColors[player.color],
        }
    }
}
</script>

<style scoped lang="scss">
.game-list {
  padding-top: 25px;
  padding-bottom: 25px;
}

.table-name {
    width: 100%;
    text-align: center;
}

.red {
    background-color:rgba(178, 34, 34, 0.514);
}

.green {
    background-color: burlywood;
}
</style>