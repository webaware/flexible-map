<?php
/*
Plugin Name: Flexible Map
Plugin URI: http://snippets.webaware.com.au/wordpress-plugins/wp-flexible-map/
Description: Embed Google Maps in pages and posts, either by centre coodinates or street address, or by URL to a Google Earth KML file.
Version: 1.6.3
Author: WebAware
Author URI: http://www.webaware.com.au/
*/

/*
copyright (c) 2011-2013 WebAware Pty Ltd (email : rmckay@webaware.com.au)

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
	define('FLXMAP_PLUGIN_VERSION', '1.6.3');

	// shortcode tags
	define('FLXMAP_PLUGIN_TAG_MAP', 'flexiblemap');
}

/**
* autoload classes as/when needed
*
* @param string $class_name name of class to attempt to load
*/
function flxmap_autoload($class_name) {
	static $classMap = array (
		'FlxMapAdmin'						=> 'class.FlxMapAdmin.php',
		'FlxMapPlugin'						=> 'class.FlxMapPlugin.php',
	);

	if (isset($classMap[$class_name])) {
		require FLXMAP_PLUGIN_ROOT . $classMap[$class_name];
	}
}

// register a class (static) method for autoloading required classes
spl_autoload_register('flxmap_autoload');

// instantiate the plug-in
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
