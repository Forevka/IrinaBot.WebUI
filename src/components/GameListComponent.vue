<template>
  <section>
    <b-collapse
        aria-id="contentIdForA11y2"
        class="card"
        animation="slide"
        :open.sync="isOpen">
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
        
        <b-table 
            :data="gameList"
            :bordered="true"
            :striped="true"
            :narrowed="true"
            :selected.sync="selected"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="name"
            :loading="gameList.length === 0">
            <b-input
                v-if="!props.column.numeric"
                slot="searchable"
                slot-scope="props"
                v-model="props.filters[props.column.field]"
                placeholder="Поиск..."
                icon="magnify"
                size="is-small" />
            <template slot-scope="props">
                <b-table-column width="30%" field="name" label="Имя игры" sortable searchable>
                    {{ props.row.name }}
                </b-table-column>

                <b-table-column width="60%" field="formattedPlayers" label="Игроки" sortable searchable>
                    {{ props.row.formattedPlayers }} 
                </b-table-column>

                <b-table-column width="3%" field="realPlayersCount" label="Игроков" sortable centered>
                    {{ props.row.realPlayersCount }}
                </b-table-column>
                <b-table-column width="3%" field="players.length" label="Макс.Игроков" sortable centered>
                    {{ props.row.players.length }}
                </b-table-column>

                <b-table-column width="5%" field="play" centered>
                    <b-button icon-left="gamepad" type="is-success"> 
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
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Game, Player } from '../models/responses/GameModel';
import {playerColors} from "@/utilities/PlayerColors";

@Component({
  components: {
  }
})
export default class GameListComponent extends Vue {
    public selected: Game = new Game();
    public isOpen: boolean = true;

    @Prop() gameList!: Game[];
    @Prop() tableType!: number;

    private sortIcon: string = 'arrow-up';
    private sortIconSize: string = 'is-small';

    constructor() {
        super();
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