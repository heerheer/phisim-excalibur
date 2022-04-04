import {Actor, Color, Engine, Util, vec, Vector} from "excalibur";
import {VJudgeLine, VJudgeLineEvent} from "../types/Chart";
import {EaseType} from "../types/EaseType";
import {MainManager} from "../managers/MainManager";
import {EaseUtil} from "../util/EaseUtil";
import {NoteActorManager} from "../managers/NoteManager";
import {NoteActor} from "./NoteActor";
import {SetManager} from "../managers/SetManager";


export class JudgeLineActor extends Actor {

    judgeLineData: VJudgeLine;
    noteManager: NoteActorManager = new NoteActorManager();
    speed: number = 10;
    private posActor?: Actor;

    constructor(data: VJudgeLine) {
        super({
            height: 3,
            width: 3600,
            color: Color.fromRGB(255, 255, 255, 0),
            pos: vec(0, -750)
        });
        this.judgeLineData = data;
        if (SetManager.drawPosBlock) {
            this.posActor = new Actor({pos: vec(0, 0), width: 100, height: 20, color: Color.Azure})
            //this.addChild(this.posActor)
        }
    }

    onInitialize(_engine: Engine) {
        super.onInitialize(_engine);
        //console.log(this.judgeLineData)
    }


    onPostUpdate(_engine: Engine, _delta: number) {
        super.onPreUpdate(_engine, _delta);
        this.updateJudgeLine(_engine);
        //console.log("judgeLineTick:" + MainManager.Instance.tick)
    }

    updateJudgeLine(_engine: Engine) {
        if (MainManager.Instance.isStarted) {
            //let tick = Math.floor(MainManager.Instance.soundBgm.ctx.currentTime * 60);
            this.updateXY();
            this.updateRotate();
            this.updateAlpha();
            this.drawNoteActors();
            this.updateSpeed();
        }
    }

    updateXY() {

        this.judgeLineData.moveXEvents.forEach(e => {
            if (this.canUpdateEvent(e)) {
                this.pos.x = this.doValueEase(e.event.easingType, MainManager.Instance.getTime() - e.startTick, e.event.start, e.event.end, e.endTick - e.startTick)
            }
        })

        this.judgeLineData.moveYEvents.forEach(e => {
            if (this.canUpdateEvent(e)) {
                this.pos.y = -this.doValueEase(e.event.easingType, MainManager.Instance.getTime() - e.startTick, e.event.start, e.event.end, e.endTick - e.startTick)
            }
        })
    }


    updateRotate() {
        this.judgeLineData.rotateEvents.forEach(e => {
            if (this.canUpdateEvent(e)) {
                this.transform.rotation = this.doValueEase(e.event.easingType, MainManager.Instance.getTime() - e.startTick, e.event.start, e.event.end, e.endTick - e.startTick) * (Math.PI / 180)
            }
        })
    }

    updateSpeed() {
        this.judgeLineData.speedEvents.forEach(e => {
            if (this.canUpdateEvent(e)) {
                this.speed = this.doValueEase(e.event.easingType, MainManager.Instance.getTime() - e.startTick, e.event.start, e.event.end, e.endTick - e.startTick)
            }
        })
    }

    updateAlpha() {
        this.judgeLineData.alphaEvents.forEach(e => {
            if (this.canUpdateEvent(e)) {
                //console.log("R变化")
                let alpha = this.doValueEase(e.event.easingType, MainManager.Instance.getTime() - e.startTick, e.event.start, e.event.end, e.endTick - e.startTick)
                this.color = Color.fromRGB(255, 255, 255, alpha / 255);
            }
        })

    }

    canUpdateEvent(e: VJudgeLineEvent<any>) {
        return e.startTick <= MainManager.Instance.getTime() && e.endTick >= MainManager.Instance.getTime() - 5;
    }

