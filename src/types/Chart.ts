import MoveXEvent = RpeChartTypes.MoveXEvent;
import RotateEvent = RpeChartTypes.RotateEvent;
import MoveYEvent = RpeChartTypes.MoveYEvent;
import AlphaEvent = RpeChartTypes.AlphaEvent;
import SpeedEvent = RpeChartTypes.SpeedEvent;


interface ITickObject {
    startTick: number;
    endTick: number;
}

export interface VJudgeLineEvent<T> extends ITickObject {
    event: T
}

export interface VNote extends RpeChartTypes.Note, ITickObject {
    index: { judgeIndex: number, index: number }
}

export interface VJudgeLine extends RpeChartTypes.JudgeLine {
    alphaEvents: VJudgeLineEvent<AlphaEvent>[];
    moveXEvents: VJudgeLineEvent<MoveXEvent>[];
    moveYEvents: VJudgeLineEvent<MoveYEvent>[];
    rotateEvents: VJudgeLineEvent<RotateEvent>[];
    speedEvents: VJudgeLineEvent<SpeedEvent>[];
}


