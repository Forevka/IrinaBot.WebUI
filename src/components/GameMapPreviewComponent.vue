<template>
    <div class="game-map-preview-wrapper">
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
            <b-button icon-left="gamepad" type="is-success"> 
                Play!
            </b-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GameMapPreviewModel from '../models/responses/GameMapPreviewModel';
import ParseWc3Tags from "@/utilities/parse_wc3_tags";
import { Game } from '../models/responses/GameModel';



@Component({
  components: {
  }
})
export default class GameMapPreviewComponent extends Vue {
    @Prop() mapPreview!: GameMapPreviewModel;
    @Prop() game!: Game;


    constructor() {
        super();
    }

    created() {
        
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
.map-image {
    border: blue;
    border-style: dotted;
}

.game-map-preview-wrapper{
    width: calc(196px + 20%);
    align-self: flex-start;
    position: sticky;
    top: 0px;
    padding-top: 50px;
    padding-right: 5%;
    padding-left: 5%;
}

.game-map-description {
    word-break: break-word;
}

.game-map-image {
    //width: 256px;
}

.game-map-name {
    text-align: center;
}
.game-map-players {
    text-align: center;
}

.game-map-to-game {
    button {
        left: 50%;
        transform: translate(-50%, 0%);
    }
}
</style>