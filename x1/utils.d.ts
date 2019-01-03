import Utils from "../../abstract/utils";
import { EXIT_SOURCE_TYPE, DEVICE_TYPE } from "../../interface/utils";
/**
 * Utils module to provide additional functions or information from the platform
 **/
export default class X1Utilities extends Utils {
    private _modelName;
    private _firmwareVersion;
    private _performance;
    private _deviceId;
    constructor();
    private getDeviceInfo;
    /** Get the X1 Device Peformance
     * @return [number] - range between 1 and 5
     * - 5 being best, 1 being worst
     */
    getDevicePerformance(): number;
    /** Get the current DeviceGroup
     * @return [string]
     */
    getDeviceGroup(): DEVICE_TYPE;
    /**
     * Get the current model name
     * @return [String]
     */
    getModelName(): string;
    /**
     * Get the current firmwareversion
     * @return [String]
     */
    getFirmwareVersion(): string;
    /**
     * Check if the STV is connected
     * @return [Boolean]
     */
    isConnected(): boolean;
    /** Exit the application
     * @param [String] source to exit to
     * @param source [String] appstore exit to the appstore
     * @param source [String] tv exit to the live tv screen
     * */
    exit(type?: EXIT_SOURCE_TYPE): void;
    /**
     * check if the application is running on the platforn
     * @return [Boolean]
     * */
    isPlatform(): boolean;
    /**
     *  get unique device identifier
     */
    getDeviceId(): string;
}
