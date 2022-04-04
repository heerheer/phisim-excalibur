export class SetManager {
    public static speedRatio: number = 60; //帧率

    public static tickSpeed = () => {
        return 10 * 120 / SetManager.speedRatio
    }; //1tick走多长

    public static drawPosBlock: boolean = true//绘制定位点
}
