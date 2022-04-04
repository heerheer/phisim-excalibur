import {Engine, Sound, Sprite} from "excalibur";
import {NoteActor} from "./NoteActor";
import {ResourceManager} from "../managers/ResourceManager";
import {VJudgeLine, VNote} from "../types/Chart";
import {MainManager} from "../managers/MainManager";
import {SetManager} from "../managers/SetManager";
import {ClickEffect} from "./ClickEffect";

export class HoldActor extends NoteActor {
    private holding: boolean = false;
    private click!: ClickEffect;

    constructor(data: VNote, line: VJudgeLine) {
        super(data, line);
        this.normalSprite = ResourceManager.Hold.toSprite()
        //this.normalSprite.height /= 5;
        this.normalSprite.width = 197.5;
        this.normalSprite.height = ((this.noteData.endTick - this.noteData.startTick) * SetManager.tickSpeed());
        //this.normalSprite.height = 50;
    }

    onInitialize(_engine: Engine) {
        super.onInitialize(_engine);
    }


    highLightSprite: Sprite = ResourceManager.TapHl.toSprite();
    normalSprite: Sprite;
    hitSound: Sound = ResourceManager.HitSound;

    onNoteUpdate(): void {
    }

    override getDistance(): number {
        let distance = super.getDistance();
        if (this.holding) {
            return this.normalSprite.height / 2;
        } else {

            return distance + this.normalSprite.height / 2;
        }
    }

    getOriginPos() {
        return this.getPos(this.getDistance2())
    }

    override onHit() {
        if (this.holding)
            return;
        this.hitSound.play(0.6)
        this.holding = true;

        let click = new ClickEffect();
        click.pos = this.getOriginPos()!;
        this.scene.add(click);
        click.play(true);
        this.click = click;
    }

    onPreUpdate(_engine: Engine, _delta: number) {
        if (!MainManager.Instance.isStarted)
            return;

        let tick = MainManager.Instance.getTime();
        super.onPreUpdate(_engine, _delta);

        if (this.holding && tick <= this.noteData.endTick + 5) {
            this.normalSprite.height = (this.noteData.endTick - tick) * SetManager.tickSpeed();
        }
        if (tick >= this.noteData.endTick) {
            this.click?.end();
            this.onComplete()
        }
        if (this.click != undefined) {
            try {
                this.click.pos = this.getOriginPos()!;
            } catch {
            }
        }
    }


}
