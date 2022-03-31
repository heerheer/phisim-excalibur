import {Engine, Sound, Sprite} from "excalibur";
import {NoteActor} from "./NoteActor";
import {ResourceManager} from "../managers/ResourceManager";
import {VJudgeLine, VNote} from "../types/Chart";

export class FlickActor extends NoteActor {

    constructor(data: VNote, line: VJudgeLine) {
        super(data, line);
        this.normalSprite = ResourceManager.Flick.toSprite()
        this.normalSprite.height = 40;
        this.normalSprite.width = 197.8;
    }

    onInitialize(_engine: Engine) {
        super.onInitialize(_engine);
    }


    highLightSprite: Sprite = ResourceManager.TapHl.toSprite();
    normalSprite: Sprite;
    hitSound: Sound = ResourceManager.HitSound_Flick;

    onNoteUpdate(): void {
    }


}
