/**************************/
/*** smoothScroll ************/
/*** by Ron Marcelle ******/
/*** Licensed under MIT ***/
/**************************/

/*jshint esnext: true */

class SmoothScroll {
  
    constructor(target = null, opts = {}) {
        this.target = null;
        this.targetOrig = target;
        this.startPos = null;
        this.start = null;
      
        this.settings = Object.assign({}, this._defaults(), opts);

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
      	this.startPos = window.pageYOffset;

        let offset = isNaN(this.settings.offset) ? this._getElement(this.settings.offset).clientHeight : Number(this.settings.offset);
		let target = isNaN(this.targetOrig) ? (this._getElementPosition(this.targetOrig) - offset) : Math.max(0,Number(this.targetOrig)); 

		this.target = target < 0 ? (window.pageYOffset + target) : target;			
		this.start = Date.now();
		this._scroll();
    }
  
    _getElement(el) { 
      return el instanceof HTMLElement ? el : document.querySelector(el); 
    }
  
    _getElementPosition(el) {
      return Math.floor(this._getElement(el).getBoundingClientRect().top + this.startPos);
    }
  
    _defaults() {
      return {
        speed: 300,
        offset: null,
        callback: null,
      };
  	}
  }
    
//let watch = Array.from( document.querySelectorAll('[data-waybetter-watch]') );
//if ( watch.length ) { new Waybetter(watch); }

module.exports = SmoothScroll;