    doVectorEase(type: number, ticked: number, vec1: Vector, vec2: Vector, durationTicks: number): Vector {

        let _time = ticked / 60;
        let _duration = durationTicks / 60;

        switch (type) {
            case EaseType.Linear:
                return vec(this.doValueEase(type, _time, vec1.x, vec2.x, _duration), Util.EasingFunctions.Linear(_time, vec1.y, vec2.y, _duration))
            case EaseType.InSine:
                return vec(EaseUtil.EaseInSine(_time, vec1.x, vec2.x, _duration), EaseUtil.EaseInSine(_time, vec1.y, vec2.y, _duration))
            case EaseType.OutSine:
                return vec(EaseUtil.EaseOutSine(_time, vec1.x, vec2.x, _duration), EaseUtil.EaseOutSine(_time, vec1.y, vec2.y, _duration))
            case EaseType.InOutSine:
                return vec(EaseUtil.EaseInOutSine(_time, vec1.x, vec2.x, _duration), EaseUtil.EaseInOutSine(_time, vec1.y, vec2.y, _duration))
            case EaseType.InQuad:
                return vec(Util.EasingFunctions.EaseInQuad(_time, vec1.x, vec2.x, _duration), Util.EasingFunctions.EaseInQuad(_time, vec1.y, vec2.y, _duration))
            case EaseType.OutQuad:
                return vec(Util.EasingFunctions.EaseOutQuad(_time, vec1.x, vec2.x, _duration), Util.EasingFunctions.EaseOutQuad(_time, vec1.y, vec2.y, _duration))
            case EaseType.InOutQuad:
                return vec(Util.EasingFunctions.EaseInOutQuad(_time, vec1.x, vec2.x, _duration), Util.EasingFunctions.EaseInOutQuad(_time, vec1.y, vec2.y, _duration))
            default:
                return vec(Util.EasingFunctions.Linear(_time, vec1.x, vec2.x, _duration), Util.EasingFunctions.Linear(_time, vec1.y, vec2.y, _duration))
        }
    }

    doValueEase(type: number, ticked: number, num1: number, num2: number, durationTicks: number): number {

        if (ticked > durationTicks) {
            ticked = durationTicks;
        }

        //转换为speedRatio的tick时间等值。
        let _time = ticked / SetManager.speedRatio;
        let _duration = durationTicks / SetManager.speedRatio;

        switch (type) {
            case EaseType.Linear:
                return Util.EasingFunctions.Linear(_time, num1, num2, _duration)
            case EaseType.InSine:
                return EaseUtil.EaseInSine(_time, num1, num2, _duration)
            case EaseType.OutSine:
                return EaseUtil.EaseOutSine(_time, num1, num2, _duration)
            case EaseType.InOutSine:
                return EaseUtil.EaseInOutSine(_time, num1, num2, _duration)
            case EaseType.InQuad:
                return Util.EasingFunctions.EaseInQuad(_time, num1, num2, _duration)
            case EaseType.OutQuad:
                return EaseUtil.EaseOutQuart(_time, num1, num2, _duration)
            case EaseType.InOutQuad:
                return Util.EasingFunctions.EaseInOutQuad(_time, num1, num2, _duration)
            case EaseType.InCubic:
                return EaseUtil.EaseInCubic(_time, num1, num2, _duration)
            case EaseType.OutCubic:
                return EaseUtil.EaseOutCubic(_time, num1, num2, _duration)
            case EaseType.InOutCubic:
                return EaseUtil.EaseInOutCubic(_time, num1, num2, _duration)
            case EaseType.InQuart:
                return EaseUtil.EaseInQuart(_time, num1, num2, _duration)
            case EaseType.OutQuart:
                return EaseUtil.EaseOutQuart(_time, num1, num2, _duration)
            case EaseType.InOutQuart:
                return EaseUtil.EaseInOutQuart(_time, num1, num2, _duration)
            default:
                return Util.EasingFunctions.Linear(_time, num1, num2, _duration)
        }
    }

    drawNoteActors() {
        let tick = MainManager.Instance.getTime();
        const tap_flick_drag_action = (actor: NoteActor) => {

            if (actor.noteData.endTick + 30 <= tick) {
                if (!actor.active) {
                    actor.active = true;

                } else {
                    actor.active = false;

                }
            }

            this.noteManager.tapNotes.forEach(x => tap_flick_drag_action(x))
            this.noteManager.flickNotes.forEach(x => tap_flick_drag_action(x))
            this.noteManager.dragNotes.forEach(x => tap_flick_drag_action(x))

        }
    }
}
