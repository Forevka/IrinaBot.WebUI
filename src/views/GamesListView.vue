<template>
  <div class="game-list-view">
    <template class="game-list-view-wrapper" v-if="haveGames()">
      <div class="table-games-wrapper games-donated">
        <GameListComponent :gameList="powerUpGames()" :tableType="0"/>
      </div>
      <div class="table-games-wrapper games-not-started">
        <GameListComponent :gameList="notStartedGames()" :tableType="1"/>
      </div>
      <div class="table-games-wrapper games-started">
        <GameListComponent :gameList="startedGames()" :tableType="2"/>
      </div>
    </template>
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
import GameListComponent from "@/components/GameListComponent.vue";

@Component({
  components: {
    GameListComponent
  }
})
export default class GamesListView extends Vue {
  public client: IApiClient;
  private gameListInterval: number = 3;

  private gameList: Game[] = [];
  private gameListIds: number[] = [];

  /*private powerUpGames: Game[] = [];
  private startedGames: Game[] = [];
  private notStartedGames: Game[] = [];

  private powerUpGamesIds: number[] = [];
  private startedGamesIds: number[] = [];
  private notStartedGamesIds: number[] = [];*/

  private sendMessageInterval!: number;

  constructor() {
    super();
  }

  created() {
    this.gameList = [];

    this.client = client;
    this.client.addDefaultHandler(this.newChatMessage, DefaultContextHeaders.NEWMESSAGE)
    this.client.addDefaultHandler(this.onGamesList, DefaultContextHeaders.GETGAMELIST)


    this.client.afterConnect(this.afterConnect)
  }

  afterConnect() {
    this.sendGetMapList();

    this.sendMessageInterval = setInterval(this.sendGetMapList, this.gameListInterval * 1000);
  }

  sendGetMapList() {
    this.client.sendMessage(DefaultContextHelper.createGetGameList())
  }

  beforeDestroy() {
    console.log('destroy')
    this.client.removeDefaultHandler(this.newChatMessage, DefaultContextHeaders.NEWMESSAGE);
    this.client.removeDefaultHandler(this.onGamesList, DefaultContextHeaders.GETGAMELIST);

    clearInterval(this.sendMessageInterval);
  }

  haveGames() {
    return this.gameList.length > 0;
  }

  newChatMessage(message: DataBuffer) {
    //console.log(message);
  }

  onGamesList(message: DataBuffer) {
    let newGames = DefaultContextHelper.parseGameList(message);

    let newGamesId = newGames.map(x => x.gameCounter);
    let oldGamesId = this.gameList.map(x => x.gameCounter);

    let difference = newGamesId.filter(x => oldGamesId.indexOf(x) == -1);

    this.gameList = this.gameList.filter(xx => !difference.includes(xx.gameCounter))

    newGames.forEach(game => {
      let oldGame = this.gameList.find(x => x.gameCounter == game.gameCounter)
      if (oldGame === undefined) //NEW GAME
      {
        this.gameList.push(game);
      }
      else 
      {
        oldGame.players = game.players;
        oldGame.playersCount = game.playersCount;
        oldGame.formattedPlayers = game.formattedPlayers;
        oldGame.hasPassword = game.hasPassword;
        oldGame.hasGamePowerUp = game.hasGamePowerUp;
        oldGame.name = game.name;
        oldGame.maxPlayers = game.maxPlayers;
        oldGame.hasAdmin = game.hasAdmin;
        oldGame.gameTicks = game.gameTicks;
        oldGame.slotfslg = game.slotfslg;
        oldGame.isStarted = game.isStarted;
      }
    });
  }

  onDefaultContextWelcome(message: DataBuffer) {
    //this.client.sendMessage(DefaultContextHelper.createGetGameList())
  }

  startedGames() {
    return this.gameList.filter(x => x.isStarted);
  }

  powerUpGames() {
    return this.gameList.filter(x => x.hasGamePowerUp && !x.isStarted);
  }

  notStartedGames() {
    return this.gameList.filter(x => !x.isStarted)
  }

}
</script>

<style lang="scss" scoped>
.table-games-wrapper {
  padding-left: 15%;
  padding-right: 15%;
  padding-top: 25px;
  padding-bottom: 25px;
}
</style>