<?php

/**
* class for admin screens
*/
class FlxMapAdmin {

	protected $plugin;

	/**
	* @param FlxMapPlugin $plugin
	*/
	public function __construct($plugin) {
		$this->plugin = $plugin;

		// add action hook for adding plugin meta links
		add_filter('plugin_row_meta', array($this, 'addPluginDetailsLinks'), 10, 2);
	}

	/**
	* action hook for adding plugin details links
	*/
	public function addPluginDetailsLinks($links, $file) {
		// add settings link
		if ($file == FLXMAP_PLUGIN_NAME) {
			$links[] = '<a href="http://wordpress.org/support/plugin/wp-flexible-map">' . __('Get help') . '</a>';
			$links[] = '<a href="http://wordpress.org/plugins/wp-flexible-map/">' . __('Rating') . '</a>';
			$links[] = '<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=6ZCY9PST8E4GQ">' . __('Donate') . '</a>';
		}

		return $links;
	}

}
