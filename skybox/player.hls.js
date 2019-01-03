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
var player_1 = require("../../interface/player");
var player_2 = require("./player");
var Logger = require("js-logger");
var storage_1 = require("./storage");

const videojs = require("video.js");
const hlsPlugin = window.hls;
const dashPlugin = window.dashjs;

var ROBUSTNESS;
(function (ROBUSTNESS) {
    ROBUSTNESS["HW_SECURE_ALL"] = "HW_SECURE_ALL";
    ROBUSTNESS["HW_SECURE_DECODE"] = "HW_SECURE_DECODE";
    ROBUSTNESS["HW_SECURE_CRYPTO"] = "HW_SECURE_CRYPTO";
    ROBUSTNESS["SW_SECURE_DECODE"] = "SW_SECURE_DECODE";
    ROBUSTNESS["SW_SECURE_CRYPTO"] = "SW_SECURE_CRYPTO";
})(ROBUSTNESS || (ROBUSTNESS = {}));
/**
 * Class for playback of content
 */
var HlsMediaPlayer = /** @class */ (function (_super) {
    __extends(HlsMediaPlayer, _super);
    function HlsMediaPlayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HlsMediaPlayer.prototype.checkFileType = function (options) {
        switch (options.mime) {
            // HLS
            case "application/x-mpegURL":
            case "application/vnd.apple.mpegurl":
                return "hls";
            // DASH
            case "video/vnd.mpeg.dash.mpd":
            case "application/dash+xml":
                return "dash";
            // any other format
            default:
                return "mp4";
        }
    };
    HlsMediaPlayer.prototype.init = function (options) {
        // check if it's a live stream
        let videoFileType = this.checkFileType(options);
        if (videoFileType != "mp4") {
            switch (videoFileType) {
                case "hls":
                    // add hls option
                    options['hls'] = {withCredentials: true};
                    // Initiate videojs as a plain instance
                    this.$hlsInstance = videojs.default(this.playerId, options);
                    // create HLS handler and expose it
                    this.instanceHls = new Hls();
                    break;
                case "dash":
                    // Initiate videojs as a plain instance
                    this.$hlsInstance = videojs.default(this.playerId, options);
                    // Register dash
                    this.instanceDash = dashjs.MediaPlayer().create();
            }
            // Set prefered audio language
            var storage = new storage_1.default();
            var preferredAudioLanguage = storage.getItem(player_1.PLAYER_STORAGE_KEYS.STORAGE_AUDIO_LANGUAGE);
            if (preferredAudioLanguage) {
                this.$hlsInstance.audioTracks.tracks({
                    preferredAudioLanguage: preferredAudioLanguage,
                });
            }
        }
        _super.prototype.init.call(this, options);
    };
    /**
     * Load the stream and fetch metadata
     */
    HlsMediaPlayer.prototype.load = function () {
        // check if it's a live stream
        if (this.$hlsInstance) {
            if(this.instanceHls){
                // Need to destroy the existing hls handler and create a new one
                this.instanceHls.destroy()
                this.instanceHls = new Hls();
                try {
                    this.instanceHls.attachMedia(this.$hlsInstance.children_[0])
                    this.instanceHls.loadSource(this.$hlsInstance.options_.src);
                } catch (err) {
                    Logger.info('PLAYER: error:', error)
                }
            } else {
                // destroy the previous instance of dash and re-create it with a new one
                if(this.instanceDash.isReady()){
                    this.instanceDash.reset();
                    this.instanceDash = dashjs.MediaPlayer().create();
                }
                this.instanceDash.initialize(this.$hlsInstance.children_[0], this.$hlsInstance.options_.src, true);
            }
        }
        _super.prototype.load.call(this);
    };
    HlsMediaPlayer.prototype.destroy = function () {
        if($hlsInstance) {
            this.instanceHls.destroy()
        }
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(HlsMediaPlayer.prototype, "src", {
        /**
         * Get media source url
         */
        get: function () {
            if (this.$hlsInstance) {
                return this._streamURL;
            }
            else {
                var playerElem = this.getEl();
                if (playerElem) {
                    return playerElem.currentSrc;
                }
                else {
                    return "";
                }
            }
        },
        set: function (streamURL) {
            Logger.info("PLAYER: SRC - " + streamURL);
            if (this.$hlsInstance) {
                this._streamURL = streamURL;
                this.$hlsInstance.options_.src = streamURL;
            }
            else {
                var playerElem = this.getEl();
                if (playerElem) {
                    var sourceElements = playerElem.getElementsByTagName("source");
                    if (sourceElements.length > 0) {
                        sourceElements[0].setAttribute("src", streamURL);
                    }
                }
            }
            // init stream
            this.load();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HlsMediaPlayer.prototype, "mime", {
        get: function () {
            if (this.$hlsInstance) {
                return this._streamMIME;
            }
            else {
                var playerElem = this.getEl();
                if (playerElem) {
                    var sourceElements = playerElem.getElementsByTagName("source");
                    if (sourceElements.length > 0) {
                        return sourceElements[0].getAttribute("mime") || "";
                    }
                    else {
                        return "";
                    }
                }
                else {
                    return "";
                }
            }
        },
        /**
         * Set mime type of media source
         */
        set: function (mimeType) {
            Logger.info("PLAYER: MIME - " + mimeType);
            if (this.$hlsInstance) {
                this.$hlsInstance.children_[0].setAttribute("mime", mimeType);
                this.$hlsInstance.children_[0].setAttribute("type", mimeType);
            }
            else {
                var playerElem = this.getEl();
                if (playerElem) {
                    var sourceElements = playerElem.getElementsByTagName("source");
                    if (sourceElements.length > 0) {
                        sourceElements[0].setAttribute("mime", mimeType);
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Provide DRM properties
     */
    HlsMediaPlayer.prototype.drm = function (config) {
        Logger.info("PLAYER: drm - ", config);
        if (this.$hlsInstance) {
            switch (config.type) {
                case player_1.DRM_TYPES.PLAYREADY:
                    this.$hlsInstance.configure({
                        drm: {
                            servers: {
                                "com.microsoft.playready": this.options.drm.parameters.playReadyInitiatorUrl
                            },
                        }
                    });
                    break;
                case player_1.DRM_TYPES.WIDEVINE:
                    this.$hlsInstance.configure({
                        drm: {
                            servers: {
                                "com.widevine.alpha": this.options.drm.parameters.widevineInitiatorUrl
                            },
                            advanced: {
                                "com.widevine.alpha": {
                                    "videoRobustness": ROBUSTNESS.SW_SECURE_CRYPTO,
                                    "audioRobustness": ROBUSTNESS.SW_SECURE_CRYPTO,
                                    "serverCertificate": videojs.util.Uint8ArrayUtils.fromBase64("")
                                }
                            }
                        }
                    });
                    break;
            }
            // Add network binding for custom data token
            if (config.parameters.customData)
                this.$hlsInstance.getNetworkingEngine().registerRequestFilter(function (type, request) {
                    // Only add headers to license requests:
                    if (type == videojs.net.NetworkingEngine.RequestType.LICENSE) {
                        // This is the specific header name and value the server wants:
                        request.headers["licenseRequestToken"] = config.parameters.customData;
                    }
                });
        }
        else {
            return _super.prototype.drm.call(this, config);
        }
    };
    Object.defineProperty(HlsMediaPlayer.prototype, "audioTrack", {
        get: function () {
            var track = {
                language: "",
                index: 0
            };
            if (this.$hlsInstance) {
                var variant = this.$hlsInstance.getVariantTracks().find(function (track) { return track.active; });
                if (variant) {
                    track = {
                        language: variant.language
                    };
                }
            }
            else {
                var playerElem = this.getEl();
                if (playerElem) {
                    var tracks = playerElem.audioTracks || [];
                    for (var i = 0; i < tracks.length; i++) {
                        var audioTrack = tracks[i];
                        if (audioTrack.enabled) {
                            track = {
                                language: audioTrack.language,
                                index: i
                            };
                        }
                    }
                }
            }
            return track;
        },
        /**
         * Set audio track
         */
        set: function (track) {
            Logger.info("PLAYER: audioTrack track - ", track);
            var storage = new storage_1.default();
            storage.setItem(player_1.PLAYER_STORAGE_KEYS.STORAGE_AUDIO_LANGUAGE, track.language);
            if (this.$hlsInstance) {
                var languages = this.$hlsInstance.getAudioLanguages() || [];
                if (track.index !== undefined) {
                    this.$hlsInstance.selectAudioLanguage(languages[track.index]);
                }
                else {
                    for (var i = 0; i < languages.length; i++) {
                        var language = languages[i];
                        if (language === track.language) {
                            this.$hlsInstance.selectAudioLanguage(language);
                        }
                    }
                }
            }
            else {
                var playerElem = this.getEl();
                if (playerElem) {
                    var tracks = playerElem.audioTracks || [];
                    if (track.index !== undefined) {
                        playerElem.audioTracks[track.index].enabled = true;
                    }
                    else {
                        for (var i = 0; i < tracks.length; i++) {
                            var audiotrack = tracks[i];
                            if (audiotrack.language === track.language) {
                                tracks[i].enabled = true;
                            }
                        }
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get all audio tracks
     */
    HlsMediaPlayer.prototype.allAudioTracks = function () {
        var result = [];
        if (this.$hlsInstance) {
            var languages = this.$hlsInstance.getAudioLanguages() || [];
            for (var i = 0; i < languages.length; i++) {
                var language = languages[i];
                result.push({
                    language: language,
                    index: i
                });
            }
        }
        else {
            result = _super.prototype.allAudioTracks.call(this);
        }
        Logger.info("PLAYER: allAudioTracks - ", result);
        return result;
    };
    Object.defineProperty(HlsMediaPlayer.prototype, "subtitleActive", {
        /**
         * Get disable/enable subtitle
         */
        get: function () {
            if (this.$hlsInstance) {
                return this.$hlsInstance.isTextTrackVisible();
            }
            else {
                var playerElem = this.getEl();
                if (playerElem) {
                    var tracks = playerElem.textTracks || [];
                    for (var index = 0; index < tracks.length; index++) {
                        var textTrack = tracks[index];
                        if (textTrack.mode === "showing") {
                            return true;
                        }
                    }
                    return false;
                }
                else {
                    return false;
                }
            }
        },
        /**
         * Set disable/enable subtitle
         */
        set: function (state) {
            var storage = new storage_1.default();
            // When subtitle should be activated
            if (state) {
                // Check if there are subtitles available
                var subtitleTracks = this.allSubtitleTracks();
                if (subtitleTracks.length === 0)
                    return;
                // Get last default subtitle language
                var lastTrackLanguage = storage.getItem(player_1.PLAYER_STORAGE_KEYS.STORAGE_SUBTITLE_LANGUAGE);
                var track = subtitleTracks[0];
                for (var _i = 0, _a = Array.from(subtitleTracks); _i < _a.length; _i++) {
                    var subtitleTrack = _a[_i];
                    if (lastTrackLanguage === subtitleTrack.language) {
                        track = subtitleTrack;
                    }
                }
                // Set subtitle active
                storage.setItem(player_1.PLAYER_STORAGE_KEYS.STORAGE_SUBTITLE_ACTIVE, JSON.stringify(true));
                this.subtitleTrack = track;
                // When subtitle should be activated
            }
            else {
                if (this.$hlsInstance) {
                    this.$hlsInstance.setTextTrackVisibility(false);
                }
                else {
                    var playerElem = this.getEl();
                    var tracks = playerElem.textTracks || [];
                    for (var index = 0; index < tracks.length; index++) {
                        playerElem.textTracks[index].mode = "hidden";
                    }
                }
                storage.setItem(player_1.PLAYER_STORAGE_KEYS.STORAGE_SUBTITLE_ACTIVE, JSON.stringify(false));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HlsMediaPlayer.prototype, "subtitleTrack", {
        get: function () {
            var track = {
                language: "",
                index: 0
            };
            if (this.$hlsInstance) {
                var tracks = this.$hlsInstance.getTextTracks() || [];
                for (var index = 0; index < tracks.length; index++) {
                    var textTrack = tracks[index];
                    if (textTrack.active) {
                        track = {
                            language: textTrack.language,
                            index: index
                        };
                    }
                }
            }
            else {
                var playerElem = this.getEl();
                if (playerElem) {
                    var tracks = playerElem.textTracks || [];
                    for (var index = 0; index < tracks.length; index++) {
                        var textTrack = tracks[index];
                        if (textTrack.mode === "showing") {
                            track = {
                                language: textTrack.language,
                                index: index
                            };
                        }
                    }
                }
            }
            return track;
        },
        /**
         * Set subtitle track
         */
        set: function (track) {
            Logger.info("PLAYER: subtitleTrack:'" + track + "'");
            // Save last used subtitle language as default
            var storage = new storage_1.default();
            storage.setItem(player_1.PLAYER_STORAGE_KEYS.STORAGE_SUBTITLE_LANGUAGE, track.language);
            if (this.$hlsInstance) {
                if (track.index !== undefined) {
                    var textTrack = this.$hlsInstance.getTextTracks()[track.index];
                    if (textTrack) {
                        this.$hlsInstance.selectTextTrack(textTrack);
                        this.$hlsInstance.setTextTrackVisibility(true);
                    }
                }
                else {
                    var tracks = this.$hlsInstance.getTextTracks() || [];
                    for (var index = 0; index < tracks.length; index++) {
                        if (tracks[index].language === track.language) {
                            this.$hlsInstance.selectTextTrack(tracks[index]);
                            this.$hlsInstance.setTextTrackVisibility(true);
                        }
                    }
                }
            }
            else {
                var playerElem = this.getEl();
                if (playerElem) {
                    if (track.index !== undefined) {
                        playerElem.textTracks[track.index].mode = "showing";
                    }
                    else {
                        var tracks = playerElem.textTracks || [];
                        for (var index = 0; index < tracks.length; index++) {
                            if (tracks[index].language === track.language) {
                                playerElem.textTracks[index].mode = "showing";
                            }
                            else {
                                playerElem.textTracks[index].mode === "hidden";
                            }
                        }
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get all subtitle tracks
     */
    HlsMediaPlayer.prototype.allSubtitleTracks = function () {
        result = _super.prototype.allSubtitleTracks.call(this);
    return result;
    };
    /**
     * Sets the external captions
     */
    HlsMediaPlayer.prototype.setExternalSubtitles = function (textTracks) {
        _super.prototype.setExternalSubtitles.call(this, textTracks);
    };
    return HlsMediaPlayer;
}(player_2.default));
exports.default = HlsMediaPlayer;
//# sourceMappingURL=player.hls.js.map