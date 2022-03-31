import {Engine, Sound, Sprite} from "excalibur";
import {NoteActor} from "./NoteActor";
import {ResourceManager} from "../managers/ResourceManager";
import {VJudgeLine, VNote} from "../types/Chart";

export class TapActor extends NoteActor {

    constructor(data: VNote, line: VJudgeLine) {
        super(data, line);
        this.normalSprite = ResourceManager.Tap.toSprite()
        this.normalSprite.height = 20;
        this.normalSprite.width = 197.8;
    }

    onInitialize(_engine: Engine) {
        super.onInitialize(_engine);
    }


    highLightSprite: Sprite = ResourceManager.TapHl.toSprite();
    normalSprite: Sprite;
    hitSound: Sound = ResourceManager.HitSound;

    onPostUpdate(engine: Engine, delta: number) {
        super.onPostUpdate(engine, delta);
    }
}
