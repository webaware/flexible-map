<?php
/**
* class for managing the plugin
*/
class FlxMapPlugin {
	public $urlBase;									// string: base URL path to files in plugin

	private $loadScripts = FALSE;						// true when scripts should be loaded
	private $locales;									// hash map of locales required for i18n
	private $locale;

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
		$this->urlBase = plugin_dir_url(__FILE__);

		add_action('init', array($this, 'actionInit'));

		if (is_admin()) {
			// kick off the admin handling
			new FlxMapAdmin($this);
		}
		else {
			// add shortcodes
			add_shortcode(FLXMAP_PLUGIN_TAG_MAP, array($this, 'shortcodeMap'));

			// non-admin actions and filters for this plugin
			add_action('wp_footer', array($this, 'actionFooter'));
			add_action('wp_print_styles', array($this, 'actionEnqueueStyles'));

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
	* initialise the plugin, called on init action
	*/
	public function actionInit() {
		// start off required locales with this website's WP locale
		$this->locales = array();
		$this->locale = get_locale();
		if ($this->locale != '' && $this->locale != 'en_US')
			$this->locales[str_replace('_', '-', $this->locale)] = 1;
	}

	/**
	* enqueue any styles we require
	*/
	public function actionEnqueueStyles() {
		// theme writers: you can remove by calling wp_dequeue_script('flxmap');
		wp_enqueue_style('flxmap', "{$this->urlBase}/styles.css", FALSE, '1');
	}

	/**
	* output anything we need in the footer
	*/
	public function actionFooter() {
		if ($this->loadScripts) {
			// load required scripts
			$url = rtrim(parse_url($this->urlBase, PHP_URL_PATH), '/');

			echo <<<HTML
<script src="$url/flexible-map.min.js?v=7"></script>
<script src="//maps.google.com/maps/api/js?v=3.8&amp;sensor=false"></script>

HTML;

			// see if we need to load i18n messages
			foreach (array_keys($this->locales) as $locale) {
				// check for specific locale first, e.g. 'zh-CN'
				if (file_exists(FLXMAP_PLUGIN_ROOT . "i18n/$locale.js")) {
					echo "<script charset='utf-8' src=\"$url/i18n/$locale.js\"></script>\n";
				}
				else {
					// not found, so check for generic locale, e.g. 'zh'
					$locale = substr($locale, 0, 2);
					if (file_exists(FLXMAP_PLUGIN_ROOT . "i18n/$locale.js")) {
						echo "<script charset='utf-8' src=\"$url/i18n/$locale.js\"></script>\n";
					}
				}
			}
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
<div id="$divID" class='flxmap-container' style="width:{$width}px;height:${height}px;"></div>$divDirections
<script>
//<![CDATA[
(function(w, fn) {
 if (w.addEventListener) w.addEventListener("DOMContentLoaded", fn, false);
 else if (w.attachEvent) w.attachEvent("onload", fn);
})(window, function() {
 var f = new FlexibleMap();

HTML;

			if (isset($attrs['hidemaptype']) && self::isYes($attrs['hidemaptype'])) {
				$html .= " f.mapTypeControl = false;\n";
			}

			if (isset($attrs['hidescale']) && self::isNo($attrs['hidescale'])) {
				$html .= " f.scaleControl = true;\n";
			}

			if (isset($attrs['hidepanning']) && self::isNo($attrs['hidepanning'])) {
				$html .= " f.panControl = true;\n";
			}

			if (isset($attrs['hidezooming']) && self::isYes($attrs['hidezooming'])) {
				$html .= " f.zoomControl = false;\n";
			}

			if (isset($attrs['hidestreetview']) && self::isNo($attrs['hidestreetview'])) {
				$html .= " f.streetViewControl = true;\n";
			}

			if (isset($attrs['showinfo']) && self::isNo($attrs['showinfo'])) {
				$html .= " f.markerShowInfo = false;\n";
			}

			if (isset($attrs['scrollwheel']) && self::isYes($attrs['scrollwheel'])) {
				$html .= " f.scrollwheel = true;\n";
			}

			if (isset($attrs['draggable']) && self::isNo($attrs['draggable'])) {
				$html .= " f.draggable = false;\n";
			}

			if (isset($attrs['dblclickzoom']) && self::isNo($attrs['dblclickzoom'])) {
				$html .= " f.dblclickZoom = false;\n";
			}

			if ($directions) {
				$html .= " f.markerDirections = \"$divDirectionsID\";\n";
			}

			if (isset($attrs['maptype'])) {
				$html .= " f.mapTypeId = \"{$attrs['maptype']}\";\n";
			}

			if (isset($attrs['region'])) {
				$html .= " f.region = \"{$attrs['region']}\";\n";
			}

			if (isset($attrs['locale'])) {
				$html .= " f.setlocale(\"{$attrs['locale']}\");\n";
				$this->locales[$attrs['locale']] = 1;
			}
			else if ($this->locale != '' || $this->locale != 'en-US') {
				$locale = str_replace('_', '-', $this->locale);
				$html .= " f.setlocale(\"$locale\");\n";
				$this->locales[$locale] = 1;
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
		return self::str2js(html_entity_decode($text, ENT_QUOTES, get_option('blog_charset')));
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
