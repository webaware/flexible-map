=== Flexible Map ===
Contributors: webaware
Plugin Name: Flexible Map
Plugin URI: https://flexible-map.webaware.net.au/
Author URI: https://shop.webaware.com.au/
Donate link: https://shop.webaware.com.au/donations/?donation_for=Flexible+Map
Tags: google, map, maps, google maps, shortcode, google maps shortcode, kml
Requires at least: 4.0
Tested up to: 4.7
Stable tag: 1.12.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Embed Google Maps shortcodes in pages and posts, either by centre coordinates or street address, or by URL to a Google Earth KML file.

== Description ==

Flexible Map allows you to add Google Maps to your WordPress website with simple shortcodes.

**Features:**

* three ways to load a map:
 * by centre coordinates
 * by street address
 * by URL to a Google Earth KML file
* simple shortcode for adding maps to pages/posts
* PHP function `flexmap_show_map()` for theme and plugin developers
* supports multiple maps on a page/post
* supports responsive design -- specify width / height in percent
* map marker doesn't have to be the centre of the map
* optional description for info window
* optional directions link for info window
* directions can be dropped into any div element with an ID
* minimal dependencies -- just WordPress and the Google Maps API

[Get started with Flexible Map](https://flexible-map.webaware.net.au/manual/getting-started/).
[Read the manual online](https://flexible-map.webaware.net.au/manual/).

= Sponsorships =

* directions on KML maps generously sponsored by [Roger Los](http://www.rogerlos.com/)

Thanks for sponsoring new features on WP Flexible Maps!

= Translations =

Many thanks to the generous efforts of our translators:

* Czech (cs) -- [caslavak](https://profiles.wordpress.org/caslavak/)
* Dutch (nl) -- [Ivan Beemster](http://www.lijndiensten.com/) and the [Dutch translation team](https://translate.wordpress.org/locale/nl/default/wp-plugins/wp-flexible-map)
* French (fr) -- [mister klucha](https://profiles.wordpress.org/mister-klucha/) and the [French translation team](https://translate.wordpress.org/locale/fr/default/wp-plugins/wp-flexible-map)
* German (de) -- [Carib Design](http://www.caribdesign.com/) and the [German translation team](https://translate.wordpress.org/locale/de/default/wp-plugins/wp-flexible-map)
* Greek (el) -- [Pantelis Orfanos](https://profiles.wordpress.org/ironwiller/)
* Hungarian (hu) -- Krisztián Vörös
* Italian (it_IT) -- the [Italian translation team](https://translate.wordpress.org/locale/it/default/wp-plugins/wp-flexible-map)
* Korean (ko_KR) -- the [Korean translation team](https://translate.wordpress.org/locale/ko/default/wp-plugins/wp-flexible-map)
* Swedish (sv_SE) -- the [Swedish translation team](https://translate.wordpress.org/locale/sv/default/wp-plugins/wp-flexible-map)
* Norwegian: Bokmål (nb_NO) -- [neonnero](http://www.neonnero.com/)
* Norwegian: Nynorsk (nn_NO) -- [neonnero](http://www.neonnero.com/)
* Portuguese (pt_BR) -- Alexsandro Santos and Paulo Henrique
* Spanish (es) -- [edurramos](https://profiles.wordpress.org/edurramos/)
* Welsh (cy) -- [Dylan](https://profiles.wordpress.org/dtom-ct-wp/)

The initial translations for all other languages were made using Google Translate, so it's likely that some will be truly awful! If you'd like to help out by translating this plugin, please [sign up for an account and dig in](https://translate.wordpress.org/projects/wp-plugins/wp-flexible-map).

== Installation ==

1. Upload this plugin to your /wp-content/plugins/ directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Get an [API Key from Google](https://developers.google.com/maps/documentation/javascript/) and add it to Settings > Flexible Map
4. Add the shortcode `[flexiblemap]` to your pages / posts to embed maps

There are two ways to load maps with this plugin:

* specify the map's coordinates or street address
* specify the URL to a KML file (e.g. from Google Earth)

To add a Flexible Map to a post or a page, add a shortcode `[flexiblemap]` and give it some useful attributes. A map can either be specified using centre coordinates or street address, or by loading a KML file.

= Attributes for centre coordinates or street address map =

Either the center or the address paramater is required. If you provide both, the centre coordinates will be used for the map centre, but directions will use the street address. (This will prevent directions from telling people how to get to the destination opposite yours!)

* **center**: coordinates of centre in latitude,longitude, e.g. *center="-34.916721,138.828878"*
* **address**: street address of map centre, e.g. *address="116 Beaumont Street Hamilton NSW Australia"*
* **marker**: coordinates of the marker if different from the centre, in latitude,longitude, e.g. *marker="-34.916721,138.828878"*
* **title**: title of the marker, displayed in a text bubble, e.g. *title="Adelaide Hills"*
* **link**: URL to link from the marker title, e.g. *link="http://example.com/"*
* **linktarget**: where marker link opens, e.g. *linktarget="_blank"*
* **linktext**: marker link text, overriding the default text
* **icon**: URL to icon for the marker, e.g. *icon="https://maps.google.com/mapfiles/kml/pal3/icon29.png"*
* **description**: a description of the marker location (can have HTML links), e.g. *description="Lorem ipsum dolor sit amet"*
* **html**: some simple HTML to add to the info window, e.g. *`<img src='https://example.com/logo.img' />`*
* **showinfo**: show the marker's info window when the map loads, from [true, false], e.g. *showinfo="false"*; default=true

*Samples*:
`[flexiblemap center="-34.916721,138.828878" width="100%" height="400px" zoom="9" title="Adelaide Hills" description="The Adelaide Hills are repleat with wineries."]
[flexiblemap address="116 Beaumont Street Hamilton NSW Australia" region="au" directions="true"]
[flexiblemap center="-32.891058,151.538042" title="Mount Sugarloaf" directions="true"]
[flexiblemap center="-32.918827,151.806164" title="Nobby's Head" directions="my-dir-div"]`

= Attributes for KML map =

* **src**: the URL for a KML file to load map details from, e.g. *src="http://example.com/map.kml"*
* **targetfix**: prevent links from opening in new window, from [true, false], e.g. *targetfix="true"*; default=true
* **kmlcache**: ask Google Maps to use a new map instead of cached map, specified in minutes (90 minutes), hours (2 hours), days (1 day), or "none"; minimum 5 minutes, default "none"

*Sample*:
`[flexiblemap src="http://webaware.com.au/maps/example-toronto.kml" width="100%" height="400px"]`

= Attributes for all maps =

* **width**: width in pixels or valid CSS units, e.g. *width="100%"*
* **height**: height in pixels or valid CSS units, e.g. *height="400px"*
* **id**: the CSS id of the container div (instead of a random generated unique ID), e.g. *id="my_map"*
* **zoom**: zoom level as an integer, larger is closer, e.g. *zoom="16"*
* **maptype**: type of map to show, from [roadmap, satellite, hybrid, terrain], e.g. *maptype="satellite"*; default=roadmap
* **maptypes**: types of maps in the map type controls, e.g. *maptypes="custom_type,satellite"*
* **hidemaptype**: hide the map type controls, from [true, false], e.g. *hidemaptype="true"*; default=false
* **hidepanning**: hide the panning controls, from [true, false], e.g. *hidepanning="true"*; default=true
* **hidezooming**: hide the zoom controls, from [true, false], e.g. *hidezooming="true"*; default=false
* **hidestreetview**: hide the street view control, from [true, false], e.g. *hidestreetview="true"*; default=true
* **hidescale**: hide the map scale, from [true, false], e.g. *hidescale="true"*; default=true
* **zoomstyle**: which zoom control style, from [small, large, default]; default=small
* **scrollwheel**: enable zoom with mouse scroll wheel, from [true, false], e.g. *scrollwheel="true"*; default=false
* **draggable**: enable dragging to pan, from [true, false], e.g. *draggable="true"*; default=true
* **dblclickzoom**: enable double-clicking to zoom, from [true, false], e.g. *dblclickzoom="true"*; default=true
* **directions**: show directions link in text bubble; by default, directions will be displayed underneath map, but you can specify the element ID for directions here, e.g. *directions="true", directions="my-dir-id"*; default=false
* **dirdraggable**: allow directions to be draggable, from [true, false]; default=false
* **dirnomarkers**: suppress start and end markers when showing directions, from [true, false]; default=false
* **dirshowsteps**: show or suppress directions steps when showing directions, from [true, false]; default=true
* **dirshowssearch**: show or suppress directions search form when showing directions, from [true, false]; default=true
* **showdirections**: show directions when the map loads, e.g. *showdirections="true"*; default=false
* **directionsfrom**: initial from: location for directions, e.g. *directionsfrom="Sydney"*
* **dirunitsystem**: force directions units to metric or imperial, from [metric, imperial, auto]; default=auto
* **dirtravelmode**: select directions mode, from [driving, bicycling, walking, transit]; default=driving
* **region**: specify region to help localise address searches for street address map and directions, taken from the list of [country codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) e.g. *region="AU"*
* **locale**: use a specific locale (language) for messages like the text of the Directions link, e.g. *locale="nl-BE"*

= Calling from templates or plugins =

There is a PHP function `flexmap_show_map()` for theme and plugin developers. All of the same attributes for the shortcode can be passed to the function in an associative array. If you want it to return the map as a string without output to screen, add "echo"=>"false" to array of attributes.

*Sample*:
`flexmap_show_map(array(
  'center' => '-34.916721,138.828878',
  'width' => '100%',
  'height' => 400,
  'zoom' => 12,
  'title' => 'Adelaide Hills',
  'description' => 'The Adelaide Hills are repleat with wineries.',
  'directions' => 'my-dir-div',
  'hidepanning' => 'false',
  'hidescale' => 'false',
  'maptype' => 'satellite',
));`

There are also some filter hooks that allow you to change the behaviour of the plugin.

* `flexmap_google_maps_api_args`: filter the array of arguments that will be passed to the Google Maps API, e.g. `'v'=>'3.exp'`, `'sensor'=>'false'`
* `flexmap_google_maps_api_url`: filter the Google Maps API URL, as a string
* `flexmap_shortcode_attrs`: filter the array of shortcode attributes, e.g. change the width and height
* `flexmap_shortcode_styles`: filter the array of inline styles applied to the div wrapping the map, e.g. remove width and height so that it can be specified in the theme's stylesheets
* `flexmap_shortcode_html`: filter the generated HTML, e.g. wrap another div around it, add a link to Google Maps, add some additonal script, etc.
* `flexmap_shortcode_script`: filter the generated JavaScript
* `flexmap_custom_map_types`: register custom Google Maps map types

For more information and examples, see [the reference website](https://flexible-map.webaware.net.au/).

== Frequently Asked Questions ==

= Do I need an API key? =

All websites using Google Maps for the first time need an API key. Websites that were using Google Maps before 2016-06-22 are permitted to keep using Google Maps without a key -- for now, at least. Read [this Google blog post](https://googlegeodevelopers.blogspot.com.au/2016/06/building-for-scale-updates-to-google.html) for more information.

= Where are the settings? =

You can set your [API key](https://developers.google.com/maps/documentation/javascript/) in the WordPress admin:

Settings > Flexible Map

For everything else, just add some attributes to your shortcode telling the map what to do.

Of course, in WordPress there is a plugin for everything :) so if you *want* more settings, please install the [Flexible Map Options plugin](https://wordpress.org/plugins/wp-flexible-map-options/). That plugin lets you set some defaults so that if you use the same attributes over and over, you can put them all in one place.

= Can I add multiple markers to a map? =

Using a KML file, you can have as many markers on a map as you like, with as much detail in the info windows. With KML you can also change marker icons and add other nice features. You can generate your KML file from an application like Google Earth, or you can create it yourself (in a text editor or with your own programming). [Learn more about KML](https://developers.google.com/kml/).

= Why won't my KML map update when I edit the KML file? =

Google Maps API caches the KML file, so it can take a while for your new changes to appear. To force a change, append a URL query parameter with a number (known as a cache buster) and increment the number each time you change the KML file. A nice simple and commonly used parameter name is v (for version), like this: http://example.com/my-map.kml?v=2

If your map is auto-generated or changes frequently, add the `kmlcache` attribute to ask Google to fetch a new copy periodically. You can specify the interval in minutes (e.g. "90 minutes"), hours (e.g. "2 hours"), or days (e.g. "1 day"). The minimum interval is 5 minutes.

`[flexiblemap src="http://webaware.com.au/maps/example-toronto.kml?v=2"]
[flexiblemap src="http://webaware.com.au/maps/example-toronto.kml" kmlcache="8 hours"]`

= What parts of KML are supported? =

The Google Maps API supports many commonly used KML elements, but has some restrictions. Read about [Google Maps support for KML](https://developers.google.com/kml/documentation/mapsSupport) in the developers' guide, and also see the list of [KML elements supported in Google Maps](https://developers.google.com/kml/documentation/kmlelementsinmaps).

= Why won't the map show my place when I use the address attribute? =

When you use a street address instead of centre coordinates, you are effectively searching Google Maps for your location. Try being very specific about your address, including your town / city, state / province, and country to make sure Google can find where you mean. You can also specify your region with the `region` attribute to help Google Maps refine its search. If the marker is still in the wrong place, you might need to specify the location using centre coordinates instead.

= How can I use centre coordinates for the map and have directions to my address? =

When you use just centre coordinates for your map, the directions may send people to the location *opposite* your location! Yes, I know... anyway, if you specify both the centre coordinates and the street address, the map will be centred correctly and the directions will be to your address.

= How do I get the maps to use my language? =

The plugin uses localised messages for things like the Directions link and the default message on links in info windows. If you have your [WordPress installation set to use your language](https://codex.wordpress.org/WordPress_in_Your_Language), the plugin should automatically pick it up. If you need to force it to pick up your language (or want to offer a different language), use the `locale` attribute, e.g. `locale="ru"` or `locale="zh-TW"`.

Google Maps will use the locale information from your web browser to help display maps and directions in your language (see your browser's language settings). If you want to force the Google Maps language for every map on a page, you can use a filter hook. For example, here's how to force the Google Maps language to match the language of the page / post its on (e.g. when using WPML translated content):

`add_filter('flexmap_google_maps_api_args', 'force_flexmap_map_language');

function force_flexmap_map_language($args) {
    $args['language'] = get_locale();
    return $args;
}`

= You've translated my language badly / it's missing =

The initial translations were made using Google Translate, so it's likely that some will be truly awful! If you'd like to help out by translating this plugin, please [sign up for an account and dig in](https://translate.wordpress.org/projects/wp-plugins/wp-flexible-map).

= The map is broken in tabs / accordions =

When you hide the map in a tab, and then click on the tab to reveal its contents, sometimes the map doesn't know how big to draw until it is revealed. Since v1.9.0 most such problems are automatically resolved for modern browsers, including Internet Explorer 11 or later. If you need to support earlier versions that don't support [MutationObserver](http://caniuse.com/#feat=mutationobserver), add some script to your website to handle this yourself.

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

For jQuery UI tabs versions 1.8 or older:

`<script>
jQuery("body").bind("tabsshow", function(event, ui) {
    jQuery("#" + ui.panel.id + " div.flxmap-container").each(function() {
        var flxmap = window[this.getAttribute("data-flxmap")];
        flxmap.redrawOnce();
    });
});
</script>`

For tabs in jQuery Tools, see [this support topic](https://wordpress.org/support/topic/tabs-map#post-3784706).

= How can I get access to the map object? =

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

= Why won't the map load on my AJAX single-page website? =

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

NB: currently, only AJAX methods that parse script tags will work correctly; this includes some [jQuery methods](http://stackoverflow.com/q/2203762/911083) (but [not all](http://stackoverflow.com/a/2699905/911083)). A future version of the plugin will be more AJAX friendly.

= I have CloudFlare Rocketscript turned on and the map doesn't work =

Either turn off CloudFlare Rocketscript :) or install the [Flxmap No Rocketscript](https://gist.github.com/webaware/8949605) plugin by loading that file into your website's wp-content/plugins folder and activating through the plugins admin page. Use the plugin if you still want Rocketscript to manage all of your other scripts but leave the Flexible Map scripts alone.

== Screenshots ==

1. `[flexiblemap center="-32.918657,151.797894" title="Nobby's Head" zoom="14" width="100%" height="400px" directions="true" maptype="satellite"]`
2. `[flexiblemap address="116 Beaumont Street Hamilton NSW Australia" title="Raj's Corner" description="SWMBO's favourite Indian diner" width="100%" height="400px" directions="true"]`
3. `[flexiblemap src="http://webaware.com.au/maps/example-toronto.kml" width="100%" height="400px" maptype="satellite"]`
4. `[flexiblemap center="-34.916721,138.828878" width="100%" height="400px" title="Adelaide Hills" directions="true" showdirections="true" directionsfrom="Adelaide" region="au"]`
5. Setting screen with API key field

== Upgrade Notice ==

= 1.12.1 =

bump version of Google Maps API to 3.26

== Changelog ==

The full changelog can be found [on GitHub](https://github.com/webaware/flexible-map/blob/master/changelog.md). Recent entries:

### 1.12.1, 2016-11-18

* changed: bump version of Google Maps API to 3.26

### 1.12.0, 2016-06-27

* added: support for [Google Maps API key](https://developers.google.com/maps/documentation/javascript/), required [since 2016-06-22 for new websites](https://googlegeodevelopers.blogspot.com.au/2016/06/building-for-scale-updates-to-google.html).
