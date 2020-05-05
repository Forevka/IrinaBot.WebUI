export class Game {
    public isStarted: number;
    public name: string;
    public hasAdmin: number;
    public hasPassword: number;
    public hasGamePowerUp: number;
    public gameCounter: number;
    public gameTicks: number;
    public creatorId: number;
    public iccuphost: string;
    public slotfslg: number;
    public maxPlayers: number;
    public playersCount: number;
    public players: Player[] = [];

    public formattedPlayers: string;
    public realPlayersCount: number;

    private playerColors = [ "red", "blue", "teal", "#540080", "yellow", "orange", "green", "pink", "#959697", "#7EBFF1", "#106246", "#4e2a04", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000" ];

    public calcPlayers(): void {
        this.realPlayersCount = 0;
        this.formattedPlayers = '';

        this.players.forEach(player => {
            if (player.name != "")
            {
                this.realPlayersCount += 1;
                this.formattedPlayers += `<div class="player-name" style="color: ${this.playerColors[player.color]};text-shadow: 0 0 1px black;white-space: nowrap;">` + player.name + "</div>";
            }
        });
    }
}

export class Player {
    public color: number;
    public name: string;
    public realm: string;
    public comment: string;
}