import Tap from '../assets/textures/Tap.png';
import TapHl from '../assets/textures/TapHL.png';
import Drag from '../assets/textures/Drag.png';
import DragHl from '../assets/textures/DragHL.png';
import Flick from '../assets/textures/Flick.png';
import FlickHl from '../assets/textures/FlickHL.png';
import Hold from '../assets/textures/Hold.png';
import clicks from '../assets/textures/click.png';
//Hit Sound
import HitSong0 from '../assets/HitSong0.ogg';
import HitSong1 from '../assets/HitSong1.ogg';
import HitSong2 from '../assets/HitSong2.ogg';
import {ImageSource, Sound} from "excalibur";

export class ResourceManager {

    public static HitSound = new Sound(HitSong0);
    public static HitSound_Drag = new Sound(HitSong1);
    public static HitSound_Flick = new Sound(HitSong2);

    public static Tap = new ImageSource(Tap);
    public static TapHl = new ImageSource(TapHl);
    public static Drag = new ImageSource(Drag);
    public static DragHl = new ImageSource(DragHl);
    public static Flick = new ImageSource(Flick);
    public static FlickHl = new ImageSource(FlickHl);
    public static Hold = new ImageSource(Hold);
    public static Clicks = new ImageSource(clicks);

}

export const Resources =
    [ResourceManager.HitSound, ResourceManager.HitSound_Drag, ResourceManager.HitSound_Flick,
        ResourceManager.Tap, ResourceManager.Drag, ResourceManager.Flick, ResourceManager.Hold, ResourceManager.Clicks
    ]

