<?php
/**
* class for managing the plugin
*/
class FlxMapPlugin {
	public $urlBase;									// string: base URL path to files in plugin

	private $admin;										// handle to admin object if running in wp-admin
	private $loadScripts = FALSE;						// true when scripts should be loaded

	/**
	* static method for getting the instance of this singleton object
	*
	* @return FlxMapPlugin
	*/
	public static function getInstance() {
		static $instance = NULL;

		if (is_null($instance)) {
			$class = __CLASS__;
			$instance = new $class;
		}

		return $instance;
	}

	/**
	* hook the plug-in's initialise event to handle all post-activation initialisation
	*/
	private function __construct() {
		// record plugin URL base
		$this->urlBase = WP_PLUGIN_URL . '/' . dirname(plugin_basename(__FILE__));

		if (is_admin()) {
			// kick off the admin handling
			$this->admin = new FlxMapAdmin($this);
		}
		else {
			// add shortcodes
			add_shortcode(FLXMAP_PLUGIN_TAG_MAP, array($this, 'shortcodeMap'));

			// non-admin actions and filters for this plugin
			add_action('wp_footer', array($this, 'actionFooter'));

			// custom actions and filters for this plugin
			add_filter('flexmap_getmap', array($this, 'shortcodeMap'), 10, 1);
		}
	}

	/**
	* activate the plug-in (called by activate event): add custom capabilities, etc.
	*/
	public function activate() {
		// NOP
	}

	/**
	* deactivate the plug-in (called by deactivate event): remove custom capabilities, etc.
	*/
	public function deactivate() {
		// remove deprecated custom capabilities for administrator (from previous versions)
		$role = get_role('administrator');
		$role->remove_cap('flxmap_options');

		// remove deprecated custom capabilities for editor (from previous versions)
		$role = get_role('editor');
		$role->remove_cap('flxmap_options');
	}

	/**
	* output anything we need in the footer
	*/
	public function actionFooter() {
		if ($this->loadScripts) {
			// load required scripts
			$url = parse_url("{$this->urlBase}/flexible-map.min.js", PHP_URL_PATH) . '?v=4';

			echo <<<HTML
<script src="$url"></script>
<script src="http://maps.google.com/maps/api/js?v=3.8&amp;sensor=false"></script>

HTML;
		}
	}

