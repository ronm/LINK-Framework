/**************************/
/*** waybetter ************/
/*** by Ron Marcelle ******/
/*** Licensed under MIT ***/
/**************************/
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
    var Waybetter = function () {
        function Waybetter(els) {
            var _this = this;

            var threshold = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            _classCallCheck(this, Waybetter);

            this.els = Array.isArray(els) ? els : [els];
            this.threshold = threshold;
            this.viewport = window;
            ["scroll", "resize"].forEach(function (e) {
                return _this.viewport.addEventListener(e, function () {
                    return _this._process();
                });
            });
        }

        Waybetter.prototype.refresh = function refresh() {
            this._process();
        };

        Waybetter.prototype._createEvent = function _createEvent(evName) {
            var evt = undefined;
            try {
                evt = new Event("waybetter." + evName + "view", { 'bubbles': true });
            } catch (e) {
                evt = document.createEvent('Event');
                evt.initEvent("waybetter." + evName + "view", true, true);
            }

            return evt;
        };

        Waybetter.prototype._isInView = function _isInView(el) {
            var bounds = el.getBoundingClientRect();
            return bounds.bottom + this.threshold >= 0 && bounds.top + this.threshold <= this.viewport.innerHeight && bounds.right + this.threshold >= 0 && bounds.left + this.threshold <= this.viewport.innerWidth;
        };

        Waybetter.prototype._process = function _process() {
            var _this2 = this;

            this.els.forEach(function (el) {
                var inview = _this2._isInView(el);

                if (inview && !el.inview || !inview && el.inview) {
                    el.inview = inview;
                    inview ? el.setAttribute("data-waybetter", "") : el.removeAttribute("data-waybetter");
                    requestAnimationFrame(function () {
                        return el.dispatchEvent(_this2._createEvent(inview ? "in" : "out"));
                    });
                }
            });
        };

        return Waybetter;
    }();

    var watch = Array.from(document.querySelectorAll('[data-waybetter-watch]'));
    if (watch.length) {
        new Waybetter(watch);
    }

    if (typeof define === 'function' && _typeof(define.amd) === 'object' && define.amd) {
        define(function () {
            return Waybetter;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Waybetter.attach;
        module.exports.Waybetter = Waybetter;
    } else {
        window.Waybetter = Waybetter;
    }
})(window);