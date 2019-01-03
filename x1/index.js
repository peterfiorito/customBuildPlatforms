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
var Logger = require("js-logger");
var index_1 = require("../../abstract/index");
var base_1 = require("../../abstract/base");
var input_1 = require("./input");
var utils_1 = require("./utils");
var player_1 = require("./player.hls");
var storage_1 = require("./storage");
// Inject X1 MoneyBadger api
var badgerLoaded = new base_1.Deferred();
var pageLoaded = new base_1.Deferred();
// listen when money badger loaded
document.addEventListener("onMoneyBadgerReady", function me() {
    badgerLoaded.resolve();
    document.removeEventListener("onMoneyBadgerReady", me);
}, false);
var scriptLoaded = base_1.injectScript("money-badger.min.js", "badger");
var hlsScriptLoaded = base_1.injectScript("hls.min.js", "hls");
// listen when whole DOM + content is loaded completely (including images etc)
window.addEventListener("load", function me() {
    pageLoaded.resolve();
    window.removeEventListener("load", me);
}, false);
// fire badger launch complete when both the full page and money badger is completely loaded
Promise.all([
    pageLoaded.promise,
    badgerLoaded.promise
]).then(function () {
    try {
        $badger.launchCompletedMetricsHandler();
    }
    catch (error) {
        Logger.error("$badger.launchCompletedMetricsHandler failed with error: ", error);
    }
});
// This module is the bootstrap for the framework
var X1SDK = /** @class */ (function (_super) {
    __extends(X1SDK, _super);
    function X1SDK() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    X1SDK.init = function (config) {
        var _this = this;
        this.input = new input_1.default(config);
        _super.init.call(this, config);
        return Promise.all([
            scriptLoaded,
            hlsScriptLoaded,
            badgerLoaded.promise
        ]).then(function () {
            _this.utils = new utils_1.default();
        });
    };
    X1SDK.platform = "x1";
    X1SDK.player = player_1.default;
    X1SDK.storage = new storage_1.default();
    return X1SDK;
}(index_1.default));
exports.default = X1SDK;
//# sourceMappingURL=index.js.map