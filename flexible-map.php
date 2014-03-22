<?php
/*
Plugin Name: Flexible Map
Plugin URI: http://flexible-map.webaware.net.au/
Description: Embed Google Maps in pages and posts, either by centre coodinates or street address, or by URL to a Google Earth KML file.
Version: 1.7.3.1
Author: WebAware
Author URI: http://www.webaware.com.au/
*/

/*
copyright (c) 2011-2014 WebAware Pty Ltd (email : rmckay@webaware.com.au)

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

if (!defined('FLXMAP_PLUGIN_ROOT')) {
	define('FLXMAP_PLUGIN_ROOT', dirname(__FILE__) . '/');
	define('FLXMAP_PLUGIN_NAME', basename(dirname(__FILE__)) . '/' . basename(__FILE__));

	// script/style version
	if (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG)
		define('FLXMAP_PLUGIN_VERSION', time());
	else
		define('FLXMAP_PLUGIN_VERSION', '1.7.3.1');

	// shortcode tags
	define('FLXMAP_PLUGIN_TAG_MAP', 'flexiblemap');
}

// instantiate the plug-in
require FLXMAP_PLUGIN_ROOT . 'class.FlxMapPlugin.php';
$FlxMapPlugin = FlxMapPlugin::getInstance();

/**
* utility function so themes can easily display the map
* to return as a string without output to screen, add 'echo'=>'false' to array of attributes
* @param array $attrs
* @return string
*/
function flexmap_show_map($attrs) {
	$plugin = FlxMapPlugin::getInstance();
	$map = $plugin->getMap($attrs);

	if (!isset($attrs['echo']) || FlxMapPlugin::isYes($attrs['echo'])) {
		echo $map;
	}

	return $map;
}

/**
* load the scripts required for the maps to work, e.g. for single-page AJAX websites
* @param array $locales optional: an array of required locale scripts
*/
function flexmap_load_scripts($locales = array()) {
	wp_enqueue_script('flxmap');

	if (count($locales) > 0) {
		$plugin = FlxMapPlugin::getInstance();
		$plugin->setLocales($locales);
	}
}
