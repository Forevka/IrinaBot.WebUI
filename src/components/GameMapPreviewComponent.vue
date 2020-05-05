<template>
    <div class="game-map-preview-wrapper">
        <div class="container">
            <div class="game-map-name" v-html="parseWC3Tags(mapPreview.mapname)">
            </div>
            <div class="game-map-image">
                <img class="map-image" :src="image()" width="256" height="256">
            </div>
            <div class="game-map-players" v-html="'Игроков: ' + parseWC3Tags(mapPreview.players)">
                
            </div>
            <div class="game-map-description" v-html="parseWC3Tags(mapPreview.description)">
                
            </div>
            <div class="game-map-to-game" v-if="game.gameCounter !== undefined">
                <b-button style="left: 50%;position: relative;" icon-left="gamepad" type="is-success" :disabled="!localClient.isConnected()"> 
                    Play!
                </b-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GameMapPreviewModel from '../models/responses/GameMapPreviewModel';
import ParseWc3Tags from "@/utilities/parse_wc3_tags";
import { Game } from '../models/responses/GameModel';
import ILocalClient from '../services/Abstractions/ILocalClient';
import localClient from '@/services/Implementations/LocalClient';



@Component({
  components: {
  }
})
export default class GameMapPreviewComponent extends Vue {
    @Prop() mapPreview!: GameMapPreviewModel;
    @Prop() game!: Game;

    private localClient: ILocalClient;

    constructor() {
        super();
    }

    created() {
        this.localClient = localClient;
    } 

    parseWC3Tags(tags: string) {
        return ParseWc3Tags(tags)
    }

    image() {
        try
        {
            // @ts-ignore
            var tga = new TGA();
            tga.load(this.mapPreview.tga);
            var canvas = tga.getCanvas();
            return canvas.toDataURL();
        }
        catch (e)
        {
            return "https://via.placeholder.com/256";
        }
    }
}
</script>

<style scoped lang="scss">
.game-map-preview-wrapper {
    margin: 2%;
}

.game-map-image {
    margin-top: 4%
}

.container {
    background-color: antiquewhite;
    width: 350px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    padding: 2px 16px;
    align-self: flex-start;
    position: sticky;
    top: 20px;

    &:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }
}

.game-map-description {
    word-break: break-word;
    text-shadow: 0 0 1px black;
}

.game-map-name {
    text-align: center;
    text-shadow: 0 0 1px black;
}
.game-map-players {
    text-align: center;
}

.game-map-to-game {
    button {
        left: 50%;
        transform: translate(-50%, 0%);
    }
    margin-top: 2%;
    margin-bottom: 2%;
}
</style>