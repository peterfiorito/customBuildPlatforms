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
var storage_1 = require("../../abstract/storage");
var utils_1 = require("./utils");
// !!
// X1 Devices have some amount of storage available to web apps for cookies.
// Unfortunately, due to architectural limitations, cookies do not persist across reboots on all makes and models of devices.
// X1 provides a way to make cookies persistent by storing them in the X1 cloud, making the cookie jar available to all the users X1 devices
// to enable this please ensure to set the "enableCloudCookie=true" Launch config option!
// !!
// Storage class to store key value objects persistent on the client
var HTML5DeviceStorage = /** @class */ (function (_super) {
    __extends(HTML5DeviceStorage, _super);
    function HTML5DeviceStorage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.utils = new utils_1.default();
        _this.prefix = _this.utils.getDeviceId();
        return _this;
    }
    return HTML5DeviceStorage;
}(storage_1.default));
exports.default = HTML5DeviceStorage;
//# sourceMappingURL=storage.js.map