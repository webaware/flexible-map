<?php
// settings form

if (!defined('ABSPATH')) {
	exit;
}
?>

<div class="wrap">
	<h1><?php esc_html_e('Flexible Map', 'wp-flexible-map'); ?></h1>

	<form action="<?php echo admin_url('options.php'); ?>" method="POST">
		<?php settings_fields(FLXMAP_PLUGIN_OPTIONS); ?>

		<table class="form-table">

			<tr valign="top">
				<th scope="row"><?php echo esc_html_x('JavaScript API key', 'settings', 'wp-flexible-map'); ?></th>
				<td>
					<input type="text" class="regular-text" name="flexible_map[apiKey]" value="<?php echo esc_attr($options['apiKey']); ?>" autocorrect="off" autocapitalize="off" spellcheck="false" />
					<p><?php
						/* translators: {{a}} and {{/a}} will be replaced by HTML tags for a website link */
						echo $this->addExternalLink(esc_html_x('Get your API key from the {{a}}Google Maps API website{{/a}}.', 'settings', 'wp-flexible-map'), 'https://cloud.google.com/maps-platform/#get-started');
					?></p>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row"><?php echo esc_html_x('Server API key', 'settings', 'wp-flexible-map'); ?></th>
				<td>
					<input type="text" class="regular-text" name="flexible_map[apiServerKey]" value="<?php echo esc_attr($options['apiServerKey']); ?>" autocorrect="off" autocapitalize="off" spellcheck="false" />
					<p><?php echo esc_html_x('This key helps reduce the number of queries your server makes for maps with an address.', 'settings', 'wp-flexible-map'); ?></p>
					<p><?php echo esc_html_x('It can be the same as the JavaScript key, but it must not be restricted by HTTP referrer. If you have restricted your JavaScript key by referrer, please create another key for the server.', 'settings', 'wp-flexible-map'); ?></p>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row"><?php echo esc_html_x("Don't Load API", 'settings', 'wp-flexible-map'); ?></th>
				<td>
					<input type="checkbox" name="flexible_map[noAPI]" id="flexible_map_noAPI"<?php checked(!empty($options['noAPI'])); ?> />
					<label for="flexible_map_noAPI"><?php echo esc_html_x("don't load the Google Maps API script", 'settings', 'wp-flexible-map'); ?></label>
					<p><?php echo esc_html_x('Tick this when your theme or another plugin is already loading the Google Maps API, causing a conflict.', 'settings', 'wp-flexible-map'); ?></p>
				</td>
			</tr>

		</table>

		<?php submit_button(); ?>
	</form>
</div>
