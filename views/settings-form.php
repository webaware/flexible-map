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
					<input type="text" class="large-text" name="flexible_map[apiKey]" value="<?php echo esc_attr($options['apiKey']); ?>" />
				</td>
			</tr>

		</table>

		<?php submit_button(); ?>
	</form>
</div>
