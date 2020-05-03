import DataBuffer from '@/utilities/DataBuffer';
import { Game, Player } from '@/models/responses/GameModel';
import MessageModel from '@/models/responses/MessageModel';
import CreateGameModel from '@/models/responses/CreateGameModel';
import GameMapPreviewModel from '@/models/responses/GameMapPreviewModel';

export interface IDefaultContextHelper {
    createContextRequest(): ArrayBuffer;
    createGetGameList(): ArrayBuffer;
    createGetGameUDP(isPrivateKey: number, gameid: number, gamepassword: string): Blob;
    createGameSignal(gameid: number, signal: string): Blob;
    createWsConnect(): ArrayBuffer;
    createCreateGame(isPrivate: boolean, map: string, gamename: string, owner: string, patch: number, flags: number): Blob;
    createMessage(mFrom: string, mTo: string, mText: string): Blob;
    createGetMapInfo(gameid: number): ArrayBuffer;

    parseWsConnect(databuffer: DataBuffer): number;
    parseMessage(data: DataBuffer): MessageModel;
    parseCreateGameResponse(data: DataBuffer): CreateGameModel;
    parseMapInfo(data: DataBuffer): GameMapPreviewModel;
    parseGame(data: DataBuffer): Game;
    parseGamePlayer(data: DataBuffer): Player;
    parseGameList(data: DataBuffer): Game[];
}