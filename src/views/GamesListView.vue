<template>
  <div class="game-view">
    <div class="game-list-view">
      <template class="game-list-view-wrapper" v-if="haveGames()">
        <div class="table-games-wrapper games-donated">
          <GameListComponent :gameList="powerUpGames()" :tableType="0" @onrowchoose="rowChoose" :showByDefault="true"/>
        </div>
        <div class="table-games-wrapper games-not-started">
          <GameListComponent :gameList="notStartedGames()" :tableType="1" @onrowchoose="rowChoose" :showByDefault="true"/>
        </div>
        <div class="table-games-wrapper games-started">
          <GameListComponent :gameList="startedGames()" :tableType="2" @onrowchoose="rowChoose" :showByDefault="false"/>
        </div>
      </template>
    </div>
    <game-map-preview-component :mapPreview="mapPreview" :game="gameChosen" v-if="haveGames()"/>
  </div>
</template>

<script lang="ts">

/*
<div class="table-games-wrapper games-started">
  <GameListComponent :gameList="startedGames()" :tableType="2" @onrowchoose="rowChoose"/>
</div>
 */
import { Component, Prop, Vue } from "vue-property-decorator";
import client from "@/services/Implementations/ApiClient";
import { IApiClient } from '../services/Abstractions/IApiClient';
import DataBuffer from '../utilities/DataBuffer';
import { DefaultContextHeaders } from '../models/enum/DefaultContextHeaders';
import DefaultContextHelper from "@/services/Implementations/DefaultContextHelper";
import { Game } from '../models/responses/GameModel';
import GameListComponent from "@/components/GameListComponent.vue";
import GameMapPreviewModel from '../models/responses/GameMapPreviewModel';
import GameMapPreviewComponent from '@/components/GameMapPreviewComponent.vue';

@Component({
  components: {
    GameListComponent,
    GameMapPreviewComponent
  }
})
export default class GamesListView extends Vue {
  public client: IApiClient;

  private mapPreview: GameMapPreviewModel = new GameMapPreviewModel();
  private gameChosen: Game = new Game();

  private gameListInterval: number = 3;

  private gameList: Game[] = [];
  private gameListIds: number[] = [];

  private sendMessageInterval!: number;

  constructor() {
    super();
  }

  rowChoose(who, game: Game){
    this.gameChosen = game;
    this.client.sendMessage(DefaultContextHelper.createGetMapInfo(game.gameCounter))
  }

  created() {
    this.gameList = [];
    this.mapPreview.mapname = "Выбери карту со списка слева";
    this.mapPreview.tga = new ArrayBuffer(0);
    this.mapPreview.author = "";
    this.mapPreview.description = "";
    this.mapPreview.players = "";

    this.client = client;
    this.client.addDefaultHandler(this.newChatMessage, DefaultContextHeaders.NEWMESSAGE)
    this.client.addDefaultHandler(this.onGamesList, DefaultContextHeaders.GETGAMELIST)
    this.client.addDefaultHandler(this.onMapInfo, DefaultContextHeaders.MAPINFO)


    this.client.afterConnect(this.afterConnect)
  }

  onMapInfo(message: DataBuffer) {
      this.mapPreview = DefaultContextHelper.parseMapInfo(message);
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
    this.client.removeDefaultHandler(this.onMapInfo, DefaultContextHeaders.MAPINFO);

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
        game.calcPlayers();
        this.gameList.push(game);
      }
      else 
      {
        oldGame.isStarted = game.isStarted;
        oldGame.name = game.name;
        oldGame.hasAdmin = game.hasAdmin;
        oldGame.hasPassword = game.hasPassword;
        oldGame.hasGamePowerUp = game.hasGamePowerUp;
        oldGame.gameCounter = game.gameCounter;
        oldGame.gameTicks = game.gameTicks;
        oldGame.creatorId = game.creatorId;
        oldGame.iccuphost = game.iccuphost;
        oldGame.slotfslg = game.slotfslg;
        oldGame.maxPlayers = game.maxPlayers;
        oldGame.playersCount = game.playersCount;
        oldGame.players = game.players;

        oldGame.calcPlayers();
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
    return this.gameList.filter(x => !x.isStarted && !x.hasGamePowerUp)
  }

}
</script>

<style lang="scss" scoped>
.game-view {
    display: flex;
}

.game-list-view {
  padding-bottom: 25px;
  margin-left: 5%;
  width: 80%;
}
</style>