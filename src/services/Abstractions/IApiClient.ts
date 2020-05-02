import { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';

import {GlobalContextHeaders} from "@/models/enum/GlobalContextHeaders";
import {DefaultContextHeaders} from "@/models/enum/DefaultContextHeaders";
import { MapUploaderContextHeaders } from '@/models/enum/MapUploadContextHeaders';

export interface IApiClient {
    //updateToken(): Promise<void>;
    sendMessage(msg: ArrayBuffer | Blob): void;
    addDefaultHandler(callback: Function, header: DefaultContextHeaders): void;
    addGlobalHandler(callback: Function, header: GlobalContextHeaders): void;
    addMapUploadHandler(callback: Function, header: MapUploaderContextHeaders): void;

    removeDefaultHandler(callback: Function, header: DefaultContextHeaders): void;
    removeGlobalHandler(callback: Function, header: DefaultContextHeaders): void;
    removeMapUploadHandler(callback: Function, header: MapUploaderContextHeaders): void;
    
    afterConnect(callback: Function): void;
}