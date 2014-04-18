=== WP Flexible Map ===
Contributors: webaware
Plugin Name: WP Flexible Map
Plugin URI: http://flexible-map.webaware.net.au/
Author URI: http://www.webaware.com.au/
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=6ZCY9PST8E4GQ
Tags: google, map, maps, google maps, shortcode, google maps shortcode, kml
Requires at least: 3.2.1
Tested up to: 3.9
Stable tag: 1.7.3.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Embed Google Maps in pages and posts, either by centre coordinates or street address, or by URL to a Google Earth KML file.

== Description ==

Flexible Map allows you to add Google Maps to your WordPress website.

**Features:**

* three ways to load a map:
 * by centre coordinates
 * by street address
 * by URL to a Google Earth KML file
* no special Google Maps key is required -- uses the latest stable Google Maps API
* simple shortcode for adding maps to pages/posts
* PHP function `flexmap_show_map()` for theme and plugin developers
* supports multiple maps on a page/post
* supports responsive design -- specify width / height in percent
* map marker doesn't have to be the centre of the map
* optional description for info window
* optional directions link for info window
* directions can be dropped into any div element with an ID
* minimal dependencies -- just WordPress and the Google Maps API

Click to see [WP Flexible Map in action](http://flexible-map.webaware.net.au/).

= Sponsorships =

* directions on KML maps generously sponsored by [Roger Los](http://www.rogerlos.com/)

Thanks for sponsoring new features on WP Flexible Maps!

= Translations =

Many thanks to the generous efforts of these people for human translations:

* Dutch (nl) -- [Ivan Beemster](http://www.lijndiensten.com/)
* French (fr) -- [mister klucha](http://profiles.wordpress.org/mister-klucha/)
* German (de) -- [Carib Design](http://www.caribdesign.com/)
* Greek (el) -- [Pantelis Orfanos](http://profiles.wordpress.org/ironwiller/)
* Spanish (es) -- [edurramos](http://profiles.wordpress.org/edurramos/)

The initial translations for all other languages were made using Google Translate, so it's likely that some will be truly awful! Please help by editing the .js file for your language in the i18n folder, and tell me about it in the [support forum](http://wordpress.org/support/plugin/wp-flexible-map).

== Installation ==

1. Upload this plugin to your /wp-content/plugins/ directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Add the shortcode [flexiblemap] to your pages / posts to embed maps

There are two ways to load maps with this plugin:

* specify the map's coordinates or street address
* specify the URL to a KML file (e.g. from Google Earth)

To add a Flexible Map to a post or a page, add a shortcode [flexiblemap] and give it some useful attributes. A map can either be specified using centre coordinates or street address, or by loading a KML file.

= Attributes for centre coordinates or street address map =

Either the center or the address paramater is required. If you provide both, the centre coordinates will be used for the map centre, but directions will use the street address. (This will prevent directions from telling people how to get to the destination opposite yours!)

* **center**: coordinates of centre in latitude,longitude, e.g. *center="-34.916721,138.828878"*
* **address**: street address of map centre, e.g. *address="116 Beaumont Street Hamilton NSW Australia"*
* **marker**: coordinates of the marker if different from the centre, in latitude,longitude, e.g. *marker="-34.916721,138.828878"*
* **title**: title of the marker, displayed in a text bubble, e.g. *title="Adelaide Hills"*
* **link**: URL to link from the marker title, e.g. *link="http://example.com/"*
* **icon**: URL to icon for the marker, e.g. *icon="http://maps.google.com/mapfiles/kml/pal3/icon29.png"*
* **description**: a description of the marker location (can have HTML links), e.g. *description="Lorem ipsum dolor sit amet"*
* **html**: some simple HTML to add to the info window, e.g. *`<img src='http://example.com/logo.img' />`*
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
`[flexiblemap src="http://snippets.webaware.com.au/maps/example-toronto.kml" width="100%" height="400px"]`

= Attributes for all maps =

* **width**: width in pixels or valid CSS units, e.g. *width="100%"*
* **height**: height in pixels or valid CSS units, e.g. *height="400px"*
* **id**: the CSS id of the container div (instead of a random generated unique ID), e.g. *id="my_map"*
* **zoom**: zoom level as an integer, larger is closer, e.g. *zoom="16"*
* **maptype**: type of map to show, from [roadmap, satellite, hybrid, terrain], e.g. *maptype="satellite"*; default=roadmap
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

* **flexmap_google_maps_api_args**: filter the array of arguments that will be passed to the Google Maps API, e.g. `'v'=>'3.exp'`, `'sensor'=>'false'`
* **flexmap_google_maps_api_url**: filter the Google Maps API URL, as a string
* **flexmap_shortcode_attrs**: filter the array of shortcode attributes, e.g. change the width and height
* **flexmap_shortcode_styles**: filter the array of inline styles applied to the div wrapping the map, e.g. remove width and height so that it can be specified in the theme's stylesheets
* **flexmap_shortcode_html**: filter the generated HTML, e.g. wrap another div around it, add a link to Google Maps, add some additonal script, etc.
* **flexmap_shortcode_script**: filter the generated JavaScript

For more information and examples, see [the website](http://flexible-map.webaware.net.au/).

== Frequently Asked Questions ==

= Why do I get "The Google Maps API server rejected your request"? =

If Google Maps is telling you this:

> The Google Maps API server rejected your request. The "sensor" parameter specified in the request must be set to either "true" or "false".

then something on your website is stripping the query strings on scripts. It's probably a misguided attempt to make your website more secure, and it's a dumb idea. Some so-called "security" plugins do this, and I've heard of a theme doing it too. You need to find out what is doing it and fix it, or remove it. Start by deactivating plugins that pretend to enhance security and retest, then try switching your theme to twentytwelve to see if the theme is the problem.

= Where are the settings? =

There are none! You just need to add some attributes to your shortcode telling the map what to do.

Of course, in WordPress there is a plugin for everything :) so if you *want* settings, please install the [Flexible Map Options plugin](http://wordpress.org/plugins/wp-flexible-map-options/). That plugin lets you set some defaults so that if you use the same attributes over and over, you can put them all in one place.

= Can I add multiple markers to a map? =

Using a KML file, you can have as many markers on a map as you like, with as much detail in the info windows. With KML you can also change marker icons and add other nice features. You can generate your KML file from an application like Google Earth, or you can create it yourself (in a text editor or with your own programming). [Learn more about KML](https://developers.google.com/kml/).

= Why won't my KML map update when I edit the KML file? =

Google Maps API caches the KML file, so it can take a while for your new changes to appear. To force a change, append a URL query parameter with a number (known as a cache buster) and increment the number each time you change the KML file. A nice simple and commonly used parameter name is v (for version), like this: http://example.com/my-map.kml?v=2

If your map is auto-generated or changes frequently, add the `kmlcache` attribute to ask Google to fetch a new copy periodically. You can specify the interval in minutes (e.g. "90 minutes"), hours (e.g. "2 hours"), or days (e.g. "1 day"). The minimum interval is 5 minutes.

`[flexiblemap src="http://snippets.webaware.com.au/maps/example-toronto.kml?v=2"]
[flexiblemap src="http://snippets.webaware.com.au/maps/example-toronto.kml" kmlcache="8 hours"]`

= What parts of KML are supported? =

The Google Maps API supports many commonly used KML elements, but has some restrictions. Read about [Google Maps support for KML](https://developers.google.com/kml/documentation/mapsSupport) in the developers' guide, and also see the list of [KML elements supported in Google Maps](https://developers.google.com/kml/documentation/kmlelementsinmaps).

= Why won't the map show my place when I use the address attribute? =

When you use a street address instead of centre coordinates, you are effectively searching Google Maps for your location. Try being very specific about your address, including your town / city, state / province, and country to make sure Google can find where you mean. You can also specify your region with the `region` attribute to help Google Maps refine its search. If the marker is still in the wrong place, you might need to specify the location using centre coordinates instead.

= How can I use centre coordinates for the map and have directions to my address? =

When you use just centre coordinates for your map, the directions may send people to the location *opposite* your location! Yes, I know... anyway, if you specify both the centre coordinates and the street address, the map will be centred correctly and the directions will be to your address.

= How do I get the maps to use my language? =

The plugin uses localised messages for things like the Directions link and the default message on links in info windows. If you have your [WordPress installation set to use your language](http://codex.wordpress.org/WordPress_in_Your_Language), the plugin should automatically pick it up. If you need to force it to pick up your language (or want to offer a different language), use the `locale` attribute, e.g. `locale="ru"` or `locale="zh-TW"`.

Google Maps will use the locale information from your web browser to help display maps and directions in your language (see your browser's language settings). If you want to force the Google Maps language for every map on a page, you can use a filter hook. For example, here's how to force the Google Maps language to match the language of the page / post its on (e.g. when using WPML translated content):

`add_filter('flexmap_google_maps_api_args', 'force_flexmap_map_language');

function force_flexmap_map_language($args) {
	$args['language'] = get_locale();
	return $args;
}`

= You've translated my language badly / it's missing =

The initial translations were made using Google Translate, so it's likely that some will be truly awful! Please help by editing the .js file for your language in the i18n folder, and tell me about it in the [support forum](http://wordpress.org/support/plugin/wp-flexible-map).

= The map is broken in jQuery UI tabs =

When you hide the map in a tab, and then click on the tab to reveal its contents, the map doesn't know how big to draw until it is revealed. You need to give Google Maps a nudge so that it will pick up the correct size and position when you reveal it. Here's some sample jQuery code to do this, which you should add somewhere on the page (e.g. in your theme's footer):

`<script>
jQuery(function($) {

$("body").bind("tabsactivate", function(event, ui) {
    $("#" + ui.newPanel[0].id + " div.flxmap-container").each(function() {
        var flxmap = window[this.getAttribute("data-flxmap")];
        flxmap.redrawOnce();
    });
});

});
</script>`

For jQuery versions 1.8 or older:

`<script>
jQuery(function($) {

$("body").bind("tabsshow", function(event, ui) {
    $("#" + ui.panel.id + " div.flxmap-container").each(function() {
        var flxmap = window[this.getAttribute("data-flxmap")];
        flxmap.redrawOnce();
    });
});

});
</script>`

For tabs in jQuery Tools, see [this support topic](http://wordpress.org/support/topic/tabs-map#post-3784706).

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

The plugin will detect when AJAX is being used via the [WordPress standard method](http://codex.wordpress.org/AJAX_in_Plugins), and adjust accordingly (but you still need to load the scripts as above). If another method is used, add `isajax='true'` to the shortcode attributes.

NB: currently, only AJAX methods that parse script tags will work correctly; this includes some [jQuery methods](http://stackoverflow.com/q/2203762/911083) (but [not all](http://stackoverflow.com/a/2699905/911083)). A future version of the plugin will be more AJAX friendly.

= I have CloudFlare Rocketscript turned on and the map doesn't work =

Either turn off CloudFlare Rocketscript :) or install the [Flxmap No Rocketscript](https://gist.github.com/webaware/8949605) plugin by loading that file into your website's wp-content/plugins folder and activating through the plugins admin page. Use the plugin if you still want Rocketscript to manage all of your other scripts but leave the Flexible Map scripts alone.

== Screenshots ==

1. `[flexiblemap center="-32.918657,151.797894" title="Nobby's Head" zoom="14" width="500" height="400" directions="true" maptype="satellite"]`
2. `[flexiblemap address="116 Beaumont Street Hamilton NSW Australia" title="Raj's Corner" description="SWMBO's favourite Indian diner" width="500" height="400" directions="true"]`
3. `[flexiblemap src="http://snippets.webaware.com.au/maps/example-toronto.kml?v=2" width="500" height="400" maptype="satellite"]`
4. `[flexiblemap center="-34.916721,138.828878" width="500" height="400" title="Adelaide Hills" directions="true" showdirections="true" directionsfrom="Adelaide"]`

== Changelog ==

= 1.7.3.1 [2014-03-22] =
* fixed: infowindow width on some Webkit browsers, and IE10/11

= 1.7.3 [2014-03-16] =
* fixed: German translation (thanks, [Carib Design](http://www.caribdesign.com/)!)
* fixed: some themes (e.g. Evolve) mess up Google Maps directions markers
* fixed: CSS for infowindows with Google Maps Visual Refresh / API v3.15
* changed: removed instructions page, better handled by new homepage for plugin
* changed: bump version of Google Maps API to 3.15
* added: KML cache buster attribute `kmlcache`, for dynamically created KML maps
* added: WordPress filter `flexmap_shortcode_script`
* removed: `visualrefresh` attribute doesn't do anything any more (Google Maps API has adopted Visual Refresh as standard)

= 1.7.2 [2014-01-01] =
* fixed: Spanish translation (thanks, [edurramos](http://profiles.wordpress.org/edurramos/)!)
* fixed: clean up JSHint warnings
* changed: Slovenian translation refresh from Google Translate (human translators wanted!)
* changed: plugin homepage, better documentation and examples, will develop as time permits!

= 1.7.1 [2013-10-13] =
* fixed: Google link was showing marker at centre, not at marker location when marker != centre

= 1.7.0 [2013-10-12] =
* fixed: Greek translation (thanks, [Pantelis Orfanos](http://profiles.wordpress.org/ironwiller/)!)
* fixed: Dutch translation (thanks, [Ivan Beemster](http://www.lijndiensten.com/)!)
* fixed: KML map zoom sometimes doesn't happen on first page visit
* fixed: some themes (e.g. twentythirteen) mess up Google Maps directions markers
* fixed: Google link opens maps without marker (NB: <= IE8 not supported)
* added: `dirshowsteps` attribute, to allow directions steps (i.e. turn-by-turn steps) to be turned off
* added: `dirshowssearch` attribute, to allow directions search form to be turned off
* added: `zoomstyle` attribute, to allow large or small zoom controls
* added: `visualrefresh` attribute, to enable [visual refresh](https://developers.google.com/maps/documentation/javascript/basics#VisualRefresh) for all maps on the page
* added: default CSS sets info window text color to #333
* changed: bump version of Google Maps API to 3.13

= 1.6.5 [2013-07-19] =
* fixed: stop twentythirteen theme stuffing up Google Maps infowindows with its too-promiscuous box-sizing rules
* added: `dirdraggable` and `dirnomarkers` attributes

= 1.6.4 [2013-06-14] =
* fixed: can set directions=false and showdirections=true
* fixed: space before colon in fr translation (thanks, [mister klucha](http://wordpress.org/support/profile/mister-klucha)!)
* added: load unminified script if SCRIPT_DEBUG is defined / true
* changed: clicking directions link sets focus on From: address again
* changed: bump version of Google Maps API to 3.12

= 1.6.3 [2013-03-14] =
* fixed: HTML description now works for address-based maps (thanks, [John Sundberg](http://profiles.wordpress.org/bhwebworks/)!)

= 1.6.2 [2013-03-04] =
* fixed: CSS fix for themes that muck up Google Maps images by specifying background colour on images without being selective
* added: icon attribute to set marker icon on centre / address maps

= 1.6.1 [2013-01-29] =
* fixed: infowindow auto-pans on load, to prevent the top of the bubble being cropped
* added: WordPress filter `flexmap_google_maps_api_args` for filtering array of arguments before building Google Maps API URL
* added: function flexmap_show_map() accepts an attribute "echo", and returns a string without output to screen when "echo"=>"false"
* changed: all scripts now loaded through wp_enqueue_scripts, including language scripts (thanks to a [tip from toscho](http://wordpress.stackexchange.com/a/38335/24260))
* changed: bump version of Google Maps API to 3.11

= 1.6.0 [2012-12-30] =
* added: themes can call function flexmap_load_scripts() to force load of scripts, e.g. on single-page AJAX websites
* added: can add HTML block to infowindow, e.g. images
* fixed: no auto-focus on directions search field, thus no auto-scroll page to last directions search field!

= 1.5.3 [2012-11-30] =
* fixed: when attributes showdirections or directionsfrom were specified, but not directions, the directions panel was not added to page and a JavaScript error was generated
* changed: bump version of Google Maps API to 3.10

= 1.5.2 [2012-10-12] =
* fixed: KML maps broken; KMLLayer status_changed event unreliable, use defaultviewport_changed event instead (possible Google Maps API change)

= 1.5.1 [2012-09-30] =
* changed: tighten up FlexibleMap API to keep private members private (in case they change later)

= 1.5.0 [2012-09-29] =
* added: new shortcode attribute "id" which will be used for the container div, instead of the random unique div id
* added: FlexibleMap object is accessible via global variable with name derived from container div id (e.g. if you need to access the Google Maps map object in your own scripts)
* added: redraw() and redrawOnce() methods, for when the map needs to be redrawn correctly (e.g. when initially hidden then revealed)
* added: KML maps support directions (sponsored by [Roger Los](http://www.rogerlos.com/) -- thanks!)

= 1.4.1 [2012-09-11] =
* fixed: targetfix was not stopping KML marker links opening in new window/tab since Google Maps API 3.9

= 1.4.0 [2012-08-22] =
* changed: bump version of Google Maps API to 3.9
* added: allow CSS units in ch, rem, vh, vw, vmin, vmax

= 1.3.1 [2012-07-13] =
* fixed: width/height in digits (no units) defaults to pixels (sorry folks, I thought I tested that, but missed it somehow!)

= 1.3.0 [2012-07-12] =
* fixed: Norwegian translation had incorrect file name
* fixed: Malaysian translation had incorrect index (was overwriting Macedonian translation)
* added: filters so that theme and plugin developers can modify the behaviour of this plugin
* added: width and height can be any valid CSS units, not just pixels

= 1.2.0 [2012-06-29] =
* added: option showdirections, to show the directions search when the map loads
* added: option directionsfrom, to set the default from: location, and immediately search for directions when showdirections is set

= 1.1.2 [2012-05-20] =
* fixed: some themes set box-shadow on all images, now forceably fixed for Google Maps images
* added: option to control whether links on KML maps open in new window

= 1.1.1 [2012-04-15] =
* fixed: instructions updated to reflect recent changes

= 1.1.0 [2012-04-15] =
* added: locale-specific messages (using translations from Google Translate) e.g. Directions link
* wanted: translators to help me add new translations, and clean up the messages I got from Google Translate!
* fixed: use region to help refine street address searches

= 1.0.6 [2012-04-06] =
* fixed: use plugin_dir_url() to get url base, and protocol-relative url to load Google Maps API (SSL compatible)

= 1.0.5 [2012-03-17] =
* fixed: CSS fixes for themes that muck up Google Maps images (e.g. twentyeleven)
* added: infowindow styles now in enqueued stylesheet

= 1.0.4 [2012-03-06] =
* fixed: use LatLng methods to access latitude/longitude, instead of (ever changing) Google Maps API private members
* added: tooltip on markers in non-KML maps
* added: options to disable pan control, zoom control, drag to pan, double-click to zoom

= 1.0.3 [2012-02-27] =
* fixed: address query updated to work with Google Maps v3.8 (so using address for centre marker works again)
* fixed: tied Google Maps API to v3.8 so newer versions don't break plugin, and will keep updated as API changes

= 1.0.2 [2012-02-04] =
* added: address attribute as alternative to center coordinates
* added: use address attribute for directions, if given (so that directions match address)
* changed: readme improved a little
* changed: refactored code for DRY (don't repeat yourself)

= 1.0.1 [2012-01-26] =
* fixed: directions bugs in JavaScript for Opera, IE

= 1.0.0 [2012-01-08] =
* final cleanup for public release
