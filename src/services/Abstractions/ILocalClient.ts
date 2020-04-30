export default interface ILocalClient {
    reconect(): void;
    reconectIfNeed(): void;
    isConnected(): boolean;
    afterConnect(callback: Function): void;
    addHandler(callback: Function, header: number): void;
    removeHandler(callback: Function, header: number): void;
    sendMessage(msg: ArrayBuffer): void;
}