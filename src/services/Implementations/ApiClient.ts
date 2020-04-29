import { IApiClient } from '../Abstractions/IApiClient';
import DataBuffer from '@/utilities/DataBuffer';
import { Dictionary } from 'vue-router/types/router';
import { ContextTypesHeaders } from "@/models/enum/ContextTypesHeaders";

import { GlobalContextHeaders } from "@/models/enum/GlobalContextHeaders";
import { DefaultContextHeaders } from "@/models/enum/DefaultContextHeaders";

class ApiClient implements IApiClient {
    private _client: WebSocket;
    private _websocketUrl: string = "ws://irinabot.ru/ghost/"

    private _isConnected: boolean = false;

    private _handlersDict: Dictionary<Dictionary<Array<Function>>> = {};

    private _handlerDefaultContextList: Dictionary<Array<Function>> = {};
    private _handlerGlobalContextList: Dictionary<Array<Function>> = {};

    private _afterConnectCallbacks: Array<Function> = [];

    constructor() {
        this._client = new WebSocket(this._websocketUrl)
        //this._axiosClient.interceptors.response.use((response) => this.authTokenExpiredInterceptor(response))
        this._client.onopen = () => {
            this._isConnected = true;
            
            this._afterConnectCallbacks.forEach(callback => {
                callback();
            });

            this._afterConnectCallbacks = [];
        };

        this._client.onclose = () => {
            this._isConnected = false;
        }

        this._client.onerror = () => {
            this._isConnected = false;
        }

        this._client.onmessage = (event: MessageEvent) => {
            this.onMessage(event);
        }

        this._handlersDict[ContextTypesHeaders.DEFAULTCONTEXT] = this._handlerDefaultContextList;
        this._handlersDict[ContextTypesHeaders.GLOBALCONTEXT] = this._handlerGlobalContextList;
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

            let context = dataBuffer.getUint8();
            let header = dataBuffer.getUint8();

            //console.log(context, header)
            //console.log(this._handlersDict)

            let handlers = this._handlersDict[context];
            if (handlers === null || handlers === undefined) {
                console.warn("Handlers for " + context + " context doesnt exist")
                return;
            }

            let handlersList = handlers[header];
            if (handlersList === null || handlersList === undefined) {
                console.warn("Handlers for " + header + " header doesnt exist")
                return;
            }

            handlersList.forEach(handler => {
                handler(dataBuffer);
            })

        })
    }

    public addDefaultHandler(callback: Function, header: DefaultContextHeaders): void {
        let handlerList = this._handlerDefaultContextList[header]
        if (handlerList === null || handlerList === undefined)
            this._handlerDefaultContextList[header] = []

        this._handlerDefaultContextList[header].push(callback);
    }

    public removeDefaultHandler(callback: Function, header: DefaultContextHeaders): void {
        this._handlerDefaultContextList[header] = this._handlerDefaultContextList[header].filter(x => x != callback);
    }

    public addGlobalHandler(callback: Function, header: GlobalContextHeaders): void {
        let handlerList = this._handlerGlobalContextList[header]
        if (handlerList === null || handlerList === undefined)
            this._handlerDefaultContextList[header] = []

        this._handlerGlobalContextList[header].push(callback);
    }

    public sendMessage(msg: ArrayBuffer): void {
        //console.log(msg)
        if (this._isConnected)
            this._client.send(msg);
    }

    /*private authTokenExpiredInterceptor(response: AxiosResponse<any>): AxiosResponse<any> {
        if (response.status === 401)
            console.log('unathorized')

        return response;
    }


    async get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this._axiosClient.get<T, R>(url, config);
    }

    async post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
        return this._axiosClient.post<T, R>(url, data, config);
    }*/
}

export default new ApiClient();