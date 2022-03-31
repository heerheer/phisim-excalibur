import {Note} from "./Note";

export interface JudgeLineEventBase {
    startTime: number;
    endTime: number;
}

export interface JudgeLineSpeedEvent extends JudgeLineEventBase {
    value: number;
    floorPosition?: number
}

export interface JudgeLineDisappearEvent extends JudgeLineEventBase {
    start: number;
    end: number;
    start2: number;
    end2: number
}

export interface JudgeLineMoveEvent extends JudgeLineEventBase {
    start: number;
    end: number;
    start2: number;
    end2: number
}

export interface JudgeLinRotateEvent extends JudgeLineEventBase {
    start: number;
    end: number;
    start2: number;
    end2: number
}

export interface JudgeLineDisappearEventPec extends JudgeLineEventBase {
    value: number;
    motionType: number
}

export interface JudgeLineMoveEventPec extends JudgeLineEventBase {
    value: number;
    value2: number;
    motionType: number;
}

export interface JudgeLinRotateEventPec extends JudgeLineEventBase {
    value: number;
    motionType: number;
}


export class JudgeLine {
    numOfNotes: number = 0;
    numOfNotesAbove: number = 0;
    numOfNotesBelow: number = 0;
    bpm: number = 120;

    //Note
    notesAbove: Array<Note> = [];
    notesBelow: Array<Note> = [];


    speedEvents: Array<JudgeLineSpeedEvent> = [];
    judgeLineDisappearEvents: Array<JudgeLineDisappearEvent> = [];
    judgeLineMoveEvents: Array<JudgeLineMoveEvent> = [];
    judgeLineRotateEvents: Array<JudgeLinRotateEvent> = [];
    judgeLineDisappearEventsPec: Array<JudgeLineDisappearEventPec> = [];
    judgeLineMoveEventsPec: Array<JudgeLineMoveEventPec> = [];
    judgeLineRotateEventsPec: Array<JudgeLinRotateEventPec> = [];

    constructor(bpm: number) {
        this.bpm = bpm;
    }

    pushNote(note: Note, pos: number, isFake: boolean) {
        switch (pos) {
            case undefined:
            case 1:
                this.notesAbove.push(note);
                break;
            case 2:
                this.notesBelow.push(note);
                break;
            default:
                throw "wrong note position"
        }
        if (!isFake) {
            this.numOfNotes++;
            this.numOfNotesAbove++;
        }
    }

    pushEvent(type: number, startTime: number, endTime: number, n1: number, n2?: number, n3?: number, n4?: number) {
        if (typeof startTime == 'number' && typeof endTime == 'number' && startTime > endTime) {
            console.warn("Warning: startTime " + startTime + " is larger than endTime " + endTime);
        }
        switch (type) {
            case 0:
                this.speedEvents.push({startTime, endTime, value: n1});
                break;
            case 1:
                this.judgeLineDisappearEvents.push({startTime, endTime, start: n1, end: n2!, start2: 0, end2: 0});
                break;
            case 2:
                this.judgeLineMoveEvents.push({startTime, endTime, start: n1, end: n2!, start2: n3!, end2: n4!});
                break;
            case 3:
                this.judgeLineRotateEvents.push({startTime, endTime, start: n1, end: n2!, start2: 0, end2: 0});
                break;
            case -1:
                this.judgeLineDisappearEventsPec.push({startTime, endTime, value: n1, motionType: 1});
                break;
            case -2:
                this.judgeLineMoveEventsPec.push({startTime, endTime, value: n1, value2: n2!, motionType: n3!});
                break;
            case -3:
                this.judgeLineRotateEventsPec.push({startTime, endTime, value: n1, motionType: n2!});
                break;
            default:
                throw `Unexpected Event Type: ${type}`;
        }
    }
}
