import DataBuffer from '@/utilities/DataBuffer';

export default interface ILocalClient {
    reconect(): void;
    reconectIfNeed(): void;
    isConnected(): boolean;
    afterConnect(callback: Function): void;
    addHandler(callback: Function, header: number): void;
    removeHandler(callback: Function, header: number): void;
    sendMessage(msg: ArrayBuffer | Blob | SharedArrayBuffer): void;
    isReconnecting(): boolean;
    onLocalGameList(me: ILocalClient, message: DataBuffer): void;
}