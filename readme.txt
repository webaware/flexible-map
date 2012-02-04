=== WP Flexible Map ===
Contributors: webaware
Plugin Name: WP Flexible Map
Plugin URI: http://snippets.webaware.com.au/wordpress-plugins/wp-flexible-map/
Author URI: http://www.webaware.com.au/
Tags: google, maps, shortcode, kml
Requires at least: 3.0.1
Tested up to: 3.3.1
Stable tag: 1.0.2

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

= Parameters for centre coordinates or street address map =

Either the center or the address paramater is required. If you provide both, the centre coordinates will be used for the map centre, but directions will use the street address. (This will prevent directions from telling people how to get to the destination opposite yours!)

* **width**: width in pixels, e.g. *width="500"*
* **height**: height in pixels, e.g. *height="400"*
* **center**: coordinates of centre in latitude,longitude, e.g. *center="-34.916721,138.828878"*
* **address**: street address of map centre, e.g. *address="116 Beaumont Street Hamilton NSW Australia"*
* **marker**: coordinates of the marker if different from the centre, in latitude,longitude, e.g. *marker="-34.916721,138.828878"*
* **title**: title of the marker, displayed in a text bubble, e.g. *title="Adelaide Hills"*
* **link**: URL to link from the marker title, e.g. *link="http://example.com/"*
* **description**: a description of the marker location (can have HTML links), e.g. *description="Lorem ipsum dolor sit amet"*
* **directions**: show directions link in text bubble; by default, directions will be displayed underneath map, but you can specify the element ID for directions here.
* **zoom**: zoom level as an integer, larger is closer, e.g. *zoom="16"*
* **maptype**: type of map to show, from [roadmap, satellite], e.g. *maptype="roadmap"*
* **hideMapType**: hide the map type controls, from [true, false], e.g. *hideMapType="true"*

*Samples*:
`[flexiblemap center="-34.916721,138.828878" width="500" height="400" zoom="9" title="Adelaide Hills" description="The Adelaide Hills are repleat with wineries."]
[flexiblemap address="116 Beaumont Street Hamilton NSW Australia" width="500" height="400" directions="true"]
[flexiblemap center="-34.916721,138.828878" width="500" height="400" title="Adelaide Hills" directions="true"]
[flexiblemap center="-34.916721,138.828878" width="500" height="400" title="Adelaide Hills" directions="my-dir-div"]`

= Parameters for KML map =

* **width**: width in pixels, e.g. *width="500"*
* **height**: height in pixels, e.g. *height="400"*
* **src**: the URL for a KML file to load map details from, e.g. *src="http://example.com/map.kml"*
* **zoom**: zoom level as an integer, larger is closer, e.g. *zoom="16"*
* **maptype**: type of map to show, from [roadmap, satellite], e.g. *maptype="roadmap"*
* **hideMapType**: hide the map type controls, from [true, false], e.g. *hideMapType="true"*

*Sample*:
`[flexiblemap src="http://code.google.com/apis/kml/documentation/KML_Samples.kml" width="500" height="400"]`

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
));`

== Frequently Asked Questions ==

= Can I add multiple markers to a map? =

Using a KML file, you can have as many markers on a map as you like, with as much detail in the info windows. With KML you can also change marker icons and add other nice features. You can create your KML file in an application like Google Earth, or you can create it yourself (in a text editor or with your own programming). [Learn more about KML](http://code.google.com/apis/kml/).

= Why won't the map show my place when I use the address parameter? =

When you use a street address instead of centre coordinates, you are effectively searching Google Maps for your location. Try being very specific about your address, including your town / city, state / province, and country to make sure Google can find where you mean. If the marker is still in the wrong place, you might need to specify the location using centre coordinates instead.

= How can I use centre coordinates for the map and have directions to my address? =

When you use just centre coordinates for your map, the directions may send people to the location *opposite* your location! Yes, I know... anyway, if you specify both the centre coordinates and the street address, the map will be centred correctly and the directions will be to your address.

== Changelog ==

= 1.0.2 [2012-02-04] =
* added: address parameter as alternative to center coordinates
* added: use address parameter for directions, if given (so that directions match address)
* changed: readme improved a little
* changed: refactored code for DRY (don't repeat yourself)

= 1.0.1 [2012-01-26] =
* fixed: directions bugs in JavaScript for Opera, IE

= 1.0.0 [2012-01-08] =
* final cleanup for public release
