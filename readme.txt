=== WP Flexible Map ===
Contributors: webaware
Plugin Name: WP Flexible Map
Plugin URI: http://snippets.webaware.com.au/wordpress-plugins/wp-flexible-map/
Author URI: http://www.webaware.com.au/
Tags: google, maps, shortcode, kml
Requires at least: 3.0.1
Tested up to: 3.3.1
Stable tag: 1.0.1

Flexible map using Google Maps, for displaying a map specified by centre coodinates or by Google Earth KML file.

== Description ==

Flexible Map allows you to add Google Maps to your WordPress website.

**Features:**

* specify map by centre coordinates
* load map from Google Earth KML file
* no special Google Maps key is required -- uses the latest stable Google Maps API
* simple shortcode for adding maps to pages/posts
* PHP function `flexmap_show_map()` for theme and plugin developers
* supports multiple maps on a page/post
* map marker doesn't have to be the centre of the map
* optional description for info window
* optional directions link for info window
* directions can be dropped into any div element with an ID

== Installation ==

To add a Flexible Map to a post or a page, add a shortcode [flexiblemap] and give it some useful parameters. A map can either be specified using centre coordinates, or by loading a KML file.

**Parameters for centre coordinates map:**

* *width*
 * width in pixels, e.g. *width="500"*
* *height*
 * height in pixels, e.g. *height="400"*
* *center*
 * coordinates of centre in latitude,longitude, e.g. *center="-34.916721,138.828878"*
* *marker*
 * coordinates of the marker if different from the centre, in latitude,longitude, e.g. *marker="-34.916721,138.828878"*
* *title*
 * title of the marker, displayed in a text bubble, e.g. *title="Adelaide Hills"*
* *link*
 * URL to link from the marker title, e.g. *link="http://example.com/"*
* *description*
 * a description of the marker location (can have HTML links), e.g. *description="Lorem ipsum dolor sit amet"*
* *directions*
 * show directions link in text bubble; by default, directions will be displayed underneath map, but you can specify the element ID for directions here.
* *zoom*
 * zoom level as an integer, larger is closer, e.g. *zoom="16"*
* *maptype*
 * type of map to show, from [roadmap, satellite], e.g. *maptype="roadmap"*
* *hideMapType*
 * hide the map type controls, from [true, false], e.g. *hideMapType="true"*

*Samples*:
`[flexiblemap center="-34.916721,138.828878" width="500" height="400" zoom="9" title="Adelaide Hills" description="The Adelaide Hills are repleat with wineries."]
[flexiblemap center="-34.916721,138.828878" width="500" height="400" title="Adelaide Hills" directions="true"]
[flexiblemap center="-34.916721,138.828878" width="500" height="400" title="Adelaide Hills" directions="my-dir-div"]`

**Parameters for KML map:**

* *width*
 * width in pixels, e.g. *width="500"*
* *height*
 * height in pixels, e.g. *height="400"*
* *src*
 * URL for KML file to load map details from, e.g. *src="http://example.com/map.kml"*
* *zoom*
 * zoom level as an integer, larger is closer, e.g. *zoom="16"*
* *maptype*
 * type of map to show, from [roadmap, satellite], e.g. *maptype="roadmap"*
* *hideMapType*
 * hide the map type controls, from [true, false], e.g. *hideMapType="true"*

*Sample*:
`[flexiblemap src="http://code.google.com/apis/kml/documentation/KML_Samples.kml" width="500" height="400"]`

**Calling from templates or plugins**

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

== Changelog ==

= 1.0.1 [2012-01-26] =
* fix directions bugs in JavaScript for Opera, IE

= 1.0.0 [2012-01-08] =
* final cleanup for public release
