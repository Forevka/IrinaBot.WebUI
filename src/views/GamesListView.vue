<template>
  <div class="game-list-view">
    <div class="game-list-powerup wrapper">
      <div class="label">
        Донатные игры
      </div>
      <div class="row header">
        <div class="cell">
          Name
        </div>
        <div class="cell">
          Players
        </div>
      </div>
      <div class="row" v-for="game in powerUpGames()" :key="game.gameCounter">
        <div class="cell" data-title="Name">
          {{game.name}}
        </div>
        <div class="cell" data-title="Players">
          {{game.players | formatPlayerName}}
        </div>
      </div>
    </div>

    <div class="game-list-not-started wrapper">
      <div class="label blue">
        Неначавшиеся игры
      </div>
      <div class="row header blue">
        <div class="cell">
          Name
        </div>
        <div class="cell">
          Players
        </div>
      </div>
      <div class="row" v-for="game in notStarted()" :key="game.gameCounter">
        <div class="cell" data-title="Name">
          {{game.name}}
        </div>
        <div class="cell" data-title="Players">
          {{game.players | formatPlayerName}}
        </div>
      </div>
    </div>

    <div class="game-list-started wrapper">
      <div class="label green">
        Начавшиеся игры
      </div>
      <div class="row header green">
        <div class="cell">
          Name
        </div>
        <div class="cell">
          Players
        </div>
      </div>
      <div class="row" v-for="game in startedGames()" :key="game.gameCounter">
        <div class="cell" data-title="Name">
          {{game.name}}
        </div>
        <div class="cell" data-title="Players">
          {{game.players | formatPlayerName}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

/*
<GameComponent class="row" v-for="game in gameList" :key="game.gameCounter" :game=game>
</GameComponent>
 */
import { Component, Prop, Vue } from "vue-property-decorator";
import client from "@/services/Implementations/ApiClient";
import { IApiClient } from '../services/Abstractions/IApiClient';
import DataBuffer from '../utilities/DataBuffer';
import { DefaultContextHeaders } from '../models/enum/DefaultContextHeaders';
import DefaultContextHelper from "@/services/Implementations/DefaultContextHelper";
import { Game } from '../models/responses/GameModel';
import GameComponent from "@/components/GameComponent.vue";

@Component({
  components: {
    GameComponent
  }
})
export default class BoardView extends Vue {
  public client: IApiClient;
  private gameListInterval: number = 3;

  private gameList: Game[] = []

  constructor() {
    super();
    this.client = client;
    this.client.addDefaultHandler(this.newChatMessage, DefaultContextHeaders.NEWMESSAGE)
    this.client.addDefaultHandler(this.onGamesList, DefaultContextHeaders.GETGAMELIST)

    this.client.afterConnect(() => {
      this.client.sendMessage(DefaultContextHelper.createGetGameList())

      setInterval(()=> { 
        this.client.sendMessage(DefaultContextHelper.createGetGameList())
      }, this.gameListInterval * 1000);
    })
    
  }

  notStarted() {
    return this.gameList.filter(x => !x.isStarted)
  }

  powerUpGames() {
    return this.gameList.filter(x => x.hasGamePowerUp && !x.isStarted);
  }

  startedGames() {
    return this.gameList.filter(x => x.isStarted);
  }

  newChatMessage(message: DataBuffer) {
    //console.log(message);
  }

  onGamesList(message: DataBuffer) {
    this.gameList = DefaultContextHelper.parseGameList(message);
    console.log(this.gameList);
  }

  onDefaultContextWelcome(message: DataBuffer) {
    //this.client.sendMessage(DefaultContextHelper.createGetGameList())
  }

}
</script>

<style lang="scss" scoped>

@media screen and (max-width: 580px) {
  body {
    font-size: 16px;
    line-height: 22px;
  }
}

.label {
  width: auto;
  text-align: center;
  background: #ea6153;
  font-weight: 900;
  color: white;
}

.label.green {
  background: #27ae60;
}

.label.blue {
  background: #2980b9;
}
.wrapper {
  margin: 0 20%;
  padding: 20px;
  //max-width: 800px;
  display: flex;
  flex-direction: column;
  //min-width: 80%;
}

.table {

  margin: 0 0 40px 0;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  display: table;
}
@media screen and (max-width: 580px) {
  .table {
    display: block;
  }
}

.row {
  display: inline-flex;
  background: #f6f6f6;
  
}
.row:nth-of-type(odd) {
  background: #e9e9e9;
}
.row.header {
  width: auto;
  font-weight: 900;
  color: #ffffff;
  background: #ea6153;
}
.row.green {
  background: #27ae60;
}
.row.blue {
  background: #2980b9;
}
@media screen and (max-width: 580px) {
  .row {
    padding: 14px 0 7px;
    display: block;
  }
  .row.header {
    padding: 0;
    height: 6px;
  }
  .row.header .cell {
    display: none;
  }
  .row .cell {
    margin-bottom: 10px;
  }
  .row .cell:before {
    margin-bottom: 3px;
    content: attr(data-title);
    min-width: 98px;
    font-size: 10px;
    line-height: 10px;
    font-weight: bold;
    text-transform: uppercase;
    color: #969696;
    display: block;
  }
}

.cell {
  padding: 6px 12px;
  display: table-cell;
  min-width: 30%;
}
@media screen and (max-width: 580px) {
  .cell {
    padding: 2px 16px;
    display: block;
  }
}

</style>