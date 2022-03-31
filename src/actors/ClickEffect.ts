import {Actor, Animation, AnimationStrategy, Engine, SpriteSheet, Util} from "excalibur";
import {ResourceManager} from "../managers/ResourceManager";

export class ClickEffect extends Actor {
    private readonly animation: Animation;
    private played: boolean;

    constructor() {
        super();
        let s = SpriteSheet.fromImageSource({
            image: ResourceManager.Clicks,
            grid: {rows: 5, columns: 6, spriteWidth: 256, spriteHeight: 256}
        });
        this.animation = Animation.fromSpriteSheet(s, Util.range(0, s.sprites.length - 1), 6, AnimationStrategy.Freeze);
        this.graphics.use(this.animation)
        this.played = false;
    }

    play(loop: boolean = false) {
        this.animation.reset();
        if (loop) {
            this.animation.strategy = AnimationStrategy.Loop;
        } else {
            this.animation.strategy = AnimationStrategy.End;
            this.played = true;
        }
        this.animation.play();
    }

    end() {
        this.kill();
    }

    onPostUpdate(_engine: Engine, _delta: number) {
        super.onPostUpdate(_engine, _delta);
        if (this.played && this.animation.done) {
            this.end();
        }
    }


}
