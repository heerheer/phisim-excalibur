export class Note {

    type: number;
    time: number;
    positionX: number;
    holdTime: number;
    speed: number
    floorPosition: number;

    constructor(type: number, time: number, x: number, holdTime: number, speed: number) {
        this.type = type;
        this.time = time;
        this.positionX = x;
        this.holdTime = type == 3 ? holdTime : 0;
        this.speed = isNaN(speed) ? 1 : speed; //默认值不为0不能改成Number(speed)||1
        this.floorPosition = 0;
        //this.floorPosition = time % 1e9 / 104 * 1.2;
    }
}
