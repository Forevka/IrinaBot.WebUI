import DataBuffer from '@/utilities/DataBuffer';
import { DefaultContextHeaders } from '@/models/enum/DefaultContextHeaders';
import { ContextTypesHeaders } from '@/models/enum/ContextTypesHeaders';
import { Player, Game } from '@/models/responses/GameModel';

export default class DefaultContextHelper {

	public static parseGameList(data: DataBuffer): Game[] {
		var gamescount = data.getUint16();
		var games: Game[] = [];

		while (games.length < gamescount) {
			let game = DefaultContextHelper.parseGame(data);
			game.formatPlayers();
			game.calcRealPlayersCount();
			games.push(game);
		}

		return games;
	}

	// Send Packages;

	public static createContextRequest() {
		var ab = new ArrayBuffer(3);
		var df = new DataView(ab);
		df.setInt8(0, 0); // GLOBAL CONTEXT
		df.setInt8(1, 1); // CONTEXT REQ
		df.setInt8(2, ContextTypesHeaders.DEFAULTCONTEXT);

		return ab;
	}

	public static createGetGameList() {
		var ab = new ArrayBuffer(2);
		var df = new DataView(ab);
		df.setInt8(0, ContextTypesHeaders.DEFAULTCONTEXT);
		df.setInt8(1, DefaultContextHeaders.GETGAMELIST);

		return ab;
	}

	public static createGetGameUDP(isPrivateKey, gameid, gamepassword) {
		var ab = new ArrayBuffer(7);
		var df = new DataView(ab);
		df.setInt8(0, ContextTypesHeaders.DEFAULTCONTEXT);
		df.setInt8(1, DefaultContextHeaders.GETUDPGAE);
		df.setInt8(2, isPrivateKey);
		df.setInt32(3, gameid, true);

		return new Blob([ab, gamepassword, new ArrayBuffer(1)]);
	}

	public static createGameSignal(gameid, signal) {
		var ab = new ArrayBuffer(6);
		var df = new DataView(ab);
		df.setInt8(0, ContextTypesHeaders.DEFAULTCONTEXT);
		df.setInt8(1, DefaultContextHeaders.SENDGAMEEXTERNALSIGNAL);
		df.setInt32(2, gameid, true);

		return new Blob([ab, signal, new ArrayBuffer(1)]);
	}


	public static createWsConnect() {
		var ab = new ArrayBuffer(2);
		var df = new DataView(ab);
		df.setInt8(0, ContextTypesHeaders.DEFAULTCONTEXT);
		df.setInt8(1, DefaultContextHeaders.GETWEBSOCKETCONNECT);

		return ab;
	}

	public static createCreateGame(fullprovate, map, gamename, owner, patch, flags) {
		var ab = new ArrayBuffer(7);
		var df = new DataView(ab);

		df.setInt8(0, ContextTypesHeaders.DEFAULTCONTEXT);
		df.setInt8(1, DefaultContextHeaders.CREATEGAME);
		if (fullprovate)
			df.setInt8(2, 1);
		df.setInt8(3, patch);
		df.setInt8(4, 0); // Find CFG
		df.setUint16(5, flags, true);

		return new Blob([ab, map, new ArrayBuffer(1), gamename, new ArrayBuffer(1), owner, new ArrayBuffer(1)]);
	}


	public static recerveWsConnect(databuffer: DataBuffer) {
		return databuffer.getInt32();
	}

	public static sendMessage(mFrom, mTo, mText) {
		var ab = new ArrayBuffer(2);
		var df = new DataView(ab);

		df.setInt8(0, ContextTypesHeaders.DEFAULTCONTEXT);
		df.setInt8(1, DefaultContextHeaders.SENDMESSAGE);
		return new Blob([ab, mTo, new ArrayBuffer(1), mFrom, new ArrayBuffer(1), mText, new ArrayBuffer(1)]);
	}

	public static recerveMessage(data: DataBuffer) {
		return { "mTo": data.getNullTerminatedString(), "mFrom": data.getNullTerminatedString(), "mText": data.getNullTerminatedString() };
	}

	public static recerveCreateGameResponse(data: DataBuffer) {
		return { "code": data.getInt8(), "description": data.getNullTerminatedString(), "password": data.getNullTerminatedString() };
	}

	public static recerveMapInfo(data: DataBuffer) {
		var resp: any = {};

		resp.mapname = data.getNullTerminatedString();

		var tgasize = data.getUint32();

		resp.tga = new Uint8Array(data.getArray(tgasize)).buffer;
		resp.autor = data.getNullTerminatedString();
		resp.description = data.getNullTerminatedString();
		resp.players = data.getNullTerminatedString();

		return resp;
	}


	public static createGetMapInfo(gameid) {
		var ab = new ArrayBuffer(7);
		var df = new DataView(ab);
		df.setInt8(0, ContextTypesHeaders.DEFAULTCONTEXT);
		df.setInt8(1, DefaultContextHeaders.GETMAPINFO);
		df.setInt32(2, gameid, true);

		return ab;
	}

	public static parseGame(data: DataBuffer): Game {
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
			gameModel.players.push(DefaultContextHelper.parseGamePlayer(data));

		return gameModel;
	}



	public static parseGamePlayer(data: DataBuffer): Player {
		let gamePlayer: Player = new Player();

		gamePlayer.color = data.getUint8();
		gamePlayer.name = data.getNullTerminatedString();
		gamePlayer.realm = data.getNullTerminatedString();
		gamePlayer.comment = data.getNullTerminatedString();

		return gamePlayer
	}
}