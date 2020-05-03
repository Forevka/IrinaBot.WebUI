<template>
    <div class="game-host-wrapper" style="min-width: 100%; width: 100%;">
        <form action="">
            <div class="modal-card" style="min-width: 100%; width: 100%;">
                <header class="modal-card-head">
                    <p class="modal-card-title">Game Host Options</p>
                </header>
                <section class="modal-card-body" >
                    <section style="display: inline-flex;">
                        <b-field label="Имя игры" style="width: 100%;min-width: 100%;">
                            <b-input maxlength="25" :show-counter="false" v-model="gameHostOptions.gameName">
                            </b-input>
                        </b-field>
                        <b-field label="Версия игры" style="margin-left: 20px;min-width: 100%;width: 100%;">
                            <b-select placeholder="1.26" v-model="gameHostOptions.gameVersion" style="min-width: 100%;width: 100%;">
                                <option
                                    v-for="option in availableVersions"
                                    :value="option.id"
                                    :key="option.id">
                                    {{ option.name }}
                                </option>
                            </b-select>
                        </b-field>
                    </section>
                    <b-field label="Карта">
                        <b-autocomplete ref="mapNameChooser"
                            v-model="gameMapFilter"
                            placeholder="Echo Isles"
                            :keep-first="true"
                            :open-on-focus="true"
                            :data="filteredDataObj()"
                            field="name"
                            @select="option => setMap(option)">
                        </b-autocomplete>
                    </b-field>

                    <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
                        <div
                            slot="trigger" 
                            slot-scope="props"
                            class="card-header"
                            role="button"
                            aria-controls="contentIdForA11y3">
                            <p class="card-header-title">
                                Дополнительные параметры
                            </p>
                            <a class="card-header-icon">
                                <b-icon
                                    :icon="props.open ? 'menu-down' : 'menu-up'">
                                </b-icon>
                            </a>
                        </div>
                        <div class="card-content" style="display: inline-flex;">
                            <div class="content" style="display: inline-flex; flex-flow: column;">
                                <b-field label="Дополнительный админ">
                                    <b-input maxlength="25" placeholder="Ник игрока" :show-counter="false" v-model="gameHostOptions.additionalAdmin">
                                    </b-input>
                                </b-field>
                                <b-switch :value="true" type="is-info" style="margin: 5px;margin-left: 0;" v-model="gameHostOptions.gameWithPassword">
                                    Игра с паролем
                                </b-switch>
                                <b-switch :value="true" type="is-info" style="margin: 5px;margin-left: 0;" v-model="gameHostOptions.allyCityTogether">
                                    Города союзников рядом
                                </b-switch>
                                <b-switch :value="true" type="is-info" style="margin: 5px;margin-left: 0;" v-model="gameHostOptions.clanFix">
                                    Фиксация кланов
                                </b-switch>
                                <b-switch :value="true" type="is-info" style="margin: 5px;margin-left: 0;" v-model="gameHostOptions.sharedArmy">
                                    Общие войска
                                </b-switch>
                                <b-switch :value="true" type="is-info" style="margin: 5px;margin-left: 0;" v-model="gameHostOptions.randomHero">
                                    Случайние герои
                                </b-switch>
                                <b-switch :value="true" type="is-info" style="margin: 5px;margin-left: 0;" v-model="gameHostOptions.randomRace">
                                    Случайные расы
                                </b-switch>
                            </div>
                            <div style="padding-left: 10%;">
                                <b-field label="Наблюдающие">
                                    <b-select placeholder="Нет" v-model="gameHostOptions.gameSpectator">
                                        <option
                                            v-for="option in availableSpectators"
                                            :value="option.id"
                                            :key="option.id">
                                            {{ option.name }}
                                        </option>
                                    </b-select>
                                </b-field>
                                <b-field label="Туман войны">
                                    <b-select placeholder="По умолчанию" v-model="gameHostOptions.gameFogOfWar">
                                        <option
                                            v-for="option in availableFogOfWar"
                                            :value="option.id"
                                            :key="option.id">
                                            {{ option.name }}
                                        </option>
                                    </b-select>
                                </b-field>
                            </div>
                        </div>
                    </b-collapse>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-primary" type="button" @click="host()">Захостить</button>
                    <button class="button" type="button" @click="stop()">Отмена</button>
                </footer>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Game, Player } from '../models/responses/GameModel';
import {playerColors} from "@/utilities/PlayerColors";
import MapUploadComponent from './MapUploadComponent.vue';
import {availableLanguages, i18n} from '@/I18n/languages';
import client from '@/services/Implementations/ApiClient';
import { IApiClient } from '../services/Abstractions/IApiClient';
import UserAuthModel from '../models/responses/UserAuthModel';
import MapLoader from '../services/Implementations/MapLoader';
import MapModel from '../models/responses/MapModel';
import { IDefaultContextHelper } from '../services/Abstractions/IDefaultContextHelper';
import DefaultContextHelper from '../services/Implementations/DefaultContextHelper';


@Component({
  components: {
  }
})
export default class GameHostComponent extends Vue {
    public client: IApiClient;
    public defaultHelper: IDefaultContextHelper = new DefaultContextHelper();

    public availableVersions = [
        {
            name: '1.26',
            value: 1,
        },
        {
            name: '1.29',
            value: 2,
        },
        {
            name: '1.31',
            value: 3,
        }
    ]

