import axios, { AxiosInstance, AxiosResponse } from 'axios';
import MapModel from '@/models/responses/MapModel';

export default class MapLoader {
    private _axiosClient: AxiosInstance;

    public mapList: MapModel[];

    constructor() {
        this._axiosClient = axios.create({
            baseURL: 'https://maps.irinabot.ru/'
        })
        //this._axiosClient.interceptors.response.use((response) => this.authTokenExpiredInterceptor(response))
    }

    private async fetchMaps(): Promise<AxiosResponse> {
        return await this._axiosClient.get('', {})
    }

    public async updateMaps() {
        let mapPage = await this.fetchMaps();
        let parser = new DOMParser();
        let doc = parser.parseFromString(mapPage.data, "text/html");

        let els = doc.getElementsByTagName("a");

        this.mapList = new Array<MapModel>();

        for (var i = 1; i < els.length; ++i) {
            if (els[i].innerHTML.length > 0) {
                let map = new MapModel();
                map.name = els[i].innerHTML
                this.mapList.push(map);
            }
        }
        
    }
}