import MoveXEvent = PhiChart.MoveXEvent;
import RotateEvent = PhiChart.RotateEvent;
import MoveYEvent = PhiChart.MoveYEvent;
import AlphaEvent = PhiChart.AlphaEvent;
import SpeedEvent = PhiChart.SpeedEvent;


interface ITickObject {
    startTick: number;
    endTick: number;
}

export interface VJudgeLineEvent<T> extends ITickObject {
    event: T
}

export interface VNote extends PhiChart.Note, ITickObject {
    index: { judgeIndex: number, index: number }
}

export interface VJudgeLine extends PhiChart.JudgeLine {
    alphaEvents: VJudgeLineEvent<AlphaEvent>[];
    moveXEvents: VJudgeLineEvent<MoveXEvent>[];
    moveYEvents: VJudgeLineEvent<MoveYEvent>[];
    rotateEvents: VJudgeLineEvent<RotateEvent>[];
    speedEvents: VJudgeLineEvent<SpeedEvent>[];
}


