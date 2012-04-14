=== WP Flexible Map ===
Contributors: webaware
Plugin Name: WP Flexible Map
Plugin URI: http://snippets.webaware.com.au/wordpress-plugins/wp-flexible-map/
Author URI: http://www.webaware.com.au/
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=6ZCY9PST8E4GQ
Tags: google, maps, shortcode, kml
Requires at least: 3.0.1
Tested up to: 3.3.1
Stable tag: 1.1.0

Embed Google Maps in pages and posts, either by centre coodinates or street address, or by URL to a Google Earth KML file.

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
* map marker doesn't have to be the centre of the map
* optional description for info window
* optional directions link for info window
* directions can be dropped into any div element with an ID

Click to see [WP Flexible Map in action](http://snippets.webaware.com.au/wordpress-plugins/wp-flexible-map/).

== Installation ==

1. Upload this plugin to your /wp-content/plugins/ directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Add the shortcode [flexiblemap] to your pages / posts to embed maps

There are two ways to load maps with this plugin:

* specify the map's coordinates or street address
* specify the URL to a KML file (e.g. from Google Earth)

To add a Flexible Map to a post or a page, add a shortcode [flexiblemap] and give it some useful parameters. A map can either be specified using centre coordinates or street address, or by loading a KML file.

= Parameters for all maps =

* **width**: width in pixels, e.g. *width="500"*
* **height**: height in pixels, e.g. *height="400"*
* **zoom**: zoom level as an integer, larger is closer, e.g. *zoom="16"*
* **maptype**: type of map to show, from [roadmap, satellite], e.g. *maptype="roadmap"*; default=roadmap
* **hidemaptype**: hide the map type controls, from [true, false], e.g. *hidemaptype="true"*; default=false
* **hidepanning**: hide the panning controls, from [true, false], e.g. *hidepanning="true"*; default=true
* **hidezooming**: hide the zoom controls, from [true, false], e.g. *hidezooming="true"*; default=false
* **hidestreetview**: hide the street view control, from [true, false], e.g. *hidestreetview="true"*; default=true
* **hidescale**: hide the map scale, from [true, false], e.g. *hidescale="true"*; default=true
* **scrollwheel**: enable zoom with mouse scroll wheel, from [true, false], e.g. *scrollwheel="true"*; default=false
* **draggable**: enable dragging to pan, from [true, false], e.g. *draggable="true"*; default=true
* **dblclickzoom**: enable double-clicking to zoom, from [true, false], e.g. *dblclickzoom="true"*; default=true

= Additional parameters for centre coordinates or street address map =

Either the center or the address paramater is required. If you provide both, the centre coordinates will be used for the map centre, but directions will use the street address. (This will prevent directions from telling people how to get to the destination opposite yours!)

* **center**: coordinates of centre in latitude,longitude, e.g. *center="-34.916721,138.828878"*
* **address**: street address of map centre, e.g. *address="116 Beaumont Street Hamilton NSW Australia"*
* **marker**: coordinates of the marker if different from the centre, in latitude,longitude, e.g. *marker="-34.916721,138.828878"*
* **title**: title of the marker, displayed in a text bubble, e.g. *title="Adelaide Hills"*
* **link**: URL to link from the marker title, e.g. *link="http://example.com/"*
* **description**: a description of the marker location (can have HTML links), e.g. *description="Lorem ipsum dolor sit amet"*
* **directions**: show directions link in text bubble; by default, directions will be displayed underneath map, but you can specify the element ID for directions here.
* **showinfo**: show the marker's info window when the map loads, from [true, false], e.g. *showinfo="true"*; default=true
* **locale**: use a specific locale (language) for messages like the text of the Directions link, e.g. *locale="nl-BE"*
* **region**: specify region to help localise address searches for street address map and directions, taken from the list of [ccTLD](http://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Country_code_top-level_domains) (without the .), e.g. *region="au"*

*Samples*:
`[flexiblemap center="-34.916721,138.828878" width="500" height="400" zoom="9" title="Adelaide Hills" description="The Adelaide Hills are repleat with wineries."]
[flexiblemap address="116 Beaumont Street Hamilton NSW Australia" width="500" height="400" directions="true"]
[flexiblemap center="-34.916721,138.828878" width="500" height="400" title="Adelaide Hills" directions="true"]
[flexiblemap center="-34.916721,138.828878" width="500" height="400" title="Adelaide Hills" directions="my-dir-div"]`

= Additional parameters for KML map =

* **src**: the URL for a KML file to load map details from, e.g. *src="http://example.com/map.kml"*

*Sample*:
`[flexiblemap src="http://snippets.webaware.com.au/maps/example-toronto.kml" width="500" height="400"]`

= Calling from templates or plugins =

There is a PHP function `flexmap_show_map()` for theme and plugin developers. All of the same parameters for the shortcode can be passed to the function in an associative array.

*Sample*:
`flexmap_show_map(array(
  'center' => '-34.916721,138.828878',
  'width' => 500,
  'height' => 400,
  'zoom' => 12,
  'title' => 'Adelaide Hills',
  'description' => 'The Adelaide Hills are repleat with wineries.',
  'directions' => 'my-dir-div',
  'hidepanning' => 'false',
  'hidescale' => 'false',
  'maptype' => 'satellite',
));`

== Frequently Asked Questions ==

= Can I add multiple markers to a map? =

Using a KML file, you can have as many markers on a map as you like, with as much detail in the info windows. With KML you can also change marker icons and add other nice features. You can generate your KML file from an application like Google Earth, or you can create it yourself (in a text editor or with your own programming). [Learn more about KML](https://developers.google.com/kml/).

= Why won't my KML map update when I edit the KML file? =

Google Maps API caches the KML file, so it often won't get your new changes. To force a change, append a URL query parameter with a number and increment the number each time you change the KML file. A nice simple and commonly used parameter name is v (for version), like this: .../my-map.kml?v=2

= Why won't the map show my place when I use the address parameter? =

When you use a street address instead of centre coordinates, you are effectively searching Google Maps for your location. Try being very specific about your address, including your town / city, state / province, and country to make sure Google can find where you mean. You can also specify your region with the `region` parameter to help Google Maps refine its search. If the marker is still in the wrong place, you might need to specify the location using centre coordinates instead.

= How can I use centre coordinates for the map and have directions to my address? =

When you use just centre coordinates for your map, the directions may send people to the location *opposite* your location! Yes, I know... anyway, if you specify both the centre coordinates and the street address, the map will be centred correctly and the directions will be to your address.

= How do I get the maps to use my language? =

Since version 1.1.0, this plugin now uses localised messages for things like the Directions link and the default message on links in info windows. If you have your [WordPress installation set to use your language](http://codex.wordpress.org/WordPress_in_Your_Language), the plugin should automatically pick it up. If you need to force it to pick up your language (or want to offer a different language), use the `locale` parameter, e.g. `locale="ru"` or `locale="zh-TW"`. Google Maps will use the locale information from your web browser to help display maps in your language (see your browser's language settings).

== Changelog ==

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
* added: address parameter as alternative to center coordinates
* added: use address parameter for directions, if given (so that directions match address)
* changed: readme improved a little
* changed: refactored code for DRY (don't repeat yourself)

= 1.0.1 [2012-01-26] =
* fixed: directions bugs in JavaScript for Opera, IE

= 1.0.0 [2012-01-08] =
* final cleanup for public release
