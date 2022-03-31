//ts2json得到的json文件中对象结构
declare module PhiChart {

    export interface BPMList {
        bpm: number;
        startTime: number[];
    }

    export interface META {
        RPEVersion: number;
        background: string;
        charter: string;
        composer: string;
        id: string;
        level: string;
        name: string;
        offset: number;
        song: string;
    }

    export interface AlphaEvent {
        easingType: number;
        end: number;
        endTime: number[];
        linkgroup: number;
        start: number;
        startTime: number[];
    }

    export interface MoveXEvent {
        easingType: number;
        end: number;
        endTime: number[];
        linkgroup: number;
        start: number;
        startTime: number[];
    }

    export interface MoveYEvent {
        easingType: number;
        end: number;
        endTime: number[];
        linkgroup: number;
        start: number;
        startTime: number[];
    }

    export interface RotateEvent {
        easingType: number;
        end: number;
        endTime: number[];
        linkgroup: number;
        start: number;
        startTime: number[];
    }

    export interface SpeedEvent {
        easingType: number;
        end: number;
        endTime: number[];
        linkgroup: number;
        start: number;
        startTime: number[];
    }

    export interface EventLayer {
        alphaEvents: AlphaEvent[];
        moveXEvents: MoveXEvent[];
        moveYEvents: MoveYEvent[];
        rotateEvents: RotateEvent[];
        speedEvents: SpeedEvent[];
    }

    export interface Note {
        above: number;
        alpha: number;
        endTime: number[];
        isFake: number;
        positionX: number;
        size: number;
        speed: number;
        startTime: number[];
        type: number;
        visibleTime: number;
        yOffset: number;
    }

    export interface JudgeLine {
        Group: number;
        Name: string;
        Texture: string;
        eventLayers: EventLayer[];
        isCover: number;
        notes: Note[];
        numOfNotes: number;
    }

    export interface Chart {
        BPMList: BPMList[];
        META: META;
        judgeLineGroup: string[];
        judgeLineList: JudgeLine[];
    }

}
