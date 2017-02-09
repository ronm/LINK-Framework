/**************************/
/*** waybetter ************/
/*** by Ron Marcelle ******/
/*** Licensed under MIT ***/
/**************************/

/*jshint esnext: true */

class Waybetter {
      
    constructor(els, threshold = 0) {
        this.els = Array.isArray(els) ? els : [els];
        this.threshold = threshold;
        this.viewport = window;
        ["scroll", "resize"].forEach(e => this.viewport.addEventListener(e, () => this._process()));
    }

    refresh() {
        this._process();
    }
  
    _createEvent(evName) {  
          let evt;
        try {
            evt = new Event("waybetter." + evName + "view", { 'bubbles': true });
        } catch (e) {
            evt = document.createEvent('Event');
            evt.initEvent("waybetter." + evName + "view", true, true);
        }

	      return evt;
      }
  
    _isInView(el) {     
        let bounds = el.getBoundingClientRect();
        return (bounds.bottom + this.threshold >= 0 && bounds.top + this.threshold <= this.viewport.innerHeight ) &&  
				         (bounds.right + this.threshold >= 0 && bounds.left + this.threshold <= this.viewport.innerWidth);
      }

    _process() {
        this.els.forEach(el => {
		    let inview = this._isInView(el);
	        if ( (inview && !el.inview) || (!inview && el.inview) ) {
                el.inview = inview;
				if ( inview ) {
					el.setAttribute("waybetter", "");
				} else { 
					el.removeAttribute("waybetter");
				}
        
                requestAnimationFrame(() => el.dispatchEvent( this._createEvent(inview ? "in" : "out") ));
		    }
	    });
    }
}

module.exports = Waybetter;