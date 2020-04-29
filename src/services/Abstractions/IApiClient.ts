import { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';

import {GlobalContextHeaders} from "@/models/enum/GlobalContextHeaders";
import {DefaultContextHeaders} from "@/models/enum/DefaultContextHeaders";

export interface IApiClient {
    //updateToken(): Promise<void>;
    sendMessage(msg: ArrayBuffer): void;
    addDefaultHandler(callback: Function, header: DefaultContextHeaders): void;
    addGlobalHandler(callback: Function, header: GlobalContextHeaders): void;

    removeDefaultHandler(callback: Function, header: DefaultContextHeaders): void
    
    afterConnect(callback: Function): void;
}