<?php
/*
Plugin Name: Flexible Map
Plugin URI: http://snippets.webaware.com.au/wordpress-plugins/wp-flexible-map/
Description: Flexible map using Google Maps, for displaying a map specified by centre coodinates or by Google Earth KML file.
Version: 1.0.0
Author: WebAware Pty Ltd
Author URI: http://www.webaware.com.au/
*/

/*
copyright (c) 2011-2012 WebAware Pty Ltd (email : rmckay@webaware.com.au)

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

	// shortcode tags
	define('FLXMAP_PLUGIN_TAG_MAP', 'flexiblemap');
}

/**
 * autoload classes as/when needed
 *
 * use clues from names of library classes to locate them
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

// register plug-in activation / deactivation
register_activation_hook(__FILE__, array($FlxMapPlugin, 'activate'));
register_deactivation_hook(__FILE__, array($FlxMapPlugin, 'deactivate'));

/**
* utility function so themes can easily display the map
* @param array $attrs
*/
function flexmap_show_map($attrs) {
	echo apply_filters('flexmap_getmap', $attrs);
}
