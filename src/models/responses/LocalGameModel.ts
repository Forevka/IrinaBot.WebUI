export default class LocalGameModel {
    public localGameId: number;
    public gameName: string;
    public mapName: string;
}

export class LocalGameList {
    public localConnects: number;
    public gameCount: number;
    public gameList: LocalGameModel[];
}