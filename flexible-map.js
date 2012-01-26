/*!
JavaScript for the WordPress plugin wp-flexible-map
copyright (c) 2011-2012 WebAware Pty Ltd, released under LGPL v2.1
*/

function FlexibleMap() {
	// set map defaults
	this.mapTypeId = google.maps.MapTypeId.ROADMAP;
	this.mapTypeControl = false;						// no control for changing map type
	this.scaleControl = false;							// no control for changing scale
	this.streetViewControl = false;						// no control for street view
	this.scrollwheel = false;							// no scroll wheel zoom
	this.zoom = 16;										// zoom level, smaller is closer
	this.markerTitle = '';								// title for marker info window
	this.markerDescription = '';						// description for marker info window
	this.markerLink = '';								// link for marker title
	this.markerShowInfo = true;							// if have infowin for marker, show it immediately
	this.markerDirections = false;						// show directions link in info window
	this.navigationControlOptions = { style: google.maps.NavigationControlStyle.SMALL };
	this.dirService = false;
	this.dirPanel = false;
	this.region = false;
}

FlexibleMap.prototype = (function() {

	var addEventListener, stopEvent;

	// detect standard event model
	if (document.addEventListener) {
		addEventListener = function(element, eventName, hook) { element.addEventListener(eventName, hook, false); };
		stopEvent = function(event) { event.stopPropagation(); event.preventDefault(); };
	}
	else
	// detect IE event model
	if (document.attachEvent) {
		addEventListener = function(element, event, hook) { element.attachEvent("on" + event, function() { hook.call(element, window.event); }); };
		stopEvent = function(event) { event.cancelBubble = true; event.returnValue = 0; };
	}

	return {
		constructor: FlexibleMap,

		/**
		* show a map based on a KML file
		* @param {String} divID the ID of the div that will contain the map
		* @param {String} kmlFile path to the KML file to load
		* @param {Number} zoom [optional] zoom level
		*/
		showKML: function(divID, kmlFile, zoom) {
			var	map = this.showMap(divID, [0, 0]),
				kmlLayer = new google.maps.KmlLayer(kmlFile);

			kmlLayer.setMap(map);

			if (typeof zoom != "undefined") {
				// listen for KML loaded, and reset zoom
				google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
					map.setZoom(zoom);
				});
			}

			// stop links opening in a new window (thanks, Stack Overflow!)
			google.maps.event.addListener(kmlLayer, 'click', function(kmlEvent) {
				kmlEvent.featureData.description = kmlEvent.featureData.description.replace(/ target="_blank"/ig, "");
			});
		},

		/**
		* show a map centred at latitude / longitude and with marker at latitude / longitude
		* @param {String} divID the ID of the div that will contain the map
		* @param {Array} centre an array of two integers: [ latitude, longitude ]
		* @param {Array} marker an array of two integers: [ latitude, longitude ]
		* @param {String} title the title for the marker
		*/
		showMarker: function(divID, centre, marker) {
			var	map = this.showMap(divID, centre),
				point = new google.maps.Marker({
					map: map,
					position: new google.maps.LatLng(marker[0], marker[1])
				});

			if (this.markerTitle) {
				var i, len, lines, infowin, element, a,
					self = this,
					container = document.createElement("DIV");

				container.style.fontFamily = "Arial,Helvetica,sans-serif";

				// heading for info window
				element = document.createElement("DIV");
				element.style.fontWeight = "bold";
				element.style.fontSize = "medium";
				element.appendChild(document.createTextNode(this.markerTitle));
				container.appendChild(element);

				// body of info window, with link
				if (this.markerDescription || this.markerLink) {
					element = document.createElement("DIV");
					element.style.fontSize = "small";
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
						a.appendChild(document.createTextNode("Click for details"));
						element.appendChild(a);
					}
					container.appendChild(element);
				}

				// add a link for directions if wanted
				if (this.markerDirections) {
					element = document.createElement("DIV");
					element.style.fontSize = "small";
					a = document.createElement("A");
					a.href = "#";
					a.dataLatitude = marker[0];
					a.dataLongitude = marker[1];
					a.dataTitle = this.markerTitle;
					addEventListener(a, "click", function(event) {
						stopEvent(event);
						self.showDirections(this.dataLatitude, this.dataLongitude, this.dataTitle);
					});
					a.appendChild(document.createTextNode("Directions"));
					element.appendChild(a);
					container.appendChild(element);

					// make sure we have a directions service
					if (!this.dirService)
						this.dirService = new google.maps.DirectionsService();
					if (!this.dirPanel) {
						this.dirPanel = new google.maps.DirectionsRenderer({
							map: map,
							panel: document.getElementById(this.markerDirections)
						});
					}
				}

				infowin = new google.maps.InfoWindow({content: container});
				if (this.markerShowInfo)
					infowin.open(map, point);

				google.maps.event.addListener(point, "click", function() {
					infowin.open(map, point);
				});
			}
		},

		/**
		* show a map at specified centre latitude / longitude
		* @param {String} divID the ID of the div that will contain the map
		* @param {Array} centre an array of two integers: [ latitude, longitude ]
		* @return {google.maps.Map} the Google Maps map created
		*/
		showMap: function(divID, centre) {
			return new google.maps.Map(document.getElementById(divID), {
				mapTypeId: this.mapTypeId,
				mapTypeControl: this.mapTypeControl,
				scaleControl: this.scaleControl,
				scrollwheel: this.scrollwheel,
				streetViewControl: this.streetViewControl,
				navigationControlOptions: this.navigationControlOptions,
				center: new google.maps.LatLng(centre[0], centre[1]),
				zoom: this.zoom
			});
		},

		/**
		* show directions for specified latitude / longitude and title
		* @param {Number} latitude
		* @param {Number} longitude
		* @param {String} title
		*/
		showDirections: function(latitude, longitude, title) {
			var	panel = document.getElementById(this.markerDirections),
				form = document.createElement("form"),
				self = this,
				region = this.region || '',
				input, p, from;

			// remove all from panel
			while (!!(p = panel.lastChild))
				panel.removeChild(p);

			// populate form and add to panel
			p = document.createElement("p");
			p.appendChild(document.createTextNode("From: "));
			from = document.createElement("input");
			from.type = "text";
			from.name = "from";
			p.appendChild(from);
			input = document.createElement("input");
			input.type = "submit";
			input.value = "Get directions";
			p.appendChild(input);
			form.appendChild(p);
			panel.appendChild(form);
			from.focus();

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
					var request = {
						origin: from,
						region: region,
						destination: new google.maps.LatLng(latitude, longitude),
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

		}

	};

})();
