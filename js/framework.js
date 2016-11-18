(function() {
	
	/* CONFIG */
	
	var scrollThreshold = 70,
		mediaQuery = '(min-width:1025px)',
		headerScrolledClass = 'minimal',
		mobileNavOpenClass = 'nav-enabled',
		hamburgerSelector = "#hamburger";
	
	
	
	
	var htmlClass = document.documentElement.classList;

	// Retina Images
	function cutRetinaInHalf(img) { img.width/=2; };
	[].slice.apply(document.querySelectorAll(".retina-image")).forEach(function(img) {
		if ( img.tagName.toLowerCase() === "img" ) { cutRetinaInHalf(img); } 
		else {
			[].slice.apply(img.querySelector("img")).forEeach(function(img) {
				if ( img.complete ) { cutRetinaInHalf(img); } else {
					img.addEventListner("load", function() { cutRetinaInHalf(img); });
				}
			})
		}
	});	
	// Retina Images
	
	
	// add class on scroll threshold
	if ( scrollThreshold ) {
		var header = document.querySelector("header")
			mql = window.matchMedia(mediaQuery),
			mqlListen = function() {
				if ( mql.matches === true ) {
					mobileNavClose();
					if (window.pageYOffset < scrollThreshold ) { 
						htmlClass.remove(headerScrolledClass);				
					} else if ( header.getBoundingClientRect().top <= 0 ) {
						htmlClass.add(headerScrolledClass);
					}
				} else {
					htmlClass.add(headerScrolledClass);
				}
			};
	
		mqlListen();
		window.addEventListener("scroll", mqlListen);
		window.addEventListener("resize", mqlListen);
	}	
	// add class on scroll threshold


	// mobile navigation
	var navEnabeld = false;
	function mobileNavClose(immediate) {
		navEnabeld = false;	
		if ( immediate ) { htmlClass.add("immediate"); }
		htmlClass.remove(mobileNavOpenClass);
	};
	function mobileNavOpen() {
		navEnabeld = true;	
		htmlClass.add(mobileNavOpenClass);
	};
	// touch nav toggle
	document.querySelector(hamburgerSelector).addEventListener("click", function(evt) {
		evt.preventDefault();
		navEnabeld === false ? mobileNavOpen() : mobileNavClose();
	});
	// mobile navigation
	
	
	
	
	/**
	 * Move page tabs into administration menu.
	 */
	
	if (typeof window.drupalSettings !== "undefined" && typeof drupalSettings.toolbar !== "undefined") {
    	var tabs = document.querySelector('ul.button-group');
    	tabs.style.margin = 0;
    	[].slice.apply(tabs.children).forEach(function(li) { li.classList.add("admin-menu-tab"); });
		document.querySelector('.toolbar-menu-administration').appendChild( tabs );
		console.log( tabs );
	}	
	
	
	//notes
	/*
	// style up checkboxes
	var styleForm = new StyleForm(),
	styleForm.watch();

	// polyfill
	if (!Element.prototype.matches) { Element.prototype.matches = Element.prototype.msMatchesSelector; }
	
	// hash stuff
	document.addEventListener("click", function(e) {
		if (e.target.matches('a') && document.querySelector(this.hash)) {
			evt.preventDefault();
			mobileNavClose(true);

			new SmoothScroll(hash, { offset: (mql.matches ? 100 : 0), callback() {
				htmlClass.remove("immediate");	
			} });
		}
	});
	
	// if hash in url lets smoothscroll to it
	if ( location.hash ) {
		if ( document.querySelector(location.hash) ) {
			window.requestAnimationFrame(function() {
				new SmoothScroll(location.hash, { offset: (mql.matches ? 100 : 0) });
			});
		}
	}
	*/
})();