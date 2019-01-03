import SDKAbstract, { SDKConfig } from "../../abstract/index";
import InputHandler from "./input";
import X1Utilities from "./utils";
import MediaPlayer from "./player.hls";
import DeviceStorage from "./storage";
export default class X1SDK extends SDKAbstract {
    static platform: string;
    static player: typeof MediaPlayer;
    static storage: DeviceStorage;
    static input: InputHandler;
    static utils: X1Utilities;
    static init(config: SDKConfig): Promise<void>;
}
