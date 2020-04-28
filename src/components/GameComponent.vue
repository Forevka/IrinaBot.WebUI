<template>
  <div class="game-container">
      <div class="game-name" :style="gameNameStyle()">
          Name: {{game.name}}
      </div>
      Players:
      <div class="game-players" v-for="player in game.players" :key="player.color">
          <div class="game-player-name" :style="playerNameStyle(player)">
              {{player.name}}
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Game, Player } from '../models/responses/GameModel';
import {playerColors} from "@/utilities/PlayerColors";

@Component({
  components: {
  }
})
export default class GameComponent extends Vue {
    @Prop() game!: Game;

    constructor() {
        super();
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
.game-container {
    display: flex;
    flex-direction: row;

    .game-name {
        padding-right: 5px;
    }

    .game-players {
        .game-player-name {
            padding-left: 5px;
        }
    }
}


</style>