<?php

if (!defined('ABSPATH')) {
	exit;
}

/**
* class for managing the plugin
*/
class FlxMapLocalisation {

	const TEXT_DOMAIN				= 'wp-flexible-map';
	const TRANSIENT_LANGPACKS		= 'flexible_map_langpacks';

	/**
	* get localisations for map scripts, ignoring admin localisations
	* @param array $locales
	* @return array
	*/
	public function getLocalisations($locales) {
		$i18n = array();

		$langPacks = array();	// record list of locales for language pack update fetches

		foreach (array_keys($locales) as $locale) {
			$moLocale = self::getMoLocale($locale);
			$mofile   = self::getMofilePath($moLocale);

			$langPacks[] = $moLocale;

			// check for specific locale first, e.g. 'zh-CN', then for generic locale, e.g. 'zh'
			// (backwards compatibility)
			if (!$mofile && strlen($locale) > 2) {
				$locale   = substr($locale, 0, 2);
				$moLocale = self::getMoLocale($locale);
				$mofile   = self::getMofilePath($moLocale);
			}

			if ($mofile) {
				$mo = new MO();
				if ($mo->import_from_file($mofile)) {
					$strings = self::getMoStrings($mofile);
					if (!empty($strings)) {
						$i18n[$locale] = $strings;
					}
				}
			}
		}

		if (!empty($langPacks)) {
			$this->updateGlobalMapLocales($langPacks);
		}

		return $i18n;
	}

	/**
	* translate locale code to .mo file code, for backwards compatibility with earlier versions of plugin
	* @param string $locale
	* @return string
	*/
	protected static function getMoLocale($locale) {
		// map old two-character language-only locales that now need to target language_country translations
		static $upgradeMap = array(
			'bg' => 'bg_BG',	'cs' => 'cs_CZ',	'da' => 'da_DK',	'de' => 'de_DE',
			'es' => 'es_ES',	'fa' => 'fa_IR',	'fr' => 'fr_FR',	'gl' => 'gl_ES',
			'he' => 'he_IL',	'hi' => 'hi_IN',	'hu' => 'hu_HU',	'id' => 'id_ID',
			'is' => 'is_IS',	'it' => 'it_IT',	'ko' => 'ko_KR',	'lt' => 'lt_LT',
			'mk' => 'mk_MK',	'ms' => 'ms_MY',	'mt' => 'mt_MT',	'nb' => 'nb_NO',
			'nl' => 'nl_NL',	'pl' => 'pl_PL',	'pt' => 'pt_PT',	'ro' => 'ro_RO',
			'ru' => 'ru_RU',	'sk' => 'sk_SK',	'sl' => 'sl_SL',	'sr' => 'sr_RS',
			'sv' => 'sv_SE',	'ta' => 'ta_IN',	'tr' => 'tr_TR',	'zh' => 'zh_CN',
		);

		if (isset($upgradeMap[$locale])) {
			// upgrade old two-character language-only locales
			return $upgradeMap[$locale];
		}

		// revert locale name to WordPress locale name as used in .mo files
		return strtr($locale, '-', '_');
	}

	/**
	* get full path to .mo file
	* @param string $moLocale
	* @return string|bool returns false if it doesn't exist
	*/
	protected static function getMofilePath($moLocale) {
		// try translation packs downloaded from translate.wordpress.org first
		$path = sprintf('%s/plugins/%s-%s.mo', WP_LANG_DIR, self::TEXT_DOMAIN, $moLocale);
		if (is_readable($path)) {
			return $path;
		}

		// try local packs delivered with the plugin
		$path = sprintf('%slanguages/%s-%s.mo', FLXMAP_PLUGIN_ROOT, self::TEXT_DOMAIN, $moLocale);
		if (is_readable($path)) {
			return $path;
		}

		return false;
	}

	/**
	* get strings from .mo file
	* @param string $mofile
	* @return array
	*/
	protected static function getMoStrings($mofile) {
		$strings = array();

		$mo = new MO();
		if ($mo->import_from_file($mofile)) {
			// pull all translation strings into a simplified format for our script
			// TODO: handle plurals (not yet needed, don't have any)
			foreach ($mo->entries as $original => $translation) {
				// skip admin-side strings, identified by context
				if ($translation->context === 'plugin details links') {
					continue;
				}

				$strings[$original] = $translation->translations[0];
			}
		}

		return $strings;
	}

	/**
	* get locales used by maps across site (or multisite network)
	* for global language updates from translate.wordpress.org
	* @return array
	*/
	public function getGlobalMapLocales() {
		$langPacks = get_site_transient(self::TRANSIENT_LANGPACKS);

		if (!is_array($langPacks)) {
			$langPacks = array();
		}

		return $langPacks;
	}

	/**
	* add locales to history of locales used by maps across site (or multisite network)
	* for global language updates from translate.wordpress.org
	* @param array $locales
	*/
	protected function updateGlobalMapLocales($locales) {
		$langPacks = $this->getGlobalMapLocales();
		$diff = array_diff($locales, $langPacks);

		if (!empty($diff)) {
			$langPacks = array_merge($langPacks, $diff);
			set_site_transient(self::TRANSIENT_LANGPACKS, $langPacks, WEEK_IN_SECONDS);
		}
	}

}
