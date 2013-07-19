/*!
JavaScript for the WordPress plugin wp-flexible-map
copyright (c) 2011-2013 WebAware Pty Ltd, released under LGPL v2.1
*/

function FlexibleMap() {
	// instance-private members with accessors
	var	map,						// google.maps.Map object
		centre,						// google.maps.LatLng object for map centre
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

		map = new google.maps.Map(document.getElementById(divID), {
				mapTypeId: this.mapTypeId,
				mapTypeControl: this.mapTypeControl,
				scaleControl: this.scaleControl,
				panControl: this.panControl,
				zoomControl: this.zoomControl,
				draggable: this.draggable,
				disableDoubleClickZoom: !this.dblclickZoom,
				scrollwheel: this.scrollwheel,
				streetViewControl: this.streetViewControl,
				navigationControlOptions: this.navigationControlOptions,
				center: centre,
				zoom: this.zoom
			});

		return map;
	};

	/**
	* load a map from a KML file and add as a layer on the Google Maps map
	* @param {String} kmlFileURL
	* @return {google.maps.KmlLayer}
	*/
	this.loadKmlMap = function(kmlFileURL) {
		// load KML file as a layer and add to map
		kmlLayer = new google.maps.KmlLayer(kmlFileURL);
		kmlLayer.setMap(map);

		// listen for KML loaded
		google.maps.event.addListenerOnce(kmlLayer, "defaultviewport_changed", function() {
			// update centre of map from bounds on KML layer
			centre = kmlLayer.getDefaultViewport().getCenter();
		});

		return kmlLayer;
	};

	// set map defaults
	this.mapTypeId = google.maps.MapTypeId.ROADMAP;
	this.mapTypeControl = true;							// no control for changing map type
	this.scaleControl = false;							// no control for changing scale
	this.panControl = false;							// no control for panning
	this.zoomControl = true;							// show control for zooming
	this.streetViewControl = false;						// no control for street view
	this.scrollwheel = false;							// no scroll wheel zoom
	this.draggable = true;								// support dragging to pan
	this.dblclickZoom = true;							// support double-click zoom
	this.zoom = 16;										// zoom level, smaller is closer
	this.markerTitle = '';								// title for marker info window
	this.markerDescription = '';						// description for marker info window
	this.markerHTML = '';								// HTML for marker info window (overrides title and description)
	this.markerLink = '';								// link for marker title
	this.markerIcon = '';								// link for marker icon, leave blank for default
	this.markerShowInfo = true;							// if have infowin for marker, show it immediately
	this.markerDirections = false;						// show directions link in info window
	this.markerDirectionsShow = false;					// show directions as soon as page loads
	this.markerDirectionsDefault = '';					// default from: location for directions
	this.markerAddress = '';							// address of marker, if given
	this.targetFix = true;								// remove target="_blank" from links on KML map
	this.navigationControlOptions = { style: google.maps.NavigationControlStyle.SMALL };
	this.dirService = false;
	this.dirPanel = false;
	this.dirDraggable = false;
	this.dirSuppressMarkers = false;
	this.region = '';
	this.locale = 'en';
	this.localeActive = 'en';
}

