import {ref} from "vue";

type difficulties = "EZ" | "HD" | "IN" | "AT" | "SP"

export class SongListUtil {
    public static difficulty = ref('EZ');

    public static set(d: difficulties) {
        SongListUtil.difficulty.value = d;
        //getCurrentInstance()?.proxy?.$forceUpdate();
    }

    public static data2play: { json?: string, music?: ArrayBuffer } = {
        json: undefined,
        music: undefined
    }


}

