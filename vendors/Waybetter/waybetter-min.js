"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();!function(e){var t=function(){function t(r){var n=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;_classCallCheck(this,t),this.els=Array.isArray(r)?r:[r],this.threshold=i,this.viewport=e,["scroll","resize"].forEach(function(e){return n.viewport.addEventListener(e,function(){return n._process()})})}return _createClass(t,[{key:"refresh",value:function e(){this._process()}},{key:"_createEvent",value:function e(t){var r=void 0;try{r=new Event("waybetter."+t+"view",{bubbles:!0})}catch(e){r=document.createEvent("Event"),r.initEvent("waybetter."+t+"view",!0,!0)}return r}},{key:"_isInView",value:function e(t){var r=t.getBoundingClientRect();return r.bottom+this.threshold>=0&&r.top+this.threshold<=this.viewport.innerHeight&&r.right+this.threshold>=0&&r.left+this.threshold<=this.viewport.innerWidth}},{key:"_process",value:function e(){var t=this;this.els.forEach(function(e){var r=t._isInView(e);(r&&!e.inview||!r&&e.inview)&&(e.inview=r,r?e.setAttribute("data-waybetter",""):e.removeAttribute("data-waybetter"),requestAnimationFrame(function(){return e.dispatchEvent(t._createEvent(r?"in":"out"))}))})}}]),t}(),r=Array.from(document.querySelectorAll("[data-waybetter-watch]"));r.length&&new t(r),e.Framework.SmoothScroll=SmoothScroll}(window);