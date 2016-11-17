/**************************/
/*** smoothScroll ************/
/*** by Ron Marcelle ******/
/*** Licensed under MIT ***/
/**************************/
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var SmoothScroll = function () {
    function SmoothScroll() {
      var target = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _classCallCheck(this, SmoothScroll);

      var offset = null;
      this.target = null;
      this.targetOrig = target;
      this.startPos = null;
      this.start = null;

      this.settings = this._mergeObjects({}, this._defaults(), opts);
      offset = this.settings.offset;
      if (offset) {
        this.settings.offset = isNaN(offset) ? this._getElement(offset).clientHeight : Number(offset);
      }

      this._start();
    }

    SmoothScroll.prototype._scroll = function _scroll() {
      var _this = this;

      var percentage = (Date.now() - this.start) / this.settings.speed,
          be = this.startPos + (this.target - this.startPos) * percentage;

      if (percentage < 1) {
        window.scrollTo(window.scrollX, be);
        window.requestAnimationFrame(function () {
          return _this._scroll();
        });
      } else {
        window.scrollTo(window.scrollX, this.target);
        if (this.settings.callback) {
          this.settings.callback.call(this.target);
        }
      }
    };

    SmoothScroll.prototype._start = function _start() {

      var target = isNaN(this.targetOrig) ? this._getElementPosition(this.targetOrig) - this.settings.offset : Math.max(0, Number(this.targetOrig));
      this.target = target < 0 ? window.pageYOffset + target : target;
      this.startPos = window.pageYOffset;
      this.start = Date.now();
      console.log(this.target);
      this._scroll();
    };

    SmoothScroll.prototype._getElement = function _getElement(el) {
      return el instanceof HTMLElement ? el : document.querySelector(el);
    };

    SmoothScroll.prototype._getElementPosition = function _getElementPosition(el) {
      return Math.floor(this._getElement(el).getBoundingClientRect().top + this.startPos);
    };

    SmoothScroll.prototype._mergeObjects = function _mergeObjects() {
      var result = {};
      for (var i = 0; i < arguments.length; i += 1) {
        var obj = arguments[i],
            keys = Object.keys(obj),
            j = 0;
        for (; j < keys.length; j += 1) {
          result[keys[j]] = obj[keys[j]];
        }
      }

      return result;
    };

    SmoothScroll.prototype._defaults = function _defaults() {
      return {
        speed: 300,
        offset: null,
        callback: null
      };
    };

    return SmoothScroll;
  }();

  //let watch = Array.from( document.querySelectorAll('[data-waybetter-watch]') );
  //if ( watch.length ) { new Waybetter(watch); }

  if (typeof define === 'function' && _typeof(define.amd) === 'object' && define.amd) {
    define(function () {
      return SmoothScroll;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothScroll.attach;
    module.exports.SmoothScroll = SmoothScroll;
  } else {
    window.SmoothScroll = SmoothScroll;
  }
})();