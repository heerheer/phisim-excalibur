import {
    Actor,
    Animation,
    AnimationStrategy,
    Color,
    EmitterType,
    Engine,
    ParticleEmitter,
    SpriteSheet,
    Util,
    Vector
} from "excalibur";
import {ResourceManager} from "../managers/ResourceManager";

export class ClickEffect extends Actor {
    private readonly animation: Animation;
    private played: boolean;
    private emitter?: ParticleEmitter;

    constructor() {
        super();
        let s = SpriteSheet.fromImageSource({
            image: ResourceManager.Clicks,
            grid: {rows: 5, columns: 6, spriteWidth: 256, spriteHeight: 256}
        });
        this.animation = Animation.fromSpriteSheet(s, Util.range(0, s.sprites.length - 1), 2, AnimationStrategy.Freeze);
        this.graphics.use(this.animation)
        this.played = false;
        this.color = Color.Yellow;
    }

    play(loop: boolean = false) {
        this.animation.reset();
        if (loop) {
            this.animation.strategy = AnimationStrategy.Loop;
        } else {
            this.animation.strategy = AnimationStrategy.End;
            this.played = true;
        }
        //this.createEmitter();
        //this.emitter.isEmitting = true;
        this.animation.play();
    }

    end() {
        this.emitter?.kill()
        this.kill();
    }

    onPostUpdate(_engine: Engine, _delta: number) {
        super.onPostUpdate(_engine, _delta);
        if (this.emitter) {
            this.emitter.transform.pos = this.transform.pos;
        }
        if (this.played && this.animation.done) {
            this.end();
        }
    }

    createEmitter() {
        let emitter = new ParticleEmitter({
            height: 200,
            width: 200,
            startSize: 50,
            endSize: 50,
            minSize: 50,
            maxSize: 50
        });
        emitter.emitterType = EmitterType.Circle;
        emitter.radius = 0;
        emitter.minVel = 500;
        emitter.maxVel = 500;
        emitter.minAngle = 0;
        emitter.maxAngle = 6.2;
        emitter.isEmitting = true;
        emitter.emitRate = 8;
        emitter.opacity = 0.8;
        emitter.fadeFlag = true;
        emitter.particleLife = 600;
        emitter.acceleration = new Vector(10, 10);
        emitter.beginColor = Color.Yellow;
        emitter.endColor = Color.Yellow;
        this.emitter = emitter
        this.scene.add(this.emitter)
        //console.log(this.emitter.pos)
    }


}