    public availableSpectators = [
        {
            name: "Нет",
            value: 1,
        },
        {
            name: "Все зрители",
            value: 2,
        },
        {
            name: "После поражения",
            value: 3,
        },
        {
            name: "Судьи",
            value: 4,
        },
    ]

    public availableFogOfWar = [
        {
            name: "По умолчанию",
            value: 1,
        },
        {
            name: "Скрыта",
            value: 2,
        },
        {
            name: "Разведана",
            value: 3,
        },
        {
            name: "Открыта",
            value: 4,
        },
    ]

    public gameHostOptions = {
        gameName: "",
        gameVersion: null,
        gameMap: '',
        additionalAdmin: "",
        gameWithPassword: false,
        allyCityTogether: true,
        clanFix: true,
        sharedArmy: false,
        randomHero: false,
        randomRace: false,
        gameSpectator: null,
        gameFogOfWar: null,
    }

    public mapLoader: MapLoader = new MapLoader();
    public gameMapFilter: string = "";
    public selectedMap;

    constructor() {
        super();

        this.client = client;
    }

    loadSettings() {
        let mapName = localStorage.getItem('lastHostedMap')
        
        if (mapName !== null && mapName !== undefined &&mapName !== '')
        {
            this.gameHostOptions.gameMap = mapName;

            // @ts-ignore
            this.$refs.mapNameChooser.setSelected(this.gameHostOptions.gameMap)
        }
    }

    storeSettings() {
        if (this.gameHostOptions.gameMap !== undefined)
        {
            //@ts-ignore
            localStorage.setItem('lastHostedMap', this.gameHostOptions.gameMap)
        }
    }

    setMap(option: string) {
        if (option !== null && option !== undefined)
        {
            //@ts-ignore
            this.gameHostOptions.gameMap = option.name || option;

            this.storeSettings()
        }
    }

    filteredDataObj() {
        if (this.mapLoader.mapList === undefined)
            return []

        return this.mapLoader.mapList.filter((option) => {
            return option.name
                .toString()
                .toLowerCase()
                .indexOf(this.gameMapFilter.toLowerCase()) >= 0
        })
    }

    async created() {
        console.time('mapParsing')
        await this.mapLoader.updateMaps().then(x => {
            console.timeEnd('mapParsing')
            this.loadSettings();
        })

    }

    host() {
        console.log(this.gameHostOptions)
        if (this.gameHostOptions.gameName === undefined || this.gameHostOptions.gameName === '' || this.gameHostOptions.gameName === null)
        {
            this.$awn.info('Задай имя игры', {})
            return;
        }

        if (this.gameHostOptions.gameMap === undefined || this.gameHostOptions.gameMap === '' || this.gameHostOptions.gameMap === null)
        {
            this.$awn.info('Задай карту для игры', {})
            return;
        }

        let patch = this.availableVersions[0];
        let observers = this.availableSpectators[0];
        let fogOfWWar = this.availableFogOfWar[0];


        if (this.gameHostOptions.gameVersion !== null)
        {
            // @ts-ignore
            patch = this.availableVersions[this.gameHostOptions.gameVersion];
        }

        if (this.gameHostOptions.gameSpectator !== null)
        {
            // @ts-ignore
            observers = this.availableSpectators[this.gameHostOptions.gameSpectator]
        }

        if (this.gameHostOptions.gameFogOfWar !== null)
        {
            // @ts-ignore
            fogOfWWar = this.availableFogOfWar[this.gameHostOptions.gameFogOfWar]
        }

        console.log('patch', patch)
        console.log('observers', observers)
        console.log('fogOfWWar', fogOfWWar)

        let flags = 0x8000;
		
		if(this.gameHostOptions.allyCityTogether)//( $('.ui.checkbox.teams.together').checkbox( "is checked" ) )
			flags = flags | ( 1 << 10 );
		
		if(this.gameHostOptions.clanFix)//( $('.ui.checkbox.fixed.teams').checkbox( "is checked" ) )
			flags = flags | ( 2 << 10 );

		if(this.gameHostOptions.sharedArmy)//( $('.ui.checkbox.unit.share').checkbox( "is checked" ) )
			flags = flags | ( 4 << 10 );
		
		if(this.gameHostOptions.randomHero)//( $('.ui.checkbox.random.hero').checkbox( "is checked" ) )
			flags = flags | ( 8 << 10 );
		
		if(this.gameHostOptions.randomRace)//( $('.ui.checkbox.random.races').checkbox( "is checked" ) )
			flags = flags | ( 16 << 10 );
		
		flags = flags | ( ( observers.value - 1 ) <<  8 );
		flags = flags | ( ( fogOfWWar.value - 1 ) <<  6 );
		
		if( flags == 36032 )
			flags = 0;

        this.client.sendMessage(this.defaultHelper.createCreateGame(
            this.gameHostOptions.gameWithPassword,
            this.gameHostOptions.gameMap,
            this.gameHostOptions.gameName,
            this.gameHostOptions.additionalAdmin,
            patch.value,
            flags,
        ))

        this.$awn.info('Хостую игру...', {})
        this.stop();
    }

    stop() {
        // @ts-ignore
        this.$parent.close()
    }
}
</script>

<style scoped lang="scss">
.shift-down {
    padding-top: 7px;
}
</style>