<template>
    <div class="map-upload-wrapper" style="min-width: 100%; width: 100%;">
        <form action="">
            <div class="modal-card" style="min-width: 100%; width: 100%;">
                <header class="modal-card-head">
                    <p class="modal-card-title">Выбери карту</p>
                </header>
                <section class="modal-card-body">
                    <b-field>
                        <b-upload v-model="dropFile" 
                            drag-drop
                            v-on:input="newFile"
                            :loading="isLoadingMap"
                            style="left: 50%;transform: translate(-50%, 0%);">
                            <section class="section">
                                <div class="content has-text-centered">
                                    <p>
                                        <b-icon
                                            icon="upload"
                                            size="is-large">
                                        </b-icon>
                                    </p>
                                    <p v-if="dropFile.name === 'startFile'">
                                        Перетяни картy сюда или нажми что-бы выбрать
                                    </p>
                                    <p v-else>
                                        Жми кнопку загрузить или выбери другой файл
                                    </p>
                                </div>
                            </section>
                        </b-upload>
                    </b-field>

                    <div class="tags">
                        <span class="tag is-primary" v-if="dropFile.name !== 'startFile'">
                            {{dropFile.name}}
                            <button class="delete is-small"
                                type="button"
                                @click="clearFile()">
                            </button>
                        </span>
                    </div>
                <b-progress v-model="progress"></b-progress>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-primary" type="button" :disabled="dropFile.name === 'startFile'" @click="startUpload()">Загрузить</button>
                    <button class="button" type="button" @click="stop()">Отмена</button>
                </footer>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IApiClient } from '../services/Abstractions/IApiClient';
import client from "@/services/Implementations/ApiClient";
import IMapUploadContextHelper from "@/services/Abstractions/IMapUploadContextHelper";
import MapUploaderContextHelper from "@/services/Implementations/MapUploadContextHelper";
import { MapUploaderContextHeaders } from '../models/enum/MapUploadContextHeaders';
import DataBuffer from '../utilities/DataBuffer';
import ErrorModel from '../models/responses/ErrorModel';


@Component({
  components: {
  }
})
export default class MapUploadComponent extends Vue {
    public dropFile: File = new File([""], "startFile");
    public isLoadingMap: boolean = false;
    public client: IApiClient;

    private mapUploader: IMapUploadContextHelper = new MapUploaderContextHelper();
    private progress: number = 0;

    private currentChank: number = 0;
    private maxChunkCount: number = 2;

    private sendedBytes: number = 0;
    private mapSizeBytes: number = 0;

    private chunkSize: number = 2048 * 2;

    constructor() {
        super();
    }

    stop() {
        // @ts-ignore
        this.$parent.close()
    }

    clearFile() {
        this.dropFile = new File([''], 'startFile');
    }

    created() {
        this.client = client;

        this.client.addMapUploadHandler(this.mapPartOk, MapUploaderContextHeaders.MapPartOkAnswer)
        this.client.addMapUploadHandler(this.mapLoaded, MapUploaderContextHeaders.MapSavedAnswer)
        console.log(this)

        this.$root.$on('mapAlreadyExist', this.mapAlreadyExist)
    }

    beforeDestroy() {
        this.client.removeMapUploadHandler(this.mapPartOk, MapUploaderContextHeaders.MapPartOkAnswer);
        this.client.removeMapUploadHandler(this.mapLoaded, MapUploaderContextHeaders.MapSavedAnswer);

        this.$root.$off('mapAlreadyExist', this.mapAlreadyExist)
    }

    mapAlreadyExist(error: ErrorModel) {
        this.$awn.warning(error.description, {});
        this.stop();
    }

    mapPartOk(message: DataBuffer) {
        //часть карты загружена
        let savedBytesAmount = this.mapUploader.parseMapPartOK(message);
        console.log('SavedBytes !! ' + savedBytesAmount);
        this.sendMapPart();
    }

    sendMapPart() {
        if (this.sendedBytes < this.mapSizeBytes) {
            if (this.dropFile !== undefined)
            {
                let endPos = this.sendedBytes + this.chunkSize;
                if (endPos > this.mapSizeBytes)
                    endPos = this.mapSizeBytes;

                this.client.sendMessage(this.mapUploader.createMapPart(this.dropFile.slice(this.sendedBytes, endPos)));

                this.sendedBytes = endPos;
                this.progress = (this.sendedBytes / this.mapSizeBytes) * 100;

                if (this.sendedBytes === this.mapSizeBytes) {
                    this.client.sendMessage(this.mapUploader.createMapSave())
                    this.isLoadingMap = true;
                    return;
                }
            }
        }
    }

    mapLoaded(message: DataBuffer) {
        //карта загружена
        let loadedMap = this.mapUploader.parseMapSaved(message);
        this.$awn.success(loadedMap, {});

        this.isLoadingMap = false;

        this.stop();
    }

    startUpload() {
        if (this.dropFile === undefined)
        {
            this.$awn.info('Сначала выбери карту!', {})
            return;
        }
        this.$awn.info('Начинаю загрузку карты...', {})

        this.client.sendMessage(this.mapUploader.createContextRequest(this.dropFile.size, this.dropFile.name))

        this.sendedBytes = 0;
        this.mapSizeBytes = this.dropFile.size;

        this.progress = 0;
        this.isLoadingMap = true;

        this.sendMapPart();
    }

    newFile(file: File) {
        console.log(file);
        if (file.name.endsWith('.w3x') || file.name.endsWith('.w3m'))
        {
            this.dropFile = file;
            return;
        }

        this.$awn.warning('Можно загрузить только файлы формата .w3x/.w3m', {});
        this.dropFile = new File([""], "startFile");
        return;
    }
}
</script>

<style scoped lang="scss">

</style>