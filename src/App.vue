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
import themeHelper from "@/services/Implementations/ThemeHelper.ts";

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

  
  private themeHelper = themeHelper;

  public themes = {
    default: "https://httpstat.us/200",
    darkly: "https://cdn.rawgit.com/jenil/bulmaswatch/gh-pages/darkly/bulmaswatch.min.css",
    flatly: "https://cdn.rawgit.com/jenil/bulmaswatch/gh-pages/flatly/bulmaswatch.min.css",
    lux: "https://cdn.rawgit.com/jenil/bulmaswatch/gh-pages/lux/bulmaswatch.min.css",
    sandstone: "https://cdn.rawgit.com/jenil/bulmaswatch/gh-pages/sandstone/bulmaswatch.min.css",
    solar: "https://cdn.rawgit.com/jenil/bulmaswatch/gh-pages/solar/bulmaswatch.min.css",
    slate: "https://cdn.rawgit.com/jenil/bulmaswatch/gh-pages/slate/bulmaswatch.min.css",
    superhero: "https://cdn.rawgit.com/jenil/bulmaswatch/gh-pages/superhero/bulmaswatch.min.css",
    united: "https://cdn.rawgit.com/jenil/bulmaswatch/gh-pages/united/bulmaswatch.min.css",
    materia: "https://cdn.rawgit.com/jenil/bulmaswatch/gh-pages/materia/bulmaswatch.min.css",
    journal: "https://cdn.rawgit.com/jenil/bulmaswatch/gh-pages/journal/bulmaswatch.min.css",
  }

  constructor() {
    super();
  }

  async created() {
    this.themeHelper = themeHelper;

    let added = Object.keys(this.themes).map(name => {
      return this.themeHelper.add(name, this.themes[name]);
    });

    console.log(this.themeHelper)

    Promise.all(added).then(sheets => {
      console.log(`${sheets.length} themes loaded`);
      this.themeHelper.theme = 'default'
    })
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
@import "~vue-awesome-notifications/dist/styles/style.css";

// Bulma + Bulmaswatch
//@import "themes/darkly/variables";
@import "node_modules/bulma/bulma";
//@import "themes/darkly/overrides";

// Buefy
@import "node_modules/buefy/src/scss/buefy";

tbody tr:hover:not(.is-selected):not(.is-empty) {
  background-color: turquoise !important;
}

.table td {
  border: none;
}

img {
  width: 100%;
  height: 100%;
}

/*html {
  background-color: rgba(50, 115, 220, 0.3) !important;
}*/
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
.navbar {
  background-color: #1f2424;
  border-radius: 0 !important;
}

.navbar-item.has-dropdown:focus .navbar-link, .navbar-item.has-dropdown:hover .navbar-link, .navbar-item.has-dropdown.is-active .navbar-link {
  background-color: #776374;
}

a.navbar-item:focus, a.navbar-item:focus-within, a.navbar-item:hover, a.navbar-item.is-active, .navbar-link:focus, .navbar-link:focus-within, .navbar-link:hover, .navbar-link.is-active {
  color: #FFC070;
}

.navbar-dropdown {
  background-color: #1f2424;
}

.navbar-item {
  color: white;
}

.navbar-link {
  color: white;
}

.table.is-narrow td,
.table.is-narrow th {
  //padding: 0;
  padding-bottom: 0 !important;
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