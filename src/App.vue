<template>
  <div id="app">
    <div id="nav"></div>
    <b-loading :is-full-page="true" :active="isLoading" :can-cancel="false"></b-loading>
    <NavBarComponent />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import client from "@/services/Implementations/ApiClient";
import localClient from "@/services/Implementations/LocalClient";

import eventBus from "@/utilities/EventBus";
import DataBuffer from "./utilities/DataBuffer";
import { DefaultContextHeaders } from "./models/enum/DefaultContextHeaders";
import { IApiClient } from "./services/Abstractions/IApiClient";
import DefaultContextHelper from "./services/Implementations/DefaultContextHelper";
import NavBarComponent from "@/components/NavBarComponent.vue";
import ILocalClient from "./services/Abstractions/ILocalClient";
import { GlobalContextHeaders } from "./models/enum/GlobalContextHeaders";

import IGlobalContextHelper from "@/services/Abstractions/IGlobalContextHelper";
import GlobalContextHelper from "@/services/Implementations/GlobalContextHelper";
import MapLoader from "./services/Implementations/MapLoader";
import { IDefaultContextHelper } from "./services/Abstractions/IDefaultContextHelper";
import HostedGameComponent from "./components/HostedGameComponent.vue";

@Component({
  components: {
    NavBarComponent
  }
})
export default class App extends Vue {
  public client: IApiClient;
  public localClient: ILocalClient;
  public eventBus: any;

  private isLoading: boolean = true;

  private pingInterval: number = 3;

  private globalHelper: IGlobalContextHelper = new GlobalContextHelper();
  private defaultHelper: IDefaultContextHelper = new DefaultContextHelper();

  constructor() {
    super();
  }

  async created() {
    /*let mapLoader = new MapLoader();
    console.time('mapParsing')
    await mapLoader.updateMaps()
    console.timeEnd('mapParsing')
    console.log(mapLoader.mapList)*/
  }

  mounted() {
    this.client = client;
    this.localClient = localClient;
    this.eventBus = eventBus;

    this.client.addDefaultHandler(
      this.onDefaultContextWelcome,
      DefaultContextHeaders.WelcomeAnswer
    );
    this.client.addDefaultHandler(
      this.onCreateGameAnswer,
      DefaultContextHeaders.CreateGameAnswer
    );
    this.client.addDefaultHandler(
      this.onUdpGameAnswer,
      DefaultContextHeaders.UdpAnswer
    );

    this.client.addGlobalHandler(
      this.onGlobalError,
      GlobalContextHeaders.GetErrorAnswer
    );
    this.client.addGlobalHandler(
      this.onUserAuth,
      GlobalContextHeaders.UserAuthAnswer
    );

    this.client.afterConnect(() => {
      console.log("AFTER CONNECT");

      this.authorize();

      setInterval(() => {
        this.sendPing();
      }, this.pingInterval * 1000);
    });

    this.localClient.addHandler(this.gameAdded, 2);
    this.localClient.addHandler(this.localClient.onLocalGameList, 255);

    this.$on("localSocketClosed", this.localSocketClosed);
    this.$on("localSocketError", this.localSocketError);
    this.$on("localSocketConnected", this.localSocketConnected);

    this.localClient.reconect();
  }

  onUserAuth(message: DataBuffer) {
    let user = this.globalHelper.parseUserAuthResponse(message);
    this.client.auth(user);

    this.$awn.success(
      `<span style="display: flex;"> <img src=${user.avatarUrl} style="width: 64px;margin-right: 10px;"> Authorized as ${user.nickname}</span>`,
      {
        labels: {
          success: ""
        }
      }
    );
  }

  onUdpGameAnswer(message: DataBuffer) {
    console.log(message);
    let array = message.getArray(message.length - 2);

    let send = new ArrayBuffer(array.length + 1);
    let df = new DataView(send);
    
    df.setInt8(0, 2);

    for (var i = 0; i < array.length; ++i) 
      df.setInt8(i + 1, array[i]);

    this.localClient.sendMessage(df.buffer);
  }

  onCreateGameAnswer(message: DataBuffer) {
    let game = this.defaultHelper.parseCreateGameResponse(message);

    if (game.code === 11) {
      this.$awn.alert(game.description, {});
      return;
    }

    this.$awn.success(game.description, {});

    if (game.password !== "") {
      this.$buefy.modal.open({
        canCancel: [""],
        parent: this,
        component: HostedGameComponent,
        hasModalCard: true,
        customClass: "hosted-game-wrapper",
        trapFocus: true,
        props: {
          game
        }
      });
      return;
    }
  }

  authorize() {
    let accessTokenDiscord = localStorage.getItem("accessToken_Discord");

    if (
      accessTokenDiscord !== undefined &&
      accessTokenDiscord !== null &&
      accessTokenDiscord !== ""
    ) {
      this.client.sendMessage(
        this.globalHelper.createUserAuth(1, accessTokenDiscord, 0)
      );
    }
  }

  onGlobalError(message: DataBuffer) {
    let error = this.globalHelper.parseError(message);
    console.warn(error);
    if (error.code === 1) {
      if (error.description.startsWith("Карта уже имеется на боте.")) {
        this.$root.$emit("mapAlreadyExist", error);
        return;
      }
    }

    this.$awn.warning(`${error.code} - ${error.description}`, {});
  }

  localSocketConnected() {
    this.$awn.success("Успешно подключился к коннектору!", {});
  }

  destroy() {
    this.$off("localSocketClosed");
  }

  gameAdded() {
    this.$awn.success(
      "Игра добавлена, можешь найти её в локальной сети WC3",
      {}
    );
  }

  localSocketError() {
    if (!this.localClient.isReconnecting()) {
      setTimeout(() => {
        this.localClient.reconectIfNeed();
      }, 3000);
      console.log("Пробую подключиться к коннектору через 3 сек...");
    }
  }

  localSocketClosed() {
    this.localSocketError();
  }

  sendPing(): void {
    //this.client.sendMessage(DefaultContextHelper.C)
  }

  onDefaultContextWelcome(message: DataBuffer): void {
    console.log("WELCOME DEFAULT");
    this.isLoading = false;
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";
@import "~vue-awesome-notifications/dist/styles/style.css";

tbody tr:hover:not(.is-selected):not(.is-empty) {
  background-color: turquoise !important;
}

img {
  width: 100%;
  height: 100%;
}

html {
  background-color: rgba(50, 115, 220, 0.3) !important;
}
.animation-content {
  min-width: 50%;
}

small.help.counter.is-invisible {
  display: none !important;
}

.player-name {
  padding-left: 5px;
}
</style>

<style lang="scss">
html {
  //background: url('assets/background-tiled-memphis.png');
  //font-family: "Helvetica Neue", Helvetica, Arial;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #3b3b3b;
  -webkit-font-smoothing: antialiased;
  background: #2b2b2b;
  font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    "Helvetica", "Arial", sans-serif;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                supported by Chrome, Opera and Firefox */
}
</style>

<style lang="scss">
.table.is-narrow td,
.table.is-narrow th {
  padding: 0.1em 0.5em;
  padding-bottom: 0 !important;
}

.table.is-narrow td,
.table.is-narrow th {
  padding: 0em 0.5em !important;
}

div.control {
  margin-bottom: 0 !important;
}

div.b-table > div.level > div.level-right {
  display: flex;
  flex: auto;
  justify-content: center;
}
</style>