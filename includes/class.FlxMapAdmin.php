<?php

if (!defined('ABSPATH')) {
	exit;
}

/**
* class for admin screens
*/
class FlxMapAdmin {

	/**
	* @param FlxMapPlugin $plugin
	*/
	public function __construct() {
		add_action('admin_init', array($this, 'adminInit'));
		add_filter('plugins_update_check_locales', array($this, 'updateCheckLocales'));
	}

	/**
	* after admin init action
	*/
	public function adminInit() {
		if (current_user_can('manage_options')) {
			add_filter('plugin_row_meta', array($this, 'addPluginDetailsLinks'), 10, 2);
		}
	}

	/**
	* action hook for adding plugin details links
	*/
	public function addPluginDetailsLinks($links, $file) {
		// add settings link
		if ($file == FLXMAP_PLUGIN_NAME) {
			$links[] = sprintf('<a href="http://flexible-map.webaware.net.au/manual/getting-started/" target="_blank">%s</a>', _x('Instructions', 'plugin details links', 'wp-flexible-map'));
			$links[] = sprintf('<a href="https://wordpress.org/support/plugin/wp-flexible-map" target="_blank">%s</a>', _x('Get Help', 'plugin details links', 'wp-flexible-map'));
			$links[] = sprintf('<a href="https://wordpress.org/plugins/wp-flexible-map/" target="_blank">%s</a>', _x('Rating', 'plugin details links', 'wp-flexible-map'));
			$links[] = sprintf('<a href="https://translate.wordpress.org/projects/wp-plugins/wp-flexible-map" target="_blank">%s</a>', _x('Translate', 'plugin details links', 'wp-flexible-map'));
			$links[] = sprintf('<a href="http://shop.webaware.com.au/donations/?donation_for=Flexible+Map" target="_blank">%s</a>', _x('Donate', 'plugin details links', 'wp-flexible-map'));
		}

		return $links;
	}

	/**
	* inject wanted translation locales for plugins, so that we can get up-to-date translations from translate.wordpress.org
	* @param array $locales
	* @return array
	*/
	public function updateCheckLocales($locales) {
		if (!class_exists('FlxMapLocalisation', false)) {
			require FLXMAP_PLUGIN_ROOT . 'includes/class.FlxMapLocalisation.php';
		}
		$localisation = new FlxMapLocalisation();
		$langPacks = $localisation->getGlobalMapLocales();

		$combined = array_unique(array_merge($locales, $langPacks));

		return $combined;
	}

}
