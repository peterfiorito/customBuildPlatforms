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
var input_1 = require("../../abstract/input");
// This module maps the platform input devices to a standardized input events
var X1InputHandler = /** @class */ (function (_super) {
    __extends(X1InputHandler, _super);
    function X1InputHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(X1InputHandler.prototype, "keycodes", {
        get: function () {
            return {
                "13": "enter",
                "8": "return",
                "179": "play_pause",
                "72": "_pause",
                "83": "stop",
                "228": "forward",
                "227": "rewind",
                "37": "left",
                "38": "up",
                "39": "right",
                "40": "down",
                "73": "info",
                "49": "1",
                "50": "2",
                "51": "3",
                "52": "4",
                "53": "5",
                "54": "6",
                "55": "7",
                "56": "8",
                "57": "9",
                "48": "0",
                "187": "volumeup",
                "189": "volumedown",
                "33": "channelup",
                "34": "channeldown"
            };
        },
        enumerable: true,
        configurable: true
    });
    return X1InputHandler;
}(input_1.default));
exports.default = X1InputHandler;
//# sourceMappingURL=input.js.map