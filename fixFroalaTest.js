/******/ var __webpack_modules__ = ({

/***/ 8421:
/***/ (() => {

    var Lolzteam = window.Lolzteam || {};
    !function($, window1, document1, _undefined) {
        "use strict";
        var absMax = function(a, b) {
            return Math.abs(a) > Math.abs(b) ? a : b;
        };
        var clamp = function(val, min, max) {
            return Math.max(min, Math.min(max, val));
        };
        Lolzteam.SmilieBox = function($target) {
            this.__construct($target);
        };
        Lolzteam.SmilieBox.prototype = {
            $target: null,
            cacheVersion: 0,
            metaDataKey: "smilie_meta_data",
            htmlCacheKey: "smilie_html_cache",
            recentKey: "recent_smilies",
            container: ".lzt-fe-smilies",
            navigation: ".lzt-fe-smilieNavigation",
            recentSmiliesLimit: 14,
            $container: null,
            $navigation: null,
            $recently: null,
            lastCategoryId: null,
            __construct: function __construct($target) {
                var self = this;
                this.$target = $target;
                this.cacheVersion = Lolzteam.fe_smilieCacheVersion;
                this.$container = $target.find(this.container);
                this.$navigation = $target.find(this.navigation);
                var $cat = this.$navigation.find(".js-categoryList");
                this.$container.find(".js-fullSmilieList").scrollbar().on("scroll", $.context(this, "onScroll")).on("click", "li", $.context(this, "pickSmilie"));
                $cat.on("wheel", $.context(self, "hScroll")).scrollbar();
                $cat.find(".js-smilieCategory").each(function() {
                    $(this).on("click", $.context(self, "scrollToCategory"));
                });
                var recentSmilies = this.getRecentSmilies();
                this.$recently = this.$container.find(".js-smilieCategoryRecently > .smilieList");
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = recentSmilies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var smilieId = _step.value;
                        this.getSmilieById(smilieId).appendTo(this.$recently);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                if (recentSmilies.length) this.$container.find(".js-smilieCategoryRecently").removeClass("hidden");
            },
            getRecentSmilies: function() {
                var ls = Lolzteam.FE.LocalStorage;
                if (!ls.supports()) return [];
                var recentSmilies = ls.get(this.recentKey);
                if (!recentSmilies || !recentSmilies.length) return [];
                return recentSmilies.split(",");
            },
            getSmilieById: function(smilieId) {
                if (smilieId === "") return $();
                var $smilie = this.$container.find(".smilie[data-smilie-id=".concat(smilieId, "]"));
                if (!$smilie.length) return $();
                return $smilie.first().clone().wrap("<li>").parent();
            },
            pickSmilie: function pickSmilie(e) {
                e.preventDefault();
                var smilieEl = $(e.currentTarget).children();
                this.addRecentlySmilie(smilieEl);
                this.$target.trigger("lzt-smilie-box:pick-smilie", [
                    smilieEl,
                    this
                ]);
            },
            addRecentlySmilie: function addRecentlySmilie(smilie) {
                this.$target.trigger("lzt-smilie-box:add-recently-smilie", [
                    smilie,
                    this
                ]);
                var ls = Lolzteam.FE.LocalStorage;
                if (!ls.supports()) {
                    return;
                }
                var recent = this.getRecentSmilies();
                var $smilie = $(smilie), smilieId = String($smilie.data("smilie-id")), limit = this.recentSmiliesLimit;
                recent = recent.slice(0, limit - 2).filter(function(id) {
                    return id != smilieId;
                });
                recent.unshift(smilieId);
                ls.set(this.recentKey, recent.join(","));
                this.$recently.find(".smilie[data-smilie-id=".concat(smilieId, "]")).parent().remove();
                this.getSmilieById(smilieId).prependTo(this.$recently);
                while(this.$recently.children().length > limit)this.$recently[0].lastChild.remove();
                this.$container.find(".js-smilieCategoryRecently").removeClass("hidden");
            },
            scrollToCategory: function scrollToCategory(e) {
                e.preventDefault();
                var $target = $(e.currentTarget), $fullSmilieList = this.$container.find(".js-fullSmilieList"), categoryId = $target.data("category-id"), $anchor = $fullSmilieList.find('.js-smilieCategory[data-category-id="' + categoryId + '"]');
                $fullSmilieList.animate({
                    scrollTop: $anchor.prop("offsetTop")
                }, XenForo.speed.fast);
            },
            onScroll: function onScroll(e) {
                var self = this;
                var $target = $(e.currentTarget), $navCategoryList = this.$navigation.find(".js-categoryList.scroll-content");
                $target.find(".js-smilieCategory").each(function() {
                    var $category = $(this), categoryPosTop = $category.position().top;
                    if (categoryPosTop <= $target.scrollTop() && categoryPosTop + $category.height() > 0 && !$category.hasClass("hidden")) {
                        if ($category.data("categoryId") === self.lastCategoryId) {
                            return false;
                        }
                        self.lastCategoryId = $category.data("categoryId");
                        $navCategoryList.find(".js-smilieCategory").removeClass("is-active");
                        var $categoryNav = $navCategoryList.find('.js-smilieCategory[data-category-id="' + $category.data("category-id") + '"]');
                        if (!$categoryNav.length) {
                            $navCategoryList.stop(true).animate({
                                scrollLeft: 0
                            }, {
                                duration: XenForo.speed.xxfast,
                                queue: false
                            });
                            return false;
                        } else {
                            var maxScroll = $navCategoryList.prop("scrollWidth") - $navCategoryList.prop("clientWidth");
                            var scrollLeft = $categoryNav.prop("offsetLeft") - ($navCategoryList.prop("clientWidth") - $categoryNav.prop("scrollWidth")) / 2;
                            $categoryNav.addClass("is-active");
                            $navCategoryList.stop(true).animate({
                                scrollLeft: clamp(scrollLeft, 0, maxScroll)
                            }, {
                                duration: XenForo.speed.fast,
                                queue: false
                            });
                            return false;
                        }
                    }
                });
            },
            hScroll: function hScroll(e) {
                var delta = absMax(e.deltaY, e.deltaX);
                e.currentTarget.scrollLeft += delta;
                e.preventDefault();
            },
            reloadRecentlySmilies: function reloadRecentlySmilies() {
                var recentSmilies = this.getRecentSmilies();
                this.$recently.children().remove();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = recentSmilies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var smilieId = _step.value;
                        this.getSmilieById(smilieId).appendTo(this.$recently);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                if (recentSmilies.length) this.$container.find(".js-smilieCategoryRecently").removeClass("hidden");
            }
        };
        Lolzteam.SmilieBoxTooltip = function($target, options) {
            this.__construct($target, options);
        };
        Lolzteam.SmilieBoxTooltip.prototype = {
            $target: null,
            options: {},
            cacheVersion: 0,
            metaDataKey: "smilie_meta_data",
            htmlCacheKey: "smilie_html_cache",
            recentKey: "recent_smilies",
            tooltipHtml: "",
            tooltip: null,
            __construct: function __construct($target, options) {
                this.$target = $target;
                this.cacheVersion = Lolzteam.fe_smilieCacheVersion;
                this.options = $.extend({}, {
                    theme: "popup lzt-fe-smilies",
                    animation: "shift-toward",
                    placement: "top",
                    arrow: true,
                    interactive: true,
                    hideOnClick: XenForo.isTouchBrowser(),
                    trigger: XenForo.isTouchBrowser() ? "click" : "mouseenter",
                    zIndex: this.$target.closest(".xenOverlay").length ? 12000 : 9000,
                    onHidden: function(instance) {
                        $(instance.popper).find(".is-active").removeClass("is-active");
                    },
                    onMount: function(instance) {
                        if (instance.props.flipBehavior.length === 1) {
                            instance.props.flip = false;
                            instance.popperInstance.options.placement = instance.props.flipBehavior[0];
                        }
                    },
                    onShow: function(instance) {
                        var _instance_popper_getBoundingClientRect;
                        if (((_instance_popper_getBoundingClientRect = instance.popper.getBoundingClientRect()) === null || _instance_popper_getBoundingClientRect === void 0 ? void 0 : _instance_popper_getBoundingClientRect.bottom) <= window1.innerHeight) {
                            instance.props.flip = true;
                        }
                    },
                    boundary: "window",
                    flip: !/iPhone|iPod|iPad/.test(navigator.platform),
                    flipBehavior: this.getFlipBehaviour($target)
                }, options || {});
                var self = this;
                this.loadSmilies(function() {
                    $target.trigger("lzt-smilie-box-tooltip:smilies-loaded", [
                        self
                    ]);
                });
            },
            loadSmilies: function loadSmilies() {
                var onLoad = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                var self = this, cacheVersion = this.cacheVersion, metaDataKey = this.metaDataKey, htmlCacheKey = this.htmlCacheKey, ls = Lolzteam.FE.LocalStorage;
                var smiliesLoaded = false;
                var metaData = ls.getJson(metaDataKey), htmlCache = ls.get(htmlCacheKey);
                if (metaData && htmlCache && metaData.version === cacheVersion) {
                    smiliesLoaded = true;
                    self.tooltipHtml = htmlCache;
                }
                if (smiliesLoaded && !force) {
                    onLoad();
                    return;
                }
                Lolzteam.SmilieLoader.load().then(function(resp) {
                    if (!resp) return;
                    self.tooltipHtml = resp.box;
                    onLoad();
                });
            },
            setupTooltip: function setupTooltip() {
                var force = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                if (this.tooltip && !force) {
                    return this.tooltip;
                }
                var $content = $("<div></div>").append(this.tooltipHtml).xfActivate();
                this.tooltip = XenForo.tippy(this.$target[0], $.extend(this.options, {
                    content: $content[0]
                }), "popup");
                this.$target.on("mousedown", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                return this.tooltip;
            },
            getFlipBehaviour: function getFlipBehaviour($target) {
                if (!/iPhone|iPod|iPad/.test(navigator.platform)) {
                    return [
                        "top",
                        "bottom"
                    ];
                }
                return [
                    !$target.closest(".LolzteamEditor").length ? "top" : "bottom"
                ];
            }
        };
        XenForo.register("div.SmilieBox", "Lolzteam.SmilieBox");
    }(jQuery, window, document);
    
    
    /***/ })
    
    /******/ });
    /************************************************************************/
    /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/ 
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
    /******/ 	// Check if module is in cache
    /******/ 	var cachedModule = __webpack_module_cache__[moduleId];
    /******/ 	if (cachedModule !== undefined) {
    /******/ 		return cachedModule.exports;
    /******/ 	}
    /******/ 	// Create a new module (and put it into the cache)
    /******/ 	var module = __webpack_module_cache__[moduleId] = {
    /******/ 		// no module.id needed
    /******/ 		// no module.loaded needed
    /******/ 		exports: {}
    /******/ 	};
    /******/ 
    /******/ 	// Execute the module function
    /******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    /******/ 
    /******/ 	// Return the exports of the module
    /******/ 	return module.exports;
    /******/ }
    /******/ 
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be in strict mode.
    (() => {
    "use strict";
    
    // EXTERNAL MODULE: ./lolzteam/FroalaEditor/smilie_box.js
    var smilie_box = __webpack_require__(8421);
    ;// CONCATENATED MODULE: ./src/xf/image.ts
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
            var info = gen[key](arg);
            var value = info.value;
        } catch (error) {
            reject(error);
            return;
        }
        if (info.done) {
            resolve(value);
        } else {
            Promise.resolve(value).then(_next, _throw);
        }
    }
    function _async_to_generator(fn) {
        return function() {
            var self = this, args = arguments;
            return new Promise(function(resolve, reject) {
                var gen = fn.apply(self, args);
                function _next(value) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(undefined);
            });
        };
    }
    function _ts_generator(thisArg, body) {
        var f, y, t, g, _ = {
            label: 0,
            sent: function() {
                if (t[0] & 1) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        };
        return g = {
            next: verb(0),
            "throw": verb(1),
            "return": verb(2)
        }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
            return this;
        }), g;
        function verb(n) {
            return function(v) {
                return step([
                    n,
                    v
                ]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while(_)try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [
                    op[0] & 2,
                    t.value
                ];
                switch(op[0]){
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return {
                            value: op[1],
                            done: false
                        };
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [
                            0
                        ];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [
                    6,
                    e
                ];
                y = 0;
            } finally{
                f = t = 0;
            }
            if (op[0] & 5) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: true
            };
        }
    }
    
    function encodeBase64(buf) {
        return _encodeBase64.apply(this, arguments);
    }
    function _encodeBase64() {
        _encodeBase64 = _async_to_generator(function(buf) {
            var url, end;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!buf.length) return [
                            2,
                            ""
                        ];
                        return [
                            4,
                            new Promise(function(resolve) {
                                var reader = new FileReader();
                                reader.onload = function() {
                                    return resolve(reader.result);
                                };
                                reader.readAsDataURL(new Blob([
                                    buf
                                ]));
                            })
                        ];
                    case 1:
                        url = _state.sent();
                        end = url.indexOf("=");
                        return [
                            2,
                            url.slice(url.indexOf(",") + 1, end === -1 ? undefined : end)
                        ];
                }
            });
        });
        return _encodeBase64.apply(this, arguments);
    }
    function isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    function uploadFile(file, setProgress) {
        return _uploadFile.apply(this, arguments);
    }
    function _uploadFile() {
        _uploadFile = _async_to_generator(function(file, setProgress) {
            var cdnInfo, tokenConfig, _file_name, filename, resp;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (file.size / Math.pow(1024, 2) >= 200) {
                            throw new Error(phrase("lzt_fe_file_size_too_large_maximum_size_x", {
                                size: 200
                            }));
                        }
                        return [
                            4,
                            xf_fetch("/editor/cdn", {})
                        ];
                    case 1:
                        cdnInfo = _state.sent();
                        if (!cdnInfo.token) {
                            return [
                                2,
                                uploadFileImgur(file, setProgress)
                            ];
                        }
                        tokenConfig = JSON.parse(cdnInfo.token.split("|").at(-1));
                        if (file.type === "application/pdf" && !tokenConfig["pdf"]) {
                            return [
                                2,
                                {
                                    key: "",
                                    url: ""
                                }
                            ];
                        }
                        setProgress === null || setProgress === void 0 ? void 0 : setProgress({
                            type: "uploading",
                            value: null
                        });
                        return [
                            4,
                            encodeBase64(new TextEncoder().encode((_file_name = file.name) !== null && _file_name !== void 0 ? _file_name : ""))
                        ];
                    case 2:
                        filename = _state.sent();
                        return [
                            4,
                            new Promise(function(resolve, reject) {
                                var xhr = new XMLHttpRequest();
                                addListeners(xhr, resolve, reject, setProgress);
                                var formData = new FormData();
                                formData.append("file", file);
                                xhr.open("POST", cdnInfo.upload, true);
                                xhr.setRequestHeader("X-CDN-Token", cdnInfo.token);
                                xhr.setRequestHeader("X-CDN-Filename", filename);
                                xhr.send(formData);
                            })
                        ];
                    case 3:
                        resp = _state.sent();
                        if (resp.error) throw new Error(resp.error);
                        return [
                            2,
                            {
                                key: resp.key,
                                url: cdnInfo.files + encodeURIComponent(resp.key)
                            }
                        ];
                }
            });
        });
        return _uploadFile.apply(this, arguments);
    }
    function uploadFileImgur(file, setProgress) {
        return _uploadFileImgur.apply(this, arguments);
    }
    function _uploadFileImgur() {
        _uploadFileImgur = _async_to_generator(function(file, setProgress) {
            var resp;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        setProgress === null || setProgress === void 0 ? void 0 : setProgress({
                            type: "uploading",
                            value: null
                        });
                        return [
                            4,
                            new Promise(function(resolve, reject) {
                                var xhr = new XMLHttpRequest();
                                addListeners(xhr, resolve, reject, setProgress);
                                var formData = new FormData();
                                formData.append("image", file);
                                formData.append("type", "file");
                                formData.append("name", "image.png");
                                xhr.open("POST", "https://api.imgur.com/3/upload", true);
                                xhr.send(formData);
                            })
                        ];
                    case 1:
                        resp = _state.sent();
                        if (!resp.success) throw new Error("Failed to upload (Imgur): ".concat(JSON.stringify(resp)));
                        return [
                            2,
                            {
                                key: "",
                                url: resp.data.link
                            }
                        ];
                }
            });
        });
        return _uploadFileImgur.apply(this, arguments);
    }
    function addListeners(xhr, resolve, reject, setProgress) {
        xhr.upload.addEventListener("progress", function(e) {
            if (e.lengthComputable) setProgress === null || setProgress === void 0 ? void 0 : setProgress({
                type: "uploading",
                value: e.loaded / e.total
            });
            if (e.loaded === e.total) {
                setProgress === null || setProgress === void 0 ? void 0 : setProgress({
                    type: "processing",
                    value: null
                });
            }
        });
        xhr.addEventListener("loadend", function() {
            if (xhr.readyState !== 4) return reject(new Error("Network error"));
            if (isJsonString(xhr.response)) {
                resolve(JSON.parse(xhr.response));
            } else {
                if (xhr.status) {
                    return reject(new Error("Bad server response (".concat(xhr.status, "): ").concat(xhr.response)));
                } else {
                    return reject(new Error("Failed to communicate with CDN server. Check browser console for details."));
                }
            }
        });
    }
    
    ;// CONCATENATED MODULE: ./src/xf/storage.ts
    function _class_call_check(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    function _defineProperties(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _create_class(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }
    function _define_property(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    var localStorageSupported = function() {
        try {
            return "localStorage" in window && window["localStorage"] !== null;
        } catch (e) {
            return false;
        }
    }();
    var LocalStorage = /*#__PURE__*/ function() {
        "use strict";
        function LocalStorage() {
            _class_call_check(this, LocalStorage);
        }
        _create_class(LocalStorage, null, [
            {
                key: "getKey",
                value: function getKey(key) {
                    return "".concat(this.prefix).concat(key);
                }
            },
            {
                key: "get",
                value: function get(key, defaultValue) {
                    if (!localStorageSupported) return defaultValue;
                    var raw = localStorage.getItem(this.getKey(key));
                    if (raw === null) return defaultValue;
                    try {
                        return JSON.parse(raw);
                    } catch (err) {
                        return defaultValue;
                    }
                }
            },
            {
                key: "set",
                value: function set(key, value) {
                    if (!localStorageSupported) return;
                    localStorage.setItem(this.getKey(key), JSON.stringify(value));
                }
            }
        ]);
        return LocalStorage;
    }();
    _define_property(LocalStorage, "prefix", "lztng_");
    
    ;// CONCATENATED MODULE: ./src/xf/index.ts
    function _array_like_to_array(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
        return arr2;
    }
    function _array_with_holes(arr) {
        if (Array.isArray(arr)) return arr;
    }
    function _assert_this_initialized(self) {
        if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self;
    }
    function xf_class_call_check(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    function _construct(Parent, args, Class) {
        if (_is_native_reflect_construct()) {
            _construct = Reflect.construct;
        } else {
            _construct = function construct(Parent, args, Class) {
                var a = [
                    null
                ];
                a.push.apply(a, args);
                var Constructor = Function.bind.apply(Parent, a);
                var instance = new Constructor();
                if (Class) _set_prototype_of(instance, Class.prototype);
                return instance;
            };
        }
        return _construct.apply(null, arguments);
    }
    function xf_define_property(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    function _get_prototype_of(o) {
        _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
        };
        return _get_prototype_of(o);
    }
    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: true,
                configurable: true
            }
        });
        if (superClass) _set_prototype_of(subClass, superClass);
    }
    function _is_native_function(fn) {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }
    function _iterable_to_array_limit(arr, i) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
            for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally{
            try {
                if (!_n && _i["return"] != null) _i["return"]();
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    function _non_iterable_rest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _object_spread(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i] != null ? arguments[i] : {};
            var ownKeys = Object.keys(source);
            if (typeof Object.getOwnPropertySymbols === "function") {
                ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                }));
            }
            ownKeys.forEach(function(key) {
                xf_define_property(target, key, source[key]);
            });
        }
        return target;
    }
    function _possible_constructor_return(self, call) {
        if (call && (_type_of(call) === "object" || typeof call === "function")) {
            return call;
        }
        return _assert_this_initialized(self);
    }
    function _set_prototype_of(o, p) {
        _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
        return _set_prototype_of(o, p);
    }
    function _sliced_to_array(arr, i) {
        return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
    }
    function _type_of(obj) {
        "@swc/helpers - typeof";
        return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
    }
    function _unsupported_iterable_to_array(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _array_like_to_array(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(n);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
    }
    function _wrap_native_super(Class) {
        var _cache = typeof Map === "function" ? new Map() : undefined;
        _wrap_native_super = function wrapNativeSuper(Class) {
            if (Class === null || !_is_native_function(Class)) return Class;
            if (typeof Class !== "function") {
                throw new TypeError("Super expression must either be null or a function");
            }
            if (typeof _cache !== "undefined") {
                if (_cache.has(Class)) return _cache.get(Class);
                _cache.set(Class, Wrapper);
            }
            function Wrapper() {
                return _construct(Class, arguments, _get_prototype_of(this).constructor);
            }
            Wrapper.prototype = Object.create(Class.prototype, {
                constructor: {
                    value: Wrapper,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            return _set_prototype_of(Wrapper, Class);
        };
        return _wrap_native_super(Class);
    }
    function _is_native_reflect_construct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;
        try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
            return true;
        } catch (e) {
            return false;
        }
    }
    function _create_super(Derived) {
        var hasNativeReflectConstruct = _is_native_reflect_construct();
        return function _createSuperInternal() {
            var Super = _get_prototype_of(Derived), result;
            if (hasNativeReflectConstruct) {
                var NewTarget = _get_prototype_of(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
            } else {
                result = Super.apply(this, arguments);
            }
            return _possible_constructor_return(this, result);
        };
    }
    function phrase(name) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var resolved = XenForo.phrases[name];
        if (resolved) {
            var _options__toString;
            return resolved.replace(/\{\{(.*?)\}\}|\{(.*?)\}/g, function(match, option, option2) {
                var _options_;
                return (_options__toString = (_options_ = options[option !== null && option !== void 0 ? option : option2]) === null || _options_ === void 0 ? void 0 : _options_.toString()) !== null && _options__toString !== void 0 ? _options__toString : match;
            });
        } else {
            var formattedOptions = Object.entries(options).map(function(param) {
                var _param = _sliced_to_array(param, 2), key = _param[0], value = _param[1];
                return "".concat(key, ": ").concat(value);
            }).join(", ");
            return "".concat(name).concat(formattedOptions ? " (".concat(formattedOptions, ")") : "");
        }
    }
    var FetchError = /*#__PURE__*/ function(Error1) {
        "use strict";
        _inherits(FetchError, Error1);
        var _super = _create_super(FetchError);
        function FetchError(message) {
            xf_class_call_check(this, FetchError);
            return _super.call(this, "Fetch error: ".concat(message));
        }
        return FetchError;
    }(_wrap_native_super(Error));
    function xf_fetch(url) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return new Promise(function(resolve, reject) {
            var _options_signal;
            var xhr = XenForo.ajax(url, options.data, function(resp) {
                if (!options.ignoreError) {
                    var err = XenForo.hasResponseError(resp);
                    if (err && !(resp.status == "ok" && resp.message)) return reject(new FetchError(err === true ? "unknown" : err));
                }
                if (options.ignoreExtloader) {
                    return resolve(resp);
                }
                new XenForo.ExtLoader(resp, function() {
                    resolve(resp);
                }, function() {
                    reject(new FetchError("extloader failed"));
                });
            }, _object_spread({}, options.legacyOptions));
            (_options_signal = options.signal) === null || _options_signal === void 0 ? void 0 : _options_signal.addEventListener("abort", function() {
                return xhr.abort();
            });
        });
    }
    function legacyActivate(node, _) {
        var activate = function activate() {
            try {
                window.$(node).parent().xfActivate();
            } catch (err) {
                console.log(err);
            }
        };
        activate();
        return {
            update: function(_) {
                activate();
            }
        };
    }
    function legacyOverlayTrigger(node) {
        window.XenForo.create("XenForo.OverlayTrigger", window.$(node));
    }
    var visitor = {
        get userId () {
            return XenForo.visitor.user_id;
        },
        get languageId () {
            return XenForo.visitor.language_id;
        },
        get username () {
            return window.Im.username;
        },
        get timezone () {
            return window.Im.timezone;
        }
    };
    var isTouchBrowser = function() {
        try {
            return "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
        } catch (e) {
            return navigator.userAgent.includes("webOS");
        }
    }();
    function prank(message) {
        var audio = document.createElement("audio");
        audio.src = "/js/lolzteam/prank.mp3";
        var words = [
            "вби(вать|ть|вер|ва|ве|вы|вов|л|в)",
            "гидр(а|у)",
            "обнал(ы|ичить)?",
            "дроп(а|ов|ы)?",
            "цп",
            "центральный процессор",
            "отмы(вать|в|ть)",
            "cvc",
            "никитин(у|ой|а)",
            "кардинг(ом)?"
        ];
        if (new RegExp("(^|\\s|[!?.,\\\\/():-])(".concat(words.join("|"), ")($|\\s|[!?.,\\\\/():-])"), "i").test(message)) if (window.safari !== undefined) {
            audio.play();
        } else {
            setTimeout(function() {
                return audio.play();
            }, Math.random() * 10000);
        }
    }
    function formatTime(time) {
        var date = new Date(time);
        return date.toLocaleTimeString("ru-RU", {
            timeZone: visitor.timezone,
            timeStyle: "short"
        });
    }
    function formatDateTime(date) {
        return new Date(date).toLocaleString(visitor.languageId === 2 ? "ru-RU" : undefined, {
            timeZone: visitor.timezone,
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric"
        });
    }
    function debounce(func, time) {
        var timeout;
        var debounced = function debounced() {
            var _this = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                return func.apply(_this, args);
            }, time);
        };
        debounced.cancel = function() {
            return clearTimeout(timeout);
        };
        return debounced;
    }
    function declOfNum(number, titles, showNumber) {
        var cases = [
            2,
            0,
            1,
            1,
            1,
            2
        ];
        var index = number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5];
        var result = visitor.languageId == 1 && index == 2 ? titles[index - 1] : titles[index];
        if (showNumber) {
            result = number.toString() + " " + result;
        }
        return result;
    }
    
    
    
    
    ;// CONCATENATED MODULE: ./src/ui/SmiliePicker/SmilieLoader.ts
    function SmilieLoader_array_like_to_array(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
        return arr2;
    }
    function SmilieLoader_array_with_holes(arr) {
        if (Array.isArray(arr)) return arr;
    }
    function SmilieLoader_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
            var info = gen[key](arg);
            var value = info.value;
        } catch (error) {
            reject(error);
            return;
        }
        if (info.done) {
            resolve(value);
        } else {
            Promise.resolve(value).then(_next, _throw);
        }
    }
    function SmilieLoader_async_to_generator(fn) {
        return function() {
            var self = this, args = arguments;
            return new Promise(function(resolve, reject) {
                var gen = fn.apply(self, args);
                function _next(value) {
                    SmilieLoader_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                    SmilieLoader_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(undefined);
            });
        };
    }
    function SmilieLoader_class_call_check(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    function SmilieLoader_defineProperties(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function SmilieLoader_create_class(Constructor, protoProps, staticProps) {
        if (protoProps) SmilieLoader_defineProperties(Constructor.prototype, protoProps);
        if (staticProps) SmilieLoader_defineProperties(Constructor, staticProps);
        return Constructor;
    }
    function SmilieLoader_define_property(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    function SmilieLoader_iterable_to_array_limit(arr, i) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
            for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally{
            try {
                if (!_n && _i["return"] != null) _i["return"]();
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    function SmilieLoader_non_iterable_rest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function SmilieLoader_sliced_to_array(arr, i) {
        return SmilieLoader_array_with_holes(arr) || SmilieLoader_iterable_to_array_limit(arr, i) || SmilieLoader_unsupported_iterable_to_array(arr, i) || SmilieLoader_non_iterable_rest();
    }
    function SmilieLoader_unsupported_iterable_to_array(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return SmilieLoader_array_like_to_array(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(n);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return SmilieLoader_array_like_to_array(o, minLen);
    }
    function SmilieLoader_ts_generator(thisArg, body) {
        var f, y, t, g, _ = {
            label: 0,
            sent: function() {
                if (t[0] & 1) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        };
        return g = {
            next: verb(0),
            "throw": verb(1),
            "return": verb(2)
        }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
            return this;
        }), g;
        function verb(n) {
            return function(v) {
                return step([
                    n,
                    v
                ]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while(_)try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [
                    op[0] & 2,
                    t.value
                ];
                switch(op[0]){
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return {
                            value: op[1],
                            done: false
                        };
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [
                            0
                        ];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [
                    6,
                    e
                ];
                y = 0;
            } finally{
                f = t = 0;
            }
            if (op[0] & 5) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: true
            };
        }
    }
    
    var SmilieLoader = /*#__PURE__*/ function() {
        "use strict";
        function SmilieLoader() {
            SmilieLoader_class_call_check(this, SmilieLoader);
        }
        SmilieLoader_create_class(SmilieLoader, null, [
            {
                key: "load",
                value: function load() {
                    if (this.promise) return this.promise;
                    var _this = this;
                    return this.promise = SmilieLoader_async_to_generator(function() {
                        var cached, _ref, smiliesResp, feSmiliesResp, smilies;
                        return SmilieLoader_ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    cached = _this.tryLoadCached();
                                    if (cached) return [
                                        2,
                                        cached
                                    ];
                                    return [
                                        4,
                                        Promise.all([
                                            xf_fetch("/editor/smilies"),
                                            xf_fetch("/editor/fe-smilies")
                                        ])
                                    ];
                                case 1:
                                    _ref = SmilieLoader_sliced_to_array.apply(void 0, [
                                        _state.sent(),
                                        2
                                    ]), smiliesResp = _ref[0], feSmiliesResp = _ref[1];
                                    smilies = {
                                        box: feSmiliesResp.templateHtml,
                                        ac: smiliesResp.smilies,
                                        key: XenForo.smiliesCacheKey,
                                        categories: smiliesResp.categories
                                    };
                                    if (localStorageSupported) {
                                        try {
                                            window.localStorage.setItem(_this.localStorageKey, JSON.stringify(smilies));
                                        } catch (e) {}
                                    }
                                    return [
                                        2,
                                        smilies
                                    ];
                            }
                        });
                    })();
                }
            },
            {
                key: "tryLoadCached",
                value: function tryLoadCached() {
                    if (!localStorageSupported) return null;
                    var smilies = window.localStorage.getItem(this.localStorageKey);
                    if (!smilies) return null;
                    var parsed = JSON.parse(smilies);
                    if (parsed.key !== XenForo.smiliesCacheKey || !parsed.categories) return null;
                    parsed.box = DOMPurify.sanitize(parsed.box);
                    return parsed;
                }
            }
        ]);
        return SmilieLoader;
    }();
    SmilieLoader_define_property(SmilieLoader, "localStorageKey", "xf_lzt_fe_smilies");
    SmilieLoader_define_property(SmilieLoader, "promise", void 0);
    
    ;// CONCATENATED MODULE: ./lolzteam/FroalaEditor/editor.js
    function editor_array_like_to_array(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
        return arr2;
    }
    function editor_array_with_holes(arr) {
        if (Array.isArray(arr)) return arr;
    }
    function _array_without_holes(arr) {
        if (Array.isArray(arr)) return editor_array_like_to_array(arr);
    }
    function editor_assert_this_initialized(self) {
        if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self;
    }
    function editor_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
            var info = gen[key](arg);
            var value = info.value;
        } catch (error) {
            reject(error);
            return;
        }
        if (info.done) {
            resolve(value);
        } else {
            Promise.resolve(value).then(_next, _throw);
        }
    }
    function editor_async_to_generator(fn) {
        return function() {
            var self = this, args = arguments;
            return new Promise(function(resolve, reject) {
                var gen = fn.apply(self, args);
                function _next(value) {
                    editor_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                    editor_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(undefined);
            });
        };
    }
    function editor_class_call_check(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    function editor_defineProperties(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function editor_create_class(Constructor, protoProps, staticProps) {
        if (protoProps) editor_defineProperties(Constructor.prototype, protoProps);
        if (staticProps) editor_defineProperties(Constructor, staticProps);
        return Constructor;
    }
    function editor_define_property(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    function editor_get_prototype_of(o) {
        editor_get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
        };
        return editor_get_prototype_of(o);
    }
    function editor_inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: true,
                configurable: true
            }
        });
        if (superClass) editor_set_prototype_of(subClass, superClass);
    }
    function _iterable_to_array(iter) {
        if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }
    function editor_iterable_to_array_limit(arr, i) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
            for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally{
            try {
                if (!_n && _i["return"] != null) _i["return"]();
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    function editor_non_iterable_rest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _non_iterable_spread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function editor_object_spread(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i] != null ? arguments[i] : {};
            var ownKeys = Object.keys(source);
            if (typeof Object.getOwnPropertySymbols === "function") {
                ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                }));
            }
            ownKeys.forEach(function(key) {
                editor_define_property(target, key, source[key]);
            });
        }
        return target;
    }
    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            if (enumerableOnly) {
                symbols = symbols.filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                });
            }
            keys.push.apply(keys, symbols);
        }
        return keys;
    }
    function _object_spread_props(target, source) {
        source = source != null ? source : {};
        if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
        return target;
    }
    function editor_possible_constructor_return(self, call) {
        if (call && (editor_type_of(call) === "object" || typeof call === "function")) {
            return call;
        }
        return editor_assert_this_initialized(self);
    }
    function editor_set_prototype_of(o, p) {
        editor_set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
        return editor_set_prototype_of(o, p);
    }
    function editor_sliced_to_array(arr, i) {
        return editor_array_with_holes(arr) || editor_iterable_to_array_limit(arr, i) || editor_unsupported_iterable_to_array(arr, i) || editor_non_iterable_rest();
    }
    function _to_consumable_array(arr) {
        return _array_without_holes(arr) || _iterable_to_array(arr) || editor_unsupported_iterable_to_array(arr) || _non_iterable_spread();
    }
    function editor_type_of(obj) {
        "@swc/helpers - typeof";
        return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
    }
    function editor_unsupported_iterable_to_array(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return editor_array_like_to_array(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(n);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return editor_array_like_to_array(o, minLen);
    }
    function editor_is_native_reflect_construct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;
        try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
            return true;
        } catch (e) {
            return false;
        }
    }
    function editor_create_super(Derived) {
        var hasNativeReflectConstruct = editor_is_native_reflect_construct();
        return function _createSuperInternal() {
            var Super = editor_get_prototype_of(Derived), result;
            if (hasNativeReflectConstruct) {
                var NewTarget = editor_get_prototype_of(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
            } else {
                result = Super.apply(this, arguments);
            }
            return editor_possible_constructor_return(this, result);
        };
    }
    function editor_ts_generator(thisArg, body) {
        var f, y, t, g, _ = {
            label: 0,
            sent: function() {
                if (t[0] & 1) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        };
        return g = {
            next: verb(0),
            "throw": verb(1),
            "return": verb(2)
        }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
            return this;
        }), g;
        function verb(n) {
            return function(v) {
                return step([
                    n,
                    v
                ]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while(_)try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [
                    op[0] & 2,
                    t.value
                ];
                switch(op[0]){
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return {
                            value: op[1],
                            done: false
                        };
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [
                            0
                        ];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [
                    6,
                    e
                ];
                y = 0;
            } finally{
                f = t = 0;
            }
            if (op[0] & 5) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: true
            };
        }
    }
    
    
    
    var Lolzteam = window.Lolzteam || {};
    !function($, window1, document1, _undefined) {
        "use strict";
        var insertFix = // if editor is empty moves selection before <br>
        function insertFix(ed) {
            var ignoreMarkers = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
            var possibleP = ed.$el.children();
            var possibleBr = possibleP.children();
            if (possibleP.length === 1 && possibleP.is("p") && (ignoreMarkers ? possibleBr.length === 3 && possibleBr.eq(0).is("br") && possibleBr.filter(".fr-marker").length === 2 : possibleBr.length === 1 && possibleBr.is("br"))) {
                if (ignoreMarkers) {
                    possibleBr.filter("br").insertAfter(possibleBr.last());
                } else {
                    $(FroalaEditor.MARKERS).insertBefore(possibleBr[0]);
                    ed.selection.restore();
                }
            }
        };
        var escapeRegex = function escapeRegex(string) {
            return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
        };
        var stackTrace = function stackTrace() {
            var trace = [];
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = Error().stack.matchAll(/(.+|global code|)@(.+\.[A-z]+)|at (.+) \((.+):\d+:\d+\)/gm)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var match = _step.value;
                    if ((match[1] || match[3] || "") === "stackTrace") continue;
                    trace.push({
                        fn: match[1] || (match[3] || "").split("/").slice(-1),
                        file: match[2] || match[4] || ""
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            return trace;
        };
        // !!! ПРИ ОБНОВЛЕНИИ ФРОАЛЫ ЗАНОВО ПРОДЕБАЖИТЬ И ПОМЕНЯТЬ ЭТО ЗНАЧЕНИЕ !!!
        FroalaEditor.LZT_URL_HANDLER_POS = 3;
        /* 	null - без option
         number - option это число
         usernames - @user1, @user2 */ var wysiwygHideTags = {
            club: null,
            claim: null,
            days: "number",
            except: "usernames",
            hide: "number",
            likes: "number",
            users: "usernames",
            posts: "number"
        };
        Lolzteam.Editor = function($textarea) {
            this.__construct($textarea);
        };
        Lolzteam.Editor.prototype = {
            $textarea: null,
            options: {
                autoSaveFrequency: 60,
                saveDrafts: false,
                bbCodes: {},
                buttonConfig: null,
                height: 250,
                maxHeight: 0.7,
                minHeight: 63,
                placeholder: ""
            },
            autoSaveUrl: null,
            dialogUrl: null,
            edMinHeight: 63,
            $form: null,
            ed: null,
            __construct: function __construct($textarea) {
                if ($textarea.prop("data-froala.editor")) {
                    return;
                }
                this.$textarea = $textarea;
                this.options = $.extend({}, this.options, $textarea.data("options"));
                this.autoSaveUrl = $textarea.data("auto-save-url");
                this.dialogUrl = $textarea.data("dialog-url");
                this.$form = this.$textarea.closest("form");
                if (!this.$form.length) {
                    this.$form = null;
                }
                this.$textarea.trigger("lzt-editor:start", [
                    this
                ]);
                this.ed = new FroalaEditor($textarea[0], this.getEditorConfig(), $.context(this, "editorInit"));
            },
            getEditorConfig: function getEditorConfig() {
                var _FroalaEditor_LANGUAGE_xf;
                var fontSize = [
                    "9",
                    "10",
                    "12",
                    "13",
                    "15",
                    "18",
                    "22",
                    "26"
                ];
                var fontFamily = {
                    "arial": "Arial",
                    "'book antiqua'": "Book Antiqua",
                    "'courier new'": "Courier New",
                    "georgia": "Georgia",
                    "tahoma": "Tahoma",
                    "'times new roman'": "Times New Roman",
                    "'trebuchet ms'": "Trebuchet MS",
                    "verdana": "Verdana"
                };
                var heightLimits = this.getHeightLimits();
                var modal = this.$textarea.closest(".modal, .FloatingRedactor");
                var pluginBlacklist = [
                    "lineBreaker",
                    "forms"
                ];
                var config = {
                    direction: (_FroalaEditor_LANGUAGE_xf = FroalaEditor.LANGUAGE.xf) === null || _FroalaEditor_LANGUAGE_xf === void 0 ? void 0 : _FroalaEditor_LANGUAGE_xf.direction,
                    language: "xf",
                    fontFamily: fontFamily,
                    fontSize: fontSize,
                    height: this.options.height,
                    heightMin: heightLimits[0],
                    heightMax: heightLimits[1],
                    linkAlwaysBlank: true,
                    linkEditButtons: [
                        "linkOpen",
                        "linkEdit",
                        "linkRemove"
                    ],
                    imageAltButtons: [
                        "imageBack"
                    ],
                    imageSizeButtons: [
                        "imageBack"
                    ],
                    linkInsertButtons: [],
                    disableTextAutolink: true,
                    attribution: false,
                    charCounterCount: false,
                    quickInsertEnabled: false,
                    listAdvancedTypes: false,
                    editorClass: "messageText baseHtml LolzteamEditor",
                    iconsTemplate: "font_awesome_5l",
                    placeholderText: this.$textarea.prop("placeholder"),
                    htmlAllowedTags: [
                        "a",
                        "audio",
                        "b",
                        "bdi",
                        "bdo",
                        "smilie",
                        "blockquote",
                        "br",
                        "cite",
                        "code",
                        "dfn",
                        "div",
                        "em",
                        "h1",
                        "h2",
                        "h3",
                        "h4",
                        "h5",
                        "h6",
                        "hr",
                        "i",
                        "img",
                        "li",
                        "mark",
                        "ol",
                        "p",
                        "pre",
                        "s",
                        "small",
                        "span",
                        "strike",
                        "strong",
                        "sub",
                        "sup",
                        "time",
                        "tr",
                        "u",
                        "ul",
                        "var",
                        "video",
                        "wbr"
                    ],
                    htmlAllowComments: false,
                    toolbarButtons: this.getToolbarButtons(),
                    requestHeaders: {
                        "Authorization": "Client-ID " + Lolzteam.fe_imgurClientId
                    },
                    fileUpload: false,
                    imageAddNewLine: false,
                    imageDefaultAlign: "left",
                    imageDefaultDisplay: "inline",
                    imageDefaultWidth: "auto",
                    imageEditButtons: [
                        "imageAlign",
                        "imageSize",
                        "imageAlt",
                        "|",
                        "imageReplace",
                        "imageRemove",
                        "|",
                        "imageLink",
                        "linkEdit",
                        "linkRemove"
                    ],
                    imageInsertButtons: [
                        "imageBack",
                        "imageUpload",
                        "imageByURL"
                    ],
                    imagePasteProcess: true,
                    imageResize: false,
                    imageStyles: {},
                    imageUploadParam: "image",
                    imageUploadURL: "https://api.imgur.com/3/image",
                    imageMaxSize: 10 * 1024 * 1024,
                    videoUpload: false,
                    key: "ZOD3gA8B10A6C5A2G3C-8TMIBDIa1NTMNZFFPFZc1d1Ib2a1E1fA4A3G3F3F2B6C4C4C3G3==",
                    zIndex: this.$textarea.closest(".xenOverlay").length ? 11111 : 1,
                    scrollableContainer: modal.length ? "#" + XenForo.uniqueId(modal) : "body",
                    toolbarSticky: false,
                    pluginsEnabled: Object.keys(FroalaEditor.PLUGINS).filter(function(p) {
                        return !pluginBlacklist.includes(p);
                    })
                };
                if (this.options.buttonConfig) {
                    config.shortcutsEnabled = this.getEnabledShortcuts();
                }
                this.$textarea.trigger("lzt-editor:config", [
                    config,
                    this
                ]);
                return config;
            },
            editorInit: function editorInit() {
                var getSelectionCharOffsetsWithin = function getSelectionCharOffsetsWithin(element) {
                    var start = 0, end = 0;
                    var sel, range, priorRange;
                    range = window1.getSelection().getRangeAt(0);
                    priorRange = range.cloneRange();
                    priorRange.selectNodeContents(element);
                    priorRange.setEnd(range.startContainer, range.startOffset);
                    start = priorRange.toString().length;
                    end = start + range.toString().length;
                    return {
                        start: start,
                        end: end
                    };
                };
                var isBlockQuote = function isBlockQuote(blocks) {
                    var result = false;
                    blocks.map(function(e) {
                        if ($(e).closest("blockquote").length > 0 || $(e).is("blockquote")) {
                            result = true;
                        }
                    });
                    return result;
                };
                var checkBlockquote = function checkBlockquote(blockData, pData) {
                    var isBlockDataExists = !jQuery.isEmptyObject(blockData);
                    var isPDataExists = !jQuery.isEmptyObject(pData);
                    return isBlockDataExists || !isPDataExists;
                };
                var ed = this.ed, self = this;
                this.watchEditorHeight();
                var isPlainPaste = false;
                ed.opts.linkInsertButtons = ed.opts.imageAltButtons;
                ed.events.on("image.uploaded", function(response) {
                    var link = $.parseJSON(response).data.link;
                    ed.image.insert(link, false, null, ed.image.get(), response);
                    return false;
                });
                ed.events.on("cut", function(event) {
                    var blocks = ed.selection.blocks();
                    var isBlock = isBlockQuote(blocks);
                    if (isBlock || isBlockQuote([
                        blocks[0].previousSibling
                    ])) {
                        //не даст фроале удалить пустой хайд. спан удалится сам
                        $('<span class="fr-mk" style="display: none;">&nbsp;</span>').insertBefore(blocks[0]);
                    }
                //https://zelenka.guru/threads/4727924/ #744
                /*let beforeCut = ed.snapshot.get()
                    let selectionText = window.getSelection().toString()
                    setTimeout(function () {
                        let afterCut = ed.snapshot.get()
                        ed.snapshot.restore(beforeCut)
                        let blocks = ed.selection.blocks()
                        let positions = getSelectionCharOffsetsWithin(blocks[0])
                        let isBlock = isBlockQuote(blocks)
                        if (isBlock) {
                            let extentOffset = window.getSelection().extentOffset
                            let baseOffset = window.getSelection().baseOffset
                            let text = $(blocks).text()
                            text = text.slice(0, positions.start) + text.slice(positions.end, text.length)
                            if (blocks.length === 1) {
                                if (text === '') {
                                    $(blocks[0]).replaceWith($('<br>'))
                                }
                                $(blocks[0]).text(text)
                            } else if (blocks.length >= 1) {
                                let needBr = true
                                let selectionArray = selectionText.split('\n').filter(e => e !== '')
                                blocks.map(e => {
                                    if (e === blocks[blocks.length - 1]) {
                                        let lastSelectedElement = selectionArray[selectionArray.length - 1]?.trim()
                                        if ($(e)[0].innerText === lastSelectedElement) {
                                            if ($(e).is(':last-child') && needBr) {
                                                $("<p><br /></p>").insertAfter(e)
                                            }
                                            e.remove()
                                        } else {
                                            $(e)[0].innerText = $(e)[0].innerText.slice(extentOffset, $(e)[0].innerText.length)
                                        }
                                    } else if (e === blocks[0]) {
                                        let firstSelectedElement = selectionArray[0]?.trim()
                                        if ($(e)[0].innerText === firstSelectedElement) {
                                            e.remove()
                                        } else {
                                            $(e)[0].innerText = $(e)[0].innerText.slice(0, baseOffset)
                                            ed.selection.clear()
                                            needBr = false
                                        }
                                    } else {
                                        e.remove()
                                    }
                                })
                            } else {
                                ed.snapshot.restore(afterCut)
                            }
                        } else {
                            ed.snapshot.restore(afterCut)
                        }
                    }, 0)*/ }, true);
                ed.events.on("cut copy", function() {
                    var range = ed.selection.ranges(0);
                    if (!range || !range.commonAncestorContainer) {
                        return;
                    }
                    var container = range.commonAncestorContainer;
                    if (container.nodeType === Node.TEXT_NODE) {
                        if (range.startOffset === 0 && range.endOffset === container.length && !(container.parentNode === ed.$el[0] || $(container.parentNode).is("p"))) {
                            container = container.parentNode;
                            while(container.parentNode !== ed.$el[0] && !container.previousSibling && !container.nextSibling){
                                container = container.parentNode;
                            }
                            range.selectNode(container);
                        } else {
                            container = container.parentNode;
                        }
                    }
                    var $ps = $(container).find("p");
                    $ps.attr("data-xf-p", "1");
                    setTimeout(function() {
                        $ps.removeAttr("data-xf-p");
                    }, 0);
                });
                ed.events.on("paste.before", function(e) {
                    isPlainPaste = false;
                    if (e && e.clipboardData && e.clipboardData.getData) {
                        var clipboard_types = e.clipboardData.types;
                        var types = "";
                        if (ed.helpers.isArray(clipboard_types)) {
                            for(var type in clipboard_types){
                                types += clipboard_types[type] + ";";
                            }
                        } else {
                            types = clipboard_types;
                        }
                        if (/text\/plain/.test(types) && !ed.browser.mozilla && !/text\/html/.test(types) && (!/text\/rtf/.test(types) || !ed.browser.safari)) {
                            isPlainPaste = true;
                        }
                    }
                });
                ed.events.on("paste.beforeCleanup", function(content) {
                    if (isPlainPaste) {
                        content = content.replace(/\t/g, "    ").replace(/  /g, "&nbsp; ").replace(/  /g, "&nbsp; ").replace(/> /g, ">&nbsp;");
                    }
                    content = content.replace(/(<pre[^>]*>)([\s\S]+?)(<\/pre>)/g, function(match, open, inner, close) {
                        inner = inner.replace(/\r?\n/g, "<br>");
                        return open + inner + close;
                    });
                    var match;
                    match = content.match(/^(?:<meta[^>]*>)?<a href=(?:'|")([^'"]*)\/?(?:'|")>\1<\/a>$/);
                    if (match) {
                        content = $.trim(match[1]);
                    }
                    match = content.match(/<!--StartFragment--><a href=(?:'|")([^'"]*)\/?(?:'|")>[^<]+<\/a><!--EndFragment-->/);
                    if (match) {
                        content = $.trim(match[1]);
                    }
                    content = Lolzteam.EditorHelpers.adjustHtmlForRte(content);
                    var nodes = $.parseHTML(content) || [], removeAttributesFromNodeList = function removeAttributesFromNodeList1(nodes) {
                        var i, a;
                        for(i = 0; i < nodes.length; i++){
                            var node = nodes[i];
                            if (node instanceof Element) {
                                if (node.hasAttributes()) {
                                    var attrs = node.attributes;
                                    for(a = attrs.length - 1; a >= 0; a--){
                                        var attr = attrs[a];
                                        if (attr.name.toLowerCase().substring(0, 2) === "on" || attr.name.toLowerCase() === "style") {
                                            node.removeAttribute(attr.name);
                                        }
                                    }
                                }
                                removeAttributesFromNodeList(node.children);
                            }
                        }
                    };
                    removeAttributesFromNodeList(nodes);
                    // https://zelenka.guru/threads/6836762/
                    var $content = $("<div />").html(nodes);
                    if (!isPlainPaste) {
                        var mobile = ed.helpers.isMobile();
                        $content.find("span.loginData, span.col:has(span.AccountStatus > span.muted)").replaceWith(function() {
                            if (mobile) return "<p>".concat(this.innerHTML, "</p>");
                            return "".concat(this.innerHTML, "<br>");
                        });
                        $content.find("div[data-entry-id]").replaceWith(function() {
                            return this.innerHTML;
                        });
                    }
                    content = $content.html();
                    content = content.replace(/^(https?:\/\/[a-z\d\.\/_-]+\.(?:png|jpe?g|gif|webp|svg)(?:[?#]\S+)?)$/gi, '<img src="$1" style="" />');
                    return $.trim(content);
                });
                ed.events.on("paste.afterCleanup", function(content) {
                    if (content.includes("</blockquote>")) {
                        var $content = $(content);
                        $content.map(function(e) {
                            if ($($content[e]).is("blockquote") && checkBlockquote($($content[e]).data(), $($content[e]).find("p").data())) {
                                content = content.replace($content[e].outerHTML, $content[e].innerHTML);
                            }
                        });
                        var blockList = $content.find("blockquote");
                        blockList.map(function(num) {
                            content = content.replace(blockList[num].outerHTML, blockList[num].innerHTML);
                        });
                    }
                    return self.normalizePaste(content);
                });
                ed.events.on("paste.after", function() {
                    var range = ed.selection.ranges(0);
                    if (!range || !range.getBoundingClientRect) {
                        return;
                    }
                    var rect = range.getBoundingClientRect(), elRect = ed.$wp[0].getBoundingClientRect();
                    if (rect.top < 0 || rect.left < 0 || rect.bottom > $(window1).height() || rect.right > $(window1).width() || rect.bottom > elRect.bottom) {
                        setTimeout(function() {
                            self.scrollToCursor();
                        }, 100);
                    }
                    Lolzteam.EditorHelpers.normalizeBrForEditor(ed.$el);
                });
                var $ebContainer = $(ed.$wp[0]).find(".js-lzt-fe-extraButtons");
                if (!$ebContainer.length) $ebContainer = this.$textarea.siblings(".js-lzt-fe-extraButtons");
                this.$ebContainer = $ebContainer;
                var $extraButtons = $ebContainer.find(".lzt-fe-se-extraButton[data-cmd]");
                $.each($extraButtons, function() {
                    var $button = $(this), command = $button.data("cmd"), cmd = FroalaEditor.COMMANDS[command];
                    if (cmd) {
                        $button.attr("title", ed.language.translate(cmd.title));
                        $button.on(XenForo.isTouchBrowser() ? "mousedown" : "click", function(e) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            ed.commands.exec(command);
                        });
                    }
                });
                if (!XenForo.isTouchBrowser()) ed.tooltip.to($extraButtons);
                var $xfSmilieButtons = $(ed.$tb.find('.fr-command[data-cmd="xfSmilie"]')).add($ebContainer.find('button[data-cmd="xfSmilie"], div[data-cmd="xfSmilie"]'));
                $xfSmilieButtons.each(function() {
                    var $button = $(this);
                    $button.on("lzt-smilie-box-tooltip:smilies-loaded", function(e, smilieTooltip) {
                        var tooltip = smilieTooltip.setupTooltip();
                        $button.on("ac-picked-smilie", function(e) {
                            $(tooltip.popperChildren.content).find(".SmilieBox").data("Lolzteam.SmilieBox").reloadRecentlySmilies();
                        });
                        $(tooltip.popperChildren.content).find(".SmilieBox").on("lzt-smilie-box:pick-smilie", function(e, smilie) {
                            ed.selection.restore();
                            var $target = $(smilie), html = $target.html();
                            Lolzteam.EditorHelpers.focus(ed);
                            ed.undo.saveStep();
                            ed.selection.save();
                            insertFix(ed);
                            var $helper = $('<span class="fr-smilie-helper">&nbsp;</span>').hide().insertAfter(ed.$el.find(".fr-marker").last());
                            ed.selection.restore();
                            ed.html.insert('&nbsp;<smilie class="fr-deletable">'.concat($.trim(html), "</smilie> "));
                            $("smilie").attr("contenteditable", "false");
                            $('img[data-smilie="yes"]').attr("style", "user-select: auto !important;");
                            Lolzteam.EditorHelpers.normalizeAfterInsert(ed);
                            $helper.replaceWith(FroalaEditor.MARKERS);
                            Lolzteam.EditorHelpers.blur(ed);
                            ed.selection.restore();
                            ed.undo.saveStep();
                            tooltip.show();
                        });
                    });
                    var tooltip = new Lolzteam.SmilieBoxTooltip($button, {
                        onShown: function onShown() {
                            ed.popups.hide("autoComplete.smilie");
                            ed.selection.save();
                            ed.selection.clear();
                            $(".smilieCategories").find(".scroll-y").find(".scroll-bar").css("top", 0);
                            $(".smilieList").find(".scroll-x").find(".scroll-bar").css("left", 0);
                        },
                        onHide: function onHide() {
                            ed.selection.restore();
                        }
                    });
                    ed.events.on("keydown", function(e) {
                        switch(e.keyCode){
                            case 9:
                                e.preventDefault();
                                if (tooltip.tooltip.state.isVisible) {
                                    tooltip.tooltip.hide();
                                } else {
                                    tooltip.tooltip.show();
                                }
                                return false;
                            case 27:
                                if (tooltip.tooltip.state.isVisible) tooltip.tooltip.hide();
                                return false;
                            case 37:
                            case 38:
                            case 39:
                            case 40:
                                return false;
                        }
                    }, true);
                });
                var $xfInsertGifButtons = $(ed.$tb.find('.fr-command[data-cmd="xfInsertGif"]')).add($ebContainer.find('button[data-cmd="xfInsertGif"]'));
                $xfInsertGifButtons.each(function() {
                    var $button = $(this);
                    var tooltipHandler = new Lolzteam.GiphyBoxTooltip($button, {
                        onShown: function onShown() {
                            ed.selection.save();
                        },
                        onInsert: function(gif) {
                            var $image = $('<img class="fr-fic fr-dii fr-draggable"/>').attr("src", gif.url).attr("alt", gif.title);
                            Lolzteam.EditorHelpers.focus(ed);
                            ed.undo.saveStep();
                            ed.html.insert($image.prop("outerHTML"), true);
                            ed.undo.saveStep();
                            Lolzteam.EditorHelpers.blur(ed);
                            Lolzteam.EditorHelpers.normalizeAfterInsert(ed);
                            tooltipHandler.tooltip.hide();
                        }
                    });
                });
                var $lztTemplateButtons = $(ed.$tb.find('.fr-command[data-cmd="lztTemplate"]')).add($ebContainer.find('button[data-cmd="lztTemplate"], div[data-cmd="lztTemplate"]'));
                $lztTemplateButtons.each(function() {
                    var $button = $(this);
                    var $templatesBox = $("#ConversationTemplates").clone();
                    if (!$templatesBox.length) {
                        return;
                    }
                    $templatesBox.data("lzt-fe-ed", ed);
                    $(this).data("tippy-content", $templatesBox[0]);
                    XenForo.tippy($button[0], {
                        content: $templatesBox[0],
                        onShown: function onShown() {
                            $templatesBox.xfActivate();
                        },
                        onShow: function() {
                            ed.selection.save();
                        },
                        onHide: function() {
                            ed.selection.restore();
                        },
                        boundary: "window"
                    }, "popup");
                });
                this.$textarea.trigger("lzt-editor:initDone", [
                    this
                ]);
                new Lolzteam.EditorAutoCompleter(ed.$el, {
                    insertMode: "html"
                }, ed);
                Lolzteam.EditorHelpers.setupBlurSelectionWatcher(ed);
                ed.xfDraft.initAutoSave();
            },
            getHeightLimits: function getHeightLimits() {
                var maxHeightOption = this.options.maxHeight, minHeightOption = this.options.minHeight, maxHeight = null, minHeight = null;
                if (maxHeightOption) {
                    var viewHeight = $(window1).height(), height;
                    if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
                        viewHeight -= 250;
                    }
                    if (maxHeightOption > 0) {
                        if (maxHeightOption <= 1) {
                            height = viewHeight * maxHeightOption;
                        } else {
                            height = maxHeightOption;
                        }
                    } else {
                        height = viewHeight + maxHeightOption;
                    }
                    maxHeight = Math.floor(height);
                    maxHeight = Math.max(maxHeight, 150);
                }
                if (minHeightOption && maxHeight) {
                    minHeight = Math.min(minHeightOption, maxHeight);
                    if (minHeight === maxHeight) {
                        minHeight -= 1;
                    }
                }
                return [
                    minHeight,
                    maxHeight
                ];
            },
            focus: function focus() {
                Lolzteam.EditorHelpers.focus(this.ed);
            },
            blur: function blur() {
                Lolzteam.EditorHelpers.blur(this.ed);
            },
            normalizePaste: function normalizePaste(content) {
                var _ed_selection_get, _ed_selection_get_focusNode;
                content = content.replace(/(<(ul|li|p|div)>)\s+/ig, "$1");
                content = content.replace(/\s+(<\/(ul|li|p|div)>)/ig, "$1");
                content = content.replace(/<span>&nbsp;<\/span>/ig, " ").replace(/(<\/li>)\s+(<li)/ig, "$1$2");
                // https://zelenka.guru/threads/6659612
                content = content.replace(/<smilie><br><span/, "<smilie><span").replace(/(<\/span><\/smilie>)<span><\/span><br>/, "$1");
                var frag = $.parseHTML(content);
                var ed = this.ed, $fragWrapper = $("<div />").html(frag);
                $fragWrapper.find("code, del, ins, sub, sup").replaceWith(function() {
                    return this.innerHTML;
                });
                var hasH1 = false;
                $fragWrapper.find("h1").replaceWith(function() {
                    hasH1 = true;
                    return $("<h2>").append($(this).contents());
                });
                var hMap = {
                    "H2": hasH1 ? "H3" : "H2",
                    "H3": hasH1 ? "H4" : "H3",
                    "H4": "H4",
                    "H5": "H4",
                    "H6": "H4"
                };
                $fragWrapper.find("h2, h3, h4, h5, h6").replaceWith(function() {
                    return $("<" + hMap[this.tagName] + ">").append($(this).contents());
                });
                $fragWrapper.find("pre").replaceWith(function() {
                    return this.innerHTML.replace(/\r?\n/g, "<br>").replace(/\t/g, "    ").replace(/  /g, "&nbsp; ").replace(/  /g, "&nbsp; ").replace(/> /g, ">&nbsp;").replace(/<br> /g, "<br>&nbsp;") + "<br>";
                });
                if (!ed.opts.imagePaste) {
                    $fragWrapper.find("img[data-fr-image-pasted]").each(function() {
                        var $this = $(this), src = $this.attr("src");
                        if (src.match(/https?:\/\//i)) {
                            $this.removeAttr("data-fr-image-pasted");
                        }
                    });
                }
                $fragWrapper.find("br").each(function(i, br) {
                    var $parents = $(br).parents().not($fragWrapper);
                    if (!$parents.length) {
                        return;
                    }
                    if ($parents.filter(function(j, el) {
                        return ed.node.isBlock(el);
                    }).length) {
                        return;
                    }
                    var $shiftTarget = $([]), shiftIsEl = false, $clone, ref = br, $topParent = $parents.last();
                    do {
                        while(ref.nextSibling){
                            $clone = $(ref.nextSibling).clone();
                            if (shiftIsEl) {
                                $shiftTarget.append($clone);
                            } else {
                                $shiftTarget = $shiftTarget.add($clone);
                            }
                            $(ref.nextSibling).remove();
                        }
                        ref = ref.parentNode;
                        if (!ref || $fragWrapper.is(ref)) {
                            break;
                        }
                        $clone = $(ref).clone().empty();
                        $clone.html($shiftTarget);
                        $shiftTarget = $clone;
                        shiftIsEl = true;
                    }while (ref.parentNode && !$fragWrapper.is(ref.parentNode));
                    $(br).remove();
                    $topParent.after($shiftTarget);
                    $topParent.after("<br />");
                });
                var copiedText = "";
                try {
                    copiedText = (ed.win.localStorage.getItem("fr-copied-text") || "").replace(/\s/g, "");
                } catch (e) {}
                if (copiedText !== $fragWrapper[0].textContent.replace(/\s/g, "")) {
                    $fragWrapper.find("> p:not([data-xf-p])").each(function() {
                        if (this.nextSibling) {
                            $(this).after("<p />");
                        }
                    });
                }
                $fragWrapper.find("p").removeAttr("data-xf-p");
                frag = $fragWrapper.contents();
                var $output = $("<div />"), $wrapTarget = null;
                for(var i = 0; i < frag.length; i++){
                    var node = frag[i];
                    if (node.innerHTML === "" && $(node).is("p")) {} else {
                        if (node.nodeType === Node.ELEMENT_NODE && ed.node.isBlock(node)) {
                            $output.append(node);
                            $wrapTarget = null;
                        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") {
                            if (!$wrapTarget) {
                                $output.append("<p />");
                            }
                            $wrapTarget = null;
                        } else {
                            if (!$wrapTarget) {
                                $wrapTarget = $("<p />");
                                $output.append($wrapTarget);
                            }
                            $wrapTarget.append(node);
                        }
                    }
                }
                var $children = $output.children();
                if ($children.length === 1 && $children.is("p, div")) {
                    $output = $children;
                }
                var deleted = $((_ed_selection_get = ed.selection.get()) === null || _ed_selection_get === void 0 ? void 0 : (_ed_selection_get_focusNode = _ed_selection_get.focusNode) === null || _ed_selection_get_focusNode === void 0 ? void 0 : _ed_selection_get_focusNode.parentElement);
                if (deleted.length && deleted.is("span")) {
                    $output = $('<p><span style="'.concat(deleted.attr("style"), '">').concat($output.html(), "</span></p>"));
                }
                return Lolzteam.EditorHelpers.normalizeBrForEditor($output.html());
            },
            watchEditorHeight: function watchEditorHeight() {
                var ed = this.ed, self = this;
                $(window1).on("resize", function() {
                    var heightLimits = self.getHeightLimits();
                    ed.opts.heightMin = heightLimits[0];
                    ed.opts.heightMax = heightLimits[1];
                    ed.size.refresh();
                });
                ed.events.on("focus", function() {
                    self.scrollToCursorAfterPendingResize();
                });
                var getHeight = function getHeight() {
                    return ed.$wp.height();
                };
                var height = getHeight();
                var layoutChangeIfNeeded = function layoutChangeIfNeeded() {
                    var newHeight = getHeight();
                    if (height !== newHeight) {
                        height = newHeight;
                    }
                };
                ed.events.on("keyup", layoutChangeIfNeeded);
                ed.events.on("commands.after", layoutChangeIfNeeded);
                ed.events.on("html.set", layoutChangeIfNeeded);
                ed.events.on("init", layoutChangeIfNeeded);
                ed.events.on("initialized", layoutChangeIfNeeded);
                ed.events.on("toolbar.show", function() {
                    this.$wp.addClass("lzt-fe-tb-open");
                });
                ed.events.on("toolbar.hide", function() {
                    this.$wp.removeClass("lzt-fe-tb-open");
                });
            },
            getEnabledShortcuts: function() {
                var shortcuts = [
                    "undo",
                    "redo"
                ];
                var categoriesMap = {
                    basic: [
                        "bold",
                        "italic",
                        "strikeThrough"
                    ],
                    image: [
                        "insertImage"
                    ],
                    link: [
                        "createLink"
                    ],
                    indent: [
                        "indent",
                        "outdent"
                    ]
                };
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = Object.entries(this.options.buttonConfig)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var _step_value = editor_sliced_to_array(_step.value, 2), key = _step_value[0], value = _step_value[1];
                        var _shortcuts;
                        if (!value || !categoriesMap[key]) continue;
                        (_shortcuts = shortcuts).push.apply(_shortcuts, _to_consumable_array(categoriesMap[key]));
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return shortcuts;
            },
            getToolbarButtons: function getToolbarButtons() {
                var options = this.options, buttonConfig = options.buttonConfig, bbCodes = options.bbCodes, moreText = [], moreParagraph = [], moreRich = [], moreMisc = [];
                if (!buttonConfig || buttonConfig.basic) {
                    moreText.push("clearFormatting", "bold", "italic", "strikeThrough");
                }
                if (!buttonConfig || buttonConfig.extended) {
                    moreText.push("fontSize", "textColor");
                }
                if (!buttonConfig || buttonConfig.align) {
                    moreParagraph.push("xfAlign");
                }
                if (!buttonConfig || buttonConfig.list) {
                    moreParagraph.push("formatUL", "formatOL");
                }
                if (!buttonConfig || buttonConfig.link) {
                    moreRich.push("insertLink");
                }
                if (!buttonConfig || buttonConfig.image) {
                    moreRich.push("xfInsertImage", "xfInsertGif");
                }
                if (!buttonConfig || buttonConfig.smilies) {
                    moreRich.push("xfSmilie");
                }
                if (!buttonConfig || buttonConfig.media) {
                    moreRich.push("xfMedia");
                }
                if (!buttonConfig || buttonConfig.block) moreRich.push("lztInsert");
                if (!buttonConfig || Object.keys(wysiwygHideTags).filter(function(tag) {
                    return buttonConfig[tag];
                }).length) moreRich.push("lztHide");
                moreMisc.push("undo", "redo", "xfBbCode", "fullscreen");
                if (this.autoSaveUrl) {
                    moreMisc.push("xfDraft");
                }
                return {
                    moreText: {
                        buttons: moreText,
                        buttonsVisible: moreText.length,
                        align: "left"
                    },
                    moreParagraph: {
                        buttons: moreParagraph,
                        buttonsVisible: moreParagraph.length,
                        align: "left"
                    },
                    moreRich: {
                        buttons: moreRich,
                        buttonsVisible: moreRich.length,
                        align: "left "
                    },
                    moreMisc: {
                        buttons: moreMisc,
                        buttonsVisible: moreMisc.length,
                        align: "right"
                    }
                };
            },
            isBbCodeView: function isBbCodeView() {
                if (this.ed.xfBbCode && this.ed.xfBbCode.isBbCodeView) {
                    return this.ed.xfBbCode.isBbCodeView();
                } else {
                    return false;
                }
            },
            replaceContent: function replaceContent(html, text) {
                var ed = this.ed;
                if (this.isBbCodeView()) {
                    if (typeof text !== "undefined") {
                        ed.bbCode.replaceBbCode(text);
                    }
                } else {
                    ed.html.set(html);
                }
            },
            scrollToCursor: function scrollToCursor() {
                var ed = this.ed;
                if (this.isBbCodeView()) {
                    Lolzteam.FE.autofocus(ed.xfBbCode.getTextArea());
                    ed.$box[0].scrollIntoView(true);
                } else {
                    this.focus();
                    var $edBox = ed.$box, $edWrapper = ed.$wp, selEl = ed.selection.endElement(), selBottom = selEl.getBoundingClientRect().bottom, isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
                    var selVisible = true, winHeight = $(window1).height();
                    if (isIos) {
                        winHeight -= 250;
                    }
                    if (selBottom < 0 || selBottom >= winHeight) {
                        selVisible = false;
                    }
                    if ($edWrapper && selVisible) {
                        var wrapperRect = $edWrapper[0].getBoundingClientRect();
                        if (selBottom > wrapperRect.bottom || selBottom < wrapperRect.top) {
                            selVisible = false;
                        }
                    }
                    if (!selVisible) {
                        var boxPos = $edBox[0].getBoundingClientRect();
                        if (boxPos.top < 0 || boxPos.bottom >= winHeight) {
                            if (!isIos) {
                                $edBox.addClass("is-scrolling-to");
                            }
                            $edBox[0].scrollIntoView(true);
                            $edBox.removeClass("is-scrolling-to");
                        }
                        if ($edWrapper) {
                            var info = ed.position.getBoundingRect().top;
                            if (info > $edWrapper.offset().top - ed.helpers.scrollTop() + $edWrapper.height() - 50) {
                                $edWrapper.scrollTop(info + $edWrapper.scrollTop() - ($edWrapper.height() + $edWrapper.offset().top) + ed.helpers.scrollTop() + winHeight / 2);
                            }
                        } else {
                            selEl.scrollIntoView();
                        }
                    }
                }
            },
            scrollToCursorAfterPendingResize: function scrollToCursorAfterPendingResize(forceTrigger) {
                var self = this, ed = this.ed;
                var scrollTimer;
                var scrollWatcher = function scrollWatcher() {
                    if (scrollTimer) {
                        clearTimeout(scrollTimer);
                    }
                    scrollTimer = setTimeout(scrollTo, 100);
                };
                var onResize = function onResize1() {
                    $(window1).off("resize", onResize);
                    $(window1).on("scroll", scrollWatcher);
                    if (scrollTimer) {
                        clearTimeout(scrollTimer);
                    }
                    scrollTimer = setTimeout(scrollTo, 500);
                };
                var scrollTo = function scrollTo() {
                    $(window1).off("scroll", scrollWatcher);
                    if (ed.core.hasFocus()) {
                        self.scrollToCursor();
                    }
                };
                $(window1).on("resize", onResize);
                setTimeout(function() {
                    $(window1).off("resize", onResize);
                }, 2000);
                if (forceTrigger) {
                    scrollTimer = setTimeout(scrollTo, 1000);
                }
            }
        };
        Lolzteam.EditorSimple = Lolzteam.FE.extend(Lolzteam.Editor, {
            __backup: {
                "__construct": "___construct",
                "editorInit": "_editorInit",
                "getToolbarButtons": "_getToolbarButtons"
            },
            __construct: function __construct($textarea) {
                $textarea.on("lzt-editor:start", function(e, editor) {
                    editor.options = $.extend({}, $textarea.data("options"), {
                        minHeight: Math.max(this.edMinHeight, editor.options.height),
                        height: "auto"
                    });
                });
                $textarea.on("lzt-editor:config", function(e, config) {
                    config.editorClass = config.editorClass.replace("LolzteamEditor", "LolzteamEditorSimple");
                });
                this.___construct($textarea);
            },
            editorInit: function editorInit() {
                var $extraButtons = $(this.ed.$box[0]).closest(".defEditor").find(".js-lzt-fe-extraButtons");
                if (this.ed.$box.closest("#QuickReply").length) {
                    // https://zelenka.guru/threads/4775314/ + https://zelenka.guru/threads/4733283/
                    $extraButtons.css("display", "");
                } else if ($extraButtons.length) {
                    $extraButtons.clone().appendTo(this.ed.$wp[0]).css("display", "");
                }
                this._editorInit();
                this.ed.toolbar.hide();
                if (!$(this.ed.$tb).is(":hidden")) {
                    $(this.ed.$tb.find('.fr-command[data-cmd="lztToggleToolbar"]')).add(this.$ebContainer.find('button[data-cmd="lztToggleToolbar"], div[data-cmd="lztToggleToolbar"]')).css("transform", "rotate(180deg)");
                    $(this.ed.$wp).css({
                        borderTopLeftRadius: "0px",
                        borderTopRightRadius: "0px"
                    });
                }
                if (this.$form != null) {
                    this.initAttachmentMenu(this.$form.find(".AttachmentButton"));
                }
            },
            initAttachmentMenu: function initAttachmentMenu($el) {
                var $menu = $(".AttachmentMenu"), isFirstShown = true;
                var self = this;
                var $content = $("<div>").append($menu.clone()).attr("id", "").html();
                $menu.remove();
                var callback = function callback() {
                    if (!isFirstShown) return;
                    var $menu = $(".AttachmentMenu");
                    $menu.find(".AttachImage").on("click", function(e) {
                        e.preventDefault();
                        self.ed.commands.exec("xfInsertImage");
                    });
                    $menu.find(".AttachVideo").on("click", function(e) {
                        e.preventDefault();
                        self.ed.commands.exec("xfMedia");
                    });
                    $menu.xfActivate();
                    $menu.find(".AttachImageFromPc").on("click", function(e) {
                        e.preventDefault();
                        $('<input type="file">').on("change", function(e) {
                            if (e.target.files) self.ed.image.upload(e.target.files);
                        }).click();
                    });
                };
                XenForo.tippy($el.selector, {
                    content: $content,
                    hideOnClick: false,
                    distance: -10,
                    zIndex: $el.closest(".xenOverlay").length ? 11111 : 9000,
                    onShown: function onShown() {
                        self.ed.selection.save();
                        self.ed.selection.clear();
                        self.ed.events.disableBlur();
                        callback();
                        isFirstShown = false;
                    },
                    onHide: function onHide() {
                        self.ed.events.enableBlur();
                        self.ed.selection.restore();
                    }
                }, "popup");
            },
            getToolbarButtons: function getToolbarButtons() {
                var options = this.options, buttonConfig = options.buttonConfig, bbCodes = options.bbCodes, moreText = [], moreParagraph = [], moreRich = [], moreMisc = [];
                if (!buttonConfig || buttonConfig.basic) {
                    moreText.push("clearFormatting", "bold", "italic", "strikeThrough");
                }
                if (!buttonConfig || buttonConfig.extended) {
                    moreText.push("fontSize", "textColor");
                }
                if (!buttonConfig || buttonConfig.align) {
                    moreParagraph.push("xfAlign");
                }
                if (!buttonConfig || buttonConfig.list) {
                    moreParagraph.push("formatUL", "formatOL");
                }
                if (!buttonConfig || buttonConfig.link) {
                    moreRich.push("insertLink");
                }
                if (!buttonConfig || buttonConfig.image) moreRich.push("xfInsertImage", "xfInsertGif");
                if (!buttonConfig || buttonConfig.media) {
                    moreRich.push("xfMedia");
                }
                if (!buttonConfig || buttonConfig.block) moreRich.push("lztInsert");
                if (!buttonConfig || Object.keys(wysiwygHideTags).filter(function(tag) {
                    return buttonConfig[tag];
                }).length) moreRich.push("lztHide");
                moreMisc.push("undo", "redo", "fullscreen");
                return {
                    moreText: {
                        buttons: moreText,
                        buttonsVisible: moreText.length,
                        align: "left"
                    },
                    moreParagraph: {
                        buttons: moreParagraph,
                        buttonsVisible: moreParagraph.length,
                        align: "left"
                    },
                    moreRich: {
                        buttons: moreRich,
                        buttonsVisible: moreRich.length,
                        align: "left "
                    },
                    moreMisc: {
                        buttons: moreMisc,
                        buttonsVisible: moreMisc.length,
                        align: "right"
                    }
                };
            }
        });
        Lolzteam.EditorHelpers = {
            insertFix: insertFix,
            setupBlurSelectionWatcher: function setupBlurSelectionWatcher(ed) {
                var $el = ed.$el, trackKey = "xf-ed-blur-sel";
                var range, trackSelection = false;
                $(document1).on("mousedown keydown", function(e) {
                    if (!trackSelection) {
                        return;
                    }
                    if (ed.$el[0] === e.target || $.contains(ed.$el[0], e.target)) {
                        return;
                    }
                    if (!ed.selection.inEditor()) {
                        return;
                    }
                    range = ed.selection.ranges(0);
                });
                ed.events.on("blur", function() {
                    ed.$box.removeClass("is-focused");
                    if (range) {
                        $el.data(trackKey, range);
                    } else {
                        $el.removeData(trackKey);
                    }
                    trackSelection = false;
                    range = null;
                }, true);
                ed.events.on("focus", function() {
                    ed.$box.addClass("is-focused");
                    trackSelection = true;
                    range = null;
                    setTimeout(function() {
                        $el.removeData(trackKey);
                    }, 0);
                });
                ed.events.on("commands.before", function(cmd) {
                    var cmdConfig = FroalaEditor.COMMANDS[cmd];
                    if (cmdConfig && (typeof cmdConfig.focus == "undefined" || cmdConfig.focus)) {
                        if (ed.helpers.isMobile() && cmd === "applytextColor") {
                            //https://zelenka.guru/threads/6480884/
                            //restoreMaintainedSelection смещал последний маркер в начало строки
                            return;
                        }
                        Lolzteam.EditorHelpers.restoreMaintainedSelection(ed);
                    }
                });
            },
            restoreMaintainedSelection: function restoreMaintainedSelection(ed) {
                var $el = ed.$el, blurSelection = $el.data("xf-ed-blur-sel");
                if (!ed.selection.inEditor()) {
                    if (blurSelection) {
                        ed.markers.remove();
                        ed.markers.place(blurSelection, true, 0);
                        ed.markers.place(blurSelection, false, 0);
                        ed.selection.restore();
                    } else {
                        var lastTag = ed.$el.find("p:last-child > *:last-child")[0];
                        if (!lastTag) {
                            ed.selection.setAfter(ed.el);
                        } else {
                            ed.selection.setBefore(lastTag);
                        // ed.selection.setAfter(lastTag);
                        // if (lastTag.tagName == 'BR')
                        // {
                        //     lastTag.remove();
                        // }
                        }
                        ed.selection.restore();
                    }
                }
            },
            focus: function focus(ed) {
                var shouldRestore = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                if (!ed.lztVideoHack && shouldRestore) Lolzteam.EditorHelpers.restoreMaintainedSelection(ed);
                ed.$tb.addClass("is-focused");
                ed.events.focus();
            },
            blur: function blur(ed) {
                ed.$el[0].blur();
                ed.$tb.removeClass("is-focused");
                ed.selection.clear();
            },
            sync: function sync(ed) {
                ed.$oel.val(ed.html.get());
            },
            wrapSelectionText: function wrapSelectionText(ed, before, after, save) {
                insertFix(ed);
                if (save) {
                    ed.selection.save();
                }
                ed.undo.saveStep();
                var $markers = ed.$el.find(".fr-marker");
                var startEl = $markers.first()[0];
                var endEl = $markers.last()[0];
                while(!startEl.previousSibling && startEl.parentElement && !startEl.parentElement.matches("div, p"))$(startEl).insertBefore(startEl.parentElement);
                while(!endEl.nextSibling && endEl.parentElement && !endEl.parentElement.matches("div, p"))$(endEl).insertAfter(endEl.parentElement);
                $markers.first().before(XenForo.htmlspecialchars(before));
                $markers.last().after(XenForo.htmlspecialchars(after));
                ed.selection.restore();
                ed.placeholder.hide();
                ed.undo.saveStep();
                Lolzteam.EditorHelpers.normalizeAfterInsert(ed);
            },
            normalizeBrForEditor: function normalizeBrForEditor(content) {
                var asString = typeof content === "string";
                var $fragWrapper;
                if (asString) {
                    $fragWrapper = $("<div />").html(content);
                } else {
                    $fragWrapper = content;
                }
                var checkNodeMatch = function checkNodeMatch($node, elementType) {
                    var node = $node.get(0);
                    return $node.is(elementType) && node.className === "" && !node.hasAttribute("id") && !node.hasAttribute("style");
                };
                $fragWrapper.children("p").each(function() {
                    if (this.childNodes.length !== 1) {
                        return;
                    }
                    var $firstChild = $(this.childNodes[0]);
                    if (checkNodeMatch($firstChild, "span")) {
                        $(this).html($firstChild.html());
                    }
                });
                $fragWrapper.children("p").each(function() {
                    if (this.childNodes.length <= 1) {
                        return;
                    }
                    var $firstChild = $(this.childNodes[0]);
                    if (checkNodeMatch($firstChild, "br")) {
                        $(this).before($("<p>").append($firstChild));
                    }
                });
                $fragWrapper.children("p").each(function() {
                    if (this.childNodes.length <= 1) {
                        return;
                    }
                    var $lastChild = $(this.childNodes[this.childNodes.length - 1]);
                    if (checkNodeMatch($lastChild, "br") && this.nextSibling === null) {
                        $lastChild.remove();
                    }
                });
                return asString ? $fragWrapper.html() : $fragWrapper;
            },
            normalizeAfterInsert: function normalizeAfterInsert(ed) {
                var selected = ed.html.getSelected();
                if (/<br>\s*<\/p>/.test(selected)) {
                    Lolzteam.EditorHelpers.normalizeBrForEditor(ed.$el);
                    ed.undo_index--;
                    ed.undo_stack.pop();
                    ed.undo.saveStep();
                }
            },
            insertCode: function insertCode(ed, type, code) {
                var tag, lang, output;
                switch(type.toLowerCase()){
                    case "":
                        tag = "CODE";
                        lang = "";
                        break;
                    default:
                        tag = "CODE";
                        lang = type.toLowerCase();
                        break;
                }
                code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\t/g, "    ").replace(/\n /g, "\n&nbsp;").replace(/  /g, "&nbsp; ").replace(/  /g, " &nbsp;").replace(/\n/g, "</p><p>");
                output = "[" + tag + (lang ? "=" + lang : "") + "]" + code + "[/" + tag + "]";
                if (output.match(/<\/p>/i)) {
                    output = "<p>" + output + "</p>";
                    output = output.replace(/<p><\/p>/g, "<p><br></p>");
                }
                ed.undo.saveStep();
                insertFix(ed);
                ed.html.insert(output);
                ed.undo.saveStep();
                Lolzteam.EditorHelpers.normalizeAfterInsert(ed);
            },
            insertIntoTextBox: function insertIntoTextBox($textBox, insert) {
                var textBox = $textBox[0], scrollPos = textBox.scrollTop, startPos = textBox.selectionStart, endPos = textBox.selectionEnd, value = $textBox.val(), before = value.substring(0, startPos), after = value.substring(endPos, value.length);
                $textBox.val(before + insert + after).trigger("autosize");
                textBox.selectionStart = textBox.selectionEnd = startPos + insert.length;
                textBox.scrollTop = scrollPos;
                Lolzteam.FE.autofocus($textBox);
            },
            replaceIntoTextBox: function replaceIntoTextBox($textBox, insert) {
                $textBox.val(insert).trigger("autosize");
            },
            adjustHtmlForRte: function adjustHtmlForRte(content) {
                content = content.replace(/<img[^>]+>/ig, function(match) {
                    if (match.match(/class="([^"]* )?smilie( |")/)) {
                        var altMatch = match.match(/alt="([^"]+)"/);
                        if (altMatch) {
                            return altMatch[1];
                        }
                    }
                    return match;
                });
                content = content.replace(/([\w\W]|^)<a\s[^>]*data-user-id="\d+"\s+data-username="([^"]+)"[^>]*>([\w\W]+?)<\/a>/gi, function(match, prefix, user, username) {
                    return prefix + (prefix === "@" ? "" : "@") + username.replace(/^@/, "");
                });
                content = content.replace(/(<img\s[^>]*)src="[^"]*"(\s[^>]*)data-url="([^"]+)"/gi, function(match, prefix, suffix, source) {
                    return prefix + 'src="' + source + '"' + suffix;
                });
                var body = new DOMParser().parseFromString(content, "text/html").body;
                body.querySelectorAll("blockquote").forEach(function(quote) {
                    [
                        "attributes",
                        "quote",
                        "source"
                    ].forEach(function(attr) {
                        if (quote.getAttribute("data-".concat(attr))) {
                            quote.removeAttribute("data-".concat(attr));
                        }
                    });
                });
                return body.innerHTML;
            },
            buildCommandDropdownHtml: function buildCommandDropdownHtml(ed, commands) {
                var output = "";
                $.each(commands, function(k, command) {
                    var cmd = FroalaEditor.COMMANDS[command];
                    if (cmd) {
                        var icon = ed.icon.create(cmd.icon || command);
                        var faMatch = icon.match(/(class="fa[slrb] fa-[a-z-]+)/);
                        if (faMatch) {
                            icon = icon.replace(faMatch[1], faMatch[1] + " fa-fw");
                        }
                        output += '<li><a class="fr-command" data-cmd="' + command + '">' + icon + "&nbsp;&nbsp;" + ed.language.translate(cmd.title) + "</a></li>";
                    }
                });
                return '<ul class="fr-dropdown-list">' + output + "</ul>";
            },
            dialogs: {},
            loadDialog: function loadDialog(ed, dialog) {
                var dialogs = Lolzteam.EditorHelpers.dialogs;
                if (dialogs[dialog]) {
                    dialogs[dialog].show(ed);
                } else {
                    console.error("Unknown dialog '" + dialog + "'");
                }
            }
        };
        Lolzteam.EditorDialog = function(dialog) {
            this.__construct(dialog);
        };
        Lolzteam.EditorDialog.prototype = {
            ed: null,
            dialog: null,
            overlay: null,
            $fakeTrigger: null,
            __construct: function __construct(dialog) {
                this.dialog = dialog;
                this.$fakeTrigger = $("<div></div>");
            },
            show: function show(ed) {
                var dialog = this.dialog;
                this.ed = ed;
                ed.selection.save();
                var cache = Lolzteam.EditorDialog.cache;
                if (cache[dialog]) {
                    cache[dialog].load();
                    return;
                }
                var self = this, $fakeTrigger = this.$fakeTrigger;
                var overlayAjaxHandler = function overlayAjaxHandler1(data) {
                    if (data.redirect) {
                        XenForo.ajax(data.redirect, {}, overlayAjaxHandler, {
                            type: "GET"
                        });
                    }
                    if (!data.templateHtml) {
                        return;
                    }
                    new XenForo.ExtLoader(data, function() {
                        XenForo.createOverlay(null, $("<div></div>").html(data.templateHtml), {
                            title: data.title,
                            className: "lzt-fe-editorDialog",
                            trigger: $fakeTrigger,
                            severalModals: !!ed.$box.closest(".xenOverlay").length
                        });
                        var overlay = $fakeTrigger.data("overlay");
                        $fakeTrigger.on("onBeforeLoad", $.context(self, "onBeforeLoad"));
                        $fakeTrigger.on("onLoad", $.context(self, "onLoad"));
                        $fakeTrigger.on("onClose", function() {
                            return Lolzteam.EditorHelpers.focus(ed);
                        });
                        overlay.load();
                        Lolzteam.EditorDialog.cache[dialog] = overlay;
                        self.init(overlay);
                    });
                };
                XenForo.ajax(XenForo.canonicalizeUrl("index.php?editor/dialog"), {
                    dialog: dialog
                }, overlayAjaxHandler, {
                    type: "GET"
                });
            },
            init: function init(overlay) {
                var self = this;
                overlay.onClose = function() {
                    if (self.ed) {
                        self.ed.markers.remove();
                    }
                };
                this.overlay = overlay;
            },
            onBeforeLoad: function onBeforeLoad(e) {},
            onLoad: function onLoad(e) {
                this.overlay.getOverlay().find("textarea, input").first().focus();
            }
        };
        Lolzteam.EditorDialog.cache = {};
        Lolzteam.EditorDialogCode = Lolzteam.FE.extend(Lolzteam.EditorDialog, {
            __backup: {
                "init": "_init",
                "onBeforeLoad": "_onBeforeLoad"
            },
            cm: null,
            langOverrides: {
                c: "clike",
                js: "javascript",
                csharp: "clike",
                html: "htmlmixed"
            },
            init: function init(overlay) {
                this._init(overlay);
                var config = {
                    lineNumbers: true,
                    mode: $("#editor_code_type").val(),
                    theme: "lolzteam",
                    indentWithTabs: true,
                    indentUnit: 4,
                    fixedGutter: true
                };
                this.cm = CodeMirror.fromTextArea($("#editor_code_code")[0], config);
                var self = this;
                var gutters = this.cm.display.gutters;
                var textarea = this.cm.display.wrapper;
                var scroller = this.cm.display.scroller;
                var horiz = this.cm.display.scrollbars.horiz;
                var vert = this.cm.display.scrollbars.vert;
                var gutterNumberLeft = $(".CodeMirror-gutter-wrapper").css("left");
                textarea.addEventListener("keydown", function(e) {
                    var $gutterWrapper = $(".CodeMirror-gutter-wrapper");
                    $(gutters).css("left", 0);
                    $gutterWrapper.css("left", gutterNumberLeft);
                // if(e.which === 39 || e.keyCode === 39) {
                //     e.preventDefault()
                //     e.stopPropagation()
                //     e.stopImmediatePropagation()
                //     let cursorPosition = self.cm.getCursor()
                //     self.cm.setCursor({line: cursorPosition.line, ch: (cursorPosition.ch + 1)})
                //     $(gutters).css('left', 0)
                //     $gutterWrapper.css('left', gutterNumberLeft)
                // } else if (e.which === 37 || e.keyCode === 37) {
                //     e.preventDefault()
                //     e.stopPropagation()
                //     e.stopImmediatePropagation()
                //     let cursorPosition = self.cm.getCursor()
                //     self.cm.setCursor({line: cursorPosition.line, ch: (cursorPosition.ch - 1)})
                //     $(gutters).css('left', 0)
                //     $gutterWrapper.css('left', gutterNumberLeft)
                // }
                }, true);
                scroller.addEventListener("scroll", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    vert.scrollTop = scroller.scrollTop;
                    horiz.scrollLeft = scroller.scrollLeft;
                }, true);
                horiz.addEventListener("scroll", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    var $gutterWrapper = $(".CodeMirror-gutter-wrapper");
                    $(gutters).css("left", 0);
                    $gutterWrapper.css("left", gutterNumberLeft);
                    $(".CodeMirror-scroll").scrollLeft($(".CodeMirror-hscrollbar").scrollLeft());
                //$(scroller).css({left: $(scroller).scrollLeft() / $(scroller).outerHeight(true) * barHeight });
                }, true);
                $("#editor_code_type").on("change", function() {
                    var mode = $(this).val();
                    if (self.langOverrides[mode]) mode = self.langOverrides[mode];
                    self.cm.setOption("mode", mode);
                    $(".CodeMirror-gutter-wrapper").css("left", gutterNumberLeft);
                });
                $("#editor_code_form").submit($.context(this, "submit"));
            },
            onBeforeLoad: function onBeforeLoad(e) {
                this._onBeforeLoad(e);
                this.ed.$el.blur();
            },
            submit: function submit(e) {
                var _this_cm;
                e.preventDefault();
                var ed = this.ed, overlay = this.overlay;
                var $type = $("#editor_code_type"), $code = $("#editor_code_code");
                ed.selection.restore();
                Lolzteam.EditorHelpers.insertCode(ed, $type.val(), $code.val());
                overlay.close();
                $code.val("");
                (_this_cm = this.cm) === null || _this_cm === void 0 ? void 0 : _this_cm.setValue("");
            }
        });
        Lolzteam.EditorDialogImage = Lolzteam.FE.extend(Lolzteam.EditorDialog, {
            __backup: {
                "init": "_init",
                "onBeforeLoad": "_onBeforeLoad"
            },
            init: function init(overlay) {
                this._init(overlay);
                $("#editor_image_form").submit($.context(this, "submit"));
                $("#editor_image_upload").on("click", $.context(this, "click"));
            },
            onBeforeLoad: function onBeforeLoad(e) {
                this._onBeforeLoad(e);
                $("#editor_image_url").val(this.ed.image.get() ? this.ed.image.get().attr("src") : "");
            },
            submit: function submit(e) {
                e.preventDefault();
                var ed = this.ed, overlay = this.overlay;
                ed.image.insert($("#editor_image_url").val());
                overlay.close();
            },
            click: function click(e) {
                e.preventDefault();
                $("<input>", {
                    type: "file",
                    className: "input",
                    accept: "image/*",
                    multiple: "multipart"
                }).click().on("change", this.upload.bind(this));
            },
            upload: function upload(e) {
                e.preventDefault();
                var ed = this.ed, overlay = this.overlay;
                if (e.target.files) {
                    insertFix(ed, true);
                    ed.image.upload(e.target.files);
                    ed.selection.restore();
                }
                overlay.close();
            }
        });
        Lolzteam.EditorDialogMedia = Lolzteam.FE.extend(Lolzteam.EditorDialog, {
            __backup: {
                "init": "_init",
                "onBeforeLoad": "_onBeforeLoad"
            },
            init: function init(overlay) {
                this._init(overlay);
                $("#editor_media_form").submit($.context(this, "submit"));
                $("#editor_media_upload").click($.context(this, "openUploadDialog"));
            },
            onBeforeLoad: function onBeforeLoad(e) {
                this._onBeforeLoad(e);
                $("#editor_media_url").val("");
            },
            submit: function submit(e) {
                e.preventDefault();
                var ed = this.ed, overlay = this.overlay;
                XenForo.ajax(XenForo.canonicalizeUrl("index.php?editor/media"), {
                    url: $("#editor_media_url").val()
                }, function(data) {
                    if (data.matchBbCode) {
                        ed.selection.restore();
                        ed.undo.saveStep();
                        insertFix(ed);
                        ed.html.insert(XenForo.htmlspecialchars(data.matchBbCode));
                        ed.undo.saveStep();
                        Lolzteam.EditorHelpers.normalizeAfterInsert(ed);
                        overlay.close();
                    } else if (data.noMatch) {
                        XenForo.alert(data.noMatch);
                        overlay === null || overlay === void 0 ? void 0 : overlay.close();
                    } else {
                        ed.selection.restore();
                        overlay.close();
                    }
                }, {
                    type: "POST"
                });
            },
            openUploadDialog: function(e) {
                e.preventDefault();
                var input = $('<input type="file" accept="video/*"/>');
                input.click();
                input.on("change", $.context(this, "uploadVideoFile"));
            },
            uploadVideoFile: function(e) {
                return editor_async_to_generator(function() {
                    var _this, file;
                    return editor_ts_generator(this, function(_state) {
                        _this = this;
                        this.ed.lztVideoHack = true;
                        this.overlay.close();
                        file = e.target.files[0];
                        if (file) this.ed.video.upload(file, true).then(function() {
                            _this.ed.lztVideoHack = false;
                        }, function() {
                            _this.ed.lztVideoHack = false;
                        });
                        return [
                            2
                        ];
                    });
                }).apply(this);
            }
        });
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        // ***************************************************************************************************************************************************************************************************************
        Lolzteam.ACProvider = /*#__PURE__*/ function() {
            function _class(ed, name) {
                var _this = this;
                editor_class_call_check(this, _class);
                this.ed = ed;
                this.popupName = "autoComplete." + name;
                var self = this;
                FroalaEditor.POPUP_TEMPLATES[this.popupName] = "[_CONTENT_]";
                ed.popups.create(this.popupName, {
                    content: '<div class="fe-ac fe-ac-'.concat(name, '"></div>')
                });
                ed.popups.setContainer(this.popupName, ed.$oel.closest(".modal, body"));
                this.popup = $(ed.popups.get(this.popupName)[0]).addClass("fe-acPopup").find(".fe-ac-" + name).on("click", ".fe-ac-result", function() {
                    return _this.insertResult();
                }).on("mouseenter", ".fe-ac-result", function() {
                    self.setActiveResult($(this));
                });
                ed.popups.onHide(this.popupName, function() {
                    ed.selection.restore();
                });
                // resize https://zelenka.guru/threads/4775505/
                $(window1).on("scroll resize", function() {
                    return _this.updatePopup();
                });
            }
            editor_create_class(_class, [
                {
                    key: "getSelectedText",
                    value: function getSelectedText() {
                        var delimeters = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
                        var selection = this.ed.selection.get();
                        if (!selection.isCollapsed) return null;
                        if (!selection.anchorNode || selection.anchorNode.nodeType !== Node.TEXT_NODE) return null;
                        delimeters = delimeters.split("");
                        var shortestFragment = selection.anchorNode.textContent.slice(0, selection.anchorOffset);
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = delimeters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var del = _step.value;
                                var fragments = shortestFragment.split(del);
                                var lastFragment = fragments[fragments.length - 1];
                                if (lastFragment.length < shortestFragment.length) {
                                    shortestFragment = lastFragment;
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        this.popupState = {
                            selectedNode: selection.anchorNode
                        };
                        return shortestFragment;
                    }
                },
                {
                    key: "getPopupPos",
                    value: function getPopupPos() {
                        var _this_ed_selection_ranges_getClientRects = editor_sliced_to_array(this.ed.selection.ranges(0).getClientRects(), 1), textNodePos = _this_ed_selection_ranges_getClientRects[0];
                        if (!textNodePos) {
                            return null;
                        }
                        var left = textNodePos.left + document1.scrollingElement.scrollLeft;
                        var top = textNodePos.top + document1.scrollingElement.scrollTop + textNodePos.height;
                        return [
                            left + textNodePos.width,
                            top,
                            textNodePos.height
                        ];
                    }
                },
                {
                    key: "updatePopupZindex",
                    value: function updatePopupZindex() {
                        var _Math;
                        $(this.ed.popups.get(this.popupName)[0]).css("z-index", 3 + (_Math = Math).max.apply(_Math, [
                            this.ed.opts.zIndex
                        ].concat(_to_consumable_array(Array.from($(this.ed.$oel[0]).parents()).map(function(el) {
                            return isNaN($(el).css("z-index")) ? 0 : $(el).css("z-index");
                        })))));
                    }
                },
                {
                    key: "showPopup",
                    value: function showPopup() {
                        var _this_ed_popups;
                        if (!this.popupState) {
                            return;
                        }
                        var popupPos = this.getPopupPos();
                        if (!popupPos) {
                            return;
                        }
                        this.ed.selection.save();
                        (_this_ed_popups = this.ed.popups).show.apply(_this_ed_popups, [
                            this.popupName
                        ].concat(_to_consumable_array(popupPos)));
                        if (this.popup.data("scrollbar")) {
                            this.popup.scrollbar("init");
                        }
                        this.popupState.height = $(this.ed.popups.get(this.popupName)[0]).height();
                        this.popupState.overflowing = false;
                        this.updatePopupZindex();
                        this.updatePopup();
                    }
                },
                {
                    // если этого не хочет делать фроала, это сделаю я
                    key: "updatePopup",
                    value: function updatePopup() {
                        if (!this.shown() || !this.popupState || !("height" in this.popupState)) return;
                        var popupPos = this.getPopupPos();
                        if (!popupPos) {
                            return;
                        }
                        var _popupPos = editor_sliced_to_array(popupPos, 3), left = _popupPos[0], top = _popupPos[1], objHeight = _popupPos[2];
                        var overflowing = top + this.popupState.height > document1.scrollingElement.scrollTop + window1.visualViewport.height;
                        if (overflowing) {
                            this.ed.popups.show(this.popupName, left, top - objHeight - this.popupState.height, -this.popupState.height);
                        } else {
                            this.ed.popups.show(this.popupName, left, top, -this.popupState.height);
                        }
                        this.ed.popups.get(this.popupName).removeClass("fr-hidden");
                        this.updatePopupZindex();
                    }
                },
                {
                    key: "shown",
                    value: function shown() {
                        return this.ed.popups.isVisible(this.popupName);
                    }
                },
                {
                    key: "hide",
                    value: function hide() {
                        this.ed.popups.hide(this.popupName);
                    }
                },
                {
                    key: "setActiveResult",
                    value: function setActiveResult($el) {
                        if (!this.shown()) return;
                        if (!$el || !$el.length) return;
                        this.popup.find(".active").removeClass("active");
                        $el.addClass("active");
                    }
                },
                {
                    key: "moveActiveResult",
                    value: function moveActiveResult(to) {
                        if (!this.shown()) return;
                        var results = this.popup.find(".fe-ac-result");
                        var prevActive = this.popup.find(".active").index();
                        if (prevActive === -1 && to < 0) prevActive = 0;
                        this.setActiveResult(results.eq((prevActive + to) % results.length));
                    }
                }
            ]);
            return _class;
        }();
        Lolzteam.UserACProvider = /*#__PURE__*/ function(_Lolzteam_ACProvider) {
            editor_inherits(_class, _Lolzteam_ACProvider);
            var _super = editor_create_super(_class);
            function _class(ed) {
                editor_class_call_check(this, _class);
                var _this;
                _this = _super.call(this, ed, "user", '<div class="fe-ac-user"></div>');
                editor_define_property(editor_assert_this_initialized(_this), "debounceTime", 300);
                _this.popup.scrollbar();
                return _this;
            }
            editor_create_class(_class, [
                {
                    key: "getprioritizedACUsers",
                    value: function getprioritizedACUsers() {
                        var _XenForo_getEditorInForm, _XenForo_getEditorInForm_$oel;
                        var form = $(this.ed.$oel[0]).closest("form");
                        var prioritizedACUsers = JSON.parse((_XenForo_getEditorInForm = XenForo.getEditorInForm(form)) === null || _XenForo_getEditorInForm === void 0 ? void 0 : (_XenForo_getEditorInForm_$oel = _XenForo_getEditorInForm.$oel) === null || _XenForo_getEditorInForm_$oel === void 0 ? void 0 : _XenForo_getEditorInForm_$oel.data("options")).prioritizedACUsers;
                        if (!(prioritizedACUsers === null || prioritizedACUsers === void 0 ? void 0 : prioritizedACUsers.length)) return {};
                        return prioritizedACUsers.reduce(function(acc, cur) {
                            acc[cur.username] = {
                                avatar: cur.avatar,
                                username: cur.usernameHtml,
                                user: cur.username,
                                isTC: cur.isThreadCreator
                            };
                            return acc;
                        }, {});
                    }
                },
                {
                    key: "show",
                    value: function show(results) {
                        this.popup.html("");
                        var query = this.state.username;
                        var first = true;
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = Object.entries(results)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var _step_value = editor_sliced_to_array(_step.value, 2), usernameText = _step_value[0], _step_value_ = _step_value[1], avatar = _step_value_.avatar, username = _step_value_.username, isTC = _step_value_.isTC;
                                var $username = $(username);
                                var $span = $username.find("span:first");
                                var name = $span.text();
                                $span.text(name.slice(query.length));
                                var $highlight = $('<span style="text-decoration:underline"></span>');
                                $highlight.text(name.slice(0, query.length)).prependTo($span);
                                var $el = $('<div class="fe-ac-user-result fe-ac-result" data-username="'.concat(XenForo.htmlspecialchars(usernameText), '" data-html="').concat(XenForo.htmlspecialchars(username), '"><img class="avatar fe-ac-user-userAvatar" src="').concat(XenForo.htmlspecialchars(avatar), '"/></div>')).append($username).appendTo(this.popup);
                                if (first) $el.addClass("active");
                                if (isTC) $el.append('<span class="item as--class author">'.concat(phrase("thread_starter"), "</span>"));
                                first = false;
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        if (this.popup.children().length) this.showPopup();
                    }
                },
                {
                    key: "debounceShow",
                    value: function debounceShow(username) {
                        var _this = this;
                        if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
                        if (this.xhr) this.xhr.abort();
                        this.debounceTimeout = setTimeout(function() {
                            var res = {};
                            var users = _this.getprioritizedACUsers();
                            if (users) {
                                Object.assign(res, Object.values(users).filter(function(x) {
                                    return x.user.toLowerCase().startsWith(username.toLowerCase());
                                }).reduce(function(acc, cur) {
                                    return _object_spread_props(editor_object_spread({}, acc), editor_define_property({}, cur.user, cur));
                                }, {}));
                            }
                            var text = _this.getSelectedText(" ");
                            if (text === null) return false;
                            text = text === null || text === void 0 ? void 0 : text.replaceAll("​", "");
                            var fragments = text.split(/@/);
                            var usernameinput = fragments[fragments.length - 1];
                            if (usernameinput !== username) return _this.hide();
                            if (username.length < 2) return _this.show(res);
                            var url = $(_this.ed.$oel[0]).data("ac-url") || XenForo.AutoComplete.getDefaultUrl();
                            _this.debounceTimeout = null;
                            _this.xhr = XenForo.ajax(url, {
                                q: username
                            }, function(resp) {
                                _this.xhr = null;
                                if (!XenForo.hasResponseError(resp)) {
                                    Object.assign(res, resp.results);
                                    _this.show(res);
                                }
                            });
                        }, this.debounceTime);
                    }
                },
                {
                    key: "trigger",
                    value: function trigger() {
                        var text = this.getSelectedText(" ​\xa0");
                        if (text === null) return false;
                        var fragments = text.split(/@/);
                        if (fragments.length <= 1 || fragments[0] !== "") return false;
                        var textNode = this.ed.selection.get().anchorNode;
                        if ($(textNode).closest('span.username[spellcheck="false"]').length) return false;
                        var username = fragments[fragments.length - 1];
                        this.state = {
                            username: username,
                            textNode: textNode
                        };
                        this.debounceShow(username);
                        return true;
                    }
                },
                {
                    key: "insertResult",
                    value: function insertResult() {
                        var $username = $(this.popup.find(".active .username").parent().data("html"));
                        if (!$username.length) return;
                        if (this.ed.helpers.isMac() || this.ed.helpers.isIOS()) {
                            this.ed.markers.insert();
                            var mentionLength = this.state.username.length + 1 // + @
                            ;
                            this.state.textNode.textContent = this.state.textNode.textContent.slice(0, -mentionLength);
                            // https://zelenka.guru/threads/4739003/
                            $username.find(".scamNotice, .scamNoticeUsername").remove();
                            $username.attr("spellcheck", "false");
                            $username.children("span").text("@" + $username.children("span").text());
                            $username.children("span").attr("data-skip-color", true);
                            var markerHTML = $(".fr-marker")[0].outerHTML;
                            var $parent = $($(".fr-marker").closest("p")[0]);
                            var parentHTML = $parent[0].innerHTML;
                            var splitedParentHTML = parentHTML.split(markerHTML);
                            $parent[0].innerHTML = splitedParentHTML[0] + $username[0].outerHTML + "&ZeroWidthSpace;&nbsp;" + markerHTML;
                            if (splitedParentHTML.length > 1) {
                                $parent[0].innerHTML += splitedParentHTML[1];
                            }
                            this.ed.selection.restore();
                        } else {
                            this.ed.selection.save();
                            var mentionLength1 = this.state.username.length + 1 // + @
                            ;
                            this.state.textNode.textContent = this.state.textNode.textContent.slice(0, -mentionLength1);
                            this.ed.events.focus();
                            this.ed.selection.restore();
                            // https://zelenka.guru/threads/4739003/
                            $username.find(".scamNotice, .scamNoticeUsername").remove();
                            $username.attr("spellcheck", "false");
                            $username.children("span").text("@" + $username.children("span").text());
                            $username.children("span").attr("data-skip-color", true);
                            this.ed.html.insert($username[0].outerHTML + "&ZeroWidthSpace;&nbsp;");
                        }
                        this.hide();
                        return true;
                    }
                }
            ]);
            return _class;
        }(Lolzteam.ACProvider);
        Lolzteam.SmilieLoader = SmilieLoader;
        Lolzteam.SmilieACProvider = /*#__PURE__*/ function(_Lolzteam_ACProvider) {
            editor_inherits(_class, _Lolzteam_ACProvider);
            var _super = editor_create_super(_class);
            function _class(ed) {
                editor_class_call_check(this, _class);
                var _this;
                _this = _super.call(this, ed, "smilie");
                editor_define_property(editor_assert_this_initialized(_this), "resultsCount", 5);
                Lolzteam.SmilieLoader.load().then(function(s) {
                    return _this.smilies = s;
                });
                _this.recentKey = "xf_lzt_fe_recent_smilies";
                _this.recentSmiliesLimit = 14;
                return _this;
            }
            editor_create_class(_class, [
                {
                    // ищет смайлы у которых название/алиас начинается с text
                    key: "searchSmilies",
                    value: function searchSmilies(text) {
                        text = text.toLowerCase();
                        var results = [];
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = this.smilies.ac[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var smilie = _step.value;
                                if (smilie.name.toLowerCase().startsWith(text) || smilie.value.replace(/:/g, "").toLowerCase().startsWith(text) || smilie.aliases.find(function(a) {
                                    return a.toLowerCase().startsWith(text);
                                })) {
                                    results.push(smilie);
                                    if (results.length === this.resultsCount) break;
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        return results;
                    }
                },
                {
                    // ищет смайлы у которых название/алиас равно text
                    key: "searchSmiliesFull",
                    value: function searchSmiliesFull(text) {
                        text = text.toLowerCase();
                        var results = [];
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = this.smilies.ac[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var smilie = _step.value;
                                if (smilie.name.toLowerCase() === text || smilie.value.replace(/:/g, "").toLowerCase() === text || smilie.aliases.find(function(a) {
                                    return a.toLowerCase() === text;
                                })) {
                                    results.push(smilie);
                                    if (results.length === this.resultsCount) break;
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        return results;
                    }
                },
                {
                    key: "trigger",
                    value: function trigger() {
                        if (!this.smilies) return false;
                        var text = this.getSelectedText(", ");
                        var selectedNode = this.ed.selection.get().anchorNode;
                        var prevSibling = selectedNode.previousSibling || selectedNode.parentNode.previousSibling;
                        selectedNode = selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.cloneNode(true);
                        prevSibling = prevSibling === null || prevSibling === void 0 ? void 0 : prevSibling.cloneNode(true);
                        if (!text || text.indexOf("@") !== -1) return false;
                        // проверяем шо в предыдущей ноде нет пробема на конце и первый символ текущей ноды это :
                        if (selectedNode.textContent.startsWith(text) && prevSibling && (prevSibling === null || prevSibling === void 0 ? void 0 : prevSibling.textContent.length) !== 0 && !(prevSibling === null || prevSibling === void 0 ? void 0 : prevSibling.textContent.endsWith(" "))) {
                            return false;
                        }
                        text = text === null || text === void 0 ? void 0 : text.replaceAll("​", "").trim();
                        var results = text[0] === ":" ? this.searchSmilies(text.slice(1)) : this.searchSmiliesFull(text);
                        if (!results.length) return false;
                        this.state = {
                            text: text,
                            textNode: this.ed.selection.get().anchorNode
                        };
                        this.popup.html("");
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var result = _step.value;
                                $('<div class="fe-ac-smilie-result fe-ac-result"/>').append($("<img/>", {
                                    class: "fe-ac-smilie-image mceSmilie",
                                    alt: result.value,
                                    title: result.name,
                                    src: result.image,
                                    style: "user-select: auto !important;"
                                })).appendTo(this.popup);
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        this.showPopup();
                        return true;
                    }
                },
                {
                    key: "insertResult",
                    value: function insertResult() {
                        if (!this.popup.find(".active").length) {
                            this.hide();
                            return false;
                        }
                        this.ed.selection.save();
                        this.state.textNode.textContent = this.state.textNode.textContent.trimEnd();
                        this.state.textNode.textContent = this.state.textNode.textContent.slice(0, -this.state.text.length);
                        this.ed.selection.restore();
                        this.ed.html.insert('&nbsp;<smilie class="fr-deletable">'.concat(this.popup.find(".active").html(), "</smilie> "));
                        $("smilie").attr("contenteditable", "false");
                        if (!supports_html5_storage()) return;
                        var recentSmilies = localStorage.getItem(this.recentKey);
                        if (!recentSmilies || !recentSmilies.length) recentSmilies = "";
                        var recent = recentSmilies.split(",");
                        var smilie = this.popup.find(".active").find(".mceSmilie");
                        var box = $(this.smilies.box);
                        var smilieId = box.find('img[src="'.concat(smilie.attr("src"), '"][data-smilie="yes"]')).parent("a").data("smilieId");
                        recent = recent.slice(0, this.recentSmiliesLimit - 2).filter(function(id) {
                            return id != smilieId;
                        });
                        recent.unshift(smilieId);
                        localStorage.setItem(this.recentKey, recent.join(","));
                        $("#lzt-fe-eb-smilie").trigger("ac-picked-smilie");
                        this.hide();
                        return true;
                    }
                }
            ]);
            return _class;
        }(Lolzteam.ACProvider);
        Lolzteam.TemplateACProvider = /*#__PURE__*/ function(_Lolzteam_ACProvider) {
            editor_inherits(_class, _Lolzteam_ACProvider);
            var _super = editor_create_super(_class);
            function _class(ed) {
                editor_class_call_check(this, _class);
                return _super.call(this, ed, "template");
            }
            editor_create_class(_class, [
                {
                    // из ghbdtn делает привет
                    key: "switchLayout",
                    value: function switchLayout(str, reverse) {
                        var replacer = {
                            "q": "й",
                            "w": "ц",
                            "e": "у",
                            "r": "к",
                            "t": "е",
                            "y": "н",
                            "u": "г",
                            "i": "ш",
                            "o": "щ",
                            "p": "з",
                            "[": "х",
                            "]": "ъ",
                            "a": "ф",
                            "s": "ы",
                            "d": "в",
                            "f": "а",
                            "g": "п",
                            "h": "р",
                            "j": "о",
                            "k": "л",
                            "l": "д",
                            ";": "ж",
                            "'": "э",
                            "z": "я",
                            "x": "ч",
                            "c": "с",
                            "v": "м",
                            "b": "и",
                            "n": "т",
                            "m": "ь",
                            ",": "б",
                            ".": "ю",
                            "/": "."
                        };
                        reverse && Object.keys(replacer).forEach(function(key) {
                            var v = replacer[key];
                            delete replacer[key];
                            replacer[v] = key;
                        });
                        var replace;
                        for(var i = 0; i < str.length; i++){
                            if (replacer[str[i].toLowerCase()] != undefined) {
                                if (str[i] == str[i].toLowerCase()) {
                                    replace = replacer[str[i].toLowerCase()];
                                } else if (str[i] == str[i].toUpperCase()) {
                                    replace = replacer[str[i].toLowerCase()].toUpperCase();
                                }
                                str = str.replace(str[i], replace);
                            }
                        }
                        return str;
                    }
                },
                {
                    // ищет шаблоны у которых название/содержание начинается с text
                    key: "searchTemplates",
                    value: function searchTemplates(searchText) {
                        var _this = this;
                        var _searchText_toLowerCase;
                        searchText = (_searchText_toLowerCase = searchText.toLowerCase()) === null || _searchText_toLowerCase === void 0 ? void 0 : _searchText_toLowerCase.replaceAll("​", "");
                        var getResult = function(text) {
                            var results = [];
                            var $templates = $(_this.ed.$box[0]).closest(".defEditor").find(".ConversationTemplates .InsertTemplate");
                            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            try {
                                for(var _iterator = Array.from($templates)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                    var template = _step.value;
                                    var title = $(template).find(".title").text().trim().toLowerCase();
                                    var content = $(template).find(".content").text().trim().toLowerCase();
                                    var match = null;
                                    var words = text.split(" ");
                                    var candidates = [];
                                    for(var i = 0; i < words.length; i++){
                                        candidates.push(words.slice(i).join(" "));
                                    }
                                    search: for(var _i = 0, _iter = [
                                        title,
                                        content
                                    ]; _i < _iter.length; _i++){
                                        var _$searchText = _iter[_i];
                                        var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                        try {
                                            for(var _iterator1 = candidates[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                                var candidate = _step1.value;
                                                if (candidate.length > 3 && _$searchText.startsWith(candidate)) {
                                                    match = candidate;
                                                    break search;
                                                }
                                            }
                                        } catch (err) {
                                            _didIteratorError1 = true;
                                            _iteratorError1 = err;
                                        } finally{
                                            try {
                                                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                                    _iterator1.return();
                                                }
                                            } finally{
                                                if (_didIteratorError1) {
                                                    throw _iteratorError1;
                                                }
                                            }
                                        }
                                    }
                                    if (match && text !== "" && content !== text) results.push({
                                        html: template.innerHTML,
                                        match: match
                                    });
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                            return results;
                        };
                        if (!getResult(searchText).length) return getResult(this.switchLayout(searchText));
                        else return getResult(searchText);
                    }
                },
                {
                    key: "trigger",
                    value: function trigger() {
                        var text = this.getSelectedText("");
                        if (!text || text.indexOf("@") !== -1 || text.length < 3) return false;
                        var selection = this.ed.selection.get();
                        var $rowNode;
                        if (this.ed.$el.find("p").length < 1) {
                            $rowNode = this.ed.$el;
                        } else {
                            $rowNode = $(selection.anchorNode).is("p") ? $(selection.anchorNode) : $($(selection.anchorNode).closest("p")[0]);
                        }
                        var results = [];
                        results = this.searchTemplates(text);
                        if (!results.length) {
                            return false;
                        }
                        if (!selection.anchorNode) return false;
                        this.state = {
                            text: text,
                            offset: selection.anchorOffset,
                            textNode: $rowNode[0]
                        };
                        this.popup.html("");
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var result = _step.value;
                                $('<div class="fe-ac-template-result fe-ac-result"/>').html(result.html).data("match", result.match).appendTo(this.popup);
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        this.showPopup();
                        return true;
                    }
                },
                {
                    key: "insertResult",
                    value: function insertResult() {
                        if (!this.popup.find(".active").length) {
                            this.hide();
                            return false;
                        }
                        var self = this;
                        var match = this.popup.find(".active").data("match");
                        var insideContent;
                        var marker = $(this.state.textNode).find(".fr-marker:first")[0];
                        while(marker.previousSibling){
                            var _prev_cloneNode_nodeValue, _prev_cloneNode_nodeValue1;
                            var prev = marker.previousSibling;
                            if (((_prev_cloneNode_nodeValue = prev.cloneNode(true).nodeValue) === null || _prev_cloneNode_nodeValue === void 0 ? void 0 : _prev_cloneNode_nodeValue.toLowerCase().lastIndexOf(match)) !== -1 || ((_prev_cloneNode_nodeValue1 = prev.cloneNode(true).nodeValue) === null || _prev_cloneNode_nodeValue1 === void 0 ? void 0 : _prev_cloneNode_nodeValue1.toLowerCase().lastIndexOf(self.switchLayout(match, true))) !== -1) {
                                insideContent = prev;
                                break;
                            }
                        }
                        var outerText = insideContent === null || insideContent === void 0 ? void 0 : insideContent.textContent;
                        if (outerText === undefined) {
                            $($(this.state.textNode).find("span:not(.fr-marker)")[0]).contents().unwrap();
                            var marker1 = $(this.state.textNode).find(".fr-marker:first")[0];
                            while(marker1.previousSibling){
                                var _prev_cloneNode_nodeValue2, _prev_cloneNode_nodeValue3;
                                var prev1 = marker1.previousSibling;
                                if (((_prev_cloneNode_nodeValue2 = prev1.cloneNode(true).nodeValue) === null || _prev_cloneNode_nodeValue2 === void 0 ? void 0 : _prev_cloneNode_nodeValue2.toLowerCase().lastIndexOf(match)) !== -1 || ((_prev_cloneNode_nodeValue3 = prev1.cloneNode(true).nodeValue) === null || _prev_cloneNode_nodeValue3 === void 0 ? void 0 : _prev_cloneNode_nodeValue3.toLowerCase().lastIndexOf(self.switchLayout(match, true))) !== -1) {
                                    insideContent = prev1;
                                    break;
                                }
                            }
                            outerText = insideContent === null || insideContent === void 0 ? void 0 : insideContent.textContent;
                        }
                        outerText = outerText.trimEnd();
                        outerText = outerText.slice(0, outerText.length - match.length);
                        $(insideContent).replaceWith(outerText);
                        this.ed.selection.restore();
                        var result = this.popup.find(".active .ContentHtml").html().trim().split("\n");
                        var dom = result.length > 1 ? result.map(function(x) {
                            return "<p>".concat(x, "</p>");
                        }).join("") : result[0] + "&nbsp;";
                        this.ed.undo.saveStep();
                        this.ed.html.insert(dom);
                        this.ed.undo.saveStep();
                        this.hide();
                        return true;
                    }
                }
            ]);
            return _class;
        }(Lolzteam.ACProvider);
        Lolzteam.EditorAutoCompleter = /*#__PURE__*/ function() {
            function _class(textarea, options, ed) {
                editor_class_call_check(this, _class);
                if (!ed) return;
                this.ed = ed;
                this.providers = [
                    new Lolzteam.UserACProvider(ed),
                    new Lolzteam.SmilieACProvider(ed),
                    new Lolzteam.TemplateACProvider(ed)
                ];
                ed.events.on("keydown", this.onKeydown.bind(this), true);
                ed.events.on("keyup", this.onKeyup.bind(this), true);
                ed.events.on("focus", this.onFocus.bind(this), true);
            }
            editor_create_class(_class, [
                {
                    key: "shownProvider",
                    value: function shownProvider() {
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = this.providers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var provider = _step.value;
                                if (provider.shown()) return provider;
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        return null;
                    }
                },
                {
                    key: "onKeydown",
                    value: function onKeydown(e) {
                        var provider = this.shownProvider();
                        if (!provider) return;
                        var editorSimpleSubmitOnEnter = $(this.ed.$oel[0]).data("Lolzteam.EditorSimpleSubmitOnEnter");
                        if (editorSimpleSubmitOnEnter && editorSimpleSubmitOnEnter.isProcessing()) {
                            provider.hide();
                            return;
                        }
                        switch(e.keyCode){
                            case 27:
                                provider.hide();
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                            case 38:
                            case 37:
                                if (provider.popup.find(".active").length > 0) {
                                    var _provider_popup_find_;
                                    provider.moveActiveResult(-1);
                                    e.preventDefault();
                                    (_provider_popup_find_ = provider.popup.find(".active")[0]) === null || _provider_popup_find_ === void 0 ? void 0 : _provider_popup_find_.scrollIntoView({
                                        behavior: "smooth",
                                        block: "nearest"
                                    });
                                    return false;
                                }
                            case 40:
                            case 39:
                                if (provider.popup.find(".active").length > 0) {
                                    var _provider_popup_find_1;
                                    provider.moveActiveResult(1);
                                    e.preventDefault();
                                    (_provider_popup_find_1 = provider.popup.find(".active")[0]) === null || _provider_popup_find_1 === void 0 ? void 0 : _provider_popup_find_1.scrollIntoView({
                                        behavior: "smooth",
                                        block: "nearest"
                                    });
                                    return false;
                                }
                            case 13:
                                if (!provider.insertResult()) {
                                    provider.hide();
                                    return;
                                }
                                e.preventDefault();
                                return false;
                            case 9:
                                if (!provider.popup.find(".active").length) provider.popup.find(".fe-ac-result:first").addClass("active");
                                provider.insertResult();
                                e.preventDefault();
                                return false;
                        }
                        return false;
                    }
                },
                {
                    key: "onKeyup",
                    value: function onKeyup(e) {
                        var shown = this.shownProvider();
                        var select = this.ed.selection.get();
                        if (!select.anchorNode || !select.anchorNode.textContent) return;
                        if (select.anchorOffset !== select.anchorNode.textContent.length) {
                            if (shown) {
                                this.ed.selection.save();
                                shown.hide();
                                return false;
                            }
                        }
                        // enter, esc
                        if (e.keyCode === 13 || e.keyCode === 27) {
                            if (shown) shown.hide();
                            return;
                        }
                        // arrows
                        if (shown && [
                            37,
                            38,
                            39,
                            40
                        ].includes(e.keyCode)) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            return false;
                        }
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = this.providers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var provider = _step.value;
                                if (provider.trigger()) break;
                                else provider.hide();
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }
                },
                {
                    key: "onFocus",
                    value: function onFocus() {
                        var _this = this;
                        // timeout for wait load text in safari
                        setTimeout(function() {
                            var provider = _this.providers[0];
                            if (!provider.trigger()) provider.hide();
                        }, 50);
                    }
                }
            ]);
            return _class;
        }();
        Lolzteam.editorStart = {
            started: false,
            startAll: function startAll(e, editor) {
                if (!Lolzteam.editorStart.started) {
                    Lolzteam.editorStart.setupLanguage(editor);
                    Lolzteam.editorStart.defineIcons(editor);
                    Lolzteam.editorStart.registerCommands(editor);
                    Lolzteam.editorStart.registerCustomCommands(editor);
                    Lolzteam.editorStart.registerCustomPlugins(editor);
                    Lolzteam.editorStart.registerDialogs(editor);
                    $(document1).trigger("lzt-editor:first-start");
                    Lolzteam.editorStart.started = true;
                }
            },
            setupLanguage: function setupLanguage(editor) {
                var dir = $("html").attr("dir");
                var lang = {};
                try {
                    lang = $.parseJSON($(".js-editorLanguage").first().html()) || {};
                } catch (e) {
                    console.error(e);
                }
                FroalaEditor.LANGUAGE["xf"] = {
                    translation: lang,
                    direction: dir ? dir.toLowerCase() : "ltr"
                };
            },
            defineIcons: function defineIcons(editor) {
                FroalaEditor.DefineIconTemplate("xf_image_sprite", "<span title=[ALT] style=\"background-image: url('[SRC]'); background-repeat: no-repeat; background-position: [XPOS]px [YPOS]px;\"></span>");
                $.each(Lolzteam.editorStart.icons, function(icon) {
                    FroalaEditor.DefineIcon(icon, Lolzteam.editorStart.icons[icon]);
                });
            },
            registerCommands: function registerCommands(editor) {
                $.each(Lolzteam.editorStart.commands, function(command) {
                    FroalaEditor.RegisterCommand(command, Lolzteam.editorStart.commands[command]);
                });
            },
            registerCustomCommands: function registerCustomCommands(editor) {
                var bbCodes = editor.options.bbCodes;
                $.each(bbCodes, function(tag) {
                    var name = "xfCustom_" + tag, tagUpper = tag.toUpperCase(), bbCode = bbCodes[tag];
                    var template, faMatch;
                    faMatch = bbCode.icon.match(/^fa([slrb]) fa-(.+)$/);
                    if (faMatch) {
                        template = {
                            template: "font_awesome_5" + (faMatch[1] === "s" ? "" : faMatch[1]),
                            FA5NAME: faMatch[2]
                        };
                    } else {
                        template = {
                            template: bbCode.spriteMode ? "xf_image_sprite" : "image",
                            SRC: XenForo.canonicalizeUrl(bbCode.icon),
                            ALT: '"' + bbCode.title + '"',
                            XPOS: bbCode.spriteParams.x,
                            YPOS: bbCode.spriteParams.y
                        };
                    }
                    FroalaEditor.DefineIcon(name, template);
                    FroalaEditor.RegisterCommand(name, {
                        title: bbCode.title,
                        icon: name,
                        undo: true,
                        focus: true,
                        callback: function callback() {
                            if (tag in wysiwygHideTags) {
                                this.xfHide.insert({
                                    tag: tag
                                });
                            } else {
                                Lolzteam.EditorHelpers.wrapSelectionText(this, "[" + tagUpper + (bbCode.hasOption === "yes" ? "=" : "") + "]", "[/" + tagUpper + "]", true);
                            }
                        }
                    });
                });
            },
            registerCustomPlugins: function registerCustomPlugins(editor) {
                FroalaEditor.PLUGINS.xfDraft = function(ed) {
                    var saveDraft = function saveDraft() {
                        var content = ed.html.get();
                        if (content === lastActionContent) {
                            return;
                        }
                        processDraft(content, false);
                    };
                    var deleteDraft = function deleteDraft() {
                        processDraft(ed.html.get(), true);
                    };
                    var initAutoSave = function initAutoSave() {
                        $form = $(ed.$box[0]).closest("form");
                        autoSaveUrl = $(ed.$oel).data("auto-save-url");
                        if (!$form.length || !autoSaveUrl) {
                            return;
                        }
                        var afterInput = function() {
                            var timer = 0;
                            return function(callback, ms) {
                                clearTimeout(timer);
                                timer = setTimeout(callback, ms);
                            };
                        }();
                        ed.events.on("input", function() {
                            var options = ($(ed.$oel[0]).data("Lolzteam.EditorSimple") || $(ed.$oel[0]).data("Lolzteam.Editor")).options;
                            afterInput(function() {
                                saveDraft();
                            }, (options.autoSaveFrequency || 60) * 1000);
                        });
                        ed.events.on("commands.after", function() {
                            afterInput(function() {
                                saveDraft();
                            }, 250);
                        });
                        $(window1).on("beforeunload", saveDraft);
                    };
                    var processDraft = function processDraft(content, deleteDraft) {
                        if (!$form || !autoSaveUrl) {
                            return;
                        }
                        lastActionContent = content;
                        var e = $.Event("BbCodeWysiwygEditorAutoSave");
                        e.editor = ed;
                        e.content = content;
                        e.deleteDraft = deleteDraft;
                        $form.trigger(e);
                        if (e.isDefaultPrevented()) {
                            return false;
                        }
                        if (saveRunning) {
                            return false;
                        }
                        saveRunning = true;
                        var formData = $form.serializeArray();
                        if (deleteDraft) {
                            formData = XenForo.ajaxDataPush(formData, "delete_draft", 1);
                        }
                        XenForo.ajax(autoSaveUrl, formData, function(data) {
                            var e = $.Event("BbCodeWysiwygEditorAutoSaveComplete");
                            e.ajaxData = data;
                            $form.trigger(e);
                            if (e.isDefaultPrevented()) {
                                return;
                            }
                            if (ed.$tb.length) {
                                var $draftButton = ed.$tb.find(".fr-command.fr-btn[data-cmd=xfDraft]");
                                var $indicator;
                                if ($draftButton.length) {
                                    $indicator = $draftButton.find(".editorDraftIndicator");
                                    if (!$indicator.length) {
                                        $indicator = $('<b class="editorDraftIndicator" />').appendTo($draftButton);
                                    }
                                    setTimeout(function() {
                                        $indicator.addClass("is-active");
                                    }, 50);
                                    setTimeout(function() {
                                        $indicator.removeClass("is-active");
                                    }, 2500);
                                }
                            }
                        }, {
                            global: false
                        }).complete(function() {
                            saveRunning = false;
                        });
                    };
                    var saveRunning = false, lastActionContent = null, $form = $(ed.$box[0]).closest("form"), autoSaveUrl = $(ed.$oel).data("auto-save-url");
                    return {
                        save: saveDraft,
                        delete: deleteDraft,
                        initAutoSave: initAutoSave
                    };
                };
                FroalaEditor.PLUGINS.xfBbCode = function(ed) {
                    var getButton = function getButton() {
                        return ed.$tb.find(".fr-command[data-cmd=xfBbCode]");
                    };
                    var getBbCodeBox = function getBbCodeBox() {
                        var $oel = ed.$oel;
                        var $bbCodeBox = $oel.data("xfBbCodeBox");
                        if (!$bbCodeBox) {
                            var borderAdjust = parseInt(ed.$wp.css("border-bottom-width"), 10) + parseInt(ed.$wp.css("border-top-width"), 10);
                            $bbCodeBox = $('<textarea class="xfBbCode" style="display: none" />');
                            $bbCodeBox.css({
                                minHeight: ed.opts.heightMin ? ed.opts.heightMin + borderAdjust + "px" : null,
                                maxHeight: ed.opts.heightMax ? ed.opts.heightMax + "px" : null,
                                height: ed.opts.height ? ed.opts.height + borderAdjust + "px" : null,
                                padding: ed.$el.css("padding")
                            });
                            $bbCodeBox.attr("name", $oel.data("original-name"));
                            $oel.data("xfBbCodeBox", $bbCodeBox);
                            ed.$wp.after($bbCodeBox[0]);
                            $bbCodeBox.on("focus blur", function(e) {
                                switch(e.type){
                                    case "focus":
                                        ed.$box.addClass("is-focused");
                                        break;
                                    case "blur":
                                        ed.$box.removeClass("is-focused");
                                        break;
                                }
                            });
                        }
                        new Lolzteam.EditorAutoCompleter($bbCodeBox);
                        return $bbCodeBox;
                    };
                    var btnsToDisable = function btnsToDisable($button) {
                        return ed.$tb.find("> .fr-btn-grp .fr-command, > .fr-more-toolbar .fr-command").not($button).not('[data-cmd^="more"]');
                    };
                    var toBbCode = function toBbCode(bbCode, skipFocus) {
                        var $bbCodeBox = getBbCodeBox();
                        var apply = function apply(bbCode) {
                            _isBbCodeView = true;
                            ed.undo.saveStep();
                            ed.$el.blur();
                            var $button = getButton();
                            btnsToDisable($button).addClass("fr-disabled");
                            $button.addClass("fr-active");
                            ed.$wp.css("display", "none");
                            ed.$oel.attr("disabled", "disabled");
                            $bbCodeBox.val(bbCode).css("display", "").prop("disabled", false).trigger("autosize");
                        };
                        if (ed.fullscreen.isActive()) {
                            ed.fullscreen.toggle();
                        }
                        if (typeof bbCode == "string") {
                            apply(bbCode, skipFocus);
                        } else {
                            XenForo.ajax(XenForo.canonicalizeUrl("index.php?editor/to-bb-code"), {
                                html: ed.html.get()
                            }, function(data) {
                                apply(data.bbCode, skipFocus);
                            });
                        }
                    };
                    var toHtml = function toHtml(html) {
                        var $bbCodeBox = getBbCodeBox();
                        var apply = function apply(html) {
                            _isBbCodeView = false;
                            var $button = getButton();
                            btnsToDisable($button).removeClass("fr-disabled");
                            $button.removeClass("fr-active");
                            ed.$oel.removeAttr("disabled");
                            $bbCodeBox.css("display", "none").prop("disabled", true);
                            ed.$wp.css("display", "");
                            ed.html.set(html);
                            ed.undo.saveStep();
                            ed.size.refresh();
                        };
                        if (typeof html == "string") {
                            apply(html);
                        } else {
                            XenForo.ajax(XenForo.canonicalizeUrl("index.php?editor/to-html"), {
                                bbCode: $bbCodeBox.val()
                            }, function(data) {
                                apply(data.html);
                                FroalaEditor.PLUGINS.xfSpoiler(ed)._init() // reinit spoilers
                                ;
                            });
                        }
                    };
                    var toggle = function toggle() {
                        if (_isBbCodeView) {
                            toHtml();
                        } else {
                            toBbCode();
                        }
                    };
                    var isBbCodeView = function isBbCodeView() {
                        return _isBbCodeView;
                    };
                    var getToggleableButtons = function getToggleableButtons() {
                        return btnsToDisable(getButton());
                    };
                    var insertBbCode = function insertBbCode(bbCode) {
                        if (!_isBbCodeView) {
                            return;
                        }
                        Lolzteam.EditorHelpers.insertIntoTextBox(getBbCodeBox(), bbCode);
                    };
                    var replaceBbCode = function replaceBbCode(bbCode) {
                        if (!_isBbCodeView) {
                            return;
                        }
                        Lolzteam.EditorHelpers.replaceIntoTextBox(getBbCodeBox(), bbCode);
                    };
                    var getTextArea = function getTextArea() {
                        return _isBbCodeView ? getBbCodeBox() : null;
                    };
                    var _init = function _init() {
                        ed.events.on("buttons.refresh", function() {
                            return !_isBbCodeView;
                        });
                    };
                    var _isBbCodeView = false;
                    return {
                        _init: _init,
                        getBbCodeBox: getBbCodeBox,
                        toBbCode: toBbCode,
                        isBbCodeView: isBbCodeView,
                        getTextArea: getTextArea,
                        insertBbCode: insertBbCode,
                        replaceBbCode: replaceBbCode,
                        toHtml: toHtml,
                        toggle: toggle,
                        getToggleableButtons: getToggleableButtons
                    };
                };
                FroalaEditor.PLUGINS.xfHide = function(ed) {
                    var _allowTypingOnEdges = function _allowTypingOnEdges(e) {
                        var dt = ed.html.defaultTag();
                        var childs = ed.el.childNodes;
                        var offset = e.offsetY;
                        var el = ed.$el;
                        var insideSpoiler = $(e.target).is("blockquote.wysiwygSpoiler");
                        if (insideSpoiler) {
                            childs = $(e.target.childNodes).filter(function(i, el) {
                                return el.nodeType !== Node.TEXT_NODE && !($(el).is("p") && el.childNodes.length === 0) && !$(el).is("input.wysiwygSpoilerInput") || el.nodeType === Node.TEXT_NODE && el.nodeValue !== "";
                            });
                            el = $(e.target);
                            offset = e.offsetY - getHeaderHeight(el);
                        }
                        if (e.target && e.target !== ed.el && !insideSpoiler) {
                            return;
                        }
                        if (childs.length === 0) {
                            return;
                        }
                        if (childs[0].offsetHeight + childs[0].offsetTop <= offset || insideSpoiler && offset >= childs[0].offsetHeight + 10) {
                            if ($(childs[childs.length - 1]).is("blockquote")) {
                                if (dt) {
                                    el.append("<".concat(dt, ">").concat(FroalaEditor.MARKERS, "<br></").concat(dt, ">"));
                                } else {
                                    el.append("".concat(FroalaEditor.MARKERS, "<br>"));
                                }
                                ed.selection.restore();
                                ed.keys.positionCaret();
                                return true;
                            }
                        } else if (offset <= 10) {
                            if ($(childs[0]).is("blockquote")) {
                                if (dt) {
                                    el.prepend("<".concat(dt, ">").concat(FroalaEditor.MARKERS, "<br></").concat(dt, ">"));
                                } else {
                                    el.prepend("".concat(FroalaEditor.MARKERS, "<br>"));
                                }
                                ed.selection.restore();
                                ed.keys.positionCaret();
                                return true;
                            }
                        }
                    };
                    var isEventInCloseButton = function isEventInCloseButton(e) {
                        var closeComputed = getComputedStyle(e.target, ":after");
                        return e.offsetX > parseFloat(closeComputed.left) && e.offsetX < parseFloat(closeComputed.width) + parseFloat(closeComputed.left) && e.offsetY > parseFloat(closeComputed.top) && e.offsetY < parseFloat(closeComputed.top) + parseFloat(closeComputed.height);
                    };
                    var removeHide = function removeHide($hide) {
                        if ($hide.next().is("p")) {
                            $hide.next().prepend(FroalaEditor.MARKERS);
                        } else if ($hide.prev().is("p")) {
                            $hide.prev().append(FroalaEditor.MARKERS);
                        } else {
                            $("<p><br></p>").prepend(FroalaEditor.MARKERS).insertAfter($hide);
                        }
                        $hide.remove();
                        ed.selection.restore();
                    };
                    var openPopup = function openPopup($hide) {
                        var headerHeight = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                        var hideOptionType = wysiwygHideTags[$hide.data("tag")];
                        if (headerHeight === null) headerHeight = getHeaderHeight($hide);
                        ed.popups.hideAll();
                        var $attrInput = ed.popups.get("xfHide.edit").find(".fr-xfHide-attr");
                        $attrInput.val($hide.attr("data-option") || "");
                        var autoComplete = $($attrInput[0]).data("XenForo.AutoComplete");
                        autoComplete.setEnabled(hideOptionType === "usernames");
                        updateInput = function(e) {
                            if (hideOptionType === "number") $attrInput.val($attrInput.val().replace(/\D/g, ""));
                            $hide.attr("data-option", $attrInput.val() || null);
                        };
                        var offset = $hide.offset();
                        ed.popups.show("xfHide.edit", offset.left, offset.top + headerHeight, $hide.outerHeight());
                    };
                    var getHeaderHeight = function getHeaderHeight($hide) {
                        var headerComputed = getComputedStyle($hide[0], ":before");
                        var headerHeight = parseFloat(headerComputed.height) + parseFloat(headerComputed.paddingTop) + parseFloat(headerComputed.paddingBottom);
                        return headerHeight;
                    };
                    var _init = function _init() {
                        ed.popups.create("xfHide.edit", {
                            content: '<div class="fr-layer fr-active">' + '<div class="fr-input-line">' + '<input id="fr-xfHide-edit-'.concat(ed.id, '" placeholder="').concat(ed.language.translate("Hide value"), '" type="text" class="fr-xfHide-attr AutoComplete AcPriority" tabIndex="1">') + "</div>" + "</div>"
                        });
                        ed.popups.setContainer("xfHide.edit", ed.$sc);
                        $(ed.popups.get("xfHide.edit")[0]).xfActivate().find(".fr-xfHide-attr").on("change input keyup keydown paste AutoComplete", function(e) {
                            if (updateInput) return updateInput(e);
                        }).on("keypress", function(e) {
                            if (e.keyCode === 13) {
                                ed.popups.hide("xfHide.edit");
                                e.preventDefault();
                                ed.$el.focus();
                            }
                        });
                        ed.$el.on("mousemove mouseleave", ".wysiwygHide", function(e) {
                            if (isEventInCloseButton(e)) {
                                $(e.target).addClass("closeHover");
                            } else {
                                $(e.target).removeClass("closeHover");
                            }
                        });
                        // click on hide header
                        ed.$el.on("click", ".wysiwygHide", function(e) {
                            var $hide = $(e.target);
                            if (!$hide.is(".wysiwygHide")) return;
                            if (isEventInCloseButton(e)) {
                                $(e.target).removeClass("closeHover");
                                ed.undo.saveStep();
                                removeHide($hide);
                                ed.undo.saveStep();
                                return;
                            }
                            var headerHeight = getHeaderHeight($hide);
                            if (typeof wysiwygHideTags[$hide.data("tag")] === "string" && e.offsetY < headerHeight) {
                                openPopup($hide, headerHeight);
                            }
                        });
                        // override froala backspace behavior on hides
                        ed.events.on("keydown", function(e) {
                            var sel = ed.selection.get();
                            if (e.keyCode !== 8 || !ed.selection.isCollapsed() || sel.anchorOffset !== 0 || sel.focusNode === document1) return;
                            var possibleHide = sel.anchorNode;
                            while(!$(possibleHide).is(".wysiwygSpoiler")){
                                if (possibleHide && ($(possibleHide).is(".fr-view") || possibleHide.parentNode.firstChild !== possibleHide)) return;
                                possibleHide = possibleHide.parentNode;
                            }
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            var hide = $(possibleHide);
                            if (hide.parent("blockquote").length && hide.parent().children().length === 1) {
                                hide.replaceWith($("<p><br></p>").prepend(FroalaEditor.MARKERS));
                                ed.selection.restore();
                            } else {
                                if (!$($(ed.selection.blocks()[0]).closest("blockquote")[0]).is(hide)) {
                                    var $quote = $($(ed.selection.blocks()[0]).closest("blockquote")[0]);
                                    $quote.replaceWith($($quote[0].innerHTML));
                                } else {
                                    // если в хайде есть контент, то зачем его удалять?
                                    if (isEmpty(hide)) removeHide(hide);
                                }
                            }
                            return false;
                        }, true);
                        ed.events.on("click", _allowTypingOnEdges, true);
                    };
                    var insert = function insert() {
                        var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, tag = _ref.tag, _ref_option = _ref.option, option = _ref_option === void 0 ? null : _ref_option, _ref_content = _ref.content, content = _ref_content === void 0 ? null : _ref_content, _ref_replace = _ref.replace, replace = _ref_replace === void 0 ? false : _ref_replace;
                        var $quote = $('<blockquote class="wysiwygHide">').attr("data-tag", tag.toLowerCase()).attr("data-phrase", ed.language.translate("hide_title_" + tag.toLowerCase())).attr("data-option", option).html(content).clone();
                        if (replace) {
                            var html = $quote.prop("outerHTML");
                            ed.$el.html(html) // мб тут всю фроалу разьебу, хз, вроде не должно))0
                            ;
                            ed.placeholder.refresh();
                        }
                        ed.selection.save();
                        ed.html.wrap(false, true, true);
                        ed.selection.restore();
                        var collapsed = ed.selection.isCollapsed();
                        ed.selection.save();
                        // чел который будет это фиксить после меня,
                        // лучше не надо, оставь как есть.
                        // ОНО ТЕБЯ СОЖРЕТ
                        var _ed_$el__querySelectorAll = editor_sliced_to_array(ed.$el[0].querySelectorAll(".fr-marker"), 2), startEl = _ed_$el__querySelectorAll[0], endEl = _ed_$el__querySelectorAll[1];
                        var startElParents = $(startEl).parents();
                        var endElParents = $(endEl).parents();
                        var mutualParent;
                        // поиск первого общего родительского элемента маркеров
                        mutualParentLoop: for(var i = 0; i < startElParents.length; i++)for(var j = 0; j < endElParents.length; j++)if (startElParents[i] === endElParents[j]) {
                            mutualParent = startElParents[i];
                            break mutualParentLoop;
                        }
                        // выношу маркеры наверх чтобы небыло ЕБУЧИХ ПУСТЫХ ЭЛЕМЕНТОВ
                        while(!startEl.previousSibling && startEl.parentElement && startEl.parentElement !== mutualParent)$(startEl).insertBefore(startEl.parentElement);
                        while(!endEl.nextSibling && endEl.parentElement && endEl.parentElement !== mutualParent)$(endEl).insertAfter(endEl.parentElement);
                        // рекурсивное удаление нод по краям до общего родителя
                        function removeNodes(root, until, fromStart, mutualParent) {
                            if (!root) return;
                            if (fromStart) {
                                while(root.childNodes.length){
                                    if (root.firstChild === until) break;
                                    root.firstChild.remove();
                                }
                            } else {
                                while(root.childNodes.length){
                                    if (root.lastChild === until) break;
                                    root.lastChild.remove();
                                }
                            }
                            if (root !== mutualParent) removeNodes(root.parentNode, root, fromStart, mutualParent);
                        }
                        var formatElementSelector = "p, span[style], s, strong, em";
                        var selection = mutualParent.cloneNode(true);
                        var node = mutualParent.parentNode;
                        while($(node.parentNode).is(formatElementSelector)){
                            node = node.parentNode;
                        }
                        if ($(node).is(formatElementSelector)) {
                            selection = node.cloneNode(true);
                        }
                        var _selection_querySelectorAll = editor_sliced_to_array(selection.querySelectorAll(".fr-marker"), 2), clonedStart = _selection_querySelectorAll[0], clonedEnd = _selection_querySelectorAll[1];
                        // обрезка selection по маркерам, с начала и с конца
                        removeNodes(clonedStart.parentNode, clonedStart, true, selection);
                        removeNodes(clonedEnd.parentNode, clonedEnd, false, selection);
                        $(selection).find(".fr-marker").remove();
                        var blockElementSelector = "div, blockquote, ol, li, ul";
                        if (!mutualParent.matches(blockElementSelector) && !content) {
                            if (collapsed) {
                                $("<p><br></p>").prepend($(markerTemplate).attr("data-type", "true")).prepend($(markerTemplate).attr("data-type", "false")).appendTo($quote);
                            } else {
                                $(selection).prepend($(markerTemplate).attr("data-type", "true")).append($(markerTemplate).attr("data-type", "false")).appendTo($quote);
                            }
                        }
                        var afterSelection = mutualParent.cloneNode(true);
                        var afterNode = mutualParent.parentNode;
                        var $alignEl = $(mutualParent);
                        while($(afterNode.parentNode).is(formatElementSelector)){
                            afterNode = afterNode.parentNode;
                        }
                        var unwrapFormat = $(afterNode).is(formatElementSelector);
                        if (unwrapFormat) {
                            $alignEl = $(afterNode);
                            afterSelection = afterNode.cloneNode(true);
                        }
                        var _afterSelection_querySelectorAll = editor_sliced_to_array(afterSelection.querySelectorAll(".fr-marker"), 2), afterSelStart = _afterSelection_querySelectorAll[0], afterSelEnd = _afterSelection_querySelectorAll[1];
                        removeNodes(afterSelEnd.parentNode, afterSelEnd, true, afterSelection);
                        removeNodes(startEl.parentNode, startEl, false, mutualParent);
                        $(afterSelection).find(".fr-marker").remove();
                        $(mutualParent).find(".fr-marker").remove();
                        if (!mutualParent.matches(blockElementSelector)) {
                            // в инлайн элементы нельзя пихать <blockquote>,
                            // поэтому тут я разделяю его на 2 разнных элемента,
                            // до и после selection, и между ними вставляю хайд
                            // и если элементы по краям пустые, я их удаляю
                            function isEmptyParagraph(el) {
                                if (el.matches(blockElementSelector)) return false;
                                if (!el.childNodes.length) return true;
                                return el.childNodes.length === 1 && el.childNodes[0].matches && el.childNodes[0].matches("br");
                            }
                            if ($alignEl.is("p")) {
                                $quote.attr("data-align", $alignEl.css("text-align") || "left");
                            }
                            if (unwrapFormat) {
                                removeNodes(mutualParent.parentNode, mutualParent, false, afterNode);
                                $quote.insertAfter(afterNode);
                            } else {
                                $quote.insertAfter(mutualParent);
                            }
                            if (isEmptyParagraph(mutualParent)) mutualParent.remove();
                            if (!isEmptyParagraph(afterSelection)) $(afterSelection).insertAfter($quote);
                        } else {
                            // а для блоков просто вставка селекшона в него
                            $quote.append($(selection).children()).prepend(FroalaEditor.START_MARKER).append(FroalaEditor.END_MARKER).appendTo(mutualParent);
                            $(afterSelection).children().insertAfter($quote);
                        }
                        ed.html.unwrap();
                        ed.selection.restore();
                        ed.placeholder.refresh();
                        $quote.children("p:empty").remove();
                        if (typeof wysiwygHideTags[tag] === "string") {
                            $quote.addClass("needOption");
                            if (option === null) openPopup($quote);
                        }
                    };
                    var isFullSelected = // аналог ed.selection.isFull()
                    // но не для редактора, а для хайда.
                    // true, если выделен весь текст внутри него
                    function isFullSelected($hide) {
                        var info = ed.selection.info($hide[0]);
                        return info.atStart && info.atEnd;
                    };
                    var onlyText = // true, если в хайде содержится только текст и тд
                    function onlyText($hide) {
                        // .filter() не возвращает TEXT_NODE
                        // поэтому просто отсеиваем всё кроме нежелательных тегов
                        var $notText = $hide.find("*").filter(function() {
                            return ![
                                "P",
                                "A",
                                "S",
                                "EM",
                                "STRONG"
                            ].includes(this.tagName);
                        });
                        return !$notText.length;
                    };
                    var isEmpty = // true, если содержимое хайда пусто
                    function isEmpty($hide) {
                        var textExists = $hide.text().replace(/\u200B/g, "") !== "";
                        // <p><br></p> - хайд пуст
                        // .find('*') вернёт <p> и <br>
                        // <p><img>text</p> - хайд не пуст
                        // .find('*') вернёт <p>, <br> и <img> (кроме текста)
                        // <p>text</p> - хайд не пуст
                        // .find('*') вернёт <p>, но хайд не пуст за счёт textExists
                        var htmlExists = $hide.find("*:not(.wysiwygSpoilerInput)").length > 2;
                        return !textExists && !htmlExists;
                    };
                    var markerTemplate = '<span class="fr-marker" data-id="0" style="display: none; line-height: 0;">​</span>';
                    var updateInput = null;
                    return {
                        _init: _init,
                        insert: insert,
                        isFullSelected: isFullSelected,
                        onlyText: onlyText,
                        isEmpty: isEmpty
                    };
                };
                // простите меня за мой говнокод, иначе никак
                FroalaEditor.PLUGINS.xfSrci = function(ed) {
                    var removeAf = // удаляет всё говно из TEXT_NODE
                    // если элемент пуст, удаляет его
                    function removeAf($text) {
                        if (!$text.length) return;
                        if ($text[0].nodeType !== Node.TEXT_NODE) return;
                        $text[0].data = $text[0].data.replaceAll(magicSymbol, "");
                        if ($text[0].data === "") $text.remove();
                    };
                    var checkAf = // ищет и удаляет остатки
                    // говна после изменения текста/удаления SRCI
                    function checkAf(event) {
                        function removeLastOrAf(sibling) {
                            if (!sibling || sibling.nodeType !== Node.TEXT_NODE) return;
                            var value = sibling.data;
                            if (value.endsWith(magicSymbol) && value.length > 1) {
                                sibling.data = value.substring(0, value.length - 1);
                                return;
                            }
                            if (value === magicSymbol) $(sibling).remove();
                        }
                        ed.$el.find("p").contents().filter(function(el) {
                            return el.nodeType === Node.TEXT_NODE;
                        }).each(function(i, el) {
                            var prev = el.previousSibling;
                            var next = el.nextSibling;
                            if (!$(prev).is(helperSelector) && !$(next).is(helperSelector)) {
                                // слева и справа нет srci
                                if (el.data === magicSymbol) $(el).remove();
                            } else if ($(next).is(helperSelector)) {
                                // справа от 'X' есть srci
                                if (el.data.endsWith(magicSymbol) && el.data.length > 1) {
                                    el.data = el.data.substring(0, el.data.length - 1);
                                    // при попытке ввести текст перед говном,
                                    // селекшн слетает в самое начало
                                    if (el.nodeValue.length == 1) setRange(el, el, 1, 1);
                                }
                            } else {
                                removeLastOrAf(prev);
                                removeLastOrAf(next);
                            }
                        });
                    };
                    var helperFix = // чистит и заново вставляет говно
                    function helperFix($helper) {
                        ed.selection.save();
                        $helper.html($helper.html().replaceAll(magicSymbol, ""));
                        var $prev = $($helper[0].previousSibling);
                        // идём влево пока не пройдём маркеры
                        while($prev.is("span.fr-marker") && $prev.length)$prev = $($prev[0].previousSibling);
                        // <span style="...">X</span> => X
                        var $next = $($helper[0].nextSibling);
                        if (ed.helpers.isMobile()) mobileAfFix($next);
                        removeAf($next);
                        prevFix($prev);
                        var $parent = $helper.parent();
                        if ($parent.is("p")) {
                            // спавним говно перед SRCI
                            // чтобы там можно было писать текст
                            if ($parent.contents().first().is(helperSelector) || $prev.is("br")) $helper.before(magicSymbol);
                        }
                        var $srci = $helper.find(srciSelector);
                        $srci.html(magicSymbol + $srci.html());
                        $helper.after(magicSymbol);
                        ed.selection.restore();
                        firefoxSelectionFix();
                    };
                    var insert = function insert() {
                        // вспомогательный элемент для вставки говна
                        var helper = '<span class="wysiwygSrciHelper"></span>';
                        var $srci = $("<code>").addClass("wysiwygSrci").text(ed.selection.text()).clone();
                        // чтобы нельзя было вставить srci внутрь srci
                        if ($(ed.selection.element()).is(srciSelector)) return;
                        // вставляем helper
                        insertFix(ed, true);
                        ed.html.insert(helper);
                        // вставляем srci
                        var $helper = ed.$el.find("".concat(helperSelector, ":empty"));
                        $helper.html($srci.prop("outerHTML"));
                        helperFix($helper);
                        rangeAtSrci($helper);
                    };
                    var rangeAtSrci = // переносит каретку внутрь SRCI
                    function rangeAtSrci($helper) {
                        var srci = $helper.find(srciSelector)[0];
                        setRange(srci, srci, 1, 1);
                    };
                    var setRange = // велосипед, зато сколько кода экономит
                    function setRange(startEl, endEl, firstOffset, secondOffset) {
                        ed.selection.clear();
                        var range = new Range();
                        range.setStart(startEl, firstOffset);
                        range.setEnd(endEl, secondOffset);
                        ed.selection.get().addRange(range);
                    };
                    var mobileAfFix = // делает X из <span style="...">X</span>
                    function mobileAfFix($af) {
                        var remove = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                        if (!$af.is("span[style]:not(span[class])")) return;
                        var possibleText = $af.contents().first();
                        if (!possibleText.length || possibleText[0].nodeValue !== magicSymbol) return;
                        if (remove) $af.remove();
                        else $af.replaceWith($(possibleText));
                    };
                    var backspaceAfterAf = // попытка стереть X
                    // <p>X|<srci>code</srci></p>
                    function backspaceAfterAf(afRemoved, latestText, wordBackward) {
                        var selection = ed.selection.get();
                        if (selection.rangeCount === 0) return;
                        var range = selection.getRangeAt(0);
                        var code = range.startContainer;
                        if (firefox) {
                            // возможно у нас принудительный element range
                            if (!(range.collapsed || !wordBackward)) return;
                            if ($(code).is("p")) {
                                var possibleText = range.startContainer.childNodes[range.startOffset - 1];
                                if (!possibleText || possibleText.nodeType !== Node.TEXT_NODE) return;
                                code = possibleText;
                            }
                        } else {
                            if (!(range.collapsed || !wordBackward) || range.startOffset !== 0) return;
                            if (range.startContainer.nodeType !== Node.TEXT_NODE) return;
                        }
                        var $srci = $(code).closest(helperSelector);
                        if (!$srci.is(helperSelector)) return;
                        var br = $srci[0].previousSibling;
                        var $parent = $srci.parent();
                        // либо мы с пк
                        // либо у нас нет верхнего <p>
                        if ($(br).is("br") && afRemoved && (!ed.helpers.isMobile() || !$parent.prev().is("p"))) {
                            // переносим каретку в конец text:
                            // <p>text<br><srci>code</srci></p>
                            var text = br.previousSibling;
                            // если текста нет, пихаем туда символ:
                            // <p>X<br><srci>code</srci></p>
                            if (text === null || text.nodeType !== Node.TEXT_NODE) {
                                $(br).before(magicSymbol);
                                text = br.previousSibling;
                            }
                            $(br).remove();
                            setRange(text, text, text.data.length, text.data.length);
                            return;
                        }
                        if (!$parent.is("p")) return;
                        // <p>text</p> <- $textP
                        // <p>|<srci>code</srci></p>
                        var $textP = $($parent[0].previousSibling);
                        //if (latestText?.length === 1) {
                        if (latestText !== null && !firefox) {
                            // каретка больше не елозит при стирании)
                            $srci.before(magicSymbol);
                            var symbol = $srci[0].previousSibling;
                            setRange(symbol, symbol, 0, 0);
                        }
                        if (!$textP.is("p") || !afRemoved) return;
                        // объединяем строки
                        $textP.append($parent.html());
                        $parent.remove();
                        // устанавливаем позицию каретки сюда:
                        // <p>text|<srci>code</srci>other text</p> <- $textP
                        var $first = $textP.contents().first();
                        if ($first.length > 0 && $first[0].nodeType === Node.TEXT_NODE) {
                            var length = $first[0].nodeValue.length;
                            setRange($first[0], $first[0], length, length);
                            return;
                        }
                        setRange($textP[0], $textP[0], 1, 1);
                    };
                    var enterAfterText = // после нажатия enter и вызова helperFix
                    // нужно перенести каретку на текст перед <srci>
                    function enterAfterText() {
                        var selection = ed.selection.get();
                        if (selection.rangeCount === 0) return;
                        var range = selection.getRangeAt(0);
                        // range HTML (| - положение каретки):
                        // <p>X <- text
                        // <srci>X|code</srci></p>
                        if (!range.collapsed || range.startOffset !== 1) return;
                        if (!$(range.startContainer).closest(srciSelector).length) return;
                        if (!range.startContainer.data.startsWith(magicSymbol)) return;
                        var $srci = $(range.startContainer).closest(helperSelector);
                        var text = $srci[0].previousSibling;
                        if (text.nodeType !== Node.TEXT_NODE || text.data !== magicSymbol) return;
                        // устанавливаем выделение в самое начало текста
                        setRange(text, text, 0, 0);
                    };
                    var backspaceLineCollapsed = // вырезаем X (после объединения строк)
                    // <p>textX<srci>code</srci></p>
                    function backspaceLineCollapsed() {
                        var selection = ed.selection.get();
                        if (selection.rangeCount === 0) return;
                        var range = selection.getRangeAt(0);
                        var text = range.startContainer; // 'text'
                        var offset = range.startOffset;
                        var symbol = text.nextSibling; // 'X'
                        if (!symbol || symbol.nodeType !== Node.TEXT_NODE) return;
                        // <p>
                        // 'text'
                        // 'other' <- symbol
                        // <p>
                        // хз как так вышло)))
                        if (symbol.data.startsWith(magicSymbol)) {
                            // в конце говна быть не может, так что смотрим вперёд
                            // и вырезаем его, если он есть
                            symbol.data = symbol.data.replaceAll(magicSymbol, "");
                        }
                        if (symbol.data.length > 0) {
                            // <p>'textother'</p>
                            text.data = text.data + symbol.data;
                            // каретка снова слетела в самое начало
                            setRange(text, text, offset, offset);
                        }
                        $(symbol).remove();
                    };
                    var clearPrevText = // очищаем текст перед srci
                    function clearPrevText() {
                        var selection = ed.selection.get();
                        if (selection.rangeCount === 0) return;
                        var range = selection.getRangeAt(0);
                        if (!range.collapsed) return;
                        if (range.startContainer.nodeType !== Node.TEXT_NODE) return;
                        var startOffset = range.startOffset;
                        // <p>Xtext|<srci>code</srci></p>
                        // selected - 'Xtext'
                        // next - SRCI
                        var selected = range.startContainer;
                        var next = selected.nextSibling;
                        // чистим text если он перед SRCI
                        if ($(next).is(helperSelector)) prevFix($(selected));
                        // восстанавливаем каретку, которая уехала влево
                        setRange(selected, selected, startOffset, startOffset);
                    };
                    var srciColoredFix = function srciColoredFix() {
                        ed.selection.save();
                        var snapshot = ed.snapshot.get();
                        var tagFont = $(snapshot.html).find('font[face="monospace"]')[0];
                        var span = $(snapshot.html).find("span[style]")[0];
                        if ((tagFont === null || tagFont === void 0 ? void 0 : tagFont.outerHTML) && (span === null || span === void 0 ? void 0 : span.outerHTML)) {
                            snapshot.html = snapshot.html.replace(tagFont.outerHTML, tagFont.innerHTML);
                            snapshot.html = snapshot.html.replace(span.outerHTML, span.innerHTML);
                        }
                        if (firefox) {
                            var code = $(snapshot.html).find("code:not([class])")[0];
                            if (code === null || code === void 0 ? void 0 : code.outerHTML) {
                                snapshot.html = snapshot.html.replace(code.outerHTML, code.innerHTML);
                            }
                        }
                        ed.snapshot.restore(snapshot);
                        ed.selection.restore();
                        firefoxSelectionFix();
                    };
                    var mobileAfAllFix = // чистит говно
                    function mobileAfAllFix($el) {
                        $el.removeAttr("style");
                        // говно превращается в <span style="...">X</span>
                        // это нам не надо, ибо ломает ВСЁ ЧТО МОЖНО
                        $el.parent().find("span[style]").each(function(i, el) {
                            mobileAfFix($(el));
                        });
                    };
                    var mobileDisableEnterP = function mobileDisableEnterP($el) {
                        // <p>text<srci>code</srci></p>
                        // <p>X</p> <- $el
                        var $prev = $($el[0].previousSibling);
                        var $possibleSrci = $prev.contents().last();
                        if (!$prev.is("p") || !$possibleSrci.is(helperSelector)) return;
                        // делаем <p>text<srci>code</srci></p>
                        var $possibleAf = $el.contents().first();
                        mobileAfFix($possibleAf);
                        // $possibleAf может объединяться с существующим текстом
                        if ($possibleAf[0].nodeType !== Node.TEXT_NODE) return;
                        $prev.append($el.html());
                        $el.remove();
                        // переносим селекшн внутрь SRCI
                        rangeAtSrci($possibleSrci);
                    };
                    var mobileDisableEnterSrci = function mobileDisableEnterSrci($el) {
                        // <p>text<srci>old</srci></p> <- prev <p>
                        // <p> <- $parent
                        // <srci>new</srci> <- $el
                        // </p>
                        var $parent = $el.closest(helperSelector).parent();
                        var $prev = $($parent[0].previousSibling);
                        var $possibleSrci = $prev.contents().last();
                        if (!$possibleSrci.is(helperSelector)) return;
                        // переносим содержимое $el внутрь $possibleSrci
                        // <p>text<srci>oldnew</srci></p>
                        // <p>maybe other content</p>
                        $possibleSrci.find(srciSelector).append($el.html());
                        // удаляем второй SRCI
                        $el.closest(helperSelector).remove();
                        // при наличии другого контента в $parent
                        if ($parent.contents().length > 0) $prev.append($parent.html());
                        // удаляем второй <p>
                        $parent.remove();
                        // переносим каретку в конец первого SRCI
                        rangeAtSrci($possibleSrci);
                    };
                    var firefoxLeftFix = // фиксим перемещения через стрелочки
                    // левая стрелочка
                    function firefoxLeftFix() {
                        var selection = ed.selection.get();
                        if (selection.rangeCount === 0) return true;
                        var range = selection.getRangeAt(0);
                        var container = range.startContainer;
                        if ($(container).is(srciSelector)) {
                            // 'text'<srci>'X'|</srci>
                            var $srci = $(container).closest(helperSelector);
                            var possibleText = $srci[0].previousSibling;
                            // <code>'text'</code> - баг лисы
                            if ($(possibleText).is("code:not([class])")) $(possibleText).replaceWith(possibleText.firstChild);
                            var code = container.firstChild;
                            if (code && code.nodeType === Node.TEXT_NODE && code.data === magicSymbol && range.startOffset === 1) {
                                // переносим каретку за SRCI
                                var parent = possibleText.parentNode;
                                var index = Array.prototype.indexOf.call(parent.childNodes, possibleText);
                                setRange(parent, parent, index + 1, index + 1);
                            }
                            return true;
                        }
                        // лиса может вернуть element range,
                        // в котором это выделение может быть представлено по другому
                        var $possibleSrci = $(container).closest(helperSelector);
                        var $prev = $(container.previousSibling);
                        if ($possibleSrci.length) {
                            // перемещение происходит в пределах SRCI
                            // text<srci>X|code</srci>qwe
                            if (range.startOffset === 1) {
                                var text = $possibleSrci[0].previousSibling;
                                if ($(text).is("code:not([class])")) $(text).replaceWith(text.firstChild);
                                if (text && text.nodeType === Node.TEXT_NODE) {
                                    // переносим каретку в конец text
                                    var parent1 = text.parentNode;
                                    var index1 = Array.prototype.indexOf.call(parent1.childNodes, text);
                                    if (index1 !== -1) {
                                        setRange(parent1, parent1, index1 + 1, index1 + 1);
                                        return true;
                                    }
                                }
                            }
                        } else {
                            // хз почему строки делятся на отдельные элементы
                            if ($prev.length && $prev[0].nodeType === Node.TEXT_NODE && $prev[0].data === magicSymbol) {
                                // если 'X' '|text'
                                // чтобы не разьебалось
                                var $srci1 = $($prev[0].previousSibling);
                                if ($srci1.length && range.startOffset === 0) {
                                    rangeAtSrci($srci1);
                                    return false;
                                }
                            } else if ($prev.is(helperSelector)) {
                                // <srci>code</srci>Xtext| <- мы тут
                                var $srci2 = $prev.find(srciSelector);
                                if (range.startOffset === 1 && container.data.startsWith(magicSymbol)) {
                                    // прыг скок из 'Xtext|' в 'code|'
                                    setRange($srci2[0], $srci2[0], 1, 1);
                                    return false;
                                }
                            } else if ($(container).is("p")) {
                                var el = container.childNodes[range.startOffset - 1];
                                var $srci3 = $(el === null || el === void 0 ? void 0 : el.previousSibling);
                                if (el && el.nodeType === Node.TEXT_NODE && el.data === magicSymbol && $srci3.is(helperSelector)) {
                                    // переносим каретку внутрь $srci
                                    rangeAtSrci($srci3);
                                    return false;
                                }
                            }
                        }
                        return true;
                    };
                    var firefoxRightFix = // правая стрелочка
                    function firefoxRightFix() {
                        var _text_nextSibling;
                        var selection = ed.selection.get();
                        if (selection.rangeCount === 0) return true;
                        var range = selection.getRangeAt(0);
                        if (!range.collapsed) return true;
                        var container = range.startContainer;
                        if (container.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
                            var $srci = $(container.nextSibling);
                            if ($srci.is(helperSelector) && container.data === magicSymbol) {
                                var code = $srci[0].firstChild.firstChild;
                                setRange(code, code, 1, 1);
                                return false;
                            }
                        }
                        // magic
                        if ($(container).is("p")) return true;
                        // после перехода справа в SRCI
                        // блять вот из-за этой хуйни всё сломалось
                        if ($(container).is(srciSelector)) container = container.firstChild;
                        var $srci1 = $(container).closest(helperSelector);
                        // если не внутри SRCI
                        if (!$srci1.length) return true;
                        // если не в конце SRCI
                        if (container.data.length !== range.startOffset) {
                            if ($(range.startContainer).is(srciSelector) && range.startOffset === 0) {
                                return true;
                            }
                            // если всё таки text range
                            if (container === range.startContainer) return true;
                        }
                        // <srci>code|</srci>Xtext
                        // просто перескакиваем с 'code|' на '|text',
                        // если каретка находится в конце SRCI
                        var text = $srci1[0].nextSibling;
                        // если 'Xtext' разделён на два элемента:
                        // <srci>code|</srci>'X' 'text'
                        var index = 1;
                        if (text && ((_text_nextSibling = text.nextSibling) === null || _text_nextSibling === void 0 ? void 0 : _text_nextSibling.nodeType) === Node.TEXT_NODE) {
                            if (text.data === magicSymbol) {
                                text = text.nextSibling;
                                index = 0;
                            }
                        }
                        setRange(text, text, index, index);
                        return false;
                    };
                    var firefoxSrciBeforeDel = // чистим говно после удаления SRCI
                    function firefoxSrciBeforeDel($srci) {
                        if (!$srci.length) return;
                        function clearLeft(text) {
                            if (!text) return;
                            if (text.nodeType !== Node.TEXT_NODE) return;
                            var left = $(text.previousSibling).is(helperSelector);
                            text.data = text.data.replaceAll(magicSymbol, "");
                            if (left) {
                                text.data = magicSymbol + text.data;
                            }
                        }
                        function clearRight(text) {
                            if (!text) return;
                            if (text.nodeType !== Node.TEXT_NODE) return;
                            var right = $(text.nextSibling).is(helperSelector);
                            if (text.data === magicSymbol && right) return;
                            text.data = text.data.replaceAll(magicSymbol, "");
                        }
                        clearLeft($srci[0].previousSibling);
                        clearRight($srci[0].nextSibling);
                    };
                    var firefoxBackspaceFix = // firefoxDeleteContent() ток для keydown event
                    // потому что ловит нажатие до удаления символа
                    function firefoxBackspaceFix() {
                        var selection = ed.selection.get();
                        if (selection.rangeCount === 0) return true;
                        var range = selection.getRangeAt(0);
                        if (!range.collapsed) return true;
                        var container = range.startContainer;
                        if (container.nodeType === Node.TEXT_NODE) {
                            if ($(container.previousSibling).is(helperSelector)) {
                                // <srci>'code'</srci>'Xtext'
                                // при попытке стереть X
                                if (container.data.startsWith(magicSymbol) && range.startOffset === 1) {
                                    // переносим каретку внутрь SRCI
                                    var $srci = $(container.previousSibling);
                                    rangeAtSrci($srci);
                                    return false;
                                }
                            } else if ($(container).closest(helperSelector).length) {
                                // 'text'<srci>'|X...'</srci>
                                // при попытке стереть 'text' (каретка внутри SRCI)
                                if (range.startOffset === 0) {
                                    // переносим селекшн за SRCI
                                    var $srci1 = $(container).closest(helperSelector);
                                    var possibleText = $srci1[0].previousSibling;
                                    if (possibleText && possibleText.nodeType === Node.TEXT_NODE) {
                                        // ставим селекшн в конец строки
                                        if (possibleText.data !== magicSymbol) {
                                            setRange(possibleText, possibleText, possibleText.data.length, possibleText.data.length);
                                            return false;
                                        }
                                        // если перед нами говно, ставим каретку перед ним
                                        // чтобы его не стереть
                                        setRange(possibleText, possibleText, 0, 0);
                                    //return false;
                                    } else {
                                        // <p><srci>'|X'...
                                        // <p><img><srci>'|X'...
                                        // и прочие варианты
                                        // спавним говно
                                        $srci1.before(magicSymbol);
                                        // теперь надо перенести селекшн сюда:
                                        // <p>'X|'<srci>'X'...
                                        var symbol = $srci1[0].previousSibling;
                                        setRange(symbol, symbol, 1, 1);
                                        return false;
                                    }
                                } else if (range.startOffset === 1 && latestText === magicSymbol) {
                                    // удаление SRCI
                                    var $srci2 = $(container).closest(helperSelector);
                                    firefoxSrciBeforeDel($srci2);
                                    var $parent = $srci2.parent();
                                    $srci2.remove();
                                    // избегаем <p></p>
                                    if ($parent.children().length === 0) {
                                        $parent.append("<br>");
                                    }
                                    ed.placeholder.refresh();
                                    return false;
                                }
                            }
                        } else if ($(container).is(srciSelector)) {
                            var $srci3 = $(container).closest(helperSelector);
                            firefoxSrciBeforeDel($srci3);
                        } else if ($(container).is("p")) {
                            var el = container.childNodes[range.startOffset - 1];
                            if (!el) return true;
                            var $prev = $(el.previousSibling);
                            var $srci4 = $(el.nextSibling);
                            if ($srci4.is(helperSelector) && $prev.is("br")) {
                                if (el.nodeType === Node.TEXT_NODE && el.data.length === 1) {
                                    if (el.data === magicSymbol) {
                                        $prev.remove();
                                    } else {
                                        el.data = magicSymbol;
                                    }
                                    return false;
                                }
                            }
                        }
                        return true;
                    };
                    var firefoxDeleteContent = // любезно спавним говно для лисы
                    function firefoxDeleteContent() {
                        // <p>'text'</srci>'|X...'</srci>
                        // при нажатии на Backspace мы должны
                        //
                        var selection = ed.selection.get();
                        if (selection.rangeCount === 0) return;
                        var range = selection.getRangeAt(0);
                        if (!range.collapsed) return;
                        // <srci>code</srci>X
                        // при удалении говна:
                        // text = <p>
                        var container = range.startContainer;
                        if ($(container).is("p") && latestText === magicSymbol) {
                            if (range.startOffset === 0) {
                                var $srci = $(range.startContainer.firstChild);
                                if ($srci.is(helperSelector)) {
                                    $srci.before(magicSymbol);
                                }
                                return;
                            }
                            var $srci1 = $(container.childNodes[range.startOffset - 1]);
                            // значит мы находились тут:
                            // <srci>code</srci>X|
                            if ($srci1.is(helperSelector)) {
                                // спавним его заново
                                $srci1.after(magicSymbol);
                                // если лиса не хочет делать этого
                                // то мы блять сделаем это за неё.
                                var text = $srci1[0].firstChild.firstChild;
                                setRange(text, text, text.data.length, text.data.length);
                            } else if ($srci1.is("br")) {
                                // значит мы находились тут:
                                // ...<br>X|<srci>code</srci>
                                var possibleText = $srci1[0].previousSibling;
                                // баг лисы
                                if ($(possibleText).is("code:not([class])")) possibleText = possibleText.firstChild;
                                // казалось бы, надо переносить каретку,
                                // чтобы следующее нажатие 'Backspace'
                                // не уебало нам srci, но не тут то было:
                                // в этот раз лиса сыграла нам на руку
                                if (!possibleText) {
                                    // если перед <srci> нет текста,
                                    // туда надо заспавнить говно
                                    $srci1.before(magicSymbol);
                                    // теперь удаляем со спокойной душой
                                    $srci1.remove();
                                } else {
                                    // если перед <srci> есть говно
                                    if (afRemoved) {
                                        // при попытке его удалить, переносимся на предыдущую строку
                                        $srci1.remove();
                                        // переносим селекшн
                                        setRange(possibleText, possibleText, possibleText.length, possibleText.length);
                                    }
                                }
                            }
                        } else if ($(container).is("p")) {
                            if (range.startOffset === 0) {
                                var $srci2 = $(container.firstChild);
                                if ($srci2.is(helperSelector)) {
                                    $srci2.before(magicSymbol);
                                }
                                return;
                            }
                            var possibleText1 = container.childNodes[range.startOffset - 1];
                            if (possibleText1 && possibleText1.nodeType === Node.TEXT_NODE && deletedSrci) {
                                // после нажатия backspace SRCI уже удалён.
                                // надо восстановить его, и перенести каретку в его конец
                                $(possibleText1).after(deletedSrci);
                                // теперь переносим каретку в конец SRCI
                                rangeAtSrci($(possibleText1.nextSibling));
                            } else if ($(possibleText1).is(helperSelector)) {
                                // после попытки стереть говно после SRCI
                                $(possibleText1).after(magicSymbol);
                                // переносим каретку в конец SRCI
                                var code = possibleText1.firstChild;
                                if (!code) return;
                                // element range
                                $(code).remove();
                                setRange(code, code, 1, 1);
                            }
                        }
                    };
                    var firefoxEnterFix = function firefoxEnterFix() {
                        var selection = ed.selection.get();
                        if (selection.rangeCount === 0) return;
                        var range = selection.getRangeAt(0);
                        var container = range.startContainer;
                        if (container.nodeType === Node.TEXT_NODE) {
                            if ($(container.previousSibling).is(helperSelector)) {
                                // после нажатия enter, селекшн
                                // переносится за SRCI, но не за X
                                // поэтому сдвигаем его на единицу
                                setRange(container, container, 1, 1);
                            }
                        }
                    };
                    var firefoxSelectionFix = // заправляет selection в пределы текстового элемента
                    // из <p><text>test</text>|<srci/></p> делает <p><text>test|</text><srci/></p>
                    // исправляет вторую часть недочета https://zelenka.guru/threads/6010094/
                    function firefoxSelectionFix() {
                        if (!firefox) return;
                        var range = ed.selection.ranges(0);
                        if (!range || !range.collapsed || range.startContainer.nodeType !== 1 || range.startOffset <= 0) return;
                        var srci = range.startContainer.childNodes[range.startOffset];
                        if (srci.nodeType !== 1 || !srci.classList.contains("wysiwygSrciHelper")) return;
                        var textNode = range.startContainer.childNodes[range.startOffset - 1];
                        if (!textNode || textNode.nodeType !== 3) return;
                        range.setStart(textNode, textNode.textContent.length);
                        range.setEnd(textNode, textNode.textContent.length);
                    };
                    var _init = function _init() {
                        ed.$el.find(helperSelector).each(function(i, el) {
                            helperFix($(el));
                        });
                        // мега костыль для хитровыебанного бага.
                        ed.$el.on("keydown", function(e) {
                            afRemoved = false;
                            latestText = null;
                            deletedSrci = null;
                            if (firefox && e.originalEvent.key === "ArrowLeft") {
                                if (!firefoxLeftFix()) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }
                            if (firefox && e.originalEvent.key === "ArrowRight") {
                                if (!firefoxRightFix()) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }
                            if (e.originalEvent.key !== "Backspace") return;
                            var selection = ed.selection.get();
                            if (selection.rangeCount === 0) return;
                            var range = selection.getRangeAt(0);
                            if (!range.collapsed) return;
                            // баг на лисе:
                            // <srci>code</srci>|X  startContainer == 'X'
                            if (range.startContainer.nodeType === Node.TEXT_NODE && (!firefox || range.startOffset !== 0)) {
                                latestText = range.startContainer.data;
                                afRemoved = latestText.endsWith(magicSymbol);
                                if (firefox && !firefoxBackspaceFix()) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                                return;
                            }
                            if (firefox && $(range.startContainer.previousSibling).is(helperSelector)) {
                                deletedSrci = $(range.startContainer.previousSibling).clone();
                            }
                            if (!$(range.startContainer).is("p")) {
                                if (firefox && !firefoxBackspaceFix()) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                                return;
                            }
                            var possibleText = range.startContainer.childNodes[range.startOffset];
                            // баг на лисе:
                            // <code>text</code> (а надо 'text')
                            if (firefox && $(possibleText).is("code:not([class])")) $(possibleText).replaceWith($(possibleText.firstChild));
                            // <p>text<span>|<code>...</code></span></p> | - каретка
                            if ($(possibleText).is(helperSelector)) {
                                possibleText = possibleText.previousSibling;
                            }
                            if (!possibleText || possibleText.nodeType !== Node.TEXT_NODE) {
                                if (firefox && !firefoxBackspaceFix()) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                                return;
                            }
                            latestText = possibleText.data;
                            afRemoved = latestText.endsWith(magicSymbol);
                            if (firefox && !firefoxBackspaceFix()) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        });
                        ed.events.on("input", function(e) {
                            var $element = $(ed.selection.element());
                            if (ed.helpers.isMobile()) {
                                // фиксы <span style="..."> на телефонах
                                if ($element.is(helperSelector)) mobileAfAllFix($element);
                                if ($element.next().is(helperSelector)) mobileAfAllFix($element.next());
                                mobileAfFix($element, true);
                                if (e.originalEvent.inputType === "insertParagraph") {
                                    // убираем возможность нажимать enter
                                    // находясь внутри SRCI
                                    if ($element.is("p")) mobileDisableEnterP($element);
                                    // если селекшн находился внутри
                                    // SRCI (не у правой границы)
                                    if ($element.is(srciSelector)) mobileDisableEnterSrci($element);
                                }
                            }
                            // firefox moment
                            if (navigator.userAgent.includes("Firefox")) {
                                if (e.originalEvent.inputType === "insertText") {
                                // чистим и заново спавним говно
                                // checkAf() firefox edition
                                //firefoxInsertText();
                                } else if (e.originalEvent.inputType === "deleteContentBackward") {
                                    // если находимся слева от srci, нужно
                                    // спавнить говно и стягивать селекшн влево
                                    firefoxDeleteContent();
                                } else if (e.originalEvent.inputType === "insertLineBreak") {
                                    // фиксим enter
                                    firefoxEnterFix();
                                }
                            }
                            if ($element.is(srciSelector)) {
                                // <p>text<br>X|<srci>...
                                if (e.originalEvent.inputType === "deleteContentBackward") backspaceAfterAf(afRemoved, latestText, false);
                                if (e.originalEvent.inputType === "deleteWordBackward") backspaceAfterAf(afRemoved, latestText, true);
                                // обновляем говно
                                helperFix($element.parent());
                                // если селекшн находился здесь:
                                // <p>text|<srci>code</srci></p> (до нажатия enter)
                                if (!firefox && [
                                    "insertParagraph",
                                    "insertLineBreak"
                                ].includes(e.originalEvent.inputType)) enterAfterText();
                            }
                            if ($element.is(helperSelector)) helperFix($element);
                            if ($element.is("p") && e.originalEvent.inputType === "deleteContentBackward") backspaceLineCollapsed();
                            if (ed.$el.find(helperSelector).length && ![
                                "deleteContentBackward",
                                "insertParagraph"
                            ].includes(e.originalEvent.inputType)) clearPrevText();
                            // при удалении SRCI после них остается цветной текст
                            if ($element.is(srciSelector) && (firefox || $element.is("span[style]") && e.originalEvent.inputType !== "deleteContentBackward")) srciColoredFix();
                            checkAf(e.originalEvent.inputType);
                            // не даём нажимать enter внутри srci
                            if (!ed.helpers.isMobile()) ed.$el.find(srciSelector).find("br").remove();
                        }, true);
                        // убираем говно при попытке что-то вставить в SRCI (ctrl+v)
                        ed.events.on("paste.afterCleanup", function(html) {
                            if (!$(ed.selection.element()).is(srciSelector)) return html;
                            var body = new DOMParser().parseFromString(html, "text/html").querySelector("body");
                            return XenForo.htmlspecialchars($(body).text());
                        });
                    };
                    var helperSelector = "span.wysiwygSrciHelper";
                    var srciSelector = "code.wysiwygSrci";
                    //const magicSymbol = 'X'; // для отладки
                    var magicSymbol = "⁡";
                    // удаляет говно если оно не в конце строки
                    // если был совершен перенос, удаляет
                    // старое говно на предыдущей строке.
                    // актуально только для левого края SRCI
                    function prevFix($prev) {
                        if (!$prev.length) return;
                        if ($prev[0].nodeType !== Node.TEXT_NODE) {
                            if ($prev.is("br") && !firefox) prevFix($($prev[0].previousSibling));
                            return;
                        }
                        // <p>one<srci>code</srci>Xtwo<srci>code2</srci></p>
                        // чтобы не вычистить говно в 'Xtwo',
                        // если слева от него находится другой srci
                        var possibleSrci = $prev[0].previousSibling;
                        if (!$prev[0].data.endsWith(magicSymbol)) {
                            $prev[0].data = $prev[0].data.replaceAll(magicSymbol, "");
                        }
                        // возвращаем удалённое говно на своё место
                        if ($(possibleSrci).is(helperSelector) && (!firefox || $prev[0].data !== magicSymbol)) {
                            $prev[0].data = magicSymbol + $prev[0].data;
                        }
                    }
                    // true если только что было
                    // вырезано говно (через Backspace)
                    var afRemoved = false;
                    // предыдущий текст
                    var latestText = null;
                    // для лисы
                    var deletedSrci = null;
                    var firefox = navigator.userAgent.includes("Firefox");
                    return {
                        _init: _init,
                        insert: insert
                    };
                };
                FroalaEditor.PLUGINS.xfSpoiler = function(ed) {
                    var _allowTypingOnEdges = function _allowTypingOnEdges(e) {
                        var dt = ed.html.defaultTag();
                        var childs = ed.el.childNodes;
                        var offset = e.offsetY;
                        var el = ed.$el;
                        var insideHide = $(e.target).is("blockquote");
                        if (insideHide) {
                            childs = $(e.target.childNodes).filter(function(i, el) {
                                return el.nodeType !== Node.TEXT_NODE || el.nodeType === Node.TEXT_NODE && el.nodeValue !== "";
                            });
                            el = $(e.target);
                            offset = e.offsetY - getHeaderHeight(el);
                        }
                        if (e.target && e.target !== ed.el && !insideHide) {
                            return;
                        }
                        if (childs.length === 0) {
                            return;
                        }
                        if (childs[0].offsetHeight + childs[0].offsetTop <= offset || insideHide && offset >= childs[0].offsetHeight + 10) {
                            if ($(childs[childs.length - 1]).is("blockquote")) {
                                if (dt) {
                                    el.append("<".concat(dt, ">").concat(FroalaEditor.MARKERS, "<br></").concat(dt, ">"));
                                } else {
                                    el.append("".concat(FroalaEditor.MARKERS, "<br>"));
                                }
                                ed.selection.restore();
                                ed.keys.positionCaret();
                                return true;
                            }
                        } else if (offset <= 10) {
                            if ($(childs[0]).is("blockquote")) {
                                if (dt) {
                                    el.prepend("<".concat(dt, ">").concat(FroalaEditor.MARKERS, "<br></").concat(dt, ">"));
                                } else {
                                    el.prepend("".concat(FroalaEditor.MARKERS, "<br>"));
                                }
                                ed.selection.restore();
                                ed.keys.positionCaret();
                                return true;
                            }
                        }
                    };
                    var isEventInCloseButton = function isEventInCloseButton(e) {
                        var closeComputed = getComputedStyle(e.target, ":after");
                        return e.offsetX > parseFloat(closeComputed.left) && e.offsetX < parseFloat(closeComputed.width) + parseFloat(closeComputed.left) && e.offsetY > parseFloat(closeComputed.top) && e.offsetY < parseFloat(closeComputed.top) + parseFloat(closeComputed.height);
                    };
                    var removeSpoiler = function removeSpoiler($hide) {
                        if ($hide.next().is("p")) {
                            $hide.next().prepend(FroalaEditor.MARKERS);
                        } else if ($hide.prev().is("p")) {
                            $hide.prev().append(FroalaEditor.MARKERS);
                        } else {
                            $("<p><br></p>").prepend(FroalaEditor.MARKERS).insertAfter($hide);
                        }
                        $hide.remove();
                        ed.selection.restore();
                    };
                    var getHeaderHeight = function getHeaderHeight($spoiler) {
                        var headerComputed = getComputedStyle($spoiler[0], ":before");
                        var headerHeight = parseFloat(headerComputed.height) + parseFloat(headerComputed.paddingTop) + parseFloat(headerComputed.paddingBottom);
                        return headerHeight;
                    };
                    var _init = function _init() {
                        function checkInput() {
                            var focus = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                            ed.$el.find(".wysiwygSpoiler").each(function() {
                                var $spoiler = $(this);
                                if ($spoiler.attr("data-option")) {
                                    $spoiler.attr("data-option", $spoiler.attr("data-option").replace(/\u200b/g, "").replace(/^|$/g, "​").replace(/  /g, " \xa0").replace(/  /g, "\xa0 "));
                                }
                                var $div = $spoiler.find("div");
                                if ($div.length && $div.children().length === 1 && $div.find("input").length) {
                                    $div.replaceWith($div.find("input"));
                                }
                                var $input = $spoiler.find("> .wysiwygSpoilerInput");
                                if (!$input.length) {
                                    $spoiler.find(".wysiwygSpoilerInput").parentsUntil(":has(> *:not(.wysiwygSpoilerInput))").remove();
                                    $input = $('<input class="wysiwygSpoilerInput" contenteditable="false" style="width: '.concat($spoiler.width() - 10, 'px;" maxlength="95">')).prependTo($spoiler).val($spoiler.attr("data-option"));
                                    if ($spoiler.contents().length < 2) $("<br>").insertAfter($input);
                                }
                                if (!$spoiler.contents().first().hasClass("wysiwygSpoilerInput")) {
                                    $input.prependTo($spoiler);
                                    if (focus) $input.focus();
                                }
                            });
                        }
                        checkInput();
                        ed.events.on("html.set html.get", function() {
                            return checkInput();
                        });
                        ed.events.on("commands.undo commands.redo commands.after", function() {
                            checkInput();
                            ed.$el.find(".wysiwygSpoiler").each(function() {
                                var $spoiler = $(this);
                                var $input = $spoiler.find("> .wysiwygSpoilerInput");
                                $input.val($spoiler.data("option"));
                            });
                        });
                        ed.$el.on("change input keyup keydown paste", ".wysiwygSpoilerInput", function(e) {
                            var $quote = $(e.target.parentNode);
                            checkInput(true);
                            $quote.addClass("placeholder");
                            if (!e.target.value) {
                                $quote.attr("data-option", null);
                                $quote.addClass("placeholder");
                            } else {
                                $quote.attr("data-option", e.target.value.replace(/\u200b/g, "").replace(/^|$/g, "​").replace(/  /g, "\xa0 ").replace(/  /g, " \xa0"));
                                $quote.removeClass("placeholder");
                            }
                        });
                        ed.$el.on("click", ".wysiwygSpoiler", function(e) {
                            var $spoiler = $(e.target);
                            if (!$spoiler.is(".wysiwygSpoiler")) return;
                            var headerHeight = getHeaderHeight($spoiler);
                            if (e.offsetY < headerHeight) {
                                $spoiler.find(".wysiwygSpoilerInput").focus();
                            }
                        });
                        ed.events.on("html.get keydown", function() {
                            var _sel_anchorNode, _sel_anchorNode_classList;
                            var sel = ed.selection.get();
                            if (sel && sel.rangeCount > 0 && ((_sel_anchorNode = sel.anchorNode) === null || _sel_anchorNode === void 0 ? void 0 : (_sel_anchorNode_classList = _sel_anchorNode.classList) === null || _sel_anchorNode_classList === void 0 ? void 0 : _sel_anchorNode_classList.contains("wysiwygSpoiler"))) {
                                var _document_activeElement_classList;
                                var oldRange = sel.getRangeAt(0);
                                checkInput();
                                if (oldRange && oldRange.startOffset === oldRange.endOffset && sel.anchorOffset === 0 && !((_document_activeElement_classList = document1.activeElement.classList) === null || _document_activeElement_classList === void 0 ? void 0 : _document_activeElement_classList.contains("wysiwygSpoilerInput"))) {
                                    var range = document1.createRange();
                                    range.selectNodeContents(sel.anchorNode);
                                    range.collapse(false);
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                }
                            }
                        });
                        // override froala backspace behavior on hides
                        ed.events.on("keydown", function(e) {
                            var sel = ed.selection.get();
                            var spoiler = $(sel.anchorNode).parents(".wysiwygSpoiler").first();
                            checkInput();
                            if (e.target.classList.contains("wysiwygSpoilerInput")) return false;
                            if (!spoiler.length || e.keyCode !== 8 || !ed.selection.isCollapsed() || sel.anchorOffset !== 0 || sel.focusNode === document1) return;
                            // let possibleSpoiler = sel.anchorNode
                            // while (!$(possibleSpoiler).is('.wysiwygSpoiler')) {
                            //     if (possibleSpoiler && ($(possibleSpoiler).is('.fr-view') || possibleSpoiler.parentNode.firstChild !== possibleSpoiler)) return false
                            //     possibleSpoiler = possibleSpoiler.parentNode
                            // }
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            if (spoiler.parent("blockquote.wysiwygSpoiler").length && spoiler.parent().children().length === 1) {
                                spoiler.replaceWith($("<p><br></p>").prepend(FroalaEditor.MARKERS));
                                ed.selection.restore();
                            } else {
                                if (!$(ed.selection.blocks()[0]).closest("blockquote").first().is(spoiler)) {
                                    var $quote = $(ed.selection.blocks()[0]).closest("blockquote").first();
                                    $quote.replaceWith($($quote[0].innerHTML));
                                } else {
                                    if (this.xfHide.isEmpty(spoiler) && ed.selection.get().anchorOffset === 0) removeSpoiler(spoiler);
                                    else return;
                                }
                            }
                            return false;
                        }, true);
                        var beforeinput = null;
                        ed.events.on("input", function(e) {
                            if (!((ed.helpers.isMobile() && e.keyCode === undefined || e.keyCode === FroalaEditor.KEYCODE.IME) && e.originalEvent.inputType === "deleteContentBackward")) {
                                return;
                            }
                            var sel = ed.selection.get();
                            if (!$(sel.focusNode).is(beforeinput)) {
                                beforeinput = null;
                                return;
                            }
                            beforeinput = null;
                            var spoiler = $(sel.anchorNode).parents(".wysiwygSpoiler").first();
                            if (!spoiler.length || !ed.selection.isCollapsed() || sel.anchorOffset !== 0 || sel.focusNode === document1) return;
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            if (spoiler.parent("blockquote.wysiwygSpoiler").length && spoiler.parent().children().length === 1) {
                                spoiler.replaceWith($("<p><br></p>").prepend(FroalaEditor.MARKERS));
                                ed.selection.restore();
                            } else {
                                if (!$(ed.selection.blocks()[0]).closest("blockquote").first().is(spoiler)) {
                                    var $quote = $(ed.selection.blocks()[0]).closest("blockquote").first();
                                    $quote.replaceWith($($quote[0].innerHTML));
                                } else {
                                    if (this.xfHide.isEmpty(spoiler) && sel.anchorOffset === 0) removeSpoiler(spoiler);
                                    else return;
                                }
                            }
                        }, true);
                        ed.events.on("beforeinput", function(e) {
                            if (!((ed.helpers.isMobile() && e.keyCode === undefined || e.keyCode === FroalaEditor.KEYCODE.IME) && e.originalEvent.inputType === "deleteContentBackward")) {
                                return;
                            }
                            var sel = ed.selection.get();
                            var spoiler = $(sel.anchorNode).parents(".wysiwygSpoiler").first();
                            if (!spoiler.length || !ed.selection.isCollapsed() || sel.anchorOffset !== 0 || sel.focusNode === document1) return;
                            beforeinput = sel.focusNode;
                        }, true);
                        ed.events.on("click", _allowTypingOnEdges, true);
                    };
                    var insert = function insert() {
                        var replace = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}).replace;
                        var $quote = $('<blockquote class="wysiwygHide wysiwygSpoiler placeholder needOption ToggleTriggerAnchor bbCodeSpoilerContainer open">').attr("data-tag", "spoiler").attr("data-option", null).attr("data-default-option", ed.language.translate("Spoiler")).clone();
                        if (replace) {
                            var html = $quote.prop("outerHTML");
                            ed.$el.html(html) // мб тут всю фроалу разьебу, хз, вроде не должно))0
                            ;
                            ed.placeholder.refresh();
                        }
                        ed.selection.save();
                        ed.html.wrap(false, true, true);
                        ed.selection.restore();
                        var collapsed = ed.selection.isCollapsed();
                        ed.selection.save();
                        // чел который будет это фиксить после меня,
                        // лучше не надо, оставь как есть.
                        // ОНО ТЕБЯ СОЖРЕТ
                        var _ed_$el__querySelectorAll = editor_sliced_to_array(ed.$el[0].querySelectorAll(".fr-marker"), 2), startEl = _ed_$el__querySelectorAll[0], endEl = _ed_$el__querySelectorAll[1];
                        var startElParents = $(startEl).parents();
                        var endElParents = $(endEl).parents();
                        var mutualParent;
                        // поиск первого общего родительского элемента маркеров
                        mutualParentLoop: for(var i = 0; i < startElParents.length; i++)for(var j = 0; j < endElParents.length; j++)if (startElParents[i] === endElParents[j]) {
                            mutualParent = startElParents[i];
                            break mutualParentLoop;
                        }
                        // выношу маркеры наверх чтобы небыло ЕБУЧИХ ПУСТЫХ ЭЛЕМЕНТОВ
                        while(!startEl.previousSibling && startEl.parentElement && startEl.parentElement !== mutualParent)$(startEl).insertBefore(startEl.parentElement);
                        while(!endEl.nextSibling && endEl.parentElement && endEl.parentElement !== mutualParent)$(endEl).insertAfter(endEl.parentElement);
                        // рекурсивное удаление нод по краям до общего родителя
                        function removeNodes(root, until, fromStart, mutualParent) {
                            if (!root) return;
                            if (fromStart) {
                                while(root.childNodes.length){
                                    if (root.firstChild === until) break;
                                    root.firstChild.remove();
                                }
                            } else {
                                while(root.childNodes.length){
                                    if (root.lastChild === until) break;
                                    root.lastChild.remove();
                                }
                            }
                            if (root !== mutualParent) removeNodes(root.parentNode, root, fromStart, mutualParent);
                        }
                        var formatElementSelector = "p, span[style], s, strong, em";
                        var selection = mutualParent.cloneNode(true);
                        var node = mutualParent.parentNode;
                        while($(node.parentNode).is(formatElementSelector)){
                            node = node.parentNode;
                        }
                        if ($(node).is(formatElementSelector)) {
                            selection = node.cloneNode(true);
                        }
                        var _selection_querySelectorAll = editor_sliced_to_array(selection.querySelectorAll(".fr-marker"), 2), clonedStart = _selection_querySelectorAll[0], clonedEnd = _selection_querySelectorAll[1];
                        // обрезка selection по маркерам, с начала и с конца
                        removeNodes(clonedStart.parentNode, clonedStart, true, selection);
                        removeNodes(clonedEnd.parentNode, clonedEnd, false, selection);
                        $(selection).find(".fr-marker").remove();
                        var blockElementSelector = "div, blockquote, ol, li, ul";
                        if (!mutualParent.matches(blockElementSelector)) {
                            if (collapsed) {
                                $("<p><br></p>").prepend($(markerTemplate).attr("data-type", "true")).prepend($(markerTemplate).attr("data-type", "false")).appendTo($quote);
                            } else {
                                $(selection).prepend($(markerTemplate).attr("data-type", "true")).append($(markerTemplate).attr("data-type", "false")).appendTo($quote);
                            }
                        }
                        var afterSelection = mutualParent.cloneNode(true);
                        var afterNode = mutualParent.parentNode;
                        var $alignEl = $(mutualParent);
                        while($(afterNode.parentNode).is(formatElementSelector)){
                            afterNode = afterNode.parentNode;
                        }
                        var unwrapFormat = $(afterNode).is(formatElementSelector);
                        if (unwrapFormat) {
                            $alignEl = $(afterNode);
                            afterSelection = afterNode.cloneNode(true);
                        }
                        var _afterSelection_querySelectorAll = editor_sliced_to_array(afterSelection.querySelectorAll(".fr-marker"), 2), afterSelStart = _afterSelection_querySelectorAll[0], afterSelEnd = _afterSelection_querySelectorAll[1];
                        removeNodes(afterSelEnd.parentNode, afterSelEnd, true, afterSelection);
                        removeNodes(startEl.parentNode, startEl, false, mutualParent);
                        $(afterSelection).find(".fr-marker").remove();
                        $(mutualParent).find(".fr-marker").remove();
                        if (!mutualParent.matches(blockElementSelector)) {
                            function isEmptyParagraph(el) {
                                if (el.matches(blockElementSelector)) return false;
                                if (!el.childNodes.length) return true;
                                return el.childNodes.length === 1 && el.childNodes[0].matches && el.childNodes[0].matches("br");
                            }
                            if ($alignEl.is("p")) {
                                $quote.attr("data-align", $alignEl.css("text-align") || "left");
                            }
                            if (unwrapFormat) {
                                removeNodes(mutualParent.parentNode, mutualParent, false, afterNode);
                                $quote.insertAfter($alignEl);
                            } else {
                                $quote.insertAfter(mutualParent);
                            }
                            if (isEmptyParagraph(mutualParent)) mutualParent.remove();
                            if (!isEmptyParagraph(afterSelection)) $(afterSelection).insertAfter($quote);
                        } else {
                            // а для блоков просто вставка селекшона в него
                            $quote.append($(selection).children()).prepend(FroalaEditor.START_MARKER).append(FroalaEditor.END_MARKER).appendTo(mutualParent);
                            $(afterSelection).children().insertAfter($quote);
                        }
                        ed.html.unwrap();
                        ed.selection.restore();
                        ed.placeholder.refresh();
                        $quote.children("p:empty").remove();
                        if ($quote.parent().is("ol, ul")) {
                            $quote.find("li").wrapAll("<".concat($quote.parent().prop("tagName"), ">"));
                            var content = $quote.parent().html();
                            $quote.parent().replaceWith(content);
                            // ищем если селекшн разъебался и остались пустые li без ol
                            ed.$el.find("li").each(function() {
                                var hasChildren = $(this).children(":not(br)").length;
                                if (!$(this).parent("ol, ul").length && !hasChildren) {
                                    $(this).remove();
                                }
                            });
                        }
                        var $input = $('<input class="wysiwygSpoilerInput" contenteditable="false" style="width: '.concat($quote.width() - 10, 'px;" maxlength="95">')).prependTo($quote);
                        $input.click();
                        $input.focus();
                        $input[0].selectionStart = $input[0].selectionEnd = $input.val().length;
                    };
                    var markerTemplate = '<span class="fr-marker" data-id="0" style="display: none; line-height: 0;">​</span>';
                    var updateInput = null;
                    return {
                        _init: _init,
                        insert: insert
                    };
                };
                // ctrl+c ctrl+v again
                FroalaEditor.PLUGINS.xfCensor = function(ed) {
                    var isEmptyParagraph = function isEmptyParagraph(el) {
                        if (el.matches(blockElementSelector)) return false;
                        if (!el.childNodes.length) return true;
                        return el.childNodes.length === 1 && el.childNodes[0].matches && (el.childNodes[0].matches("br") || el.childNodes[0].classList && el.childNodes[0].classList.contains("fr-marker"));
                    };
                    var _allowTypingOnEdges = function _allowTypingOnEdges(e) {
                        var dt = ed.html.defaultTag();
                        var childs = ed.el.childNodes;
                        var offset = e.offsetY;
                        var el = ed.$el;
                        var insideHide = $(e.target).is(".wysiwygCensorSpoiler");
                        if (insideHide) {
                            childs = $(e.target.childNodes).filter(function(i, el) {
                                return el.nodeType !== Node.TEXT_NODE || el.nodeType === Node.TEXT_NODE && el.nodeValue !== "";
                            });
                            el = $(e.target);
                            offset = e.offsetY;
                        }
                        if (e.target && e.target !== ed.el && !insideHide) {
                            return;
                        }
                        if (childs.length === 0) {
                            return;
                        }
                        if (childs[0].offsetHeight + childs[0].offsetTop <= offset || insideHide && offset >= childs[0].offsetHeight + 10) {
                            if ($(childs[childs.length - 1]).is(".wysiwygCensorSpoiler")) {
                                if (dt) {
                                    el.append("<".concat(dt, ">").concat(FroalaEditor.MARKERS, "<br></").concat(dt, ">"));
                                } else {
                                    el.append("".concat(FroalaEditor.MARKERS, "<br>"));
                                }
                                ed.selection.restore();
                                ed.keys.positionCaret();
                                return true;
                            }
                        } else if (offset <= 10) {
                            if ($(childs[0]).is(".wysiwygCensorSpoiler")) {
                                if (dt) {
                                    el.prepend("<".concat(dt, ">").concat(FroalaEditor.MARKERS, "<br></").concat(dt, ">"));
                                } else {
                                    el.prepend("".concat(FroalaEditor.MARKERS, "<br>"));
                                }
                                ed.selection.restore();
                                ed.keys.positionCaret();
                                return true;
                            }
                        }
                    };
                    var _init = function _init() {
                        ed.events.on("click", _allowTypingOnEdges);
                        ed.events.on("keydown", function(e) {
                            if (e.keyCode === 13 && e.shiftKey) {
                                var selection = ed.selection.get();
                                var censor;
                                if (!selection.anchorNode) {
                                    return;
                                }
                                if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
                                    censor = selection.anchorNode.parentElement;
                                } else {
                                    censor = selection.anchorNode;
                                }
                                if (!$(censor).is(".wysiwygCensorSpoiler")) {
                                    return;
                                }
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                var previousSibling = $(censor.previousSibling);
                                if (previousSibling.is("br") && previousSibling.prev().is(".wysiwygCensorSpoiler")) {
                                    var $beforeCensor = previousSibling.prev();
                                    // дальше идет ебейший костыль
                                    // при попытке аппендить один br, он воспринимается как пустота(что в целом логично для фроалы)
                                    // но если иметь br всегда в конце цензуры и аппендить еще один, другой просто пропадет
                                    // и переноса не будет, поэтому вставляем два бра
                                    $beforeCensor.append("<br>").append(FroalaEditor.MARKERS).append($(censor).html().replace("&nbsp;", ""));
                                    previousSibling.remove();
                                    $(censor).remove();
                                    ed.selection.restore();
                                }
                                return false;
                            }
                        });
                    };
                    var insert = function insert() {
                        var $censor = $('<span class="wysiwygCensorSpoiler">');
                        ed.selection.save();
                        ed.html.wrap(false, true, true);
                        ed.selection.restore();
                        var collapsed = ed.selection.isCollapsed();
                        ed.selection.save();
                        var _ed_$el__querySelectorAll = editor_sliced_to_array(ed.$el[0].querySelectorAll(".fr-marker"), 2), startEl = _ed_$el__querySelectorAll[0], endEl = _ed_$el__querySelectorAll[1];
                        var startElParents = $(startEl).parents();
                        var endElParents = $(endEl).parents();
                        var mutualParent;
                        // поиск первого общего родительского элемента маркеров
                        mutualParentLoop: for(var i = 0; i < startElParents.length; i++)for(var j = 0; j < endElParents.length; j++)if (startElParents[i] === endElParents[j]) {
                            mutualParent = startElParents[i];
                            break mutualParentLoop;
                        }
                        // выношу маркеры наверх чтобы небыло ЕБУЧИХ ПУСТЫХ ЭЛЕМЕНТОВ
                        while(!startEl.previousSibling && startEl.parentElement && startEl.parentElement !== mutualParent)$(startEl).insertBefore(startEl.parentElement);
                        while(!endEl.nextSibling && endEl.parentElement && endEl.parentElement !== mutualParent)$(endEl).insertAfter(endEl.parentElement);
                        function removeNodes(root, until, fromStart, mutualParent) {
                            if (!root) return;
                            if (fromStart) {
                                while(root.childNodes.length){
                                    if (root.firstChild === until) break;
                                    root.firstChild.remove();
                                }
                            } else {
                                while(root.childNodes.length){
                                    if (root.lastChild === until) break;
                                    root.lastChild.remove();
                                }
                            }
                            if (root !== mutualParent) removeNodes(root.parentNode, root, fromStart, mutualParent);
                        }
                        var selection = mutualParent.cloneNode(true);
                        var node = mutualParent.parentNode;
                        while($(node.parentNode).is(formatElementSelector)){
                            node = node.parentNode;
                        }
                        if ($(node).is(formatElementSelector)) {
                            selection = node.cloneNode(true);
                        }
                        var _selection_querySelectorAll = editor_sliced_to_array(selection.querySelectorAll(".fr-marker"), 2), clonedStart = _selection_querySelectorAll[0], clonedEnd = _selection_querySelectorAll[1];
                        // обрезка selection по маркерам, с начала и с конца
                        removeNodes(clonedStart.parentNode, clonedStart, true, selection);
                        removeNodes(clonedEnd.parentNode, clonedEnd, false, selection);
                        $(selection).find(".fr-marker").remove();
                        if (!mutualParent.matches(blockElementSelector)) {
                            if (collapsed) {
                                $censor.text(" ").prepend($(markerTemplate).attr("data-type", "true")).prepend($(markerTemplate).attr("data-type", "false")).append("<br/>");
                            } else {
                                $(selection).prepend($(markerTemplate).attr("data-type", "true")).append($(markerTemplate).attr("data-type", "false"));
                                $censor.append($(selection).html());
                            }
                        // один из маркеров находится за пределами тега, поэтому общий родитель - fr-element
                        // игнорим в таком случае и аппендим все что есть в селекшене
                        } else if (mutualParent.matches(".fr-element")) {
                            $(selection).prepend($(markerTemplate).attr("data-type", "true")).append($(markerTemplate).attr("data-type", "false"));
                            $censor.append($(selection).html());
                        }
                        var afterSelection = mutualParent.cloneNode(true);
                        var afterNode = mutualParent.parentNode;
                        while($(afterNode.parentNode).is(formatElementSelector)){
                            afterNode = afterNode.parentNode;
                        }
                        var _afterSelection_querySelectorAll = editor_sliced_to_array(afterSelection.querySelectorAll(".fr-marker"), 2), afterSelEnd = _afterSelection_querySelectorAll[1];
                        removeNodes(afterSelEnd.parentNode, afterSelEnd, true, afterSelection);
                        removeNodes(startEl.parentNode, startEl, false, mutualParent);
                        if (!mutualParent.matches(blockElementSelector)) {
                            $(mutualParent).after($censor);
                            if (isEmptyParagraph(mutualParent)) {
                                $(mutualParent).remove();
                            } else {
                                $(mutualParent).find(".fr-marker").first().after($censor);
                            }
                            if (!isEmptyParagraph(afterSelection)) {
                                afterSelection = $(afterSelection).html();
                                $censor.after(afterSelection);
                            }
                        } else {
                            $censor.prepend(FroalaEditor.START_MARKER).append(FroalaEditor.END_MARKER).appendTo(mutualParent);
                            afterSelection = $(afterSelection).html();
                            $censor.after(afterSelection);
                        }
                        $(afterSelection).find(".fr-marker").remove();
                        $(mutualParent).find(".fr-marker").remove();
                        // cleaning p tags in censor
                        $censor.find("p").each(function() {
                            if ($(this).parent().is(".wysiwygCensorSpoiler")) {
                                $(this).replaceWith($(this).html() + "<BR>");
                            }
                        });
                        ed.html.unwrap();
                        ed.selection.restore();
                        ed.placeholder.refresh();
                        // https://zelenka.guru/threads/6763255/
                        if (!mutualParent.matches(blockElementSelector) && collapsed) {
                            var nodes = $censor.get(0).childNodes;
                            if (!nodes.length) {
                                return;
                            }
                            var textNode = nodes[0];
                            var range = new Range();
                            range.setStart(textNode, 1);
                            range.setEnd(textNode, 1);
                            ed.selection.clear();
                            ed.selection.get().addRange(range);
                        }
                    };
                    var markerTemplate = '<span class="fr-marker" data-id="0" style="display: none; line-height: 0;">​</span>';
                    var formatElementSelector = "p, span[style], s, strong, em";
                    var blockElementSelector = "div, blockquote, ol, li, ul";
                    return {
                        _init: _init,
                        insert: insert
                    };
                };
                FroalaEditor.PLUGINS.xfAlign = function(ed) {
                    var _init = function _init() {
                        ed.events.on("commands.after", function(cmd) {
                            var commands = {
                                "alignLeft": "left",
                                "alignRight": "right",
                                "alignCenter": "center"
                            };
                            if (commands[cmd] === undefined) return;
                            var align = commands[cmd];
                            var selection = ed.selection.get();
                            if (selection.rangeCount === 0) return;
                            ed.$el.find(".wysiwygSpoilerInput, .wysiwygHide").each(function() {
                                if (selection.containsNode(this) || selection.anchorNode === this) {
                                    var $this = $(this);
                                    var $spoiler = $this.is(".wysiwygHide") ? $this : $this.parent(".wysiwygHide");
                                    $spoiler.attr("data-align", align);
                                }
                            });
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.POPUP_TEMPLATES["xfHide.edit"] = "[_CONTENT_]";
                FroalaEditor.POPUP_TEMPLATES["xfSpoiler.edit"] = "[_CONTENT_]";
                FroalaEditor.MODULES.tooltip = function(ed) {
                    var registerTippy = function registerTippy(el, above) {
                        if (XenForo.isTouchBrowser()) return;
                        if (commandsUsingTippy.includes($(el).data("cmd"))) return;
                        if (elToTooltips.has(el)) return elToTooltips.get(el);
                        var zIndex;
                        if (ed.$el.hasClass(".fr-fullscreen-wrapper") || ed.$el.closest(".xenOverlay")) zIndex = 11111;
                        else zIndex = 9999;
                        var tooltip = XenForo.tippy(el, {
                            content: el.getAttribute("title"),
                            placement: above ? "bottom" : "top",
                            zIndex: zIndex,
                            boundary: "window"
                        });
                        el.removeAttribute("title");
                        elToTooltips.set(el, tooltip);
                        tooltips.push(tooltip);
                        return tooltip;
                    };
                    var commandsUsingTippy = [
                        "xfSmilie",
                        "lztTemplate",
                        "xfInsertGif"
                    ];
                    var elToTooltips = new WeakMap();
                    var tooltips = [];
                    return {
                        bind: function($parent, selector, above) {
                            var $els = $parent.find(selector);
                            for(var i = 0; i < $els.length; i++)registerTippy($els[i], above);
                        },
                        to: function($el, above) {
                            for(var i = 0; i < $el.length; i++)registerTippy($el[i], above);
                        },
                        hide: function() {
                            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            try {
                                for(var _iterator = tooltips[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                    var tooltip = _step.value;
                                    tooltip.hide();
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                        }
                    };
                };
                FroalaEditor.MODULES.video = function(ed) {
                    var _init = function _init() {
                        uploadMask = ed.$box.closest(".defEditor").find(".UploadMask");
                        ed.events.on("html.get", function(html) {
                            // Yandex Browser inject their user-script and this leads to infinite loop in some cases
                            // https://zelenka.guru/threads/6193434/
                            if (new Error().stack.includes("user-script:")) {
                                return "";
                            }
                            var parser = new DOMParser();
                            var $doc = $(parser.parseFromString(html, "text/html"));
                            $doc.find(".fr-lzt-media").replaceWith(function() {
                                var $el = $(this);
                                var mediaType = XenForo.htmlspecialchars($el.data("lztMediaType"));
                                var mediaData = XenForo.htmlspecialchars($el.data("lztMediaData"));
                                return "[MEDIA=".concat(mediaType, "]").concat(mediaData, "[/MEDIA]");
                            });
                            return $doc.find("body").html();
                        });
                    };
                    var setProgress = function setProgress() {
                        var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, type = _ref.type, _ref_value = _ref.value, value = _ref_value === void 0 ? null : _ref_value;
                        if (!uploadMask) return;
                        var progressString = ed.language.translate(messages[type]);
                        if (value !== null) progressString += " ".concat(Math.round(value * 100), "%");
                        uploadMask.find(".text").text(progressString);
                    };
                    var messages = {
                        initializing: "Initializing",
                        uploading: "Uploading video",
                        processing: "Processing"
                    };
                    var uploadMask = null;
                    function upload(file) {
                        return _upload.apply(this, arguments);
                    }
                    function _upload() {
                        _upload = editor_async_to_generator(function(file) {
                            var calledFromPopup, textBefore, uploaded, err;
                            var _arguments = arguments;
                            return editor_ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        calledFromPopup = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : false;
                                        ed.undo.saveStep();
                                        if (!calledFromPopup) ed.selection.save();
                                        ed.edit.off();
                                        ed.events.enableBlur();
                                        uploadMask.removeClass("hidden");
                                        textBefore = uploadMask.find(".text").text();
                                        setProgress({
                                            type: "initializing"
                                        });
                                        _state.label = 1;
                                    case 1:
                                        _state.trys.push([
                                            1,
                                            3,
                                            4,
                                            5
                                        ]);
                                        return [
                                            4,
                                            uploadFile(file, setProgress)
                                        ];
                                    case 2:
                                        uploaded = _state.sent();
                                        return [
                                            3,
                                            5
                                        ];
                                    case 3:
                                        err = _state.sent();
                                        ed.selection.clear();
                                        uploadMask.addClass("hidden");
                                        uploadMask.find(".text").text(textBefore);
                                        XenForo.alert(ed.language.translate("Failed to upload image to server. Please, try again later.") + "<br>" + XenForo.htmlspecialchars(err.message || err));
                                        return [
                                            2
                                        ];
                                    case 4:
                                        ed.events.disableBlur();
                                        ed.edit.on();
                                        return [
                                            7
                                        ];
                                    case 5:
                                        insertFix(ed, true);
                                        Lolzteam.EditorHelpers.focus(ed);
                                        ed.selection.restore();
                                        ed.html.insert('<span\n                            contenteditable="false"\n                            draggable="true"\n                            class="fr-lzt-media fr-jiv fr-video fr-deletable"\n                            data-lzt-media-type="cdn"\n                            data-lzt-media-data="'.concat(XenForo.htmlspecialchars(uploaded.key), '">\n                            <video\n                                src="').concat(XenForo.htmlspecialchars(uploaded.url), '"\n                                style="margin: 5px; max-width: 540px; max-height: 310px"\n                                controls/>\n                        </span><p></p>'));
                                        ed.selection.save();
                                        uploadMask.addClass("hidden");
                                        uploadMask.find(".text").text(textBefore);
                                        ed.undo.saveStep();
                                        Lolzteam.EditorHelpers.normalizeAfterInsert(ed);
                                        ed.selection.restore();
                                        return [
                                            2
                                        ];
                                }
                            });
                        });
                        return _upload.apply(this, arguments);
                    }
                    return {
                        _init: _init,
                        upload: upload
                    };
                };
                FroalaEditor.MODULES.pdf = function(ed) {
                    var _init = function _init() {
                        uploadMask = ed.$box.closest(".defEditor").find(".UploadMask");
                    };
                    var setProgress = function setProgress() {
                        var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, type = _ref.type, _ref_value = _ref.value, value = _ref_value === void 0 ? null : _ref_value;
                        if (!uploadMask) return;
                        var progressString = ed.language.translate(messages[type]);
                        if (value !== null) progressString += " ".concat(Math.round(value * 100), "%");
                        uploadMask.find(".text").text(progressString);
                    };
                    var messages = {
                        initializing: "Initializing",
                        uploading: "Uploading document",
                        processing: "Processing"
                    };
                    var uploadMask = null;
                    function upload(file) {
                        return _upload.apply(this, arguments);
                    }
                    function _upload() {
                        _upload = editor_async_to_generator(function(file) {
                            var calledFromPopup, textBefore, uploaded, err;
                            var _arguments = arguments;
                            return editor_ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        calledFromPopup = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : false;
                                        ed.undo.saveStep();
                                        if (!calledFromPopup) ed.selection.save();
                                        ed.edit.off();
                                        ed.events.enableBlur();
                                        uploadMask.removeClass("hidden");
                                        textBefore = uploadMask.find(".text").text();
                                        setProgress({
                                            type: "initializing"
                                        });
                                        _state.label = 1;
                                    case 1:
                                        _state.trys.push([
                                            1,
                                            3,
                                            4,
                                            5
                                        ]);
                                        return [
                                            4,
                                            uploadFile(file, setProgress)
                                        ];
                                    case 2:
                                        uploaded = _state.sent();
                                        return [
                                            3,
                                            5
                                        ];
                                    case 3:
                                        err = _state.sent();
                                        ed.selection.clear();
                                        uploadMask.addClass("hidden");
                                        uploadMask.find(".text").text(textBefore);
                                        XenForo.alert(ed.language.translate("Failed to upload document to server. Please, try again later.") + "<br>" + XenForo.htmlspecialchars(err.message || err));
                                        return [
                                            2
                                        ];
                                    case 4:
                                        ed.events.disableBlur();
                                        ed.edit.on();
                                        return [
                                            7
                                        ];
                                    case 5:
                                        insertFix(ed, true);
                                        Lolzteam.EditorHelpers.focus(ed);
                                        ed.selection.restore();
                                        ed.html.insert(uploaded.url);
                                        ed.selection.save();
                                        uploadMask.addClass("hidden");
                                        uploadMask.find(".text").text(textBefore);
                                        ed.undo.saveStep();
                                        Lolzteam.EditorHelpers.normalizeAfterInsert(ed);
                                        return [
                                            2
                                        ];
                                }
                            });
                        });
                        return _upload.apply(this, arguments);
                    }
                    return {
                        _init: _init,
                        upload: upload
                    };
                };
                FroalaEditor.POPUP_TEMPLATES["video.upload"] = "[_PROGRESS_BAR_]";
                FroalaEditor.MODULES.lztSmiliePasteFix = function(ed) {
                    var _init = function _init() {
                        ed.events.on("paste.beforeCleanup", function(html) {
                            var body = new DOMParser().parseFromString(html, "text/html").querySelector("body");
                            var els = body.querySelectorAll("*");
                            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            try {
                                for(var _iterator = els[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                    var el = _step.value;
                                    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                    try {
                                        for(var _iterator1 = (el === null || el === void 0 ? void 0 : el.attributes)[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                            var attr = _step1.value;
                                            if (attr === null || attr === void 0 ? void 0 : attr.name.startsWith("on")) {
                                                el === null || el === void 0 ? void 0 : el.removeAttribute(attr.name);
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError1 = true;
                                        _iteratorError1 = err;
                                    } finally{
                                        try {
                                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                                _iterator1.return();
                                            }
                                        } finally{
                                            if (_didIteratorError1) {
                                                throw _iteratorError1;
                                            }
                                        }
                                    }
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                            $(body).find("*").each(function() {
                                $.each(this.attributes, function() {
                                    if (this.specified) {
                                        this.value = XenForo.htmlspecialchars(this.value);
                                    }
                                });
                            });
                            var smilies = $(body).find("img.mceSmilie");
                            smilies.replaceWith(function() {
                                return $("<span>&#8203;</span>").hide().addClass("lzt-fr-smilie").attr("data-alt", $(this).attr("alt")).attr("data-src", $(this).attr("src")).attr("data-title", $(this).attr("title")).attr("data-lzt-smilie", "1");
                            });
                            return body.innerHTML;
                        });
                        ed.events.on("contentChanged", function() {
                            var pasted = ed.$el.find("smilie#isPasted, smilie:not(.fr-deletable[contenteditable])");
                            pasted.each(function(index, el) {
                                $(el).addClass("fr-deletable").attr("contenteditable", "false").removeAttr("id");
                            });
                            var smilies = $(ed.$el[0]).find("span[data-lzt-smilie]");
                            if (!smilies.length) return;
                            ed.selection.save();
                            smilies.replaceWith(function() {
                                var smilieImg = $('<img class="mceSmilie fr-fic">').attr("alt", $(this).data("alt")).attr("src", $(this).data("src")).attr("title", $(this).data("title")).attr("data-smilie", "yes").attr("alt", $(this).data("alt"));
                                if ($(this).find(".fr-marker").length === 2) smilieImg = smilieImg.add(FroalaEditor.MARKERS);
                                return smilieImg;
                            });
                            ed.selection.restore();
                            ed.placeholder.refresh();
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.MODULES.lztSmiliePopupFix = function(ed) {
                    var _init = function _init() {
                        ed.popups.onShow("image.edit", function() {
                            ed.popups.get("image.edit").find(hiddenSmilieButtons).css("display", ed.image.get().is(".mceSmilie") ? "none" : null);
                        });
                    };
                    var hiddenSmilieButtons = "#imageSize-".concat(ed.id, ", #imageAlt-").concat(ed.id, ", #imageReplace-").concat(ed.id, ", #insertLink-").concat(ed.id);
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.MODULES.noPTagFix = function(ed) {
                    var _init = function _init() {
                        ed.events.on("input", function(e) {
                            if ([
                                "deleteContentBackward",
                                "deleteContentForward"
                            ].includes(e.originalEvent.inputType)) {
                                if (ed.$el.find("p, blockquote").length < 1) {
                                    ed.$el.children("br").remove();
                                    ed.$el.find(".fr-marker").remove();
                                    ed.$el.append("<p>".concat(FroalaEditor.MARKERS, "<br/></p>"));
                                    ed.selection.restore();
                                    ed.placeholder.refresh();
                                }
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.MODULES.lztDropMask = function(ed) {
                    var _init = function _init() {
                        $form.on("dragenter", function(e) {
                            var _e_originalEvent, _e_originalEvent_dataTransfer;
                            if (e === null || e === void 0 ? void 0 : (_e_originalEvent = e.originalEvent) === null || _e_originalEvent === void 0 ? void 0 : (_e_originalEvent_dataTransfer = _e_originalEvent.dataTransfer) === null || _e_originalEvent_dataTransfer === void 0 ? void 0 : _e_originalEvent_dataTransfer.types.includes("Files")) $mask.removeClass("hidden");
                        }).on("dragleave", function(e) {
                            if (!$(e.relatedTarget).closest($form).length) $mask.addClass("hidden");
                        });
                        ed.events.on("paste.before", function(e) {
                            var _e_clipboardData, _e_clipboardData_files;
                            if (!(e === null || e === void 0 ? void 0 : (_e_clipboardData = e.clipboardData) === null || _e_clipboardData === void 0 ? void 0 : (_e_clipboardData_files = _e_clipboardData.files) === null || _e_clipboardData_files === void 0 ? void 0 : _e_clipboardData_files.length)) return;
                            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            try {
                                for(var _iterator = e.clipboardData.files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                    var file = _step.value;
                                    if (file.type.startsWith("video")) {
                                        ed.video.upload(file);
                                    } else if (file.type.startsWith("image")) {
                                        ed.image.upload([
                                            file
                                        ]);
                                    } else if (file.type === "application/pdf") {
                                        ed.pdf.upload(file);
                                    }
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                            return false;
                        }, true);
                        $mask.on("drop", function(e) {
                            var _e_originalEvent, _e_originalEvent_dataTransfer, _e_originalEvent_dataTransfer_files;
                            e.preventDefault();
                            if (!(e === null || e === void 0 ? void 0 : (_e_originalEvent = e.originalEvent) === null || _e_originalEvent === void 0 ? void 0 : (_e_originalEvent_dataTransfer = _e_originalEvent.dataTransfer) === null || _e_originalEvent_dataTransfer === void 0 ? void 0 : (_e_originalEvent_dataTransfer_files = _e_originalEvent_dataTransfer.files) === null || _e_originalEvent_dataTransfer_files === void 0 ? void 0 : _e_originalEvent_dataTransfer_files.length)) return;
                            var images = [];
                            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            try {
                                for(var _iterator = e.originalEvent.dataTransfer.files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                    var file = _step.value;
                                    if (file.type.startsWith("image")) {
                                        images.push(file);
                                    } else if (file.type.startsWith("video")) {
                                        ed.video.upload(file);
                                    } else if (file.type === "application/pdf") {
                                        ed.pdf.upload(file);
                                    }
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                            ed.image.upload(images);
                            $mask.addClass("hidden");
                        }).on("dragover", function(e) {
                            e.preventDefault();
                        });
                        //https://zelenka.guru/threads/6201510/
                        ed.events.on("drop", function(e) {
                            if (!$mask.hasClass("hidden")) {
                                $mask.addClass("hidden");
                            }
                        });
                        ed.events.on("codeView.update", function(e) {
                            if (!ed.fullscreen.isActive() && !$mask.hasClass("hidden")) {
                                $mask.addClass("hidden");
                            }
                        });
                    };
                    var $form = $(ed.$box[0]).closest("form");
                    var $mask = $form.find(".DropMask");
                    var $textarea = $(ed.$el);
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.MODULES.lztColorPreview = function(ed) {
                    var setColor = function setColor(color) {
                        ed.selection.restore();
                        ed.selection.save();
                        var $el = $(ed.selection.element());
                        if ($el.parent().is(".wysiwygSrci")) {
                            ed.$el.find(".fr-marker").remove();
                            return false;
                        }
                        if (color === "REMOVE" || !color) {
                            ed.format.removeStyle("color");
                        } else {
                            if (!color) {
                                ed.$el.find(".fr-marker").remove();
                                return false;
                            }
                            ed.format.applyStyle("color", ed.helpers.HEXtoRGB(color));
                        }
                        ed.selection.save();
                        ed.selection.clear();
                        // вычищаем &ZeroWidthSpace;
                        var html = ed.html.get(true);
                        html = html.replaceAll(/\u200B/g, "");
                        ed.html.set(html);
                        return true;
                    };
                    var bindPopupHandlers = function bindPopupHandlers() {
                        if (handlersBound) return;
                        handlersBound = true;
                        var popup = ed.popups.get("textColor.picker");
                        var colorButtons = popup.find(".fr-color-set > .fr-select-color");
                        var colorInput = popup.find("#fr-color-hex-layer-text-".concat(ed.id));
                        var closeButton = popup.find(".fr-submit");
                        colorButtons.on("mouseleave", function(e) {
                            if (popupShown && snapshot) ed.snapshot.restore(snapshot);
                        });
                        colorButtons.on("mouseenter", function(e) {
                            if (popupShown && $(this).length) {
                                // ed.snapshot.restore(snapshot)
                                setColor($(this).data("param1"));
                            }
                        });
                        colorButtons.on("click", function() {
                            // ed.snapshot.restore(snapshot)
                            isColorChanged = setColor($(this).data("param1"));
                        });
                        colorButtons.on("touchstart", function() {
                            // ed.snapshot.restore(snapshot)
                            isColorChanged = setColor($(this).data("param1"));
                        });
                        closeButton.on("click", function(e) {
                            ed.snapshot.restore(snapshot);
                            isColorChanged = setColor(colorInput.val());
                            ed.selection.restore();
                        });
                        function overrideFunc(original, handler) {
                            return function() {
                                handler.apply(this, arguments);
                                return original.apply(this, arguments);
                            };
                        }
                        ed.colors.text = overrideFunc(ed.colors.text, function() {
                        // isColorChanged = true
                        });
                        ed.colors.customColor = overrideFunc(ed.colors.customColor, function() {
                        // isColorChanged = true
                        });
                    };
                    var _init = function _init() {
                        ed.popups.onShow("textColor.picker", function() {
                            popupShown = true;
                            snapshot = ed.snapshot.get();
                            isColorChanged = false;
                            bindPopupHandlers();
                        });
                        ed.popups.onHide("textColor.picker", function() {
                            popupShown = false;
                            if (!isColorChanged) {
                                ed.snapshot.restore(snapshot);
                            }
                            ed.selection.restore();
                        });
                    };
                    var snapshot = null;
                    var handlersBound = false;
                    var isColorChanged = false;
                    var popupShown = false;
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.MODULES.lztTippyDropdowns = function(ed) {
                    var onCommandClick = function onCommandClick(e) {
                        var $btn = $(this);
                        var cmd = $btn.data("cmd");
                        var params = [];
                        while(typeof $btn.data("param".concat(params.length + 1)) !== "undefined"){
                            params.push($btn.data("param".concat(params.length + 1)));
                        }
                        $(this).data("lzt-fe-dropdown")._tippy.hide();
                        ed.commands.exec(cmd, params);
                    };
                    var _init = function _init() {
                        ed.$tb.find(".fr-dropdown").each(function() {
                            var $content = $("#" + $(this).attr("aria-controls")).find(".fr-dropdown-content").detach().addClass("fr-lzt-tippy-dropdown");
                            $content.find(".fr-command").data("lzt-fe-dropdown", this).on("click", onCommandClick);
                            var zIndex;
                            if (ed.$el.hasClass(".fr-fullscreen-wrapper") || ed.$el.closest(".xenOverlay")) zIndex = 11111;
                            else zIndex = 9999;
                            XenForo.tippy(this, {
                                content: $content[0],
                                distance: 0,
                                trigger: "click",
                                multiple: true,
                                maxWidth: 99999,
                                zIndex: zIndex,
                                hideOnClick: true,
                                boundary: "window",
                                onShow: function() {
                                    ed.selection.save();
                                    if (ed.helpers.isIOS()) {
                                        ed.selection.clear();
                                    }
                                    ed.events.disableBlur();
                                    if (!focusListener) {
                                        focusListener = function(e) {
                                            e.stopPropagation();
                                        };
                                        window1.addEventListener("mousedown", focusListener, true);
                                    }
                                },
                                onHide: function() {
                                    ed.events.enableBlur();
                                    ed.selection.restore();
                                    Lolzteam.EditorHelpers.focus(ed);
                                    if (focusListener) {
                                        window1.removeEventListener("mousedown", focusListener, true);
                                        focusListener = null;
                                    }
                                }
                            }, "popup");
                        });
                    };
                    var focusListener = null;
                    return {
                        _init: _init
                    };
                };
                if (!FroalaEditor.LZT_ORIGINAL_MODULES) FroalaEditor.LZT_ORIGINAL_MODULES = {
                    popups: FroalaEditor.MODULES.popups,
                    node: FroalaEditor.MODULES.node,
                    cursor: FroalaEditor.MODULES.cursor,
                    events: FroalaEditor.MODULES.events
                };
                if (!FroalaEditor.LZT_ORIGINAL_PLUGINS) FroalaEditor.LZT_ORIGINAL_PLUGINS = {
                    image: FroalaEditor.PLUGINS.image
                };
                // fix for position: relative and overflow: hidden toolbar
                FroalaEditor.MODULES.popups = function(ed) {
                    var _init = function _init() {
                        container = ed.$('<div style="position: absolute">');
                        ed.$(ed.$box).append(container);
                        return original._init();
                    };
                    var setContainer = function setContainer(id, $container) {
                        if ($container.is(".fr-toolbar")) $container = container;
                        return original.setContainer(id, $container);
                    };
                    var original = FroalaEditor.LZT_ORIGINAL_MODULES.popups(ed);
                    var container;
                    return _object_spread_props(editor_object_spread({}, original), {
                        _init: _init,
                        setContainer: setContainer
                    });
                };
                // fixes for wysiwyg hides
                FroalaEditor.MODULES.node = function(ed) {
                    var deepestParent = function deepestParent(node) {
                        var until = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], simple_enter = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
                        until.push(ed.el);
                        if (until.indexOf(node.parentNode) >= 0 || node.parentNode && ed.node.hasClass(node.parentNode, "fr-inner") || node.parentNode && ed.node.hasClass(node.parentNode, "wysiwygHide") || node.parentNode && FroalaEditor.SIMPLE_ENTER_TAGS.indexOf(node.parentNode.tagName) >= 0 && simple_enter) {
                            return null;
                        }
                        while(until.indexOf(node.parentNode) < 0 && node.parentNode && !ed.node.hasClass(node.parentNode, "fr-inner") && (FroalaEditor.SIMPLE_ENTER_TAGS.indexOf(node.parentNode.tagName) < 0 || !simple_enter) && !(original.isBlock(node) && !original.isBlock(node.parentNode)) && (!(original.isBlock(node) && original.isBlock(node.parentNode)) || !simple_enter) && !ed.node.hasClass(node.parentNode, "wysiwygHide")){
                            node = node.parentNode;
                        }
                        return node;
                    };
                    var original = FroalaEditor.LZT_ORIGINAL_MODULES.node(ed);
                    return _object_spread_props(editor_object_spread({}, original), {
                        deepestParent: deepestParent
                    });
                };
                FroalaEditor.MODULES.cursor = function(ed) {
                    var enter = function enter(shift) {
                        var _marker_previousElementSibling, _marker_nextElementSibling;
                        var marker = ed.markers.insert();
                        if (marker.previousSibling && (marker.previousSibling.tagName == "IMG" || !marker.previousSibling.nodeValue && ((_marker_previousElementSibling = marker.previousElementSibling) === null || _marker_previousElementSibling === void 0 ? void 0 : _marker_previousElementSibling.tagName) == "IMG") || marker.nextSibling && (marker.nextSibling.tagName == "IMG" || !marker.nextSibling.nodeValue && ((_marker_nextElementSibling = marker.nextElementSibling) === null || _marker_nextElementSibling === void 0 ? void 0 : _marker_nextElementSibling.tagName) == "IMG")) {
                            if (shift) {
                                $(marker).before("<br>");
                                ed.selection.setAfter(marker);
                                ed.selection.restore();
                                return;
                            }
                            if ($(marker).parent().is("p")) {
                                //разрываем строку на несколько
                                var $marker_parent = $(marker).parent();
                                $(marker).replaceWith('<span id="fr-break"></span>');
                                var html = "<p>" + $marker_parent.html() + "</p>";
                                html = html.replace(/<span id="fr-break"><\/span>/g, "</p><p>" + FroalaEditor.MARKERS);
                                $marker_parent.replaceWith(html);
                                ed.selection.restore();
                                return;
                            }
                        }
                        ed.markers.remove();
                        var originalParentsUntil = ed.$.fn.parentsUntil;
                        ed.$.fn.parentsUntil = function() {
                            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                                args[_key] = arguments[_key];
                            }
                            if (args.length === 2 && args[0] === ed.$el && args[1] === "BLOCKQUOTE" && this.closest(".wysiwygHide").length) {
                                return ed.$();
                            }
                            return originalParentsUntil.apply(this, args);
                        };
                        var ret = original.enter(shift);
                        ed.$.fn.parentsUntil = originalParentsUntil;
                        return ret;
                    };
                    var original = FroalaEditor.LZT_ORIGINAL_MODULES.cursor(ed);
                    return _object_spread_props(editor_object_spread({}, original), {
                        enter: enter
                    });
                };
                // fix for uploading multiple images + use mask + override error behavior + image centering
                FroalaEditor.PLUGINS.image = function(ed) {
                    var align = function align(val) {
                        original.getEl()[val == "center" ? "addClass" : "removeClass"]("lzt-fr-fic");
                        return original.align(val);
                    };
                    var original = FroalaEditor.LZT_ORIGINAL_PLUGINS.image(ed);
                    FroalaEditor.COMMANDS.imageAlign.options.center = "Align Center";
                    FroalaEditor.COMMANDS.imageAlign.html = function() {
                        var c = '<ul class="fr-dropdown-list" role="presentation">';
                        var options = FroalaEditor.COMMANDS.imageAlign.options;
                        for(var val in options){
                            if (options.hasOwnProperty(val)) {
                                c += '<li><a class="fr-command " tabIndex="-1" role="option" data-cmd="imageAlign" data-param1="'.concat(val, '">').concat(this.icon.create("image-align-".concat(val)), "").concat(this.language.translate(options[val]), "</a></li>");
                            }
                        }
                        c += "</ul>";
                        return c;
                    };
                    FroalaEditor.COMMANDS.insertImage.callback = function() {
                        ed.commands.exec("xfInsertImage");
                    };
                    function upload() {
                        return _upload.apply(this, arguments);
                    }
                    function _upload() {
                        _upload = editor_async_to_generator(function() {
                            var images, _ed_popups_get, markers, html, snapshot, responses, arr, err, $wrapper, oldScroll;
                            var _arguments = arguments;
                            return editor_ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        images = _arguments.length > 0 && _arguments[0] !== void 0 ? _arguments[0] : [];
                                        images = Array.from(images);
                                        if (!images.length) return [
                                            2
                                        ];
                                        markers = ed.$el.find(".fr-marker").last();
                                        if (!markers.length) {
                                            ed.markers.insert();
                                            markers = ed.$el.find(".fr-marker").last();
                                        }
                                        ed.edit.off();
                                        ed.$box.closest(".defEditor").find(".UploadMask").removeClass("hidden");
                                        html = null;
                                        _state.label = 1;
                                    case 1:
                                        _state.trys.push([
                                            1,
                                            3,
                                            ,
                                            4
                                        ]);
                                        snapshot = ed.snapshot.get();
                                        return [
                                            4,
                                            Promise.all(images.map(function(i) {
                                                return uploadFile(i);
                                            }))
                                        ];
                                    case 2:
                                        responses = _state.sent();
                                        ed.snapshot.restore(snapshot);
                                        markers = ed.$el.find(".fr-marker").last();
                                        arr = responses.map(function(r) {
                                            return "<img " + 'class="fr-fil fr-dii fr-draggable" ' + 'src="'.concat(XenForo.htmlspecialchars(r.url), '" ') + 'data-key="'.concat(XenForo.htmlspecialchars(r.key), '" ') + // `style="width: ${ed.opts.imageDefaultWidth}px;" ` +
                                            "/>";
                                        });
                                        arr.push(FroalaEditor.MARKERS);
                                        if (ed.helpers.isIOS()) {
                                            arr = arr.map(function(str) {
                                                return "<p>".concat(str, "</p>");
                                            });
                                        }
                                        html = arr.join("");
                                        return [
                                            3,
                                            4
                                        ];
                                    case 3:
                                        err = _state.sent();
                                        XenForo.alert(ed.language.translate("Failed to upload image to server. Please, try again later.") + "<br>" + XenForo.htmlspecialchars(err.message || err));
                                        return [
                                            3,
                                            4
                                        ];
                                    case 4:
                                        ed.$box.closest(".defEditor").find(".UploadMask").addClass("hidden");
                                        ed.edit.on();
                                        (_ed_popups_get = ed.popups.get("image.insert")) === null || _ed_popups_get === void 0 ? void 0 : _ed_popups_get.hide();
                                        if (html) {
                                            insertFix(ed, true);
                                            $wrapper = ed.$box.find(".fr-wrapper");
                                            oldScroll = $wrapper.scrollTop();
                                            Lolzteam.EditorHelpers.focus(ed, false);
                                            $wrapper.scrollTop(oldScroll);
                                            if (!ed.image.get()) {
                                                if (!markers.length) {
                                                    ed.markers.insert();
                                                    markers = ed.$el.find(".fr-marker").last();
                                                }
                                                markers.replaceWith(html);
                                                ed.placeholder.refresh();
                                            } else {
                                                ed.image.get().replaceWith(html);
                                            }
                                            original.exitEdit(true);
                                            ed.selection.restore();
                                        }
                                        return [
                                            2
                                        ];
                                }
                            });
                        });
                        return _upload.apply(this, arguments);
                    }
                    return _object_spread_props(editor_object_spread({}, original), {
                        align: align,
                        upload: upload
                    });
                };
                FroalaEditor.PLUGINS.wysiwygLinkEdit = function(ed) {
                    var _init = function _init() {
                        function getLink(range) {
                            var container = range.startContainer;
                            var offset = range.startOffset;
                            var link = null;
                            if (container.nodeType === Node.TEXT_NODE && $(container).closest("a[href]").length) {
                                link = {
                                    $a: $(container).closest("a[href]"),
                                    href: $(container).closest("a[href]").attr("href"),
                                    text: container.nodeValue,
                                    offset: offset
                                };
                                // true если у ссылки кастомное название
                                // то есть href отличается от её отображаемого значения
                                link.customTitle = link.href !== link.text;
                                link.carretInside = range.startOffset < link.text.length && range.endOffset < link.text.length;
                            } else if ($(container).is("p") && container.childNodes.length >= offset && offset > 0) {
                                var el = container.childNodes[offset - 1];
                                if (!$(el).is("a[href]")) return link;
                                link = {
                                    $a: $(el),
                                    href: $(el).attr("href"),
                                    text: el.firstChild.nodeValue,
                                    offset: offset,
                                    carretInside: false
                                };
                                link.customTitle = link.href !== link.text;
                            }
                            return link;
                        }
                        var ALLOWED_URI_REGEXP = /^(http|ftp|https|mailto):\/\/*/i;
                        function isSafeLink(text) {
                            return ALLOWED_URI_REGEXP.test(text);
                        }
                        ed.events.on("keydown", function(e) {
                            var selection = ed.selection.get();
                            if (selection.rangeCount === 0) return;
                            var range = selection.getRangeAt(0);
                            var link = getLink(range);
                            if (link === null || link.customTitle) {
                                if (link && (!link.text.length || link.text.length == 1 && link.text.charCodeAt(0) === 8203)) {
                                    link.$a.remove();
                                }
                                return;
                            }
                            var length = ed.selection.text().length;
                            if (e.originalEvent.key === "Backspace" && link.offset > 0) {
                                var text = link.text.slice(0, link.offset - 1) + link.text.slice(link.offset);
                                if (!isSafeLink(text)) return;
                                link.$a.attr("href", text);
                            } else if (e.originalEvent.key.length === 1 && link.carretInside) {
                                var text1 = link.text.slice(0, link.offset) + e.originalEvent.key + link.text.slice(link.offset + length);
                                if (!isSafeLink(text1)) return;
                                link.$a.attr("href", text1);
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.lztMutationObserverFixes = function(ed) {
                    var _init = function _init() {
                        new MutationObserver(function(records) {
                            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            try {
                                for(var _iterator = records[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                    var record = _step.value;
                                    if (record.type === "characterData") {
                                        // https://zelenka.guru/threads/4728351/
                                        var closestUsername = $(record.target).closest(".username");
                                        var parent = closestUsername.parent();
                                        if (closestUsername.length && parent.length && record.target.textContent) {
                                            ed.selection.save();
                                            closestUsername.replaceWith(closestUsername.children().html());
                                            ed.selection.restore();
                                        }
                                    }
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                        }).observe(ed.$el[0], {
                            characterData: true,
                            characterDataOldValue: true,
                            subtree: true
                        });
                        ed.events.on("paste.before", function(e) {
                            var _e_clipboardData, _e_clipboardData_files;
                            if (!(e === null || e === void 0 ? void 0 : (_e_clipboardData = e.clipboardData) === null || _e_clipboardData === void 0 ? void 0 : (_e_clipboardData_files = _e_clipboardData.files) === null || _e_clipboardData_files === void 0 ? void 0 : _e_clipboardData_files.length)) {
                                return;
                            }
                            var closestUsername = $(e.target).closest(".username");
                            if (closestUsername.length) {
                                ed.selection.save();
                                closestUsername.replaceWith(closestUsername.children().html());
                                ed.selection.restore();
                            }
                        }, true);
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.zwsRemoveOnFormat = function(ed) {
                    var _init = function _init() {
                        $('button[data-cmd="clearFormatting"]').on("click", function() {
                            var html = ed.html.get(true);
                            //html = ed.clean.invisibleSpaces(html);
                            html = html.replaceAll(/\u200B/g, "");
                            ed.html.set(html);
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.DelSmilie = function(ed) {
                    var _init = function _init() {
                        ed.events.on("keydown", function(e) {
                            if (e.keyCode === 46 && $(ed.selection.element()).is("smilie")) {
                                ed.cursor.del();
                            }
                        }, true);
                    };
                    return {
                        _init: _init
                    };
                };
                // https://zelenka.guru/threads/4730191
                FroalaEditor.PLUGINS.lztColoredUsernameFixes = function(ed) {
                    var _init = function _init() {
                        ed.events.on("html.get", function(html) {
                            // Yandex Browser inject their user-script and this leads to infinite loop in some cases
                            // https://zelenka.guru/threads/6193434/
                            if (new Error().stack.includes("user-script:")) {
                                return "";
                            }
                            var parser = new DOMParser();
                            var $doc = $(parser.parseFromString(html, "text/html"));
                            // костыль для лисы, т.к. сохранение инпута происходит без класса для обертки
                            $doc.find('span[data-skip-color="true"]').wrap('<span class="username">');
                            $doc.find(".username").replaceWith(function() {
                                return $(this).html();
                            });
                            return $doc.find("body").html();
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.lztMentionSpace = function(ed) {
                    var _init = function _init() {
                        function keyHandler(e) {
                            var symbol = e.originalEvent.key || e.originalEvent.data;
                            if (symbol === " ") symbol = "&nbsp;";
                            var selection = ed.selection.get();
                            var textNode = selection.anchorNode;
                            var offset = selection.anchorOffset;
                            var $node = $(textNode);
                            var p = false;
                            if (textNode.nodeType !== Node.TEXT_NODE && !$node.parent().is("span.username")) {
                                if (!$node.is("p")) {
                                    return;
                                }
                                if (offset !== textNode.childNodes.length) {
                                    return;
                                }
                                p = true;
                                $node = $(textNode.childNodes[offset - 1]);
                            }
                            var $username = $node.closest('span.username[spellcheck="false"]');
                            if (!$username.length || !ed.selection.isCollapsed()) return;
                            if (!(offset == textNode.length || offset == 0 || p)) return;
                            e.preventDefault();
                            ed.undo.saveStep();
                            if (offset == 0) {
                                if ($username.get(0).previousSibling !== null) {
                                    ed.selection.setBefore($username[0], true);
                                    $username.before(symbol);
                                } else {
                                    $username.before(symbol);
                                    ed.selection.setBefore($username[0], true);
                                }
                            } else {
                                if ($username.get(0).nextSibling !== null) {
                                    ed.selection.setAfter($username[0], true);
                                    $username.after(symbol);
                                } else {
                                    ed.selection.setAfter($username[0], true);
                                    ed.selection.restore();
                                    ed.html.insert(symbol);
                                }
                            }
                            ed.selection.restore();
                            ed.undo.saveStep();
                        }
                        ed.events.on("beforeinput", function(e) {
                            if (!(e.keyCode === undefined || e.keyCode === FroalaEditor.KEYCODE.IME)) {
                                return;
                            }
                            if (e.originalEvent.inputType === "insertText" && (e.originalEvent.data === " " || e.originalEvent.data === ",")) {
                                keyHandler(e);
                            }
                        }, true);
                        //фикс положения курсора при стирани символа после упоминания
                        ed.events.on("input", function(e) {
                            if (!(e.keyCode === undefined || e.keyCode === FroalaEditor.KEYCODE.IME)) {
                                return;
                            }
                            if (e.originalEvent.inputType === "deleteContentBackward") {
                                var selection = ed.selection.get();
                                var textNode = selection.anchorNode;
                                var offset = selection.anchorOffset;
                                var $username = $(textNode).closest('span.username[spellcheck="false"]');
                                var parent = textNode.parentElement;
                                //если мы в начале или в середине упоминания
                                if (!$username.length || offset === 0 || parent.childNodes[parent.childNodes.length - 1].nodeType !== Node.TEXT_NODE) {
                                    return;
                                }
                                ed.selection.setAfter($username[0], true);
                            }
                        }, true);
                        ed.events.on("keydown", function(e) {
                            if ((e.keyCode === FroalaEditor.KEYCODE.SPACE || e.key === ",") && !ed.keys.isIME()) {
                                keyHandler(e);
                            }
                        }, true);
                        ed.events.on("initialized", function() {
                            ed.$el.find(".username").attr("spellcheck", "false");
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.lztShortcutFix = function(ed) {
                    var shortcutFix = function shortcutFix(e) {
                        if (!ed.core.hasFocus()) {
                            return true;
                        }
                        var ctrlKey = navigator.userAgent.indexOf("Mac OS X") !== -1 ? e.metaKey : e.ctrlKey;
                        if (!ctrlKey) return;
                        var keycode = e.which;
                        var map_key = (e.shiftKey ? "^" : "") + (e.altKey ? "@" : "") + keycode;
                        if (!FroalaEditor.SHORTCUTS_MAP[map_key]) return;
                        var shortcut = FroalaEditor.SHORTCUTS_MAP[map_key];
                        if (ed.opts.shortcutsEnabled.indexOf(shortcut.cmd) === -1) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                    };
                    var _init = function _init() {
                        ed.events.on("keydown keyup", shortcutFix, true);
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.fixQuoteEnter = function(ed) {
                    var _init = function _init() {
                        ed.events.on("keydown", function(e) {
                            //на мобиле остановка пропагация фиксит enter в цитатах
                            //для пк не делаю, чтобы работал shift + enter
                            if (ed.keys.isIME()) {
                                var $element = $(ed.selection.element());
                                var blockquote = $element.closest("blockquote");
                                if (blockquote.length) return false;
                            }
                        }, true);
                    };
                    return {
                        _init: _init
                    };
                };
                // https://zelenka.guru/threads/4734372/ + others
                FroalaEditor.PLUGINS.lztTextareaValueFix = function(ed) {
                    var _init = function _init() {
                        var set = ed.$oel[0].__lookupSetter__("value");
                        Object.defineProperty(ed.$oel[0], "value", {
                            get: function() {
                                return ed.html.get();
                            },
                            set: set
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                // https://zelenka.guru/threads/4739820/
                FroalaEditor.PLUGINS.lztFullscreenFix = function(ed) {
                    var _init = //let zIndex
                    function _init() {
                        // https://zelenka.guru/threads/5598130/
                        ed.events.on("commands.after", function(cmd) {
                            if (cmd === "fullscreen") tippy.hideAll();
                        });
                        if (!ed.helpers.isMobile()) return;
                        ed.opts.zIndex = 100;
                    /*zIndex = ed.opts.zIndex
                        Object.defineProperty(ed.opts, 'zIndex', {
                            get: () => zIndex,
                            set: newZIndex => {
                                if (newZIndex !== 2147483641)
                                    zIndex = newZIndex
                            }
                        })*/ };
                    return {
                        _init: _init
                    };
                };
                // фиксим автолинк
                FroalaEditor.MODULES.events = function(ed) {
                    var original = FroalaEditor.LZT_ORIGINAL_MODULES.events(ed);
                    var urlFixCounter = 0;
                    return _object_spread_props(editor_object_spread({}, original), {
                        on: function(event, handler, prepend) {
                            if (event === "paste.beforeCleanup" && urlFixCounter++ === FroalaEditor.LZT_URL_HANDLER_POS) {
                                // да, это турбогиперкостыль, но иначе только хуже
                                return;
                            }
                            return original.on(event, handler, prepend);
                        }
                    });
                };
                FroalaEditor.PLUGINS.lztAutoLinkFix = function(ed) {
                    var _init = function _init() {
                        ed.events.on("paste.afterCleanup", function(html) {
                            return html// костыль на пробел из-за уебанства с автолинком если на конце ссылки нет пробела
                            .replace(/(https?:\/\/[^\s<]+)/g, "$1 ").replace(/(^|&lt;|\s)(((https?|ftp):\/\/|mailto:))([-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\w.-]*)*(\?)?(\S+)*/g, '$1<a href="$3$5$6$7$8">$3$5$6$7$8</a>').replace(/(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$|\[|\])/g, '$1<a href="https://$2">$2</a>$3').replace(/<a\s+(?:[^>]+\s+)?href=(['"])(.*?)\1[^>]*>(.*?)\s*<\/a>/gi, '<a href="$2">$3</a>');
                        }, true);
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.sanitizerFix = function(ed) {
                    var _init = function _init() {
                        // двойные кавычки по умолчанию не экранируются
                        ed.helpers.sanitizeURL = function(url) {
                            return url.replace(/"/g, "%22");
                        };
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.MODULES.templatePopupFix = function(ed) {
                    var culcTopPosition = function culcTopPosition($popup, $selectElement) {
                        return $selectElement.offset().top - $popup.height();
                    };
                    var _init = function _init() {
                        ed.popups.onShow("autoComplete.template", function() {
                            if (ed.helpers.isMobile()) {
                                var $popup = $(ed.popups.get("autoComplete.template"));
                                var $selectElement = $($(window1.getSelection().baseNode).parents()[0]);
                                $popup.css("top", "".concat(culcTopPosition($popup, $selectElement), "px"));
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                %INSERT_POPUP_FIX%
                FroalaEditor.PLUGINS.forwardButtonFixFocus = function(ed) {
                    var isConversations = function isConversations() {
                        var _$_data;
                        var form = ed.$el.closest("form")[0];
                        return (_$_data = $(form).data("default-action")) === null || _$_data === void 0 ? void 0 : _$_data.startsWith("conversations");
                    };
                    var _init = function _init() {
                        ed.events.on("initialized", function() {
                            if (isConversations()) {
                                var _start_$ed_ed;
                                var start = $("#Conversations").data("Im.Start");
                                if ((_start_$ed_ed = start.$ed.ed) === null || _start_$ed_ed === void 0 ? void 0 : _start_$ed_ed.ready) {
                                    Lolzteam.EditorHelpers.focus(start.$ed.ed);
                                }
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                // Fixes edge case, when after pasting image/smilie end space doesn't get converted to nbsp, thus breaking whole editor
                // https://zelenka.guru/threads/5680099/
                FroalaEditor.PLUGINS.nbspImagesFix = function(editor) {
                    var spacesFix = function spacesFix(editor) {
                        function _normalizeNode(node) {
                            var additionalTags = [
                                "IMG",
                                "SMILIE"
                            ];
                            var tagOptsValues = [
                                FroalaEditor.ENTER_P,
                                FroalaEditor.ENTER_DIV,
                                FroalaEditor.ENTER_BR
                            ];
                            var p_node = node.previousSibling;
                            var n_node = node.nextSibling;
                            var txt = node.textContent;
                            // Ending spaces should be NBSP or spaces before block tags.
                            // 1. No node after. (and the parent node is block tag.)
                            // 2. Next block is block tag.
                            // 3. Next element has display block.
                            if (!n_node || n_node && editor.node.isBlock(n_node) || n_node && n_node.nodeType === Node.ELEMENT_NODE && editor.win.getComputedStyle(n_node) && editor.win.getComputedStyle(n_node).display === "block") {
                                // OR(||) condition is for https://github.com/froala-labs/froala-editor-js-2/issues/1949
                                if (!editor.node.isVoid(p_node) || p_node && additionalTags.indexOf(p_node.tagName) !== -1 && tagOptsValues.indexOf(editor.opts.enter) !== -1) {
                                    txt = txt.replace(/ $/, FroalaEditor.UNICODE_NBSP);
                                }
                            }
                            if (node.textContent !== txt) {
                                node.textContent = txt;
                            }
                        }
                        function normalize(el) {
                            if (typeof el === "undefined" || !el) {
                                el = editor.el;
                            }
                            // Ignore contenteditable.
                            if (el.getAttribute && el.getAttribute("contenteditable") === "false") {
                                return;
                            }
                            if (el.nodeType === Node.TEXT_NODE) {
                                _normalizeNode(el);
                            }
                        }
                        return {
                            normalize: normalize
                        };
                    };
                    var _init = function _init() {
                        editor.spaces.normalize = function(el, browser_way) {
                            FroalaEditor.MODULES.spaces(editor).normalize(el, browser_way);
                            spacesFix(editor).normalize(el);
                        };
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.smilieIosFix = function(ed) {
                    var _init = function _init() {
                        if (!ed.helpers.isIOS()) return;
                        ed.events.on("change input keyup keydown paste", function() {
                            var smilies = ed.$el.find("smilie.fr-deletable[contenteditable]");
                            smilies.each(function(index, el) {
                                if (el.nextSibling == undefined || $(el.nextSibling).is("smilie")) {
                                    $(el).after("&nbsp;");
                                }
                            });
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.popupsPosFix = function(ed) {
                    var isConversations = function isConversations() {
                        var _$_data;
                        var form = ed.$el.closest("form")[0];
                        return (_$_data = $(form).data("default-action")) === null || _$_data === void 0 ? void 0 : _$_data.startsWith("conversations");
                    };
                    var isThreadCreate = function isThreadCreate() {
                        var _$_attr;
                        var form = ed.$el.closest("form")[0];
                        return (_$_attr = $(form).attr("action")) === null || _$_attr === void 0 ? void 0 : _$_attr.endsWith("add-thread");
                    };
                    var _init = function _init() {
                        var popups = {
                            "linkEdit": "link.insert",
                            "imageLink": "link.insert",
                            "imageSize": "image.size",
                            "imageAlt": "image.alt",
                            "imageReplace": "image.insert"
                        };
                        var normalPosition = 0;
                        // сохраняем нормальную позицию
                        function savePosition() {
                            //if (!isThreadCreate()) return;
                            var $popup = $(ed.popups.get("image.edit"));
                            var cssTop = $popup.css("top");
                            if (cssTop === undefined) return;
                            normalPosition = parseInt(cssTop.replace("px", ""), 10);
                        }
                        // задаём нормальную позицию
                        function updatePosition() {
                            var _loop = function(cmd) {
                                var popup = popups[cmd];
                                if (!ed.popups.isVisible(popup)) return "continue";
                                var $popup = $(ed.popups.get(popup));
                                setTimeout(function() {
                                    $popup.css("top", normalPosition);
                                    $popup.removeClass("fr-hidden");
                                }, 0);
                            };
                            if (ed.helpers.isMobile()) return;
                            //if (!isThreadCreate()) return;
                            if (normalPosition === 0) return;
                            for(var cmd in popups)_loop(cmd);
                        }
                        $(document1).on("scroll", function(e) {
                            savePosition();
                            updatePosition();
                        });
                        ed.$box.find(".fr-wrapper").on("scroll", function(e) {
                            savePosition();
                            updatePosition();
                        });
                        ed.events.on("commands.after", function(cmd) {
                            var popup = popups[cmd];
                            if (popup === undefined) return;
                            if (!isConversations()) {
                                var $popup = $(ed.popups.get(popup));
                                var top = $popup.css("top").replace("px", "");
                                var currentPosition;
                                if (popup === "link.insert") {
                                    $popup.addClass("insertEdit");
                                    currentPosition = top - $popup.height() - 30;
                                } else {
                                    currentPosition = top - $popup.height() - $(ed.image.get()).height() - 10;
                                }
                                $popup.css("top", "".concat(currentPosition, "px"));
                            }
                            savePosition();
                            updatePosition();
                        });
                        ed.events.on("popups.show.image.edit", function() {
                            var $popup = ed.popups.get("image.edit");
                            var cssTop = parseInt($popup.css("top"));
                            var clientTop = $popup === null || $popup === void 0 ? void 0 : $popup[0].getBoundingClientRect().top;
                            if (cssTop > clientTop && ed.fullscreen.isActive()) {
                                $popup.css("top", cssTop + (cssTop - clientTop));
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.insertLinkFix = function(ed) {
                    var _init = function _init() {
                        ed.events.on("commands.before", function(text) {
                            if (text === "insertLink") {
                                ed.selection.save();
                            }
                        });
                        ed.events.on("link.beforeInsert", function(link, text) {
                            var _ed_image_get, _ed_selection_get;
                            if (ed.link.get()) return;
                            if ((_ed_image_get = ed.image.get()) === null || _ed_image_get === void 0 ? void 0 : _ed_image_get.length) return;
                            if (link === "" || text === "") return true;
                            if (ed.helpers.isEmail(link)) link = "mailto:" + link;
                            else if (!link.startsWith("http") && !link.startsWith("ftp")) link = "https://" + link;
                            //link = ed.helpers.sanitizeURL(link);
                            ed.popups.hide("link.insert");
                            ed.selection.restore();
                            var styles = "";
                            var node = (_ed_selection_get = ed.selection.get()) === null || _ed_selection_get === void 0 ? void 0 : _ed_selection_get.anchorNode;
                            if (node) {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    node = node.parentElement;
                                }
                                styles = $(node).attr("style");
                            }
                            var linkHtml = $('<a href="'.concat(XenForo.htmlspecialchars(link), '">').concat(XenForo.htmlspecialchars(text), "</a>")).attr("style", styles);
                            linkHtml = linkHtml.prop("outerHTML");
                            ed.html.insert(linkHtml, true);
                            ed.selection.clear();
                            return false;
                        // if(ed.link.get()) return;
                        // if(ed.image.get()?.length) return;
                        // if(ed.helpers.isEmail(link))
                        //     link = 'mailto:' + link;
                        // else if (!link.startsWith('http') && !link.startsWith('ftp'))
                        //     link = 'https://' + link;
                        // link = ed.helpers.sanitizeURL(link);
                        // ed.html.insert(
                        //     `<a href="${XenForo.htmlspecialchars(link)}">${XenForo.htmlspecialchars(text)}</a>`,
                        //     true
                        // )
                        // ed.popups.hide('link.insert')
                        // return false;
                        });
                        ed.events.on("commands.after", function(text) {
                            if (text === "insertLink" || text === "linkEdit") {
                                ed.events.disableBlur();
                                setTimeout(function() {
                                    ed.popups.get("link.insert").find('.fr-input-line > input[name="href"]')[0].focus();
                                }, 0);
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.removeSmilieMobile = function(ed) {
                    var _init = function _init() {
                        if (!ed.helpers.isMobile() || ed.helpers.isIOS()) return;
                        ed.events.on("input", function(e) {
                            if (e.originalEvent.inputType === "deleteContentBackward") {
                                var selection = ed.selection.get();
                                var element = $(ed.selection.element());
                                if (element.is("p")) {
                                    element = $(selection === null || selection === void 0 ? void 0 : selection.anchorNode.childNodes[(selection === null || selection === void 0 ? void 0 : selection.anchorOffset) - 1]);
                                }
                                if (element.hasClass("mceSmilie") || element.is("smilie")) {
                                    element.replaceWith(FroalaEditor.MARKERS);
                                    ed.selection.restore();
                                    ed.events.focus();
                                }
                            }
                        }, true);
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.fixHides = function(ed) {
                    var getHide = function getHide($element) {
                        return $element.closest("blockquote.wysiwygHide");
                    };
                    var _init = function _init() {
                        ed.events.on("keydown", function(e) {
                            if (ed.helpers.isMobile() || ed.selection.isCollapsed() || e.which !== 8 && e.key.length !== 1) return;
                            // срабатывает по кнопке 'Backspace' (либо символ)
                            var $element = $(ed.selection.element());
                            var $hide = getHide($element);
                            var snapshot = ed.snapshot.get();
                            // ливаем если выделение находится вне хайда
                            if (!$hide.length) return;
                            // выделено всё текстовое содержимое хайда
                            // а так-же в хайде отсутствует всё кроме текста
                            var onlyText = ed.xfHide.onlyText($hide);
                            if (ed.xfHide.isFullSelected($hide) && onlyText) {
                                return false;
                            }
                        }, true);
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.xfWysiwygAutofocusFix = function(ed) {
                    var _init = function _init() {
                        function hover(popupId, input) {
                            ed.events.disableBlur();
                            var $popup = ed.popups.get(popupId);
                            var $input = $popup.find(input);
                            $input.focus();
                        }
                        ed.events.on("popups.show.xfHide.edit", function() {
                            return hover("xfHide.edit", ".fr-xfHide-attr");
                        });
                        ed.events.on("popups.show.xfSpoiler.edit", function() {
                            return hover("xfSpoiler.edit", ".fr-xfSpoiler-attr");
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.closePopupFix = function(ed) {
                    var tippyClose = function tippyClose() {
                        var _$_;
                        var tippy1 = (_$_ = $('div[data-cmd="xfSmilie"]')[0]) === null || _$_ === void 0 ? void 0 : _$_._tippy;
                        if (tippy1 && tippy1.state.isVisible) {
                            tippy1.hide();
                        }
                    };
                    var _init = function _init() {
                        ed.events.on("paste keydown input commands.after", function() {
                            tippyClose();
                        });
                        $(document1).on("submit", function(e) {
                            tippyClose();
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                // https://zelenka.guru/threads/5979774
                FroalaEditor.PLUGINS.ColoredNameFix = function(ed) {
                    var checkForNickname = function checkForNickname(beforeHtml, afterHtml) {
                        var $usernameBefore = $(beforeHtml).find(".username");
                        var $usernameAfter = $(afterHtml).find(".username");
                        return $usernameBefore.length > 0 && ($usernameAfter.length < 1 || !$usernameAfter[0].outerHTML.includes($usernameBefore[0].outerHTML));
                    };
                    var _init = function _init() {
                        ed.events.on("keydown", function(e) {
                            //if (ed.helpers.isMobile()) {
                            var beforeHtml = ed.$el[0].outerHTML;
                            setTimeout(function() {
                                var afterHtml = ed.$el[0].outerHTML;
                                if (checkForNickname(beforeHtml, afterHtml)) {
                                    ed.selection.save();
                                    var snapshot = ed.snapshot.get();
                                    var $tagB = $(snapshot.html).find("b")[0];
                                    var $tagFont = $(snapshot.html).find("font")[0];
                                    if (($tagB === null || $tagB === void 0 ? void 0 : $tagB.outerHTML) && ($tagFont === null || $tagFont === void 0 ? void 0 : $tagFont.outerHTML)) {
                                        snapshot.html = snapshot.html.replace($tagFont.outerHTML, $tagFont.innerHTML);
                                        snapshot.html = snapshot.html.replace($tagB.outerHTML, $tagB.innerHTML);
                                        ed.snapshot.restore(snapshot);
                                    //ed.selection.restore()
                                    }
                                    ed.selection.restore();
                                }
                            }, 0);
                        //}
                        }, true);
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.insertLinkRemoveFix = function(ed) {
                    var _init = function _init() {
                        ed.events.on("link.beforeInsert", function(link, text) {
                            var _ed_link;
                            if (((_ed_link = ed.link) === null || _ed_link === void 0 ? void 0 : _ed_link.get()) && link === "") {
                                ed.link.remove();
                                // const children = $(ed.link.get())[0].innerHTML
                                // const parent = $(ed.link.get()).parents()
                                // const parentHTML = $(parent[0]).html().replace( $(ed.link.get())[0].outerHTML, children)
                                // $(parent[0]).html(parentHTML)
                                // $(ed.link.get()).remove()
                                ed.popups.hide("link.insert");
                                return false;
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.popupsHeaderFix = function(ed) {
                    var _init = function _init() {
                        if (ed.$box.closest("div.modal").length) return;
                        if (ed.helpers.isMobile()) return;
                        var popups = {
                            "imageSize": "image.size",
                            "imageLink": "link.insert",
                            "imageAlt": "image.alt",
                            "linkEdit": "link.insert"
                        };
                        ed.events.on("commands.after", function(cmd) {
                            if (popups[cmd] === undefined) return;
                            var $popup = ed.popups.get(popups[cmd]);
                            $popup.removeClass("fr-hidden");
                            var headerHeight = $("#header").height();
                            var position = $popup[0].getBoundingClientRect().top;
                            if (position < headerHeight) {
                                $popup.css("top", "".concat(headerHeight, "px"));
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                /*FroalaEditor.PLUGINS.qwTicketsPopupsFix = function(ed) {
                    function isQuickWrite() {
                        return ed.$box.closest('.quickWriteRedactor').length > 0;
                    }
    
                    function isTickets() {
                        let form = ed.$el.closest('form');
                        let action = form.attr('action');
                        return action?.startsWith('support-tickets') && action?.endsWith('save') && form.data('previewurl');
                    }
    
                    function _init() {
                        if (!isQuickWrite() && !isTickets()) return;
                        if (ed.helpers.isMobile()) return;
    
                        const popups = {
                            'imageSize': 'image.size',
                            'imageLink': 'link.insert',
                            'imageAlt': 'image.alt',
                            'linkEdit': 'link.insert'
                        };
    
                        const parentPopup = {
                            'imageSize': 'image.edit',
                            'imageLink': 'image.edit',
                            'imageAlt': 'image.edit',
                            'linkEdit': 'link.edit'
                        };
    
                        ed.events.on('commands.after', (cmd) => {
                            if (popups[cmd] === undefined) return;
                            const $popup = ed.popups.get(popups[cmd]);
                            $popup.removeClass('fr-hidden');
    
                            let position = ed.popups.get(parentPopup[cmd]).css('top');
                            $popup.css('top', position);
                        });
                    }
    
                    return {_init};
                }*/ FroalaEditor.PLUGINS.linkOpenInNewTab = function(ed) {
                    var _init = function _init() {
                        ed.events.on("commands.before", function(cmd) {
                            if (cmd === "linkOpen") {
                                var link = ed.link.get().href;
                                window1.open(link, "_blank");
                                return false;
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                // https://zelenka.guru/threads/5977168
                FroalaEditor.PLUGINS.nicknamePasteFix = function(ed) {
                    var _init = function _init() {
                        var banned = [];
                        ed.events.on("paste.beforeCleanup", function(html) {
                            var body = new DOMParser().parseFromString(html, "text/html").querySelector("body");
                            $(body).find("span.username span.is_banned").each(function(index, el) {
                                // <span class="username" data-user="...">
                                //   <span class="is_banned">  <- el
                                var data = $(el).closest("span.username").data("user");
                                if (!banned.includes(data)) banned.push(data);
                            });
                        });
                        ed.events.on("paste.after", function() {
                            if (!banned.length) return;
                            banned.forEach(function(user) {
                                ed.$el.find('span[data-user="'.concat(user, '"]:not(.username)')).each(function(index, el) {
                                    // <span data-user="...">  <- el
                                    //   nickname OR <span>nickname</span>
                                    var span = $(el);
                                    var text = span.text();
                                    // чтобы частично скопированные ники не зачёркивались
                                    if (text.substr(1, text.length) !== user.split(" ")[1]) {
                                        span.text(text);
                                        return;
                                    }
                                    span.addClass("username").html('<span class="is_banned">').children(":first").text(text);
                                });
                            });
                            banned = [];
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.shiftEnterAlign = function(ed) {
                    var _init = function _init() {
                        ed.events.on("keydown", function(e) {
                            var _ed_selection_get, _ed_selection_get1, _ed_selection_get_anchorNode;
                            if (e.keyCode !== 13) return;
                            if (!e.shiftKey) return;
                            var $el = $((_ed_selection_get = ed.selection.get()) === null || _ed_selection_get === void 0 ? void 0 : _ed_selection_get.anchorNode);
                            var $parent = $((_ed_selection_get1 = ed.selection.get()) === null || _ed_selection_get1 === void 0 ? void 0 : (_ed_selection_get_anchorNode = _ed_selection_get1.anchorNode) === null || _ed_selection_get_anchorNode === void 0 ? void 0 : _ed_selection_get_anchorNode.parentNode);
                            if ($parent.is("p") && $parent.css("text-align") && !ed.$el.closest(".simpleRedactor").length) {
                                ed.selection.save();
                                var align = $parent.css("text-align");
                                var wrapped = false;
                                $parent.children().each(function() {
                                    var $child = $(this);
                                    if ($child.is("img")) {
                                        $child.wrap('<p style="text-align: '.concat(align, ';">'));
                                        wrapped = true;
                                    }
                                });
                                if (wrapped) {
                                    $el.unwrap().css("text-align", align);
                                }
                                ed.selection.restore();
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                // https://zelenka.guru/threads/5110195/
                FroalaEditor.PLUGINS.bannedNicknames = function(ed) {
                    var _init = function _init() {
                        ed.events.on("initialized", function() {
                            if (ed.$box.closest(".xenOverlay").length) {
                                ed.$el.find("span.is_banned").attr("style", null);
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.videoFixes = function(ed) {
                    var _init = function _init() {
                        ed.events.on("keydown", function(e) {
                            if (e.keyCode === 13) {
                                var _ed_selection_get, _ed_selection_get_anchorNode;
                                var $select = $((_ed_selection_get = ed.selection.get()) === null || _ed_selection_get === void 0 ? void 0 : (_ed_selection_get_anchorNode = _ed_selection_get.anchorNode) === null || _ed_selection_get_anchorNode === void 0 ? void 0 : _ed_selection_get_anchorNode.parentElement);
                                if ($select.hasClass("fr-lzt-media") && !$select.children().length) $select.remove();
                            }
                            if (e.keyCode === 8) {
                                var _ed_selection_get1;
                                var select = (_ed_selection_get1 = ed.selection.get()) === null || _ed_selection_get1 === void 0 ? void 0 : _ed_selection_get1.anchorNode;
                                if ($(select).hasClass("fr-lzt-media")) {
                                    ed.selection.setAfter(select, true);
                                    ed.selection.restore();
                                }
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.doubleEnterIos = function(ed) {
                    var _init = function _init() {
                        var pos = null;
                        ed.events.on("keyup", function(e) {
                            if (e.keyCode === 13 && ed.helpers.isIOS()) {
                                var selection = ed.selection.get();
                                var censor;
                                //в wysiwygCensorSpoiler keydown return false, поэтому тут backspace() не нужен
                                if (selection.anchorNode) {
                                    if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
                                        censor = selection.anchorNode.parentElement;
                                    } else {
                                        censor = selection.anchorNode;
                                    }
                                    if ($(censor).is(".wysiwygCensorSpoiler")) {
                                        //false чтобы предотвратить вызов 'undo' в _mapKeyUp
                                        return false;
                                    }
                                }
                            /*ed.selection.restore()
                                    ed.cursor.backspace()
                                    // e.preventDefault();
                                    // e.stopPropagation();
                                    return false;*/ }
                        }, true);
                    /*ed.events.on('keydown', function (e) {
                            const $select = ed.selection.get();
                            if (e.keyCode === 13 && ed.helpers.isIOS() && (!$select.anchorNode || !$select.anchorNode.textContent)) {
                                ed.selection.restore()
                                ed.cursor.backspace()
                                // e.preventDefault();
                                // e.stopPropagation();
                                return false;
                            }
                        })
                        ed.events.on('touchstart', function () {
                            // у фроалы система такая, что спавнит маркеры, по которым энтер делит строчку по маркеру
                            // что не работает в условиях, где мы юзаем костыли
                            // поэтому вырезаем маркеры нахер при изменении позиции каретки
                            if (!ed.helpers.isIOS()) return;
                            const $select = ed.selection.get();
                            if (pos == null) {
                                pos = $select.anchorOffset;
                                return false;
                            }
                            if (pos !== $select.anchorOffset) {
                                $('.fr-marker').remove();
                                pos = $select.anchorOffset;
                                return false;
    
                            }
                        })*/ };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.popupHiddenFix = function(ed) {
                    var _repositionModals = function _repositionModals($el) {
                        if (!$el.length) return;
                        var $popup = $(".fr-image-upload-layer").parent(".fr-popup");
                        if (!$popup.length) return;
                        var wrap_correction_top = $el.offset().top + $el.outerHeight();
                        // 2 -> 1/2 картинки; 4 -> левый край картинки
                        var wrap_correction_left = $el.offset().left + $el.outerWidth() / 4;
                        $popup.css("top", wrap_correction_top - 1).css("left", wrap_correction_left - 1);
                    };
                    ed.events.on("commands.after", function(cmd) {
                        if (cmd == "imageReplace" && ed.$box.parent(".profilePoster").length) {
                            var $popup = $(".fr-image-upload-layer").parent(".fr-popup");
                            if (!$popup.hasClass("fr-hidden")) return console.log("no");
                            console.log("yea");
                            $popup.removeClass("fr-hidden").show();
                            _repositionModals(ed.image.get());
                        }
                    });
                    ed.events.on("popups.show.image.insert", function() {
                        var $popup = $(".fr-image-upload-layer").parent(".fr-popup");
                        var isOverlay = ed.$box.closest(".modal").length;
                        if (isOverlay) return;
                        $popup.css("display", "block");
                    });
                    ed.events.on("popups.hide.image.insert", function() {
                        var $popup = $(".fr-image-upload-layer").parent(".fr-popup");
                        var isOverlay = ed.$box.closest(".modal").length;
                        if (isOverlay) return;
                        $popup.css("display", "none");
                    });
                };
                FroalaEditor.PLUGINS.fixDeletingSpan = function(ed) {
                    // override froala behaviour on backspace when cursor inside the span element
                    ed.events.on("keydown", function(e) {
                        var _selection_anchorNode;
                        var selection = ed.selection.get();
                        var parentNode = selection === null || selection === void 0 ? void 0 : (_selection_anchorNode = selection.anchorNode) === null || _selection_anchorNode === void 0 ? void 0 : _selection_anchorNode.parentNode;
                        if (e.keyCode === 8 && (parentNode === null || parentNode === void 0 ? void 0 : parentNode.tagName) === "SPAN") {
                            var _selection_anchorNode1;
                            var $span = $((_selection_anchorNode1 = selection.anchorNode) === null || _selection_anchorNode1 === void 0 ? void 0 : _selection_anchorNode1.parentElement);
                            if (parentNode.className === "wysiwygCensorSpoiler") {
                                // We can't use .text() in censor because IMG (and some others) doesn't have .text()
                                // Fixes edge case when only IMG is in censor span and it gets removed
                                if ($span.html().replace(/\u200B|<br>/g, "")) {
                                    return;
                                }
                            } else if ($span.text().replace(/\u200B/g, "")) {
                                return;
                            }
                            $span.replaceWith("".concat(FroalaEditor.MARKERS));
                            ed.selection.restore();
                        }
                    });
                };
                FroalaEditor.PLUGINS.fixAvailableAlignButton = function(ed) {
                    ed.events.on("initialized", function() {
                        //чтобы небыло кнопки выравнивания у картинок, там где она отключена
                        var toolbarButtons = ed.opts.toolbarButtons;
                        var imageEditButtons = ed.opts.imageEditButtons;
                        if (!toolbarButtons.moreParagraph.buttons.includes("xfAlign") && imageEditButtons.includes("imageAlign") || ed.$box.closest(".profilePoster").length || ed.$box.closest(".commentSubmit").length || ed.$box.closest(".formOverlay").find(".ppCommentEditActionButtons").length || ed.$box.closest(".profilePostEditForm").length) {
                            delete imageEditButtons[imageEditButtons.indexOf("imageAlign")];
                        }
                    });
                };
                FroalaEditor.PLUGINS.fixSelectionUsernames = function(ed) {
                    ed.events.on("contentChanged", function() {
                        var _selection_anchorNode;
                        var selection = ed.selection.get();
                        if (!selection) {
                            return;
                        }
                        if (!ed.selection.inEditor()) {
                            return;
                        }
                        var $el = $((_selection_anchorNode = selection.anchorNode) === null || _selection_anchorNode === void 0 ? void 0 : _selection_anchorNode.parentElement);
                        var $span = $el.closest("span");
                        if (!$el.length || !$span.length) {
                            return;
                        }
                        if ($span.css("-webkit-text-fill-color") === "rgba(0, 0, 0, 0)" && !$span.parent("span.username").length && !$span.is("span[data-lzt-smilie]")) {
                            $span.contents().unwrap();
                            if ($el.is("b")) {
                                $el.append(FroalaEditor.MARKERS).contents().unwrap();
                                ed.selection.restore();
                            }
                        }
                    });
                };
                FroalaEditor.PLUGINS.offAutosaveOnMessageEditing = function(ed) {
                    var isConversations = function isConversations() {
                        var _$_data;
                        var form = ed.$el.closest("form")[0];
                        return (_$_data = $(form).data("default-action")) === null || _$_data === void 0 ? void 0 : _$_data.startsWith("conversations");
                    };
                    var _init = function _init() {
                        var $form = $(ed.$box[0]).closest("form");
                        $form.on("BbCodeWysiwygEditorAutoSave", function(e) {
                            if (isConversations() && $(".MessageEditingBox").is(":visible")) {
                                e.preventDefault();
                            }
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.resizableEditor = function(ed) {
                    var move = function move(e) {
                        if (startMouseY === null) return;
                        var height = startHeight + (e.pageY - startMouseY);
                        height = Math.max(Math.min(height, maxHeight), minHeight) + "px";
                        ed.$wp.css("height", height);
                        ed.$el.css("min-height", height);
                    };
                    var _init = function _init() {
                        if (ed.$oel.hasClass("LolzteamEditorSimple")) return;
                        minHeight = parseInt(ed.$wp.css("min-height"));
                        if (isNaN(minHeight)) minHeight = 0;
                        maxHeight = parseInt(ed.$wp.css("max-height"));
                        if (isNaN(maxHeight)) maxHeight = 0;
                        $(window1).on("mousemove", move).on("mouseup", function() {
                            if (startMouseY !== null) {
                                resizer.removeClass("moving");
                                $("body").css("cursor", "");
                            }
                            startMouseY = null;
                        });
                        var resizer = $('<div class="fr-resizer"></div>').insertAfter(ed.$wp).on("mousedown", function(e) {
                            startHeight = parseInt(ed.$wp.css("height"));
                            startMouseY = e.pageY;
                            $("body").css("cursor", "pointer");
                            resizer.addClass("moving");
                        });
                    };
                    var startMouseY = null;
                    var startHeight;
                    var minHeight, maxHeight;
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.spacesBetweenBlockquotes = function(ed) {
                    var _init = function _init() {
                        ed.events.on("click", function(e) {
                            var bottomEl = $(document1.elementFromPoint(e.clientX, e.clientY + 10));
                            var aboveEl = $(document1.elementFromPoint(e.clientX, e.clientY - 10));
                            if (!aboveEl.is("blockquote") || !bottomEl.is("blockquote")) {
                                return false;
                            }
                            var selection = ed.selection.get();
                            if (aboveEl.next().is("p") || !selection.isCollapsed) {
                                return;
                            }
                            aboveEl.after("<p>".concat(FroalaEditor.MARKERS, "<br></p>"));
                            ed.selection.restore();
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.this_shit_is_scaring_me = function(ed) {
                    var movePopup = function movePopup(fromReposition) {
                        var $popup = ed.popups.get("link.edit");
                        if (!$popup || !ed.$sc.hasClass("simpleRedactor")) return true;
                        if (fromReposition) oldTop = parseFloat($popup.css("top"));
                        if (ed.$sc.offset().top + ed.$sc.outerHeight() - window1.scrollY >= visualViewport.height && ed.$sc.outerHeight() + 20 > $popup.outerHeight()) {
                            $popup.css("top", oldTop - $popup.outerHeight() * 1.8);
                            return false;
                        } else {
                            $popup.css("top", oldTop);
                            return false;
                        }
                    };
                    var oldTop = 0;
                    $(document1).on("scroll", function() {
                        movePopup();
                    });
                    var origWp = ed.$wp;
                    Object.defineProperty(ed, "$wp", {
                        get: function() {
                            var stack = new Error().stack;
                            if (stack.includes("_repositionPopup")) {
                                if (ed.popups.get("link.edit")) return !movePopup(true) ? false : origWp;
                            }
                            return origWp;
                        },
                        set: function(val) {
                            origWp = val;
                        }
                    });
                };
                FroalaEditor.PLUGINS.smilieDeleteFix = function(ed) {
                    var _init = function _init() {
                        ed.events.on("keydown", function(e) {
                            if (ed.helpers.isMobile() || e.keyCode !== 8 || $(e.target).is(".wysiwygSpoilerInput")) {
                                return;
                            }
                            var selection = ed.selection.get();
                            var node = selection.anchorNode;
                            if (!node) {
                                return;
                            }
                            if (node.nodeType === Node.TEXT_NODE) {
                                node = selection.anchorNode.parentNode;
                            }
                            ed.markers.insert();
                            var marker = $(node).find(".fr-marker")[0];
                            var prev = marker === null || marker === void 0 ? void 0 : marker.previousSibling;
                            if (!prev) {
                                $(marker).remove();
                                return;
                            }
                            while((prev === null || prev === void 0 ? void 0 : prev.nodeType) === Node.TEXT_NODE && (prev === null || prev === void 0 ? void 0 : prev.cloneNode().textContent.replace(/\u200B/, "")) === "" || (prev === null || prev === void 0 ? void 0 : prev.nodeName) === "BR" || (prev === null || prev === void 0 ? void 0 : prev.classList) && (prev === null || prev === void 0 ? void 0 : prev.classList.contains("fr-marker"))){
                                prev = prev.previousSibling;
                            }
                            if ((prev === null || prev === void 0 ? void 0 : prev.nodeName) === "SMILIE") {
                                $(prev).remove();
                            }
                            $(marker).remove();
                        }, true);
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.popupMods = function(ed) {
                    var _init = function _init() {
                        var orig_popups_create = ed.popups.create;
                        ed.popups.create = function(name, template) {
                            if (name === "link.insert") {
                                var $template = $(template.input_layer);
                                $template.find(".fr-action-buttons").prepend('<li><input type="checkbox" style="float: left;" id="unfurl"><label for="unfurl">'.concat(XenForo.htmlspecialchars(ed.language.translate("show_preview")), "</label></li>"));
                                template.input_layer = $template.prop("outerHTML");
                            }
                            var ret = orig_popups_create.apply(this, arguments);
                            if (name === "link.insert") {
                                var $popup = ed.popups.get("link.insert");
                                var $inp = $popup.find("input#unfurl");
                                function droching() {
                                    var _$inp_;
                                    var $input = $popup.find('[id^="fr-link-insert-layer-text-"]');
                                    if ($inp === null || $inp === void 0 ? void 0 : (_$inp_ = $inp[0]) === null || _$inp_ === void 0 ? void 0 : _$inp_.checked) $input.addClass("fr-disabled").attr("disabled", true).val($popup.find('[id^="fr-link-insert-layer-url-"]').val());
                                    else $input.removeClass("fr-disabled").removeAttr("disabled");
                                }
                                $inp.on("change", droching);
                                ed.popups.onShow("link.insert", droching);
                            }
                            return ret;
                        };
                        ed.events.on("commands.after", function(name) {
                            if (name === "linkInsert") {
                                var $link = $(ed.selection.element());
                                if (ed.popups.get("link.insert").find("input#unfurl:checked").length) $link.attr("data-unfurl", true);
                                else $link.removeAttr("data-unfurl");
                            }
                        });
                        ed.events.on("popups.show.link.insert", function() {
                            var $link = ed.$el.find(".fr-marker").last().parent();
                            ed.popups.get("link.insert").find("input#unfurl")[0].checked = !!$link.attr("data-unfurl");
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.fixPopupsHide = function(ed) {
                    var _init = function _init() {
                        var _ed_$el_closest_data;
                        if (!((_ed_$el_closest_data = ed.$el.closest("form").data("default-action")) === null || _ed_$el_closest_data === void 0 ? void 0 : _ed_$el_closest_data.startsWith("conversations"))) {
                            return;
                        }
                        ed.events.on("popups.show.link.edit", function(cmd) {
                            var $popup = ed.popups.get("link.edit");
                            setTimeout(function() {
                                // убедиться шо попап не ушел за пределы редактора в каком-то из случаев
                                if ($popup.css("top") !== "0px" && $popup.hasClass("fr-hidden")) {
                                    $popup.removeClass("fr-hidden");
                                }
                            }, 0);
                        });
                    };
                    return {
                        _init: _init
                    };
                };
                FroalaEditor.PLUGINS.sourceFixMigration = function(ed) {
                    var _init = function _init() {
                        var origbksp = ed.cursor.backspace;
                        ed.cursor.backspace = function() {
                            if (stackTrace()[1].fn === "_middleBackspace") return;
                            return origbksp.apply(arguments, this);
                        };
                    };
                    return {
                        _init: _init
                    };
                };
            },
            registerDialogs: function registerDialogs(editor) {
                Lolzteam.EditorHelpers.dialogs.code = new Lolzteam.EditorDialogCode("lzt_fe_code");
                Lolzteam.EditorHelpers.dialogs.image = new Lolzteam.EditorDialogImage("lzt_fe_image");
                Lolzteam.EditorHelpers.dialogs.media = new Lolzteam.EditorDialogMedia("lzt_fe_media");
            },
            icons: {
                textColor: {
                    FA5NAME: "adjust"
                },
                xfAlign: {
                    FA5NAME: "align-left"
                },
                xfBbCode: {
                    FA5NAME: "brackets"
                },
                xfCode: {
                    FA5NAME: "code"
                },
                xfDraft: {
                    FA5NAME: "save"
                },
                xfInsertGif: {
                    template: "svg",
                    PATH: "M11.5 9H13v6h-1.5zM9 9H6c-.6 0-1 .5-1 1v4c0 .5.4 1 1 1h3c.6 0 1-.5 1-1v-2H8.5v1.5h-2v-3H10V10c0-.5-.4-1-1-1zm10 1.5V9h-4.5v6H16v-2h2v-1.5h-2v-1z"
                },
                xfInsertImage: {
                    FA5NAME: "image"
                },
                xfInsertBlock: {
                    FA5NAME: "plus"
                },
                xfMedia: {
                    FA5NAME: "photo-video"
                },
                xfQuote: {
                    FA5NAME: "quote-right"
                },
                xfSmilie: {
                    FA5NAME: "smile"
                },
                xfSpoiler: {
                    FA5NAME: "flag"
                },
                lztHide: {
                    FA5NAME: "eye-slash"
                },
                lztTemplate: {
                    FA5NAME: "list"
                },
                lztToggleToolbar: {
                    FA5NAME: "toggle-on"
                },
                lztInsert: {
                    FA5NAME: "plus"
                },
                lztCensor: {
                    FA5NAME: "eye-slash"
                },
                lztVisitor: {
                    FA5NAME: "user"
                },
                lztSRCI: {
                    FA5NAME: "terminal"
                }
            },
            commands: {
                xfAlign: {
                    title: "Align",
                    icon: "xfAlign",
                    type: "dropdown",
                    undo: true,
                    focus: false,
                    refreshAfterCallback: true,
                    html: function html() {
                        var commands = [
                            "alignLeft",
                            "alignCenter",
                            "alignRight"
                        ];
                        return Lolzteam.EditorHelpers.buildCommandDropdownHtml(this, commands);
                    }
                },
                xfBbCode: {
                    title: "Toggle BB Code",
                    icon: "xfBbCode",
                    undo: false,
                    focus: false,
                    refreshOnCallback: true,
                    callback: function callback() {
                        this.xfBbCode.toggle();
                    }
                },
                xfCode: {
                    title: "Code",
                    icon: "xfCode",
                    undo: true,
                    focus: true,
                    callback: function callback() {
                        Lolzteam.EditorHelpers.loadDialog(this, "code");
                    }
                },
                xfDraft: {
                    title: "Drafts",
                    icon: "xfDraft",
                    type: "dropdown",
                    focus: true,
                    undo: false,
                    refreshCallback: false,
                    html: function html() {
                        var ed = this;
                        var options = {
                            xfDraftSave: "Save Draft",
                            xfDraftDelete: "Delete Draft"
                        };
                        var output = "";
                        $.each(options, function(key) {
                            output += '<li><a class="fr-command" data-cmd="xfDraft" data-param1="' + key + '">' + ed.language.translate(options[key]) + "</a></li>";
                        });
                        return '<ul class="fr-dropdown-list">' + output + "</ul>";
                    },
                    callback: function callback(cmd, val) {
                        var draft = this.xfDraft;
                        if (val === "xfDraftSave") {
                            draft.save();
                        } else if (val === "xfDraftDelete") {
                            draft.delete();
                        }
                    }
                },
                xfInsertGif: {
                    title: "Insert GIF",
                    icon: "xfInsertGif",
                    undo: false,
                    focus: true,
                    refreshOnCallback: true,
                    callback: function callback() {}
                },
                xfInsertImage: {
                    title: "Insert image",
                    icon: "xfInsertImage",
                    undo: true,
                    focus: true,
                    callback: function callback() {
                        Lolzteam.EditorHelpers.loadDialog(this, "image");
                    }
                },
                xfInsertBlock: {
                    title: "Insert",
                    icon: "xfInsertBlock",
                    type: "dropdown",
                    focus: false,
                    undo: false,
                    refreshCallback: false,
                    html: function html() {
                        var commands = [
                            "xfQuote",
                            "xfSpoiler",
                            "xfCode",
                            "strikeThrough"
                        ];
                        return Lolzteam.EditorHelpers.buildCommandDropdownHtml(this, commands);
                    }
                },
                xfMedia: {
                    title: "Media",
                    icon: "xfMedia",
                    undo: true,
                    focus: true,
                    callback: function callback() {
                        Lolzteam.EditorHelpers.loadDialog(this, "media");
                    }
                },
                xfQuote: {
                    title: "Quote",
                    icon: "xfQuote",
                    undo: true,
                    focus: true,
                    callback: function callback() {
                        var ed = this;
                        //скопировал код из xfSpoiler.insert() т.к. он работает отлично
                        //https://zelenka.guru/threads/6014420/
                        var markerTemplate = '<span class="fr-marker" data-id="0" style="display: none; line-height: 0;">​</span>';
                        var $quote = $("<blockquote>");
                        ed.selection.save();
                        ed.html.wrap(false, true, true);
                        ed.selection.restore();
                        var collapsed = ed.selection.isCollapsed();
                        ed.selection.save();
                        // чел который будет это фиксить после меня,
                        // лучше не надо, оставь как есть.
                        // ОНО ТЕБЯ СОЖРЕТ
                        var _ed_$el__querySelectorAll = editor_sliced_to_array(ed.$el[0].querySelectorAll(".fr-marker"), 2), startEl = _ed_$el__querySelectorAll[0], endEl = _ed_$el__querySelectorAll[1];
                        var startElParents = $(startEl).parents();
                        var endElParents = $(endEl).parents();
                        var mutualParent;
                        // поиск первого общего родительского элемента маркеров
                        mutualParentLoop: for(var i = 0; i < startElParents.length; i++)for(var j = 0; j < endElParents.length; j++)if (startElParents[i] === endElParents[j]) {
                            mutualParent = startElParents[i];
                            break mutualParentLoop;
                        }
                        // выношу маркеры наверх чтобы небыло ЕБУЧИХ ПУСТЫХ ЭЛЕМЕНТОВ
                        while(!startEl.previousSibling && startEl.parentElement && startEl.parentElement !== mutualParent)$(startEl).insertBefore(startEl.parentElement);
                        while(!endEl.nextSibling && endEl.parentElement && endEl.parentElement !== mutualParent)$(endEl).insertAfter(endEl.parentElement);
                        // рекурсивное удаление нод по краям до общего родителя
                        function removeNodes(root, until, fromStart, mutualParent) {
                            if (!root) return;
                            if (fromStart) {
                                while(root.childNodes.length){
                                    if (root.firstChild === until) break;
                                    root.firstChild.remove();
                                }
                            } else {
                                while(root.childNodes.length){
                                    if (root.lastChild === until) break;
                                    root.lastChild.remove();
                                }
                            }
                            if (root !== mutualParent) removeNodes(root.parentNode, root, fromStart, mutualParent);
                        }
                        var selection = mutualParent.cloneNode(true);
                        var _selection_querySelectorAll = editor_sliced_to_array(selection.querySelectorAll(".fr-marker"), 2), clonedStart = _selection_querySelectorAll[0], clonedEnd = _selection_querySelectorAll[1];
                        // обрезка selection по маркерам, с начала и с конца
                        removeNodes(clonedStart.parentNode, clonedStart, true, selection);
                        removeNodes(clonedEnd.parentNode, clonedEnd, false, selection);
                        $(selection).find(".fr-marker").remove();
                        var blockElementSelector = "div, blockquote, ol, li, ul";
                        if (!mutualParent.matches(blockElementSelector)) {
                            if (collapsed) {
                                $("<p><br></p>").prepend($(markerTemplate).attr("data-type", "true")).prepend($(markerTemplate).attr("data-type", "false")).appendTo($quote);
                            } else {
                                $(selection).prepend($(markerTemplate).attr("data-type", "true")).append($(markerTemplate).attr("data-type", "false")).appendTo($quote);
                            }
                        }
                        var afterSelection = mutualParent.cloneNode(true);
                        var _afterSelection_querySelectorAll = editor_sliced_to_array(afterSelection.querySelectorAll(".fr-marker"), 2), afterSelStart = _afterSelection_querySelectorAll[0], afterSelEnd = _afterSelection_querySelectorAll[1];
                        removeNodes(afterSelEnd.parentNode, afterSelEnd, true, afterSelection);
                        removeNodes(startEl.parentNode, startEl, false, mutualParent);
                        $(afterSelection).find(".fr-marker").remove();
                        $(mutualParent).find(".fr-marker").remove();
                        if (!mutualParent.matches(blockElementSelector)) {
                            var isEmptyParagraph = function isEmptyParagraph(el) {
                                if (el.matches(blockElementSelector)) return false;
                                if (!el.childNodes.length) return true;
                                return el.childNodes.length === 1 && el.childNodes[0].matches && el.childNodes[0].matches("br");
                            };
                            $quote.insertAfter(mutualParent);
                            if (isEmptyParagraph(mutualParent)) mutualParent.remove();
                            if (!isEmptyParagraph(afterSelection)) $(afterSelection).insertAfter($quote);
                        } else {
                            // а для блоков просто вставка селекшона в него
                            $quote.append($(selection).children()).prepend(FroalaEditor.START_MARKER).append(FroalaEditor.END_MARKER).appendTo(mutualParent);
                            $(afterSelection).children().insertAfter($quote);
                        }
                        ed.html.unwrap();
                        ed.selection.restore();
                        ed.placeholder.refresh();
                        $quote.children("p:empty").remove();
                    }
                },
                xfSmilie: {
                    title: "Smilies",
                    icon: "xfSmilie",
                    undo: false,
                    focus: true,
                    refreshOnCallback: true,
                    callback: function callback() {}
                },
                xfSpoiler: {
                    title: "Spoiler",
                    icon: "xfSpoiler",
                    undo: true,
                    focus: true,
                    callback: function callback() {
                        this.xfSpoiler.insert();
                    }
                },
                lztHide: {
                    title: "Hidden content",
                    icon: "lztHide",
                    type: "dropdown",
                    focus: false,
                    undo: true,
                    refreshCallback: false,
                    html: function html() {
                        var buttonConfig = ($(this.$oel[0]).data("Lolzteam.EditorSimple") || $(this.$oel[0]).data("Lolzteam.Editor")).options.buttonConfig;
                        var commands = Object.keys(wysiwygHideTags).filter(function(tag) {
                            return !buttonConfig || buttonConfig[tag];
                        }).map(function(tag) {
                            return "xfCustom_".concat(tag);
                        });
                        return Lolzteam.EditorHelpers.buildCommandDropdownHtml(this, commands);
                    }
                },
                lztTemplate: {
                    title: "Templates",
                    icon: "lztTemplate",
                    type: "dropdown",
                    focus: false,
                    undo: true,
                    refreshCallback: false,
                    callback: function callback() {}
                },
                lztToggleToolbar: {
                    title: "Toggle toolbar",
                    icon: "lztToggleToolbar",
                    focus: false,
                    undo: false,
                    refreshCallback: false,
                    callback: function callback() {
                        var self = this, $tb = $(this.$tb), toggleBtn = $(this.$tb.find('.fr-command[data-cmd="lztToggleToolbar"]')).add($(this.$oel[0]).data("Lolzteam.EditorSimple").$ebContainer.find('button[data-cmd="lztToggleToolbar"], div[data-cmd="lztToggleToolbar"]'));
                        var hidden = $tb.css("display") === "none";
                        if (hidden) {
                            $tb.css("height", "").xfSlideDown();
                            $(this.$wp).animate({
                                borderTopLeftRadius: "0px",
                                borderTopRightRadius: "0px"
                            }, 400, function() {
                                $(document1).trigger("lzt-editor:toolbar-toggle", [
                                    self,
                                    true
                                ]);
                            });
                            toggleBtn.css("transform", "rotate(180deg)");
                        } else {
                            $tb.xfSlideUp(undefined, function() {
                                $tb.css("height", "0px");
                            });
                            $(this.$wp).animate({
                                borderTopLeftRadius: "10px",
                                borderTopRightRadius: "10px"
                            }, 400, function() {
                                $(document1).trigger("lzt-editor:toolbar-toggle", [
                                    self,
                                    false
                                ]);
                            });
                            toggleBtn.css("transform", "");
                        }
                    }
                },
                lztVisitor: {
                    title: "Visitor",
                    icon: "lztVisitor",
                    undo: true,
                    focus: true,
                    callback: function callback() {
                        var ed = this;
                        insertFix(ed);
                        ed.selection.save();
                        ed.undo.saveStep();
                        ed.html.insert("[visitor][/visitor]");
                        ed.selection.restore();
                        ed.undo.saveStep();
                    }
                },
                lztCensor: {
                    title: "Censor",
                    icon: "lztCensor",
                    undo: true,
                    focus: true,
                    callback: function callback() {
                        this.xfCensor.insert();
                    }
                },
                lztSRCI: {
                    title: "SRCI",
                    icon: "lztSRCI",
                    undo: true,
                    focus: true,
                    callback: function callback() {
                        this.undo.saveStep();
                        this.xfSrci.insert();
                        this.undo.saveStep();
                    //Lolzteam.EditorHelpers.wrapSelectionText(this, '[SRCI]', '[/SRCI]', true);
                    }
                },
                lztInsert: {
                    title: "Insert",
                    icon: "lztInsert",
                    type: "dropdown",
                    focus: false,
                    undo: true,
                    html: function() {
                        if (this.$box.closest(".profilePoster").length || this.$box.closest(".commentSubmit").length || this.$box.closest(".formOverlay").find(".ppCommentEditActionButtons").length || this.$box.closest(".profilePostEditForm").length) {
                            return Lolzteam.EditorHelpers.buildCommandDropdownHtml(this, [
                                "xfSpoiler",
                                "xfCode",
                                "lztSRCI",
                                "lztCensor",
                                "lztVisitor"
                            ]);
                        } else return Lolzteam.EditorHelpers.buildCommandDropdownHtml(this, [
                            "xfQuote",
                            "xfSpoiler",
                            "xfCode",
                            "lztSRCI",
                            "lztCensor",
                            "lztVisitor"
                        ]);
                    }
                }
            }
        };
        Lolzteam.GiphyBoxTooltip = function($button, params) {
            this.__construct($button, params);
        };
        Lolzteam.GiphyBoxTooltip.prototype = {
            apiKey: "3eFQvabDx69SMoOemSPiYfh9FY0nzO9x",
            baseUrl: "https://api.giphy.com/v1/",
            loadOffset: 0,
            loadLimit: 25,
            loadedAll: false,
            query: "",
            debounceTime: 250,
            savedScroll: 0,
            __construct: function($button, params) {
                var _this = this;
                this.$button = $button;
                this.params = params;
                this.rating = $button.parents(".defEditor").find(".giphyTemplate").data("rating");
                this.$content = $button.parents(".defEditor").find(".giphyTemplate").children().clone().on("click", ".giphyGif", (function(e) {
                    this.params.onInsert($(e.target).data("gif"));
                }).bind(this));
                this.tooltip = XenForo.tippy($button[0], {
                    content: this.$content[0],
                    onShow: function() {
                        if (_this.loadStarted) setTimeout(function() {
                            return _this.$content.find(".giphyWrapper.scroll-content").scrollTop(_this.savedScroll);
                        }, 1);
                        _this.load();
                    },
                    onHide: function() {
                        _this.savedScroll = _this.$content.find(".giphyWrapper.scroll-content").scrollTop();
                    },
                    onMount: function() {
                        _this.updatePopup();
                    },
                    onShown: params.onShown,
                    maxWidth: 9999,
                    lazy: false,
                    boundary: "window"
                }, "popup");
            },
            load: function() {
                return editor_async_to_generator(function() {
                    var data;
                    return editor_ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (this.loadStarted) return [
                                    2
                                ];
                                this.loadStarted = true;
                                return [
                                    4,
                                    this.callApi("randomid")
                                ];
                            case 1:
                                data = _state.sent().data;
                                this.randomId = data.random_id;
                                this.$content.find(".giphySearch").css("display", "").on("input", this.onSearch.bind(this));
                                this.tooltip.popperInstance.update();
                                this.loadNext();
                                this.$content.find(".giphyWrapper").scrollbar().on("scroll", this.onScroll.bind(this));
                                return [
                                    2
                                ];
                        }
                    });
                }).apply(this);
            },
            loadNext: function() {
                return editor_async_to_generator(function() {
                    var resp, params, err1, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, gif, quality;
                    return editor_ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (this.loadedAll) return [
                                    2
                                ];
                                if (this.abortConroller) return [
                                    2
                                ];
                                this.abortConroller = new AbortController();
                                this.$content.find(".spinner").show();
                                this.$content.find(".giphyNotFound").addClass("hidden");
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                params = {
                                    random_id: this.randomId,
                                    offset: this.loadOffset,
                                    limit: this.loadLimit,
                                    bundle: "messaging_non_clips",
                                    rating: this.rating
                                };
                                if (this.query.length) {
                                    params.q = this.query;
                                    params.lang = "ru";
                                }
                                return [
                                    4,
                                    this.callApi(this.query.length ? "gifs/search" : "gifs/trending", params, this.abortConroller.signal)
                                ];
                            case 2:
                                resp = _state.sent();
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                err1 = _state.sent();
                                this.loading = false;
                                if (err1 instanceof DOMException && err1.name === "AbortError") return [
                                    2
                                ];
                                throw err1;
                            case 4:
                                if (!this.loadOffset && resp.data.length === 0) {
                                    this.$content.find(".giphyNotFound").removeClass("hidden");
                                }
                                this.loadOffset += resp.data.length;
                                if (resp.data.length !== this.loadLimit) {
                                    this.$content.find(".spinner").hide();
                                    this.loadedAll = true // в целом похуй
                                    ;
                                }
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                try {
                                    for(_iterator = resp.data[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                        gif = _step.value;
                                        quality = gif.images.fixed_width_small || gif.images.fixed_width || gif.images.original;
                                        if (!quality) continue;
                                        $('<img class="giphyGif">').attr("src", quality.webp).attr("width", quality.width).attr("height", quality.height).attr("alt", gif.title).data("gif", {
                                            url: gif.images.original.webp,
                                            width: gif.images.original.width,
                                            height: gif.images.original.height,
                                            title: gif.title
                                        }).appendTo(this.$content.find(".giphyGifContainer"));
                                    }
                                } catch (err) {
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                } finally{
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                                            _iterator.return();
                                        }
                                    } finally{
                                        if (_didIteratorError) {
                                            throw _iteratorError;
                                        }
                                    }
                                }
                                this.updatePopup();
                                this.abortConroller = null;
                                return [
                                    2
                                ];
                        }
                    });
                }).apply(this);
            },
            callApi: function(path) {
                var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, abortSignal = arguments.length > 2 ? arguments[2] : void 0;
                return editor_async_to_generator(function() {
                    var requestUrl, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step_value, key, value, resp, json;
                    return editor_ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                requestUrl = new URL(path, this.baseUrl);
                                params.api_key = this.apiKey;
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                try {
                                    for(_iterator = Object.entries(params)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                        _step_value = editor_sliced_to_array(_step.value, 2), key = _step_value[0], value = _step_value[1];
                                        requestUrl.searchParams.append(key, value);
                                    }
                                } catch (err) {
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                } finally{
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                                            _iterator.return();
                                        }
                                    } finally{
                                        if (_didIteratorError) {
                                            throw _iteratorError;
                                        }
                                    }
                                }
                                return [
                                    4,
                                    fetch(requestUrl, {
                                        mode: "cors",
                                        signal: abortSignal
                                    })
                                ];
                            case 1:
                                resp = _state.sent();
                                return [
                                    4,
                                    resp.json()
                                ];
                            case 2:
                                json = _state.sent();
                                if (json.meta.status !== 200) throw new Error(json.meta.msg);
                                return [
                                    2,
                                    json
                                ];
                        }
                    });
                }).apply(this);
            },
            onScroll: function(e) {
                if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight - $(e.target).find(".spinner").height()) this.loadNext();
            },
            onSearch: function(e) {
                var _this = this;
                if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(function() {
                    if (_this.abortConroller) {
                        _this.abortConroller.abort();
                        _this.abortConroller = null;
                    }
                    _this.query = $(e.target).val();
                    _this.loadedAll = false;
                    _this.loadOffset = 0;
                    _this.$content.find(".giphyGif").remove();
                    _this.updatePopup();
                    _this.loadNext();
                }, this.debounceTime);
            },
            updatePopup: function() {
                this.$content.find(".giphyWrapper.scroll-content").scrollbar("init");
                this.tooltip.popperInstance.update();
            }
        };
        $(document1).one("lzt-editor:start", Lolzteam.editorStart.startAll);
        XenForo.register("textarea.LolzteamEditor", "Lolzteam.Editor");
        XenForo.register("textarea.LolzteamEditorSimple", "Lolzteam.EditorSimple");
        var $form, editor, templates;
        var localStorageKey = "conversation_templates";
        var supports_html5_storage = function supports_html5_storage() {
            try {
                return "localStorage" in window1 && window1["localStorage"] !== null;
            } catch (e) {
                return false;
            }
        };
        var loadTemplatesFromCache = function loadTemplatesFromCache() {
            if (supports_html5_storage()) {
                var data = localStorage.getItem(localStorageKey);
                if (data) {
                    data = $.parseJSON(data);
                    templates = data.templates;
                    return data;
                }
                return false;
            }
            return false;
        };
        var rebuildTemplatesCache = function rebuildTemplatesCache(data) {
            if (supports_html5_storage()) {
                var json = JSON.stringify(data);
                localStorage.setItem(localStorageKey, json);
            }
        };
        // никита, сегодня у меня вместо секса с твоей мамой был секс с шаблонами
        // спасибо тебе, никита, твоя мать очень жирная и некрасивая
        XenForo.InsertConversationTemplate = function($template) {
            $template.on("click", function(e) {
                e.preventDefault();
                var ed = $template.closest("#ConversationTemplates").data("lzt-fe-ed");
                ed.selection.restore();
                insertFix(ed);
                ed.undo.saveStep();
                if (!ed.selection.isCollapsed()) {
                    ed.cursor.backspace();
                }
                var result = $template.find(".ContentHtml").html().trim();
                result = result.replace(/\n/g, "<br>");
                var toInsert = "";
                result.split("<br>").map(function(elem) {
                    if (result.split("<br>").indexOf(elem) === 0) toInsert = toInsert + "<span>".concat(elem, "</span>");
                    else toInsert = toInsert + "<p>".concat(elem, "</p>");
                });
                ed.html.insert(toInsert);
                ed.undo.saveStep();
                ed.selection.save();
            });
        };
        XenForo.ConversationTemplateCreateForm = function($form) {
            $form.on("AutoValidationComplete", function(e) {
                e.preventDefault(e);
                var templateId = $(e.ajaxData.templateHtml).attr("id");
                if (e.ajaxData.templateUpdated) {
                    $(".ConversationTemplates").find("#" + templateId).remove();
                }
                var $lztTemplateButton = $('div[data-cmd="lztTemplate"]');
                var $tippy = $($lztTemplateButton[$lztTemplateButton.length - 1]._tippy.popper);
                if (!e.ajaxData.templateHtml && e.ajaxData._redirectStatus === "ok") {
                    var templateId = $form.find("[name='template_id']").val();
                    $(".ConversationTemplates").find("#ctemplate-" + templateId).remove();
                    $tippy.find("#ConversationTemplateList").find("#ctemplate-" + templateId).remove();
                    $(".TemplatesTooltip").each(function() {
                        var $content = $("<div>").append($(".ConversationTemplates").clone()[0]);
                        $content.find("a:not(.OverlayTrigger)").each(function() {
                            $(this).addClass("OverlayTrigger");
                        });
                        $(this).get(0)._tippy.setContent($content.html());
                    });
                    if ($tippy.find("#ConversationTemplateList").children().length < 1) {
                        $tippy.find("#ConversationTemplates .NoTemplates").show();
                    }
                }
                var $list = $("#ConversationTemplateList");
                $(e.ajaxData.templateHtml).xfInsert("prependTo", "#ConversationTemplateList", "xfFadeIn", 50, function() {
                    $list.find(".template").removeAttr("style");
                    var data = loadTemplatesFromCache();
                    if (!data) {
                        data = {
                            "last_check": XenForo.serverTimeInfo.now
                        };
                    }
                    data.templates = $list.html();
                    rebuildTemplatesCache(data);
                    if (e.ajaxData.templateUpdated) {
                        $tippy.find("#ConversationTemplateList").find("#" + templateId).replaceWith(e.ajaxData.templateHtml);
                    } else {
                        $form[0].reset();
                        $tippy.find("#ConversationTemplates .NoTemplates").hide();
                        $tippy.find("#ConversationTemplateList").append(e.ajaxData.templateHtml);
                    }
                    XenForo.create("XenForo.InsertConversationTemplate", "#" + templateId + " .InsertTemplate");
                    XenForo.create("XenForo.ConversationTemplateDelete", "#" + templateId + " .DeleteTemplate");
                    $(".TemplatesTooltip").each(function() {
                        var $content = $("<div>").append($(".ConversationTemplates").clone()[0]);
                        $content.find("a:not(.OverlayTrigger)").each(function() {
                            $(this).addClass("OverlayTrigger");
                        });
                        $(this).get(0)._tippy.setContent($content.html());
                    });
                });
                $("#ConversationTemplates .NoTemplates").hide();
                var $overlay = $form.parents(".xenOverlay").data("overlay");
                // if animations are disabled, decaching can happen too quickly
                setTimeout(function() {
                    $overlay.close();
                }, 0);
            });
        };
        XenForo.ConversationTemplateDelete = function($button) {
            var callback = function callback(ajaxData) {
                if (!XenForo.hasResponseError(ajaxData)) {
                    var templateId = $button.closest(".template").attr("id");
                    $(".ConversationTemplates").find("#" + templateId).remove();
                    var $list = $("#ConversationTemplateList");
                    if ($list.find(".InsertTemplate").length < 1) {
                        $("#ConversationTemplates .NoTemplates").show();
                        localStorage.removeItem(localStorageKey);
                    } else {
                        var data = loadTemplatesFromCache();
                        if (data) {
                            data.templates = $list.html();
                            rebuildTemplatesCache(data);
                        }
                    }
                    $(".TemplatesTooltip").each(function() {
                        var $content = $("<div>").append($(".ConversationTemplates").clone()[0]);
                        $content.find("a:not(.OverlayTrigger)").each(function() {
                            $(this).addClass("OverlayTrigger");
                        });
                        $(this).get(0)._tippy.setContent($content.html());
                        $(".ConversationTemplates").xfActivate();
                    });
                }
            };
            $button.off("click").on("click", function(e) {
                e.preventDefault();
                XenForo.ajax($button.attr("href"), {}, callback, {
                    type: "POST"
                });
            });
        };
        XenForo.register(".InsertTemplate", "XenForo.InsertConversationTemplate");
        XenForo.register(".DeleteTemplate", "XenForo.ConversationTemplateDelete");
        XenForo.register("#ConversationTemplateCreateForm", "XenForo.ConversationTemplateCreateForm");
    }(jQuery, window, document);
    
    })();
    