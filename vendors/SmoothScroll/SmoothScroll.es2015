/**************************/
/*** smoothScroll ************/
/*** by Ron Marcelle ******/
/*** Licensed under MIT ***/
/**************************/
(function(){
    class SmoothScroll {
      
        constructor(target = null, opts = {}) {
            let offset = null;
            this.target = null;
            this.targetOrig = target;
            this.startPos = null;
            this.start = null;
          
            this.settings = this._mergeObjects({}, this._defaults(), opts);
            offset = this.settings.offset;
            if ( offset ) {
              this.settings.offset = isNaN(offset) ? this._getElement(offset).clientHeight : Number(offset);
            }

            this._start();
        }

        _scroll() {
		      		let percentage = (Date.now() - this.start) / this.settings.speed,
                  be = this.startPos + ((this.target - this.startPos) * percentage);

              if ( percentage < 1 ) {
    				    window.scrollTo(window.scrollX, be);
        				window.requestAnimationFrame(() => this._scroll());
		        	} else {
				        window.scrollTo(window.scrollX, this.target);
        				if ( this.settings.callback ) { this.settings.callback.call(this.target); }
		    	    }
        }
        
        _start() {
          
          let target = isNaN(this.targetOrig) ? (this._getElementPosition(this.targetOrig) - this.settings.offset) : Math.max(0,Number(this.targetOrig)); 
          this.target = target < 0 ? (window.pageYOffset + target) : target;
          this.startPos = window.pageYOffset;
          this.start = Date.now();
          console.log( this.target );
          this._scroll();
        }
      
        _getElement(el) { 
          return el instanceof HTMLElement ? el : document.querySelector(el); 
        }
      
        _getElementPosition(el) {
          return Math.floor(this._getElement(el).getBoundingClientRect().top + this.startPos);
        }
      
        _mergeObjects() {
          let result = {};
          for(var i=0; i < arguments.length; i += 1) {
            let obj = arguments[i], keys = Object.keys(obj), j = 0;
            for(;j<keys.length;j+=1) { result[keys[j]] = obj[keys[j]]; }
          }

          return result;
        }
      
        _defaults() {
          return {
            speed: 300,
            offset: null,
            callback: null,
          }
      }
	  }
    
	  //let watch = Array.from( document.querySelectorAll('[data-waybetter-watch]') );
    //if ( watch.length ) { new Waybetter(watch); }

    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    		define(() => SmoothScroll);
  	} else if (typeof module !== 'undefined' && module.exports) {
		    module.exports = SmoothScroll.attach;
    		module.exports.SmoothScroll = SmoothScroll;
	  } else {
		  window.SmoothScroll = SmoothScroll;
	  }
})();
