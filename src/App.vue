<template>
  <div id="app">
    <div id="nav"></div>
    <b-loading :is-full-page="true" :active="isLoading" :can-cancel="false"></b-loading>
    <NavBarComponent/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import client from '@/services/Implementations/ApiClient';

import eventBus from "@/utilities/EventBus";
import DataBuffer from './utilities/DataBuffer';
import { DefaultContextHeaders } from './models/enum/DefaultContextHeaders';
import { IApiClient } from './services/Abstractions/IApiClient';
import DefaultContextHelper from './services/Implementations/DefaultContextHelper';
import NavBarComponent from "@/components/NavBarComponent.vue";

@Component({
  components: {
    NavBarComponent
  }
})
export default class App extends Vue {
  public client: IApiClient;

  private isLoading: boolean = true;

  private pingInterval: number = 3;

  constructor() {
    super();

    this.client = client;
    this.client.addDefaultHandler(this.onDefaultContextWelcome, DefaultContextHeaders.CONTEXTWELCOME)

    this.client.afterConnect(() => {
      console.log("AFTER CONNECT")

      setInterval(()=> {
        this.sendPing() 
      }, this.pingInterval * 1000);
    })
  }
  
  sendPing(): void {
    //this.client.sendMessage(DefaultContextHelper.C)
  }

  onDefaultContextWelcome(message: DataBuffer): void {
    console.log("WELCOME DEFAULT")
    this.isLoading = false;
  }
}
</script>

<style lang="scss">
@import '~vue-awesome-notifications/dist/styles/style.css';

img {
  width: 100%;
  height: 100%;
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
  font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
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
