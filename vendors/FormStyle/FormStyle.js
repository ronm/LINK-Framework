/**************************/
/*** StyleForm ************/
/*** by Ron Marcelle ******/
/*** Licensed under MIT ***/
/**************************/
(function() {
  
  /* FORM: SELECTS */
  class StyleSelect {
    
    constructor(element = null) {
      let options = [].slice.apply(element.children),
      		wrapper = document.createElement('div'),
  		    optionsWrapper = document.createElement('div');
      
      element.styleProcessed = true;
      wrapper.classList.add("select-wrapper");
		  optionsWrapper.classList.add("options-wrapper");
			
		  if ('ontouchstart' in window) { wrapper.classList.add("touch"); }

		  element.addEventListener("change", () => {
			  optionsWrapper.querySelector(".active ").classList.remove("active");
			  optionsWrapper.children[element.selectedIndex].classList.add("active");
		  });
      
      optionsWrapper.addEventListener("click", (e) => {
        e.stopPropagation();

        if ( optionsWrapper.parentNode.classList.contains("open") ) {
          var i;
          Array.from( optionsWrapper.children ).forEach(function(el, n) { if (el.contains( e.target ) || el === e.target) { i = n; } });
          this.set( i );
          this.close();				
        } else {
          this.open();
        }
      });

      options.forEach((o,i) => {
        var temp = `<div class="item${(o.selected?' active':'')}"><div class="item-wrapper">${o.innerHTML}</div></div>`;
        if ( o.selected ) { this.active = i; }
        optionsWrapper.innerHTML += temp;
      });

      wrapper.style.width = `calc(${element.clientWidth}px + 4rem)`;
      element.parentNode.insertBefore(wrapper, element);
      wrapper.appendChild(element);
      wrapper.appendChild(optionsWrapper);
      wrapper.style.height = optionsWrapper.children[this.active].clientHeight + "px";
      
      this.element = element;
      this.wrapper = wrapper;
      this.optionsWrapper = optionsWrapper;
      this.options = options;
    }
   
    
    open() {
			this.wrapper.classList.add("open");
      this.close = () => { this._close(this); };
			document.documentElement.addEventListener("click", this.close);
		}
			
    close() {}
    
		_close() {
  	  Array.from(document.querySelectorAll('.select-wrapper.open')).forEach(el => el.classList.remove("open"));
		  document.documentElement.removeEventListener("click", this.close);
      this.close = null;
		}

		set(i) { 
			var change;

			try {
				change = new Event("change", { 'bubbles': true });
			} catch (e) {
				change = document.createEvent('Event');
				change.initEvent('change', true, true);
			}

			this.options[i].selected = true;
			this.element.dispatchEvent(change);
		} 
  }
	/* FORM: SELECTS */
  
  
  /* FORM: CHECKBOXES & RADIOS*/		
  class StyleInput {
    constructor(element) {
      let wrapper = document.createElement('span'),
		      takeover = wrapper.cloneNode();

      element.styleProcessed = true;
      wrapper.classList.add("form-item-takeover");
      wrapper.setAttribute("data-type", element.type);
			element.parentNode.insertBefore(wrapper, element);
			wrapper.appendChild(element);
			wrapper.appendChild(takeover);
      
	    takeover.classList.add("takeover");
    }
  } 
  /* FORM: CHECKBOXES & RADIOS*/
  
  class StyleForm {

    constructor(elements = Array.from(document.querySelectorAll('select,input[type="checkbox"],input[type="radio"]'))) {
      this.elements = [];
      this.watching = false;
      this.add(elements);
    }

    add(elements) {
      (Array.isArray(elements) ? elements : [elements]).forEach(element => {
        if ( element.tagName.toLowerCase() === "select" ) {
          this.elements.push(new StyleSelect(element));
        } else {
          this.elements.push(new StyleInput(element));
        }
      });
    }

    watch() {
      if ( "MutationObserver" in window && !this.watching ) {
        var observer = new MutationObserver(function(mutations){
          mutations.filter(function(m) {try { return m.addedNodes[0].nodeType === 1; } catch(e) { return false; } })
           .map(function(m) { return m.addedNodes[0]; })
           .forEach(function(n) { 
              if (!n.styleProcessed) {
                var tagName = n.tagName && n.tagName.toLowerCase();
                if ( tagName === "input" && ["checkbox","radio"].indexOf(n.type) > -1 ) {
                  new StyleInput(n);
                } else if ( tagName === "select" ) {
                  new StyleSelect(n);
                }
              }
          });
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });      

        this.watching = true;
      }
    }
  }

  
  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define(() => StyleForm);
  } else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = StyleForm.attach;
  	module.exports.StyleForm = StyleForm;
	} else {
	  window.StyleForm = StyleForm;
	}
  
  
  
})();