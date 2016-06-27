<?php
// settings form

if (!defined('ABSPATH')) {
	exit;
}
?>

<div class="wrap">
	<h2><?php esc_html_e('Flexible Map', 'wp-flexible-map'); ?></h2>

	<form action="<?php echo admin_url('options.php'); ?>" method="POST">
		<?php settings_fields(FLXMAP_PLUGIN_OPTIONS); ?>

		<table class="form-table">

			<tr valign="top">
				<th scope="row"><?php echo esc_html_x('API key', 'settings', 'wp-flexible-map'); ?></th>
				<td>
					<input type="text" class="regular-text" name="flexible_map[apiKey]" value="<?php echo esc_attr($options['apiKey']); ?>" />
					<br />
					<em><?php printf(wp_kses_data(_x('Get your API key from the <a target="_blank" href="%s">Google Maps API website</a>.', 'settings', 'wp-flexible-map')), 'https://developers.google.com/maps/documentation/javascript/'); ?></em>
				</td>
			</tr>

		</table>

		<?php submit_button(); ?>
	</form>
</div>
