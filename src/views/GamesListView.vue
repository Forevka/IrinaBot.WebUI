<template>
  <div class="game-view">
    <div class="game-list-view">
      <template class="game-list-view-wrapper" v-if="haveGames()">
        <div class="table-games-wrapper games-donated">
          <GameListComponent :gameList="gamePool.powerUpGames()" :tableType="0" @onrowchoose="rowChoose" :showByDefault="true"/>
        </div>
        <div class="table-games-wrapper games-not-started">
          <GameListComponent :gameList="gamePool.notStartedGames()" :tableType="1" @onrowchoose="rowChoose" :showByDefault="true"/>
        </div>
        <div class="table-games-wrapper games-started">
          <GameListComponent :gameList="gamePool.startedGames()" :tableType="2" @onrowchoose="rowChoose" :showByDefault="false"/>
        </div>
      </template>
    </div>
    <game-map-preview-component :mapPreview="mapPreview" :game="gameChosen" v-if="haveGames()"/>
  </div>
</template>

<script lang="ts">
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
import { IDefaultContextHelper } from '../services/Abstractions/IDefaultContextHelper';
import GamePool from '@/utilities/GamePool';

@Component({
  components: {
    GameListComponent,
    GameMapPreviewComponent
  }
})
export default class GamesListView extends Vue {
  public client: IApiClient;

  private gamePool: GamePool = new GamePool();

  private mapPreview: GameMapPreviewModel = new GameMapPreviewModel();
  private gameChosen: Game = new Game();

  private gameListInterval: number = 3;

  private sendMessageInterval!: number;

  private contextHelper: IDefaultContextHelper = new DefaultContextHelper();

  constructor() {
    super();
  }

  rowChoose(who, game: Game) {
    this.gameChosen = game;
    this.client.sendMessage(this.contextHelper.createGetMapInfo(game[0].gameCounter))
  }

  created() {
    //this.gameList = [];
    this.mapPreview.mapname = "Выбери карту со списка слева";
    this.mapPreview.tga = new ArrayBuffer(0);
    this.mapPreview.author = "";
    this.mapPreview.description = "";
    this.mapPreview.players = "";

    this.client = client;
    this.client.addDefaultHandler(this.newChatMessage, DefaultContextHeaders.NewMessageAnswer)
    this.client.addDefaultHandler(this.onGamesList, DefaultContextHeaders.GameListAnswer)
    this.client.addDefaultHandler(this.onMapInfo, DefaultContextHeaders.MapInfoAnswer)


    this.client.afterConnect(this.afterConnect)
  }

  onMapInfo(message: DataBuffer) {
      this.mapPreview = this.contextHelper.parseMapInfo(message);
      console.log(this.mapPreview)
  }

  afterConnect() {
    this.sendGetMapList();

    this.sendMessageInterval = setInterval(this.sendGetMapList, this.gameListInterval * 1000);
  }

  sendGetMapList() {
    this.client.sendMessage(this.contextHelper.createGetGameList())
  }

  beforeDestroy() {
    console.log('destroy')
    this.client.removeDefaultHandler(this.newChatMessage, DefaultContextHeaders.NewMessageAnswer);
    this.client.removeDefaultHandler(this.onGamesList, DefaultContextHeaders.GameListAnswer);
    this.client.removeDefaultHandler(this.onMapInfo, DefaultContextHeaders.MapInfoAnswer);

    clearInterval(this.sendMessageInterval);
  }

  haveGames() {
    return this.gamePool.gameList.length > 0;
  }

  newChatMessage(message: DataBuffer) {
    //console.log(message);
  }

  onGamesList(message: DataBuffer) {
    console.time('parseGameList')
    let newGames = this.contextHelper.parseGameList(message);

    this.gamePool.newGames(newGames);
    console.timeEnd('parseGameList')
  }

  onDefaultContextWelcome(message: DataBuffer) {
    //this.client.sendMessage(DefaultContextHelper.createGetGameList())
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