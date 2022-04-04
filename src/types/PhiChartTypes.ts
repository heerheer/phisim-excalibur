declare module PhiChartTypes {

    export interface SpeedEvent {
        startTime: number;
        endTime: number;
        floorPosition: number;
        value: number;
    }

    export interface NotesAbove {
        type: number;
        time: number;
        positionX: number;
        holdTime?: number;
        speed: number;
        floorPosition: number;
    }

    export interface NotesBelow {
        type: number;
        time: number;
        positionX: number;
        holdTime: number;
        speed: number;
        floorPosition: number;
    }

    export interface JudgeLineDisappearEvent {
        startTime: number;
        endTime: number;
        start: number;
        end: number;
        start2: number;
        end2: number;
    }

    export interface JudgeLineMoveEvent {
        startTime: number;
        endTime: number;
        start: number;
        end: number;
        start2: number;
        end2: number;
    }

    export interface JudgeLineRotateEvent {
        startTime: number;
        endTime: number;
        start: number;
        end: number;
        start2: number;
        end2: number;
    }

    export interface JudgeLineList {
        numOfNotes: number;
        numOfNotesAbove: number;
        numOfNotesBelow: number;
        bpm: number;
        speedEvents: SpeedEvent[];
        notesAbove: NotesAbove[];
        notesBelow: NotesBelow[];
        judgeLineDisappearEvents: JudgeLineDisappearEvent[];
        judgeLineMoveEvents: JudgeLineMoveEvent[];
        judgeLineRotateEvents: JudgeLineRotateEvent[];
    }

    export interface Chart {
        formatVersion: number;
        offset: number;
        numOfNotes: number;
        judgeLineList: JudgeLineList[];
    }

}
