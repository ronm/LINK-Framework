var SmoothScroll = require("../vendors/SmoothScroll/smoothscroll");
var Waybetter = require("../vendors/Waybetter/waybetter");
var $http = require("../vendors/Http/http");

/*jshint esnext: true */

(function() {

	/* CONFIG */
	
	/*
	sample
	Framework({ hamburger: "#hamburger", scrollThreshold: 70 });
	*/

	var htmlClass = document.documentElement.classList,
		defaults = {
			collapsibleSelector: ".collapsible",
			externalLinks: true,
			hamburger: "#hamburger",
			//hamburger: null,
			jumpLinks: true,
			navOpenClass: "nav-enabled",
			retinaImage: ".retina-image",
			scrollAttr: "minimal",
			scrollAttrIgnoreInterior: false,
			scrollIgnoreMQ: '(min-width:1025px)',
			scrollOffset: document.querySelector("header"),
			scrollOnLoad: true,
			scrollThreshold: 70,
			//scrollThreshold: null,
			waybetter: true,
			

			// auto formstyle
		};

	var Framework = function(opts) {
		var settings = Object.assign(defaults, opts);
		
		
		function _init() {
			if ( settings.retinaImage ) {
				_processRetinaImages();
			}
			
			if ( settings.externalLinks === true ) {
				_processExternalLinks();
			}
				
			if ( settings.hamburger ) {
				_watchHamburger();
			}
				
			if ( settings.scrollThreshold ) {
				_watchHeader();
			}
			
			if ( settings.scrollOnLoad ) {
				_scrollOnLoad();
			}
				
			if ( settings.jumpLinks ) {
				_watchJumpLinks();
			}
			
			if ( settings.waybetter ) {
				_processWaybetter();
			}
			
			if ( settings.collapsibleSelector ) {
				_processCollapsible();
			}
		}
		
		function _processRetinaImages() {
			[].slice.apply(document.querySelectorAll(settings.retinaImage)).forEach(img => {
				if ( img.tagName.toLowerCase() === "img" ) { 
					if ( img.complete ) { 
						_cutRetinaInHalf(img); 
					} else {
						img.addEventListener("load", () => _cutRetinaInHalf(img));
					}
				} else {
					[].slice.apply(img.querySelectorAll("img")).forEach(img => {
						if ( img.complete ) { 
							_cutRetinaInHalf(img); 
						} else {
							img.addEventListener("load", () => _cutRetinaInHalf(img));
						}
					});
				}
			});
		}
		
		function _watchHamburger() {
			let hamburger = document.querySelector(settings.hamburger);

			if ( hamburger ) {	
				hamburger.addEventListener("click", evt => {
					evt.preventDefault();
					if ( htmlClass.contains(settings.navOpenClass) ) {
						_closeNav();
					} else { 
						_openNav();
					}
				});
			}
			// mobile navigation
		}
		
		function _watchHeader() {
			// add class on scroll threshold
			var header = document.querySelector("header"),
				mql = window.matchMedia(settings.scrollIgnoreMQ),
				mqlListen = () => {
					if (!settings.scrollAttrIgnoreInterior || settings.scrollAttrIgnoreInterior() === true) { 
						if ( mql.matches === true ) {
							//_closeNav();
							if (window.pageYOffset < settings.scrollThreshold ) { 
								document.documentElement.removeAttribute(settings.scrollAttr);				
							} else if ( header.getBoundingClientRect().top <= 0 ) {
								document.documentElement.setAttribute(settings.scrollAttr, "");
							}
						} else {
							document.documentElement.setAttribute(settings.scrollAttr, "");
						}
					}
				};

			mqlListen();
			window.addEventListener("scroll", mqlListen);
			window.addEventListener("resize", mqlListen);
			// add class on scroll threshold
		}
		
		function _scrollOnLoad() {
			//smoothscroll to jump link on page load
			if ( window.location.hash && document.querySelector(window.location.hash) ) {
				new SmoothScroll( window.location.hash, { offset: settings.scrollOffset });
			}	
		}
		
		function _watchJumpLinks() {
			// jump links
			document.addEventListener("click", evt => {
				var t = evt.target;
				if ( t.hash && document.querySelector(t.hash) ) {
					evt.preventDefault();
					history.pushState(null,null, t.href);
					_closeNav();
					new SmoothScroll( t.hash, { offset: settings.scrollOffset });
				}
			});
		}
		
		function _processWaybetter() {
			// 	WayBetter Animations
			[].slice.apply(document.querySelectorAll("[waybetter-watch]")).forEach(el => new Waybetter(el));
		}
		
		function _processExternalLinks() {
			// open external links in new window
			document.addEventListener("click", function(e) {
				var a = _getTag(e.target) === "a" ? e.target : ( _getTag(e.target.parentNode) === "a" ? e.target.parentNode : null );
				if ( a && a.host !== window.location.host && !a.matches(".exclude") ) {
					e.preventDefault();
					let w = window.open( a.href );
					w.opener = null;
				}
			});
		}

		function _processCollapsible() {
			[].slice.apply(document.querySelectorAll(settings.collapsibleSelector)).forEach(collapsible => {
			    let items = [].slice.apply( collapsible.children );
			    items.forEach(item => {
			    	let trigger = item.children[0],
			        	content = item.children[1];
			      
					trigger.addEventListener("click", () => {
			        	let active = items.find(i => i.classList.contains("active"));
						if ( active ) { 
							active.classList.remove("active");
							active.children[1].style.height = 0;
						}
			        
						if (active !== trigger.parentNode ) {
							let height = [].slice.apply(trigger.nextElementSibling.children).reduce((a,b) => {
								let style = window.getComputedStyle(b);
								return a + parseFloat(style.height) + 
									       parseFloat(style.paddingTop) + 
    									   parseFloat(style.paddingBottom) + 
									       parseFloat(style.marginTop) + 
									       parseFloat(style.marginBottom);
							}, 0);
							
							trigger.parentNode.classList.add("active");
							trigger.nextElementSibling.style.height = height + 'px';
			        	}
			      	});
			    });
			});
		}
		
		
		function _cutRetinaInHalf(img) { 
			img.width = img.naturalWidth/2;
		}
		
		function _closeNav(immediate) {
			if ( immediate ) { htmlClass.add("immediate"); }
			htmlClass.remove(settings.navOpenClass);
		}
		
		function _openNav() {
			htmlClass.add(settings.navOpenClass);
		}
		
		function _getTag(el) { 
			return el && el.tagName && el.tagName.toLowerCase();
		}
		
		_init();
	};

	Framework.$http = $http;
	Framework.SmoothScroll = SmoothScroll;
	Framework.Waybetter = Waybetter;

	window.Framework = Framework;

})();

(function(window) {
	/**
	 * Move page tabs into administration menu.
	 */
	if (typeof window.drupalSettings !== "undefined" && typeof window.drupalSettings.toolbar !== "undefined") {
    	var tabs = document.querySelector('ul.button-group');
    	if (tabs) {
	    	tabs.style.margin = 0;
	    	[].slice.apply(tabs.children).forEach(function(li) { li.classList.add("admin-menu-tab"); });
			document.querySelector('.toolbar-menu-administration').appendChild( tabs );
		}
	}
})(window);

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