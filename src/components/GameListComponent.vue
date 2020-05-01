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
        
        <b-table v-if="isOpen"
            v-on:select="clicked"
            :data="gameListFiltered()"
            :bordered="true"
            :striped="true"
            :narrowed="true"
            :selected.sync="selected"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="name"
            :loading="gameList.length === 0">
            <template slot-scope="props">
                <b-table-column width="30%" field="name" label="Имя игры" sortable>
                    <b-input
                    slot="subheading"
                    placeholder="Поиск..."
                    v-model="gameNameValue"
                    icon="magnify"
                    size="is-small" />
                    {{ props.row.name }}
                </b-table-column>

                <b-table-column width="60%" field="formattedPlayers" label="Игроки" sortable>
                    <b-input
                    slot="subheading"
                    placeholder="Поиск..."
                    v-model="playerNameValue"
                    icon="magnify"
                    size="is-small" />
                    {{ props.row.formattedPlayers }} 
                </b-table-column>

                <b-table-column width="3%" field="realPlayersCount" label="Игроков" sortable centered>
                    {{ props.row.realPlayersCount }}
                </b-table-column>
                <b-table-column width="3%" field="players.length" label="Макс.Игроков" sortable centered>
                    {{ props.row.players.length }}
                </b-table-column>

                <b-table-column width="5%" field="play" centered>
                    <b-button icon-left="gamepad" type="is-success" :disabled="!localClient.isConnected()"> 
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
import { Component, Prop, Vue } from "vue-property-decorator";
import client from "@/services/Implementations/ApiClient";
import { IApiClient } from '../services/Abstractions/IApiClient';
import { Game, Player } from '../models/responses/GameModel';
import {playerColors} from "@/utilities/PlayerColors";
import { DefaultContextHeaders } from '../models/enum/DefaultContextHeaders';
import DataBuffer from '../utilities/DataBuffer';
import DefaultContextHelper from '../services/Implementations/DefaultContextHelper';
import GameMapPreviewModel from '../models/responses/GameMapPreviewModel';
import GameMapPreviewComponent from '@/components/GameMapPreviewComponent.vue';
import ILocalClient from '../services/Abstractions/ILocalClient';
import localClient from '@/services/Implementations/LocalClient';

@Component({
  components: {
  }
})
export default class GameListComponent extends Vue {
    public selected: Game = new Game();
    public isOpen: boolean = true;

    private gameNameValue: string = "";
    private playerNameValue: string = "";

    private localClient: ILocalClient;

    @Prop() gameList!: Game[];
    @Prop() tableType!: number;

    private sortIcon: string = 'arrow-up';
    private sortIconSize: string = 'is-small';

    constructor() {
        super();
    }

    created() {
        this.localClient = localClient;
    }

    gameListFiltered() {
        console.log('filter')
        let toRet = this.gameList;
        if (this.gameNameValue !== "")
            toRet = toRet.filter(x => x.name.toLowerCase().includes(this.gameNameValue.toLowerCase()))
        
        if (this.playerNameValue !== "")
            toRet = toRet.filter(x => x.formattedPlayers.toLowerCase().includes(this.playerNameValue.toLowerCase()))

        return toRet;
    }

    beforeDestroy() {
        
    }

    clicked(row: Game) {
        if (row.gameCounter != this.selected.gameCounter)
        {   
            console.log("sending")
            this.selected = row;
            this.$emit("onrowchoose", this, this.selected)
            console.log("sending2")
        }
    }

    sendToLocal(row) {

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