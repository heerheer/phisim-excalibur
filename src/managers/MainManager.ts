import {VJudgeLine, VNote} from "../types/Chart";
import {Engine} from "excalibur";
import {JudgeLineActor} from "../actors/JudgeLineActor";
import {TapActor} from "../actors/TapActor";
import {FlickActor} from "../actors/FlickActor";
import {DragActor} from "../actors/DragActor";
import {SetManager} from "./SetManager";
import {HoldActor} from "../actors/HoldActor";
import {CommonUtil} from "../util/CommonUtil";

//Howler.js
// @ts-ignore
import {Howl, Howler} from 'howler';
import {ref} from "vue";


export class MainManager {

    public static Instance: MainManager;
    public readonly engine: Engine;
    private bgmBuffer!: ArrayBuffer;


    public combo = ref(0);
    private soundHowl: Howl;
    private soundHowlId!: number;
    private soundHowlDuration?: number;

    constructor(engine: Engine) {
        MainManager.Instance = this;
        this.engine = engine;
    }

    public isStarted: boolean = false;

    public judgeLineActors: Array<JudgeLineActor> = [];


    async update(engine: Engine, delta: number) {

        //this.soundBgm?.pl
        if (this.isStarted) {
            if (this.getTimeNoTick() >= (this.soundHowlDuration ?? 0) - 1) {
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


    loadChartPhi(json: string) {

        const phiTime2BpmTime = (time: number, bpm: number) => {

            let realTime = time / bpm * 60 / 32
            return realTime * SetManager.speedRatio;
        }

        const getPosX = (phi: number) => {
            return (phi / 7) * (1350 / 2);
        }

        const getY = (phi: number) => {
            return (phi - 0.5) * 900;
        }


        const getX = (phi: number) => {
            return (phi - 0.5) * 1350;
        }

        let chart = JSON.parse(json) as PhiChartTypes.Chart;

        let ji = 0;
        chart.judgeLineList.forEach(line => {
            let bpm = line.bpm;
            let vLine = {} as VJudgeLine;
            vLine.moveXEvents = [];
            vLine.alphaEvents = [];
            vLine.moveYEvents = [];
            vLine.speedEvents = [];
            vLine.rotateEvents = []

            //XY移动
            line.judgeLineMoveEvents.forEach(e => {
                vLine.moveXEvents.push({
                    startTick: phiTime2BpmTime(e.startTime, bpm),
                    endTick: phiTime2BpmTime(e.endTime, bpm),
                    event: {
                        linkgroup: 0,
                        start: getX(e.start),
                        end: getX(e.end),
                        easingType: 0,
                        startTime: [0, 0, 0],
                        endTime: [0, 0, 0],
                    }
                })
                vLine.moveYEvents.push({
                    startTick: phiTime2BpmTime(e.startTime, bpm),
                    endTick: phiTime2BpmTime(e.endTime, bpm),
                    event: {
                        linkgroup: 0,
                        start: getY(e.start2),
                        end: getY(e.end2),
                        easingType: 0,
                        startTime: [0, 0, 0],
                        endTime: [0, 0, 0],
                    }
                })
            })

            line.judgeLineRotateEvents.forEach(e => {
                vLine.rotateEvents.push({
                    startTick: phiTime2BpmTime(e.startTime, bpm),
                    endTick: phiTime2BpmTime(e.endTime, bpm),
                    event: {
                        linkgroup: 0,
                        start: e.start,
                        end: e.end,
                        easingType: 0,
                        startTime: [0, 0, 0],
                        endTime: [0, 0, 0],
                    }
                })
            })
            line.judgeLineDisappearEvents.forEach(e => {
                vLine.alphaEvents.push({
                    startTick: phiTime2BpmTime(e.startTime, bpm),
                    endTick: phiTime2BpmTime(e.endTime, bpm),
                    event: {
                        linkgroup: 0,
                        start: e.start * 255,
                        end: e.end * 255,
                        easingType: 0,
                        startTime: [0, 0, 0],
                        endTime: [0, 0, 0],
                    }
                })
            })

            let ja = new JudgeLineActor(vLine);
            let ni = 0

            line.notesAbove.forEach(note => {
                let v = {} as VNote;
                v.type = note.type;
                v.above = 1;
                v.isFake = false;
                v.speed = 1;
                v.positionX = getPosX(note.positionX);
                v.index = {judgeIndex: ji, index: ni};
                v.startTick = phiTime2BpmTime(note.time, bpm)
                v.endTick = phiTime2BpmTime(note.time + (note.holdTime ?? 0), bpm)

                if (v.type == 1) {
                    //tap(click)
                    ja.noteManager.addNoteActor(new TapActor(v, vLine))
                } else if (v.type == 3) {
                    ja.noteManager.addNoteActor(new HoldActor(v, vLine))
                } else if (v.type == 2) {
                    ja.noteManager.addNoteActor(new DragActor(v, vLine))
                } else if (v.type == 4) {
                    ja.noteManager.addNoteActor(new FlickActor(v, vLine))

                }
                ni++;
            })

            ji++;
            MainManager.Instance.judgeLineActors.push(ja)
        })


        this.judgeLineActors.forEach(a => {
            this.engine.add(a)
            a.noteManager.init(this.engine)
            console.log("PHIJSON:" + `判定线初始化...${a.noteManager.numOfNotes}`)
        })


    }

    loadChart(json: string, formatter: string) {
        if (formatter == "rpe_json") {

            this.loadChartRpe(JSON.parse(json) as RpeChartTypes.Chart)
        }
        if (formatter == "official_json") {
            this.loadChartPhi(json)

        }

    }

    //对于rpe的Chart格式读取
    loadChartRpe(rawChart: RpeChartTypes.Chart) {
        //将a:b/c格式或者 xxx.xxx格式BPM时间转换为游戏内Tick(设置/s)
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

        function arrayBufferToBase64(buffer: ArrayBuffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }

        let howlSource = ["data:audio/mp3;base64," + arrayBufferToBase64(buffer)];

        this.soundHowl = new Howl({
            src: howlSource,
        });

        /* this.bgmBuffer = buffer;
         const actx = new AudioContext();
         let audioBuffer = await actx.decodeAudioData(this.bgmBuffer);
         let sourceNode = actx.createBufferSource();
         sourceNode.buffer = audioBuffer;
         sourceNode.connect(actx.destination);
         MainManager.Instance.soundBgm = {ctx: actx, source: sourceNode, duration: audioBuffer.duration};*/

    }

    async playBgm() {
        this.soundHowlId = this.soundHowl.play();
        this.soundHowl.on('play', () => {
            this.soundHowlDuration = this.soundHowl.duration(this.soundHowlId)
            this.isStarted = true;
            console.log(this.soundHowlDuration)
        })
        //this.soundBgm.source.start(0);
        //this.tickOffset = -this.soundBgm.ctx.currentTime;
    }

    async start() {
        await this.playBgm();
    }

    //返回Tick
    getTime() {
        return this.soundHowl.seek(this.soundHowlId) * SetManager.speedRatio
        //return (MainManager.Instance.soundBgm.ctx.currentTime + MainManager.Instance.tickOffset) * SetManager.speedRatio
    }

    getTimeNoTick() {
        return this.soundHowl.seek(this.soundHowlId)
        //return (MainManager.Instance.soundBgm.ctx.currentTime + MainManager.Instance.tickOffset) * SetManager.speedRatio
    }

    private static async endPlay() {
        await CommonUtil.wait(5000)
        CommonUtil.mitt.emit('playEnd')
    }
}
