import DataBuffer from '@/utilities/DataBuffer';
import { Dictionary } from 'vue-router/types/router';
import ILocalClient from '../Abstractions/ILocalClient';
import eventBus from "@/utilities/EventBus";
import LocalGameModel, { LocalGameList } from '@/models/responses/LocalGameModel';

class LocalClient implements ILocalClient {
    private _client: WebSocket;
    private _websocketUrl: string = "ws://127.0.0.1:8148"

    public _localGames: LocalGameList;

    private _isConnected: boolean = false;
    public _isReconnecting: boolean = false;

    private _handlerList: Dictionary<Array<Function>> = {};

    private _afterConnectCallbacks: Array<Function> = [];

    public reconect(): void {
        this._isReconnecting = true;
        this._client = new WebSocket(this._websocketUrl)


        this._client.onopen = () => {
            this._isConnected = true;
            this._isReconnecting = false;

            this._afterConnectCallbacks.forEach(callback => {
                callback();
            });

            this._afterConnectCallbacks = [];
            eventBus.emit("localSocketConnected", {})
        };

        this._client.onclose = (ev: Event) => {
            this._isConnected = false;
            this._isReconnecting = false;

            eventBus.emit("localSocketClosed", {})
        }

        this._client.onerror = (ev: Event) => {
            this._isConnected = false;

            eventBus.emit("localSocketError", {})
        }

        this._client.onmessage = (event: MessageEvent) => {
            this.onMessage(event);
        }
    }

    public reconectIfNeed(): void {
        if (!this.isConnected())
            this.reconect();
    }

    public isReconnecting(): boolean {
        return this._isReconnecting;
    }

    public isConnected(): boolean {
        return this._isConnected;
    }

    public afterConnect(callback: Function): void {
        if (this._isConnected === false)
            this._afterConnectCallbacks.push(callback);
        else
            callback()
    }

    private onMessage(event: MessageEvent): void {
        event.data.arrayBuffer().then((data: ArrayBuffer) => {
            let dataBuffer = new DataBuffer(data);

            let header = dataBuffer.getUint8();

            //console.log(context, header)
            //console.log(this._handlersDict)

            let handlerList = this._handlerList[header];
            if (handlerList === undefined) {
                console.warn("For header " + header + " doe`snt exist any handler")
                return;
            }

            handlerList.forEach((handler) => {
                handler(this, dataBuffer);
            })
        })
    }

    public onLocalGameList(me: ILocalClient, message: DataBuffer): void {
        // @ts-ignore
        me._localGames = new LocalGameList();
        // @ts-ignore
        me._localGames.localConnects = message.getUint16();
        // @ts-ignore
        me._localGames.gameCount = message.getUint16();
        // @ts-ignore
        me._localGames.gameList = new Array<LocalGameModel>();

        // @ts-ignore
        for (let i = 0; i < me._localGames.gameCount; ++i) 
        {
            let game = new LocalGameModel();
            game.localGameId = message.getUint32();
            game.gameName = message.getNullTerminatedString();
            game.mapName = message.getNullTerminatedString();

            // @ts-ignore
            me._localGames.gameList.push(game);
        }
    }

    localGames(): LocalGameList {
        return this._localGames;
    }

    public addHandler(callback: Function, header: number): void {
        if (this._handlerList[header] === undefined)
            this._handlerList[header] = []
        this._handlerList[header].push(callback)
    }

    public removeHandler(callback: Function, header: number): void {
        this._handlerList[header] = this._handlerList[header].filter(x => x != callback);
    }

    public sendMessage(msg: ArrayBuffer): void {
        //console.log(msg)
        if (this._isConnected)
            this._client.send(msg);
    }
}


export default new LocalClient();