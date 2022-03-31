import {Actor, Color, Engine, Sound, Sprite, vec} from "excalibur";
import {VJudgeLine, VNote} from "../types/Chart";
import {MainManager} from "../managers/MainManager";
import {SetManager} from "../managers/SetManager";
import {ClickEffect} from "./ClickEffect";

export abstract class NoteActor extends Actor {

    public abstract highLightSprite: Sprite;
    public abstract normalSprite: Sprite;
    public abstract hitSound: Sound;


    noteData: VNote;
    lineData: VJudgeLine;
    posActor?: Actor;

    protected constructor(data: VNote, line: VJudgeLine) {
        super();
        this.pos.y = 9000
        this.noteData = data;
        this.lineData = line;


    }

    onInitialize(_engine: Engine) {
        super.onInitialize(_engine);
        this.graphics.use(this.normalSprite)
        //this.scene.add(this.posActor)

        /*        this.addChild(new Label({
                    text: `${this.noteData.index.judgeIndex},${this.noteData.index.index}`,
                    scale: vec(3, 3)
                }))*/
    }


    onPostUpdate(engine: Engine, delta: number) {

        if (!MainManager.Instance.isStarted)
            return;

        if (Math.abs(this.transform.pos.y) <= this.scene.engine.drawHeight && Math.abs(this.transform.pos.x) <= this.scene.engine.drawWidth) {
            if (this.posActor == undefined) {
                this.posActor = new Actor({pos: vec(0, 0), width: 20, height: 20, color: Color.Magenta})
                this.addChild(this.posActor)
                console.log("added")

            }
            //this.posActor.pos = this.pos;
        } else {
            if (this.posActor) {
                console.log("removed")
                this.posActor.kill();
                this.posActor = undefined;
            }
        }
        let tick = this.getTick();

        this.drawNote();

        if (this.noteData.startTick + 5 >= tick && this.noteData.startTick <= tick) {
            this.onHit()
        }

        if (this.noteData.endTick <= MainManager.Instance.getTime() - 20 && !this.noteData.isFake) {
            this.onMiss();
        }

    }

    onHit(): void {

        if (!this.noteData.isFake) {
            this.hitSound.play(0.6)
            let click = new ClickEffect();
            click.pos = this.pos;
            this.scene.add(click);
            click.play();
        }
        this.onComplete();
    }

    onMiss(): void {
        //this.color = this.color.darken(0.5)
        /*        this.graphics.current[0].graphic.opacity = 0.5
                setTimeout(() => {
                    //this.kill()
                }, 100)*/
    }

    //start时按下，就会complete
    onComplete(): void {
        MainManager.Instance.judgeLineActors[this.noteData.index.judgeIndex].noteManager.onNoteComplete(this)
    }


    getDistance() {
        let judgeLineActor = MainManager.Instance.judgeLineActors[this.noteData.index.judgeIndex];
        let tick = this.getTick();
        return (this.noteData.startTick - tick) * SetManager.tickSpeed * (judgeLineActor.speed / 10);
    }

    /**
     * 返回初始距离，无法被override,只用于hold取初始pos
     */
    protected getDistance2() {
        let judgeLineActor = MainManager.Instance.judgeLineActors[this.noteData.index.judgeIndex];

        let tick = this.getTick();
        return ((this.noteData.startTick - tick) <= 0 ? 0 : (this.noteData.startTick - tick)) * SetManager.tickSpeed * (judgeLineActor.speed / 10);
    }

    getPos(distance: number) {
        if (distance < -100 || distance >= 3000) {
            return;
        }
        let judgeLineActor = MainManager.Instance.judgeLineActors[this.noteData.index.judgeIndex];
        let r = judgeLineActor.transform.rotation
        //let length = Math.sqrt(Math.pow(this.noteData.positionX, 2) + Math.pow(distance, 2));
        let p_offset_1 = vec(+Math.cos(r) * this.noteData.positionX, +Math.sin(r) * this.noteData.positionX);
        let p_offset_2 = vec(+Math.cos(Math.PI / 2 - r) * distance, -Math.sin(Math.PI / 2 - r) * distance)
        let xoffset = p_offset_1.x + p_offset_2.x;
        let yoffset = p_offset_1.y + p_offset_2.y
        return vec((judgeLineActor.transform.pos.x + xoffset), judgeLineActor.transform.pos.y + yoffset)
    }


    drawNote() {
        let actor = this;
        let judgeLineActor = MainManager.Instance.judgeLineActors[this.noteData.index.judgeIndex];
        /*
                let a = judgeLineActor.transform.rotation
                let r = Math.atan(distance/this.noteData.positionX);
                let xoffset = length * Math.cos(r+a)
                let yoffset = -  length * Math.sin(r+a)
        */

        let pos = this.getPos(this.getDistance())
        if (pos) {
            actor.transform.pos.x = pos.x;
            actor.transform.pos.y = pos.y;
            //set rotation
            actor.transform.rotation = judgeLineActor.transform.rotation;
        }
    }

    getTick() {
        //return Math.floor(MainManager.Instance.soundBgm.ctx.currentTime * 60);
        return MainManager.Instance.getTime()
    }

}
