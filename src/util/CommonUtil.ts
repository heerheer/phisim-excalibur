import mitt from 'mitt'
export class CommonUtil {
    static wait(time: number) {
        return new Promise(res => {
            setTimeout(() => {
                res(0)
            }, time)
        })
    }

    static mitt = mitt()
}
