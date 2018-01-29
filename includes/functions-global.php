<?php

if (!defined('ABSPATH')) {
	exit;
}

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

