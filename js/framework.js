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
		navEnabled = false,
		defaults = {
			collapsibleSelector: ".collapsible",
			externalLinks: true,
			hamburger: "#hamburger",
			//hamburger: null,
			jumpLinks: true,
			navOpenClass: "nav-enabled",
			retinaImage: ".retina-image",
			scrollClass: "minimal",
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
				navEnabled = false;
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
			Array.from(document.querySelectorAll(settings.retinaImage)).forEach(img => {
				if ( img.tagName.toLowerCase() === "img" ) { _cutRetinaInHalf(img); } 
				else {
					Array.from(img.querySelectorAll("img")).forEeach(img => {
						if ( img.complete ) { _cutRetinaInHalf(img); } else {
							img.addEventListner("load", () => _cutRetinaInHalf(img));
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
					if ( navEnabled === false ) {
						_openNav();
					} else { 
						_closeNav();
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
					if ( mql.matches === true ) {
						//_closeNav();
						if (window.pageYOffset < settings.scrollThreshold ) { 
							htmlClass.remove(settings.scrollClass);				
						} else if ( header.getBoundingClientRect().top <= 0 ) {
							htmlClass.add(settings.scrollClass);
						}
					} else {
						htmlClass.add(settings.scrollClass);
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
			Array.from(document.querySelectorAll("[waybetter-watch]")).forEach(el => new Waybetter(el));
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
			Array.from(document.querySelectorAll(settings.collapsibleSelector)).forEach(collapsible => {
			    let items = Array.from( collapsible.children );
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
							let height = Array.from(trigger.nextElementSibling.children).reduce((a,b) => {
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
			img.width/=2;
		}
		
		function _closeNav(immediate) {
			navEnabled = false;	
			if ( immediate ) { htmlClass.add("immediate"); }
			htmlClass.remove(settings.navOpenClass);
		}
		
		function _openNav() {
			navEnabled = true;
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
    	tabs.style.margin = 0;
    	Array.from(tabs.children).forEach(function(li) { li.classList.add("admin-menu-tab"); });
		document.querySelector('.toolbar-menu-administration').appendChild( tabs );
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