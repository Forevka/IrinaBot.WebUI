import { Game } from '@/models/responses/GameModel';

export default class GamePool {
    private games: Map<number, Game>;
    public gameList: Game[];

    constructor() {
        this.games = new Map<number, Game>();
        this.gameList = [];
    }

    public newGames(newGames: Game[]) {
        let newGamesIds = newGames.map(x => x.gameCounter);

        Array.from(this.games.keys()).forEach(x => {
            if (!newGamesIds.includes(x))
            {
                this.games.delete(x);
            }
        });


        newGames.forEach(newGame => {
            let oldGame = this.games.get(newGame.gameCounter);
            if (oldGame === undefined) {
                newGame.calcPlayers();

                this.games.set(newGame.gameCounter, newGame);
            } else {
                oldGame.isStarted = newGame.isStarted;
                oldGame.name = newGame.name;
                oldGame.hasAdmin = newGame.hasAdmin;
                oldGame.hasPassword = newGame.hasPassword;
                oldGame.hasGamePowerUp = newGame.hasGamePowerUp;
                oldGame.gameCounter = newGame.gameCounter;
                oldGame.gameTicks = newGame.gameTicks;
                oldGame.creatorId = newGame.creatorId;
                oldGame.iccuphost = newGame.iccuphost;
                oldGame.slotfslg = newGame.slotfslg;
                oldGame.maxPlayers = newGame.maxPlayers;
                oldGame.playersCount = newGame.playersCount;
                oldGame.players = newGame.players;
                
                oldGame.calcPlayers();
            }
        });

        this.convertGameList();
    }

    /**
     * convertGameList
     */
    public convertGameList() {
        this.gameList = Array.from(this.games.values());
    }

    startedGames() {
        return this.gameList.filter(x => x.isStarted === 1);
    }

    powerUpGames() {
        return this.gameList.filter(x => x.hasGamePowerUp === 1 && x.isStarted === 0);
    }

    notStartedGames() {
        return this.gameList.filter(x => x.isStarted === 0 && x.hasGamePowerUp === 0)
    }
}