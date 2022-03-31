import axios, {AxiosInstance} from "axios";

export interface ChartInfo {
    name: string;
    codename: string;
    artist: string;
    musicFile: string;
    //rankings
    inRanking?: number;
    hdRanking?: number;
    chartIN?: string;
    chartHD?: string;
    ezRanking?: number;
    atRanking?: number;
    chartEZ?: string;
    chartAT?: string;
    chartSP?: string;
    spRanking?: number;
    illustration?: string;
    chartDesigner?: string;
    illustrator?: string;
    sliceAudioStart?: string;
}


export class ChartApi {
    private _api: string;
    private axios: AxiosInstance;
    charts: Array<ChartInfo> = []

    constructor(api: string) {
        this._api = api;
        this.axios = axios.create({
            baseURL: api
        })
        //this.init().catch(x => console.log(x));
    }

    async getChartList(): Promise<Array<{ name: string }>> {
        return (await this.axios(`/list.json`)).data
    }

    async init() {
        let list = await this.getChartList();
        for (const x of list) {
            this.charts.push(await this.getChartInfo(x.name));
        }
    }

    private async getChartInfo(name: string): Promise<ChartInfo> {
        return (await this.axios(`/${name}/meta.json`)).data
    }

    async getChartJson(code: string, diff: string) {
        return (await this.axios(`/${code}/Chart_${diff}.json`)).data
    }

    getChartIllustrationUrl(info: ChartInfo) {
        return this._api + `/${info.codename}/${info.illustration}`
    }

    async getChartMusicData(info: ChartInfo): Promise<ArrayBuffer> {
        let p = await this.axios.get(`/${info.codename}/${info.musicFile}`, {responseType: "arraybuffer"})
        return p.data
    }

}
