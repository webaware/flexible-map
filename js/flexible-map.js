"use strict";

/*
JavaScript for the WordPress plugin wp-flexible-map
https://flexible-map.webaware.net.au/
*/
window.FlexibleMap = function () {
  "use strict"; // instance-private members with accessors

  var map; // google.maps.Map object

  var centre; // google.maps.LatLng object for map centre

  var markerLocation; // google.maps.LatLng object for single marker, when using showMarker()

  var markerPoint; // google.maps.Marker object for single marker, when using showMarker()

  var markerInfowin; // google.maps.InfoWindow object for single marker, when using showMarker()

  var kmlLayer; // if map has a KML layer, this is the layer object

  var hasRedrawn = false; // boolean, whether map has been asked to redrawOnce() already

  /**
  * set gesture handling options, with legacy support for draggable, dblclickZoom, scrollwheel
  * set to "cooperative" if none of the settings are given
  * @link https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.gestureHandling
  * @param {Object} mapOptions
  * @param {FlexibleMap} flexibleMap
  * @return {Object}
  */

  function getGestureHandling(mapOptions, flexibleMap) {
    if (flexibleMap.gestureHandling !== undefined) {
      mapOptions.gestureHandling = flexibleMap.gestureHandling;
    } else if (flexibleMap.draggable === undefined && flexibleMap.dblclickZoom === undefined && flexibleMap.scrollwheel === undefined) {
      mapOptions.gestureHandling = "cooperative";
    } else {
      // legacy support; deprecated
      var draggable = flexibleMap.draggable === undefined ? true : flexibleMap.draggable; // default true, i.e. enable draggable

      var disableDblclickZoom = flexibleMap.dblclickZoom === undefined ? false : !flexibleMap.draggable; // default true, i.e. enable double-click zoom

      var scrollwheel = flexibleMap.scrollwheel === undefined ? false : flexibleMap.scrollwheel; // default false, i.e. dinable scrollwheel
      // ----------------+-----------+------------------------+------------
      // gestureHandling | draggable | disableDoubleClickZoom | scrollwheel
      // ----------------+-----------+------------------------+------------
      // cooperative     |   true    |         false          |   ctrl+   |
      // greedy          |   true    |         false          |   true    |
      // auto            |   ????    |         false          |   ????    |
      // none            |   false   |         true           |   false   |
      // ----------------+-----------+------------------------+------------

      if (!draggable && disableDblclickZoom && !scrollwheel) {
        mapOptions.gestureHandling = "none";
      } else if (draggable && !disableDblclickZoom && scrollwheel) {
        mapOptions.gestureHandling = "greedy";
      } else {
        mapOptions.draggable = draggable;
        mapOptions.disableDoubleClickZoom = disableDblclickZoom;
        mapOptions.scrollwheel = scrollwheel;
      }
    }

    return mapOptions;
  }
  /**
  * get the Google Maps API Map object
  * @return {google.maps.Map}
  */


  this.getMap = function () {
    return map;
  };
  /**
  * get the centrepoint of the map at creation, or via setCenter()
  * @return {google.maps.LatLng}
  */


  this.getCenter = function () {
    return centre;
  };
  /**
  * set the centrepoint of the map
  * @param {google.maps.LatLng} latLng
  */


  this.setCenter = function (latLng) {
    centre = latLng;
    map.setCenter(centre);
  };
  /**
  * record the single marker location
  * @param {google.maps.LatLng} latLng
  */


  this.setMarkerLocation = function (latLng) {
    markerLocation = latLng;
  };
  /**
  * get the single marker location
  * @return {google.maps.LatLng}
  */


  this.getMarkerLocation = function () {
    return markerLocation;
  };
  /**
  * record the single marker point
  * @param {google.maps.Marker} point
  */


  this.setMarkerPoint = function (point) {
    markerPoint = point;
  };
  /**
  * get the single marker point
  * @return {google.maps.Marker}
  */


  this.getMarkerPoint = function () {
    return markerPoint;
  };
  /**
  * record the single marker infowindow
  * @param {google.maps.InfoWindow} infowin
  */


  this.setMarkerInfowin = function (infowin) {
    markerInfowin = infowin;
  };
  /**
  * get the single marker infowindow
  * @return {google.maps.InfoWindow}
  */


  this.getMarkerInfowin = function () {
    return markerInfowin;
  };
  /**
  * get the map's KML layer if set
  * @return {google.maps.KmlLayer}
  */


  this.getKmlLayer = function () {
    return kmlLayer;
  };
  /**
  * if map starts life hidden and needs to be redrawn when revealed, this function will perform that redraw *once*
  */


  this.redrawOnce = function () {
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


  this.showMap = function (divID, latLng) {
    centre = new google.maps.LatLng(latLng[0], latLng[1]);
    var zoomControlStyles = {
      "small": google.maps.ZoomControlStyle.SMALL,
      "large": google.maps.ZoomControlStyle.LARGE,
      "default": google.maps.ZoomControlStyle.DEFAULT
    };
    var zoomControlStyle = zoomControlStyles.small; // style the zoom control

    if (this.zoomControlStyle in zoomControlStyles) {
      zoomControlStyle = zoomControlStyles[this.zoomControlStyle];
    } // basic options


    var mapOptions = {
      mapTypeId: this.mapTypeId,
      mapTypeControl: this.mapTypeControl,
      scaleControl: this.scaleControl,
      panControl: this.panControl,
      streetViewControl: this.streetViewControl,
      zoomControl: this.zoomControl,
      zoomControlOptions: {
        style: zoomControlStyle
      },
      fullscreenControl: this.fullscreen,
      center: centre,
      zoom: this.zoom
    };
    mapOptions = getGestureHandling(mapOptions, this); // select which map types for map type control, if specified as comma-separated list of map type IDs

    if (this.mapTypeIds) {
      mapOptions.mapTypeControlOptions = {
        mapTypeIds: this.mapTypeIds.split(",")
      };
    } // create a map


    map = new google.maps.Map(document.getElementById(divID), mapOptions); // set custom map type if specified

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


  this.loadKmlMap = function (kmlFileURL) {
    // load KML file as a layer and add to map
    var self = this;
    var options = {
      map: map,
      url: kmlFileURL
    };
    /**
    * reset the map back to the recorded centre coordinates -- only used when centre is set for map
    */

    function resetCentre() {
      if (!self.zoom) {
        map.fitBounds(kmlLayer.getDefaultViewport());
      }

      self.setCenter(new google.maps.LatLng(self.kmlCentre[0], self.kmlCentre[1]));
    }
    /**
    * update centre of map from bounds on KML layer -- not called when centre is set for map
    */


    function recordKmlCentre() {
      centre = kmlLayer.getDefaultViewport().getCenter();
    } // if a centre has been set, stop the viewport from changing and add the centre to map options


    if (this.kmlCentre) {
      options.preserveViewport = true;
      options.center = new google.maps.LatLng(this.kmlCentre[0], this.kmlCentre[1]);
    }

    kmlLayer = new google.maps.KmlLayer(options); // listen for KML layer loaded event

    google.maps.event.addListenerOnce(kmlLayer, "defaultviewport_changed", this.kmlCentre ? resetCentre : recordKmlCentre);
    return kmlLayer;
  }; // load localisations if they haven't already been loaded


  if (!this.localised && "flxmap" in window) {
    this.localise();
  } // set map defaults


  this.mapTypeId = google.maps.MapTypeId.ROADMAP;
  this.mapTypeControl = true; // no control for changing map type

  this.scaleControl = false; // no control for changing scale

  this.panControl = false; // no control for panning

  this.zoomControl = true; // show control for zooming

  this.zoomControlStyle = "small"; // from "small", "large", "default"

  this.streetViewControl = false; // no control for street view

  this.fullscreen = true; // show control for full-screen view

  this.gestureHandling = undefined; // defaults to cooperative

  this.scrollwheel = undefined; // deprecated; use gestureHandling instead

  this.draggable = undefined; // deprecated; use gestureHandling instead

  this.dblclickZoom = undefined; // deprecated; use gestureHandling instead

  this.zoom = 16; // zoom level, smaller is closer

  this.markerTitle = ""; // title for marker info window

  this.markerDescription = ""; // description for marker info window

  this.markerHTML = ""; // HTML for marker info window (overrides title and description)

  this.markerLink = ""; // link for marker title

  this.markerLinkTarget = ""; // link target for marker link, e.g. _blank

  this.markerLinkText = false; // link text for marker link, overriding default text

  this.markerIcon = ""; // link for marker icon, leave blank for default

  this.markerShowInfo = true; // if have infowin for marker, show it immediately

  this.markerAnimation = "drop"; // marker animation - bounce, drop, none

  this.markerDirections = false; // show directions link in info window

  this.markerDirectionsShow = false; // show directions as soon as page loads

  this.markerDirectionsDefault = ""; // default from: location for directions

  this.markerAddress = ""; // address of marker, if given

  this.targetFix = true; // remove target="_blank" from links on KML map

  this.dirService = false;
  this.dirRenderer = false;
  this.dirDraggable = false; // directions route is draggable (for alternate routing)

  this.dirSuppressMarkers = false; // suppress A/B markers on directions route

  this.dirShowSteps = true; // show the directions steps (turn-by-turn)

  this.dirShowSearch = true; // show the directions form for searching directions

  this.dirTravelMode = "driving"; // can be bicycling, driving, transit, walking

  this.dirUnitSystem = undefined; // can be imperial or metric

  this.region = "";
  this.locale = "en";
  this.localeActive = false;
  this.kmlCentre = false;
  this.kmlcache = "none";
};

FlexibleMap.prototype = function () {
  "use strict";

  function stopEvent(event) {
    event.stopPropagation();
    event.preventDefault();
  } // handle hidden maps, trigger a resize on first display


  var handleHiddenMap = function () {
    if (typeof MutationObserver === "undefined") {
      return function () {};
    }

    return function (flxmap, divID) {
      var container = document.getElementById(divID).parentNode;

      function isHidden(element) {
        var style = window.getComputedStyle(element);
        return style.display === "none" || style.visibility === "hidden";
      } // only need to watch and act if the parent container is hidden from display


      if (isHidden(container)) {
        var observer = new MutationObserver(function (mutations, self) {
          // only proceed if map is visible now
          if (!isHidden(container)) {
            flxmap.redrawOnce(); // stop observing, we're done

            self.disconnect();
          }
        });
        observer.observe(container, {
          attributes: true,
          attributeFilter: ["style"]
        });
      }
    };
  }();
  /**
  * encode special JavaScript characters, so text is safe when building JavaScript/HTML dynamically
  * NB: conservatively assumes that HTML special characters are unsafe, and encodes them too
  * @param {String} text
  * @return {String}
  */


  function encodeJS() {
    /**
    * encode character as Unicode hexadecimal escape sequence
    * @param {String} ch character to encode
    * @return {String}
    */
    function toUnicodeHex(ch) {
      var c = ch.charCodeAt(0);
      var s = c.toString(16); // see if we can use 2-digit hex code

      if (c < 0x100) {
        return "\\x" + ("00" + s).slice(-2);
      } // must use 4-digit hex code


      return "\\u" + ("0000" + s).slice(-4);
    }

    return function (text) {
      // search for JavaScript and HTML special characters, convert to Unicode hex
      return text.replace(/[\\/"'&<>\x00-\x1f\x7f-\xa0\u2000-\u200f\u2028-\u202f]/g, toUnicodeHex); // eslint-disable-line no-control-regex
    };
  }
  /**
  * add cache buster to KML source link
  * @param {String} url
  * @param {String} caching
  * @return {String}
  */


  function kmlCacheBuster(url, caching) {
    var matches = /^(\d+)\s*(minute|hour|day)s?$/.exec(caching);
    var buster;

    if (matches) {
      var milliseconds = new Date().getTime();
      var multiplier = +matches[1];

      switch (matches[2]) {
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
        url += (url.indexOf("?") > -1 ? "&" : "?") + "nocache=" + buster; // eslint-disable-line no-param-reassign
      }
    }

    return url;
  }

  return {
    constructor: FlexibleMap,

    /**
    * collection of locale / phrase mapping for internationalisation of messages
    */
    i18n: {},

    /**
    * collection of custom Google Maps map types for styling maps
    */
    mapTypes: {},
    localised: false,
    // set to true once localisations have been loaded

    /**
    * load localisations into class prototype
    */
    localise: function localise() {
      // load translations
      if ("i18n" in flxmap) {
        FlexibleMap.prototype.i18n = flxmap.i18n;
      } // load custom map types


      if ("mapTypes" in flxmap) {
        var mapTypes = flxmap.mapTypes;

        for (var key in mapTypes) {
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
    setlocale: function setlocale(localeWanted) {
      this.locale = localeWanted; // attempt to set this locale as active

      if (localeWanted in this.i18n) {
        this.localeActive = localeWanted;
      } else {
        // not found, so try simplified locale
        if (localeWanted.substr(0, 2) in this.i18n) {
          this.localeActive = localeWanted;
        } else {
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
    gettext: function gettext(key) {
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
    showKML: function showKML(divID, kmlFileURL, zoom) {
      this.zoom = zoom; // will be falsey if zoom argument is undefined

      var self = this;
      var varName = document.getElementById(divID).getAttribute("data-flxmap");
      var map = this.showMap(divID, [0, 0]);
      var kmlLayer = this.loadKmlMap(kmlCacheBuster(kmlFileURL, this.kmlcache));
      handleHiddenMap(this, divID); // set zoom if specified

      if (typeof zoom != "undefined") {
        // listen for zoom changing to fit markers on KML layer, force it back to what we asked for
        google.maps.event.addListenerOnce(map, "zoom_changed", function () {
          map.setZoom(zoom);
          self.zoom = zoom;
        });
      } // add a directions service if needed


      if (this.markerDirections || this.markerDirectionsShow) {
        this.startDirService(map);
      } // customise the infowindow as required; can do this on click event on KML layer (thanks, Stack Overflow!)


      google.maps.event.addListener(kmlLayer, 'click', function (kmlEvent) {
        var featureData = kmlEvent.featureData; // NB: since Google Maps API v3.9 the info window HTML is precomposed before this event occurs,
        // so just changing the description won't change infowindow

        if (!featureData._flxmapOnce) {
          // add a flag to stop doing this on every click; once is enough
          featureData._flxmapOnce = true; // stop links opening in a new window

          if (self.targetFix && featureData.description) {
            var reTargetFix = / target="_blank"/ig;
            featureData.description = featureData.description.replace(reTargetFix, "");
            featureData.infoWindowHtml = featureData.infoWindowHtml.replace(reTargetFix, "");
          } // if we're showing directions, add directions link to marker description


          if (self.markerDirections) {
            var latLng = kmlEvent.latLng;
            var params = latLng.lat() + ',' + latLng.lng() + ",'" + encodeJS(featureData.name) + "',true";
            var a = '<br /><a href="#" onclick="' + varName + '.showDirections(' + params + '); return false;">' + self.gettext("Directions") + '</a>';
            featureData.infoWindowHtml = featureData.infoWindowHtml.replace(/<\/div><\/div>$/i, a + "</div></div>");
          }
        }
      });
    },

    /**
    * show a map centred at latitude / longitude and with marker at latitude / longitude
    * @param {String} divID the ID of the div that will contain the map
    * @param {Array} centre an array of two integers: [ latitude, longitude ]
    * @param {Array} marker an array of two integers: [ latitude, longitude ]
    */
    showMarker: function showMarker(divID, centre, marker) {
      var map = this.showMap(divID, centre);
      var markerLocation = new google.maps.LatLng(marker[0], marker[1]);
      var options = {
        map: map,
        position: markerLocation,
        icon: this.markerIcon
      };
      var Animation = google.maps.Animation;

      switch (this.markerAnimation) {
        case "drop":
          options.animation = Animation.DROP;
          break;

        case "bounce":
          options.animation = Animation.BOUNCE;
          break;
      }

      var point = new google.maps.Marker(options);
      this.setMarkerPoint(point);
      this.setMarkerLocation(markerLocation);
      handleHiddenMap(this, divID);

      if (!this.markerTitle) {
        this.markerTitle = this.markerAddress;
      }

      if (this.markerTitle || this.markerHTML || this.markerDescription || this.markerLink || this.markerDirections) {
        var self = this;
        var container = document.createElement("DIV");
        var element, a;
        container.className = "flxmap-infowin"; // heading for info window

        element = document.createElement("DIV");
        element.className = "flxmap-marker-title";

        if (this.markerTitle) {
          element.appendChild(document.createTextNode(this.markerTitle)); // add tooltip title for marker

          point.setTitle(this.markerTitle);
        }

        container.appendChild(element); // add precomposed HTML for infowindow

        if (this.markerHTML) {
          element = document.createElement("DIV");
          element.innerHTML = this.markerHTML;
          container.appendChild(element);
        } // body of info window, with link


        if (this.markerDescription || this.markerLink) {
          element = document.createElement("DIV");
          element.className = "flxmap-marker-link";

          if (this.markerDescription) {
            var lines = this.markerDescription.split("\n");

            for (var i = 0, len = lines.length; i < len; i++) {
              if (i > 0) {
                element.appendChild(document.createElement("BR"));
              }

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
        } // add a link for directions if wanted


        if (this.markerDirections) {
          element = document.createElement("DIV");
          element.className = "flxmap-directions-link";
          a = document.createElement("A");
          a.href = "#";
          a.dataLatitude = marker[0];
          a.dataLongitude = marker[1];
          a.addEventListener("click", function (event) {
            stopEvent(event);
            self.showDirections(this.dataLatitude, this.dataLongitude, true);
          });
          a.appendChild(document.createTextNode(this.gettext("Directions")));
          element.appendChild(a);
          container.appendChild(element);
        }

        var infowin = new google.maps.InfoWindow({
          content: container
        });
        this.setMarkerInfowin(infowin);

        if (this.markerShowInfo) {
          // open after map is loaded, so that infowindow will auto-pan and won't be cropped at top
          google.maps.event.addListenerOnce(map, "tilesloaded", function () {
            infowin.open(map, point);
          });
        }

        google.maps.event.addListener(point, "click", function () {
          infowin.open(map, point);
        }); // find Google link and append marker info, modern browsers only!
        // NB: Google link is set before initial map idle event, and reset each time the map centre changes

        var googleLink = function googleLink() {
          self.updateGoogleLink();
        };

        google.maps.event.addListener(map, "idle", googleLink);
        google.maps.event.addListener(map, "center_changed", googleLink);
        google.maps.event.addListenerOnce(map, "tilesloaded", googleLink);
      } // add a directions service if needed


      if (this.markerDirections || this.markerDirectionsShow) {
        this.startDirService(map); // show directions immediately if required

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
    showAddress: function showAddress(divID, address) {
      var self = this;
      var geocoder = new google.maps.Geocoder();
      this.markerAddress = address;

      if (this.markerTitle === "") {
        this.markerTitle = address;
      }

      geocoder.geocode({
        address: address,
        region: this.region
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          var location = results[0].geometry.location;
          var centre = [location.lat(), location.lng()];
          self.showMarker(divID, centre, centre);
        } else {
          window.alert("Map address returns error: " + status);
        }
      });
    },

    /**
    * set query parameters on Google link to maps -- modern browsers only
    * NB: will only set the query parameters when Google link doesn't have them already;
    * Google link is set before initial map idle event, and reset each time the map centre changes
    */
    updateGoogleLink: function updateGoogleLink() {
      if ("querySelectorAll" in document) {
        try {
          var _flxmap = this.getMap().getDiv();

          var location = this.getMarkerLocation();

          var googleLinks = _flxmap.querySelectorAll("a[href*='maps.google.com/maps']:not([href*='mps_dialog']):not([href*='&q='])");

          var query = encodeURIComponent((this.markerAddress ? this.markerAddress : this.markerTitle) + " @" + location.lat() + "," + location.lng());

          for (var i = 0, len = googleLinks.length; i < len; i++) {
            googleLinks[i].href += "&mrt=loc&iwloc=A&q=" + query;
          }
        } catch (e) {// we don't care about IE8 and earlier...
        }
      }
    },

    /**
    * tell Google Maps to redraw the map, and centre it back where it started with default zoom
    */
    redraw: function redraw() {
      var map = this.getMap();
      var kmlLayer = this.getKmlLayer();
      google.maps.event.trigger(map, "resize"); // if map is KML, must refit to computed bounds, else use centre and zoom setting

      if (kmlLayer) {
        map.fitBounds(kmlLayer.getDefaultViewport());

        if (this.zoom) {
          map.setZoom(this.zoom);
        }
      } else {
        map.setCenter(this.getCenter());
        map.setZoom(this.zoom); // redraw the marker's infowindow if it has one

        var infowin = this.getMarkerInfowin();

        if (infowin) {
          infowin.open(map, this.getMarkerPoint());
        }
      }
    },

    /**
    * create directions service
    */
    startDirService: function startDirService(map) {
      // make sure we have a directions service
      if (!this.dirService) {
        this.dirService = new google.maps.DirectionsService();
      } // make sure we have a directions renderer


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
    showDirections: function showDirections(latitude, longitude, focus) {
      var self = this;
      /**
      * show the directions form to allow directions searches
      */

      function showDirectionsForm() {
        var panel = document.getElementById(self.markerDirectionsDiv);
        var form = document.createElement("form");
        var p, from; // remove all from panel

        for (p = panel.lastChild; p; p = panel.lastChild) {
          panel.removeChild(p);
        } // populate form and add to panel


        p = document.createElement("p");
        p.appendChild(document.createTextNode(self.gettext("From") + ": "));
        from = document.createElement("input");
        from.type = "text";
        from.name = "from";
        from.value = self.markerDirectionsDefault;
        p.appendChild(from);
        var input = document.createElement("input");
        input.type = "submit";
        input.value = self.gettext("Get directions");
        p.appendChild(input);
        form.appendChild(p);
        panel.appendChild(form); // only focus when asked, to prevent problems autofocusing on elements and scrolling the page!

        if (focus) {
          from.focus();
        } // handle the form submit


        form.addEventListener("submit", function (event) {
          stopEvent(event);
          var from = this.elements.from.value; // only process if something was entered to search on

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
        var dest = self.markerAddress === "" ? new google.maps.LatLng(latitude, longitude) : self.markerAddress;
        var request = {
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
      } // if we have a directions div, show the form for searching it


      if (this.markerDirectionsDiv && this.dirShowSearch) {
        showDirectionsForm();
      } // if the from: location is already set, trigger the directions query


      if (this.markerDirectionsDefault) {
        requestDirections(this.markerDirectionsDefault);
      }
    }
  };
}();
