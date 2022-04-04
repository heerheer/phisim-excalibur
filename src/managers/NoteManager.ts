import {NoteActor} from "../actors/NoteActor";
import {TapActor} from "../actors/TapActor";
import {Engine} from "excalibur";
import {DragActor} from "../actors/DragActor";
import {FlickActor} from "../actors/FlickActor";
import {HoldActor} from "../actors/HoldActor";
import {MainManager} from "./MainManager";

export class NoteActorManager {

    tapNotes: TapActor[] = [];
    holdNotes: TapActor[] = [];
    dragNotes: DragActor[] = [];
    flickNotes: FlickActor[] = [];

    numOfNotes: number = 0;

    addNoteActor(noteActor: NoteActor) {
        this.numOfNotes++;
        switch (noteActor.noteData.type) {
            case 1:
                this.tapNotes.push(noteActor as TapActor);
                break;
            case 2:
                this.holdNotes.push(noteActor as HoldActor)
                break;
            case 3:
                this.dragNotes.push(noteActor as DragActor);
                break;
            case 4:
                this.flickNotes.push(noteActor as FlickActor);
                break;
            default:
                break;
        }
    }


    /**
     * 将内部的Note数据变成Actor于游戏中。
     * @param engine
     */
    init(engine: Engine) {

        this.tapNotes.forEach(x => {
            engine.currentScene.add(x)
        })
        this.holdNotes.forEach(x => {
            engine.currentScene.add(x)
        })
        this.flickNotes.forEach(x => {
            engine.currentScene.add(x)
        })
        this.dragNotes.forEach(x => {
            engine.currentScene.add(x)
        })
    }

    onNoteComplete(note: NoteActor) {
        note.active = false

        MainManager.Instance.combo.value++;
        //console.log(note.scene.actors.length)
        switch (note.noteData.type) {
            case 1:
                this.tapNotes.splice(this.tapNotes.indexOf(note as TapActor), 1)
                break;
            case 2:
                this.holdNotes.splice(this.holdNotes.indexOf(note as HoldActor), 1)
                break;
            case 3:
                this.dragNotes.splice(this.dragNotes.indexOf(note as DragActor), 1)
                break;
            case 4:
                this.flickNotes.splice(this.flickNotes.indexOf(note as FlickActor), 1)
                break;
            default:
                break;
        }
    }
}
