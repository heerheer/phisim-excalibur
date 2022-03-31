import {VJudgeLine, VNote} from "../types/Chart";
import {Engine} from "excalibur";
import {JudgeLineActor} from "../actors/JudgeLineActor";
import {TapActor} from "../actors/TapActor";
import {FlickActor} from "../actors/FlickActor";
import {DragActor} from "../actors/DragActor";
import {SetManager} from "./SetManager";
import {HoldActor} from "../actors/HoldActor";
import {CommonUtil} from "../util/CommonUtil";
import Chart = PhiChart.Chart;


export class MainManager {

    public static Instance: MainManager;
    public readonly engine: Engine;
    private bgmBuffer!: ArrayBuffer;


    constructor(engine: Engine) {
        MainManager.Instance = this;
        this.engine = engine;
    }

    public isStarted: boolean = false;
    public soundBgm!: {
        duration: number;
        ctx: AudioContext; source: AudioBufferSourceNode
    };
    public tickOffset: number = 0;
    //public tick: number = 0;
    public last_tick: number = 0;
    public time: number = 0;
    //public noteActors: Array<NoteActor> = [];
    public judgeLineActors: Array<JudgeLineActor> = [];


    async update(engine: Engine, delta: number) {

        //this.soundBgm?.pl
        if (this.isStarted) {
            if (this.soundBgm.ctx.currentTime + this.tickOffset > this.soundBgm.duration + 5) {
                this.isStarted = false
                MainManager.endPlay().catch(x => console.log(x))
            }
            //this.last_tick = this.tick;
            //this.time += delta;
            //this.tick = this.time * (6 / 100)
            //this.judgeLineActors.forEach(x => x.updateJudgeLine(this.engine))
            //this.tick = (MainManager.Instance.soundBgm.ctx.currentTime + this.tickOffset) * 60
            //console.log({last:this.last_tick,tick: this.tick, time: this.time})
            //if (this.tick * 60 <= (this.soundBgm?.data.duration ?? 1e9)) {
        }
    }


    loadChart(rawChart: Chart) {
        //将a:b/c格式或者 xxx.xxx格式BPM时间转换为游戏内Tick(60/s)
        const bpm2tick = (bpm: number | Array<number>, base: number) => {
            let v = 0;
            if (typeof bpm == "number") {
                v = bpm;
            }
            if (bpm instanceof Array) {
                v = bpm[0] + (bpm[1] / bpm[2]);
            }

            let round = Math.round((v / base) * 60 * SetManager.speedRatio)
            //console.log(`[bpm${base}]${bpm} -> ${round}`)
            return round;
        }

        let ji = 0;
        rawChart.judgeLineList.forEach(x => {
            let line = JSON.parse(JSON.stringify(x)) as VJudgeLine;
            line.moveXEvents = [];
            line.alphaEvents = [];
            line.moveYEvents = [];
            line.speedEvents = [];
            line.rotateEvents = []

            let baseBpm = rawChart.BPMList[0].bpm

            x.eventLayers.forEach(layer => {

                let baseBpm = rawChart.BPMList[0].bpm
                layer.moveXEvents.forEach(e => {
                    line.moveXEvents.push({
                        startTick: bpm2tick(e.startTime, baseBpm),
                        endTick: bpm2tick(e.endTime, baseBpm),
                        event: e
                    })
                })

                layer.moveYEvents.forEach(e => {
                    line.moveYEvents.push({
                        startTick: bpm2tick(e.startTime, baseBpm),
                        endTick: bpm2tick(e.endTime, baseBpm),
                        event: e
                    })
                })

                layer.alphaEvents.forEach(e => {
                    line.alphaEvents.push({
                        startTick: bpm2tick(e.startTime, baseBpm),
                        endTick: bpm2tick(e.endTime, baseBpm),
                        event: e
                    })
                })

                layer.rotateEvents.forEach(e => {
                    line.rotateEvents.push({
                        startTick: bpm2tick(e.startTime, baseBpm),
                        endTick: bpm2tick(e.endTime, baseBpm),
                        event: e
                    })
                })
                layer.speedEvents.forEach(e => {
                    line.speedEvents.push({
                        startTick: bpm2tick(e.startTime, baseBpm),
                        endTick: bpm2tick(e.endTime, baseBpm),
                        event: e
                    })
                })
            })

            line.eventLayers = []
            let ja = new JudgeLineActor(line);
            MainManager.Instance.judgeLineActors.push(ja)


            let ni = 0
            x.notes?.forEach(n => {
                let v = n as VNote;
                v.index = {judgeIndex: ji, index: ni};
                v.startTick = bpm2tick(n.startTime, baseBpm)
                v.endTick = bpm2tick(n.endTime, baseBpm)

                if (v.type == 1) {
                    //tap(click)
                    ja.noteManager.addNoteActor(new TapActor(v, line))
                } else if (v.type == 2) {
                    ja.noteManager.addNoteActor(new HoldActor(v, line))
                } else if (v.type == 4) {
                    ja.noteManager.addNoteActor(new DragActor(v, line))
                } else if (v.type == 3) {
                    ja.noteManager.addNoteActor(new FlickActor(v, line))

                }
                ni++
                //加入到manager里面的note
            })

            ji++;
        })

        //console.log(`notes:${MainManager.Instance.noteActors.length}`)
        console.log(`lines:${MainManager.Instance.judgeLineActors.length}`)


        this.judgeLineActors.forEach(a => {
            this.engine.add(a)
            a.noteManager.init(this.engine)
        })
        console.info("JudgeLine初始化完成,NOTES INIT")

    }

    async loadBgm(buffer: ArrayBuffer) {
        this.bgmBuffer = buffer;
        const actx = new AudioContext();
        let audioBuffer = await actx.decodeAudioData(this.bgmBuffer);
        let sourceNode = actx.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.connect(actx.destination);
        MainManager.Instance.soundBgm = {ctx: actx, source: sourceNode, duration: audioBuffer.duration};

    }

    async playBgm() {
        this.soundBgm.source.start(0);
        this.tickOffset = -this.soundBgm.ctx.currentTime;
    }

    async start() {
        await this.playBgm();
        this.isStarted = true;
        console.log("yikaishi")
        //await MainManager.Instance.update(this.engine, 0);
    }

    //返回Tick
    getTime() {
        return (MainManager.Instance.soundBgm.ctx.currentTime + MainManager.Instance.tickOffset) * SetManager.speedRatio
    }

    private static async endPlay() {
        await CommonUtil.wait(2000)
        CommonUtil.mitt.emit('playEnd')
    }
}
