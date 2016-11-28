"use strict";

var SmoothScroll = require("../vendors/SmoothScroll/SmoothScroll.min");
var Waybetter = require("../vendors/Waybetter/waybetter.min");
var $http = require("../vendors/Http/http");

(function () {

	var htmlClass = document.documentElement.classList,
	    navEnabled = false,
	    defaults = {
		collapsibleSelector: ".collapsible",
		externalLinks: true,
		hamburger: "#hamburger",

		jumpLinks: true,
		navOpenClass: "nav-enabled",
		retinaImage: ".retina-image",
		scrollClass: "minimal",
		scrollIgnoreMQ: '(min-width:1025px)',
		scrollOffset: document.querySelector("header"),
		scrollOnLoad: true,
		scrollThreshold: 70,

		waybetter: true

	};

	var Framework = function Framework(opts) {
		var settings = Object.assign(defaults, opts);

		function _init() {
			if (settings.retinaImage) {
				_processRetinaImages();
			}

			if (settings.externalLinks === true) {
				_processExternalLinks();
			}

			if (settings.hamburger) {
				navEnabled = false;
				_watchHamburger();
			}

			if (settings.scrollThreshold) {
				_watchHeader();
			}

			if (settings.scrollOnLoad) {
				_scrollOnLoad();
			}

			if (settings.jumpLinks) {
				_watchJumpLinks();
			}

			if (settings.waybetter) {
				_processWaybetter();
			}

			if (settings.collapsibleSelector) {
				_processCollapsible();
			}
		}

		function _processRetinaImages() {
			[].slice.apply(document.querySelectorAll(settings.retinaImage)).forEach(function (img) {
				if (img.tagName.toLowerCase() === "img") {
					_cutRetinaInHalf(img);
				} else {
					[].slice.apply(img.querySelector("img")).forEeach(function (img) {
						if (img.complete) {
							_cutRetinaInHalf(img);
						} else {
							img.addEventListner("load", function () {
								return _cutRetinaInHalf(img);
							});
						}
					});
				}
			});
		}

		function _watchHamburger() {
			var hamburger = document.querySelector(settings.hamburger);

			if (hamburger) {
				hamburger.addEventListener("click", function (evt) {
					evt.preventDefault();
					if (navEnabled === false) {
						_openNav();
					} else {
						_closeNav();
					}
				});
			}
		}

		function _watchHeader() {
			var header = document.querySelector("header"),
			    mql = window.matchMedia(settings.scrollIgnoreMQ),
			    mqlListen = function mqlListen() {
				if (mql.matches === true) {
					if (window.pageYOffset < settings.scrollThreshold) {
						htmlClass.remove(settings.scrollClass);
					} else if (header.getBoundingClientRect().top <= 0) {
						htmlClass.add(settings.scrollClass);
					}
				} else {
					htmlClass.add(settings.scrollClass);
				}
			};

			mqlListen();
			window.addEventListener("scroll", mqlListen);
			window.addEventListener("resize", mqlListen);
		}

		function _scrollOnLoad() {
			if (window.location.hash && document.querySelector(window.location.hash)) {
				new SmoothScroll(window.location.hash, { offset: settings.scrollOffset });
			}
		}

		function _watchJumpLinks() {
			document.addEventListener("click", function (evt) {
				var t = evt.target;
				if (t.hash && document.querySelector(t.hash)) {
					evt.preventDefault();
					history.pushState(null, null, t.href);
					_closeNav();
					new SmoothScroll(t.hash, { offset: settings.scrollOffset });
				}
			});
		}

		function _processWaybetter() {
			Array.from(document.querySelectorAll("[waybetter-watch]")).forEach(function (el) {
				return new Waybetter(el);
			});
		}

		function _processExternalLinks() {
			document.addEventListener("click", function (e) {
				var a = _getTag(e.target) === "a" ? e.target : _getTag(e.target.parentNode) === "a" ? e.target.parentNode : null;
				if (a && a.host !== window.location.host && !a.matches(".exclude")) {
					e.preventDefault();
					var w = window.open(a.href);
					w.opener = null;
				}
			});
		}

		function _processCollapsible() {
			Array.from(document.querySelectorAll(settings.collapsibleSelector)).forEach(function (collapsible) {
				var items = Array.from(collapsible.children);
				items.forEach(function (item) {
					var trigger = item.children[0],
					    content = item.children[1];

					trigger.addEventListener("click", function () {
						var active = items.find(function (i) {
							return i.classList.contains("active");
						});
						if (active) {
							active.classList.remove("active");
							active.children[1].style.height = 0;
						}

						if (active !== trigger.parentNode) {
							var height = Array.from(trigger.nextElementSibling.children).reduce(function (a, b) {
								var style = window.getComputedStyle(b);
								return a + parseFloat(style.height) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
							}, 0);

							trigger.parentNode.classList.add("active");
							trigger.nextElementSibling.style.height = height + 'px';
						}
					});
				});
			});
		}

		function _cutRetinaInHalf(img) {
			img.width /= 2;
		}

		function _closeNav(immediate) {
			navEnabled = false;
			if (immediate) {
				htmlClass.add("immediate");
			}
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

(function (window) {
	if (typeof window.drupalSettings !== "undefined" && typeof window.drupalSettings.toolbar !== "undefined") {
		var tabs = document.querySelector('ul.button-group');
		tabs.style.margin = 0;
		[].slice.apply(tabs.children).forEach(function (li) {
			li.classList.add("admin-menu-tab");
		});
		document.querySelector('.toolbar-menu-administration').appendChild(tabs);
	}
})(window);
