# Flexible Map
Contributors: webaware
Plugin Name: Flexible Map
Plugin URI: https://flexible-map.webaware.net.au/
Author URI: https://shop.webaware.com.au/
Donate link: https://shop.webaware.com.au/donations/?donation_for=Flexible+Map
Tags: google, map, maps, google maps, kml
Requires at least: 4.0
Tested up to: 5.2
Stable tag: 1.17.1
Requires PHP: 5.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Embed Google Maps shortcodes in pages and posts, either by center coordinates or street address, or by URL to a Google Earth KML file.

## Description

Flexible Map allows you to add Google Maps to your WordPress website with simple shortcodes.

### Features

* three ways to load a map:
 * by center coordinates
 * by street address
 * by URL to a Google Earth KML file
* simple shortcode for adding maps to pages/posts
* PHP function `flexmap_show_map()` for theme and plugin developers
* supports multiple maps on a page/post
* supports responsive design -- specify width / height in percent
* map marker doesn't have to be the center of the map
* optional description for info window
* optional directions link for info window
* directions can be dropped into any div element with an ID
* minimal dependencies -- just WordPress and the Google Maps API

[Get started with Flexible Map](https://flexible-map.webaware.net.au/manual/getting-started/).
[Read the manual online](https://flexible-map.webaware.net.au/manual/).

### Sponsorships

* directions on KML maps generously sponsored by [Roger Los](http://www.rogerlos.com/)

Thanks for sponsoring new features on WP Flexible Maps!

### Translations

Many thanks to the generous efforts of our translators:

* Czech (cs) -- [caslavak](https://profiles.wordpress.org/caslavak/) and the [Czech translation team](https://translate.wordpress.org/locale/cs/default/wp-plugins/wp-flexible-map)
* Dutch (nl) -- [Ivan Beemster](https://lijndiensten.com/) and the [Dutch translation team](https://translate.wordpress.org/locale/nl/default/wp-plugins/wp-flexible-map)
* English (en_CA) -- [the English (Canadian) translation team](https://translate.wordpress.org/locale/en-ca/default/wp-plugins/wp-flexible-map)
* French (fr) -- [mister klucha](https://profiles.wordpress.org/mister-klucha/) and the [French translation team](https://translate.wordpress.org/locale/fr/default/wp-plugins/wp-flexible-map)
* German (de) -- [Carib Design](https://www.caribdesign.com/) and the [German translation team](https://translate.wordpress.org/locale/de/default/wp-plugins/wp-flexible-map)
* Greek (el) -- [Pantelis Orfanos](https://profiles.wordpress.org/ironwiller/)
* Hungarian (hu) -- Krisztián Vörös
* Italian (it_IT) -- the [Italian translation team](https://translate.wordpress.org/locale/it/default/wp-plugins/wp-flexible-map)
* Korean (ko_KR) -- the [Korean translation team](https://translate.wordpress.org/locale/ko/default/wp-plugins/wp-flexible-map)
* Swedish (sv_SE) -- the [Swedish translation team](https://translate.wordpress.org/locale/sv/default/wp-plugins/wp-flexible-map)
* Norwegian: Bokmål (nb_NO) -- [neonnero](https://www.neonnero.com/)
* Norwegian: Nynorsk (nn_NO) -- [neonnero](https://www.neonnero.com/)
* Portuguese (pt_BR) -- Alexsandro Santos and Paulo Henrique
* Spanish (es) -- [edurramos](https://profiles.wordpress.org/edurramos/)
* Welsh (cy) -- [Dylan](https://profiles.wordpress.org/dtom-ct-wp/)

The initial translations for all other languages were made using Google Translate, so it's likely that some will be truly awful! If you'd like to help out by translating this plugin, please [sign up for an account and dig in](https://translate.wordpress.org/projects/wp-plugins/wp-flexible-map).

### Privacy

Flexible Map embeds Google Maps into your web pages. Please review Google's [Privacy and Personal Information](https://cloud.google.com/maps-platform/terms/maps-controller-terms/) for information about how that affects your website's Privacy Policy. By using this plugin, you are agreeing to the terms of use for Google Maps.

The Flexible Map plugin itself does not collect any personally identifying information, and does not set any cookies itself.

## Installation

1. Upload this plugin to your /wp-content/plugins/ directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Get an [API Key from Google](https://cloud.google.com/maps-platform/#get-started) and add it to Settings > Flexible Map
4. Add the shortcode `[flexiblemap]` to your pages / posts to embed maps

There are two ways to load maps with this plugin:

* specify the map's coordinates or street address
* specify the URL to a KML file (e.g. from Google Earth)

To add a Flexible Map to a post or a page, add a shortcode `[flexiblemap]` and give it some useful attributes. A map can either be specified using center coordinates or street address, or by loading a KML file.

[Get started with Flexible Map](https://flexible-map.webaware.net.au/manual/getting-started/).
[Read the manual online](https://flexible-map.webaware.net.au/manual/).
[Refer to the attribute reference](https://flexible-map.webaware.net.au/manual/attribute-reference/) for detailed information.

## Frequently Asked Questions

### Do I need an API key?

Yes. You will need at minimum an API key for Maps, so that the Maps JavaScript API will work. If you want to add maps by address (not just coordinates or KML file), you will also need to select Places. If you want to use directions features of this plugin, you will also need to select Routes.

[Get your API keys from the Google Maps Platform](https://cloud.google.com/maps-platform/#get-started)
[Read more about API keys for Google Maps](https://flexible-map.webaware.net.au/manual/api-keys/)

### Where are the settings?

You can set your [API keys](https://cloud.google.com/maps-platform/#get-started) in the WordPress admin:

Settings > Flexible Map

For everything else, just add some attributes to your shortcode telling the map what to do.

Of course, in WordPress there is a plugin for everything :) so if you *want* more settings, please install the [Flexible Map Options plugin](https://wordpress.org/plugins/wp-flexible-map-options/). That plugin lets you set some defaults so that if you use the same attributes over and over, you can put them all in one place.

### Can I add multiple markers to a map?

Using a KML file, you can have as many markers on a map as you like, with as much detail in the info windows. With KML you can also change marker icons and add other nice features. You can generate your KML file from an application like Google Earth, or you can create it yourself (in a text editor or with your own programming). [Learn more about KML](https://developers.google.com/kml/).

### Why won't my KML map update when I edit the KML file?

Google Maps API caches the KML file, so it can take a while for your new changes to appear. To force a change, append a URL query parameter with a number (known as a cache buster) and increment the number each time you change the KML file. A nice simple and commonly used parameter name is v (for version), like this: http://example.com/my-map.kml?v=2

If your map is auto-generated or changes frequently, add the `kmlcache` attribute to ask Google to fetch a new copy periodically. You can specify the interval in minutes (e.g. "90 minutes"), hours (e.g. "2 hours"), or days (e.g. "1 day"). The minimum interval is 5 minutes.

`[flexiblemap src="https://webaware.com.au/maps/example-toronto.kml?v=2"]
[flexiblemap src="https://webaware.com.au/maps/example-toronto.kml" kmlcache="8 hours"]`

### What parts of KML are supported?

The Google Maps API supports many commonly used KML elements, but has some restrictions. Read about [Google Maps support for KML](https://developers.google.com/maps/documentation/javascript/kmllayer) in the developers' guide, and also see the list of supported KML elements on that page.

### Why won't the map show my place when I use the address attribute?

When you use a street address instead of center coordinates, you are effectively searching Google Maps for your location. Try being very specific about your address, including your town / city, state / province, and country to make sure Google can find where you mean. You can also specify your region with the `region` attribute to help Google Maps refine its search. If the marker is still in the wrong place, you might need to specify the location using center coordinates instead.

### How can I use center coordinates for the map and have directions to my address?

When you use just center coordinates for your map, the directions may send people to the location *opposite* your location! Yes, I know... anyway, if you specify both the center coordinates and the street address, the map will be centered correctly and the directions will be to your address.

### How do I get the maps to use my language?

The plugin uses localized messages for things like the Directions link and the default message on links in info windows. If you have your [WordPress installation set to use your language](https://codex.wordpress.org/Installing_WordPress_in_Your_Language), the plugin should automatically pick it up. If you need to force it to pick up your language (or want to offer a different language), use the `locale` attribute, e.g. `locale="ru"` or `locale="zh-TW"`.

Google Maps will use the locale information from your web browser to help display maps and directions in your language (see your browser's language settings). If you want to force the Google Maps language for every map on a page, you can use a filter hook. For example, here's how to force the Google Maps language to match the language of the page / post its on (e.g. when using WPML translated content):

`add_filter('flexmap_google_maps_api_args', 'force_flexmap_map_language');

function force_flexmap_map_language($args) {
    $args['language'] = get_locale();
    return $args;
}`

### You've translated my language badly / it's missing

The initial translations were made using Google Translate, so it's likely that some will be truly awful! If you'd like to help out by translating this plugin, please [sign up for an account and dig in](https://translate.wordpress.org/projects/wp-plugins/wp-flexible-map).

### The map is broken in tabs / accordions

When you hide the map in a tab, and then click on the tab to reveal its contents, sometimes the map doesn't know how big to draw until it is revealed. Since v1.9.0 most such problems are automatically resolved for modern browsers, including Internet Explorer 11 or later. If you need to support earlier versions that don't support [MutationObserver](https://caniuse.com/#feat=mutationobserver), add some script to your website to handle this yourself.

For jQuery UI tabs and accordions, download the .php file from [this gist](https://gist.github.com/webaware/05b27e3a99ccb00200f5), and install / activate it. If you'd prefer to add the jQuery code yourself, add this somewhere on the page (e.g. in your theme's footer):

`<script>
(function($) {

    function mapRedraw(event, ui) {
        if (ui.newPanel.length) {
            $("#" + ui.newPanel[0].id + " div.flxmap-container").each(function() {
                var flxmap = window[this.getAttribute("data-flxmap")];
                flxmap.redrawOnce();
            });
        }
    }

    $("body").on("accordionactivate", mapRedraw).on("tabsactivate", mapRedraw);

})(jQuery);
</script>`

### How can I get access to the map object?

If you want to add your own scripting for the map, you can get the map object by identifying the FlexibleMap global variable for your map, and asking it to getMap(). By default, each FlexibleMap is given a randomly generated ID and the global variable name is derived from that. The map's containing div has a data property with this global variable name. Here's some sample jQuery code that gets the map object for the (first) map:

`jQuery(window).load(function() {
    var flxmapName = jQuery("div.flxmap-container").attr("data-flxmap");
    var flxmap = window[flxmapName];
    var map = flxmap.getMap();
    // ... use map ...
});`

Alternatively, you can specify the ID used for a given map, and it will then derive the global variable name from that. Here's a sample shortcode:

`[flexiblemap center="-32.891058,151.538042" id="sugarloaf"]`

And here's some sample jQuery code:

`jQuery(window).load(function() {
    var map = flxmap_sugarloaf.getMap();
    // ... use map ...
});`

### Why won't the map load on my AJAX single-page website?

The plugin only loads the required JavaScript scripts when it knows that they are needed. When your website uses AJAX to load a page, the normal WordPress footer action for that page doesn't happen, and the scripts aren't loaded. You can make the scripts load on every page by adding this snippet to the functions.php file in your theme:

`function my_preload_map_scripts() {
    if (function_exists('flexmap_load_scripts')) {
        flexmap_load_scripts();
    }
}
add_action('wp_enqueue_scripts', 'my_preload_map_scripts', 20);`

To make it load locale scripts as well, e.g. for French and Chinese language text, add them to the function call like this:

`flexmap_load_scripts(array('fr', 'zh'));`

The plugin will detect when AJAX is being used via the [WordPress standard method](https://codex.wordpress.org/AJAX_in_Plugins), and adjust accordingly (but you still need to load the scripts as above). If another method is used, add `isajax='true'` to the shortcode attributes.

NB: currently, only AJAX methods that parse script tags will work correctly; this includes some [jQuery methods](https://stackoverflow.com/q/2203762/911083) (but [not all](https://stackoverflow.com/a/2699905/911083)). A future version of the plugin will be more AJAX friendly.

### I have CloudFlare Rocketscript turned on and the map doesn't work

Either turn off CloudFlare Rocketscript :) or install the [Flxmap No Rocketscript](https://gist.github.com/webaware/8949605) plugin by loading that file into your website's wp-content/plugins folder and activating through the plugins admin page. Use the plugin if you still want Rocketscript to manage all of your other scripts but leave the Flexible Map scripts alone.

## Screenshots

1. `[flexiblemap center="-32.918657,151.797894" title="Nobby's Head" zoom="14" width="100%" height="400px" directions="true" maptype="satellite"]`
2. `[flexiblemap address="116 Beaumont Street Hamilton NSW Australia" title="Raj's Corner" description="SWMBO's favourite Indian diner" width="100%" height="400px" directions="true"]`
3. `[flexiblemap src="https://webaware.com.au/maps/example-toronto.kml" width="100%" height="400px" maptype="satellite"]`
4. `[flexiblemap center="-34.916721,138.828878" width="100%" height="400px" title="Adelaide Hills" directions="true" showdirections="true" directionsfrom="Adelaide" region="au"]`
5. Setting screen with API key field

## Upgrade Notice

### 1.17.1

KML map with center but no zoom no longer breaks the map; recognizes center coodinates with whitespace before and after the separating comma

## Changelog

The full changelog can be found [on GitHub](https://github.com/webaware/flexible-map/blob/master/changelog.md). Recent entries:

### 1.17.1

Released 2019-05-04

* fixed: KML map with center but no zoom breaks the map
* fixed: recognize center coodinates with whitespace before and after the separating comma
