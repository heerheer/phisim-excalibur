import {ref} from "vue";
import {ChartInfo} from "./ChartApi";

type difficulties = "EZ" | "HD" | "IN" | "AT" | "SP"

export class SongListUtil {
    public static difficulty = ref('EZ');

    public static set(d: difficulties) {
        SongListUtil.difficulty.value = d;
        //getCurrentInstance()?.proxy?.$forceUpdate();
    }

    public static data2play: {
        illustration?: string;
        json?: string, music?: ArrayBuffer;
        chartInfo?: ChartInfo;
    } = {
        illustration: "",
        json: undefined,
        music: undefined,
        chartInfo: undefined
    }


}

