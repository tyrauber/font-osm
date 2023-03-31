# font-osm

[OpenStreetMap (OSM)](https://www.openstreetmap.org/) is an open source, community maintained geospatial database. Nodes, Ways and Relations are tagged by the community with 3000+ unique tags as indexed by [OpenStreetMap TagInfo](https://taginfo.openstreetmap.org/). Font-Awesome is amazing collection of 1000+ clean high quality SVG icons licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/) (Public Domain) and also available as [icon font](https://github.com/gmgeo/osmic/tree/master/font).

`font-osm` is a Javascript utility for quickly returning an appropriate Font-Awesome 6 Icon for any given Open Street Map Tag.

|OSM Tag|Font-Awesome Icon|Unicode|
|-----|-----|-----|
|amenity|fa-circle|f111|
|craft|fa-palette|f53f|
|historic|fa-landmark|f66f|
|leisure|fa-umbrella-beach|f5ca|
|office|fa-building|f1ad|
|shop|fa-shopping-bag|f290|
|sport|fa-football-ball|f44e|
|tourism|fa-suitcase-rolling|f5c1|


The library is literally just an exported Javascript class mapping OSM Tag to Font-Awesome Unicode, which can be used to quickly convert an OSM Tag to a Font-Awesome Icon unicode string.

### Usage

Import FontOSM:

```
  <script src="/dist/index.js"></script>
```

If your OSM features have a property with the OSM tag, for example `pmap:tag`, you can use MapLibre GLS to get the property and use it as a key on F 

```
  "layout": {
    'text-field': ['get', ['get', 'pmap:tag'], ['literal', FontOSM]],
    'icon-optional': true,
    'text-font': ['Font-Awesome'],
    'text-size': 18
  },
```

Please see the [example](./example) for a working implementation.

### Example

The example demonstrates the use of 3 open source projects:

- [maplibre-gl-js](https://github.com/maplibre/maplibre-gl-js) for map rendering
- [protomaps/basemaps](https://github.com/protomaps/basemaps) provides the MapLibre GL JS theme and planetiler build profile
- [planetiler](https://github.com/onthegomap/planetiler) to download and convert OSM files to pmtiles

A customized planetiler/pmtiles baselayer was used to generate the amenity layer and add the `pmap:tag` property to the amenity features.

### Built by ChatGTP

The core data source is a csv containing the `OSM Tag`, `Font-Awesome 6 Icon Name` and `Unicode String`. It was created with the following ChatGTP prompt:

```
Please create a table correlating Open Street Map Tags with the most appropriate Font-Awesome 6 Icons and Unicode String.
```

Queries were done in batches, results formatted and checked against the source tags.  Some associations my not be entirely accurate or perfect, either because:

- the tag is too abstract
- font-awesome doesn't contain an appropriate tag
- or there were too many options for ChatGTP to chose from
- or not enough data to choose correctly.

Nobodies perfect.

### Corrections

Edit `/src/index.csv` and run `yarn build` to regenerate the compiled library. Pull requests are welcome.