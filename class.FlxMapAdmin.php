<?php

/**
* class for admin screens
*/
class FlxMapAdmin {

	const MENU_PAGE = 'flexible-map';					// slug for menu page(s)

	private $plugin;

	/**
	* @param FlxMapPlugin $plugin
	*/
	public function __construct($plugin) {
		$this->plugin = $plugin;

		// add admin menu items
		add_action('admin_menu', array($this, 'addAdminMenu'));

		// add action hook for adding plugin meta links
		add_filter('plugin_row_meta', array($this, 'addPluginDetailsLinks'), 10, 2);
	}

	/**
	* action hook for building admin menu
	*/
	public function addAdminMenu() {
		// register the instructions page, only linked from plugin page
		global $_registered_pages;

		$hookname = get_plugin_page_hookname(self::MENU_PAGE . '-instructions', '');
		if (!empty($hookname)) {
			add_action($hookname, array($this, 'instructions'));
			$_registered_pages[$hookname] = true;
		}
	}

	/**
	* action hook for adding plugin details links
	*/
	public function addPluginDetailsLinks($links, $file) {
		// add settings link
		if ($file == FLXMAP_PLUGIN_NAME)
			$links[] = '<a href="admin.php?page=' . self::MENU_PAGE . '-instructions">' . __('Instructions') . '</a>';

		return $links;
	}

	/**
	* show instructions page
	*/
	public function instructions() {
		echo "<div class='wrap'>\n";
		screen_icon('plugins');
		echo "<h2>Flexible Map Instructions</h2>\n";

		echo file_get_contents(FLXMAP_PLUGIN_ROOT . 'instructions.html');
		echo "</div>\n";
	}
}
