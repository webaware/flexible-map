/*!
JavaScript for the WordPress plugin wp-flexible-map
https://flexible-map.webaware.net.au/
*/

function FlexibleMap() {
	"use strict";

	// instance-private members with accessors
	var	map,						// google.maps.Map object
		centre,						// google.maps.LatLng object for map centre
		markerLocation,				// google.maps.LatLng object for single marker, when using showMarker()
		markerPoint,				// google.maps.Marker object for single marker, when using showMarker()
		markerInfowin,				// google.maps.InfoWindow object for single marker, when using showMarker()
		kmlLayer,					// if map has a KML layer, this is the layer object
		hasRedrawn = false;			// boolean, whether map has been asked to redrawOnce() already

	/**
	* get the Google Maps API Map object
	* @return {google.maps.Map}
	*/
	this.getMap = function() {
		return map;
	};

	/**
	* get the centrepoint of the map at creation, or via setCenter()
	* @return {google.maps.LatLng}
	*/
	this.getCenter = function() {
		return centre;
	};

	/**
	* set the centrepoint of the map
	* @param {google.maps.LatLng} latLng
	*/
	this.setCenter = function(latLng) {
		centre = latLng;
		map.setCenter(centre);
	};

	/**
	* record the single marker location
	* @param {google.maps.LatLng} latLng
	*/
	this.setMarkerLocation = function(latLng) {
		markerLocation = latLng;
	};

	/**
	* get the single marker location
	* @return {google.maps.LatLng}
	*/
	this.getMarkerLocation = function() {
		return markerLocation;
	};

	/**
	* record the single marker point
	* @param {google.maps.Marker} point
	*/
	this.setMarkerPoint = function(point) {
		markerPoint = point;
	};

	/**
	* get the single marker point
	* @return {google.maps.Marker}
	*/
	this.getMarkerPoint = function() {
		return markerPoint;
	};

	/**
	* record the single marker infowindow
	* @param {google.maps.InfoWindow} infowin
	*/
	this.setMarkerInfowin = function(infowin) {
		markerInfowin = infowin;
	};

	/**
	* get the single marker infowindow
	* @return {google.maps.InfoWindow}
	*/
	this.getMarkerInfowin = function() {
		return markerInfowin;
	};

	/**
	* get the map's KML layer if set
	* @return {google.maps.KmlLayer}
	*/
	this.getKmlLayer = function() {
		return kmlLayer;
	};

	/**
	* if map starts life hidden and needs to be redrawn when revealed, this function will perform that redraw *once*
	*/
	this.redrawOnce = function() {
		if (!hasRedrawn) {
			hasRedrawn = true;
			this.redraw();
		}
	};

	/**
	* show a map at specified centre latitude / longitude
	* @param {String} divID the ID of the div that will contain the map
	* @param {Array} latLng the map centre, an array of two integers: [ latitude, longitude ]
	* @return {google.maps.Map} the Google Maps map created
	*/
	this.showMap = function(divID, latLng) {
		centre = new google.maps.LatLng(latLng[0], latLng[1]);

		var mapOptions,
			zoomControlStyles = {
				"small"		: google.maps.ZoomControlStyle.SMALL,
				"large"		: google.maps.ZoomControlStyle.LARGE,
				"default"	: google.maps.ZoomControlStyle.DEFAULT
			},
			zoomControlStyle = zoomControlStyles.small;

		// style the zoom control
		if (this.zoomControlStyle in zoomControlStyles) {
			zoomControlStyle = zoomControlStyles[this.zoomControlStyle];
		}

		// basic options
		mapOptions = {
			mapTypeId:					this.mapTypeId,
			mapTypeControl:				this.mapTypeControl,
			scaleControl:				this.scaleControl,
			panControl:					this.panControl,
			streetViewControl:			this.streetViewControl,
			zoomControl:				this.zoomControl,
			zoomControlOptions:			{ style: zoomControlStyle },
			draggable:					this.draggable,
			disableDoubleClickZoom:		!this.dblclickZoom,
			scrollwheel:				this.scrollwheel,
			center:						centre,
			zoom:						this.zoom
		};

		// select which map types for map type control, if specified as comma-separated list of map type IDs
		if (this.mapTypeIds) {
			mapOptions.mapTypeControlOptions = {
				mapTypeIds:	this.mapTypeIds.split(",")
			};
		}

		// create a map
		map = new google.maps.Map(document.getElementById(divID), mapOptions);

		// set custom map type if specified
		if (this.mapTypeId in this.mapTypes) {
			map.mapTypes.set(this.mapTypeId, this.mapTypes[this.mapTypeId]._styled_map);
		}

		return map;
	};

	/**
	* load a map from a KML file and add as a layer on the Google Maps map
	* @param {String} kmlFileURL
	* @return {google.maps.KmlLayer}
	*/
	this.loadKmlMap = function(kmlFileURL) {
		// load KML file as a layer and add to map
		kmlLayer = new google.maps.KmlLayer({ map: map, url: kmlFileURL });

		// listen for KML loaded
		google.maps.event.addListenerOnce(kmlLayer, "defaultviewport_changed", function() {
			// update centre of map from bounds on KML layer
			centre = kmlLayer.getDefaultViewport().getCenter();
		});

		return kmlLayer;
	};

	// load localisations if they haven't already been loaded
	if (!this.localised && "flxmap" in window) {
		this.localise();
	}

	// set map defaults
	this.mapTypeId = google.maps.MapTypeId.ROADMAP;
	this.mapTypeControl = true;							// no control for changing map type
	this.scaleControl = false;							// no control for changing scale
	this.panControl = false;							// no control for panning
	this.zoomControl = true;							// show control for zooming
	this.zoomControlStyle = "small";					// from "small", "large", "default"
	this.streetViewControl = false;						// no control for street view
	this.scrollwheel = false;							// no scroll wheel zoom
	this.draggable = true;								// support dragging to pan
	this.dblclickZoom = true;							// support double-click zoom
	this.zoom = 16;										// zoom level, smaller is closer
	this.markerTitle = "";								// title for marker info window
	this.markerDescription = "";						// description for marker info window
	this.markerHTML = "";								// HTML for marker info window (overrides title and description)
	this.markerLink = "";								// link for marker title
	this.markerLinkTarget = "";							// link target for marker link, e.g. _blank
	this.markerLinkText = false;						// link text for marker link, overriding default text
	this.markerIcon = "";								// link for marker icon, leave blank for default
	this.markerShowInfo = true;							// if have infowin for marker, show it immediately
	this.markerDirections = false;						// show directions link in info window
	this.markerDirectionsShow = false;					// show directions as soon as page loads
	this.markerDirectionsDefault = "";					// default from: location for directions
	this.markerAddress = "";							// address of marker, if given
	this.targetFix = true;								// remove target="_blank" from links on KML map
	this.dirService = false;
	this.dirRenderer = false;
	this.dirDraggable = false;							// directions route is draggable (for alternate routing)
	this.dirSuppressMarkers = false;					// suppress A/B markers on directions route
	this.dirShowSteps = true;							// show the directions steps (turn-by-turn)
	this.dirShowSearch = true;							// show the directions form for searching directions
	this.dirTravelMode = "driving";						// can be bicycling, driving, transit, walking
	this.dirUnitSystem = undefined;						// can be imperial or metric
	this.region = "";
	this.locale = "en";
	this.localeActive = false;
	this.kmlcache = "none";
}

