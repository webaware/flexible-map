<?php

if (!defined('ABSPATH')) {
	exit;
}

/**
* declare l10n strings used in JavaScript so a gettext scanner can find them
* NB: never called!
*/
function justDeclare() {
	$strings = array(
		__('Click for details', 'wp-flexible-map'),
		__('Directions', 'wp-flexible-map'),
		__('From', 'wp-flexible-map'),
		__('Get directions', 'wp-flexible-map'),
	);
}