FlexibleMap.prototype = (function() {

	var addEventListener, stopEvent, fireEvent;

	// detect standard event model
	if (document.addEventListener) {
		addEventListener = function(element, eventName, hook) {
			element.addEventListener(eventName, hook, false);
		};

		stopEvent = function(event) {
			event.stopPropagation();
			event.preventDefault();
		};

		fireEvent = function(element, eventName) {
			var event = document.createEvent("HTMLEvents");
			event.initEvent(eventName, true, true);
			element.dispatchEvent(event);
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

		fireEvent = function(element, eventName) {
			var event = document.createEventObject();
			event.eventType = eventName;
			element.fireEvent("on" + eventName, event);
		};
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

	return {
		constructor: FlexibleMap,

		/**
		* collection of locale / phrase mapping for internationalisation of messages
		*/
		i18n: {
			"en": {
				"Click for details" : "Click for details",
				"Directions" : "Directions",
				"From" : "From",
				"Get directions" : "Get directions"
			}
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
					// still not found, use default (en)
					this.localeActive = "en";
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
			var phrases = this.i18n[this.localeActive];

			if (key in phrases)
				return phrases[key];

			return key;
		},

		/**
		* show a map based on a KML file
		* @param {String} divID the ID of the div that will contain the map
		* @param {String} kmlFileURL path to the KML file to load
		* @param {Number} zoom [optional] zoom level
		*/
		showKML: function(divID, kmlFileURL, zoom) {
			var	self = this,
				mapDiv = document.getElementById(divID),
				varName = mapDiv.getAttribute("data-flxmap"),
				map = this.showMap(divID, [0, 0]),
				kmlLayer = this.loadKmlMap(kmlFileURL);

			// set zoom if specified
			if (typeof zoom != "undefined") {
				// listen for KML layer load finished
				google.maps.event.addListenerOnce(map, "tilesloaded", function() {
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
					if (self.targetFix) {
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
				point = new google.maps.Marker({
					map: map,
					position: new google.maps.LatLng(marker[0], marker[1]),
					icon: this.markerIcon
				});

			if (!this.markerTitle)
				this.markerTitle = this.markerAddress;

			if (this.markerTitle) {
				var i, len, lines, infowin, element, a,
					self = this,
					container = document.createElement("DIV");

				container.className = "flxmap-infowin";

				// add tooltip title for marker
				point.setTitle(this.markerTitle);

				// heading for info window
				element = document.createElement("DIV");
				element.className = "flxmap-marker-title";
				element.appendChild(document.createTextNode(this.markerTitle));
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
						if (this.markerLink)
							element.appendChild(document.createElement("BR"));
					}
					if (this.markerLink) {
						a = document.createElement("A");
						a.href = this.markerLink;
						a.appendChild(document.createTextNode(this.gettext("Click for details")));
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
					a.dataTitle = this.markerTitle;
					addEventListener(a, "click", function(event) {
						stopEvent(event);
						self.showDirections(this.dataLatitude, this.dataLongitude, this.dataTitle, true);
					});
					a.appendChild(document.createTextNode(this.gettext("Directions")));
					element.appendChild(a);
					container.appendChild(element);
				}

				// add a directions service if needed
				if (this.markerDirections || this.markerDirectionsShow) {
					this.startDirService(map);

					// show directions immediately if required
					if (this.markerDirectionsShow) {
						this.showDirections(marker[0], marker[1], this.markerTitle, false);
					}
				}

				infowin = new google.maps.InfoWindow({content: container});

				if (this.markerShowInfo) {
					// open after map is loaded, so that infowindow will auto-pan and won't be cropped at top
					google.maps.event.addListenerOnce(map, "tilesloaded", function() {
						infowin.open(map, point);
					});
				}

				google.maps.event.addListener(point, "click", function() {
					infowin.open(map, point);
				});
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

			if (this.markerTitle === "")
				this.markerTitle = address;

			geocoder.geocode({address: address, region: this.region}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var	location = results[0].geometry.location,
						centre = [ location.lat(), location.lng() ];
					self.showMarker(divID, centre, centre);
				}
				else {
					alert("Map address returns error: " + status);
				}
			});
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
			}
		},

		/**
		* create directions service
		*/
		startDirService: function(map) {
			// make sure we have a directions service
			if (!this.dirService)
				this.dirService = new google.maps.DirectionsService();

			if (!this.dirPanel) {
				this.dirPanel = new google.maps.DirectionsRenderer({
					map: map,
					draggable: this.dirDraggable,
					suppressMarkers: this.dirSuppressMarkers,
					panel: document.getElementById(this.markerDirectionsDiv)
				});
			}
		},

		/**
		* show directions for specified latitude / longitude and title
		* @param {Number} latitude
		* @param {Number} longitude
		* @param {String} title
		* @param {bool} focus [optional]
		*/
		showDirections: function(latitude, longitude, title, focus) {
			var	panel = document.getElementById(this.markerDirectionsDiv),
				form = document.createElement("form"),
				self = this,
				region = this.region || '',
				input, p, from;

			// remove all from panel
			while (!!(p = panel.lastChild))
				panel.removeChild(p);

			// populate form and add to panel
			p = document.createElement("p");
			p.appendChild(document.createTextNode(this.gettext("From") + ": "));
			from = document.createElement("input");
			from.type = "text";
			from.name = "from";
			from.value = this.markerDirectionsDefault;
			p.appendChild(from);
			input = document.createElement("input");
			input.type = "submit";
			input.value = this.gettext("Get directions");
			p.appendChild(input);
			form.appendChild(p);
			panel.appendChild(form);

			// only focus when asked, to prevent problems autofocusing on elements and scrolling the page!
			if (focus) {
				from.focus();
			}

			// hack to fix IE<=7 name weirdness for dynamically created form elements;
			// see http://msdn.microsoft.com/en-us/library/ms534184.aspx but have a hanky ready
			if (typeof form.elements.from == "undefined") {
				form.elements.from = from;
			}

			// handle the form submit
			addEventListener(form, "submit", function(event) {
				stopEvent(event);

				var from = this.elements.from.value;

				// only process if something was entered to search on
				if (/\S/.test(from)) {
					var	dest = (self.markerAddress === "") ? new google.maps.LatLng(latitude, longitude) : self.markerAddress,
						request = {
							origin: from,
							region: region,
							destination: dest,
							travelMode: google.maps.DirectionsTravelMode.DRIVING
						};

					self.dirService.route(request, function(response, status) {
						var DirectionsStatus = google.maps.DirectionsStatus;

						switch (status) {
							case DirectionsStatus.OK:
								self.dirPanel.setDirections(response);
								break;

							case DirectionsStatus.ZERO_RESULTS:
								alert("No route could be found between the origin and destination.");
								break;

							case DirectionsStatus.OVER_QUERY_LIMIT:
								alert("The webpage has gone over the requests limit in too short a period of time.");
								break;

							case DirectionsStatus.REQUEST_DENIED:
								alert("The webpage is not allowed to use the directions service.");
								break;

							case DirectionsStatus.INVALID_REQUEST:
								alert("Invalid directions request.");
								break;

							case DirectionsStatus.NOT_FOUND:
								alert("Origin or destination was not found.");
								break;

							default:
								alert("A directions request could not be processed due to a server error. The request may succeed if you try again.");
								break;
						}
					});
				}

			});

			// if the from: location is already set, trigger the directions query
			if (from.value) {
				fireEvent(form, "submit");
			}

		}

	};

})();