FlexibleMap.prototype = (function() {
	"use strict";

	var addEventListener, stopEvent, handleHiddenMap;

	// detect standard event model
	if (document.addEventListener) {
		addEventListener = function(element, eventName, hook) {
			element.addEventListener(eventName, hook, false);
		};

		stopEvent = function(event) {
			event.stopPropagation();
			event.preventDefault();
		};
	}
	else
	// detect IE event model
	if (document.attachEvent) {
		addEventListener = function(element, event, hook) {
			element.attachEvent("on" + event, function() { hook.call(element, window.event); });
		};

		stopEvent = function(event) {
			event.cancelBubble = true;
			event.returnValue = 0;
		};
	}

	// handle hidden maps, trigger a resize on first display
	if (typeof MutationObserver !== "undefined") {
		handleHiddenMap = function(flxmap, divID) {
			var	mapDiv = document.getElementById(divID),
				container = mapDiv.parentNode,
				observer;

			function isHidden(element) {
				var style = window.getComputedStyle(element);
				return style.display === "none" || style.visibility === "hidden";
			}

			// only need to watch and act if the parent container is hidden from display
			if (isHidden(container)) {
				observer = new MutationObserver(function(mutations, self) {
					// only proceed if map is visible now
					if (!isHidden(container)) {
						flxmap.redrawOnce();

						// stop observing, we're done
						self.disconnect();
					}
				});

				observer.observe(container, {
					attributes:			true,
					attributeFilter:	["style"]
				});
			}
		};
	}
	else {
		handleHiddenMap = function() { };
	}

	/**
	* encode special JavaScript characters, so text is safe when building JavaScript/HTML dynamically
	* NB: conservatively assumes that HTML special characters are unsafe, and encodes them too
	* @param {String} text
	* @return {String}
	*/
	var encodeJS = (function() {

		/**
		* encode character as Unicode hexadecimal escape sequence
		* @param {String} ch character to encode
		* @return {String}
		*/
		function toUnicodeHex(ch) {
			var	c = ch.charCodeAt(0),
				s = c.toString(16);

			// see if we can use 2-digit hex code
			if (c < 0x100) {
				return "\\x" + ("00" + s).slice(-2);
			}

			// must use 4-digit hex code
			return "\\u" + ("0000" + s).slice(-4);
		}

		return function(text) {
			// search for JavaScript and HTML special characters, convert to Unicode hex
			return text.replace(/[\\\/"'&<>\x00-\x1f\x7f-\xa0\u2000-\u200f\u2028-\u202f]/g, toUnicodeHex);
		};

	})();

	/**
	* add cache buster to KML source link
	* @param {String} url
	* @param {String} caching
	* @return {String}
	*/
	function kmlCacheBuster(url, caching) {
		var milliseconds, buster, multiplier, matches = /^(\d+)\s*(minute|hour|day)s?$/.exec(caching);

		if (matches) {
			milliseconds = (new Date()).getTime();
			multiplier = +matches[1];

			switch(matches[2]) {
				case "minute":
					// can't be less than 5 minutes
					if (multiplier < 5) {
						multiplier = 5;
					}
					buster = milliseconds / (60000 * multiplier);
					break;

				case "hour":
					buster = milliseconds / (3600000 * multiplier);
					break;

				case "day":
					buster = milliseconds / (86400000 * multiplier);
					break;

				default:
					buster = false;
					break;
			}

			if (buster) {
				buster = Math.floor(buster);
				url += (url.indexOf("?") > -1 ? "&" : "?") + "nocache=" + buster;
			}
		}

		return url;
	}

	return {
		constructor: FlexibleMap,

		/**
		* collection of locale / phrase mapping for internationalisation of messages
		*/
		i18n: { },

		/**
		* collection of custom Google Maps map types for styling maps
		*/
		mapTypes: { },

		localised: false,		// set to true once localisations have been loaded

		/**
		* load localisations into class prototype
		*/
		localise: function() {
			var key, mapTypes;

			// load translations
			if ("i18n" in flxmap) {
				FlexibleMap.prototype.i18n = flxmap.i18n;
			}

			// load custom map types
			if ("mapTypes" in flxmap) {
				mapTypes = flxmap.mapTypes;

				for (key in mapTypes) {
					mapTypes[key]._styled_map = new google.maps.StyledMapType(mapTypes[key].styles, mapTypes[key].options);
				}

				FlexibleMap.prototype.mapTypes = mapTypes;
			}

			FlexibleMap.prototype.localised = true;
		},

		/**
		* set the locale used for i18n phrase lookup, picking the best match
		* @param {String} localeWanted the locale wanted, e.g. en-AU, da-DK, sv
		* @return {String} the locale that will be used (nearest match, or default if none)
		*/
		setlocale: function(localeWanted) {
			this.locale = localeWanted;

			// attempt to set this locale as active
			if (localeWanted in this.i18n) {
				this.localeActive = localeWanted;
			}
			else {
				// not found, so try simplified locale
				localeWanted = localeWanted.substr(0, 2);
				if (localeWanted in this.i18n) {
					this.localeActive = localeWanted;
				}
				else {
					// still not found
					this.localeActive = false;
				}
			}

			return this.localeActive;
		},

		/**
		* get phrase from the current locale domain, or the default domain (en) if not found
		* @param {String} key the key for the desired phrase
		* @return {String}
		*/
		gettext: function(key) {
			var locale = this.localeActive;

			if (locale && key in this.i18n[locale]) {
				return this.i18n[locale][key];
			}

			return key;
		},

		/**
		* show a map based on a KML file
		* @param {String} divID the ID of the div that will contain the map
		* @param {String} kmlFileURL path to the KML file to load
		* @param {Number} zoom [optional] zoom level
		*/
		showKML: function(divID, kmlFileURL, zoom) {
			if (typeof zoom != "undefined")
				this.zoom = zoom;

			var	self = this,
				mapDiv = document.getElementById(divID),
				varName = mapDiv.getAttribute("data-flxmap"),
				map = this.showMap(divID, [0, 0]),
				kmlLayer = this.loadKmlMap(kmlCacheBuster(kmlFileURL, this.kmlcache));

			handleHiddenMap(this, divID);

			// set zoom if specified
			if (typeof zoom != "undefined") {
				// listen for zoom changing to fit markers on KML layer, force it back to what we asked for
				google.maps.event.addListenerOnce(map, "zoom_changed", function() {
					map.setZoom(zoom);
					self.zoom = zoom;
				});
			}

			// add a directions service if needed
			if (this.markerDirections || this.markerDirectionsShow) {
				this.startDirService(map);
			}

			// customise the infowindow as required; can do this on click event on KML layer (thanks, Stack Overflow!)
			google.maps.event.addListener(kmlLayer, 'click', function(kmlEvent) {
				var	featureData = kmlEvent.featureData;

				// NB: since Google Maps API v3.9 the info window HTML is precomposed before this event occurs,
				// so just changing the description won't change infowindow

				if (!featureData._flxmapOnce) {
					// add a flag to stop doing this on every click; once is enough
					featureData._flxmapOnce = true;

					// stop links opening in a new window
					if (self.targetFix && featureData.description) {
						var reTargetFix = / target="_blank"/ig;
						featureData.description = featureData.description.replace(reTargetFix, "");
						featureData.infoWindowHtml = featureData.infoWindowHtml.replace(reTargetFix, "");
					}

					// if we're showing directions, add directions link to marker description
					if (self.markerDirections) {
						var	latLng = kmlEvent.latLng,
							params = latLng.lat() + ',' + latLng.lng() + ",'" + encodeJS(featureData.name) + "',true",
							a = '<br /><a href="#" data-flxmap-fix-opera="1" onclick="' + varName + '.showDirections(' + params + '); return false;">' + self.gettext("Directions") + '</a>';

						featureData.infoWindowHtml = featureData.infoWindowHtml.replace(/<\/div><\/div>$/i, a + "</div></div>");
					}
				}
			});

			// hack for directions links on Opera, which fails to ignore events when onclick returns false
			if (window.opera && this.markerDirections) {
				addEventListener(mapDiv, "click", function(event) {
					if (event.target.getAttribute("data-flxmap-fix-opera")) {
						stopEvent(event);
					}
				});
			}

		},

		/**
		* show a map centred at latitude / longitude and with marker at latitude / longitude
		* @param {String} divID the ID of the div that will contain the map
		* @param {Array} centre an array of two integers: [ latitude, longitude ]
		* @param {Array} marker an array of two integers: [ latitude, longitude ]
		*/
		showMarker: function(divID, centre, marker) {
			var	map = this.showMap(divID, centre),
				markerLocation = new google.maps.LatLng(marker[0], marker[1]),
				point = new google.maps.Marker({
					map: map,
					position: markerLocation,
					icon: this.markerIcon
				});

			this.setMarkerPoint(point);
			this.setMarkerLocation(markerLocation);

			handleHiddenMap(this, divID);

			if (!this.markerTitle) {
				this.markerTitle = this.markerAddress;
			}

			if (this.markerTitle || this.markerHTML || this.markerDescription || this.markerLink || this.markerDirections) {
				var i, len, lines, infowin, element, a,
					self = this,
					container = document.createElement("DIV");

				container.className = "flxmap-infowin";

				// heading for info window
				element = document.createElement("DIV");
				element.className = "flxmap-marker-title";
				if (this.markerTitle) {
					element.appendChild(document.createTextNode(this.markerTitle));

					// add tooltip title for marker
					point.setTitle(this.markerTitle);
				}
				container.appendChild(element);

				// add precomposed HTML for infowindow
				if (this.markerHTML) {
					element = document.createElement("DIV");
					element.innerHTML = this.markerHTML;
					container.appendChild(element);
				}

				// body of info window, with link
				if (this.markerDescription || this.markerLink) {
					element = document.createElement("DIV");
					element.className = "flxmap-marker-link";
					if (this.markerDescription) {
						lines = this.markerDescription.split("\n");
						for (i = 0, len = lines.length; i < len; i++) {
							if (i > 0)
								element.appendChild(document.createElement("BR"));
							element.appendChild(document.createTextNode(lines[i]));
						}
						if (this.markerLink) {
							element.appendChild(document.createElement("BR"));
						}
					}
					if (this.markerLink) {
						a = document.createElement("A");
						a.href = this.markerLink;
						if (this.markerLinkTarget) {
							a.target = this.markerLinkTarget;
						}
						a.appendChild(document.createTextNode(this.markerLinkText || this.gettext("Click for details")));
						element.appendChild(a);
					}
					container.appendChild(element);
				}

				// add a link for directions if wanted
				if (this.markerDirections) {
					element = document.createElement("DIV");
					element.className = "flxmap-directions-link";
					a = document.createElement("A");
					a.href = "#";
					a.dataLatitude = marker[0];
					a.dataLongitude = marker[1];
					addEventListener(a, "click", function(event) {
						stopEvent(event);
						self.showDirections(this.dataLatitude, this.dataLongitude, true);
					});
					a.appendChild(document.createTextNode(this.gettext("Directions")));
					element.appendChild(a);
					container.appendChild(element);
				}

				infowin = new google.maps.InfoWindow({content: container});
				this.setMarkerInfowin(infowin);

				if (this.markerShowInfo) {
					// open after map is loaded, so that infowindow will auto-pan and won't be cropped at top
					google.maps.event.addListenerOnce(map, "tilesloaded", function() {
						infowin.open(map, point);
					});
				}

				google.maps.event.addListener(point, "click", function() {
					infowin.open(map, point);
				});

				// find Google link and append marker info, modern browsers only!
				// NB: Google link is set before initial map idle event, and reset each time the map centre changes
				var googleLink = function() { self.updateGoogleLink(); };
				google.maps.event.addListener(map, "idle", googleLink);
				google.maps.event.addListener(map, "center_changed", googleLink);
				google.maps.event.addListenerOnce(map, "tilesloaded", googleLink);
			}

			// add a directions service if needed
			if (this.markerDirections || this.markerDirectionsShow) {
				this.startDirService(map);

				// show directions immediately if required
				if (this.markerDirectionsShow) {
					this.showDirections(marker[0], marker[1], false);
				}
			}

		},

		/**
		* show a map centred at address
		* @param {String} divID the ID of the div that will contain the map
		* @param {String} address the address (should return a unique location in Google Maps!)
		*/
		showAddress: function(divID, address) {
			var	self = this,
				geocoder = new google.maps.Geocoder();

			this.markerAddress = address;

			if (this.markerTitle === "") {
				this.markerTitle = address;
			}

			geocoder.geocode({address: address, region: this.region}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var	location = results[0].geometry.location,
						centre = [ location.lat(), location.lng() ];
					self.showMarker(divID, centre, centre);
				}
				else {
					window.alert("Map address returns error: " + status);
				}
			});
		},

		/**
		* set query parameters on Google link to maps -- modern browsers only
		* NB: will only set the query parameters when Google link doesn't have them already;
		* Google link is set before initial map idle event, and reset each time the map centre changes
		*/
		updateGoogleLink: function() {
			if ("querySelectorAll" in document) {
				try {
					var	flxmap = this.getMap().getDiv(),
						location = this.getMarkerLocation(),
						googleLinks = flxmap.querySelectorAll("a[href*='maps.google.com/maps']:not([href*='mps_dialog']):not([href*='&q='])"),
						i = 0, len = googleLinks.length,
						query = encodeURIComponent((this.markerAddress ? this.markerAddress : this.markerTitle) +
									" @" + location.lat() + "," + location.lng());

					for (; i < len; i++) {
						googleLinks[i].href += "&mrt=loc&iwloc=A&q=" + query;
					}
				}
				catch (e) {
					// we don't care about IE8 and earlier...
				}
			}
		},

		/**
		* tell Google Maps to redraw the map, and centre it back where it started with default zoom
		*/
		redraw: function() {
			var map = this.getMap(),
				kmlLayer = this.getKmlLayer();

			google.maps.event.trigger(map, "resize");

			// if map is KML, must refit to computed bounds, else use centre and zoom setting
			if (kmlLayer) {
				map.fitBounds(kmlLayer.getDefaultViewport());
			}
			else {
				map.setCenter(this.getCenter());
				map.setZoom(this.zoom);

				// redraw the marker's infowindow if it has one
				var infowin = this.getMarkerInfowin();
				if (infowin) {
					infowin.open(map, this.getMarkerPoint());
				}
			}
		},

		/**
		* create directions service
		*/
		startDirService: function(map) {
			// make sure we have a directions service
			if (!this.dirService) {
				this.dirService = new google.maps.DirectionsService();
			}

			// make sure we have a directions renderer
			if (!this.dirRenderer) {
				this.dirRenderer = new google.maps.DirectionsRenderer({
					map: map,
					draggable: this.dirDraggable,
					suppressMarkers: this.dirSuppressMarkers,
					panel: this.dirShowSteps ? document.getElementById(this.markerDirectionsDiv) : null
				});
			}
		},

		/**
		* show directions for specified latitude / longitude and title
		* @param {Number} latitude
		* @param {Number} longitude
		* @param {bool} focus [optional]
		*/
		showDirections: function(latitude, longitude, focus) {
			var	self = this;

			/**
			* show the directions form to allow directions searches
			*/
			function showDirectionsForm() {
				var panel = document.getElementById(self.markerDirectionsDiv),
					form = document.createElement("form"),
					input, p, from;

				// remove all from panel
				while (!!(p = panel.lastChild))
					panel.removeChild(p);

				// populate form and add to panel
				p = document.createElement("p");
				p.appendChild(document.createTextNode(self.gettext("From") + ": "));
				from = document.createElement("input");
				from.type = "text";
				from.name = "from";
				from.value = self.markerDirectionsDefault;
				p.appendChild(from);
				input = document.createElement("input");
				input.type = "submit";
				input.value = self.gettext("Get directions");
				p.appendChild(input);
				form.appendChild(p);
				panel.appendChild(form);

				// hack to fix IE<=7 name weirdness for dynamically created form elements;
				// see https://msdn.microsoft.com/en-us/library/ms534184.aspx but have a hanky ready
				if (typeof form.elements.from == "undefined") {
					form.elements.from = from;
				}

				// only focus when asked, to prevent problems autofocusing on elements and scrolling the page!
				if (focus) {
					from.focus();
				}

				// handle the form submit
				addEventListener(form, "submit", function(event) {
					stopEvent(event);

					var from = this.elements.from.value;

					// only process if something was entered to search on
					if (/\S/.test(from)) {
						requestDirections(from);
					}

				});
			}

			/**
			* request directions
			* @param {String} from
			*/
			function requestDirections(from) {
				var	dest = (self.markerAddress === "") ? new google.maps.LatLng(latitude, longitude) : self.markerAddress,
					request = {
						origin: from,
						destination: dest
					};

				if (self.region) {
					request.region = self.region;
				}

				switch (self.dirTravelMode) {
					case "bicycling":
						request.travelMode = google.maps.TravelMode.BICYCLING;
						break;

					case "driving":
						request.travelMode = google.maps.TravelMode.DRIVING;
						break;

					case "transit":
						request.travelMode = google.maps.TravelMode.TRANSIT;
						break;

					case "walking":
						request.travelMode = google.maps.TravelMode.WALKING;
						break;
				}

				switch (self.dirUnitSystem) {
					case "imperial":
						request.unitSystem = google.maps.UnitSystem.IMPERIAL;
						break;

					case "metric":
						request.unitSystem = google.maps.UnitSystem.METRIC;
						break;
				}

				self.dirService.route(request, dirResponseHander);
			}

			/**
			* handle the response for Google directions service
			* @param {google.maps.DirectionsResult} response
			* @param {Number} status
			*/
			function dirResponseHander(response, status) {
				var DirectionsStatus = google.maps.DirectionsStatus;

				switch (status) {
					case DirectionsStatus.OK:
						self.dirRenderer.setDirections(response);
						break;

					case DirectionsStatus.ZERO_RESULTS:
						window.alert("No route could be found between the origin and destination.");
						break;

					case DirectionsStatus.OVER_QUERY_LIMIT:
						window.alert("The webpage has gone over the requests limit in too short a period of time.");
						break;

					case DirectionsStatus.REQUEST_DENIED:
						window.alert("The webpage is not allowed to use the directions service.");
						break;

					case DirectionsStatus.INVALID_REQUEST:
						window.alert("Invalid directions request.");
						break;

					case DirectionsStatus.NOT_FOUND:
						window.alert("Origin or destination was not found.");
						break;

					default:
						window.alert("A directions request could not be processed due to a server error. The request may succeed if you try again.");
						break;
				}
			}

			// if we have a directions div, show the form for searching it
			if (this.markerDirectionsDiv && this.dirShowSearch) {
				showDirectionsForm();
			}

			// if the from: location is already set, trigger the directions query
			if (this.markerDirectionsDefault) {
				requestDirections(this.markerDirectionsDefault);
			}

		}

	};

})();
