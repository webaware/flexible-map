<?php

if (!defined('ABSPATH')) {
	exit;
}

/**
* class for managing the plugin
*/
class FlxMapPlugin {
	public $urlBase;									// string: base URL path to files in plugin

	protected $locale;									// locale of current website
	protected $locales		= array();					// list of locales enqueued for localisation of maps
	protected $mapTypes		= array();					// custom Google Maps map types to be loaded with maps, keyed by mapTypeId

	/**
	* static method for getting the instance of this singleton object
	*
	* @return FlxMapPlugin
	*/
	public static function getInstance() {
		static $instance = null;

		if (is_null($instance)) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	* hook the plug-in's initialise event to handle all post-activation initialisation
	*/
	private function __construct() {
		// record plugin URL base
		$this->urlBase = plugin_dir_url(FLXMAP_PLUGIN_FILE);

		add_action('init', array($this, 'init'));

		if (is_admin()) {
			// kick off the admin handling
			require FLXMAP_PLUGIN_ROOT . 'includes/class.FlxMapAdmin.php';
			new FlxMapAdmin();
		}
		else {
			// non-admin actions and filters for this plugin
			add_action('wp_enqueue_scripts', array($this, 'enqueueScripts'));
			add_action('wp_footer', array($this, 'justInTimeLocalisation'));

			// custom actions and filters for this plugin
			add_filter('flexmap_getmap', array($this, 'getMap'), 10, 1);
		}

		if (!is_admin() || (defined('DOING_AJAX') && DOING_AJAX)) {
			// add shortcodes
			add_shortcode(FLXMAP_PLUGIN_TAG_MAP, array($this, 'shortcodeMap'));
		}
	}

	/**
	* initialise the plugin, called on init action
	*/
	public function init() {
		// start off required locales with this website's WP locale
		$this->locale = get_locale();

		// load translation strings for the admin
		load_plugin_textdomain('wp-flexible-map', false, basename(dirname(FLXMAP_PLUGIN_FILE)) . '/languages/');
	}

	/**
	* set the reqired locales so that appropriate scripts will be loaded
	* @param array $locales a list of locale names
	*/
	public function setLocales($locales) {
		foreach ($locales as $locale) {
			$this->enqueueLocale($locale);
		}
	}

	/**
	* register and enqueue any scripts and styles we require
	*/
	public function enqueueScripts() {
		$options = get_option(FLXMAP_PLUGIN_OPTIONS, array());

		$args   = array('v' => '3.26');
		if (!empty($options['apiKey'])) {
			$args['key'] = $options['apiKey'];
		}
		$args   = apply_filters('flexmap_google_maps_api_args', $args);

		$apiURL = apply_filters('flexmap_google_maps_api_url', add_query_arg($args, 'https://maps.google.com/maps/api/js'));
		if (!empty($apiURL)) {
			wp_register_script('google-maps', $apiURL, false, null, true);
		}

		$min = SCRIPT_DEBUG ? '' : '.min';
		$ver = SCRIPT_DEBUG ? time() : FLXMAP_PLUGIN_VERSION;
		wp_register_script('flxmap', "{$this->urlBase}js/flexible-map$min.js", array('google-maps'), $ver, true);

		// theme writers: you can remove this stylesheet by calling wp_dequeue_script('flxmap');
		wp_enqueue_style('flxmap', $this->urlBase . 'css/styles.css', false, $ver);
	}

	/**
	* enqueue an i18n script
	* @param string $locale
	*/
	protected function enqueueLocale($locale) {
		$locale = strtr($locale, '_', '-');
		$this->locales[$locale] = 1;
	}

	/**
	* load any enqueued locales and map types as localisations on the main script
	*/
	public function justInTimeLocalisation() {
		$localise = array();

		if (!empty($this->locales)) {
			if (!class_exists('FlxMapLocalisation', false)) {
				require FLXMAP_PLUGIN_ROOT . 'includes/class.FlxMapLocalisation.php';
			}
			$localisation = new FlxMapLocalisation();
			$i18n = $localisation->getLocalisations($this->locales);
			if (!empty($i18n)) {
				$localise['i18n'] = $i18n;
			}
		}

		if (!empty($this->mapTypes)) {
			$localise['mapTypes'] = $this->mapTypes;
		}

		if (!empty($localise)) {
			wp_localize_script('flxmap', 'flxmap', $localise);
		}
	}

	/**
	* handle shortcode for map display
	*
	* @param array shortcode attributes as supplied by the WP shortcode API
	* @return string output to substitute for the shortcode
	*/
	public function shortcodeMap($attrs) {
		return $this->getMap($attrs);
	}

	/**
	* get HTML and script for map
	*
	* @param array shortcode attributes as supplied by the WP shortcode API
	* @return string HTML and script for the map
	*/
	public function getMap($attrs) {
		$html = '';

		// allow plugins / themes to change the shortcode attributes used
		$attrs = apply_filters('flexmap_shortcode_attrs', $attrs);

		// allow plugins / themes to register custom Google Maps map types
		$this->mapTypes = apply_filters('flexmap_custom_map_types', $this->mapTypes, $attrs);

		if (!empty($attrs['src']) || !empty($attrs['center']) || !empty($attrs['address'])) {
			$this->loadScripts = true;
			if (empty($attrs['id'])) {
				$ID = uniqid();
				$divID = 'flxmap-' . $ID;
			}
			else {
				$ID = $attrs['id'];
				$divID = esc_attr($ID);
			}
			$varID = 'flxmap_' . preg_replace('/[^a-z0-9_$]/i', '_', $ID);

			// build the inline styles for the div
			$styles = array();
			$styles['width'] = isset($attrs['width']) ? self::getUnits($attrs['width']) : '400px';
			$styles['height'] = isset($attrs['height']) ? self::getUnits($attrs['height']) : '400px';
			$styles = apply_filters('flexmap_shortcode_styles', $styles, $attrs);
			if (empty($styles)) {
				$inlinestyles = '';
			}
			else {
				$inlinestyles = 'style="';
				foreach ($styles as $style => $value) {
					$inlinestyles .= $style . ':' . $value . ';';
				}
				$inlinestyles .= '"';
			}

			// test for any conditions that show directions (thus requiring the directions div)
			$directions = false;
			$divDirectionsID = $divDirectionsID = '';
			if (isset($attrs['directions']) && !self::isNo($attrs['directions'])) {
				$directions = true;
				if (!self::isYes($attrs['directions'])) {
					$divDirectionsID = self::str2js($attrs['directions']);
				}
			}
			if (isset($attrs['showdirections']) && self::isYes($attrs['showdirections'])) {
				$directions = true;
			}
			if (isset($attrs['directionsfrom'])) {
				$directions = true;
			}

			// build the directions div, if required
			$divDirections = '';
			if ($directions && empty($divDirectionsID)) {
				$divDirectionsID = "$divID-dir";
				$divDirections = "\n<div id='$divDirectionsID' class='flxmap-directions'></div>";
			}

			$html = <<<HTML
<div id="$divID" class='flxmap-container' data-flxmap='$varID' $inlinestyles></div>$divDirections

HTML;

			$script = " var f = new FlexibleMap();\n";

			if (isset($attrs['hidemaptype']) && self::isYes($attrs['hidemaptype'])) {
				$script .= " f.mapTypeControl = false;\n";
			}

			if (isset($attrs['hidescale']) && self::isNo($attrs['hidescale'])) {
				$script .= " f.scaleControl = true;\n";
			}

			if (isset($attrs['hidepanning']) && self::isNo($attrs['hidepanning'])) {
				$script .= " f.panControl = true;\n";
			}

			if (isset($attrs['hidezooming']) && self::isYes($attrs['hidezooming'])) {
				$script .= " f.zoomControl = false;\n";
			}

			if (!empty($attrs['zoomstyle'])) {
				$script .= " f.zoomControlStyle = \"{$this->str2js($attrs['zoomstyle'])}\";\n";
			}

			if (isset($attrs['hidestreetview']) && self::isNo($attrs['hidestreetview'])) {
				$script .= " f.streetViewControl = true;\n";
			}

			if (isset($attrs['showinfo']) && self::isNo($attrs['showinfo'])) {
				$script .= " f.markerShowInfo = false;\n";
			}

			if (isset($attrs['scrollwheel']) && self::isYes($attrs['scrollwheel'])) {
				$script .= " f.scrollwheel = true;\n";
			}

			if (isset($attrs['draggable']) && self::isNo($attrs['draggable'])) {
				$script .= " f.draggable = false;\n";
			}

			if (isset($attrs['dblclickzoom']) && self::isNo($attrs['dblclickzoom'])) {
				$script .= " f.dblclickZoom = false;\n";
			}

			if (isset($attrs['directions'])) {
				if (self::isNo($attrs['directions'])) {
					$script .= " f.markerDirections = false;\n";
				}
				else {
					$script .= " f.markerDirections = true;\n";
				}
			}

			if ($directions) {
				$script .= " f.markerDirectionsDiv = \"$divDirectionsID\";\n";
			}

			if (isset($attrs['showdirections']) && self::isYes($attrs['showdirections'])) {
				$script .= " f.markerDirectionsShow = true;\n";
			}

			if (isset($attrs['directionsfrom'])) {
				$script .= " f.markerDirectionsDefault = \"{$this->str2js($attrs['directionsfrom'])}\";\n";
			}

			if (isset($attrs['directions']) && self::isNo($attrs['directions'])) {
				$script .= " f.markerDirectionsInfo = false;\n";
			}

			if (isset($attrs['dirdraggable']) && self::isYes($attrs['dirdraggable'])) {
				$script .= " f.dirDraggable = true;\n";
			}

			if (isset($attrs['dirnomarkers']) && self::isYes($attrs['dirnomarkers'])) {
				$script .= " f.dirSuppressMarkers = true;\n";
			}

			if (isset($attrs['dirshowsteps']) && self::isNo($attrs['dirshowsteps'])) {
				$script .= " f.dirShowSteps = false;\n";
			}

			if (isset($attrs['dirshowssearch']) && self::isNo($attrs['dirshowssearch'])) {
				$script .= " f.dirShowSearch = false;\n";
			}

			if (isset($attrs['dirtravelmode']) && in_array(strtolower($attrs['dirtravelmode']), array('bicycling', 'driving', 'transit', 'walking'))) {
				$dirTravelMode = strtolower($attrs['dirtravelmode']);
				$script .= " f.dirTravelMode = \"$dirTravelMode\";\n";
			}

			if (isset($attrs['dirunitsystem']) && in_array(strtolower($attrs['dirunitsystem']), array('imperial', 'metric'))) {
				$dirUnitSystem = strtolower($attrs['dirunitsystem']);
				$script .= " f.dirUnitSystem = \"$dirUnitSystem\";\n";
			}

			if (isset($attrs['maptype'])) {
				$script .= " f.mapTypeId = \"{$this->str2js($attrs['maptype'])}\";\n";
			}

			if (isset($attrs['maptypes'])) {
				$script .= " f.mapTypeIds = \"{$this->str2js($attrs['maptypes'])}\";\n";
			}

			if (isset($attrs['region'])) {
				$script .= " f.region = \"{$this->str2js($attrs['region'])}\";\n";
			}

			if (isset($attrs['locale'])) {
				$locale = self::str2js(str_replace('_', '-', $attrs['locale']));
				$script .= " f.setlocale(\"{$this->str2js($locale)}\");\n";
				$this->enqueueLocale($attrs['locale']);
			}
			else if ($this->locale != '' || $this->locale != 'en-US') {
				$locale = self::str2js(str_replace('_', '-', $this->locale));
				$script .= " f.setlocale(\"$locale\");\n";
				$this->enqueueLocale($locale);
			}

			// if have address but not coordinates, attempt to retrieve coordinates for address
			if (empty($attrs['center']) && !empty($attrs['address'])) {
				$region = empty($attrs['region']) ? '' : $attrs['region'];
				$center = self::getAddressCoordinates($attrs['address'], $region);
				if ($center) {
					$attrs['center'] = implode(',', $center);
				}
			}

			// add map based on coordinates, with optional marker coordinates
			if (isset($attrs['center']) && self::isCoordinates($attrs['center'])) {
				$marker = self::str2js(self::getCoordinates($attrs['center']));
				if (isset($attrs['marker']) && self::isCoordinates($attrs['marker']))
					$marker = self::str2js(self::getCoordinates($attrs['marker']));

				if (isset($attrs['zoom']))
					$script .= " f.zoom = " . preg_replace('/\D/', '', $attrs['zoom']) . ";\n";

				if (!empty($attrs['title']))
					$script .= " f.markerTitle = \"{$this->unhtml($attrs['title'])}\";\n";

				if (!empty($attrs['description']))
					$script .= " f.markerDescription = \"{$this->unhtml($attrs['description'])}\";\n";

				if (!empty($attrs['html']))
					$script .= " f.markerHTML = \"{$this->str2js($attrs['html'])}\";\n";

				if (!empty($attrs['address']))
					$script .= " f.markerAddress = \"{$this->unhtml($attrs['address'])}\";\n";

				if (!empty($attrs['link'])) {
					$link = self::str2js($attrs['link']);
					$script .= " f.markerLink = \"$link\";\n";
				}

				if (!empty($attrs['linktarget'])) {
					$script .= " f.markerLinkTarget = \"{$this->str2js($attrs['linktarget'])}\";\n";
				}

				if (!empty($attrs['linktext'])) {
					$script .= " f.markerLinkText = \"{$this->unhtml($attrs['linktext'])}\";\n";
				}

				if (!empty($attrs['icon'])) {
					$icon = self::str2js($attrs['icon']);
					$script .= " f.markerIcon = \"$icon\";\n";
				}

				$script .= " f.showMarker(\"$divID\", [{$attrs['center']}], [{$marker}]);\n";
			}

			// add map based on address query
			else if (isset($attrs['address'])) {
				if (isset($attrs['zoom']))
					$script .= " f.zoom = " . preg_replace('/\D/', '', $attrs['zoom']) . ";\n";

				if (!empty($attrs['title']))
					$script .= " f.markerTitle = \"{$this->unhtml($attrs['title'])}\";\n";

				if (!empty($attrs['description']))
					$script .= " f.markerDescription = \"{$this->unhtml($attrs['description'])}\";\n";

				if (!empty($attrs['html']))
					$script .= " f.markerHTML = \"{$this->str2js($attrs['html'])}\";\n";

				if (!empty($attrs['link'])) {
					$link = self::str2js($attrs['link']);
					$script .= " f.markerLink = \"$link\";\n";
				}

				if (!empty($attrs['icon'])) {
					$icon = self::str2js($attrs['icon']);
					$script .= " f.markerIcon = \"$icon\";\n";
				}

				$script .= " f.showAddress(\"$divID\", \"{$this->unhtml($attrs['address'])}\");\n";
			}

			// add map based on KML file
			else if (isset($attrs['src'])) {
				if (isset($attrs['targetfix']) && self::isNo($attrs['targetfix'])) {
					$script .= " f.targetFix = false;\n";
				}

				if (isset($attrs['kmlcache']) && preg_match('/^(?:none|\d+\s*minutes?|\d+\s*hours?|\d+\s*days?)$/', $attrs['kmlcache'])) {
					$script .= " f.kmlcache = \"{$attrs['kmlcache']}\";\n";
				}

				$kmlfile = self::str2js($attrs['src']);
				$script .= " f.showKML(\"$divID\", \"$kmlfile\"";

				if (isset($attrs['zoom']))
					$script .= ', ' . preg_replace('/\D/', '', $attrs['zoom']);

				$script .= ");\n";
			}

			// allow others to change the generated script
			$script = apply_filters('flexmap_shortcode_script', $script, $attrs);

			if ((defined('DOING_AJAX') && DOING_AJAX) || (isset($attrs['isajax']) && self::isYes($attrs['isajax']))) {
				// ensure that the required scripts are on the page already
				if (!wp_script_is('flxmap', 'done')) {
					wp_print_scripts('flxmap');
				}

				// wrap it up for AJAX load, no event trigger
				$html .= <<<HTML
<script data-noptimize="1">
/* <![CDATA[ */
var $varID = (function() {
$script return f;
})();
/* ]]> */
</script>

HTML;
			}
			else {
				// wrap it up for standard page load, with "content ready" trigger
				$html .= <<<HTML
<script data-noptimize="1">
/* <![CDATA[ */
(function(w, fn) {
 if (w.addEventListener) w.addEventListener("DOMContentLoaded", fn, false);
 else if (w.attachEvent) w.attachEvent("onload", fn);
})(window, function() {
$script window.$varID = f;
});
/* ]]> */
</script>

HTML;
			}
		}

		// allow others to change the generated html
		$html = apply_filters('flexmap_shortcode_html', $html, $attrs);

		// enqueue scripts
		wp_enqueue_script('flxmap');
		if ($this->locale != '' && $this->locale != 'en_US') {
			$this->enqueueLocale($this->locale);
		}

		return $html;
	}

	/**
	* get valid CSS units from string, or default to 400px if invalid
	* @param string $units
	* @return string
	*/
	protected static function getUnits($units) {
		$units = trim($units);

		// check for valid CSS units
		if (!preg_match('/^auto$|^[+-]?[0-9]+\\.?(?:[0-9]+)?(?:px|em|ex|ch|%|in|cm|mm|pt|pc|rem|vh|vw|vmin|vmax)$/', $units)) {
			// not valid, so check to see if it's only digits
			if (preg_match('/\D/', $units)) {
				// not digits, so set to default
				$units = '400px';
			}
			else {
				// found only digits, so append px
				$units .= 'px';
			}
		}

		return $units;
	}

	/**
	* get coordinate for given address
	* @param string $address
	* @param string $region
	* @return array|false
	*/
	protected static function getAddressCoordinates($address, $region) {
		// try to get a cached answer first
		$cacheKey = 'flxmap_' . md5("$address|$region");
		$coords = get_transient($cacheKey);

		if ($coords === false) {
			// build Google Maps geocoding query
			$args = array('address'	=> urlencode($address));
			if (!empty($region)) {
				$args['region'] = urlencode($region);
			}
			$url = add_query_arg($args, 'https://maps.googleapis.com/maps/api/geocode/json');

			try {
				// fetch coordinates
				$response = wp_remote_get($url);

				if (is_wp_error($response)) {
					throw new Exception('http error = ' . $response->get_error_message());
				}

				$result = json_decode($response['body']);
				if (!$result) {
					throw new Exception("error decoding JSON\n" . $response['body']);
				}

				if ($result->status != 'OK') {
					throw new Exception("error retrieving address: " . $result->status);
				}

				// success, return array with latitude and longitude
				$location = $result->results[0]->geometry->location;
				$coords = array($location->lat, $location->lng);
			}
			catch (Exception $e) {
				$coords = "address: $address; " . $e->getMessage();
				error_log(__METHOD__ . ': ' . $coords);
			}

			// save coordinates to prevent unnecessary requery
			set_transient($cacheKey, $coords, WEEK_IN_SECONDS);
		}

		// handle failure to map address to coordinates by returning false
		if (!is_array($coords)) {
			$coords = false;
		}

		return $coords;
	}

	/**
	* test string to see if contents equate to yes/true
	* @param string $text
	* @return boolean
	*/
	public static function isYes($text) {
		return preg_match('/^(?:y|yes|true|1)$/i', $text);
	}

	/**
	* test string to see if contents equate to no/false
	* @param string $text
	* @return boolean
	*/
	public static function isNo($text) {
		return preg_match('/^(?:n|no|false|0)$/i', $text);
	}

	/**
	* test string to see if contents are map coordinates (latitude,longitude)
	* @param string $text
	* @return boolean
	*/
	public static function isCoordinates($text) {
		// TODO: handle degrees minutes seconds, degrees minutes.decimal, NSEW
		return preg_match('/^-?[0-9]+(?:\.[0-9]+),\s*-?[0-9]+(?:\.[0-9]+)$/', $text);
	}

	/**
	* return standardised coordinates from text
	* NB: assumes text passes isCoordinates() above
	* @param string $text
	* @return boolean
	*/
	protected static function getCoordinates($text) {
		// TODO: handle degrees minutes seconds, degrees minutes.decimal, NSEW
		return str_replace(' ', '', $text);
	}

	/**
	* decode HTML-encoded text and encode for JavaScript string
	* @param string $text
	* @return string
	*/
	protected static function unhtml($text) {
		return self::str2js(html_entity_decode($text, ENT_QUOTES, get_option('blog_charset')));
	}

	/**
	* encode for JavaScript string
	* @param string $text
	* @return string
	*/
	protected static function str2js($text) {
		return addcslashes($text, "\\/\'\"&\n\r<>");
	}

}
