import DataBuffer from '@/utilities/DataBuffer';
import { Dictionary } from 'vue-router/types/router';
import ILocalClient from '../Abstractions/ILocalClient';
import eventBus from "@/utilities/EventBus";

class LocalClient implements ILocalClient {
    private _client: WebSocket;
    private _websocketUrl: string = "ws://127.0.0.1:8148"

    private _isConnected: boolean = false;

    private _handlerList: Dictionary<Array<Function>> = {};

    private _afterConnectCallbacks: Array<Function> = [];

    constructor() {
        this.reconect()
    }

    public reconect(): void {
        try {
            this._client = new WebSocket(this._websocketUrl)
        }catch(err)
        {
            console.log('errr', err)
        }
        

        this._client.onopen = () => {
            this._isConnected = true;
            
            this._afterConnectCallbacks.forEach(callback => {
                callback();
            });

            this._afterConnectCallbacks = [];
        };

        this._client.onclose = (ev: Event) => {
            this._isConnected = false;
            console.log('closing')
            console.log(ev)
            eventBus.emit("localSocketClosed", {})
        }

        this._client.onerror = (ev: Event) => {
            this._isConnected = false;
            console.log('error')
            console.log(ev)
        }

        this._client.onmessage = (event: MessageEvent) => {
            this.onMessage(event);
        }
    }

    public reconectIfNeed(): void {
        if (!this.isConnected())
            this.reconect();
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
            if (handlerList === undefined)
            {
                console.warn("For header "+header+" doe`snt exist any handler")
                return;   
            }

            handlerList.forEach(handler => {
                handler(dataBuffer);
            })
        })
    }

    public addHandler(callback: Function, header: number): void {
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