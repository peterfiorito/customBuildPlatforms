"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../abstract/utils");
var utils_2 = require("../../interface/utils");
var Logger = require("js-logger");
// !!
// FOR DEVICE INFORMATION TO WORK IT IS REQUIRED TO CREATE A CUSTOM LAUNCH CONTEXT!
// Example template:
// {browserUserAgent}, Comcast_STB_/{browserVersion} ({model}, {receiverPlatform}, {receiverVersion}, {perfLevel})
// Encoded for use in app launch config:
// uaTemplate=%7BbrowserUserAgent%7D%2C%20Comcast_STB_%2F%7BbrowserVersion%7D%20(%7Bmodel%7D%2C%20%7BreceiverPlatform%7D%2C%20%7BreceiverVersion%7D%2C%20%7BperfLevel%7D)
// !!
/**
 * Utils module to provide additional functions or information from the platform
 **/
var X1Utilities = /** @class */ (function (_super) {
    __extends(X1Utilities, _super);
    function X1Utilities() {
        var _this = _super.call(this) || this;
        // get basic device info from custom useragent (needs to be configured in config)
        var userAgentTest = /(Comcast_STB_|X1_STB_).+?\((.*?), (.*?), (.*?), (.*?)\)/.exec(navigator.userAgent);
        if (userAgentTest && userAgentTest.length == 5) {
            _this._modelName = userAgentTest[1];
            _this._firmwareVersion = userAgentTest[2];
            _this._performance = userAgentTest[4].replace(/\D/g, "");
        }
        _this.getDeviceInfo();
        return _this;
    }
    X1Utilities.prototype.getDeviceInfo = function () {
        var _this = this;
        Logger.info("Utils: getDeviceInfo");
        // Get device/user info
        try {
            $badger.info().success(function (data) {
                console.log("badger.info() - success: ", data);
                _this._deviceId = data.receiverId;
            }).failure(function (error) {
                console.log("badger.info() - error: ", error);
            });
        }
        catch (error) {
            Logger.error("$badger.info failed with error: ", error);
        }
    };
    /** Get the X1 Device Peformance
     * @return [number] - range between 1 and 5
     * - 5 being best, 1 being worst
     */
    X1Utilities.prototype.getDevicePerformance = function () {
        return Number(this._performance) || 1;
    };
    /** Get the current DeviceGroup
     * @return [string]
     */
    X1Utilities.prototype.getDeviceGroup = function () {
        return utils_2.DEVICE_TYPE.STB;
    };
    /**
     * Get the current model name
     * @return [String]
     */
    X1Utilities.prototype.getModelName = function () {
        return this._modelName || _super.prototype.getModelName.call(this);
    };
    /**
     * Get the current firmwareversion
     * @return [String]
     */
    X1Utilities.prototype.getFirmwareVersion = function () {
        return this._firmwareVersion || _super.prototype.getFirmwareVersion.call(this);
    };
    /**
     * Check if the STV is connected
     * @return [Boolean]
     */
    X1Utilities.prototype.isConnected = function () {
        // TODO: verify if this is supported
        if (navigator !== undefined && navigator.onLine !== undefined && typeof navigator.onLine === "boolean") {
            return navigator.onLine;
        }
        else {
            return true;
        }
    };
    /** Exit the application
     * @param [String] source to exit to
     * @param source [String] appstore exit to the appstore
     * @param source [String] tv exit to the live tv screen
     * */
    X1Utilities.prototype.exit = function (type) {
        if (type === void 0) { type = utils_2.EXIT_SOURCE_TYPE.APPSTORE; }
        Logger.info("Exit X1");
        try {
            $badger.shutdown().success(function (data) {
                Logger.info("badger.shutdown() - success: ", data);
            }).failure(function (error) {
                Logger.info("badger.shutdown() - error: ", error);
            });
            // Note: window.close() is not respected by Comcast device
            // setTimeout(() => {
            //   Logger.info("Fallback to window.close()");
            //   window.close();
            // }, 2000);
        }
        catch (error) {
            _super.prototype.exit.call(this);
        }
    };
    /**
     * check if the application is running on the platforn
     * @return [Boolean]
     * */
    X1Utilities.prototype.isPlatform = function () {
        return /Comcast_STB_/i.test(navigator.userAgent);
    };
    /**
     *  get unique device identifier
     */
    X1Utilities.prototype.getDeviceId = function () {
        return this._deviceId || _super.prototype.getDeviceId.call(this);
    };
    return X1Utilities;
}(utils_1.default));
exports.default = X1Utilities;
//# sourceMappingURL=utils.js.map