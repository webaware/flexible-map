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
		add_action('admin_menu', array($this, 'adminMenu'));
		add_filter('plugin_row_meta', array($this, 'addPluginDetailsLinks'), 10, 2);
		add_filter('plugins_update_check_locales', array($this, 'updateCheckLocales'));
	}

	/**
	* after admin init action
	*/
	public function adminInit() {
		if (current_user_can('manage_options')) {
			add_action('plugin_action_links_' . FLXMAP_PLUGIN_NAME, array($this, 'addPluginActionLinks'));
		}

		add_settings_section(FLXMAP_PLUGIN_OPTIONS, false, false, FLXMAP_PLUGIN_OPTIONS);
		register_setting(FLXMAP_PLUGIN_OPTIONS, FLXMAP_PLUGIN_OPTIONS, array($this, 'settingsValidate'));
	}

	/**
	* admin menu items
	*/
	public function adminMenu() {
		$label = __('Flexible Map', 'wp-flexible-map');
		add_options_page($label, $label, 'manage_options', 'flexible-map', array($this, 'settingsPage'));
	}

	/**
	* settings admin
	*/
	public function settingsPage() {
		$options = get_option(FLXMAP_PLUGIN_OPTIONS, array());

		$options = wp_parse_args($options, array(
			'apiKey'		=> '',
			'apiServerKey'	=> '',
			'noAPI'			=> 0,
		));

		require FLXMAP_PLUGIN_ROOT . 'views/settings-form.php';
	}

	/**
	* validate settings on save
	* @param array $input
	* @return array
	*/
	public function settingsValidate($input) {
		$output = array();

		$output['apiKey']		= trim(strip_tags($input['apiKey']));
		$output['apiServerKey']	= trim(strip_tags($input['apiServerKey']));
		$output['noAPI']		= !empty($input['noAPI']);

		return $output;
	}

	/**
	* add plugin details links
	*/
	public function addPluginDetailsLinks($links, $file) {
		// add settings link
		if ($file == FLXMAP_PLUGIN_NAME) {
			$links[] = sprintf('<a href="https://flexible-map.webaware.net.au/manual/getting-started/" rel="noopener" target="_blank">%s</a>', _x('Instructions', 'plugin details links', 'wp-flexible-map'));
			$links[] = sprintf('<a href="https://wordpress.org/support/plugin/wp-flexible-map" rel="noopener" target="_blank">%s</a>', _x('Get Help', 'plugin details links', 'wp-flexible-map'));
			$links[] = sprintf('<a href="https://wordpress.org/plugins/wp-flexible-map/" rel="noopener" target="_blank">%s</a>', _x('Rating', 'plugin details links', 'wp-flexible-map'));
			$links[] = sprintf('<a href="https://translate.wordpress.org/projects/wp-plugins/wp-flexible-map" rel="noopener" target="_blank">%s</a>', _x('Translate', 'plugin details links', 'wp-flexible-map'));
			$links[] = sprintf('<a href="https://shop.webaware.com.au/donations/?donation_for=Flexible+Map" rel="noopener" target="_blank">%s</a>', _x('Donate', 'plugin details links', 'wp-flexible-map'));
		}

		return $links;
	}

	/**
	* add plugin action links
	*/
	public function addPluginActionLinks($links) {
		// add settings link
		$url = admin_url('options-general.php?page=flexible-map');
		$settings_link = sprintf('<a href="%s">%s</a>', esc_url($url), _x('Settings', 'plugin details links', 'wp-flexible-map'));
		array_unshift($links, $settings_link);

		return $links;
	}

	/**
	* inject wanted translation locales for plugins, so that we can get up-to-date translations from translate.wordpress.org
	* @param array $locales
	* @return array
	*/
	public function updateCheckLocales($locales) {
		require_once FLXMAP_PLUGIN_ROOT . 'includes/class.FlxMapLocalisation.php';
		$langPacks = FlxMapLocalisation::getGlobalMapLocales();

		$combined = array_unique(array_merge($locales, $langPacks));

		return $combined;
	}

	/**
	* replace link placeholders with an external link
	* @param string $template
	* @param string $url
	* @return string
	*/
	protected function addExternalLink($template, $url) {
		$search = array(
			'{{a}}',
			'{{/a}}',
		);
		$replace = array(
			sprintf('<a rel="noopener" target="_blank" href="%s">', esc_url($url)),
			'</a>',
		);
		return str_replace($search, $replace, $template);
	}

}
