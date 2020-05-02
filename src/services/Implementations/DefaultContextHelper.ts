import DataBuffer from '@/utilities/DataBuffer';
import { DefaultContextHeaders } from '@/models/enum/DefaultContextHeaders';
import { ContextTypesHeaders } from '@/models/enum/ContextTypesHeaders';
import { Player, Game } from '@/models/responses/GameModel';
import GameMapPreviewModel from '@/models/responses/GameMapPreviewModel';
import CreateGameModel from '@/models/responses/CreateGameModel';
import MessageModel from '@/models/responses/MessageModel';
import { IDefaultContextHelper } from '../Abstractions/IDefaultContextHelper';

export default class DefaultContextHelper implements IDefaultContextHelper {

	public parseGameList(data: DataBuffer): Game[] {
		let gamescount = data.getUint16();
		let games: Game[] = [];

		while (games.length < gamescount) {
			let game = this.parseGame(data);
			//game.formatPlayers();
			//game.calcRealPlayersCount();
			games.push(game);
		}

		return games;
	}


	public createContextRequest(): ArrayBuffer {
		let ab = new ArrayBuffer(3);
		let df = new DataView(ab);

		df.setInt8(0, 0); // GLOBAL CONTEXT
		df.setInt8(1, 1); // CONTEXT REQ
		df.setInt8(2, ContextTypesHeaders.DefaultContext);

		return ab;
	}

	public createGetGameList(): ArrayBuffer {
		let ab = new ArrayBuffer(2);
		let df = new DataView(ab);

		df.setInt8(0, ContextTypesHeaders.DefaultContext);
		df.setInt8(1, DefaultContextHeaders.GameListRequest);

		return ab;
	}

	public createGetGameUDP(isPrivateKey: number, gameid: number, gamepassword: string): Blob {
		let ab = new ArrayBuffer(7);
		let df = new DataView(ab);

		df.setInt8(0, ContextTypesHeaders.DefaultContext);
		df.setInt8(1, DefaultContextHeaders.UpdGameRequest);
		df.setInt8(2, isPrivateKey);
		df.setInt32(3, gameid, true);

		return new Blob([ab, gamepassword, new ArrayBuffer(1)]);
	}

	public createGameSignal(gameid: number, signal: string): Blob {
		let ab = new ArrayBuffer(6);
		let df = new DataView(ab);
		
		df.setInt8(0, ContextTypesHeaders.DefaultContext);
		df.setInt8(1, DefaultContextHeaders.SendExternalGameSignalRequest);
		df.setInt32(2, gameid, true);

		return new Blob([ab, signal, new ArrayBuffer(1)]);
	}


	public createWsConnect(): ArrayBuffer {
		let ab = new ArrayBuffer(2);
		let df = new DataView(ab);

		df.setInt8(0, ContextTypesHeaders.DefaultContext);
		df.setInt8(1, DefaultContextHeaders.GetWebcoketConnectedRequest);

		return ab;
	}

	public createCreateGame(fullprivate: boolean, map: string, gamename: string, owner: string, patch: number, flags: number): Blob {
		let ab = new ArrayBuffer(7);
		let df = new DataView(ab);

		df.setInt8(0, ContextTypesHeaders.DefaultContext);
		df.setInt8(1, DefaultContextHeaders.CreateGameRequest);
		if (fullprivate)
			df.setInt8(2, 1);
		df.setInt8(3, patch);
		df.setInt8(4, 0); // Find CFG
		df.setUint16(5, flags, true);

		return new Blob([ab, map, new ArrayBuffer(1), gamename, new ArrayBuffer(1), owner, new ArrayBuffer(1)]);
	}


	public parseWsConnect(databuffer: DataBuffer): number {
		return databuffer.getInt32();
	}

	public createMessage(mFrom: string, mTo: string, mText: string): Blob {
		let ab = new ArrayBuffer(2);
		let df = new DataView(ab);

		df.setInt8(0, ContextTypesHeaders.DefaultContext);
		df.setInt8(1, DefaultContextHeaders.SendMessageRequest);

		return new Blob([ab, mTo, new ArrayBuffer(1), mFrom, new ArrayBuffer(1), mText, new ArrayBuffer(1)]);
	}

	public parseMessage(data: DataBuffer): MessageModel {
		let res: MessageModel = new MessageModel();

		res.mTo = data.getNullTerminatedString();
		res.mFrom = data.getNullTerminatedString();
		res.mText = data.getNullTerminatedString();

		return res;
	}

	public parseCreateGameResponse(data: DataBuffer): CreateGameModel {
		let res: CreateGameModel = new CreateGameModel()

		res.code = data.getInt8();
		res.description = data.getNullTerminatedString();
		res.password = data.getNullTerminatedString();

		return res;
	}

	public parseMapInfo(data: DataBuffer): GameMapPreviewModel {
		let resp: GameMapPreviewModel = new GameMapPreviewModel();

		resp.mapname = data.getNullTerminatedString();

		let tgasize = data.getUint32();

		resp.tga = new Uint8Array(data.getArray(tgasize)).buffer;
		resp.author = data.getNullTerminatedString();
		resp.description = data.getNullTerminatedString();
		resp.players = data.getNullTerminatedString();

		return resp;
	}


	public createGetMapInfo(gameid: number): ArrayBuffer {
		let ab = new ArrayBuffer(7);
		let df = new DataView(ab);

		df.setInt8(0, ContextTypesHeaders.DefaultContext);
		df.setInt8(1, DefaultContextHeaders.MapInfoRequest);
		df.setInt32(2, gameid, true);

		return ab;
	}

	public parseGame(data: DataBuffer): Game {
		let gameModel: Game = new Game();

		gameModel.isStarted = data.getInt8();
		gameModel.name = data.getNullTerminatedString();
		gameModel.hasAdmin = data.getInt8();
		gameModel.hasPassword = data.getInt8();
		gameModel.hasGamePowerUp = data.getInt8();
		gameModel.gameCounter = data.getInt32();
		gameModel.gameTicks = data.getInt32();
		gameModel.creatorId = data.getInt32();
		gameModel.iccuphost = data.getNullTerminatedString();
		gameModel.slotfslg = data.getInt8();
		gameModel.maxPlayers = data.getInt8();
		gameModel.playersCount = data.getInt8();

		/*if( window.authUser != null && this.creatorID == window.authUser.localID )
			gameModel.hasAdmin = true;*/

		while (gameModel.players.length < gameModel.playersCount)
			gameModel.players.push(this.parseGamePlayer(data));

		return gameModel;
	}



	public parseGamePlayer(data: DataBuffer): Player {
		let gamePlayer: Player = new Player();

		gamePlayer.color = data.getUint8();
		gamePlayer.name = data.getNullTerminatedString();
		gamePlayer.realm = data.getNullTerminatedString();
		gamePlayer.comment = data.getNullTerminatedString();

		return gamePlayer
	}
}