	/**
	* handle shortcode for map display
	*
	* @param array shortcode attributes as supplied by the WP shortcode API
	* @return string output to substitute for the shortcode
	*/
	public function shortcodeMap($attrs) {
		$html = '';

		if (!empty($attrs['src']) || !empty($attrs['center']) || !empty($attrs['address'])) {
			$this->loadScripts = TRUE;
			$divID = uniqid('flxmap-');
			$width = isset($attrs['width']) ? preg_replace('/\D/', '', $attrs['width']) : 400;
			$height = isset($attrs['height']) ? preg_replace('/\D/', '', $attrs['height']) : 400;

			$directions = FALSE;
			$divDirections = '';
			if (isset($attrs['directions']) && !self::isNo($attrs['directions'])) {
				$directions = TRUE;
				if (self::isYes($attrs['directions'])) {
					$divDirectionsID = "$divID-dir";
					$divDirections = "\n<div id='$divDirectionsID' class='flxmap-directions'></div>";
				}
				else {
					$divDirectionsID = $attrs['directions'];
				}
			}

			$html = <<<HTML
<div id="$divID" class='flxmap-container' style="width: {$width}px; height: ${height}px;"></div>$divDirections
<script>
//<![CDATA[
(function (w, fn) {
 if (w.addEventListener) w.addEventListener("DOMContentLoaded", fn, false);
 else if (w.attachEvent) w.attachEvent("onload", fn);
})(window, function() {
 var f = new FlexibleMap();

HTML;

			if (!(isset($attrs['hideMapType']) && self::isYes($attrs['hideMapType']))) {
				$html .= " f.mapTypeControl = true;\n";
			}

			if ($directions) {
				$html .= " f.markerDirections = \"$divDirectionsID\";\n";
			}

			if (isset($attrs['showinfo']) && self::isNo($attrs['showinfo'])) {
				$html .= " f.markerShowInfo = false;\n";
			}

			if (isset($attrs['maptype'])) {
				$html .= " f.mapTypeId = \"{$attrs['maptype']}\";\n";
			}

			if (isset($attrs['region'])) {
				$html .= " f.region = \"{$attrs['region']}\";\n";
			}

			// add map based on coordinates, with optional marker coordinates
			if (isset($attrs['center']) && self::isCoordinates($attrs['center'])) {
				$marker = $attrs['center'];
				if (isset($attrs['marker']) && self::isCoordinates($attrs['marker']))
					$marker = $attrs['marker'];

				if (isset($attrs['zoom']))
					$html .= " f.zoom = " . preg_replace('/\D/', '', $attrs['zoom']) . ";\n";

				if (!empty($attrs['title']))
					$html .= " f.markerTitle = \"{$this->unhtml($attrs['title'])}\";\n";

				if (!empty($attrs['description']))
					$html .= " f.markerDescription = \"{$this->unhtml($attrs['description'])}\";\n";

				if (!empty($attrs['address']))
					$html .= " f.markerAddress = \"{$this->unhtml($attrs['address'])}\";\n";

				if (!empty($attrs['link'])) {
					$link = self::str2js($attrs['link']);
					$html .= " f.markerLink = \"$link\";\n";
				}

				$html .= " f.showMarker(\"$divID\", [{$attrs['center']}], [{$marker}]);\n";
			}

			// add map based on address query
			else if (isset($attrs['address'])) {
				if (isset($attrs['zoom']))
					$html .= " f.zoom = " . preg_replace('/\D/', '', $attrs['zoom']) . ";\n";

				if (!empty($attrs['title']))
					$html .= " f.markerTitle = \"{$this->unhtml($attrs['title'])}\";\n";

				if (!empty($attrs['description']))
					$html .= " f.markerDescription = \"{$this->unhtml($attrs['description'])}\";\n";

				if (!empty($attrs['link'])) {
					$link = self::str2js($attrs['link']);
					$html .= " f.markerLink = \"$link\";\n";
				}

				$html .= " f.showAddress(\"$divID\", \"{$this->unhtml($attrs['address'])}\");\n";
			}

			// add map based on KML file
			else if (isset($attrs['src'])) {
				$kmlfile = self::str2js($attrs['src']);
				$html .= " f.showKML(\"$divID\", \"$kmlfile\"";

				if (isset($attrs['zoom']))
					$html .= ', ' . preg_replace('/\D/', '', $attrs['zoom']);

				$html .= ");\n";
			}

			$html .= "});\n//]]>\n</script>\n";
		}

		return $html;
	}

	/**
	* test string to see if contents equate to yes/true
	* @param string $text
	* @return boolean
	*/
	private static function isYes($text) {
		return preg_match('/^(?:y|yes|true|1)$/i', $text);
	}

	/**
	* test string to see if contents equate to no/false
	* @param string $text
	* @return boolean
	*/
	private static function isNo($text) {
		return preg_match('/^(?:n|no|false|0)$/i', $text);
	}

	/**
	* test string to see if contents are map coordinates (latitude,longitude)
	* @param string $text
	* @return boolean
	*/
	private static function isCoordinates($text) {
		return preg_match('/^-?\\d+(?:\\.\\d+),-?\\d+(?:\\.\\d+)$/', $text);
	}

	/**
	* decode HTML-encoded text and encode for JavaScript string
	* @param string $text
	* @return string
	*/
	private static function unhtml($text) {
		return self::str2js(html_entity_decode($text));
	}

	/**
	* encode for JavaScript string
	* @param string $text
	* @return string
	*/
	private static function str2js($text) {
		return addcslashes($text, "\\/\'\"&\n\r<>");
	}
}
