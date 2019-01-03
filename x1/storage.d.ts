import DeviceStorageAbstract from "../../abstract/storage";
import Utils from "./utils";
export default class HTML5DeviceStorage extends DeviceStorageAbstract {
    localStorageAvailable: false;
    utils: Utils;
    prefix: string;
}
